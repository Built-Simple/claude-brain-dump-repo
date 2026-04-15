# ReviewMaster Multi-Location Support Implementation Plan

**Option A: Single Google Account with Multiple Business Locations**

**Created:** April 14, 2026
**Status:** Planning
**Estimated Effort:** 2-3 days (Medium)
**Risk Level:** Low-Medium

---

## Executive Summary

This plan enables a single ReviewMaster user to manage multiple Google Business Profile locations from one Google account. This is the most common scenario - a business owner with multiple locations (like Legion Sports Bar expanding to a second location) connected to the same Google account.

**Key Changes:**
1. Remove the `unique=True` constraint on `user_id` in `GoogleBusinessConnection`
2. Create a new `BusinessLocation` table to track multiple locations
3. Modify OAuth flow to store all locations, not just the first one
4. Update sync workers to iterate through all locations
5. Link reviews to specific locations via `location_id` foreign key

---

## Current Architecture (Problems)

### Database Models

**GoogleBusinessConnection** - One connection per user (unique constraint)
```python
# CURRENT: /opt/reviewmaster/backend/database.py:455-495
class GoogleBusinessConnection(Base):
    __tablename__ = "google_business_connections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)  # <-- BLOCKER

    # Only stores ONE location
    account_name = Column(String(255))   # e.g., "accounts/123"
    location_name = Column(String(255))  # e.g., "locations/456"  <-- SINGLE LOCATION
    business_name = Column(String(255))  # <-- SINGLE NAME

    # Autopilot is per-connection (meaning per-user, meaning one set of settings for all locations)
    auto_respond_enabled = Column(Boolean, default=False)
    auto_respond_delay_minutes = Column(Integer, default=30)
    auto_respond_min_rating = Column(Integer, default=1)
```

**GoogleReviewCache** - Linked to user_id, location stored as text
```python
# CURRENT: /opt/reviewmaster/backend/database.py:498-535
class GoogleReviewCache(Base):
    __tablename__ = "google_review_cache"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    google_review_id = Column(String(255), nullable=False)
    location_name = Column(String(255), nullable=True)  # Text field, NOT a FK
```

**BusinessProfile** - Also unique per user
```python
# CURRENT: /opt/reviewmaster/backend/database.py:195-245
class BusinessProfile(Base):
    __tablename__ = "business_profiles"

    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)  # <-- ALSO UNIQUE
```

### OAuth Flow

**google_oauth.py callback** - Takes first location only
```python
# CURRENT: /opt/reviewmaster/backend/routes/google_oauth.py:95-110
if locations:
    location = locations[0]  # TAKES FIRST ONLY
    location_name = location.get("name")
```

**select-location endpoint** - Overwrites instead of adding
```python
# CURRENT: /opt/reviewmaster/backend/routes/google_oauth.py:140-160
@router.post("/select-location")
async def select_business_location(location_name: str, business_name: str, ...):
    connection.location_name = location_name  # OVERWRITES
    connection.business_name = business_name  # OVERWRITES
```

### Services

**GoogleReviewsService.fetch_reviews()** - Uses single location from connection
```python
# CURRENT: /opt/reviewmaster/backend/services/google_reviews_service.py:45-60
connection = self.db.query(GoogleBusinessConnection).filter_by(
    user_id=user_id,
    is_active=True
).first()  # Only gets ONE connection

# Uses single location_name
reviews_url = f".../{connection.account_name}/{connection.location_name}/reviews"
```

**AutopilotWorker** - Processes single connection per user
```python
# CURRENT: /opt/reviewmaster/backend/services/autopilot_worker.py:70-85
connections = db.query(GoogleBusinessConnection).filter(
    GoogleBusinessConnection.auto_respond_enabled == True,
    # Only one connection per user, so this works
)
```

---

## Target Architecture

### New Database Schema

