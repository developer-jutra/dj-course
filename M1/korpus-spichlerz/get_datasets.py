"""
This module provides functionalities to create necessary directories and save documents
of specified quality from the speakleash dataset to a specified folder.

Use `get_data(txt_folder_name)` function for creating directories and
`save_quality_docs(txt_folder_name, quality)` for saving documents of a given quality.

Example usage:

1. In the `save_quality_docs` function, specify the name of the dataset to be downloaded
   by setting the `quality` parameter.
2. Set the `limit` variable in the `save_quality_docs` function to determine how many documents you want to retrieve.
3. Import the module and use the provided functions in your own Python script.
4. Run this script directly from the command line.
5. If not present, a folder named "datasets" will be created in the script's directory to store the downloaded dataset.
6. If not present, another folder named "datasets_high_quality_txt" will be created to store high-quality text files.

This usage information covers the main aspects of the script, including the modification of key parameters,
importing and using the module's functions, directly running the script,
and the output resulting from running the script.
"""


import os
from speakleash import Speakleash


def get_data(txt_folder_name):
    """
    This method creates the necessary directories if they don't already exist.

    :param txt_folder_name: The name of the folder where the high-quality documents will be saved.
    :return: None
    """
    base_dir = os.path.join(".")
    speakleash_dir = os.path.join(base_dir, "datasets")
    replicate_to_txt = os.path.join(base_dir, txt_folder_name)

    if not os.path.exists(speakleash_dir):
        os.makedirs(speakleash_dir)
    if not os.path.exists(replicate_to_txt):
        os.makedirs(replicate_to_txt)


def save_quality_docs(txt_folder_name, quality='HIGH'):
    """
    This method saves documents of the specified quality from the Speakleash dataset to a specified folder.

    :param txt_folder_name: The name of the folder where the documents will be saved.
    :param quality: The judge quality of the documents.
    :return: None
    """
    base_dir = os.path.join(".")
    speakleash_dir = os.path.join(base_dir, "datasets")
    replicate_to_txt = os.path.join(base_dir, txt_folder_name)

    sl = Speakleash(speakleash_dir)
    name = "plwiki"
    limit = 80
    counter = 0
    ds = sl.get(name).ext_data

    for doc in ds:
        txt, meta = doc
        if meta.get("quality", "") == quality:
            print(f"{quality}-quality document")
            with open(os.path.join(replicate_to_txt, f'{quality}_quality_doc_{counter}.txt'), 'w', encoding='utf-8') as out_file:
                out_file.write(txt)
            counter += 1
            if counter > limit:
                break


if __name__ == "__main__":
    txt_folder_name = "datasets_high_quality_txt"
    get_data(txt_folder_name)
    save_quality_docs(txt_folder_name, "HIGH")

