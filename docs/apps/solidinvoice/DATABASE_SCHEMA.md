# SolidInvoice Database Schema

**Last Updated:** January 17, 2026
**Database:** SQLite
**Location:** /var/www/solidinvoice/var/data.db

---

## Entity-Relationship Overview

```
┌─────────────┐
│  companies  │  (Multi-tenant root)
└──────┬──────┘
       │ 1:N
       ├────────────────────────────────────────────────────────────┐
       │                    │                    │                  │
       ▼                    ▼                    ▼                  ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐    ┌──────────┐
│   clients   │      │    users    │      │  tax_rates  │    │app_config│
└──────┬──────┘      └─────────────┘      └─────────────┘    └──────────┘
       │ 1:N
       ├──────────────┬──────────────┬──────────────┐
       │              │              │              │
       ▼              ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  contacts   │ │   quotes    │ │  invoices   │ │  payments   │
└─────────────┘ └──────┬──────┘ └──────┬──────┘ └─────────────┘
                       │ 1:N           │ 1:N
                       ▼               ▼
                ┌─────────────┐ ┌─────────────┐
                │ quote_lines │ │invoice_lines│
                └─────────────┘ └─────────────┘
```

---

## Core Tables

### companies
```sql
-- CRITICAL: Multi-tenant root entity
-- DEPENDENCY: ALL business data references company_id
CREATE TABLE companies (
    id BLOB PRIMARY KEY,        -- ULID (DC2Type:ulid)
    name VARCHAR(255) NOT NULL
);
-- GOTCHA: Deleting company cascades ALL business data
```

### clients
```sql
-- CRITICAL: Customer records
-- DEPENDENCY: invoices, quotes, payments all reference clients
CREATE TABLE clients (
    id BLOB PRIMARY KEY,                    -- ULID
    company_id BLOB NOT NULL,               -- FK -> companies
    name VARCHAR(125) NOT NULL,             -- UNIQUE per company
    website VARCHAR(125),
    status VARCHAR(25) NOT NULL,            -- 'active', 'inactive', 'archived'
    currency VARCHAR(3),                    -- ISO 4217 code (USD, EUR, etc.)
    vat_number VARCHAR(255),
    archived BOOLEAN DEFAULT NULL,
    created DATETIME NOT NULL,
    updated DATETIME NOT NULL,
    UNIQUE(name, company_id)
);
-- BUSINESS RULE: Client name must be unique within company
-- SIDE EFFECT: Deleting client cascades quotes, invoices, payments
```

### contacts
```sql
-- CRITICAL: People at client companies who receive invoices
-- DEPENDENCY: invoices and quotes link to contacts for delivery
CREATE TABLE contacts (
    id BLOB PRIMARY KEY,
    client_id BLOB,                         -- FK -> clients
    company_id BLOB NOT NULL,               -- FK -> companies
    firstName VARCHAR(125) NOT NULL,
    lastName VARCHAR(125),
    email VARCHAR(255) NOT NULL,            -- INDEXED for lookups
    created DATETIME NOT NULL,
    updated DATETIME NOT NULL
);
-- GOTCHA: Contact deleted = invoice/quote loses recipient reference
```

### contact_types
```sql
-- Configuration for additional contact details (phone types, social, etc.)
CREATE TABLE contact_types (
    id BLOB PRIMARY KEY,
    company_id BLOB NOT NULL,
    name VARCHAR(45) NOT NULL,              -- e.g., "Mobile", "Work Phone"
    type VARCHAR(45) NOT NULL,              -- field type
    field_options CLOB,                     -- DC2Type:array
    required BOOLEAN NOT NULL,
    UNIQUE(name, company_id)
);
```

### contact_details
```sql
-- Additional contact information (phone numbers, etc.)
CREATE TABLE contact_details (
    id BLOB PRIMARY KEY,
    contact_type_id BLOB,                   -- FK -> contact_types
    contact_id BLOB,                        -- FK -> contacts
    company_id BLOB NOT NULL,
    value CLOB NOT NULL,
    created DATETIME NOT NULL,
    updated DATETIME NOT NULL
);
```

### addresses
```sql
-- Client billing/shipping addresses
CREATE TABLE addresses (
    id BLOB PRIMARY KEY,
    client_id BLOB,                         -- FK -> clients
    company_id BLOB NOT NULL,
    street1 VARCHAR(255),
    street2 VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip VARCHAR(255),
    country VARCHAR(255),
    created DATETIME NOT NULL,
    updated DATETIME NOT NULL
);
```