```sql
-- Keep GoogleBusinessConnection for OAuth tokens (one per Google account)
ALTER TABLE google_business_connections
    DROP CONSTRAINT google_business_connections_user_id_key;  -- Remove unique

-- Add columns for multi-account support (future Option B)
ALTER TABLE google_business_connections ADD COLUMN connection_name VARCHAR(100);

-- New table: BusinessLocation (one per business location)
CREATE TABLE business_locations (
    id SERIAL PRIMARY KEY,
    connection_id INTEGER NOT NULL REFERENCES google_business_connections(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),

    -- Google identifiers
    google_location_name VARCHAR(255) NOT NULL,  -- "locations/123456789"
    google_place_id VARCHAR(255),

    -- Display info
    business_name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    phone VARCHAR(50),

    -- Autopilot settings (per-location)
    auto_respond_enabled BOOLEAN DEFAULT FALSE,
    auto_respond_delay_minutes INTEGER DEFAULT 30,
    auto_respond_min_rating INTEGER DEFAULT 1,
    auto_respond_last_run TIMESTAMP,

    -- Sync tracking
    last_sync_at TIMESTAMP,
    last_error TEXT,
    is_active BOOLEAN DEFAULT TRUE,

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(connection_id, google_location_name)
);

-- Update GoogleReviewCache to link to location
ALTER TABLE google_review_cache ADD COLUMN location_id INTEGER REFERENCES business_locations(id);
CREATE INDEX idx_review_cache_location ON google_review_cache(location_id);

-- Update BusinessProfile to support per-location profiles (optional)
ALTER TABLE business_profiles DROP CONSTRAINT business_profiles_user_id_key;
ALTER TABLE business_profiles ADD COLUMN location_id INTEGER REFERENCES business_locations(id);
CREATE INDEX idx_business_profile_location ON business_profiles(location_id);
```

### Updated Models

```python
# NEW: /opt/reviewmaster/backend/database.py

class GoogleBusinessConnection(Base):
    """
    Google Business Profile OAuth connection.
    Now supports multiple connections per user (for future Option B).
    Each connection stores OAuth tokens for one Google account.
    """
    __tablename__ = "google_business_connections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    # REMOVED: unique=True

    # Connection identifier (for multi-account support)
    connection_name = Column(String(100), nullable=True)  # "Main Account", "Second Business"

    # Google account info
    google_email = Column(String(255), nullable=True)
    google_account_id = Column(String(255), nullable=True)

    # OAuth tokens (encrypted)
    access_token_encrypted = Column(Text, nullable=True)
    refresh_token_encrypted = Column(Text, nullable=True)
    token_expires_at = Column(DateTime, nullable=True)

    # Google Business Profile account (NOT location)
    account_name = Column(String(255), nullable=True)  # "accounts/123"

    # Connection status
    is_active = Column(Boolean, default=True)
    last_error = Column(Text, nullable=True)

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", backref="google_connections")
    locations = relationship("BusinessLocation", back_populates="connection", cascade="all, delete-orphan")


class BusinessLocation(Base):
    """
    Individual business location under a Google Business Connection.
    One Google account can have multiple locations.
    Each location has its own autopilot settings and sync state.
    """
    __tablename__ = "business_locations"
    __table_args__ = (
        UniqueConstraint('connection_id', 'google_location_name', name='uq_connection_location'),
    )

    id = Column(Integer, primary_key=True, index=True)
    connection_id = Column(Integer, ForeignKey("google_business_connections.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # Google identifiers
    google_location_name = Column(String(255), nullable=False)  # "locations/123456789"
    google_place_id = Column(String(255), nullable=True)

    # Display info
    business_name = Column(String(255), nullable=False)
    address = Column(String(500), nullable=True)
    phone = Column(String(50), nullable=True)

    # Per-location autopilot settings
    auto_respond_enabled = Column(Boolean, default=False)
    auto_respond_delay_minutes = Column(Integer, default=30)
    auto_respond_min_rating = Column(Integer, default=1)
    auto_respond_last_run = Column(DateTime, nullable=True)

    # Sync tracking
    last_sync_at = Column(DateTime, nullable=True)
    last_error = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    connection = relationship("GoogleBusinessConnection", back_populates="locations")
    user = relationship("User", backref="business_locations")
    reviews = relationship("GoogleReviewCache", back_populates="location")
    profile = relationship("BusinessProfile", back_populates="location", uselist=False)


class GoogleReviewCache(Base):
    """Updated to link to specific location"""
    __tablename__ = "google_review_cache"
    __table_args__ = (
        Index('idx_google_review_location', 'location_id', 'google_review_id'),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    location_id = Column(Integer, ForeignKey("business_locations.id"), nullable=True, index=True)  # NEW

    # ... rest unchanged

    # Relationships
    location = relationship("BusinessLocation", back_populates="reviews")


class BusinessProfile(Base):
    """Updated to support per-location profiles"""
    __tablename__ = "business_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    location_id = Column(Integer, ForeignKey("business_locations.id"), nullable=True, index=True)  # NEW
    # REMOVED: unique=True on user_id

    # ... rest unchanged

    # Relationships
    location = relationship("BusinessLocation", back_populates="profile")
```

