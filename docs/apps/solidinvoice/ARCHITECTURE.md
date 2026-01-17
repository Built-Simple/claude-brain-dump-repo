# SolidInvoice Architecture Documentation

**Last Updated:** January 17, 2026
**Version:** 2.3.14
**Location:** CT 117 on Victini (192.168.1.117)

---

## Directory Structure

```
/var/www/solidinvoice/
├── assets/                  # Frontend assets (SCSS, JS controllers)
│   ├── controllers/         # Stimulus.js controllers
│   ├── img/                 # Source images
│   └── scss/                # SCSS stylesheets
├── bin/                     # CLI executables
│   └── console              # Symfony console (CRITICAL - all CLI ops)
├── config/                  # Symfony configuration
│   ├── packages/            # Bundle configs (doctrine, security, etc.)
│   ├── routes/              # Route definitions
│   └── bundles.php          # Bundle registration
├── migrations/              # Doctrine database migrations
├── public/                  # Web root (nginx document root)
│   ├── index.php            # Single entry point (CRITICAL)
│   ├── bundles/             # Installed bundle assets
│   ├── css/                 # Compiled CSS
│   └── js/                  # Compiled JavaScript
├── src/                     # Application source code
│   ├── *Bundle/             # Symfony bundles (see BUNDLES section)
│   └── Kernel.php           # Application kernel
├── templates/               # Twig templates
├── var/                     # Runtime files (CRITICAL - permissions!)
│   ├── cache/               # Compiled templates, DI container
│   ├── log/                 # Application logs
│   └── data.db              # SQLite database (BUSINESS DATA!)
├── vendor/                  # Composer dependencies (DO NOT MODIFY)
├── .env                     # Environment configuration
└── composer.json            # PHP dependencies
```

---

## Bundle Architecture

SolidInvoice uses Symfony's bundle system. Each bundle is a self-contained feature module.

### Core Business Bundles

| Bundle | Purpose | Entities | Critical? |
|--------|---------|----------|-----------|
| **ClientBundle** | Customer management | Client, Contact, Address, Credit | YES |
| **InvoiceBundle** | Invoice operations | Invoice, Line, RecurringInvoice | YES |
| **QuoteBundle** | Quote/estimate management | Quote, Line | YES |
| **PaymentBundle** | Payment processing | Payment, PaymentMethod | YES |
| **TaxBundle** | Tax rate management | Tax | YES |

### Supporting Bundles

| Bundle | Purpose | Dependencies |
|--------|---------|--------------|
| **CoreBundle** | Shared utilities, traits, base classes | - |
| **UserBundle** | Authentication, API tokens | Security |
| **SettingsBundle** | Application configuration | - |
| **MailerBundle** | Email sending | Symfony Mailer |
| **NotificationBundle** | Multi-channel notifications | Mailer |
| **CronBundle** | Scheduled tasks | Zenstruck Schedule |
| **DashboardBundle** | Admin dashboard | All bundles |
| **DataGridBundle** | List/table UI components | - |
| **FormBundle** | Form helpers | - |
| **MenuBundle** | Navigation menus | KnpMenuBundle |
| **MoneyBundle** | Currency/money handling | brick/math |
| **InstallBundle** | Web installer wizard | All (first run only) |
| **ApiBundle** | REST API (API Platform) | All entities |
| **SaasBundle** | Multi-tenant SaaS features | Optional |

---

## Entity Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                         COMPANIES                                │
│  (Multi-tenant root - all data belongs to a company)            │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
   ┌─────────┐         ┌─────────┐         ┌─────────┐
   │  USERS  │         │ CLIENTS │         │SETTINGS │
   └─────────┘         └────┬────┘         └─────────┘
                            │
           ┌────────────────┼────────────────┐
           │                │                │
           ▼                ▼                ▼
      ┌─────────┐     ┌──────────┐     ┌─────────┐
      │CONTACTS │     │ QUOTES   │     │INVOICES │
      │(people) │     │(estimates)│    │(billing)│
      └─────────┘     └────┬─────┘     └────┬────┘
                           │                │
                           │  (converts to) │
                           └───────►────────┘
                                    │
                                    ▼
                              ┌──────────┐
                              │ PAYMENTS │
                              └──────────┘
```

### Key Relationships

```php
// DEPENDENCY: Client is the central entity
Client -> hasMany -> Contacts
Client -> hasMany -> Quotes
Client -> hasMany -> Invoices
Client -> hasMany -> Payments
Client -> hasOne  -> Credit (prepaid balance)

// DEPENDENCY: Quote can convert to Invoice
Quote -> belongsTo -> Client
Quote -> hasMany   -> QuoteLines
Quote -> hasOne    -> Invoice (after acceptance)

// DEPENDENCY: Invoice is the billing record
Invoice -> belongsTo -> Client
Invoice -> belongsTo -> Quote (optional, if converted)
Invoice -> hasMany   -> InvoiceLines
Invoice -> hasMany   -> Payments
Invoice -> hasMany   -> Contacts (recipients)

// DEPENDENCY: Payment tracks money received
Payment -> belongsTo -> Invoice
Payment -> belongsTo -> Client
Payment -> belongsTo -> PaymentMethod
```

---

## State Machines (Workflows)

### Invoice Status Flow

```
                    ┌──────────────────────────────────────────┐
                    │                                          │
                    ▼                                          │
