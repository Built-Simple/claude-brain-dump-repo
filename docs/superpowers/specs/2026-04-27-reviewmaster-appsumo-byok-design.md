# ReviewMaster Pro - AppSumo BYOK Edition

**Date:** 2026-04-27
**Status:** Ready for Implementation
**Author:** Claude + Human

---

## Overview

Create a separate instance of ReviewMaster Pro for AppSumo lifetime deal customers. Users bring their own OpenAI API key (BYOK) and get full Pro features with a one-time license code purchase.

### Goals
- Launch on AppSumo with attractive lifetime deal
- Isolate AppSumo users from subscription business
- Secure storage of user API keys
- Bulletproof for potential traffic spike from AppSumo launch

### Non-Goals
- Multi-location/agency support (solve later if demand exists)
- Stacked license tiers
- Integration with AppSumo API (manual license codes for now)

---

## Architecture

### Deployment

| Property | Value |
|----------|-------|
| Container | CT 318 on Silvally (192.168.1.52) |
| Domain | `appsumo.reviewmaster.built-simple.ai` |
| Port | 8002 (avoid conflict with CT 313 on 8001) |
| Database | PostgreSQL (local to container) |
| Repo | `git@github.com:Built-Simple/reviewmaster-byok.git` |

### System Diagram

```
User Browser
    │
    ▼
Cloudflare Tunnel
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ CT 318 - Silvally (192.168.1.52)                            │
│ appsumo.reviewmaster.built-simple.ai:8002                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐     ┌─────────────────────────────┐   │
│  │  FastAPI App    │────▶│  PostgreSQL                 │   │
│  │                 │     │  - users (+ BYOK fields)    │   │
│  │  - Auth         │     │  - license_codes            │   │
│  │  - Reviews      │     │  - business_profiles        │   │
│  │  - Profiles     │     │  - review_responses         │   │
│  │  - BYOK Mgmt    │     │  - google_business_*        │   │
│  └────────┬────────┘     └─────────────────────────────┘   │
│           │                                                 │
│           │ User's encrypted API key                        │
│           ▼                                                 │
│  ┌─────────────────┐                                        │
│  │  OpenAI API     │ (external)                             │
│  └─────────────────┘                                        │
│                                                             │
│  ┌─────────────────┐                                        │
│  │  Cron Jobs      │                                        │
│  │  - Daily key    │                                        │
│  │    validation   │                                        │
│  └─────────────────┘                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### New Table: `license_codes`

```sql
CREATE TABLE license_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,      -- e.g., "APPSUMO-XXXX-XXXX-XXXX"
    created_at TIMESTAMP DEFAULT NOW(),
    redeemed_at TIMESTAMP NULL,
    redeemed_by_user_id INTEGER REFERENCES users(id) NULL,
    source VARCHAR(50) DEFAULT 'appsumo',  -- For future: 'appsumo', 'manual', etc.
    is_valid BOOLEAN DEFAULT TRUE,         -- Can be revoked if refunded
    notes TEXT NULL                         -- Admin notes
);

CREATE INDEX idx_license_code ON license_codes(code);
CREATE INDEX idx_license_redeemed_by ON license_codes(redeemed_by_user_id);
```

### Modified: `users` table

Add these columns to existing users table:

```sql
ALTER TABLE users ADD COLUMN license_code_id INTEGER REFERENCES license_codes(id) NULL;
ALTER TABLE users ADD COLUMN openai_api_key_encrypted TEXT NULL;
ALTER TABLE users ADD COLUMN openai_key_validated_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN openai_key_status VARCHAR(20) DEFAULT 'not_set';
    -- Values: 'not_set', 'valid', 'invalid', 'quota_exceeded', 'revoked'
ALTER TABLE users ADD COLUMN openai_key_error_message TEXT NULL;
    -- Stores last error for display to user
