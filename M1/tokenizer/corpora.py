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

# removing PAN_TADEUSZ from ALL_CORPORA to avoid duplicates (PAN_TADEUSZ is already in WOLNELEKTURY)
KEYS_WITHOUT_PAN_TADEUSZ = [key for key in CORPORA_FILES.keys() if key != "PAN_TADEUSZ"]
CORPORA_FILES["ALL"] = [
    FILE for key in KEYS_WITHOUT_PAN_TADEUSZ for FILE in CORPORA_FILES[key]
]

def get_corpus_file(corpus_name: str, glob_pattern: str) -> Path:
    if corpus_name == "ALL":
        all_files = []
        for files in CORPORA_FILES.values():
            all_files.extend(files)
        return [f for f in all_files if f.match(glob_pattern)]
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
    print("all *.txt", len(get_corpus_file("ALL", "*.txt")))
    print("all pan-tadeusz", len(get_corpus_file("ALL", "pan-tadeusz-ksiega-*.txt")))
    print("ALL", CORPORA_FILES["ALL"])
