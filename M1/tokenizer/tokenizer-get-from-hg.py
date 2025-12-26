from transformers import AutoTokenizer

tokenizer_name = "bert-base-uncased"

tokenizer = AutoTokenizer.from_pretrained(tokenizer_name)
tokenizer.save_pretrained(f"tokenizers/{tokenizer_name}")

print(tokenizer.tokenize("Hello, how are you?"))