```

### Removed Columns (from original)

These Stripe-related columns can be removed or ignored:
- `subscription_tier` (all users are "lifetime")
- `subscription_expires`
- `subscription_started_at`
- `starter_responses_this_month`
- `starter_responses_reset_at`
- `trial_responses_used`

Keep `is_pro = TRUE` for all licensed users (simplifies Pro feature checks).

---

## API Key Encryption

### Encryption Approach

Use Fernet symmetric encryption (from `cryptography` library):

```python
from cryptography.fernet import Fernet

# Key stored in .env file (generate once during setup)
# BYOK_ENCRYPTION_KEY=<base64-encoded-32-byte-key>

def encrypt_api_key(plaintext_key: str) -> str:
    """Encrypt OpenAI API key for storage."""
    fernet = Fernet(settings.byok_encryption_key.encode())
    return fernet.encrypt(plaintext_key.encode()).decode()

def decrypt_api_key(encrypted_key: str) -> str:
    """Decrypt OpenAI API key for use."""
    fernet = Fernet(settings.byok_encryption_key.encode())
    return fernet.decrypt(encrypted_key.encode()).decode()
```

### Key Generation (one-time setup)

```python
from cryptography.fernet import Fernet
print(Fernet.generate_key().decode())
# Add to .env: BYOK_ENCRYPTION_KEY=<output>
```

### Security Considerations

- Encryption key lives only in `.env` file (not in database)
- If database is compromised, API keys remain encrypted
- If `.env` is compromised, attacker still needs database access
- Keys are decrypted only at moment of use, never logged

---

## License Code System

### Code Format

```
RMBYOK-XXXX-XXXX-XXXX
```
- Prefix: `RMBYOK` (ReviewMaster BYOK)
- 12 alphanumeric characters in 3 groups
- Case-insensitive validation
- Example: `RMBYOK-A7K2-M9P4-X3B8`

### Code Generation (Admin Script)

```python
import secrets
import string

def generate_license_code() -> str:
    """Generate a single license code."""
    chars = string.ascii_uppercase + string.digits
    groups = [''.join(secrets.choice(chars) for _ in range(4)) for _ in range(3)]
    return f"RMBYOK-{'-'.join(groups)}"

def generate_batch(count: int) -> list[str]:
    """Generate batch of codes for AppSumo."""
    return [generate_license_code() for _ in range(count)]
```

### Redemption Flow

1. User visits `appsumo.reviewmaster.built-simple.ai`
2. Clicks "Redeem License Code"
3. Enters code + email + password
4. Backend validates:
   - Code exists in `license_codes` table
   - Code is not already redeemed (`redeemed_at IS NULL`)
   - Code is valid (`is_valid = TRUE`)
5. On success:
   - Create user account with `is_pro = TRUE`
   - Link `license_code_id` to user
   - Set `redeemed_at` and `redeemed_by_user_id` on license
6. Redirect to dashboard with prompt to add OpenAI key

---

## API Key Management

### Settings Page UI

New section in account settings:

```
┌─────────────────────────────────────────────────────────────┐
│ OpenAI API Key                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Your API key is used to generate review responses.         │
│ Get your key at: https://platform.openai.com/api-keys      │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ sk-••••••••••••••••••••••••••••••••••••••••1234        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Status: ✓ Valid (last checked: 2 hours ago)                │
│                                                             │
│ [Update Key]  [Test Key]                                    │
│                                                             │
│ ⓘ Your key is encrypted and stored securely. We never      │
│   share or access your key except to generate responses.   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key States

| Status | UI Display | Action |
|--------|------------|--------|
| `not_set` | "No API key configured" + warning | Prompt to add key |
| `valid` | "✓ Valid" + last checked time | None needed |
| `invalid` | "✗ Invalid key" + error details | Prompt to update |
| `quota_exceeded` | "⚠ Quota exceeded" + link to billing | Link to OpenAI |
| `revoked` | "✗ Key revoked by OpenAI" | Prompt to create new key |

### Validation Endpoint

