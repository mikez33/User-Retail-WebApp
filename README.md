# Open Market

Website for the Open Market Web Application project

## Running locally

This project requires Python version 3.6 or greater.

You must first create a `config.py` file in the `flaskapp` directory.
Example configuration file:

```python
SECRET_KEY = 'INSERT_SECRET_KEY_HERE'
SQLALCHEMY_DATABASE_URI = 'sqlite:///site.db'
STRIPE_PUBLIC_KEY = 'INSERT_PUB_KEY'
STRIPE_SECRET_KEY = 'INSERT_SECRET_KEY'

#pusher keys
PUSHER_APP_ID = 'INSERT_PUSHER_APP_ID'
PUSHER_APP_KEY = 'INSERT_PUSHER_APP_KEY'
PUSHER_APP_SECRET = 'INSERT_PUSHER_APP_SECRET'
PUSHER_APP_CLUSTER = 'INSERT_APP_CLUSTER'

#email login
EMAIL_ADDRESS = 'INSERT_EMAIL_ADDRESS'
EMAIL_PASSWORD = 'INSERT_EMAIL_PASSWORD'
```
To run the mail system, run the mail script. 

```
$python mail.py
```
To run, just install the requirements and run the start script.

```
$ pip install -r requirements.txt
$ python run.py
```

The site will be hosted on http://localhost:5000.