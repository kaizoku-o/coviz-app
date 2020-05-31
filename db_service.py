from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json

app = Flask(__name__)
CORS(app)

@app.route('/api', methods=['GET', 'POST'])
def api():
    if request.is_json:
        command = "~/execute_db.py -op " + request.get_json()["command"]
        result = subprocess.getoutput(command)
        result = json.dumps(result)
    else:
        result = "Request is not in valid json format"

    return jsonify(result)


if __name__ == '__main__':
	app.run(host= '0.0.0.0', debug=True, port=9580)
