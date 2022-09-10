from flask import Flask, render_template, send_file
app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")


@app.route('/<file>')
def file(file):
    return send_file(file)

if __name__ == '__main__':
    app.run(host='127.0.0.1')