```python
@router.post("/api/settings/openai-key")
async def update_openai_key(
    request: UpdateKeyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update and validate user's OpenAI API key."""

    # 1. Test the key with a minimal API call
    test_result = await test_openai_key(request.api_key)

    if not test_result.valid:
        return {"success": False, "error": test_result.friendly_message}

    # 2. Encrypt and store
    encrypted = encrypt_api_key(request.api_key)
    current_user.openai_api_key_encrypted = encrypted
    current_user.openai_key_validated_at = datetime.utcnow()
    current_user.openai_key_status = "valid"
    current_user.openai_key_error_message = None

    db.commit()

    return {"success": True, "message": "API key saved and validated"}
```

### Key Testing

```python
async def test_openai_key(api_key: str) -> KeyTestResult:
    """Test if an OpenAI key is valid with minimal cost."""
    try:
        client = AsyncOpenAI(api_key=api_key)
        # Use cheapest possible call - list models
        await client.models.list()
        return KeyTestResult(valid=True)
    except AuthenticationError:
        return KeyTestResult(
            valid=False,
            error_type="invalid",
            friendly_message="This API key is invalid. Please check you copied it correctly."
        )
    except RateLimitError:
        return KeyTestResult(
            valid=False,
            error_type="quota_exceeded",
            friendly_message="This API key has exceeded its quota. Please check your OpenAI billing at platform.openai.com/billing"
        )
    except Exception as e:
        return KeyTestResult(
            valid=False,
            error_type="unknown",
            friendly_message=f"Could not validate key: {str(e)}"
        )
```

---

## Periodic Key Validation

### Cron Job

Daily validation of all user API keys:

```python
# /opt/reviewmaster/backend/cron/validate_keys.py

async def validate_all_keys():
    """Daily job to check all user API keys are still valid."""

    with db_manager.session_scope() as db:
        users_with_keys = db.query(User).filter(
            User.openai_api_key_encrypted.isnot(None),
            User.openai_key_status == "valid"
        ).all()

        for user in users_with_keys:
            try:
                api_key = decrypt_api_key(user.openai_api_key_encrypted)
                result = await test_openai_key(api_key)

                user.openai_key_validated_at = datetime.utcnow()

                if not result.valid:
                    user.openai_key_status = result.error_type
                    user.openai_key_error_message = result.friendly_message

                    # Send email notification
                    await send_key_invalid_email(user.email, result.friendly_message)

            except Exception as e:
                logger.error(f"Key validation failed for user {user.id}: {e}")

        db.commit()
```

### Crontab Entry

```cron
# Run at 3 AM daily
0 3 * * * /opt/reviewmaster/venv/bin/python /opt/reviewmaster/backend/cron/validate_keys.py
```

---

## UI Changes

### Landing Page

Replace pricing tiers with license redemption:

```
┌─────────────────────────────────────────────────────────────┐
│                    ReviewMaster Pro                         │
│         AI-Powered Review Response Generator                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              🎉 AppSumo Exclusive                      │ │
│  │                                                        │ │
│  │  Lifetime access to ReviewMaster Pro                   │ │
│  │  Bring your own OpenAI API key                         │ │
│  │                                                        │ │
│  │  ✓ Unlimited review responses                          │ │
│  │  ✓ Custom business profiles                            │ │
│  │  ✓ Brand voice customization                           │ │
│  │  ✓ Google Business integration                         │ │
│  │  ✓ Autopilot mode                                      │ │
│  │                                                        │ │
│  │  ┌─────────────────────────────────────────────────┐  │ │
│  │  │ Enter your license code                         │  │ │
│  │  └─────────────────────────────────────────────────┘  │ │
│  │                                                        │ │
│  │  [Redeem License]                                      │ │
│  │                                                        │ │
│  │  Already have an account? [Log in]                     │ │
│  │                                                        │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Don't have a license? Get one on AppSumo →                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Post-Login Dashboard

If no API key is set, show prominent banner:

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ Set up your OpenAI API key to start generating responses │
│                                                             │
│ You'll need an OpenAI API key to use ReviewMaster.          │
│ [Get an API key] [Add your key]                             │
└─────────────────────────────────────────────────────────────┘
```

### Remove/Hide

- Stripe pricing page
- Subscription management
- Upgrade prompts
- Trial limit warnings

---

## Files to Modify (from CT 313 baseline)

