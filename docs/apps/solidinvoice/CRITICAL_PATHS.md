# SolidInvoice Critical Paths

**Last Updated:** January 17, 2026
**Purpose:** Document user journeys and code paths for debugging/modification

---

## Critical Path 1: Create and Send Invoice

### User Journey
1. User navigates to Invoices -> Create New
2. Selects client
3. Adds line items
4. Optionally applies discount/tax
5. Clicks "Send"
6. Client receives email with payment link

### Code Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│ USER: Click "Create Invoice"                                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ CONTROLLER: InvoiceBundle/Action/Create.php                             │
│                                                                         │
│ DEPENDENCY: SolidInvoice\InvoiceBundle\Action\Create                    │
│ ROUTE: /invoices/create                                                 │
│ TEMPLATE: @SolidInvoiceInvoice/Default/create.html.twig                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ FORM: InvoiceBundle/Form/Type/InvoiceType.php                           │
│                                                                         │
│ DEPENDENCY: Uses InvoiceBundle/Form/Type/ItemType for lines             │
│ DEPENDENCY: Uses ClientBundle/Form/Type/ClientSelectType                │
│ DEPENDENCY: Uses CoreBundle/Form/Type/DiscountType                      │
│ VALIDATES: At least 1 line item, at least 1 contact                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ FORM HANDLER: InvoiceBundle/Form/Handler/InvoiceCreateHandler.php       │
│                                                                         │
│ CRITICAL: Creates Invoice entity                                        │
│ SIDE EFFECT: Calculates totals via InvoiceBundle/Manager/InvoiceManager │
│ DB WRITE: invoices, invoice_lines, invoice_contact                      │
│ EVENT: invoice.create dispatched                                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ MANAGER: InvoiceBundle/Manager/InvoiceManager.php                       │
│                                                                         │
│ PURPOSE: Calculate invoice totals                                       │
│ DEPENDENCY: MoneyBundle/Calculator.php                                  │
│ DEPENDENCY: TaxBundle for tax calculations                              │
│                                                                         │
│ CALCULATION ORDER:                                                      │
│   1. Sum line totals -> baseTotal                                       │
│   2. Apply discount -> baseTotal - discount                             │
│   3. Calculate tax -> tax = (baseTotal - discount) * tax_rate           │
│   4. Final total -> baseTotal - discount + tax                          │
│   5. Set balance = total (nothing paid yet)                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ WORKFLOW: User clicks "Send" button                                     │
│                                                                         │
│ TRANSITION: 'accept' (draft -> pending)                                 │
│ CONFIG: config/packages/workflow.php                                    │
│ LISTENER: InvoiceBundle/Listener/WorkFlowSubscriber.php                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ MAILER: InvoiceBundle/Listener/Mailer/InvoiceMailerListener.php         │
│                                                                         │
│ TRIGGER: On workflow transition to 'pending'                            │
│ DEPENDENCY: MailerBundle/Factory/MailerFactory                          │
│ TEMPLATE: @SolidInvoiceInvoice/Email/invoice.html.twig                  │
│ EXTERNAL: SMTP server (config: MAILER_DSN in .env)                      │
│                                                                         │
│ EMAIL CONTAINS:                                                         │
│   - Invoice PDF attachment                                              │
│   - Payment link: /payment/capture/{uuid}                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ SUCCESS: Invoice created, status=pending, email sent                    │
└─────────────────────────────────────────────────────────────────────────┘

### Key Files
- src/InvoiceBundle/Action/Create.php
- src/InvoiceBundle/Form/Handler/InvoiceCreateHandler.php
- src/InvoiceBundle/Manager/InvoiceManager.php
- src/InvoiceBundle/Listener/WorkFlowSubscriber.php
- src/InvoiceBundle/Listener/Mailer/InvoiceMailerListener.php
- templates/invoice/Default/create.html.twig

### Database Writes
- INSERT invoices (id, invoice_id, client_id, status, totals, etc.)
- INSERT invoice_lines (for each line item)
- INSERT invoice_contact (junction to contacts)

