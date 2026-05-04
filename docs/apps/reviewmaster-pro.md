# ReviewMaster Pro - AI Review Response Generator

**Last Updated:** May 4, 2026
**Status:** Production Ready (100%)

## Overview

### Main Instance (Subscription Model)

| Property | Value |
|----------|-------|
| **Container** | CT 313 on Silvally (192.168.1.52) |
| **IP Address** | 192.168.1.200:8001 |
| **Status** | Production Ready |
| **Model** | Stripe subscription ($29/month) |

### BYOK Instance (AppSumo / Lifetime License)

| Property | Value |
|----------|-------|
| **Container** | CT 318 on Silvally (192.168.1.52) |
| **IP Address** | 192.168.1.201:8001 |
| **Status** | Production Ready |
| **Model** | BYOK (Bring Your Own Key) |
| **GitHub Repo** | `reviewmaster-byok` |
| **Created** | April 28, 2026 |

## External URLs

- **Main App:** https://reviewmaster.built-simple.ai (Stripe subscriptions)
- **BYOK App:** https://byok-reviewmaster.built-simple.ai (License codes + user's own API key)

## What is ReviewMaster Pro?

AI-powered review response generator that helps businesses respond to customer reviews across multiple platforms with brand-appropriate, contextually relevant responses.

## Integrations

### TastyIgniter Integration (CT 315)

ReviewMaster Pro is integrated with the TastyIgniter restaurant platform via the `igniter/reviewmaster` extension.

| Property | Value |
|----------|-------|
| **TastyIgniter Container** | CT 315 on Silvally (192.168.1.53) |
| **Extension Path** | `/var/www/tastyigniter/extensions/igniter/reviewmaster/` |
| **Service Account** | tastyigniter@built-simple.ai |
| **Account Status** | Pro (unlimited usage) |

**How it works:**
1. TastyIgniter extension authenticates via JWT (login → access token → refresh token)
2. Access tokens cached for 14 minutes, refresh tokens for 30 days
3. Calls `POST /api/review/generate` to generate AI responses
4. Pro account enables unlimited response generation

**Configuration:**
```php
// config/reviewmaster.php
'api_url' => 'http://192.168.1.200:8001',
'api_email' => 'tastyigniter@built-simple.ai',
'api_password' => 'TastyReviews2025',
```

## Supported Platforms

- Google Reviews
- Yelp
- Facebook

## Features

- **Multi-Platform Support:** Google, Yelp, Facebook reviews
- **Customizable:** 5 configuration endpoints
  - Prompts
  - Templates
  - Profiles
  - Platform tuning
  - Analytics
- **User Tiers:**
  - Free: 3/day
  - Registered: 10/day
  - Pro: Unlimited @ $29/month
- **Full Auth:** bcrypt (12 rounds), access + refresh tokens, PostgreSQL
- **Google OAuth Sign-In:** Users can sign in with Google account
- **Stripe Integration:** LIVE keys configured (Dec 9, 2025)

## Technology Stack

- FastAPI (Python) with OpenAI GPT
- PostgreSQL database
- Comprehensive documentation (14 markdown files)

## Production Status

- External access working
- Authentication and payments functional
- All features operational
- Stripe LIVE keys configured
- Webhook signature verification enabled
- All Pro endpoints tested and working

## Quick Commands

### Main Instance (CT 313)

```bash
# Access container
ssh root@192.168.1.52 "pct enter 313"

# Check service status
ssh root@192.168.1.52 "pct exec 313 -- systemctl status reviewmaster"

# View logs
ssh root@192.168.1.52 "pct exec 313 -- journalctl -u reviewmaster -n 50"

# Restart service
ssh root@192.168.1.52 "pct exec 313 -- systemctl restart reviewmaster"

# Test access
curl https://reviewmaster.built-simple.ai/health

# Test TastyIgniter integration
ssh root@192.168.1.52 "pct exec 315 -- bash -c 'cd /var/www/tastyigniter && php artisan tinker --execute=\"print_r(app(\\\"reviewmaster.client\\\")->testConnection());\"'"
```

### BYOK Instance (CT 318)

```bash
# Access container
ssh root@192.168.1.52 "pct enter 318"

# Check service status
ssh root@192.168.1.52 "pct exec 318 -- systemctl status reviewmaster"

# View logs
ssh root@192.168.1.52 "pct exec 318 -- journalctl -u reviewmaster -n 50"

# Restart service
ssh root@192.168.1.52 "pct exec 318 -- systemctl restart reviewmaster"

# Test health
curl https://byok-reviewmaster.built-simple.ai/api/health

# Generate license codes
ssh root@192.168.1.52 "pct exec 318 -- bash -c 'source /opt/reviewmaster/venv/bin/activate && cd /opt/reviewmaster && PYTHONPATH=/opt/reviewmaster python3 scripts/generate_licenses.py --count 10 --source appsumo --notes \"Batch description\"'"

# List available license codes
ssh root@192.168.1.52 "pct exec 318 -- bash -c 'PGPASSWORD=byok2026 psql -U reviewmaster -h localhost -d reviewmaster_byok -c \"SELECT code, source, notes FROM license_codes WHERE redeemed_at IS NULL;\"'"
```

