# Deployment Instructions — cc.1pwrafrica.com/assessment/

## Quick Deploy (SSH to EC2)

```bash
ssh -i ~/Downloads/EOver.pem ubuntu@13.245.142.186

# Create directory
sudo mkdir -p /opt/cc-portal/assessment/server
sudo mkdir -p /opt/cc-portal/assessment/data
sudo chown -R ubuntu:ubuntu /opt/cc-portal/assessment

# Copy files (from local machine, run in project root)
scp -i ~/Downloads/EOver.pem public/index.html ubuntu@13.245.142.186:/opt/cc-portal/assessment/index.html
scp -i ~/Downloads/EOver.pem server/results_api.py ubuntu@13.245.142.186:/opt/cc-portal/assessment/server/results_api.py
scp -i ~/Downloads/EOver.pem server/assessment-api.service ubuntu@13.245.142.186:/tmp/assessment-api.service

# On EC2: install service
sudo mv /tmp/assessment-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable assessment-api
sudo systemctl start assessment-api

# Add to Caddy config (edit /etc/caddy/Caddyfile)
# Add these lines inside the cc.1pwrafrica.com block:
#
#   handle_path /assessment/api/* {
#       reverse_proxy localhost:8200
#   }
#   handle_path /assessment/* {
#       root * /opt/cc-portal/assessment
#       file_server
#       try_files {path} /index.html
#   }
#
# Then reload:
sudo systemctl reload caddy
```

## URLs
- **Assessment UI:** https://cc.1pwrafrica.com/assessment/
- Results API: https://cc.1pwrafrica.com/assessment/api/list
- Session data: https://cc.1pwrafrica.com/assessment/api/session/{sessionId}

To publish the **Vite** build (`npm run build` → `dist/`) instead of `public/index.html`, upload the **contents** of `dist/` to `/opt/cc-portal/assessment/` (same Caddy `try_files` rules apply).
