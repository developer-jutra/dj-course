from flask import Blueprint
from datetime import datetime

# Create a Blueprint for the index routes
index_bp = Blueprint('index_bp', __name__)

# Store the start time of the server
start_time = datetime.utcnow()

@index_bp.route('/')
def index():
    """GET: Returns the server uptime."""
    uptime = datetime.utcnow() - start_time
    
    # Pretty format the uptime
    days, remainder = divmod(uptime.total_seconds(), 86400)
    hours, remainder = divmod(remainder, 3600)
    minutes, seconds = divmod(remainder, 60)
    
    return (f"Server up and running since {start_time.strftime('%Y-%m-%d %H:%M:%S')} UTC. "
            f"Uptime: {int(days)}d {int(hours)}h {int(minutes)}m {int(seconds)}s")
