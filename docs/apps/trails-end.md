# Trails End - Jaspersoft Report Mailer

**Container:** CT 501 (trails-end)
**Host:** Giratina (192.168.1.100)
**IP:** 192.168.1.126
**Purpose:** SFTP server for receiving Jaspersoft reports, automatically emails them to clients

---

## Overview

Trails End is an automated report delivery system that:
1. Receives report files via SFTP from Jaspersoft
2. Watches for new uploads using inotify
3. Emails reports to clients via Resend API
4. Archives processed reports with timestamps

## SFTP Access

**Host:** 192.168.1.126
**Port:** 22 (standard SSH/SFTP)
**Username:** jaspersoft
**Password:** Jasper123
**Upload Directory:** /uploads (chrooted)

### Jaspersoft Configuration
Configure Jaspersoft to output reports to:
```
sftp://jaspersoft:Jasper123@192.168.1.126/uploads/
```

## Directory Structure

```
/var/sftp/
├── uploads/       # Where Jaspersoft uploads files (jaspersoft user can write here)
└── archive/       # Processed files are moved here with timestamps

/opt/report-mailer/
├── config.env     # Configuration (API keys, emails)
├── report_mailer.py  # Main script
└── venv/          # Python virtual environment
```

## Configuration

Edit `/opt/report-mailer/config.env`:

```bash
RESEND_API_KEY=re_EvM1EwgR_E315P3eubRjFrMfKsL1M1Rt3
FROM_EMAIL=reports@built-simple.ai  # Must be verified domain in Resend
CLIENT_EMAIL=TalonNeely@gmail.com   # Where reports are sent
WATCH_DIR=/var/sftp/uploads
ARCHIVE_DIR=/var/sftp/archive
```

**IMPORTANT:** To send to external email addresses, you must verify your domain in Resend:
https://resend.com/domains

Then update FROM_EMAIL to use that verified domain.

## Service Management

```bash
# Check status
pct exec 501 -- systemctl status report-mailer

# View logs
pct exec 501 -- tail -f /var/log/report-mailer.log

# Restart service
pct exec 501 -- systemctl restart report-mailer

# Stop/Start
pct exec 501 -- systemctl stop report-mailer
pct exec 501 -- systemctl start report-mailer
```

## How It Works

1. **inotifywait** monitors `/var/sftp/uploads` for `close_write` events
2. When a file is fully written, the script:
   - Waits 2 seconds to ensure file is complete
   - Reads and base64-encodes the file
   - Sends via Resend API with the file as an attachment
   - On success, moves file to `/var/sftp/archive/` with timestamp prefix
3. If email fails, file remains in uploads for retry on next service restart

## Supported File Types

The system auto-detects MIME types for:
- PDF (.pdf)
- Excel (.xlsx, .xls)
- CSV (.csv)
- Word (.doc, .docx)
- Text (.txt)
- HTML (.html)
- Other files sent as application/octet-stream

## Testing

```bash
# From Giratina, test SFTP upload
echo "Test report" > /tmp/test.txt
sshpass -p 'Jasper123' sftp jaspersoft@192.168.1.126 << EOF
cd uploads
put /tmp/test.txt
bye
EOF

# Check logs
pct exec 501 -- tail -20 /var/log/report-mailer.log
```

## Troubleshooting

### Email not sending
1. Check Resend domain verification: https://resend.com/domains
2. Verify API key in config.env
3. Check logs: `pct exec 501 -- tail -50 /var/log/report-mailer.log`

### SFTP connection refused
```bash
pct exec 501 -- systemctl status sshd
pct exec 501 -- systemctl restart sshd
```

### File stuck in uploads
```bash
# Check if service is running
pct exec 501 -- systemctl status report-mailer

# Manually trigger reprocessing by restarting
pct exec 501 -- systemctl restart report-mailer
```

### Change password
```bash
pct exec 501 -- bash -c 'echo "jaspersoft:NewPassword123" | chpasswd'
```

## Adding More Recipients

To send to multiple recipients, modify `/opt/report-mailer/report_mailer.py`:

```python
# Change this line:
"to": [CLIENT_EMAIL],

# To:
"to": [CLIENT_EMAIL, "another@email.com", "third@email.com"],
```

Or add a `CLIENT_EMAILS` config option (comma-separated).

---

*Created: May 20, 2026*
*Container: CT 501 on Giratina*
