from pydantic import BaseModel, Field, validator
from typing import Literal

DEFAULT_OLLAMA_BASE_URL = "http://localhost:11434"

class OllamaPythonConfig(BaseModel):
    engine: Literal["OLLAMA_PYTHON"] = Field(default="OLLAMA_PYTHON")
    model_name: str = Field(..., description="Nazwa modelu Ollama")
    ollama_host: str = Field(
        default=DEFAULT_OLLAMA_BASE_URL, 
        description="Adres hosta serwera Ollama"
    )
    ollama_timeout: float = Field(
        default=120.0, 
        ge=1.0, 
        description="Timeout dla requestów (sekundy)"
    )
    
    @validator('ollama_host')
    def validate_host(cls, v):
        if not v.startswith(('http://', 'https://')):
            raise ValueError("Host musi zaczynać się od http:// lub https://")
        return v.rstrip('/')
    
    @validator('model_name')
    def validate_model_name(cls, v):
        if not v or v.strip() == "":
            raise ValueError("MODEL_NAME nie może być pusty")
        return v.strip()