---

## Implementation Tasks

### Phase 1: Database Migration (30 min)

**File:** Create new Alembic migration

```python
# alembic/versions/xxxx_add_multi_location_support.py

def upgrade():
    # 1. Remove unique constraint from GoogleBusinessConnection.user_id
    op.drop_constraint('google_business_connections_user_id_key', 'google_business_connections', type_='unique')

    # 2. Add connection_name column
    op.add_column('google_business_connections', sa.Column('connection_name', sa.String(100), nullable=True))

    # 3. Create business_locations table
    op.create_table('business_locations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('connection_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('google_location_name', sa.String(255), nullable=False),
        sa.Column('google_place_id', sa.String(255), nullable=True),
        sa.Column('business_name', sa.String(255), nullable=False),
        sa.Column('address', sa.String(500), nullable=True),
        sa.Column('phone', sa.String(50), nullable=True),
        sa.Column('auto_respond_enabled', sa.Boolean(), default=False),
        sa.Column('auto_respond_delay_minutes', sa.Integer(), default=30),
        sa.Column('auto_respond_min_rating', sa.Integer(), default=1),
        sa.Column('auto_respond_last_run', sa.DateTime(), nullable=True),
        sa.Column('last_sync_at', sa.DateTime(), nullable=True),
        sa.Column('last_error', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), default=datetime.utcnow),
        sa.Column('updated_at', sa.DateTime(), default=datetime.utcnow),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['connection_id'], ['google_business_connections.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.UniqueConstraint('connection_id', 'google_location_name', name='uq_connection_location')
    )
    op.create_index('idx_business_locations_user', 'business_locations', ['user_id'])
    op.create_index('idx_business_locations_connection', 'business_locations', ['connection_id'])

    # 4. Add location_id to google_review_cache
    op.add_column('google_review_cache', sa.Column('location_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_review_cache_location', 'google_review_cache', 'business_locations', ['location_id'], ['id'])
    op.create_index('idx_review_cache_location', 'google_review_cache', ['location_id'])

    # 5. Update business_profiles for per-location support
    op.drop_constraint('business_profiles_user_id_key', 'business_profiles', type_='unique')
    op.add_column('business_profiles', sa.Column('location_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_business_profile_location', 'business_profiles', 'business_locations', ['location_id'], ['id'])
    op.create_index('idx_business_profile_location', 'business_profiles', ['location_id'])


def downgrade():
    # Reverse all changes
    op.drop_index('idx_business_profile_location')
    op.drop_constraint('fk_business_profile_location')
    op.drop_column('business_profiles', 'location_id')
    op.create_unique_constraint('business_profiles_user_id_key', 'business_profiles', ['user_id'])

    op.drop_index('idx_review_cache_location')
    op.drop_constraint('fk_review_cache_location')
    op.drop_column('google_review_cache', 'location_id')

    op.drop_table('business_locations')

    op.drop_column('google_business_connections', 'connection_name')
    op.create_unique_constraint('google_business_connections_user_id_key', 'google_business_connections', ['user_id'])
```

### Phase 2: Data Migration Script (30 min)

