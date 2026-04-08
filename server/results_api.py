#!/usr/bin/env python3
"""
Tiny results API for 1PWR Leadership Assessment.
Saves assessment session data to JSON files on disk.
Runs alongside Caddy on the EC2 at cc.1pwrafrica.com.

Usage:
  python3 results_api.py  # listens on port 8200
"""
import json
import os
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler

DATA_DIR = "/opt/cc-portal/assessment/data"
os.makedirs(DATA_DIR, exist_ok=True)

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == "/save":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            try:
                data = json.loads(body)
                session_id = data.get("sessionId", f"unknown_{datetime.now().strftime('%Y%m%d%H%M%S')}")
                filepath = os.path.join(DATA_DIR, f"{session_id}.json")
                with open(filepath, "w") as f:
                    json.dump(data, f, indent=2)
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "saved", "sessionId": session_id}).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        elif self.path == "/list":
            try:
                files = sorted(os.listdir(DATA_DIR), reverse=True)
                sessions = []
                for f in files:
                    if f.endswith(".json"):
                        with open(os.path.join(DATA_DIR, f)) as fh:
                            d = json.load(fh)
                            sessions.append({
                                "sessionId": d.get("sessionId"),
                                "lastUpdated": d.get("lastUpdated"),
                                "totalQuestions": d.get("totalQuestions"),
                                "summary": d.get("summary")
                            })
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps(sessions).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        elif self.path.startswith("/session/"):
            session_id = self.path.split("/session/")[1]
            filepath = os.path.join(DATA_DIR, f"{session_id}.json")
            if os.path.exists(filepath):
                with open(filepath) as f:
                    data = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(data.encode())
            else:
                self.send_response(404)
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(b'{"error": "not found"}')
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        self.do_POST()

    def log_message(self, format, *args):
        pass  # suppress logs

if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", 8200), Handler)
    print(f"Assessment results API running on port 8200, data dir: {DATA_DIR}")
    server.serve_forever()
