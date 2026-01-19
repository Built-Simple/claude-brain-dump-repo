# TastyIgniter Restaurant System

**Last Updated:** January 19, 2026
**Status:** Multi-tenant restaurant ordering system with POS, KDS, and AI Receptionists

## Overview

Complete restaurant management system powered by TastyIgniter. Supports multiple restaurants through a single TastyIgniter backend with separate POS, KDS, and AI Receptionist instances per location.

---

## Architecture: Multi-Tenant Restaurant Ordering

```
TastyIgniter Backend (CT 315 on Silvally)
    ├── Location 1: Legion Sports Bar (54 menu items)
    ├── Location 2: Peinto Thai Kitchen (30 menu items)
    └── Location N: Future restaurants...

Frontend Apps (Mew - DigitalOcean)
    ├── tastyigniter-pos (port 3005) → POS System (all locations)
    ├── tastyigniter-kds (port 3004) → Kitchen Display System
    ├── tastyigniter-receptionist (port 3002) → Legion Sports Bar AI
    ├── peinto-receptionist (port 3003) → Peinto Thai [planned]
    └── future apps...
```

### Benefits
- **Separate billing** - Each receptionist has own API keys for cost tracking
- **Separate phone numbers** - Each restaurant gets dedicated Twilio number
- **Independent uptime** - One crashing doesn't affect others
- **Custom personalities** - Each AI can have different tone/persona
- **Lightweight** - Each app ~30-75MB RAM

---

## TastyIgniter POS System

| Property | Value |
|----------|-------|
| **Server** | Mew (137.184.235.100) - DigitalOcean droplet |
| **Port** | 3005 |
| **External URL** | https://pos.built-simple.ai (DNS pending) |
| **Location ID** | 1 (Legion Sports Bar) |
| **Status** | ✅ Running |
| **Code Location** | /opt/tastyigniter-pos/ |

### Features
- **Table Map Editor** - Grid-based floor plan with drag/drop tables
- **Host View** - Table overview, seating walk-ins, reservation status
- **Server View** - Active tables, order taking, course management
- **Kitchen View** - Links to KDS
- **Checkout View** - Print checks, close tables, payment processing

### Views (Routes)
| Route | Purpose |
|-------|---------|
| `/` or `/host` | Host view - table overview and seating |
| `/setup` | Table map editor (manager only) |
| `/server` | Server view - order taking |
| `/kitchen` | Kitchen display redirect |
| `/checkout` | Payment and check closing |

### WebSocket Events
Real-time updates via WebSocket at `/ws`:
- `table_status_changed` - Table occupied/available/dirty
- `order_created` - New order started
- `order_status_changed` - Order status update
- `table_created/updated/deleted` - Table changes

### Quick Commands

```bash
# SSH to Mew
ssh root@137.184.235.100

# View logs
pm2 logs tastyigniter-pos

# Restart
pm2 restart tastyigniter-pos --update-env

# Health check
curl http://localhost:3005/health
```

---

## TastyIgniter KDS (Kitchen Display System)

| Property | Value |
|----------|-------|
| **Server** | Mew (137.184.235.100) - DigitalOcean droplet |
| **Port** | 3004 |
| **External URL** | https://kds.built-simple.ai (DNS pending) |
| **Location ID** | 1 (Legion Sports Bar) |
| **Status** | ✅ Running |
| **Code Location** | /opt/tastyigniter-kds/ |

### Features
- Kitchen-optimized dark theme
- Auto-refresh every 5 seconds
- Order cards with status colors
- Elapsed time warnings (yellow/red)
- Sound notifications for new orders
- Status workflow: Received → Processing → Ready

### Quick Commands

```bash
pm2 logs tastyigniter-kds
pm2 restart tastyigniter-kds
curl http://localhost:3004/health
```

---

## TastyIgniter Backend (CT 315)

| Property | Value |
|----------|-------|
| **Container** | CT 315 on Silvally (192.168.1.52) |
| **IP** | 192.168.1.53 |
| **External URL** | https://tastyigniter.built-simple.ai |
| **API Token** | `2|DL4X4wUrS5cyDFgG3Z9YBiuj7d7Jqz5kjDIeP8HS2eulUAh9ttzraCSdTWX0RGXqfhDJPyb4FnnLhJnM` |
| **Status** | ✅ Production Ready |