```python
# scripts/migrate_to_multi_location.py
"""
Migrate existing single-location data to new multi-location schema.
Run AFTER the Alembic migration.
"""

from backend.database import db_manager, GoogleBusinessConnection, BusinessLocation, GoogleReviewCache, BusinessProfile
from datetime import datetime

def migrate():
    with db_manager.session_scope() as db:
        # Get all existing connections
        connections = db.query(GoogleBusinessConnection).filter(
            GoogleBusinessConnection.location_name.isnot(None)
        ).all()

        for conn in connections:
            # Create BusinessLocation from existing connection data
            location = BusinessLocation(
                connection_id=conn.id,
                user_id=conn.user_id,
                google_location_name=conn.location_name,
                business_name=conn.business_name or "Unknown Business",

                # Copy autopilot settings from connection
                auto_respond_enabled=conn.auto_respond_enabled,
                auto_respond_delay_minutes=conn.auto_respond_delay_minutes,
                auto_respond_min_rating=conn.auto_respond_min_rating,
                auto_respond_last_run=conn.auto_respond_last_run,

                # Copy sync state
                last_sync_at=conn.last_sync_at,
                last_error=conn.last_error,
                is_active=conn.is_active,

                created_at=conn.created_at,
                updated_at=conn.updated_at
            )
            db.add(location)
            db.flush()  # Get location.id

            # Update reviews to link to this location
            db.query(GoogleReviewCache).filter(
                GoogleReviewCache.user_id == conn.user_id,
                GoogleReviewCache.location_name == conn.location_name
            ).update({"location_id": location.id})

            # Link business profile to location (if exists)
            profile = db.query(BusinessProfile).filter(
                BusinessProfile.user_id == conn.user_id
            ).first()
            if profile:
                profile.location_id = location.id

            print(f"Migrated: {conn.business_name} (user {conn.user_id})")

        db.commit()
        print(f"\nMigration complete: {len(connections)} locations created")

if __name__ == "__main__":
    migrate()
```

### Phase 3: Update OAuth Flow (2 hours)

**File:** `/opt/reviewmaster/backend/routes/google_oauth.py`

```python
# UPDATE callback to store all locations, not just first

@router.get("/callback")
async def google_oauth_callback(code: str, state: str, ...):
    # ... existing token exchange code ...

    # Get all locations from the account
    locations = await fetch_all_locations(access_token, account_name)

    # Create or update connection (stores OAuth tokens only now)
    connection = db.query(GoogleBusinessConnection).filter_by(user_id=user_id).first()
    if not connection:
        connection = GoogleBusinessConnection(
            user_id=user_id,
            google_email=google_email,
            account_name=account_name,
            access_token_encrypted=encrypt_token(access_token),
            refresh_token_encrypted=encrypt_token(refresh_token),
            token_expires_at=token_expires_at,
            is_active=True
        )
        db.add(connection)
        db.flush()
    else:
        # Update existing connection tokens
        connection.access_token_encrypted = encrypt_token(access_token)
        connection.refresh_token_encrypted = encrypt_token(refresh_token)
        connection.token_expires_at = token_expires_at
        connection.google_email = google_email
        connection.account_name = account_name
        connection.is_active = True

    # Create/update BusinessLocation for each location
    for loc_data in locations:
        google_location_name = loc_data.get("name")

        existing_loc = db.query(BusinessLocation).filter_by(
            connection_id=connection.id,
            google_location_name=google_location_name
        ).first()

        if not existing_loc:
            new_loc = BusinessLocation(
                connection_id=connection.id,
                user_id=user_id,
                google_location_name=google_location_name,
                business_name=loc_data.get("title", "Unknown"),
                address=loc_data.get("storefrontAddress", {}).get("formattedAddress"),
                phone=loc_data.get("phoneNumbers", {}).get("primaryPhone"),
                is_active=True
            )
            db.add(new_loc)

    db.commit()

    # Redirect to location selection page if multiple locations
    if len(locations) > 1:
        return RedirectResponse(url=f"{frontend_url}/dashboard/google/select-locations")
    elif len(locations) == 1:
        # Auto-activate single location
        return RedirectResponse(url=f"{frontend_url}/dashboard?google_connected=true")
    else:
        return RedirectResponse(url=f"{frontend_url}/dashboard?google_error=no_locations")


# NEW endpoint: Get all locations for user
@router.get("/locations")
async def get_user_locations(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all business locations for the authenticated user"""
    locations = db.query(BusinessLocation).filter(
        BusinessLocation.user_id == user.id,
        BusinessLocation.is_active == True
    ).all()

    return {
        "locations": [
            {
                "id": loc.id,
                "business_name": loc.business_name,
                "address": loc.address,
                "phone": loc.phone,
                "auto_respond_enabled": loc.auto_respond_enabled,
                "last_sync_at": loc.last_sync_at.isoformat() if loc.last_sync_at else None,
                "review_count": db.query(GoogleReviewCache).filter_by(location_id=loc.id).count()
            }
            for loc in locations
        ]
    }


# NEW endpoint: Update location autopilot settings
@router.patch("/locations/{location_id}")
async def update_location_settings(
    location_id: int,
    settings: LocationSettingsUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update autopilot settings for a specific location"""
    location = db.query(BusinessLocation).filter_by(
        id=location_id,
        user_id=user.id
    ).first()

    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    if settings.auto_respond_enabled is not None:
        location.auto_respond_enabled = settings.auto_respond_enabled
    if settings.auto_respond_delay_minutes is not None:
        location.auto_respond_delay_minutes = settings.auto_respond_delay_minutes
    if settings.auto_respond_min_rating is not None:
        location.auto_respond_min_rating = settings.auto_respond_min_rating
    if settings.is_active is not None:
        location.is_active = settings.is_active

    db.commit()
    return {"success": True, "message": "Location settings updated"}
```

