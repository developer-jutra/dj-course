import glob
from pathlib import Path

CORPORA_DIRS = {
    "NKJP": Path("../korpus-nkjp/output"),
    "WOLNELEKTURY": Path("../korpus-wolnelektury"),
}

CORPORA_FILES = {
    "NKJP": list(CORPORA_DIRS["NKJP"].glob("*.txt")),
    "WOLNELEKTURY": list(CORPORA_DIRS["WOLNELEKTURY"].glob("*.txt")),
    "PAN_TADEUSZ": list(CORPORA_DIRS["WOLNELEKTURY"].glob("pan-tadeusz-ksiega-*.txt")),
}

CORPORA_FILES["ALL"] = [
    FILE for LIST in CORPORA_FILES.values() for FILE in LIST
]

def get_corpus_file(corpus_name: str, glob_pattern: str) -> Path:
    if corpus_name not in CORPORA_FILES:
        raise ValueError(f"Corpus {corpus_name} not found")
    return list(CORPORA_DIRS[corpus_name].glob(glob_pattern))

if __name__ == "__main__":    
    print("\ncorpora:")
    for corpus_name, corpus_files in CORPORA_FILES.items():
        print(f"{corpus_name}: {len(corpus_files)}")

    print("\nget_corpus_file:")
    print("nkjp *", len(get_corpus_file("NKJP", "*.txt")))
    print("nkjp krzyzacy", len(get_corpus_file("WOLNELEKTURY", "krzyzacy-*.txt")))
    