### Locations

| ID | Restaurant | Menu Items | Status |
|----|------------|------------|--------|
| 1 | Legion Sports Bar | 54 | ✅ Active |
| 2 | Peinto Thai Kitchen | 30 | ✅ Active |

### API Endpoints

```bash
# Get all menus (paginated)
curl -s https://tastyigniter.built-simple.ai/api/menus \
  -H "Authorization: Bearer <token>"

# Get menus for specific location
curl -s "https://tastyigniter.built-simple.ai/api/menus?location=1" \
  -H "Authorization: Bearer <token>"

# Get locations
curl -s https://tastyigniter.built-simple.ai/api/locations \
  -H "Authorization: Bearer <token>"

# Get categories
curl -s https://tastyigniter.built-simple.ai/api/categories \
  -H "Authorization: Bearer <token>"
```

---

## TastyIgniter Receptionist (Legion Sports Bar)

| Property | Value |
|----------|-------|
| **Server** | Mew (137.184.235.100) - DigitalOcean droplet |
| **Port** | 3002 |
| **External URL** | https://tastyreceptionist.built-simple.ai |
| **Location ID** | 1 (Legion Sports Bar) |
| **Status** | ✅ Running |
| **Code Location** | /opt/tastyigniter-receptionist/ |

### Features
- Real-time voice ordering via Twilio + WebSocket
- Deepgram STT (speech-to-text)
- OpenAI GPT-4 with function calling for menu search, order management
- Deepgram TTS (text-to-speech)
- TastyIgniter API integration for menu and orders
- Multi-location support via LOCATION_ID env var

### Environment Variables

```bash
PORT=3002
DEEPGRAM_API_KEY=<key>
OPENAI_API_KEY=<key>
TASTYIGNITER_URL=https://tastyigniter.built-simple.ai
TASTYIGNITER_API_KEY=<token>
TRANSFER_NUMBER=+17027045706
LOCATION_ID=1  # Legion Sports Bar
```

### Quick Commands

```bash
# SSH to Mew
ssh root@137.184.235.100

# View logs
pm2 logs tastyigniter-receptionist

# Restart
pm2 restart tastyigniter-receptionist --update-env

# Health check
curl https://tastyreceptionist.built-simple.ai/health
```

### Twilio Configuration

Set webhook URL in Twilio Console:
- **Webhook URL:** `https://tastyreceptionist.built-simple.ai/voice`
- **HTTP Method:** POST

---

## Professional Receptionist (Built Simple AI - PRODUCTION)

| Property | Value |
|----------|-------|
| **Server** | Mew (137.184.235.100) - DigitalOcean droplet |
| **Port** | 3000 |
| **Phone** | +1 (702) 704-5706 (Twilio) |
| **External URL** | https://receptionist.built-simple.ai |
| **Status** | ✅ Production Ready |
| **Code Location** | /opt/professional-receptionist/ |

### Features
- **Deepgram Flux STT** - Semantic end-of-turn detection
- Real-time voice conversations via WebSocket
- LLM pre-warming for faster responses (~500-800ms)
- Product knowledge for all Built Simple APIs
- Calendar integration (Google Calendar)
- Appointment booking capabilities

### Product Knowledge

The AI knows about all Built Simple products:
- **FixIt API** - 18.5M Stack Overflow solutions
- **WikiSearch API** - 4.8M Wikipedia articles
- **PubMed Search** - 4.5M medical papers
- **ArXiv API** - 2.77M research papers
- **ReviewMaster AI** - Google Business Profile integration

---

## Adding a New Restaurant

### 1. Add Location in TastyIgniter

```sql
INSERT INTO ti_locations (
  location_name, location_email, description,
  location_address_1, location_city, location_state, location_postcode,
  location_country_id, location_telephone, location_status
) VALUES (
  'Restaurant Name', 'email@restaurant.com', 'Description',
  '123 Main St', 'City', 'ST', '12345',
  223, '555-555-5555', 1
);
```

### 2. Add Menu Items