### client_credit
```sql
-- CRITICAL: Prepaid credit balance per client
-- BUSINESS RULE: Can be applied to invoices as payment
CREATE TABLE client_credit (
    id BLOB PRIMARY KEY,
    client_id BLOB UNIQUE,                  -- FK -> clients (1:1)
    company_id BLOB NOT NULL,
    value_amount BIGINT NOT NULL,           -- DC2Type:BigInteger (cents)
    created DATETIME NOT NULL,
    updated DATETIME NOT NULL
);
-- GOTCHA: Amount stored in cents (divide by 100 for display)
```

---

## Invoice Tables

### invoices
```sql
-- CRITICAL: Primary billing records
-- DEPENDENCY: payments, invoice_lines, invoice_contact
CREATE TABLE invoices (
    id BLOB PRIMARY KEY,
    company_id BLOB NOT NULL,
    client_id BLOB NOT NULL,                -- FK -> clients
    quote_id BLOB,                          -- FK -> quotes (if converted)
    recurring_invoice_id BLOB,              -- FK -> recurring_invoices

    -- Identification
    invoice_id VARCHAR(255) NOT NULL,       -- Human-readable ID (INV-0001)
    uuid VARCHAR(36) NOT NULL,              -- Public UUID for links

    -- Status (state machine)
    status VARCHAR(25) NOT NULL,            -- new|draft|pending|paid|overdue|cancelled|archived

    -- Money (all in cents!)
    total_amount BIGINT NOT NULL,           -- Final amount after tax/discount
    baseTotal_amount BIGINT NOT NULL,       -- Subtotal before tax
    tax_amount BIGINT NOT NULL,             -- Tax portion
    balance_amount BIGINT NOT NULL,         -- Remaining to pay

    -- Discount (embedded Discount object)
    discount_valueMoney_amount BIGINT NOT NULL,
    discount_value_percentage DOUBLE,
    discount_type VARCHAR(255),             -- 'money' or 'percentage'

    -- Dates
    invoice_date DATE NOT NULL,             -- Issue date
    due DATE,                               -- Due date
    paid_date DATE,                         -- When fully paid

    -- Text
    terms CLOB,
    notes CLOB,

    -- Flags
    archived BOOLEAN DEFAULT NULL,
    created DATETIME NOT NULL,
    updated DATETIME NOT NULL
);
-- CRITICAL: balance_amount tracks remaining payment
-- BUSINESS RULE: balance_amount = 0 triggers PAID transition
-- GOTCHA: All amounts in cents (BIGINT)
```

### invoice_lines
```sql
-- CRITICAL: Line items on invoices
-- DEPENDENCY: Calculates into invoice totals
CREATE TABLE invoice_lines (
    id BLOB PRIMARY KEY,
    invoice_id BLOB,                        -- FK -> invoices
    recurringInvoice_id BLOB,               -- FK -> recurring_invoices
    tax_id BLOB,                            -- FK -> tax_rates
    company_id BLOB NOT NULL,

    description CLOB NOT NULL,
    price_amount BIGINT NOT NULL,           -- Unit price (cents)
    qty DOUBLE NOT NULL,                    -- Quantity
    total_amount BIGINT NOT NULL,           -- Line total (cents)
    type VARCHAR(255) NOT NULL,             -- Line type

    created DATETIME NOT NULL,
    updated DATETIME NOT NULL
);
-- GOTCHA: total_amount = price_amount * qty (computed before save)
```

### invoice_contact
```sql
-- CRITICAL: Junction table - which contacts receive invoice
-- DEPENDENCY: Email delivery targets
CREATE TABLE invoice_contact (
    invoice_id BLOB NOT NULL,               -- FK -> invoices
    contact_id BLOB NOT NULL,               -- FK -> contacts
    PRIMARY KEY(invoice_id, contact_id)
);
-- BUSINESS RULE: At least 1 contact required per invoice
```

### recurring_invoices
```sql
-- CRITICAL: Templates for auto-generated invoices
-- DEPENDENCY: Cron job creates invoices from these
CREATE TABLE recurring_invoices (
    id BLOB PRIMARY KEY,
    company_id BLOB NOT NULL,
    client_id BLOB,

    status VARCHAR(25) NOT NULL,            -- new|draft|active|paused|complete|cancelled|archived

    -- Money
    total_amount BIGINT NOT NULL,
    baseTotal_amount BIGINT NOT NULL,
    tax_amount BIGINT NOT NULL,
    discount_valueMoney_amount BIGINT NOT NULL,
    discount_value_percentage DOUBLE,
    discount_type VARCHAR(255),

    -- Schedule
    date_start DATE NOT NULL,
    date_end DATE,                          -- NULL = no end

    terms CLOB,
    notes CLOB,
    archived BOOLEAN DEFAULT NULL,
    created DATETIME NOT NULL,
    updated DATETIME NOT NULL
);
-- CRITICAL: Cron checks status='active' to generate invoices
```

