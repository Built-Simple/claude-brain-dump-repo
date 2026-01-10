# Stripe API Key Management

**Last Updated:** January 9, 2026

## Overview

Live Stripe API keys are stored centrally on Giratina and synced to containers as needed.

**NEVER hardcode Stripe keys in code or commit them to git**

## Key Storage Location

```
/etc/stripe/
├── keys.env              # Live keys (sk_live_*, pk_live_*)
└── sync-to-container.sh  # Sync script for containers
```

**Permissions:** Directory and files are `700`/`600` (root only)

## Viewing Keys (Safely)

```bash
source /etc/stripe/keys.env
echo "SK: ${STRIPE_SECRET_KEY:0:12}..."
echo "PK: ${STRIPE_PUBLISHABLE_KEY:0:12}..."
```

## Syncing Keys to Containers

### For Containers on Giratina
```bash
/etc/stripe/sync-to-container.sh local <VMID> <path/to/.env>

# Example:
/etc/stripe/sync-to-container.sh local 103 /var/www/talon-api/.env
```

### For Containers on Other Hosts
```bash
/etc/stripe/sync-to-container.sh <host-ip> <VMID> <path/to/.env>

# Example:
/etc/stripe/sync-to-container.sh 192.168.1.115 113 /opt/reviewmaster/.env
```

### After Syncing
Restart the service to pick up new keys:
```bash
# Example for ReviewMaster:
ssh root@192.168.1.52 "pct exec 313 -- systemctl restart reviewmaster"
```

## Services Using Stripe

| Service | Container | Host | .env Path |
|---------|-----------|------|-----------|
| FixIt API | CT 103 | Giratina | /var/www/talon-api/.env |
| ReviewMaster Pro | CT 313 | Silvally | /opt/reviewmaster/.env |
| PubMed API | CT 108 | Giratina | /opt/pubmed-web/.env |
| ArXiv API | CT 122 | Giratina | /opt/arxiv/.env |
| Wikipedia API | CT 213 | Hoopa | /opt/wiki-api/.env |

## Webhook Secrets

Each service needs its own webhook secret from Stripe CLI:

```bash
# Get webhook secret (run on Giratina):
stripe listen --print-secret

# Add to service .env as STRIPE_WEBHOOK_SECRET
```

### Webhook Endpoints

| Service | Webhook URL |
|---------|-------------|
| FixIt | https://fixitapi.built-simple.ai/webhook/ |
| ReviewMaster | https://reviewmaster.built-simple.ai/webhook |
| PubMed | https://pubmed.built-simple.ai/webhook |

## Adding Keys to a New Service

1. Ensure `.env` has placeholder lines:
   ```
   STRIPE_SECRET_KEY=
   STRIPE_PUBLISHABLE_KEY=
   STRIPE_WEBHOOK_SECRET=
   ```

2. Run sync script:
   ```bash
   /etc/stripe/sync-to-container.sh <host> <vmid> <env-path>
   ```

3. Set up webhook forwarding:
   ```bash
   stripe listen --forward-to <service-url>/webhook
   ```

4. Add webhook secret to `.env`

5. Restart service

## Security Best Practices

- Keys stored only on Giratina, synced to containers
- Never commit keys to git
- Use environment variables, not hardcoded values
- Webhook signature verification enabled on all services
- Regular key rotation (recommended quarterly)

## Pricing Tiers (Standard)

All Built-Simple APIs use the same pricing:
- **Free Tier:** Limited requests (100/month typical)
- **Pro Tier:** $29/month for increased limits

---
*Stripe key management system created: December 9, 2025*
