from pydantic import BaseModel, Field, validator
from typing import Literal

class OllamaConfig(BaseModel):
    engine: Literal["OLLAMA"] = Field(default="OLLAMA")
    model_name: str = Field(..., description="Nazwa modelu Ollama")
    ollama_api_base_url: str = Field(..., description="Bazowy URL do API Ollama")
    
    @validator('ollama_api_base_url')
    def validate_api_base_url(cls, v):
        if not v or v.strip() == "":
            raise ValueError("OLLAMA_API_BASE_URL nie może być pusty")
        return v.strip()
