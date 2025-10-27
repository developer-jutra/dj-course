import os

def save_text_to_file(text, text_file):
    with open(text_file, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"File {text_file} has been generated successfully.")

def analyze_content(workdir):
    content_path = os.path.join(workdir, 'content')
    subdirs = [f.path for f in os.scandir(content_path) if f.is_dir()]
    total_subdirs = len(subdirs)
    found_files = 0
    folders_with_text_xml = []
    for subdir in subdirs:
        if os.path.exists(os.path.join(subdir, 'text.xml')):
            found_files += 1
            folders_with_text_xml.append(os.path.basename(subdir))
    
    print(f"Found {total_subdirs} subdirectories in the content folder.")
    print(f"Found 'text.xml' in {found_files} of them.")
    if total_subdirs > 0:
        percentage_found = (found_files / total_subdirs) * 100
        percentage_not_found = 100 - percentage_found
        print(f"{percentage_found:.2f}% of subdirectories contain 'text.xml'.")
        print(f"{percentage_not_found:.2f}% of subdirectories do not contain 'text.xml'.")
    
    return folders_with_text_xml