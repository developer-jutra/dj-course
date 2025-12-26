import mlflow

# define a prompt template
prompt_template = """\
You are an expert AI assistant. Answer the user's question with clarity, accuracy, and conciseness.

## Question:
{{question}}

## Guidelines:
- Keep responses factual and to the point.
- If relevant, provide examples or step-by-step instructions.
- If the question is ambiguous, clarify before answering.

Respond below:
"""

# register the prompt
prompt = mlflow.genai.register_prompt(
    name="ai_assistant_prompt",
    template=prompt_template,
    commit_message="Initial version of AI assistant",
)
