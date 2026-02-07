# HEARTBEAT.md - Proactive Monitoring

# Check API Health (every 1 hour)
# 1. Run health check on FixIt, PubMed, ArXiv, Wikipedia.
# 2. If failure > 2 consecutive polls, alert via Google Chat.

# Check Giratina Storage (every 4 hours)
# 1. Check local-lvm usage (alert if > 98%).

# Check Sub-Agent Status
# 1. List active sub-agents.
# 2. Check for completed tasks or hang-ups.
# 3. If a sub-agent has finished (status: success or error), ping Talon Neely immediately with the outcome and location of any generated files.