### Failure Points
1. No client selected -> validation error
2. No line items -> validation error
3. No contacts selected -> validation error
4. SMTP failure -> invoice created but email not sent
5. Tax rate deleted -> null reference error
```

---

## Critical Path 2: Client Pays Invoice

### User Journey
1. Client receives email
2. Clicks "Pay Now" link
3. Selects payment method
4. Completes payment on gateway
5. Redirected back with confirmation

### Code Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│ CLIENT: Clicks payment link in email                                    │
│ URL: /view/invoice/{uuid}                                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ CONTROLLER: InvoiceBundle/Action/View.php                               │
│                                                                         │
│ PURPOSE: Public invoice view (no auth required)                         │
│ TEMPLATE: @SolidInvoiceInvoice/Default/view.html.twig                   │
│ SHOWS: Invoice details, "Pay Now" button                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ USER: Clicks "Pay Now"                                                  │
│ URL: /payment/capture/{invoiceUuid}                                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ CONTROLLER: PaymentBundle/Action/Prepare.php                            │
│                                                                         │
│ PURPOSE: Select payment method                                          │
│ DB READ: payment_methods WHERE enabled=true                             │
│ TEMPLATE: @SolidInvoicePayment/Payment/capture.html.twig                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ USER: Selects payment method (e.g., Stripe)                             │
│ FORM POST to same endpoint                                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PAYUM: PaymentBundle/Payum/Action/CaptureAction.php                     │
│                                                                         │
│ DEPENDENCY: Payum bundle (payum/payum)                                  │
│ EXTERNAL: Stripe API, PayPal API, etc.                                  │
│                                                                         │
│ FOR ONLINE GATEWAYS:                                                    │
│   1. Create Payum token (security_token table)                          │
│   2. Redirect to gateway (Stripe Checkout, PayPal, etc.)                │
│   3. Gateway handles payment                                            │
│   4. Redirect back to /payment/done/{token}                             │
│                                                                         │
│ FOR OFFLINE (cash, bank transfer):                                      │
│   1. Create payment record with status=pending                          │
│   2. Admin manually confirms later                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ GATEWAY CALLBACK: /payment/done/{token}                                 │
│                                                                         │
│ CONTROLLER: PaymentBundle/Action/Done.php                               │
│ DEPENDENCY: Payum/Core/Gateway                                          │
│                                                                         │
│ ACTIONS:                                                                │
│   1. Verify payment with gateway                                        │
│   2. Update payment.status (captured|failed)                            │
│   3. Update invoice.balance_amount                                      │
│   4. If balance = 0, trigger workflow transition 'pay'                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ WORKFLOW: Transition 'pay' (pending -> paid)                            │
│                                                                         │
│ LISTENER: InvoiceBundle/Listener/WorkFlowSubscriber.php                 │
│ SIDE EFFECTS:                                                           │
│   - invoice.status = 'paid'                                             │
│   - invoice.paid_date = now()                                           │
│   - Send payment confirmation email                                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ SUCCESS: Payment complete, invoice marked paid                          │
│ REDIRECT: /view/invoice/{uuid}?payment=success                          │
└─────────────────────────────────────────────────────────────────────────┘

### Key Files
- src/PaymentBundle/Action/Prepare.php
- src/PaymentBundle/Action/Done.php
- src/PaymentBundle/Payum/Action/CaptureAction.php
- src/PaymentBundle/PaymentProcessor.php
- src/InvoiceBundle/Listener/WorkFlowSubscriber.php

### Database Writes
- INSERT payments (id, invoice_id, total_amount, status, etc.)
- INSERT security_token (payum callback token)
- UPDATE invoices SET balance_amount = balance_amount - payment, status = 'paid'

### Failure Points
1. Payment method not configured -> no methods shown
2. Gateway API error -> payment.status = 'failed'
3. Callback not received -> payment stuck in pending
4. Amount mismatch -> balance not updated correctly
5. Workflow transition fails -> invoice stuck in pending
```

---

## Critical Path 3: Quote to Invoice Conversion

### User Journey
1. Client receives quote email
2. Clicks "Accept" link
3. Quote converts to invoice
4. Client can now pay

### Code Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│ CLIENT: Clicks "Accept Quote" in email                                  │
│ URL: /view/quote/{uuid}?transition=accept                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ CONTROLLER: QuoteBundle/Action/Transition.php                           │
│                                                                         │
│ PURPOSE: Handle quote state transitions                                 │
│ WORKFLOW: 'accept' transition (pending -> accepted)                     │
│ LISTENER: QuoteBundle/Listener/WorkFlowSubscriber.php                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ LISTENER: QuoteBundle/Listener/WorkFlowSubscriber.php                   │
│                                                                         │
│ ON 'accept' TRANSITION:                                                 │
│   DEPENDENCY: QuoteBundle/Cloner/QuoteToInvoiceCloner.php               │
│                                                                         │
│ CLONING PROCESS:                                                        │
│   1. Create new Invoice entity                                          │
│   2. Copy client reference                                              │
│   3. Clone all quote lines -> invoice lines                             │
│   4. Copy totals, discount, tax                                         │
│   5. Set invoice.quote_id = quote.id                                    │
│   6. Set invoice.status = 'pending'                                     │
│   7. Persist invoice                                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ DB WRITES:                                                              │
│   - UPDATE quotes SET status = 'accepted'                               │
│   - INSERT invoices (with quote_id reference)                           │
│   - INSERT invoice_lines (cloned from quote_lines)                      │
│   - INSERT invoice_contact (cloned from quote_contact)                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ MAILER: Send invoice email (same as direct invoice send)                │
│                                                                         │
│ EMAIL: Invoice PDF + payment link                                       │
└─────────────────────────────────────────────────────────────────────────┘

### Key Files
- src/QuoteBundle/Action/Transition.php
- src/QuoteBundle/Listener/WorkFlowSubscriber.php
- src/QuoteBundle/Cloner/QuoteToInvoiceCloner.php

### Database Writes
- UPDATE quotes SET status = 'accepted'
- INSERT invoices (new invoice linked to quote)
- INSERT invoice_lines
- INSERT invoice_contact

