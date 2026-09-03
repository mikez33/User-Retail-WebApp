from flask import Flask, request
import os

app = Flask(__name__)

@app.get("/backup")
def backup():
    path = request.args["path"]
    os.system(f"tar czf /tmp/backup.tgz {path}")
    return "ok"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8079)