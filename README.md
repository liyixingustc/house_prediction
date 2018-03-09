# Simple Flask API for a Tensorflow Model

To be run locally with vagrant and vmbox, please refer to "readme.li" for more information

To run locally,

```
python app.py
```

The model is from [another repo](https://github.com/guillaumegenthial/sequence_tagging) on my github and is in the `model` directory. The flask app is defined in `app.py` which contains generic logic. The model-specific logic for the API is in the `serve.py` file.

An example of client is in the `client` directory.