## Revenue Model

- $29/month for unlimited reviews
- Target: Restaurants, small businesses, agencies

## Monitoring

- Health checks every 5 minutes on port 8001
- Email alerts on failure

## Authentication

### Email/Password Authentication
- Standard signup/login with email and password
- bcrypt password hashing (12 rounds)
- JWT access tokens (15 min) + refresh tokens (30 days)

### Google OAuth Sign-In (Added April 29, 2026)
- Users can sign in with their Google account
- Creates account automatically if email doesn't exist
- Links Google ID to existing account if email matches
- **Separate from Google Business Profile OAuth** - signing in with Google does NOT grant access to business reviews
- Endpoints:
  - `GET /api/auth/google/login` - Initiates OAuth flow
  - `GET /api/auth/google/callback` - Handles OAuth callback
- Database: `google_id` column added to `users` table

### Google Business Profile OAuth
- **Requires separate authorization** even if user signed in with Google
- Requests `business.manage` scope for accessing reviews
- Users must explicitly connect their Business Profile in the Google tab

## Migration History

Migrated from Victini to Silvally: December 13, 2025
- CT 113 → CT 313

CT 115 (obsolete "configurable" version) deleted: December 13, 2025

**IMPORTANT (April 29, 2026):** CT 113 on Victini was discovered still running with IP 192.168.1.200 (same as CT 313 on Silvally). This caused routing conflicts where Victini's cloudflared tunnel was hitting the old container. CT 113 has been stopped. If issues recur, verify CT 113 remains stopped on Victini.

## BYOK Version Details

### Business Model
- One-time license code redemption (no recurring subscription)
- Users bring their own OpenAI API key
- Target audience: AppSumo marketplace, lifetime deal seekers

### Technical Implementation
- **Encryption:** Fernet symmetric encryption for API key storage
- **License Format:** `RMPRO-XXXXX-XXXXX-XXXXX`
- **API Key Storage:** Encrypted in PostgreSQL, decrypted on-demand
- **Key Validation:** Daily cron job validates all stored API keys
- **Config:** Environment variable `BYOK_ENCRYPTION_KEY` for Fernet

### API Endpoints (BYOK-specific)
- `POST /api/license/redeem` - Redeem a license code
- `POST /api/settings/api-key` - Save OpenAI API key
- `POST /api/settings/api-key/validate` - Validate API key
- `DELETE /api/settings/api-key` - Remove API key
- `GET /api/settings/api-key/status` - Check key status

### Database (reviewmaster_byok)
- PostgreSQL user: `reviewmaster` / password: `byok2026`
- Database: `reviewmaster_byok`
- Additional tables: `license_codes`
- Additional columns on `users`: `openai_api_key_encrypted`, `openai_key_status`, `license_code_id`

### License Code Generation
Generate new codes with:
```bash
ssh root@192.168.1.52 "pct exec 318 -- bash -c 'source /opt/reviewmaster/venv/bin/activate && cd /opt/reviewmaster && PYTHONPATH=/opt/reviewmaster python3 scripts/generate_licenses.py --count 10 --source appsumo --notes \"Description\"'"
```

List available codes:
```bash
ssh root@192.168.1.52 "pct exec 318 -- bash -c 'PGPASSWORD=byok2026 psql -U reviewmaster -h localhost -d reviewmaster_byok -c \"SELECT code, source FROM license_codes WHERE redeemed_at IS NULL;\"'"
```

**Note:** Never commit license codes to documentation - query the database for current codes.

### Code Cleanup (April 28, 2026)
Removed subscription/trial-related code that didn't belong in BYOK version:

**Backend changes:**
- Removed `/upgrade-to-pro` endpoint from `auth.py` (was Stripe placeholder)
- Fixed `/trial-status` endpoint to return BYOK-appropriate data (no trials)
- Added `/license-status` endpoint alias with proper license/API key status
- Removed `trial_response_limit` config from `config.py`
- Cleaned up `check_tier_limits()` in `reviews.py` - now only checks license codes

**Frontend changes:**
- Removed cancel subscription modal (was causing nested HTML comment bug)
- Updated schema.org pricing from "$29" to "0" (one-time license purchase)
- Fixed all URLs from reviewmaster.built-simple.ai → byok-reviewmaster.built-simple.ai
- Changed FAQ from "$29/month" to BYOK license code model
- Updated CTAs from trial messaging to license code redemption
- Changed usage display from trial count to license status
- Updated error fallback message to reference license codes

**Stripe code:** Properly commented out in `app_pro.py`, stripe router disabled.
**Upgrade functions:** `upgradeToPro()` redirects to Settings for license redemption.

