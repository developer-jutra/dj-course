import mlflow
from openai import OpenAI

prompt = mlflow.genai.load_prompt("ai_assistant_prompt")

# set an active model for linking traces, a model named `openai_model` will be created
mlflow.set_active_model(name="openai_model")

# turn on autologging for automatic tracing
mlflow.openai.autolog()

# Initialize OpenAI client
client = OpenAI()

question = "What is MLflow?"
response = (
    client.chat.completions.create(
        messages=[{"role": "user", "content": prompt.format(question=question)}],
        model="gpt-4o-mini",
        temperature=0.1,
        max_tokens=2000,
    )
    .choices[0]
    .message.content
)

# get the active model id
active_model_id = mlflow.get_active_model_id()
print(f"Current active model id: {active_model_id}")

mlflow.search_traces(model_id=active_model_id)
#                            trace_id                                             trace  ...  assessments                        request_id
# 0  7bb4569d3d884e3e87b1d8752276a13c  Trace(trace_id=7bb4569d3d884e3e87b1d8752276a13c)  ...           []  7bb4569d3d884e3e87b1d8752276a13c
# [1 rows x 12 columns]
