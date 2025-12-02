from pydantic import BaseModel, Field, validator
from typing import Literal, Optional

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
    temperature: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=2.0,
        description="Temperature for response generation (0.0-2.0)"
    )
    top_p: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=1.0,
        description="Top P (nucleus sampling) for response generation (0.0-1.0)"
    )
    top_k: Optional[int] = Field(
        default=None,
        ge=1,
        description="Top K for response generation (minimum 1)"
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
