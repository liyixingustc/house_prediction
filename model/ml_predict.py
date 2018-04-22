
# coding: utf-8

# In[1]:

from sklearn import preprocessing
from sklearn.preprocessing import LabelEncoder
import math
from collections import defaultdict
import pandas as pd
import numpy as np
from flask import jsonify
from sklearn.ensemble import RandomForestRegressor
from sklearn.externals import joblib


# In[2]:

le_city = LabelEncoder()
le_city.classes_ = np.load('city.npy')
le_state = LabelEncoder()
le_state.classes_ = np.load('state.npy')
#to use saved model to predict
rf = joblib.load('rf_model.pkl')

#input format: latitude	longitude	city	state	postal_code
#  #bedrooms	#bathrooms	sqft	d1	d2	d3	d4	d5	d6	d7	d8	d9	d10	d11	d12	d13	d14	d15	d16	d17	d18	d19	d20
# d1-d20 are the 20 distances
x_test = [33.913258,-84.451048,le_city.transform(['Atlanta'])[0],
          le_state.transform(['GA'])[0],30339,5,7,8407,17.97815547,
          11.61922521,10.73757085,17.91580071,12.36143495,12.84093017,
          10.95456711,14.2463137,10.22767987,14.97290478,10.60371232,
          19.62657156,10.6664712,12.12805345,17.39411973,11.00101478,
          12.74852644,16.87761032,14.76784305,3.831071845]

rf.predict([x_test])