```sql
-- Add categories (adjust IDs)
INSERT INTO ti_categories (name, description, priority, status) VALUES
('Appetizers', 'Starters', 1, 1);

-- Add menu items
INSERT INTO ti_menus (menu_name, menu_description, menu_price, menu_status) VALUES
('Item Name', 'Description', 15.00, 1);

-- Link to location
INSERT INTO ti_locationables (location_id, locationable_id, locationable_type)
VALUES (NEW_LOCATION_ID, MENU_ID, 'menus');

-- Link to category
INSERT INTO ti_menu_categories (menu_id, category_id)
VALUES (MENU_ID, CATEGORY_ID);
```

### 3. Create Receptionist Instance

```bash
# On Mew
cp -r /opt/tastyigniter-receptionist /opt/newrestaurant-receptionist
cd /opt/newrestaurant-receptionist

# Update .env
cat > .env << EOF
PORT=3003
DEEPGRAM_API_KEY=<new-key-for-billing>
OPENAI_API_KEY=<new-key-for-billing>
TASTYIGNITER_URL=https://tastyigniter.built-simple.ai
TASTYIGNITER_API_KEY=<token>
TRANSFER_NUMBER=+15551234567
LOCATION_ID=NEW_LOCATION_ID
EOF

# Start with PM2
pm2 start server.js --name newrestaurant-receptionist
pm2 save
```

### 4. Configure Cloudflare Tunnel

```yaml
# Add to /etc/cloudflared/config.yml on Mew
- hostname: newrestaurant.built-simple.ai
  service: http://localhost:3003
```

### 5. Configure Twilio Phone Number

- Buy new Twilio number
- Set webhook: `https://newrestaurant.built-simple.ai/voice`

---

## Operational Costs (Per Restaurant)

| Service | Monthly Cost |
|---------|--------------|
| Twilio | ~$5-20 |
| OpenAI | ~$10-50 |
| Deepgram | ~$5-15 |
| **Per-Restaurant** | ~$20-85/month |

Shared infrastructure (Mew droplet): ~$24/month

---

## CT 116: Thai Receptionist (Peinto Thai Kitchen) - DEPRECATED

**Note:** Replaced by TastyIgniter multi-location system. Peinto is now Location ID 2 in TastyIgniter.

| Property | Value |
|----------|-------|
| **Container** | CT 116 on Victini (192.168.1.115) |
| **Status** | ⚠️ Deprecated - Use TastyIgniter receptionist |

---

## CT 114: Sarcastic Receptionist (Generic) - INACTIVE

| Property | Value |
|----------|-------|
| **Container** | CT 114 on Victini (192.168.1.115) |
| **Status** | ⚠️ Inactive |
| **Voice** | Deadpool personality |

---

## Related Files

- `/opt/tastyigniter-pos/` on Mew - POS System
- `/opt/tastyigniter-kds/` on Mew - Kitchen Display System
- `/opt/tastyigniter-receptionist/` on Mew - AI Receptionist
- `/opt/professional-receptionist/` on Mew - Built Simple AI Receptionist
- TastyIgniter Backend: CT 315 on Silvally (192.168.1.52)

---

## POS Database Schema

New tables added for POS functionality:

| Table | Purpose |
|-------|---------|
| `ti_table_maps` | Floor plans (grid-based) |
| `ti_tables` | Table positions on grid |
| `ti_table_status` | Real-time table state |
| `ti_pos_staff` | Servers, hosts, managers |
| `ti_order_checks` | Split bill support |
| `ti_order_check_items` | Items per check |

Modified columns in `ti_orders`:
- `table_id` - Links order to table
- `guest_count` - Number of guests
- `server_id` - Assigned server
- `course_status` - JSON for course tracking

---

## Manual DNS Setup Required

Both KDS and POS need DNS CNAME records added in Cloudflare:

| Subdomain | Target |
|-----------|--------|
| `kds` | `fbe2b8f5-9538-499c-a5a1-d8e5f85cbb73.cfargotunnel.com` |
| `pos` | `fbe2b8f5-9538-499c-a5a1-d8e5f85cbb73.cfargotunnel.com` |

Until DNS is configured, access via local network:
- KDS: `http://137.184.235.100:3004`
- POS: `http://137.184.235.100:3005`

---
*Multi-tenant architecture: January 19, 2026*
*POS System added: January 19, 2026*