### Phase 4: Update GoogleReviewsService (2 hours)

**File:** `/opt/reviewmaster/backend/services/google_reviews_service.py`

```python
class GoogleReviewsService:
    """Updated to support multiple locations"""

    async def fetch_reviews_for_location(
        self,
        location: BusinessLocation,
        force_refresh: bool = False
    ) -> List[Dict[str, Any]]:
        """
        Fetch reviews for a specific business location.
        """
        connection = location.connection

        if not force_refresh:
            cache_cutoff = datetime.utcnow() - timedelta(minutes=15)
            if location.last_sync_at and location.last_sync_at > cache_cutoff:
                cached = self.db.query(GoogleReviewCache).filter_by(
                    location_id=location.id
                ).order_by(GoogleReviewCache.review_time.desc()).all()
                return [self._cache_to_dict(r) for r in cached]

        try:
            access_token = await self.get_access_token(connection)
            all_reviews = []
            next_page_token = None

            async with httpx.AsyncClient(timeout=30.0) as client:
                while True:
                    params = {"pageSize": 100}
                    if next_page_token:
                        params["pageToken"] = next_page_token

                    # Use location's google_location_name
                    reviews_url = f"https://mybusiness.googleapis.com/v4/{connection.account_name}/{location.google_location_name}/reviews"

                    response = await client.get(
                        reviews_url,
                        headers={"Authorization": f"Bearer {access_token}"},
                        params=params
                    )

                    if response.status_code != 200:
                        location.last_error = f"API error: {response.status_code}"
                        break

                    data = response.json()
                    reviews = data.get("reviews", [])
                    all_reviews.extend(reviews)

                    next_page_token = data.get("nextPageToken")
                    if not next_page_token or len(all_reviews) >= MAX_REVIEWS_PER_SYNC:
                        break

            if all_reviews:
                await self._update_cache_for_location(location, all_reviews)
                location.last_sync_at = datetime.utcnow()
                location.last_error = None

            self.db.commit()

            cached = self.db.query(GoogleReviewCache).filter_by(
                location_id=location.id
            ).order_by(GoogleReviewCache.review_time.desc()).all()
            return [self._cache_to_dict(r) for r in cached]

        except Exception as e:
            logger.error(f"Error fetching reviews for location {location.id}: {e}")
            location.last_error = str(e)
            self.db.commit()

            cached = self.db.query(GoogleReviewCache).filter_by(
                location_id=location.id
            ).order_by(GoogleReviewCache.review_time.desc()).all()
            return [self._cache_to_dict(r) for r in cached]

    async def fetch_all_reviews_for_user(
        self,
        user_id: int,
        force_refresh: bool = False
    ) -> Dict[int, List[Dict[str, Any]]]:
        """
        Fetch reviews for ALL locations belonging to a user.
        Returns dict mapping location_id -> reviews list.
        """
        locations = self.db.query(BusinessLocation).filter(
            BusinessLocation.user_id == user_id,
            BusinessLocation.is_active == True
        ).all()

        results = {}
        for location in locations:
            reviews = await self.fetch_reviews_for_location(location, force_refresh)
            results[location.id] = reviews

        return results

    async def send_response(
        self,
        location_id: int,  # Now takes location_id instead of user_id
        review_id: str,
        response_text: str
    ) -> Dict[str, Any]:
        """Send a response to a review via Google API."""
        location = self.db.query(BusinessLocation).filter_by(
            id=location_id,
            is_active=True
        ).first()

        if not location:
            return {"success": False, "error": "Location not found or inactive"}

        connection = location.connection
        cache_entry = self.db.query(GoogleReviewCache).filter_by(
            google_review_id=review_id,
            location_id=location_id
        ).first()

        if not cache_entry:
            return {"success": False, "error": "Review not found"}

        try:
            access_token = await self.get_access_token(connection)

            async with httpx.AsyncClient() as client:
                review_name = f"{connection.account_name}/{location.google_location_name}/reviews/{review_id}"
                reply_url = f"https://mybusiness.googleapis.com/v4/{review_name}/reply"

                response = await client.put(
                    reply_url,
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "Content-Type": "application/json"
                    },
                    json={"comment": response_text}
                )

                if response.status_code in (200, 201):
                    cache_entry.our_response_text = response_text
                    cache_entry.our_response_sent = True
                    cache_entry.our_response_time = datetime.utcnow()
                    cache_entry.has_owner_response = True
                    cache_entry.owner_response_text = response_text
                    cache_entry.owner_response_time = datetime.utcnow()
                    self.db.commit()
                    return {"success": True}
                else:
                    return {"success": False, "error": f"Google API error: {response.status_code}"}

        except Exception as e:
            return {"success": False, "error": str(e)}

    async def _update_cache_for_location(self, location: BusinessLocation, reviews: List[Dict]) -> None:
        """Update cache for a specific location"""
        for review in reviews:
            review_id = review.get("reviewId") or review.get("name", "").split("/")[-1]

            existing = self.db.query(GoogleReviewCache).filter_by(
                google_review_id=review_id,
                location_id=location.id
            ).first()

            # ... parsing code unchanged ...

            if existing:
                # Update existing
                existing.reviewer_name = reviewer_name
                # ... etc
            else:
                # Create new - NOW WITH location_id
                cache_entry = GoogleReviewCache(
                    user_id=location.user_id,
                    location_id=location.id,  # NEW
                    google_review_id=review_id,
                    # ... rest unchanged
                )
                self.db.add(cache_entry)

        self.db.commit()
```