┌─────┐  new   ┌───────┐  accept  ┌─────────┐  pay    ┌──────┐│
│ NEW │───────►│ DRAFT │─────────►│ PENDING │────────►│ PAID ││
└─────┘        └───────┘          └────┬────┘         └──────┘│
                   │                   │                  │    │
                   │ cancel            │ overdue          │    │
                   ▼                   ▼                  │    │
              ┌──────────┐       ┌─────────┐              │    │
              │CANCELLED │       │ OVERDUE │──────────────┘    │
              └────┬─────┘       └────┬────┘     pay           │
                   │                  │                        │
                   │ reopen           │ cancel                 │
                   └──────────────────┘                        │
                              │                                │
                              ▼                                │
                         ┌──────────┐     archive              │
                         │ ARCHIVED │◄─────────────────────────┘
                         └──────────┘
```

### Quote Status Flow

```
┌─────┐  new   ┌───────┐  send    ┌─────────┐  accept  ┌──────────┐
│ NEW │───────►│ DRAFT │─────────►│ PENDING │─────────►│ ACCEPTED │
└─────┘        └───────┘          └────┬────┘          └────┬─────┘
                   │                   │                    │
                   │ cancel            │ decline            │ (converts
                   ▼                   ▼                    │  to Invoice)
              ┌──────────┐       ┌──────────┐               │
              │CANCELLED │       │ DECLINED │               │
              └──────────┘       └──────────┘               │
                   │                   │                    │
                   └─────────┬─────────┘                    │
                             │ reopen                       │
                             ▼                              │
                        ┌───────┐                           │
                        │ DRAFT │                           │
                        └───────┘                           │
                                                            │
                         ┌──────────┐     archive           │
                         │ ARCHIVED │◄──────────────────────┘
                         └──────────┘
```

### Transitions Reference

```php
// BUSINESS RULE: Invoice transitions
InvoiceGraph::TRANSITION_NEW      // new -> draft
InvoiceGraph::TRANSITION_ACCEPT   // draft/new -> pending
InvoiceGraph::TRANSITION_CANCEL   // draft/pending/overdue -> cancelled
InvoiceGraph::TRANSITION_OVERDUE  // pending -> overdue
InvoiceGraph::TRANSITION_PAY      // pending/overdue -> paid
InvoiceGraph::TRANSITION_REOPEN   // cancelled -> draft
InvoiceGraph::TRANSITION_ARCHIVE  // new/draft/cancelled/paid -> archived

// BUSINESS RULE: Quote transitions
QuoteGraph::TRANSITION_NEW        // new/cancelled -> draft
QuoteGraph::TRANSITION_SEND       // new/draft -> pending
QuoteGraph::TRANSITION_CANCEL     // draft/pending -> cancelled
QuoteGraph::TRANSITION_DECLINE    // new/draft/pending -> declined
QuoteGraph::TRANSITION_ACCEPT     // pending -> accepted
QuoteGraph::TRANSITION_REOPEN     // declined/cancelled -> draft
QuoteGraph::TRANSITION_ARCHIVE    // all except archived -> archived
```

---

## Payment Gateway Integration

### Supported Gateways

| Gateway | Type | Config Required |
|---------|------|-----------------|
| **Stripe Checkout** | Online | API Key, Secret |
| **Stripe.js** | Online | API Key, Secret |
| **PayPal Express** | Online | Client ID, Secret |
| **PayPal Pro** | Online | API Credentials |
| **Authorize.net AIM** | Online | Login, Key |
| **Klarna Checkout** | Online | Merchant ID, Secret |
| **Klarna Invoice** | Online | Merchant ID, Secret |
| **Be2Bill** | Online | Identifier, Password |
| **Payex** | Online | Account, Key |
| **Credit** | Offline | None (uses client credit) |
| **Cash** | Offline | None |
| **Bank Transfer** | Offline | None |
| **Custom** | Offline | None |

### Payment Flow

```
1. Invoice sent to client
2. Client clicks "Pay Now" link
3. Redirected to /payment/capture/{token}
4. Select payment method
5. If online gateway:
   a. Redirect to gateway
   b. Process payment
   c. Redirect back with status
   d. Update invoice balance
6. If offline:
   a. Mark as pending
   b. Admin confirms manually
7. If balance == 0:
   a. Transition invoice to PAID
   b. Send confirmation email
```

---

## API Endpoints

SolidInvoice uses API Platform. All endpoints at `/api/`.

### Resources

| Resource | Endpoint | Methods |
|----------|----------|---------|
| Clients | `/api/clients` | GET, POST, PATCH, DELETE |
| Contacts | `/api/clients/{id}/contacts` | GET, POST, PATCH, DELETE |
| Invoices | `/api/invoices` | GET, POST, PATCH, DELETE |
| Quotes | `/api/quotes` | GET, POST, PATCH, DELETE |
| Payments | `/api/payments` | GET, POST |

### Authentication

```
// EXTERNAL: API Token authentication
Authorization: Bearer {api_token}

// GOTCHA: Tokens are per-user, stored in api_tokens table
// GOTCHA: Token history logged in api_token_history
```

---

## Cron Jobs

Scheduled via Zenstruck ScheduleBundle.

```bash
# CRITICAL: Must run every minute
* * * * * php /var/www/solidinvoice/bin/console cron:run -e prod -n

# What it does:
# - Generates invoices from recurring templates
# - Sends payment reminders
# - Marks overdue invoices
# - Processes scheduled notifications
```

---

## File Permissions

```bash
# CRITICAL: These directories must be writable by www-data
chown -R www-data:www-data /var/www/solidinvoice
chmod -R 755 /var/www/solidinvoice
chmod -R 777 /var/www/solidinvoice/var

# BREAKING: If var/ not writable, app fails completely
```

---

## Performance Considerations

| Area | Concern | Mitigation |
|------|---------|------------|
| Cache | Symfony compiles DI container | Clear after config changes |
| Database | SQLite single-writer lock | Suitable for <100 concurrent |
| Assets | Webpack builds | Pre-compiled in dist |
| API | No rate limiting built-in | Use Cloudflare |

---

*Documentation generated: January 17, 2026*