**Legal pages:**
- `privacy.html` - Updated payment section to describe BYOK model (license codes, encrypted API keys)
- `terms.html` - Updated "Subscription and Payment" → "License and Access", removed $29/month references

**Static assets:**
- `sitemap.xml` - Fixed URLs to byok-reviewmaster.built-simple.ai

**Dead code (not removed, just unused):**
- Email templates for trial warnings and win-back - won't trigger because BYOK users never have "trial" tier
- Frontend trial JavaScript variables (isInTrial, trialResponsesUsed, etc.) - API returns is_trial:false, so code paths never execute

### Autopilot Worker (Added April 28, 2026)
The autopilot worker runs as a systemd service (`reviewmaster-autopilot`) and checks every 5 minutes for:
1. Users with autopilot enabled on Google Business connections
2. New reviews that haven't been responded to
3. Generates AI responses using the user's own OpenAI API key

**BYOK-specific checks:**
- User must have redeemed a license code
- User must have a valid OpenAI API key configured
- API key status must be "valid" or "checking"

**Service management:**
```bash
# Check status
ssh root@192.168.1.52 "pct exec 318 -- systemctl status reviewmaster-autopilot"

# View logs
ssh root@192.168.1.52 "pct exec 318 -- journalctl -u reviewmaster-autopilot -n 50"

# Restart
ssh root@192.168.1.52 "pct exec 318 -- systemctl restart reviewmaster-autopilot"
```

**Security verified (April 28, 2026):**
- Logging: No sensitive data (API keys, passwords) logged
- API responses: /user/me only returns safe fields (email, is_pro, created_at)
- Debug endpoints: /admin/overview has bug but NOT exposed (analytics router not included)
- Database: No sensitive data leakage via API
- License endpoints: Properly authenticated, no data exposure
- Settings endpoints: API key masking works correctly (sk-****)

**Security hardening (May 2, 2026):**
- License validation rate limiting: 10 requests per 5 minutes per IP
- Enhanced prompt injection detection: leetspeak, word-splitting, typos, synonyms
- Penetration test passed: JWT attacks, SQLi, IDOR, OAuth manipulation all blocked

## Related Documentation

- REVIEWMASTER_PRODUCTION_STATUS.md (in /root/)
- GitHub: `reviewmaster-byok` repo (BYOK version source)

---
*ReviewMaster Pro: Live Stripe keys configured: December 9, 2025*
*Migrated to Silvally: December 13, 2025*
*TastyIgniter integration: January 19, 2026*
*BYOK version deployed: April 28, 2026*
*BYOK code cleanup: April 28, 2026 - Removed trial/subscription remnants*
*BYOK security audit: April 28, 2026 - Verified logging, API responses, endpoints, database*
*BYOK autopilot worker: April 28, 2026 - Added systemd service, adapted for license-based access*
*Google OAuth Sign-In: April 29, 2026 - Added "Sign in with Google" option for user authentication*
*CT 113 cleanup: April 29, 2026 - Stopped orphaned CT 113 on Victini (was conflicting with CT 313 on Silvally, same IP 192.168.1.200)*
*BYOK pentest & hardening: May 2, 2026 - Added license rate limiting (10/5min), enhanced prompt injection detection (leetspeak, typos, synonyms)*
*Multi-location profiles: May 4, 2026 - Added support for multiple business profiles per user, auto-switching profiles when changing Google Business locations*

## Multi-Location Profile Support (Added May 4, 2026)

Users with multiple Google Business locations can now have separate business profiles for each location. When switching between locations in the Google Reviews UI, the associated profile automatically loads.

**Database changes:**
- Removed `UNIQUE` constraint on `business_profiles.user_id` (allows multiple profiles per user)
- Added `business_profile_id` column to `google_business_connections` table

**New API endpoints:**
- `GET /api/pro/business-profiles` - List all profiles for current user
- `GET /api/pro/business-profile/{id}` - Get specific profile by ID
- `POST /api/pro/business-profile/create` - Create new profile (allows multiple)
- `PUT /api/pro/business-profile/{id}` - Update specific profile
- `DELETE /api/pro/business-profile/{id}` - Delete specific profile

**Updated endpoints:**
- `POST /api/google-business/select-location` - Now accepts optional `business_profile_id` and returns linked profile data

**Frontend changes:**
- `selectBusiness()` function now loads and displays the associated profile when switching locations
- Added `updateProfileForm()` helper function
- Added `currentProfileId` tracking variable

**Bug fix (May 4, 2026): Error toast when switching businesses**
- **Issue:** Users saw "Failed to switch business" error toast even though the switch succeeded
- **Root cause:** `key_phrases_to_use` and `phrases_to_avoid` were returned as JSON strings from `select-location` endpoint, but frontend expected arrays. Calling `.join()` on strings threw an error.
- **Fix:** Added `parse_json_field()` helper in `google_oauth.py` to parse JSON fields before returning profile data
- **Files modified:** `/opt/reviewmaster/backend/routes/google_oauth.py`