### Phase 5: Update Autopilot Worker (1 hour)

**File:** `/opt/reviewmaster/backend/services/autopilot_worker.py`

```python
class AutopilotWorker:
    """Updated to process multiple locations per user"""

    def get_autopilot_locations(self):
        """Get all locations with autopilot enabled"""
        with db_manager.session_scope() as db:
            locations = db.query(BusinessLocation).filter(
                BusinessLocation.auto_respond_enabled == True,
                BusinessLocation.is_active == True
            ).all()

            return [
                {
                    'location_id': loc.id,
                    'user_id': loc.user_id,
                    'connection_id': loc.connection_id,
                    'business_name': loc.business_name,
                    'auto_respond_min_rating': loc.auto_respond_min_rating,
                    'auto_respond_delay_minutes': loc.auto_respond_delay_minutes
                }
                for loc in locations
            ]

    async def process_location_reviews(self, location_data: dict):
        """Process reviews for a single location with autopilot"""
        with db_manager.session_scope() as db:
            try:
                location = db.query(BusinessLocation).filter_by(
                    id=location_data['location_id']
                ).first()

                if not location:
                    return 0

                user = db.query(User).filter_by(id=location_data['user_id']).first()
                if not user or not user.is_pro:
                    logger.warning(f"User {location_data['user_id']} no longer Pro, skipping autopilot")
                    return 0

                # Get business profile for THIS location
                business_profile = db.query(BusinessProfile).filter_by(
                    location_id=location.id
                ).first()

                # Fallback to user-level profile if no location-specific profile
                if not business_profile:
                    business_profile = db.query(BusinessProfile).filter_by(
                        user_id=user.id,
                        location_id=None
                    ).first()

                profile_dict = self._profile_to_dict(business_profile) if business_profile else None

                # Fetch and process reviews for THIS location
                service = GoogleReviewsService(db)
                await service.fetch_reviews_for_location(location, force_refresh=True)

                pending_reviews = self.get_reviews_ready_for_autopilot(
                    db,
                    location.id,  # Now by location_id
                    location_data['auto_respond_min_rating'],
                    location_data['auto_respond_delay_minutes']
                )

                responses_sent = 0
                for review in pending_reviews:
                    response_text = await self.generate_response_for_review(
                        review,
                        profile_dict,
                        location.business_name
                    )

                    if response_text:
                        result = await service.send_response(
                            location_id=location.id,
                            review_id=review.google_review_id,
                            response_text=response_text
                        )

                        if result.get('success'):
                            responses_sent += 1
                            logger.info(f"AUTOPILOT: Sent response for {location.business_name}")

                location.auto_respond_last_run = datetime.utcnow()
                db.commit()

                return responses_sent

            except Exception as e:
                logger.error(f"Error processing location {location_data['location_id']}: {e}")
                return 0

    def get_reviews_ready_for_autopilot(
        self,
        db: Session,
        location_id: int,  # Now by location_id
        min_rating: int,
        delay_minutes: int
    ):
        """Get reviews for a specific location ready for autopilot"""
        delay_cutoff = datetime.utcnow() - timedelta(minutes=delay_minutes)

        return db.query(GoogleReviewCache).filter(
            GoogleReviewCache.location_id == location_id,  # Changed from user_id
            GoogleReviewCache.has_owner_response == False,
            GoogleReviewCache.our_response_sent == False,
            GoogleReviewCache.star_rating >= min_rating,
            GoogleReviewCache.review_time <= delay_cutoff
        ).order_by(GoogleReviewCache.review_time.asc()).all()

    async def run_once(self):
        """Run one iteration of the autopilot worker"""
        logger.info("Autopilot worker starting...")

        self.reset_starter_monthly_limits()
        self.process_triggered_emails()

        locations = self.get_autopilot_locations()
        logger.info(f"Found {len(locations)} locations with autopilot enabled")

        total_responses = 0
        for location_data in locations:
            try:
                responses = await self.process_location_reviews(location_data)
                total_responses += responses
            except Exception as e:
                logger.error(f"Error processing location {location_data['location_id']}: {e}")

        logger.info(f"Autopilot complete. Sent {total_responses} responses.")
        return total_responses
```

