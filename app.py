from flask import Flask, render_template, jsonify, send_from_directory
import os
from datetime import datetime, timezone

app = Flask(__name__)

log = {
    "index_visits": 0,
    "about_visits": 0,
    "example_visits": 0,
    "latex_visits": 0,
    "greeting_api_calls": 0,
    "log_api_calls": 0
}

@app.route("/")
def index():
    log["index_visits"] += 1
    return render_template("index.html")


@app.route("/about")
def about():
    log["about_visits"] += 1
    return render_template("about.html")

@app.route("/example")
def example():
    log["example_visits"] += 1
    return render_template("example.html")

@app.route("/latex")
def latex():
    log["latex_visits"] += 1
    return render_template("latex.html")


# Example API endpoint
@app.route("/api/greeting")
def greeting():
    log["greeting_api_calls"] += 1
    return jsonify({"message": "Hello from Flask!"})

@app.route("/api/log")
def log_api():
    log["log_api_calls"] += 1
    print("----- Backend Log Stats -----")
    print(f"[{datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S +0000')}]")
    for key, value in log.items():
        print(f"{key}: {value}")
    print("-----------------------------")
    
    return jsonify({"status": "Successfully logged stats to backend console."})

@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.root_path), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