### Remove Entirely
- `backend/routes/stripe_checkout.py` - No Stripe needed
- Stripe-related imports in `routes/__init__.py`

### Modify Heavily
- `backend/config.py` - Add BYOK settings, remove Stripe settings
- `backend/database.py` - Add license_codes table, BYOK user fields
- `backend/routes/auth.py` - Add license redemption endpoint
- `backend/routes/reviews.py` - Use user's API key instead of server key
- `backend/services/review_generator.py` - Accept API key parameter
- `backend/templates/index.html` - New landing page with license redemption

### Add New
- `backend/routes/settings.py` - API key management endpoints
- `backend/utils/encryption.py` - Fernet encrypt/decrypt helpers
- `backend/cron/validate_keys.py` - Daily key validation
- `backend/models/license.py` - License code Pydantic models
- `scripts/generate_licenses.py` - Admin script to generate codes

### Minor Updates
- `backend/app_pro.py` - Remove Stripe router, add settings router
- `backend/middleware/` - No changes needed
- `backend/services/email_service.py` - Add key invalid notification template

---

## Scalability Considerations

### For AppSumo Traffic Spike

1. **Connection Pooling** - Already configured (5-20 connections)
2. **Rate Limiting** - Keep existing per-IP limits
3. **Async Operations** - Already using async OpenAI client
4. **Database Indexes** - Add index on `license_codes.code`

### Container Resources

Start with same as CT 313, increase if needed:
- 2 CPU cores
- 2GB RAM
- 10GB disk

### Monitoring

Reuse existing monitoring patterns:
- Health endpoint at `/health`
- Email alerts on failure
- Request audit logging

---

## Implementation Phases

### Phase 1: Core BYOK (MVP)
1. Clone codebase to new repo
2. Add license code table and redemption
3. Add API key encryption/storage
4. Modify review generator to use user's key
5. Update landing page for license redemption
6. Basic API key settings page

### Phase 2: Polish
1. Friendly error messages for all key states
2. Email notifications for key issues
3. Daily key validation cron
4. Onboarding flow improvements

### Phase 3: Deploy
1. Create CT 318 on Silvally
2. Set up Cloudflare tunnel
3. Generate initial batch of license codes
4. Test end-to-end flow
5. Update brain dump docs

---

## Security Checklist

- [ ] API keys encrypted at rest with Fernet
- [ ] Encryption key in `.env` only (not in code/DB)
- [ ] Keys decrypted only at moment of use
- [ ] Keys never logged or included in error messages
- [ ] License codes are single-use
- [ ] Rate limiting on redemption endpoint
- [ ] HTTPS enforced via Cloudflare
- [ ] Same security headers as CT 313

---

## Open Questions (Resolved)

| Question | Decision |
|----------|----------|
| Separate instance or same? | Separate (CT 318) |
| Key storage method? | Fernet encryption + env key |
| Feature set? | Full Pro |
| License model? | Single tier + code |
| Branding? | Same - ReviewMaster Pro |
| Domain? | appsumo.reviewmaster.built-simple.ai |
| Validation frequency? | On save + daily cron |
| Error handling? | Friendly messages |

---

## Appendix: Error Messages

### Key Validation Errors

| Error Type | User-Friendly Message |
|------------|----------------------|
| Invalid key | "This API key doesn't appear to be valid. Make sure you copied the entire key starting with 'sk-'. You can find your keys at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)" |
| Quota exceeded | "Your OpenAI account has run out of credits. Add credits at [platform.openai.com/billing](https://platform.openai.com/account/billing)" |
| Rate limited | "OpenAI is temporarily limiting requests. Please try again in a few minutes." |
| Revoked | "This API key has been revoked. Please create a new key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)" |
| Network error | "Couldn't connect to OpenAI. Please check your internet connection and try again." |

### License Redemption Errors

| Error Type | User-Friendly Message |
|------------|----------------------|
| Invalid code | "This license code isn't valid. Please check you entered it correctly, including any dashes." |
| Already redeemed | "This license code has already been used. Each code can only be redeemed once." |
| Revoked | "This license code is no longer valid. Please contact support@built-simple.ai" |
