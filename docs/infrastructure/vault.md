# HashiCorp Vault - Secret Manager

**Last Updated:** April 18, 2026
**Status:** Running
**Location:** Giratina (192.168.1.100)

## Overview

| Property | Value |
|----------|-------|
| **Container** | happy-vault |
| **Image** | hashicorp/vault:1.15 |
| **Port** | 8200 |
| **UI** | http://192.168.1.100:8200 |
| **Storage** | File-based (Docker volume) |
| **Stack** | Part of happy-server docker-compose |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Giratina (192.168.1.100)                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  happy-vault (Port 8200)                            │   │
│  │  HashiCorp Vault 1.15                               │   │
│  │                                                     │   │
│  │  Secrets Engine: kv-v2 at secret/                   │   │
│  │                                                     │   │
│  │  Paths:                                             │   │
│  │  ├── secret/api-keys/      (API keys)              │   │
│  │  ├── secret/databases/     (DB credentials)        │   │
│  │  ├── secret/services/      (Per-service secrets)   │   │
│  │  ├── secret/ssh/           (SSH keys/passwords)    │   │
│  │  └── secret/cluster/       (Cluster-wide secrets)  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Volume: happy-vault-data                                   │
│  Network: happy-network                                     │
└─────────────────────────────────────────────────────────────┘
```

## Quick Commands

### Status & Health
```bash
# Check if Vault is sealed
docker exec happy-vault vault status

# Check current token
docker exec happy-vault vault token lookup
```

### Unseal (after restart)
```bash
# Option 1: Manual (run 3 times with different keys)
docker exec -it happy-vault vault operator unseal

# Option 2: Use the unseal script (fill in keys first)
/opt/happy-server/vault/unseal-vault.sh
```

### Login
```bash
docker exec -it happy-vault vault login
# Enter root token when prompted
```

### Managing Secrets

```bash
# Write a secret
docker exec happy-vault vault kv put secret/api-keys/anthropic api_key="sk-ant-xxx"

# Read a secret
docker exec happy-vault vault kv get secret/api-keys/anthropic

# List secrets in a path
docker exec happy-vault vault kv list secret/api-keys/

# Delete a secret
docker exec happy-vault vault kv delete secret/api-keys/anthropic
```

### Policies
```bash
# List policies
docker exec happy-vault vault policy list

# Read a policy
docker exec happy-vault vault policy read admin
```

## Policies

| Policy | Access |
|--------|--------|
| **root** | Full access (built-in) |
| **admin** | Full secret/* access |
| **read-api-keys** | Read-only secret/api-keys/* |
| **read-databases** | Read-only secret/databases/* |
| **cluster-wide** | Read secret/cluster/* and secret/api-keys/* |

Policy files: `/opt/happy-server/vault/policies/`

## Secret Paths Structure

```
secret/
├── api-keys/           # External API keys
│   ├── anthropic       # Anthropic API key
│   ├── openai          # OpenAI API key
│   ├── stripe          # Stripe keys
│   └── ...
├── databases/          # Database credentials
│   ├── postgres-main   # Main PostgreSQL
│   ├── redis           # Redis password
│   └── ...
├── services/           # Per-service secrets
│   ├── happy-server/   # Happy Server secrets
│   ├── fixit/          # FixIt API secrets
│   ├── pubmed/         # PubMed API secrets
│   └── ...
├── ssh/                # SSH credentials
│   └── cluster-nodes   # SSH passwords for cluster
└── cluster/            # Cluster-wide shared secrets
    └── shared-keys     # Keys shared across all nodes
```

## Accessing from Applications

### From Docker containers (same network)
```bash
# Use internal hostname
curl -H "X-Vault-Token: $VAULT_TOKEN" \
  http://vault:8200/v1/secret/data/api-keys/anthropic
```

### From host or other machines
```bash
# Use IP address
curl -H "X-Vault-Token: $VAULT_TOKEN" \
  http://192.168.1.100:8200/v1/secret/data/api-keys/anthropic
```

### Environment variable pattern
```bash
# Fetch and export
export ANTHROPIC_API_KEY=$(docker exec happy-vault vault kv get -field=api_key secret/api-keys/anthropic)
```

## Creating Service Tokens

Create tokens with limited policies for services:

```bash
# Create token for a service that only needs API keys
docker exec happy-vault vault token create -policy=read-api-keys -ttl=720h

# Create token for cluster-wide access
docker exec happy-vault vault token create -policy=cluster-wide -ttl=720h
```

## Files

| Path | Purpose |
|------|---------|
| `/opt/happy-server/vault/` | Vault config directory |
| `/opt/happy-server/vault/policies/` | Policy HCL files |
| `/opt/happy-server/vault/unseal-vault.sh` | Auto-unseal script (fill in keys) |

## After Restart

Vault seals itself on restart. To unseal:

1. **Manual:** Run `docker exec -it happy-vault vault operator unseal` three times with different unseal keys
2. **Script:** Edit `/opt/happy-server/vault/unseal-vault.sh` with your keys, then run it

After unsealing, login: `docker exec -it happy-vault vault login`

## Security Notes

- **Unseal keys:** Store securely, need 3 of 5 to unseal
- **Root token:** Full admin access, store securely
- **Auto-unseal script:** If using, keep chmod 700 and root-only access
- **Network:** Only exposed on local network (192.168.1.x), not internet

## Troubleshooting

### Vault is sealed
```bash
docker exec happy-vault vault status
# If Sealed = true, run unseal commands
```

### Permission denied
```bash
# Check if logged in
docker exec happy-vault vault token lookup

# If error, login again
docker exec -it happy-vault vault login
```

### Container not starting
```bash
docker logs happy-vault
```

---
*HashiCorp Vault - Secret management for the pallet-town cluster*
*Running on Giratina as part of happy-server stack*
