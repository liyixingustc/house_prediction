from flask import Flask, render_template, request, json
#import json

# app = Flask(__name__,template_folder='');
app = Flask(__name__);

@app.route('/')
def index():
	return render_template('index.html');
	



@app.route('/testFrontend', methods=['POST'])
def testFrontend():
	return {'res':'DATA RECEIVED'};
   



if __name__=="__main__":
	app.run(port=8000,debug=True)
