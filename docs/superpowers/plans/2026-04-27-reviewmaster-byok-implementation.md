# ReviewMaster Pro BYOK - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a separate ReviewMaster Pro instance for AppSumo with BYOK (Bring Your Own Key) functionality and license code redemption.

**Architecture:** Clone existing CT 313 codebase to new repo, remove Stripe billing, add license code system and encrypted API key storage. Deploy to CT 318 on Silvally with Cloudflare tunnel.

**Tech Stack:** FastAPI, PostgreSQL, Fernet encryption (cryptography lib), OpenAI API, Cloudflare Tunnel

---

## File Structure

### New Files to Create
| File | Responsibility |
|------|---------------|
| `backend/utils/encryption.py` | Fernet encrypt/decrypt for API keys |
| `backend/models/license.py` | License code Pydantic models |
| `backend/models/settings.py` | API key settings Pydantic models |
| `backend/routes/settings.py` | API key management endpoints |
| `backend/routes/license.py` | License redemption endpoint |
| `backend/cron/validate_keys.py` | Daily API key validation script |
| `scripts/generate_licenses.py` | Admin script to generate license codes |

### Files to Modify
| File | Changes |
|------|---------|
| `backend/database.py` | Add LicenseCode model, BYOK User fields |
| `backend/config.py` | Add BYOK_ENCRYPTION_KEY, remove Stripe settings |
| `backend/routes/__init__.py` | Remove stripe_router, add settings_router and license_router |
| `backend/routes/auth.py` | Modify signup for license code flow |
| `backend/routes/reviews.py` | Use user's API key instead of server key |
| `backend/services/review_generator.py` | Accept optional api_key parameter |
| `backend/models/__init__.py` | Export new models |
| `backend/utils/__init__.py` | Export encryption functions |
| `backend/app_pro.py` | Update router imports |
| `backend/templates/index.html` | New landing page with license redemption |

### Files to Remove
| File | Reason |
|------|--------|
| `backend/routes/stripe_checkout.py` | No Stripe billing in BYOK version |

---

## Task 1: Create GitHub Repo and Clone Codebase

**Files:**
- Source: CT 313 `/opt/reviewmaster/`
- Target: New repo `reviewmaster-byok`

- [ ] **Step 1: Create new GitHub repository**

```bash
# On Giratina (192.168.1.100)
cd /tmp
mkdir reviewmaster-byok
cd reviewmaster-byok
git init
```

- [ ] **Step 2: Copy codebase from CT 313**

```bash
# Copy from CT 313 on Silvally
scp -r root@192.168.1.52:/var/lib/lxc/313/rootfs/opt/reviewmaster/* /tmp/reviewmaster-byok/

# Or via pct
ssh root@192.168.1.52 "pct exec 313 -- tar czf /tmp/reviewmaster.tar.gz -C /opt/reviewmaster ."
scp root@192.168.1.52:/tmp/reviewmaster.tar.gz /tmp/
cd /tmp/reviewmaster-byok
tar xzf /tmp/reviewmaster.tar.gz
```

- [ ] **Step 3: Clean up unnecessary files**

```bash
cd /tmp/reviewmaster-byok
rm -rf venv/
rm -rf __pycache__/
rm -rf backend/__pycache__/
rm -rf backend/*/__pycache__/
rm -rf .git/
rm -f *.db
rm -f test_*.db
rm -f .env
rm -rf backups/
rm -rf archived_code/
rm -rf *_backup*/
rm -f *.tar.gz
```

- [ ] **Step 4: Initialize new git repo and push**

```bash
cd /tmp/reviewmaster-byok
git init
git add -A
git commit -m "Initial commit: fork from ReviewMaster Pro CT 313"

# Create repo on GitHub first, then:
git remote add origin git@github.com:Built-Simple/reviewmaster-byok.git
git branch -M main
git push -u origin main
```

- [ ] **Step 5: Verify repo is accessible**

```bash
cd /tmp
rm -rf reviewmaster-byok
git clone git@github.com:Built-Simple/reviewmaster-byok.git
ls reviewmaster-byok/
```

Expected: Directory contains `backend/`, `requirements.txt`, etc.

---

## Task 2: Add Encryption Utilities

**Files:**
- Create: `backend/utils/encryption.py`
- Modify: `backend/utils/__init__.py`
- Modify: `backend/config.py`

- [ ] **Step 1: Add BYOK encryption key to config**

Edit `backend/config.py`, add this field to the `Settings` class after the existing fields:

```python
    # BYOK Settings
    byok_encryption_key: Optional[str] = Field(None, description="Fernet key for encrypting user API keys")

    @validator("byok_encryption_key")
    def validate_byok_key(cls, v, values):
        """Validate BYOK encryption key format"""
        if v and len(v) != 44:  # Fernet keys are 44 chars base64
            raise ValueError(
                "BYOK_ENCRYPTION_KEY must be a valid Fernet key (44 characters). "
                "Generate with: python -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())'"
            )
        return v
```

- [ ] **Step 2: Create encryption utility file**

Create `backend/utils/encryption.py`:

```python
"""
Encryption utilities for BYOK API key storage.

Uses Fernet symmetric encryption - keys are encrypted at rest
and decrypted only at moment of use.
"""
from cryptography.fernet import Fernet, InvalidToken
from typing import Optional
import logging

from ..config import settings

logger = logging.getLogger(__name__)

_fernet: Optional[Fernet] = None


def _get_fernet() -> Fernet:
    """Get or create Fernet instance."""
    global _fernet
    if _fernet is None:
        if not settings.byok_encryption_key:
            raise RuntimeError(
                "BYOK_ENCRYPTION_KEY not configured. "
                "Generate with: python -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())'"
            )
        _fernet = Fernet(settings.byok_encryption_key.encode())
    return _fernet


def encrypt_api_key(plaintext_key: str) -> str:
    """
    Encrypt an OpenAI API key for storage.

    Args:
        plaintext_key: The raw API key starting with 'sk-'

    Returns:
        Base64-encoded encrypted string safe for database storage
    """
    fernet = _get_fernet()
    encrypted = fernet.encrypt(plaintext_key.encode())
    return encrypted.decode()


def decrypt_api_key(encrypted_key: str) -> str:
    """
    Decrypt a stored OpenAI API key for use.

    Args:
        encrypted_key: The encrypted key from database

    Returns:
        The original API key

    Raises:
        InvalidToken: If decryption fails (wrong key or corrupted data)
    """
    fernet = _get_fernet()
    decrypted = fernet.decrypt(encrypted_key.encode())
    return decrypted.decode()


def mask_api_key(api_key: str) -> str:
    """
    Mask an API key for display (show only last 4 chars).

    Args:
        api_key: The full API key

    Returns:
        Masked string like 'sk-••••••••••••••••1234'
    """
    if not api_key or len(api_key) < 8:
        return "••••••••"
    prefix = api_key[:3]  # 'sk-'
    suffix = api_key[-4:]
    masked_len = len(api_key) - 7
    return f"{prefix}{'•' * masked_len}{suffix}"
```

- [ ] **Step 3: Update utils __init__.py**

Edit `backend/utils/__init__.py`, add these imports:

```python
from .encryption import encrypt_api_key, decrypt_api_key, mask_api_key
```

Add to `__all__`:

```python
    "encrypt_api_key",
    "decrypt_api_key",
    "mask_api_key",
```

