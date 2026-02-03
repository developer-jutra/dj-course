import random
from flask import Flask, request, jsonify
from opentelemetry.instrumentation.flask import FlaskInstrumentor

from logger import setup_logger

logger = setup_logger()

app = Flask(__name__)
FlaskInstrumentor().instrument_app(app)

@app.route('/health', methods=['GET'])
def health():
    logger.debug('Health check requested')
    return 'OK', 200

@app.route('/availability', methods=['GET'])
def availability():
    ids_param = request.args.get('ids', '')
    ids_list = [id.strip() for id in ids_param.split(',') if id.strip()]
    logger.info(f"Availability check for IDs: {ids_list}")
    availability_data = {id: random.choice([True, False]) for id in ids_list}
    logger.debug(f"Availability response: {availability_data}")
    return jsonify(availability_data)

@app.route('/inject-error', methods=['GET'])
def inject_error():
    logger.error('Injecting error')
    return 'Error injected', 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
