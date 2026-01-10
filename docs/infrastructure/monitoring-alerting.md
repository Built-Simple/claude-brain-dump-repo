# Monitoring & Alerting System

**Last Updated:** January 9, 2026

## Overview

All critical services are monitored with email notifications to:
- talonneely@gmail.com
- nathancole892@gmail.com

## Active Monitors

| Monitor | Frequency | Script | Status |
|---------|-----------|--------|--------|
| Container Status | Every 5 min | /root/container_health_monitor.sh | Active |
| Application Health | Every 5 min | /root/application_health_monitor_v2.sh | Active |
| API Health | Every 5 min | /root/api_health_monitor.sh | Active |
| ArXiv API | Every 5 min | /root/arxiv_api_monitor.sh | Active |
| Backup Sync | Every 2 hrs | /root/backup_sync_offsite.sh | Active |

## Monitored Containers (Giratina)

| VMID | Name | Purpose |
|------|------|---------|
| 103 | FixItAPI | Stack Overflow search |
| 105 | admin-coder-420 | Admin tools |
| 108 | PubMedSearch | Medical research |
| 122 | arxiv-gpu-pytorch | ArXiv API |
| 123 | arxiv-postgres | ArXiv database |
| 300 | smb-server | File shares |
| 400 | built-simple-web | Marketing site |
| 502 | pubmed-postgres | (unused) |
| 503 | pubmed-elastic | Elasticsearch |
| 504 | filesearch | File search |

## Monitored Applications

| Container | Service | Check Type |
|-----------|---------|------------|
| CT 103 | FixIt API | /health endpoint |
| CT 103 | FixIt Frontend | HTTP status |
| CT 108 | PubMed API | Port 5001 |
| CT 122 | ArXiv API | /health on port 8082 |
| CT 300 | SMB Server | Process check |
| CT 504 | Elasticsearch | _cluster/health |
| CT 311 (Silvally) | Buffer Killer Web | Port 3080 |
| CT 311 (Silvally) | Buffer Killer OAuth | Port 3000 |
| CT 312 (Silvally) | MyFit Pro | Port 3000 |
| CT 313 (Silvally) | ReviewMaster Pro | Port 8001 |
| CT 213 (Hoopa) | Wikipedia API | Port 8080 |

## Alert Types

| Alert | Description |
|-------|-------------|
| Container Down | LXC container stopped unexpectedly |
| Application Down | Service inside container not responding |
| Service Recovered | Application restored to normal |
| API Failures | HTTP errors or timeouts |
| Backup Issues | Failed syncs or low disk space |

## Email Configuration

- **SMTP Server:** smtp.gmail.com:587
- **Method:** Python SMTP + Bash mail command
- **Credentials:** /root/send_alert_email.py

### Related Documentation
- /root/EMAIL_SYSTEM_SUMMARY.md
- /root/EMAIL_TROUBLESHOOTING_GUIDE.md

## Quick Commands

```bash
# Check container status (LXC up/down)
/root/container_health_monitor.sh status

# Check application health (services inside containers)
/root/application_health_monitor_v2.sh status

# View application monitoring logs
/root/application_health_monitor_v2.sh log

# Test email alerts
/root/application_health_monitor_v2.sh test

# View all monitoring cron jobs
crontab -l
```

## Cron Configuration

```bash
# View current cron jobs
crontab -l

# Typical entries:
*/5 * * * * /root/container_health_monitor.sh
*/5 * * * * /root/application_health_monitor_v2.sh
*/5 * * * * /root/api_health_monitor.sh
*/5 * * * * /root/arxiv_api_monitor.sh
0 */2 * * * /root/backup_sync_offsite.sh
```

## Adding New Monitor

1. Create monitoring script in /root/
2. Add to crontab: `crontab -e`
3. Test manually first: `./new_monitor.sh`
4. Verify email alerts work

## Troubleshooting

### No Alerts Received
```bash
# Test email sending
python3 /root/send_alert_email.py "Test Subject" "Test body"

# Check mail logs
journalctl -u postfix -n 50
```

### False Positives
- Check if service is actually running
- Verify correct ports in monitor script
- Increase timeout if network is slow

### Monitor Not Running
```bash
# Check cron is running
systemctl status cron

# View cron logs
grep CRON /var/log/syslog | tail -20
```

---
*Container monitoring deployed: December 4, 2025*
*Application health monitoring deployed: December 4, 2025*