### Phase 6: Update API Routes (1 hour)

**File:** `/opt/reviewmaster/backend/routes/google_reviews_routes.py`

```python
# UPDATE list endpoint to support location filtering

@router.get("/list")
async def list_reviews(
    location_id: Optional[int] = None,  # NEW: optional location filter
    force_refresh: bool = False,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get reviews. If location_id specified, get reviews for that location.
    Otherwise, get reviews for all user's locations.
    """
    service = GoogleReviewsService(db)

    if location_id:
        # Get reviews for specific location
        location = db.query(BusinessLocation).filter_by(
            id=location_id,
            user_id=user.id,
            is_active=True
        ).first()

        if not location:
            raise HTTPException(status_code=404, detail="Location not found")

        reviews = await service.fetch_reviews_for_location(location, force_refresh)

        return ReviewListResponse(
            reviews=reviews,
            total=len(reviews),
            business_name=location.business_name,
            location_id=location.id,
            last_sync=location.last_sync_at.isoformat() if location.last_sync_at else None,
            connection_status="connected"
        )
    else:
        # Get reviews for all locations
        all_reviews = await service.fetch_all_reviews_for_user(user.id, force_refresh)

        # Flatten for response
        flat_reviews = []
        for location_id, reviews in all_reviews.items():
            for review in reviews:
                review['location_id'] = location_id
                flat_reviews.append(review)

        return ReviewListResponse(
            reviews=flat_reviews,
            total=len(flat_reviews),
            business_name=None,  # Multiple businesses
            location_id=None,
            last_sync=None,
            connection_status="connected"
        )


@router.post("/send-response")
async def send_review_response(
    request: SendResponseRequest,  # Add location_id to this model
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a response to a Google review for a specific location"""
    # Verify user owns this location
    location = db.query(BusinessLocation).filter_by(
        id=request.location_id,
        user_id=user.id
    ).first()

    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    # ... rate limiting code ...

    service = GoogleReviewsService(db)
    result = await service.send_response(
        location_id=request.location_id,
        review_id=request.review_id,
        response_text=request.response_text
    )

    # ... rest unchanged
```

### Phase 7: Frontend Updates (2 hours)

**Required Changes:**

