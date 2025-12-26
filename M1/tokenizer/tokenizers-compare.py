from dataclasses import dataclass
from tokenizers import Tokenizer
from corpora import get_corpus_file
from asciitools import ascii_table, ItemValue, Labels

@dataclass
class Book:
    id: int
    filename: str
    catalog: str
    label: str

BOOKS = [
    Book(1, "pan-tadeusz-ksiega-1.txt", "WOLNELEKTURY", "Pan Tadeusz, Księga 1"),
    Book(2, "the-pickwick-papers-gutenberg.txt", "MINI", "The Pickwick Papers"),
    Book(3, "fryderyk-chopin-wikipedia.txt", "MINI", "Fryderyk Chopin"),
]

TOKENIZERS = [
    "bert-base-uncased",
    "bielik-v1-tokenizer",
    "bielik-v2-tokenizer",
    "bielik-v3-tokenizer",
    "tokenizer-all-corpora-16k-2x",
    "tokenizer-all-corpora-32k-1x",
    "tokenizer-all-corpora-32k-2x",
    "tokenizer-all-corpora-32k-3x",
    "tokenizer-all-corpora-64k-2x",
    "tokenizer-nkjp",
    "tokenizer-pan-tadeusz",
    "tokenizer-wolnelektury",
]

def compare_tokenizers():
    for book in BOOKS:
        print(f"\n# Book: {book.label} ")
        # print(get_corpus_file(book.catalog, book.filename))
        with open(get_corpus_file(book.catalog, book.filename)[0], "r", encoding="utf-8") as f:
            text = f.read()
            print(f"Length of text: {len(text)} characters")

        table: list[ItemValue] = []
        for tokenizer_name in TOKENIZERS:
            tokenizer = Tokenizer.from_file(f"tokenizers/{tokenizer_name}.json")
            tokens = tokenizer.encode(text)
            # print(f"\n{tokenizer_name}: {len(tokens)} tokens", end="")
            table.append(ItemValue(tokenizer_name, len(tokens)))

        ascii_table(table, Labels("Tokenizer", "Tokens", "Graphical"))
        # print(table)
        # print("\n")

if __name__ == "__main__":
    compare_tokenizers()
