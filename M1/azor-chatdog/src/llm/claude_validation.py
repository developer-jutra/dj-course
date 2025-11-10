from pydantic import BaseModel, Field, validator
from typing import Literal

class ClaudeConfig(BaseModel):
    engine: Literal["CLAUDE"] = Field(default="CLAUDE")
    model_name: str = Field(..., description="Nazwa modelu Claude")
    anthropic_api_key: str = Field(..., min_length=1, description="Klucz API Anthropic Claude")

    @validator('anthropic_api_key')
    def validate_api_key(cls, v):
        if not v or v.strip() == "":
            raise ValueError("ANTHROPIC_API_KEY nie może być pusty")
        return v.strip()
