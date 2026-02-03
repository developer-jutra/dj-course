import random
import logging
from flask import Flask, request, jsonify
import tracing

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Set up Flask app and instrument it
app = Flask(__name__)
from opentelemetry.instrumentation.flask import FlaskInstrumentor
FlaskInstrumentor().instrument_app(app)

@app.route('/health', methods=['GET'])
def health():
    logger.debug('Health check requested')
    return 'OK', 200

@app.route('/availability', methods=['GET'])
def availability():
    ids_param = request.args.get('ids', '')
    ids_list = [id.strip() for id in ids_param.split(',') if id.strip()]
    availability_data = {id: random.choice([True, False]) for id in ids_list}
    return jsonify(availability_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
