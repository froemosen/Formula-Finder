from flask import Flask, render_template, jsonify, send_from_directory
import os

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/example")
def example():
    return render_template("example.html")

@app.route("/latex")
def latex():
    return render_template("latex.html")


# Example API endpoint
@app.route("/api/greeting")
def greeting():
    return jsonify({"message": "Hello from Flask!"})

@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.root_path), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