1. **Dashboard:** Show list of locations with individual stats
2. **Location Selector:** Dropdown to switch between locations
3. **Autopilot Settings:** Per-location toggle and settings
4. **Review List:** Filter by location or show all
5. **Business Profile:** Allow per-location profiles

**Key UI Components:**

```tsx
// LocationSelector.tsx
function LocationSelector({ locations, selectedId, onChange }) {
  return (
    <Select value={selectedId} onChange={onChange}>
      <option value="">All Locations</option>
      {locations.map(loc => (
        <option key={loc.id} value={loc.id}>
          {loc.business_name}
        </option>
      ))}
    </Select>
  );
}

// LocationCard.tsx
function LocationCard({ location }) {
  return (
    <div className="card">
      <h3>{location.business_name}</h3>
      <p>{location.address}</p>
      <div>
        <span>Reviews: {location.review_count}</span>
        <span>Last Sync: {location.last_sync_at}</span>
      </div>
      <Toggle
        label="Autopilot"
        checked={location.auto_respond_enabled}
        onChange={/* update settings */}
      />
    </div>
  );
}
```

---

## Migration Strategy

### Step 1: Deploy Database Changes (10 min)
```bash
cd /opt/reviewmaster
source venv/bin/activate
alembic upgrade head
```

### Step 2: Run Data Migration (5 min)
```bash
python scripts/migrate_to_multi_location.py
```

### Step 3: Deploy Backend Code (5 min)
```bash
# Restart services
systemctl restart reviewmaster
systemctl restart reviewmaster-autopilot
```

### Step 4: Deploy Frontend (5 min)
```bash
cd /opt/reviewmaster/frontend
npm run build
# Restart nginx or serve new static files
```

### Step 5: Verify (10 min)
- Check existing Legion connection still works
- Verify reviews are visible
- Test autopilot still runs
- Check dashboard shows location info

---

## Rollback Plan

If issues occur:

1. **Revert database migration:**
   ```bash
   alembic downgrade -1
   ```

2. **Revert code:**
   ```bash
   git checkout HEAD~1
   ```

3. **Restart services:**
   ```bash
   systemctl restart reviewmaster reviewmaster-autopilot
   ```

---

## Testing Checklist

### Backend Tests
- [ ] OAuth callback stores all locations
- [ ] Can fetch reviews for specific location
- [ ] Can fetch reviews for all locations
- [ ] Can send response for specific location
- [ ] Autopilot processes all enabled locations
- [ ] Business profiles work per-location
- [ ] API rate limiting still works

### Frontend Tests
- [ ] Dashboard shows all locations
- [ ] Location selector works
- [ ] Reviews filter by location
- [ ] Autopilot toggle works per-location
- [ ] Business profile can be set per-location

### Integration Tests
- [ ] Existing Legion user still works
- [ ] Adding second location works
- [ ] Removing location doesn't affect others
- [ ] Sync runs for all locations

---

## Future Considerations (Option B Prep)

This implementation prepares for Option B (multiple Google accounts):

1. **Removed unique constraint** on `GoogleBusinessConnection.user_id`
2. **Added connection_name** for identifying multiple accounts
3. **BusinessLocation links to connection_id**, not user_id directly
4. **Frontend location selector** can group by connection

To add Option B later, only need:
- New OAuth flow to add additional Google accounts
- UI to manage multiple Google connections
- No database schema changes needed

---

## Estimated Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| 1. Database Migration | 30 min | None |
| 2. Data Migration Script | 30 min | Phase 1 |
| 3. OAuth Flow Updates | 2 hours | Phase 2 |
| 4. GoogleReviewsService | 2 hours | Phase 3 |
| 5. Autopilot Worker | 1 hour | Phase 4 |
| 6. API Routes | 1 hour | Phase 4-5 |
| 7. Frontend Updates | 2 hours | Phase 6 |
| 8. Testing | 2 hours | Phase 7 |
| **Total** | **~11 hours** | ~2-3 days |

---

## References

- [Google Business Profile API - Locations](https://developers.google.com/my-business/content/locations)
- [Google Business Profile API - Reviews](https://developers.google.com/my-business/content/review-data)
- [accounts.locations.batchGetReviews](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/batchGet)
- ReviewMaster codebase: `/opt/reviewmaster/` on CT 313 (Silvally)