### Entity Relationships After Conversion
- Quote.status = 'accepted'
- Quote.invoice = {new Invoice}
- Invoice.quote_id = {Quote.id}
- Invoice has same client, contacts, lines as quote
```

---

## Critical Path 4: Recurring Invoice Generation

### System Journey (Cron)
1. Cron runs every minute
2. Checks for active recurring invoices
3. Generates regular invoices when due
4. Sends emails to clients

### Code Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│ CRON: * * * * * php bin/console cron:run -e prod                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ SCHEDULER: Zenstruck\ScheduleBundle                                     │
│                                                                         │
│ CONFIG: config/packages/schedule.php                                    │
│ TASK: CronBundle/Runner/RecurringInvoiceRunner                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ RUNNER: CronBundle/Runner/RecurringInvoiceRunner.php                    │
│                                                                         │
│ QUERY: SELECT * FROM recurring_invoices WHERE status = 'active'         │
│                                                                         │
│ FOR EACH RECURRING INVOICE:                                             │
│   1. Check recurring_options to see if due today                        │
│   2. If due: clone to regular invoice                                   │
│   3. If end condition met: complete recurring invoice                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ CLONER: InvoiceBundle/Cloner/RecurringInvoiceToInvoiceCloner.php        │
│                                                                         │
│ CREATES:                                                                │
│   - New Invoice entity                                                  │
│   - Cloned line items                                                   │
│   - Links to same client/contacts                                       │
│   - Sets recurring_invoice_id reference                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ WORKFLOW: Transition new invoice to 'pending' (auto-send)               │
│                                                                         │
│ SIDE EFFECT: Invoice email sent automatically                           │
└─────────────────────────────────────────────────────────────────────────┘

### Key Files
- src/CronBundle/Runner/RecurringInvoiceRunner.php
- src/InvoiceBundle/Cloner/RecurringInvoiceToInvoiceCloner.php
- config/packages/schedule.php

### Log Location
/var/www/solidinvoice/var/log/prod.log

### Troubleshooting
```bash
# Check if cron is running
systemctl status cron

# Check cron log
grep cron /var/log/syslog

# Run manually to debug
php bin/console cron:run -e prod -vvv

# Check recurring invoices
sqlite3 var/data.db "SELECT id, status, date_start FROM recurring_invoices WHERE status='active';"
```
```

---

## Critical Path 5: API Invoice Creation

### API Consumer Journey
1. Authenticate with API token
2. POST to /api/invoices
3. Receive invoice object

### Code Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│ API CLIENT: POST /api/invoices                                          │
│ HEADER: Authorization: Bearer {token}                                   │
│ BODY: { "client": "/api/clients/{id}", "lines": [...] }                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ SECURITY: ApiBundle/Security/ApiTokenAuthenticator.php                  │
│                                                                         │
│ VALIDATES:                                                              │
│   1. Token exists in api_tokens table                                   │
│   2. Token's user has access to company                                 │
│   3. User is enabled                                                    │
│                                                                         │
│ ON SUCCESS: Sets user in security context                               │
│ ON FAILURE: 401 Unauthorized                                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ API PLATFORM: Handles entity deserialization                            │
│                                                                         │
│ CONFIG: src/InvoiceBundle/Entity/Invoice.php (attributes)               │
│ GROUPS: 'invoice_api:write' for denormalization                         │
│                                                                         │
│ CREATES: Invoice entity from JSON                                       │
│ VALIDATES: Symfony validator constraints                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ DOCTRINE: Persist and flush                                             │
│                                                                         │
│ LISTENERS: Calculate totals (same as UI flow)                           │
│ DB WRITE: invoices, invoice_lines                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ RESPONSE: 201 Created                                                   │
│ BODY: Invoice object with 'invoice_api:read' serialization              │
└─────────────────────────────────────────────────────────────────────────┘

### Key Files
- src/ApiBundle/Security/ApiTokenAuthenticator.php
- src/InvoiceBundle/Entity/Invoice.php (API Platform attributes)
- config/packages/api_platform.php

### API Response Codes
- 201: Created successfully
- 400: Validation error (check response body)
- 401: Invalid/missing token
- 403: User doesn't have access to company
- 404: Referenced entity not found
- 500: Server error
```

---

## Debugging Commands

```bash
# Enter container
ssh root@192.168.1.115
pct exec 117 -- bash

# View logs
tail -f /var/www/solidinvoice/var/log/prod.log
tail -f /var/log/nginx/solidinvoice_error.log

# Debug Symfony
cd /var/www/solidinvoice
php bin/console debug:router
php bin/console debug:container
php bin/console debug:event-dispatcher

# Check workflows
php bin/console workflow:dump invoice | dot -Tpng > /tmp/invoice.png
php bin/console workflow:dump quote | dot -Tpng > /tmp/quote.png

# Database queries
sqlite3 var/data.db
.tables
.schema invoices
SELECT id, invoice_id, status, balance_amount FROM invoices;

# Clear cache (after config changes)
php bin/console cache:clear
php bin/console cache:warmup
```

---

*Critical paths documented: January 17, 2026*
