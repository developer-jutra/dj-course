from flask import request, jsonify
from sqlalchemy import text
import os

from application import app
from database import db_engine
from env import assert_env_var

assert_env_var('PORT')
PORT = int(os.environ.get('PORT'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT)
