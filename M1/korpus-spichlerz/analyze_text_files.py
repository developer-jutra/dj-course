import os
import pandas as pd

def analyze_text_files(folder_path):
    """
    Analizuje pliki .txt w podanym folderze i wyświetla statystyki w formie tabeli.

    :param folder_path: Ścieżka do folderu do analizy.
    :return: None
    """
    txt_files = [f for f in os.listdir(folder_path) if f.endswith('.txt')]
    num_txt_files = len(txt_files)

    print(f"Liczba plików .txt w folderze '{folder_path}': {num_txt_files}\n")

    data = []
    for filename in txt_files:
        filepath = os.path.join(folder_path, filename)
        file_size = os.path.getsize(filepath)

        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            num_lines = len(lines)
            num_words = 0
            for line in lines:
                words = line.split()
                num_words += len(words)

        data.append([filename, file_size, num_lines, num_words])

    df = pd.DataFrame(data, columns=['Nazwa pliku', 'Rozmiar (B)', 'Liczba wierszy', 'Liczba słów'])
    print(df)


# Użyj funkcji do analizy folderu 'datasets_high_quality_txt'
analyze_text_files("datasets_high_quality_txt")

