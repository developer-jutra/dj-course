import os
import sys
import logging
from typing import Dict, Any

from mcp.server.fastmcp import FastMCP 
from pydantic import BaseModel, Field

logging.basicConfig(
    level=logging.INFO,
    format='[MCP Server Log] %(message)s',
    stream=sys.stderr
)
logger = logging.getLogger(__name__)

def log(*args: Any) -> None:
    """Loguje wiadomość tylko, gdy CONFIG_LOG_LEVEL jest ustawiony na VERBOSE."""
    if os.environ.get('CONFIG_LOG_LEVEL', '').upper() == 'VERBOSE':
        logger.info(' '.join(map(str, args)))


# Pydantic input model for the greet tool
class GreetParams(BaseModel):
    """Definicja schematu wejściowego dla narzędzia 'greet'."""
    name: str = Field(..., description="Recipient name")

# dla powyższej walidacji pydantikiem, argumentem będzie musiał być obiekt: {"name": "Jan"}
# # (a nie po prostu string "Jan")

mcp = FastMCP(
    name='DJServerPy' 
)

@mcp.tool(
    description='Greets a person by name'
)
async def greet(params: GreetParams) -> Dict[str, Any]:
    """
    Greet tool
    """
    log(f"[greet] Received params: {params.model_dump()}")
    
    recipient_name = params.name
    is_awesome = recipient_name.startswith('A') or recipient_name.startswith('T')
    status = 'awesome' if is_awesome else 'not awesome'
    
    return {
        "content": [{
            "type": "text",
            "text": f"Hello, {recipient_name}! You are {status}"
        }]
    }

if __name__ == "__main__":
    log("Starting MCP (FastMCP) Python server...")
    mcp.run(transport="stdio") 
    log("MCP Server is done.")
