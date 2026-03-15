import time
import os
from flask import Blueprint, jsonify
from sqlalchemy import text

from application import logger
from database import db_engine

health_bp = Blueprint('health_bp', __name__)
START_TIME = time.time()


@health_bp.route('/', methods=['GET'], strict_slashes=False)
def health():
    logger.debug('Health check requested')

    health_status = {
        "status": "UP",
        "timestamp": time.time(),
        "uptime_seconds": int(time.time() - START_TIME),
        "version": os.environ.get("VERSION", "1.0.0"),
        "dependencies": {},
    }
    code = 200

    # Check PostgreSQL
    try:
        with db_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        health_status["dependencies"]["postgres"] = "UP"
    except Exception:
        health_status["dependencies"]["postgres"] = "DOWN"
        health_status["status"] = "DOWN"
        code = 503

    return jsonify(health_status), code
