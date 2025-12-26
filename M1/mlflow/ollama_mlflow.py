import mlflow
import requests

OLLAMA_API_URL = "http://localhost:11434/api/generate"

def ask_ollama(model: str, prompt: str) -> str:
    data = {
        "model": model,
        "prompt": prompt,
        "stream": False  # For full responses
    }
    response = requests.post(OLLAMA_API_URL, json=data)
    response_data = response.json()
    return response_data.get("response", "")

prompts = [
    "What is the capital of France?",
    "Explain containerization in one paragraph."
]

model_name = "llama2"

# Track each interaction in MLflow
for prompt in prompts:
    with mlflow.start_run(run_name=f"{model_name}_inference"):
        mlflow.log_param("model", model_name)
        mlflow.log_param("prompt", prompt)
        response = ask_ollama(model_name, prompt)
        mlflow.log_text(response, "ollama_response.txt")
        # Optional: Log length, latency, etc.
        mlflow.log_metric("response_length", len(response))
