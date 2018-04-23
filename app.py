import os
import sys
import logging
from flask import Flask, request, jsonify, render_template, redirect, flash
from flask_cors import CORS
from datetime import datetime
from model import lr_model, multi_model
from flask_wtf import Form
from wtforms.fields import IntegerField, SubmitField
from wtforms import validators, ValidationError
import csv
import numpy as np
from flask import send_file

class MyForm(Form):
    zipcode = IntegerField('zipcode', [validators.DataRequired(), 
                                       validators.NumberRange(
                                           min = 10000, 
                                           max = 99999
                                       )])
    numBed = IntegerField('numBed')
    numBath = IntegerField('numBath')
    submit = SubmitField('Search my next home!')

# define the app
app = Flask(__name__)
CORS(app) # needed for cross-domain requests, allow everything by default
app.config.update(dict(
    SECRET_KEY="secretkey",
    WTF_CSRF_SECRET_KEY="csrfkey"
))

# logging for heroku
if 'DYNO' in os.environ:
    app.logger.addHandler(logging.StreamHandler(sys.stdout))
    app.logger.setLevel(logging.INFO)


@app.route('/', methods=['GET', 'POST'])
def index():
    form = MyForm()
    if request.method == 'POST' and form.validate():
        data = request.form
        zipcode = int(form.data['zipcode'])
        results = multi_model.multi_model(zipcode)
        print (results)
        bedno   = int(form.data['numBed'])
        bathno  = int(form.data['numBath'])
        inputrows = []
        with open('data/properties_0419.csv', 'r') as csvfile:
            csvReader = csv.reader(csvfile)
            i = 0
            for row in csvReader:
            	i = i + 1
            	if row[8] == str(bedno) and row[9] == str(bathno):
                    inputrows.append([i, float(row[6]), float(row[1]), float(row[2])])
                    
        print(len(inputrows))
        '''
        inputstring = ["id", "price", "latitude", "longitude"]
        with open('price_range.csv', 'w') as csvfile:
            csvWriter = csv.writer(csvfile)
            csvWriter.writerow(inputstring)
            for row in inputrows:
                temp = row
                csvWriter.writerow(temp)
        '''


        return render_template('index.html', form = form, ml_results = results, info = inputrows, fcn1 = "visualData(pRange)")
    return render_template('index.html', form = form)



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
