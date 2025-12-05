# SSH CONFIGURATION

## KEYS

Generate new key on fresh machine:
```bash
ssh-keygen -t ed25519 -C "neely@LAPTOP-FVRA1DSD"
```

Copy to remote host:
```bash
ssh-copy-id root@192.168.1.115
```

## KNOWN HOSTS

`known_hosts.backup` contains fingerprints for all known hosts.

To restore:
```bash
cp known_hosts.backup ~/.ssh/known_hosts
```

## PRIMARY CONNECTION

```bash
ssh root@192.168.1.115
# Password: BuiltSimple2025!
```

Or with key (after ssh-copy-id):
```bash
ssh root@192.168.1.115
```

## HOST ALIASES

Add to `~/.ssh/config`:
```
Host builtsimple
    HostName 192.168.1.115
    User root
    IdentityFile ~/.ssh/id_ed25519

Host n8n
    HostName n8n.built-simple.ai
    User root
    IdentityFile ~/.ssh/id_ed25519
```

Then connect with:
```bash
ssh builtsimple
ssh n8n
```

## ALL HOSTS

See `HOSTS.md` in repo root for complete inventory.
