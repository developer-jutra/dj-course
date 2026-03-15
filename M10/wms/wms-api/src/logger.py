import logging
import os
import socket
from flask import has_request_context, request
import json
from env import assert_env_var

assert_env_var("SERVICE_NAME")
SERVICE_NAME = os.environ.get("SERVICE_NAME")

class RequestContextFilter(logging.Filter):
    def filter(self, record):
        if has_request_context():
            record.url = request.url
            record.method = request.method
            record.remote_addr = request.remote_addr
        else:
            record.url = None
            record.method = None
            record.remote_addr = None
        record.host = socket.gethostname()
        record.service = SERVICE_NAME
        return True

class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "message": record.getMessage(),
            "host": getattr(record, "host", None),
            "url": getattr(record, "url", None),
            "method": getattr(record, "method", None),
            "remote_addr": getattr(record, "remote_addr", None),
            "service": getattr(record, "service", None),
        }
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_record)

def setup_logger():
    logger = logging.getLogger(SERVICE_NAME)
    logger.setLevel(logging.DEBUG)

    # File handler
    file_handler = logging.FileHandler(os.environ.get("SERVICE_NAME") + ".log")
    file_formatter = JsonFormatter()
    file_handler.setFormatter(file_formatter)
    file_handler.addFilter(RequestContextFilter())
    logger.addHandler(file_handler)

    # Console handler
    console_handler = logging.StreamHandler()
    console_formatter = logging.Formatter(
        '%(asctime)s %(levelname)s %(name)s: %(message)s [%(method)s %(url)s]'
    )
    console_handler.setFormatter(console_formatter)
    console_handler.addFilter(RequestContextFilter())
    logger.addHandler(console_handler)

    return logger

logger = setup_logger()
