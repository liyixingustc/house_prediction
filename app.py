import os
import sys
import logging
from flask import Flask, request, jsonify, render_template, redirect
from flask_cors import CORS
from datetime import datetime
import lr_model

from serve import get_model_api


# define the app
app = Flask(__name__)
CORS(app) # needed for cross-domain requests, allow everything by default


# logging for heroku
if 'DYNO' in os.environ:
    app.logger.addHandler(logging.StreamHandler(sys.stdout))
    app.logger.setLevel(logging.INFO)


# load the model
model_api = get_model_api()


# API route
@app.route('/api', methods=['POST'])
def api():
    """API function

    All model-specific logic to be defined in the get_model_api()
    function
    """
    #Read input
    input_data = request.json
    app.logger.info("api_input: " + str(input_data))
    #Use model
    output_data = model_api(input_data)
    #Parse output
    app.logger.info("api_output: " + str(output_data))
    response = jsonify(output_data)
    return response

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        data = request.form
        zipcode = data['param']
        zipcode = int(zipcode[0:5])
        zipcode = 30080
        results = lr_model.lr_model(zipcode)
        return render_template('index.html', lr_results = zipcode)
    return render_template('index.html')


@app.route("/api_lr", methods=['GET', 'POST'])
def linear_regression_train():
    if request.method == 'POST':
        data = request.form
        zipcode = data['param']
        zipcode = int(zipcode[0:5])
        zipcode = 30080
        results = lr_model.lr_model(zipcode)
        return render_template('index.html', lr_results = results)
    return render_template('index.html')


# HTTP Errors handlers
@app.errorhandler(404)
def url_error(e):
    return """
    Wrong URL!
    <pre>{}</pre>""".format(e), 404


@app.errorhandler(500)
def server_error(e):
    return """
    An internal error occurred: <pre>{}</pre>
    See logs for full stacktrace.
    """.format(e), 500


if __name__ == '__main__':
    # This is used when running locally.
    app.run(host='0.0.0.0',
            port=8080,
            debug=True
            )
