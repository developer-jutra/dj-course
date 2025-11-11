import mlflow
from openai import OpenAI
import os

# --- OpenAI Client Configuration (for local server communication) ---
# An API key is not strictly needed, but the client requires a Base URL to be passed
# The Base URL points to the locally running Llama.cpp server

LLAMA_CPP_SERVER = {
    "engine": "llama-cpp",
    "model": "whatever-model", # 🔥🔥🔥 tu nie ma różnicy co wpiszesz, bo na tym URLu jest tylko 1 model
    "base_url": "http://localhost:8080/v1",
}
OLLAMA_SERVER = {
    "engine": "ollama",
    "model": "gemma3:4b", # 🔥🔥🔥 tu JEST różnica, bo ollama ma wiele modeli, a llama-cpp ma tylko 1 model
    "base_url": "http://localhost:11434/v1",
}
SERVER = OLLAMA_SERVER

# --- MLflow Configuration ---
# Enable automatic logging for OpenAI calls
# This will work because the local server is compatible with the OpenAI API
mlflow.openai.autolog()

mlflow.set_tracking_uri("http://127.0.0.1:5005/")
# Set the MLflow experiment
mlflow.set_experiment(f"DJ_local_model_tracking_{SERVER['engine']}")

client = OpenAI(
    base_url=SERVER["base_url"],
    api_key="sk-not-needed",
)

# --- Perform Inference and Tracking ---
with mlflow.start_run() as run:
    print(f"Tracking started in MLflow Run ID: {run.info.run_id}")

    # Model call
    try:
        completion = client.chat.completions.create(
            model=SERVER["model"],
            messages=[
                {"role": "system", "content": "You are an expert in coding in Python."},
                {"role": "user", "content": "Create a simple Python module to plot a sine wave using pandas."},
            ],
            temperature=0.5,
            max_tokens=450,
        )

        # Retrieve and display the response
        response_text = completion.choices[0].message.content
        print("\n--- Model Response ---")
        print(response_text)
        print("------------------------")

    except Exception as e:
        print(f"Error connecting to the model: {e}")
        print(f"Make sure the {SERVER['engine']}.server is running at {SERVER['base_url']}.")

    # The interaction data (prompt, response, parameters, tokens) is now
    # automatically logged as a 'Trace' in MLflow thanks to autologging.
    print(f"\nThe Trace is available in the MLflow UI in the 'Traces' section for Run ID: {run.info.run_id}")