### recurring_options
```sql
-- Schedule configuration for recurring invoices
CREATE TABLE recurring_options (
    id BLOB PRIMARY KEY,
    recurringInvoice_id BLOB NOT NULL,      -- FK -> recurring_invoices (1:1)

    type VARCHAR(15) NOT NULL,              -- 'daily'|'weekly'|'monthly'|'yearly'
    days CLOB NOT NULL,                     -- JSON array of days
    endType VARCHAR(15) NOT NULL,           -- 'never'|'date'|'occurrences'
    endDate DATE,
    endOccurrence INTEGER,

    UNIQUE(recurringInvoice_id)
);
```

---

## Quote Tables

### quotes
```sql
-- CRITICAL: Estimates/proposals sent to clients
-- DEPENDENCY: Can convert to invoice
CREATE TABLE quotes (
    id BLOB PRIMARY KEY,
    client_id BLOB,
    company_id BLOB NOT NULL,

    quote_id VARCHAR(255) NOT NULL,         -- Human-readable ID (QUO-0001)
    uuid VARCHAR(36) NOT NULL,              -- Public UUID for links
    status VARCHAR(25) NOT NULL,            -- new|draft|pending|accepted|declined|cancelled|archived

    -- Money
    total_amount BIGINT NOT NULL,
    baseTotal_amount BIGINT NOT NULL,
    tax_amount BIGINT NOT NULL,
    discount_valueMoney_amount BIGINT NOT NULL,
    discount_value_percentage DOUBLE,
    discount_type VARCHAR(255),

    terms CLOB,
    notes CLOB,
    due DATE,                               -- Quote expiry date

    archived BOOLEAN DEFAULT NULL,
    created DATETIME NOT NULL,
    updated DATETIME NOT NULL
);
-- BUSINESS RULE: status='accepted' can convert to invoice
-- SIDE EFFECT: Conversion creates invoice with quote_id reference
```

### quote_lines
```sql
-- Line items on quotes (same structure as invoice_lines)
CREATE TABLE quote_lines (
    id BLOB PRIMARY KEY,
    quote_id BLOB,
    tax_id BLOB,
    company_id BLOB NOT NULL,

    description CLOB NOT NULL,
    price_amount BIGINT NOT NULL,
    qty DOUBLE NOT NULL,
    total_amount BIGINT NOT NULL,

    created DATETIME NOT NULL,
    updated DATETIME NOT NULL
);
```

### quote_contact
```sql
-- Junction table - which contacts receive quote
CREATE TABLE quote_contact (
    quote_id BLOB NOT NULL,
    contact_id BLOB NOT NULL,
    PRIMARY KEY(quote_id, contact_id)
);
```

---

## Payment Tables

### payment_methods
```sql
-- CRITICAL: Configured payment gateways
-- DEPENDENCY: payments reference method_id
CREATE TABLE payment_methods (
    id BLOB PRIMARY KEY,
    company_id BLOB NOT NULL,

    name VARCHAR(125) NOT NULL,             -- Display name
    gateway_name VARCHAR(125) NOT NULL,     -- Internal gateway identifier
    factory VARCHAR(125) NOT NULL,          -- Payum factory name
    config CLOB,                            -- DC2Type:array (API keys, etc.)

    internal BOOLEAN DEFAULT NULL,          -- System methods (credit, cash)
    enabled BOOLEAN DEFAULT NULL,
    created DATETIME NOT NULL,
    updated DATETIME NOT NULL
);
-- GOTCHA: config contains SENSITIVE DATA (API keys)
-- BREAKING: Deleting method orphans payments
```

### payments
```sql
-- CRITICAL: Payment transaction records
-- DEPENDENCY: Updates invoice.balance_amount
CREATE TABLE payments (
    id BLOB PRIMARY KEY,
    invoice_id BLOB,                        -- FK -> invoices
    client BLOB,                            -- FK -> clients
    method_id BLOB,                         -- FK -> payment_methods
    company_id BLOB NOT NULL,

    number VARCHAR(255),                    -- Payment reference number
    description VARCHAR(255),
    client_email VARCHAR(255),
    client_id VARCHAR(255),                 -- Gateway's client ID

    total_amount INTEGER,                   -- Amount paid (cents)
    currency_code VARCHAR(255),

    details CLOB NOT NULL,                  -- JSON: gateway response data
    status VARCHAR(25) NOT NULL,            -- pending|captured|failed|refunded
    message CLOB,                           -- Error/status message

    completed DATETIME,                     -- When payment completed
    reference VARCHAR(255),                 -- External reference
    notes CLOB,

    created DATETIME NOT NULL,
    updated DATETIME NOT NULL
);
-- CRITICAL: status='captured' reduces invoice balance
-- SIDE EFFECT: If balance=0, invoice transitions to PAID
```

