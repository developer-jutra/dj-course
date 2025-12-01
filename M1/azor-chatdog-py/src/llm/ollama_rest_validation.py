from pydantic import BaseModel, Field, validator
from typing import Literal

DEFAULT_OLLAMA_BASE_URL = "http://localhost:11434"

class OllamaRestConfig(BaseModel):
    engine: Literal["OLLAMA_REST"] = Field(default="OLLAMA_REST")
    model_name: str = Field(..., description="Nazwa modelu Ollama")
    ollama_base_url: str = Field(
        default=DEFAULT_OLLAMA_BASE_URL, 
        description="Adres URL serwera Ollama"
    )
    ollama_timeout: int = Field(
        default=120, 
        ge=1, 
        description="Timeout dla requestów (sekundy)"
    )
    
    @validator('ollama_base_url')
    def validate_url(cls, v):
        if not v.startswith(('http://', 'https://')):
            raise ValueError("URL musi zaczynać się od http:// lub https://")
        return v.rstrip('/')
    
    @validator('model_name')
    def validate_model_name(cls, v):
        if not v or v.strip() == "":
            raise ValueError("MODEL_NAME nie może być pusty")
        return v.strip()