- [ ] **Step 4: Test encryption locally**

```bash
cd /tmp/reviewmaster-byok
python3 -c "
from cryptography.fernet import Fernet
key = Fernet.generate_key()
print(f'Test key: {key.decode()}')
f = Fernet(key)
encrypted = f.encrypt(b'sk-test1234567890')
print(f'Encrypted: {encrypted.decode()[:50]}...')
decrypted = f.decrypt(encrypted)
print(f'Decrypted: {decrypted.decode()}')
print('Encryption test passed!')
"
```

Expected: Shows encrypted/decrypted values, ends with "Encryption test passed!"

- [ ] **Step 5: Commit**

```bash
git add backend/utils/encryption.py backend/utils/__init__.py backend/config.py
git commit -m "feat: add Fernet encryption utilities for BYOK API keys"
```

---

## Task 3: Add LicenseCode Database Model

**Files:**
- Modify: `backend/database.py`

- [ ] **Step 1: Add LicenseCode model to database.py**

Add this class after the `User` class in `backend/database.py`:

```python
class LicenseCode(Base):
    """
    AppSumo license codes for lifetime access.
    Each code can only be redeemed once.
    """
    __tablename__ = "license_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    redeemed_at = Column(DateTime, nullable=True)
    redeemed_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    source = Column(String(50), default="appsumo")  # appsumo, manual, etc.
    is_valid = Column(Boolean, default=True)  # Can be revoked if refunded
    notes = Column(Text, nullable=True)

    # Relationships
    redeemed_by = relationship("User", back_populates="license_code_used")

    def __repr__(self):
        status = "redeemed" if self.redeemed_at else "available"
        return f"<LicenseCode(code={self.code[:10]}..., status={status})>"
```

- [ ] **Step 2: Add BYOK fields to User model**

Add these columns to the `User` class in `backend/database.py` (after the existing columns):

```python
    # BYOK fields
    license_code_id = Column(Integer, ForeignKey("license_codes.id"), nullable=True)
    openai_api_key_encrypted = Column(Text, nullable=True)
    openai_key_validated_at = Column(DateTime, nullable=True)
    openai_key_status = Column(String(20), default="not_set")
    # Values: 'not_set', 'valid', 'invalid', 'quota_exceeded', 'revoked'
    openai_key_error_message = Column(Text, nullable=True)

    # Relationships (add to existing relationships section)
    license_code_used = relationship("LicenseCode", back_populates="redeemed_by", foreign_keys=[license_code_id])
```

- [ ] **Step 3: Verify the model compiles**

```bash
cd /tmp/reviewmaster-byok
python3 -c "from backend.database import User, LicenseCode, Base; print('Models loaded successfully')"
```

Expected: "Models loaded successfully"

- [ ] **Step 4: Commit**

```bash
git add backend/database.py
git commit -m "feat: add LicenseCode model and BYOK user fields"
```

---

## Task 4: Add License and Settings Pydantic Models

**Files:**
- Create: `backend/models/license.py`
- Create: `backend/models/settings.py`
- Modify: `backend/models/__init__.py`

- [ ] **Step 1: Create license models**

Create `backend/models/license.py`:

```python
"""
License code Pydantic models for API validation.
"""
import re
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime


class LicenseRedemptionRequest(BaseModel):
    """Request to redeem a license code and create account."""
    license_code: str = Field(..., min_length=10, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator('license_code')
    @classmethod
    def normalize_license_code(cls, v):
        """Normalize license code: uppercase, strip whitespace."""
        return v.strip().upper()

    @field_validator('password')
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[a-zA-Z]', v):
            raise ValueError('Password must contain at least one letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        return v


class LicenseRedemptionResponse(BaseModel):
    """Response after successful license redemption."""
    success: bool
    message: str
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    email: Optional[str] = None


class LicenseValidationRequest(BaseModel):
    """Request to check if a license code is valid."""
    license_code: str

    @field_validator('license_code')
    @classmethod
    def normalize_license_code(cls, v):
        return v.strip().upper()


class LicenseValidationResponse(BaseModel):
    """Response for license validation check."""
    valid: bool
    available: bool  # True if not yet redeemed
    message: str
```

- [ ] **Step 2: Create settings models**

Create `backend/models/settings.py`:

```python
"""
Settings Pydantic models for API key management.
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime


class UpdateApiKeyRequest(BaseModel):
    """Request to update OpenAI API key."""
    api_key: str = Field(..., min_length=20, max_length=200)

    @field_validator('api_key')
    @classmethod
    def validate_api_key_format(cls, v):
        """Basic format validation for OpenAI API keys."""
        v = v.strip()
        if not v.startswith('sk-'):
            raise ValueError("API key must start with 'sk-'")
        return v


class ApiKeyStatusResponse(BaseModel):
    """Response containing API key status."""
    has_key: bool
    status: str  # 'not_set', 'valid', 'invalid', 'quota_exceeded', 'revoked'
    masked_key: Optional[str] = None  # e.g., 'sk-••••••••1234'
    last_validated: Optional[datetime] = None
    error_message: Optional[str] = None


class UpdateApiKeyResponse(BaseModel):
    """Response after updating API key."""
    success: bool
    message: str
    status: Optional[str] = None


class KeyTestResult(BaseModel):
    """Result of testing an OpenAI API key."""
    valid: bool
    error_type: Optional[str] = None  # 'invalid', 'quota_exceeded', 'revoked', 'network_error'
    friendly_message: Optional[str] = None
```

- [ ] **Step 3: Update models __init__.py**

Edit `backend/models/__init__.py`:

```python
"""
ReviewMaster Pydantic Models
Request/response models for API validation
"""
from .auth import AuthRequest, TokenResponse, RefreshRequest
from .review import ReviewRequest, ReviewResponse, MultiReviewResponse, ResponseOption
from .profile import (
    BusinessProfileRequest,
    BusinessProfileResponse,
    CustomPromptRequest,
    CustomPromptResponse,
)
from .license import (
    LicenseRedemptionRequest,
    LicenseRedemptionResponse,
    LicenseValidationRequest,
    LicenseValidationResponse,
)
from .settings import (
    UpdateApiKeyRequest,
    ApiKeyStatusResponse,
    UpdateApiKeyResponse,
    KeyTestResult,
)

__all__ = [
    "AuthRequest",
    "TokenResponse",
    "RefreshRequest",
    "ReviewRequest",
    "ReviewResponse",
    "MultiReviewResponse",
    "ResponseOption",
    "BusinessProfileRequest",
    "BusinessProfileResponse",
    "CustomPromptRequest",
    "CustomPromptResponse",
    "LicenseRedemptionRequest",
    "LicenseRedemptionResponse",
    "LicenseValidationRequest",
    "LicenseValidationResponse",
    "UpdateApiKeyRequest",
    "ApiKeyStatusResponse",
    "UpdateApiKeyResponse",
    "KeyTestResult",
]
```

- [ ] **Step 4: Verify models import**

```bash
cd /tmp/reviewmaster-byok
python3 -c "from backend.models import LicenseRedemptionRequest, UpdateApiKeyRequest; print('Models imported successfully')"
```

Expected: "Models imported successfully"

- [ ] **Step 5: Commit**