### security_token
```sql
-- Payum security tokens for payment callbacks
CREATE TABLE security_token (
    hash VARCHAR(255) PRIMARY KEY,
    details CLOB,                           -- DC2Type:object
    after_url CLOB,
    target_url CLOB NOT NULL,
    gateway_name VARCHAR(255) NOT NULL
);
-- GOTCHA: Tokens expire - stale entries can accumulate
```

---

## Tax Tables

### tax_rates
```sql
-- Tax rate definitions
CREATE TABLE tax_rates (
    id BLOB PRIMARY KEY,
    company_id BLOB NOT NULL,

    name VARCHAR(32) NOT NULL,              -- e.g., "VAT", "Sales Tax"
    rate DOUBLE NOT NULL,                   -- Percentage (e.g., 20.0 = 20%)
    tax_type VARCHAR(32) NOT NULL,          -- 'inclusive' or 'exclusive'

    created DATETIME NOT NULL,
    updated DATETIME NOT NULL
);
-- BUSINESS RULE: tax_type determines if rate included in price
-- 'inclusive': tax already in line price
-- 'exclusive': tax added on top
```

---

## User Tables

### users
```sql
-- Application users (not clients!)
CREATE TABLE users (
    id BLOB PRIMARY KEY,

    email VARCHAR(180) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,         -- Bcrypt hash
    enabled BOOLEAN NOT NULL,
    roles CLOB NOT NULL,                    -- DC2Type:array

    mobile VARCHAR(255),
    last_login DATETIME,
    created DATETIME NOT NULL,
    updated DATETIME NOT NULL
);
-- GOTCHA: users are separate from contacts (clients' people)
```

### user_company
```sql
-- Junction: which companies user can access
CREATE TABLE user_company (
    user_id BLOB NOT NULL,
    company_id BLOB NOT NULL,
    PRIMARY KEY(user_id, company_id)
);
-- BUSINESS RULE: User sees only data from their companies
```

### api_tokens
```sql
-- API authentication tokens
CREATE TABLE api_tokens (
    id BLOB PRIMARY KEY,
    user_id BLOB NOT NULL,
    company_id BLOB NOT NULL,

    name VARCHAR(125) NOT NULL,             -- Token description
    token VARCHAR(255) NOT NULL,            -- Actual token value

    created DATETIME NOT NULL,
    updated DATETIME NOT NULL
);
-- EXTERNAL: Used in Authorization: Bearer {token}
```

### api_token_history
```sql
-- Audit log for API usage
CREATE TABLE api_token_history (
    id BLOB PRIMARY KEY,
    token_id BLOB,
    company_id BLOB NOT NULL,

    ip VARCHAR(255) NOT NULL,
    resource VARCHAR(125) NOT NULL,
    method VARCHAR(25) NOT NULL,
    requestData CLOB NOT NULL,
    userAgent VARCHAR(255) NOT NULL,

    created DATETIME NOT NULL,
    updated DATETIME NOT NULL
);
```

---

## Settings Tables

### app_config
```sql
-- Application settings (key-value store)
CREATE TABLE app_config (
    id BLOB PRIMARY KEY,
    company_id BLOB NOT NULL,

    setting_key VARCHAR(125) NOT NULL,
    setting_value CLOB,
    description CLOB,
    field_type VARCHAR(255) NOT NULL,

    UNIQUE(setting_key, company_id)
);
-- Common settings:
-- 'system/company/company_name'
-- 'system/company/logo'
-- 'invoice/id/format'
-- 'quote/id/format'
-- 'email/from_address'
```

---

## Notification Tables

### notification_transport_setting
```sql
-- Notification channel configs (email, SMS, etc.)
CREATE TABLE notification_transport_setting (
    id BLOB PRIMARY KEY,
    user_id BLOB,
    company_id BLOB NOT NULL,

    name VARCHAR(255) NOT NULL,
    transport VARCHAR(255) NOT NULL,        -- 'email', 'sms', etc.
    settings CLOB NOT NULL,                 -- JSON config

    UNIQUE(name, company_id, user_id)
);
```

### notification_user_setting
```sql
-- User preferences for which notifications to receive
CREATE TABLE notification_user_setting (
    id BLOB PRIMARY KEY,
    user_id BLOB,
    company_id BLOB NOT NULL,

    event VARCHAR(255) NOT NULL,            -- Event type
    email BOOLEAN NOT NULL
);
```

---

## Backup Commands

```bash
# CRITICAL: Backup database
cp /var/www/solidinvoice/var/data.db /backup/data.db.$(date +%Y%m%d)

# Full application backup
tar -czf solidinvoice-backup.tar.gz \
    /var/www/solidinvoice/var/data.db \
    /var/www/solidinvoice/.env \
    /var/www/solidinvoice/public/uploads
```

---

*Schema documentation generated: January 17, 2026*
