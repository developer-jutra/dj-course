import logging
import os
from logging_loki import LokiHandler
import json
import socket
from flask import has_request_context, request

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
        record.service = os.environ.get("OTEL_SERVICE_NAME")
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
    logger = logging.getLogger("availability-api")
    logger.setLevel(logging.DEBUG)

    # Loki handler
    loki_host = os.environ.get("LOKI_HOST")
    if not loki_host:
        raise RuntimeError("LOKI_HOST environment variable is not set")
    loki_url = f"{loki_host}/loki/api/v1/push"

    loki_handler = LokiHandler(
        url=loki_url,
        tags={
            "service": "availability-api",
            "hostname": socket.gethostname(),
            "environment": os.environ.get("ENVIRONMENT", "development"),
        },
        version="1",
    )
    json_formatter = JsonFormatter()
    loki_handler.setFormatter(json_formatter)
    loki_handler.addFilter(RequestContextFilter())
    logger.addHandler(loki_handler)

    # Console handler
    console_handler = logging.StreamHandler()
    console_formatter = logging.Formatter(
        '%(asctime)s %(levelname)s %(name)s: %(message)s [%(method)s %(url)s]'
    )
    console_handler.setFormatter(console_formatter)
    console_handler.addFilter(RequestContextFilter())
    logger.addHandler(console_handler)

    return logger