```bash
git add backend/models/license.py backend/models/settings.py backend/models/__init__.py
git commit -m "feat: add Pydantic models for license codes and API key settings"
```

---

## Task 5: Create License Redemption Route

**Files:**
- Create: `backend/routes/license.py`
- Modify: `backend/routes/__init__.py`

- [ ] **Step 1: Create license routes**

Create `backend/routes/license.py`:

```python
"""
License code redemption routes.
"""
from fastapi import APIRouter, HTTPException, Request, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import logging

from ..database import get_db, User, LicenseCode
from ..models import (
    LicenseRedemptionRequest,
    LicenseRedemptionResponse,
    LicenseValidationRequest,
    LicenseValidationResponse,
    TokenResponse,
)
from ..utils import (
    hash_password,
    create_access_token,
    create_refresh_token,
    check_brute_force,
    record_failed_login,
    clear_failed_logins,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/license", tags=["license"])


@router.post("/validate", response_model=LicenseValidationResponse)
async def validate_license_code(
    request: LicenseValidationRequest,
    db: Session = Depends(get_db)
):
    """Check if a license code is valid and available."""
    code = request.license_code.strip().upper()

    license_record = db.query(LicenseCode).filter(
        LicenseCode.code == code
    ).first()

    if not license_record:
        return LicenseValidationResponse(
            valid=False,
            available=False,
            message="This license code isn't valid. Please check you entered it correctly, including any dashes."
        )

    if not license_record.is_valid:
        return LicenseValidationResponse(
            valid=False,
            available=False,
            message="This license code is no longer valid. Please contact support@built-simple.ai"
        )

    if license_record.redeemed_at is not None:
        return LicenseValidationResponse(
            valid=True,
            available=False,
            message="This license code has already been used. Each code can only be redeemed once."
        )

    return LicenseValidationResponse(
        valid=True,
        available=True,
        message="License code is valid and available!"
    )


@router.post("/redeem", response_model=LicenseRedemptionResponse)
async def redeem_license_code(
    request: Request,
    redemption_data: LicenseRedemptionRequest,
    db: Session = Depends(get_db)
):
    """Redeem a license code and create a new account."""
    client_ip = request.client.host if request.client else "unknown"

    # Rate limiting
    if check_brute_force(client_ip, db):
        raise HTTPException(
            status_code=429,
            detail="Too many attempts. Please try again in 15 minutes."
        )

    code = redemption_data.license_code.strip().upper()

    # Validate license code
    license_record = db.query(LicenseCode).filter(
        LicenseCode.code == code
    ).first()

    if not license_record:
        record_failed_login(client_ip, db)
        return LicenseRedemptionResponse(
            success=False,
            message="This license code isn't valid. Please check you entered it correctly, including any dashes."
        )

    if not license_record.is_valid:
        record_failed_login(client_ip, db)
        return LicenseRedemptionResponse(
            success=False,
            message="This license code is no longer valid. Please contact support@built-simple.ai"
        )

    if license_record.redeemed_at is not None:
        record_failed_login(client_ip, db)
        return LicenseRedemptionResponse(
            success=False,
            message="This license code has already been used. Each code can only be redeemed once."
        )

    # Check if email already exists
    existing_user = db.query(User).filter(
        User.email == redemption_data.email
    ).first()

    if existing_user:
        record_failed_login(client_ip, db)
        return LicenseRedemptionResponse(
            success=False,
            message="An account with this email already exists. Please log in instead."
        )

    # Create user account
    user = User(
        email=redemption_data.email,
        password_hash=hash_password(redemption_data.password),
        is_pro=True,  # Lifetime Pro access
        is_active=True,
        license_code_id=license_record.id,
        openai_key_status="not_set",
    )
    db.add(user)
    db.flush()  # Get user.id

    # Mark license as redeemed
    license_record.redeemed_at = datetime.utcnow()
    license_record.redeemed_by_user_id = user.id

    db.commit()
    db.refresh(user)

    clear_failed_logins(client_ip, db)
    logger.info(f"License {code[:10]}... redeemed by {redemption_data.email}")

    # Generate tokens
    access_token = create_access_token(user.email, user.id)
    refresh_token = create_refresh_token(user.id, db, request)

    return LicenseRedemptionResponse(
        success=True,
        message="Welcome to ReviewMaster Pro! Your lifetime access is now active.",
        access_token=access_token,
        refresh_token=refresh_token,
        email=user.email
    )
```

- [ ] **Step 2: Update routes __init__.py**

Edit `backend/routes/__init__.py`:

```python
from .auth import router as auth_router
from .reviews import router as reviews_router
from .profile import router as profile_router
from .prompts import router as prompts_router
from .contact import router as contact_router
from .license import router as license_router
from .google_oauth import router as google_business_router
from .google_reviews_routes import router as google_reviews_router

__all__ = [
    'auth_router',
    'reviews_router',
    'profile_router',
    'prompts_router',
    'contact_router',
    'license_router',
    'google_business_router',
    'google_reviews_router',
]
```

- [ ] **Step 3: Commit**

```bash
git add backend/routes/license.py backend/routes/__init__.py
git commit -m "feat: add license code redemption endpoint"
```

---

## Task 6: Create API Key Settings Route

**Files:**
- Create: `backend/routes/settings.py`
- Modify: `backend/routes/__init__.py`

- [ ] **Step 1: Create settings routes**

Create `backend/routes/settings.py`:

```python
"""
User settings routes - API key management.
"""
from fastapi import APIRouter, HTTPException, Header, Depends
from sqlalchemy.orm import Session
from openai import AsyncOpenAI, AuthenticationError, RateLimitError, APIError
from typing import Optional
from datetime import datetime
import logging

from ..database import get_db, User
from ..models import (
    UpdateApiKeyRequest,
    ApiKeyStatusResponse,
    UpdateApiKeyResponse,
    KeyTestResult,
)
from ..utils import get_user_from_token, encrypt_api_key, decrypt_api_key, mask_api_key

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/settings", tags=["settings"])


async def test_openai_key(api_key: str) -> KeyTestResult:
    """
    Test if an OpenAI API key is valid with minimal cost.
    Uses models.list() which is free.
    """
    try:
        client = AsyncOpenAI(api_key=api_key)
        await client.models.list()
        return KeyTestResult(valid=True)
    except AuthenticationError:
        return KeyTestResult(
            valid=False,
            error_type="invalid",
            friendly_message="This API key doesn't appear to be valid. Make sure you copied the entire key starting with 'sk-'. You can find your keys at platform.openai.com/api-keys"
        )
    except RateLimitError:
        return KeyTestResult(
            valid=False,
            error_type="quota_exceeded",
            friendly_message="Your OpenAI account has run out of credits. Add credits at platform.openai.com/account/billing"
        )
    except APIError as e:
        if "revoked" in str(e).lower():
            return KeyTestResult(
                valid=False,
                error_type="revoked",
                friendly_message="This API key has been revoked. Please create a new key at platform.openai.com/api-keys"
            )
        return KeyTestResult(
            valid=False,
            error_type="api_error",
            friendly_message=f"OpenAI API error: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error testing API key: {e}")
        return KeyTestResult(
            valid=False,
            error_type="network_error",
            friendly_message="Couldn't connect to OpenAI. Please check your internet connection and try again."
        )


@router.get("/openai-key", response_model=ApiKeyStatusResponse)
async def get_api_key_status(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Get current API key status."""
    user = get_user_from_token(authorization, db)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")

    has_key = user.openai_api_key_encrypted is not None
    masked = None

    if has_key:
        try:
            decrypted = decrypt_api_key(user.openai_api_key_encrypted)
            masked = mask_api_key(decrypted)
        except Exception:
            masked = "••••••••"

    return ApiKeyStatusResponse(
        has_key=has_key,
        status=user.openai_key_status or "not_set",
        masked_key=masked,
        last_validated=user.openai_key_validated_at,
        error_message=user.openai_key_error_message
    )


@router.post("/openai-key", response_model=UpdateApiKeyResponse)
async def update_api_key(
    request: UpdateApiKeyRequest,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Update and validate user's OpenAI API key."""
    user = get_user_from_token(authorization, db)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")

    # Test the key
    test_result = await test_openai_key(request.api_key)

    if not test_result.valid:
        return UpdateApiKeyResponse(
            success=False,
            message=test_result.friendly_message,
            status=test_result.error_type
        )

    # Encrypt and store
    encrypted = encrypt_api_key(request.api_key)
    user.openai_api_key_encrypted = encrypted
    user.openai_key_validated_at = datetime.utcnow()
    user.openai_key_status = "valid"
    user.openai_key_error_message = None

    db.commit()

    logger.info(f"API key updated for user {user.id}")

    return UpdateApiKeyResponse(
        success=True,
        message="API key saved and validated successfully!",
        status="valid"
    )


@router.post("/openai-key/test", response_model=UpdateApiKeyResponse)
async def test_current_key(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Test the currently stored API key."""
    user = get_user_from_token(authorization, db)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")

    if not user.openai_api_key_encrypted:
        return UpdateApiKeyResponse(
            success=False,
            message="No API key configured. Please add your OpenAI API key first.",
            status="not_set"
        )

    try:
        api_key = decrypt_api_key(user.openai_api_key_encrypted)
    except Exception as e:
        logger.error(f"Failed to decrypt API key for user {user.id}: {e}")
        return UpdateApiKeyResponse(
            success=False,
            message="Failed to read stored key. Please update your API key.",
            status="invalid"
        )

    test_result = await test_openai_key(api_key)

    # Update status in database
    user.openai_key_validated_at = datetime.utcnow()
    user.openai_key_status = "valid" if test_result.valid else test_result.error_type
    user.openai_key_error_message = None if test_result.valid else test_result.friendly_message
    db.commit()

    if test_result.valid:
        return UpdateApiKeyResponse(
            success=True,
            message="Your API key is working correctly!",
            status="valid"
        )
    else:
        return UpdateApiKeyResponse(
            success=False,
            message=test_result.friendly_message,
            status=test_result.error_type
        )


@router.delete("/openai-key")
async def delete_api_key(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Remove stored API key."""
    user = get_user_from_token(authorization, db)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")

    user.openai_api_key_encrypted = None
    user.openai_key_validated_at = None
    user.openai_key_status = "not_set"
    user.openai_key_error_message = None
    db.commit()

    return {"success": True, "message": "API key removed"}
```

- [ ] **Step 2: Update routes __init__.py to include settings**

Edit `backend/routes/__init__.py`:

```python
from .auth import router as auth_router
from .reviews import router as reviews_router
from .profile import router as profile_router
from .prompts import router as prompts_router
from .contact import router as contact_router
from .license import router as license_router
from .settings import router as settings_router
from .google_oauth import router as google_business_router
from .google_reviews_routes import router as google_reviews_router

__all__ = [
    'auth_router',
    'reviews_router',
    'profile_router',
    'prompts_router',
    'contact_router',
    'license_router',
    'settings_router',
    'google_business_router',
    'google_reviews_router',
]
```

- [ ] **Step 3: Commit**

```bash
git add backend/routes/settings.py backend/routes/__init__.py
git commit -m "feat: add API key management endpoints"
```

---

## Task 7: Remove Stripe Integration

**Files:**
- Delete: `backend/routes/stripe_checkout.py`
- Modify: `backend/app_pro.py`
- Modify: `backend/config.py`

- [ ] **Step 1: Delete stripe_checkout.py**

```bash
cd /tmp/reviewmaster-byok
rm backend/routes/stripe_checkout.py
```

- [ ] **Step 2: Update app_pro.py imports**

Edit `backend/app_pro.py`. Replace the router imports section:

```python
# Import routes after app is created
from .routes import auth_router, reviews_router, profile_router, prompts_router, contact_router, license_router, settings_router, google_business_router, google_reviews_router

app.include_router(auth_router)
app.include_router(reviews_router)
app.include_router(profile_router)
app.include_router(prompts_router)
app.include_router(contact_router)
app.include_router(license_router)
app.include_router(settings_router)
app.include_router(google_business_router)
app.include_router(google_reviews_router)
```

- [ ] **Step 3: Remove Stripe settings from config.py**

Edit `backend/config.py`. Remove or comment out these lines:

```python
    # REMOVED - No Stripe in BYOK version
    # stripe_secret_key: Optional[str] = Field(None, description="Stripe secret API key")
    # stripe_publishable_key: Optional[str] = Field(None, description="Stripe publishable key")
    # stripe_webhook_secret: Optional[str] = Field(None, description="Stripe webhook signing secret")
    # stripe_price_id: Optional[str] = Field(None, description="Stripe Price ID for Pro subscription")
    # stripe_starter_price_id: Optional[str] = Field(None, description="Stripe Price ID for Starter tier ($5/month)")
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: remove Stripe integration for BYOK version"
```

---

## Task 8: Modify Review Generator for BYOK

**Files:**
- Modify: `backend/services/review_generator.py`
- Modify: `backend/routes/reviews.py`

- [ ] **Step 1: Update review_generator.py to accept api_key parameter**

Edit `backend/services/review_generator.py`. Modify the `generate_ai_response` function signature and body:

```python
async def generate_ai_response(
    review_data: ReviewRequest,
    business_profile: Optional[dict] = None,
    prompt_config: Optional[dict] = None,
    anti_repetition_context: Optional[str] = None,
    api_key: Optional[str] = None,  # NEW: User's API key for BYOK
) -> str:
    """
    Generate AI response with Pro customizations.

    Args:
        review_data: The review to respond to
        business_profile: Optional business profile for customization
        prompt_config: Optional prompt configuration
        anti_repetition_context: Context to avoid repetition
        api_key: User's OpenAI API key (BYOK mode)

    Raises:
        AIGenerationError: If OpenAI API is unavailable or fails.
    """
    # Use provided API key or fall back to server key
    effective_key = api_key or settings.openai_api_key

    if not effective_key:
        _send_api_failure_notification(
            error_type="missing_api_key",
            details="No API key available (neither user key nor server key configured)",
            review_data=review_data
        )
        raise AIGenerationError("OpenAI API key not configured")

    # Create client with the effective key
    client = AsyncOpenAI(api_key=effective_key)

    system_prompt = build_system_prompt(review_data, business_profile, prompt_config, anti_repetition_context)

    safe_reviewer_name = sanitize_for_ai(review_data.reviewer_name)
    safe_review_text = sanitize_for_ai(review_data.review_text)

    user_prompt = f"""===BEGIN CUSTOMER REVIEW===
Reviewer Name: {safe_reviewer_name}
Rating: {review_data.rating}/5 stars
Review Content: {safe_review_text}
===END CUSTOMER REVIEW===

Based ONLY on the customer review above, generate an appropriate response."""

    max_tokens = 300
    if prompt_config:
        if prompt_config.get("max_response_length"):
            max_tokens = min(500, max(100, prompt_config["max_response_length"] // 4))
    elif business_profile:
        length_pref = business_profile.get("preferred_length", "medium")
        if length_pref == "short":
            max_tokens = 150
        elif length_pref == "long":
            max_tokens = 500

    try:
        completion = await client.chat.completions.create(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_completion_tokens=max_tokens,
        )
        response = completion.choices[0].message.content.strip()
        # Post-process: replace em dashes with regular dashes
        response = response.replace("—", "-").replace("–", "-")
        return response
    except Exception as e:
        logger.error(f"OpenAI API error: {e}")
        # Only send notification if using server key (not user's BYOK key)
        if not api_key:
            _send_api_failure_notification(
                error_type="api_call_failed",
                details=str(e),
                review_data=review_data
            )
        raise AIGenerationError(f"OpenAI API call failed: {e}")
```

Also remove the global `openai_client` variable at the top since we now create clients per-request.

- [ ] **Step 2: Update reviews.py to pass user's API key**

Edit `backend/routes/reviews.py`. Add import for decryption and modify the generate endpoint:

Add this import at the top:

```python
from ..utils import get_user_from_token, check_daily_limit, increment_usage, decrypt_api_key
```

Then in the review generation endpoint (find the part that calls `generate_ai_response`), add logic to get the user's API key:

```python
# Get user's API key for BYOK
user_api_key = None
if user and user.openai_api_key_encrypted:
    try:
        user_api_key = decrypt_api_key(user.openai_api_key_encrypted)
    except Exception as e:
        logger.error(f"Failed to decrypt API key for user {user.id}: {e}")
        raise HTTPException(
            status_code=400,
            detail="Your API key could not be read. Please update your API key in settings."
        )

if not user_api_key:
    raise HTTPException(
        status_code=400,
        detail="Please add your OpenAI API key in settings before generating responses."
    )

# Then pass it to generate_ai_response:
response_text = await generate_ai_response(
    review_data=request,
    business_profile=profile_dict,
    prompt_config=prompt_config_dict,
    anti_repetition_context=anti_rep_context,
    api_key=user_api_key,  # Pass user's key
)
```

- [ ] **Step 3: Commit**

```bash
git add backend/services/review_generator.py backend/routes/reviews.py
git commit -m "feat: use user's BYOK API key for review generation"
```

---

## Task 9: Create License Generation Script

**Files:**
- Create: `scripts/generate_licenses.py`

- [ ] **Step 1: Create scripts directory and generation script**

```bash
mkdir -p /tmp/reviewmaster-byok/scripts
```

Create `scripts/generate_licenses.py`:

```python
#!/usr/bin/env python3
"""
Admin script to generate license codes for AppSumo.

Usage:
    python scripts/generate_licenses.py --count 100 --output licenses.txt
    python scripts/generate_licenses.py --count 10 --insert  # Insert into DB
"""
import secrets
import string
import argparse
import sys
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, '/opt/reviewmaster')

def generate_license_code() -> str:
    """Generate a single license code in format RMBYOK-XXXX-XXXX-XXXX."""
    chars = string.ascii_uppercase + string.digits
    # Remove ambiguous characters
    chars = chars.replace('O', '').replace('0', '').replace('I', '').replace('1', '').replace('L', '')
    groups = [''.join(secrets.choice(chars) for _ in range(4)) for _ in range(3)]
    return f"RMBYOK-{'-'.join(groups)}"


def generate_batch(count: int) -> list[str]:
    """Generate a batch of unique license codes."""
    codes = set()
    while len(codes) < count:
        codes.add(generate_license_code())
    return sorted(list(codes))


def insert_codes_to_db(codes: list[str], source: str = "appsumo") -> int:
    """Insert codes into database. Returns count of inserted codes."""
    from backend.database import db_manager, LicenseCode

    inserted = 0
    with db_manager.session_scope() as db:
        for code in codes:
            existing = db.query(LicenseCode).filter(LicenseCode.code == code).first()
            if not existing:
                license_record = LicenseCode(
                    code=code,
                    source=source,
                    is_valid=True,
                )
                db.add(license_record)
                inserted += 1

    return inserted


def main():
    parser = argparse.ArgumentParser(description="Generate AppSumo license codes")
    parser.add_argument("--count", type=int, default=10, help="Number of codes to generate")
    parser.add_argument("--output", type=str, help="Output file path (optional)")
    parser.add_argument("--insert", action="store_true", help="Insert codes into database")
    parser.add_argument("--source", type=str, default="appsumo", help="Source identifier")

    args = parser.parse_args()

    print(f"Generating {args.count} license codes...")
    codes = generate_batch(args.count)

    # Print codes
    print("\n" + "=" * 50)
    print("Generated License Codes:")
    print("=" * 50)
    for code in codes:
        print(code)
    print("=" * 50)

    # Save to file
    if args.output:
        with open(args.output, 'w') as f:
            f.write(f"# Generated {datetime.now().isoformat()}\n")
            f.write(f"# Count: {args.count}\n")
            f.write(f"# Source: {args.source}\n\n")
            for code in codes:
                f.write(code + "\n")
        print(f"\nSaved to: {args.output}")

    # Insert into database
    if args.insert:
        print("\nInserting into database...")
        try:
            inserted = insert_codes_to_db(codes, args.source)
            print(f"Inserted {inserted} new codes into database")
        except Exception as e:
            print(f"Database error: {e}")
            return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 2: Make script executable**

```bash
chmod +x /tmp/reviewmaster-byok/scripts/generate_licenses.py
```

- [ ] **Step 3: Test script (without DB)**

```bash
cd /tmp/reviewmaster-byok
python3 scripts/generate_licenses.py --count 5
```

Expected: Shows 5 license codes in format `RMBYOK-XXXX-XXXX-XXXX`

- [ ] **Step 4: Commit**

```bash
git add scripts/generate_licenses.py
git commit -m "feat: add admin script for license code generation"
```

---

## Task 10: Create Daily Key Validation Cron

**Files:**
- Create: `backend/cron/__init__.py`
- Create: `backend/cron/validate_keys.py`

- [ ] **Step 1: Create cron directory**

```bash
mkdir -p /tmp/reviewmaster-byok/backend/cron
```

- [ ] **Step 2: Create __init__.py**

Create `backend/cron/__init__.py`:

```python
"""Cron job scripts for ReviewMaster BYOK."""
```

- [ ] **Step 3: Create validate_keys.py**

Create `backend/cron/validate_keys.py`:

```python
#!/usr/bin/env python3
"""
Daily cron job to validate all user API keys.

Checks each user's stored OpenAI API key is still valid.
Sends email notification if a key becomes invalid.

Usage:
    python -m backend.cron.validate_keys

Crontab entry (run at 3 AM daily):
    0 3 * * * cd /opt/reviewmaster && /opt/reviewmaster/venv/bin/python -m backend.cron.validate_keys
"""
import asyncio
import logging
import sys
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, '/opt/reviewmaster')

from backend.database import db_manager, User
from backend.utils import decrypt_api_key
from backend.routes.settings import test_openai_key
from backend.services.email_service import send_email

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def send_key_invalid_email(email: str, error_message: str) -> None:
    """Send email notification that API key is no longer valid."""
    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #dc2626;">Your OpenAI API Key Needs Attention</h2>

        <p>Hi there,</p>

        <p>We tried to validate your OpenAI API key and encountered an issue:</p>

        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 12px; margin: 16px 0;">
            {error_message}
        </div>

        <p><strong>What to do:</strong></p>
        <ol>
            <li>Log in to ReviewMaster Pro at <a href="https://appsumo.reviewmaster.built-simple.ai">appsumo.reviewmaster.built-simple.ai</a></li>
            <li>Go to Settings → OpenAI API Key</li>
            <li>Update your API key or check your OpenAI billing</li>
        </ol>

        <p>Your API key is needed to generate review responses. Until this is fixed, you won't be able to generate new responses.</p>

        <p>Need help? Reply to this email or contact support@built-simple.ai</p>

        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px;">
            ReviewMaster Pro - AI Review Response Generator<br>
            This is an automated notification.
        </p>
    </body>
    </html>
    """

    try:
        send_email(
            to_email=email,
            subject="Action Required: Your ReviewMaster API Key",
            html_body=html_body
        )
        logger.info(f"Sent key invalid notification to {email}")
    except Exception as e:
        logger.error(f"Failed to send notification to {email}: {e}")


async def validate_all_keys() -> dict:
    """
    Validate all user API keys that are currently marked as valid.

    Returns:
        dict with counts: total, valid, invalid, errors
    """
    stats = {"total": 0, "valid": 0, "invalid": 0, "errors": 0}

    with db_manager.session_scope() as db:
        # Get all users with API keys marked as valid
        users = db.query(User).filter(
            User.openai_api_key_encrypted.isnot(None),
            User.openai_key_status == "valid"
        ).all()

        stats["total"] = len(users)
        logger.info(f"Validating {stats['total']} API keys...")

        for user in users:
            try:
                # Decrypt the key
                api_key = decrypt_api_key(user.openai_api_key_encrypted)

                # Test the key
                result = await test_openai_key(api_key)

                user.openai_key_validated_at = datetime.utcnow()

                if result.valid:
                    stats["valid"] += 1
                else:
                    stats["invalid"] += 1
                    user.openai_key_status = result.error_type
                    user.openai_key_error_message = result.friendly_message

                    # Send notification email
                    await send_key_invalid_email(user.email, result.friendly_message)
                    logger.warning(f"Key invalid for user {user.id}: {result.error_type}")

            except Exception as e:
                stats["errors"] += 1
                logger.error(f"Error validating key for user {user.id}: {e}")

        db.commit()

    return stats


async def main():
    """Main entry point for cron job."""
    logger.info("Starting daily API key validation...")
    start_time = datetime.utcnow()

    try:
        stats = await validate_all_keys()

        duration = (datetime.utcnow() - start_time).total_seconds()
        logger.info(
            f"Validation complete in {duration:.1f}s: "
            f"{stats['total']} total, {stats['valid']} valid, "
            f"{stats['invalid']} invalid, {stats['errors']} errors"
        )

    except Exception as e:
        logger.error(f"Validation job failed: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(main())
```

- [ ] **Step 4: Commit**

```bash
git add backend/cron/__init__.py backend/cron/validate_keys.py
git commit -m "feat: add daily API key validation cron job"
```

---

## Task 11: Update Landing Page for License Redemption

**Files:**
- Modify: `backend/templates/index.html`

- [ ] **Step 1: Create new landing page**

This is a significant UI change. Replace the content of `backend/templates/index.html` with a new landing page focused on license redemption. The key changes:

1. Remove pricing tiers
2. Add license code input prominently
3. Add "Already have an account? Log in" link
4. Keep the review generation tool for logged-in users

Due to the size of this file, create it with the essential structure:

```html
<!DOCTYPE html>
<html class="light">
<head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-0MWDDN867X"></script>
    <script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag("js", new Date());gtag("config", "G-0MWDDN867X");</script>
    <link rel="icon" type="image/x-icon" href="/favicon.ico?v=1">
    <title>ReviewMaster Pro - AI Review Responses | AppSumo Exclusive</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="AI review response generator for small businesses. Lifetime access with your own OpenAI API key.">
</head>
<body class="bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- App container - content loaded dynamically -->
    <div id="app"></div>

    <script>
    // State management
    let state = {
        user: null,
        accessToken: localStorage.getItem('accessToken'),
        view: 'landing' // landing, login, dashboard, settings
    };

    // API helpers
    const api = {
        async post(endpoint, data) {
            const headers = { 'Content-Type': 'application/json' };
            if (state.accessToken) {
                headers['Authorization'] = `Bearer ${state.accessToken}`;
            }
            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            });
            return response.json();
        },
        async get(endpoint) {
            const headers = {};
            if (state.accessToken) {
                headers['Authorization'] = `Bearer ${state.accessToken}`;
            }
            const response = await fetch(endpoint, { headers });
            return response.json();
        }
    };

    // Render functions
    function renderLanding() {
        return `
            <div class="min-h-screen flex flex-col items-center justify-center p-4">
                <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <h1 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
                        ReviewMaster Pro
                    </h1>
                    <p class="text-center text-gray-600 dark:text-gray-400 mb-6">
                        AI-Powered Review Response Generator
                    </p>

                    <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                        <p class="text-green-800 dark:text-green-200 text-center font-medium">
                            AppSumo Exclusive - Lifetime Access
                        </p>
                    </div>

                    <div class="space-y-4 mb-6">
                        <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                            <span>Unlimited review responses</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                            <span>Custom business profiles</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                            <span>Google Business integration</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                            <span>Bring your own OpenAI key</span>
                        </div>
                    </div>

                    <div id="redeem-form">
                        <input type="text" id="license-code" placeholder="Enter your license code"
                            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-3
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <input type="email" id="email" placeholder="Email address"
                            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-3
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <input type="password" id="password" placeholder="Create password (min 8 chars)"
                            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <button onclick="redeemLicense()"
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg
                                   transition duration-200">
                            Redeem License
                        </button>
                        <div id="redeem-error" class="mt-3 text-red-600 dark:text-red-400 text-sm hidden"></div>
                    </div>

                    <div class="mt-6 text-center">
                        <p class="text-gray-600 dark:text-gray-400">
                            Already have an account?
                            <a href="#" onclick="showLogin()" class="text-blue-600 hover:underline">Log in</a>
                        </p>
                    </div>

                    <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                        <p class="text-gray-500 dark:text-gray-400 text-sm">
                            Don't have a license?
                            <a href="https://appsumo.com" target="_blank" class="text-blue-600 hover:underline">
                                Get one on AppSumo →
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    function renderLogin() {
        return `
            <div class="min-h-screen flex flex-col items-center justify-center p-4">
                <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
                        Log In
                    </h2>

                    <input type="email" id="login-email" placeholder="Email address"
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-3
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <input type="password" id="login-password" placeholder="Password"
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <button onclick="login()"
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg">
                        Log In
                    </button>
                    <div id="login-error" class="mt-3 text-red-600 dark:text-red-400 text-sm hidden"></div>

                    <div class="mt-6 text-center">
                        <a href="#" onclick="showLanding()" class="text-blue-600 hover:underline">
                            ← Back to license redemption
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // Action handlers
    async function redeemLicense() {
        const code = document.getElementById('license-code').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('redeem-error');

        errorEl.classList.add('hidden');

        const result = await api.post('/api/license/redeem', {
            license_code: code,
            email: email,
            password: password
        });

        if (result.success) {
            localStorage.setItem('accessToken', result.access_token);
            localStorage.setItem('refreshToken', result.refresh_token);
            state.accessToken = result.access_token;
            state.user = { email: result.email };
            state.view = 'dashboard';
            render();
        } else {
            errorEl.textContent = result.message || result.detail || 'Redemption failed';
            errorEl.classList.remove('hidden');
        }
    }

    async function login() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');

        errorEl.classList.add('hidden');

        const result = await api.post('/api/login', { email, password });

        if (result.access_token) {
            localStorage.setItem('accessToken', result.access_token);
            localStorage.setItem('refreshToken', result.refresh_token);
            state.accessToken = result.access_token;
            state.user = { email: result.email, is_pro: result.is_pro };
            state.view = 'dashboard';
            render();
        } else {
            errorEl.textContent = result.detail || 'Login failed';
            errorEl.classList.remove('hidden');
        }
    }

    function showLogin() {
        state.view = 'login';
        render();
    }

    function showLanding() {
        state.view = 'landing';
        render();
    }

    function logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        state.accessToken = null;
        state.user = null;
        state.view = 'landing';
        render();
    }

    // Main render
    function render() {
        const app = document.getElementById('app');

        switch (state.view) {
            case 'landing':
                app.innerHTML = renderLanding();
                break;
            case 'login':
                app.innerHTML = renderLogin();
                break;
            case 'dashboard':
                // For now, redirect to the existing dashboard
                // This will be expanded in the full UI update
                app.innerHTML = '<div class="p-8"><p>Dashboard - Loading...</p></div>';
                // Reload to get the full app
                window.location.reload();
                break;
            default:
                app.innerHTML = renderLanding();
        }
    }

    // Initialize
    async function init() {
        if (state.accessToken) {
            // Verify token is still valid
            try {
                const user = await api.get('/api/user/me');
                if (user.email) {
                    state.user = user;
                    state.view = 'dashboard';
                }
            } catch (e) {
                localStorage.removeItem('accessToken');
                state.accessToken = null;
            }
        }
        render();
    }

    init();
    </script>
</body>
</html>
```

Note: This is a simplified landing page. The full dashboard UI with settings will need to be integrated with the existing index.html content for logged-in users.

- [ ] **Step 2: Commit**

```bash
git add backend/templates/index.html
git commit -m "feat: update landing page for license redemption flow"
```

---

## Task 12: Add Health Endpoint

**Files:**
- Modify: `backend/app_pro.py`

- [ ] **Step 1: Add health check endpoint**

Add this route to `backend/app_pro.py`:

```python
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy", "version": "2.2.0-byok"}
```

- [ ] **Step 2: Commit**

```bash
git add backend/app_pro.py
git commit -m "feat: add health check endpoint"
```

---

## Task 13: Create Environment Template

**Files:**
- Create: `.env.template`

- [ ] **Step 1: Create environment template**

Create `.env.template`:

```bash
# ReviewMaster Pro BYOK - Environment Configuration
# Copy to .env and fill in values

# Required: Generate with: python -c 'import secrets; print(secrets.token_urlsafe(32))'
JWT_SECRET=your-jwt-secret-here

# Required: Generate with: python -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())'
BYOK_ENCRYPTION_KEY=your-fernet-key-here

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/reviewmaster_byok

# Environment
ENVIRONMENT=production
DEBUG=false

# Optional: Server OpenAI key (fallback, not typically used in BYOK)
# OPENAI_API_KEY=sk-...

# Google OAuth (for Google Business integration)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_BUSINESS_CLIENT_ID=
GOOGLE_BUSINESS_CLIENT_SECRET=
GOOGLE_BUSINESS_REDIRECT_URI=https://appsumo.reviewmaster.built-simple.ai/api/google/callback
TOKEN_ENCRYPTION_KEY=

# Email (for notifications)
EMAIL_GOOGLE_CLIENT_ID=
EMAIL_GOOGLE_CLIENT_SECRET=
EMAIL_GOOGLE_REFRESH_TOKEN=

# Logging
LOG_LEVEL=INFO
```

- [ ] **Step 2: Update .gitignore**

Add to `.gitignore`:

```
.env
*.db
__pycache__/
*.pyc
venv/
```

- [ ] **Step 3: Commit**

```bash
git add .env.template .gitignore
git commit -m "feat: add environment template for BYOK deployment"
```

---

## Task 14: Update Requirements

**Files:**
- Modify: `requirements.txt`

- [ ] **Step 1: Add cryptography to requirements**

Edit `requirements.txt`, ensure it includes:

```
cryptography>=41.0.0
```

- [ ] **Step 2: Commit**

```bash
git add requirements.txt
git commit -m "feat: add cryptography to requirements for BYOK encryption"
```

---

## Task 15: Final Push and Verify

- [ ] **Step 1: Review all changes**

```bash
cd /tmp/reviewmaster-byok
git log --oneline
```

Expected: ~14 commits covering all the changes

- [ ] **Step 2: Push to remote**

```bash
git push origin main
```

- [ ] **Step 3: Verify repo on GitHub**

Visit `https://github.com/Built-Simple/reviewmaster-byok` and verify files are present.

---

## Task 16: Create Container CT 318

**Files:**
- None (infrastructure task)

- [ ] **Step 1: Create container on Silvally**

```bash
ssh root@192.168.1.52 "pct create 318 local:vztmpl/debian-12-standard_12.2-1_amd64.tar.zst \
    --hostname reviewmaster-byok \
    --memory 2048 \
    --cores 2 \
    --rootfs local-lvm:10 \
    --net0 name=eth0,bridge=vmbr0,ip=dhcp \
    --unprivileged 1 \
    --features nesting=1"
```

- [ ] **Step 2: Start container and get IP**

```bash
ssh root@192.168.1.52 "pct start 318"
ssh root@192.168.1.52 "pct exec 318 -- ip addr show eth0 | grep 'inet '"
```

Note the IP address (e.g., 192.168.1.XXX)

- [ ] **Step 3: Install dependencies**

```bash
ssh root@192.168.1.52 "pct exec 318 -- bash -c '
apt update && apt upgrade -y
apt install -y python3 python3-pip python3-venv postgresql postgresql-contrib git curl
'"
```

- [ ] **Step 4: Set up PostgreSQL**

```bash
ssh root@192.168.1.52 "pct exec 318 -- bash -c '
systemctl enable postgresql
systemctl start postgresql
sudo -u postgres createuser -s root
sudo -u postgres createdb reviewmaster_byok
'"
```

- [ ] **Step 5: Clone repo and set up app**

```bash
ssh root@192.168.1.52 "pct exec 318 -- bash -c '
cd /opt
git clone git@github.com:Built-Simple/reviewmaster-byok.git reviewmaster
cd reviewmaster
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
'"
```

- [ ] **Step 6: Create .env file**

```bash
ssh root@192.168.1.52 "pct exec 318 -- bash -c '
cd /opt/reviewmaster
cp .env.template .env
# Generate keys
JWT_SECRET=\$(python3 -c \"import secrets; print(secrets.token_urlsafe(32))\")
BYOK_KEY=\$(python3 -c \"from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())\")

# Update .env with generated values
sed -i \"s/your-jwt-secret-here/\$JWT_SECRET/\" .env
sed -i \"s/your-fernet-key-here/\$BYOK_KEY/\" .env
sed -i \"s|postgresql://postgres:password@localhost:5432/reviewmaster_byok|postgresql://root@localhost/reviewmaster_byok|\" .env
'"
```

- [ ] **Step 7: Create systemd service**

```bash
ssh root@192.168.1.52 "pct exec 318 -- bash -c 'cat > /etc/systemd/system/reviewmaster.service << EOF
[Unit]
Description=ReviewMaster Pro BYOK API Service
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/reviewmaster
ExecStart=/opt/reviewmaster/venv/bin/python -m uvicorn backend.app_pro:app --host 0.0.0.0 --port 8002
Restart=always
RestartSec=10
Environment=\"PYTHONPATH=/opt/reviewmaster\"

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable reviewmaster
systemctl start reviewmaster
'"
```

- [ ] **Step 8: Verify service is running**

```bash
ssh root@192.168.1.52 "pct exec 318 -- systemctl status reviewmaster"
ssh root@192.168.1.52 "pct exec 318 -- curl -s http://localhost:8002/health"
```

Expected: `{"status":"healthy","version":"2.2.0-byok"}`

---

## Task 17: Set Up Cloudflare Tunnel

**Files:**
- None (infrastructure task)

- [ ] **Step 1: Install cloudflared in container**

```bash
ssh root@192.168.1.52 "pct exec 318 -- bash -c '
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o /tmp/cloudflared.deb
dpkg -i /tmp/cloudflared.deb
'"
```

- [ ] **Step 2: Create tunnel (run from Giratina or wherever you have Cloudflare auth)**

```bash
cloudflared tunnel create reviewmaster-byok
cloudflared tunnel route dns reviewmaster-byok appsumo.reviewmaster.built-simple.ai
```

- [ ] **Step 3: Copy credentials to container**

Copy the tunnel credentials JSON to CT 318 and create config:

```bash
# Get CT 318 IP first
CT318_IP=$(ssh root@192.168.1.52 "pct exec 318 -- hostname -I | awk '{print \$1}'")

ssh root@192.168.1.52 "pct exec 318 -- mkdir -p /etc/cloudflared"

# Create config file
ssh root@192.168.1.52 "pct exec 318 -- bash -c 'cat > /etc/cloudflared/config.yml << EOF
tunnel: <TUNNEL_ID>
credentials-file: /etc/cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: appsumo.reviewmaster.built-simple.ai
    service: http://localhost:8002
  - service: http_status:404
EOF'"
```

- [ ] **Step 4: Enable cloudflared service**

```bash
ssh root@192.168.1.52 "pct exec 318 -- cloudflared service install"
ssh root@192.168.1.52 "pct exec 318 -- systemctl enable cloudflared"
ssh root@192.168.1.52 "pct exec 318 -- systemctl start cloudflared"
```

- [ ] **Step 5: Test external access**

```bash
curl -s https://appsumo.reviewmaster.built-simple.ai/health
```

Expected: `{"status":"healthy","version":"2.2.0-byok"}`

---

## Task 18: Generate Initial License Codes

- [ ] **Step 1: Generate test batch**

```bash
ssh root@192.168.1.52 "pct exec 318 -- bash -c '
cd /opt/reviewmaster
source venv/bin/activate
python scripts/generate_licenses.py --count 10 --insert
'"
```

- [ ] **Step 2: Verify codes in database**

```bash
ssh root@192.168.1.52 "pct exec 318 -- psql -U root -d reviewmaster_byok -c 'SELECT code, is_valid, redeemed_at FROM license_codes LIMIT 5;'"
```

Expected: Shows 5 license codes with `is_valid=true` and `redeemed_at=NULL`

---

## Task 19: Update Brain Dump Documentation

**Files:**
- Modify: `~/.claude/plugins/marketplaces/neely-brain-dump-marketplace/docs/apps/reviewmaster-pro.md`
- Create: `~/.claude/plugins/marketplaces/neely-brain-dump-marketplace/docs/apps/reviewmaster-byok.md`

- [ ] **Step 1: Create BYOK documentation**

Create `docs/apps/reviewmaster-byok.md` in the brain dump repo:

```markdown
# ReviewMaster Pro BYOK - AppSumo Edition

**Last Updated:** 2026-04-27
**Status:** Production Ready

## Overview

| Property | Value |
|----------|-------|
| **Container** | CT 318 on Silvally (192.168.1.52) |
| **Port** | 8002 |
| **Domain** | appsumo.reviewmaster.built-simple.ai |
| **Repo** | git@github.com:Built-Simple/reviewmaster-byok.git |

## What is This?

Separate instance of ReviewMaster Pro for AppSumo lifetime deal customers. Key differences from main version:

- **BYOK (Bring Your Own Key)** - Users provide their own OpenAI API key
- **License codes** - One-time redemption instead of Stripe subscription
- **Lifetime access** - No recurring billing

## Quick Commands

```bash
# Access container
ssh root@192.168.1.52 "pct enter 318"

# Check service status
ssh root@192.168.1.52 "pct exec 318 -- systemctl status reviewmaster"

# View logs
ssh root@192.168.1.52 "pct exec 318 -- journalctl -u reviewmaster -n 50"

# Generate license codes
ssh root@192.168.1.52 "pct exec 318 -- bash -c 'cd /opt/reviewmaster && source venv/bin/activate && python scripts/generate_licenses.py --count 100 --insert'"

# Test health
curl https://appsumo.reviewmaster.built-simple.ai/health
```

## License Code Management

Generate codes:
```bash
python scripts/generate_licenses.py --count 100 --output appsumo_batch_1.txt --insert
```

Check redemption status:
```sql
SELECT code, redeemed_at, redeemed_by_user_id FROM license_codes WHERE source = 'appsumo';
```

## API Key Security

- User API keys encrypted with Fernet (symmetric encryption)
- Encryption key stored in `.env` only
- Keys decrypted only at moment of use
- Daily cron validates all keys at 3 AM

## Related

- [ReviewMaster Pro (main)](reviewmaster-pro.md) - Subscription version on CT 313
```

- [ ] **Step 2: Commit documentation**

```bash
cd ~/.claude/plugins/marketplaces/neely-brain-dump-marketplace
git add docs/apps/reviewmaster-byok.md
git commit -m "docs: add ReviewMaster BYOK documentation"
git push
```

---

## Summary

This plan creates a complete BYOK version of ReviewMaster Pro with:

1. **New GitHub repo** - `reviewmaster-byok`
2. **License code system** - Single-use codes for AppSumo
3. **Encrypted API key storage** - Fernet encryption with env-based key
4. **Modified review generation** - Uses user's own OpenAI key
5. **Updated landing page** - License redemption flow
6. **Daily key validation** - Cron job with email notifications
7. **Deployed to CT 318** - Separate from main ReviewMaster
8. **Cloudflare tunnel** - `appsumo.reviewmaster.built-simple.ai`

Total: 19 tasks with ~70 steps.
