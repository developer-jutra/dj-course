import os
import shutil
from xml_parser import extract_text_from_xml, WORKDIR
from files import save_text_to_file, analyze_content

def process_xml_files(file_map, clear_folder_path=None):
    if clear_folder_path and os.path.exists(clear_folder_path):
        for filename in os.listdir(clear_folder_path):
            file_path = os.path.join(clear_folder_path, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print(f'Failed to delete {file_path}. Reason: {e}')

    total_files_created = 0
    total_size_bytes = 0

    for xml_file, text_file in file_map.items():
        extracted_text = extract_text_from_xml(xml_file)
        save_text_to_file(extracted_text, text_file)
        total_files_created += 1
        total_size_bytes += os.path.getsize(text_file)

    print(f"\n--- Summary ---")
    print(f"Total files created: {total_files_created}")
    if total_size_bytes < 1024:
        print(f"Total size: {total_size_bytes} bytes")
    elif total_size_bytes < 1024 * 1024:
        print(f"Total size: {total_size_bytes / 1024:.2f} KB")
    else:
        print(f"Total size: {total_size_bytes / (1024 * 1024):.2f} MB")
    print(f"---------------")

def run_test():
    test_file_map = {
        os.path.join(WORKDIR, 'test', 'text.xml'): os.path.join(WORKDIR, 'test', 'text.txt')
    }
    process_xml_files(test_file_map, clear_folder_path=None)

def run_content():
    folders_with_xml = analyze_content(WORKDIR)
    content_file_map = {}
    output_dir = os.path.join(WORKDIR, 'output')
    os.makedirs(output_dir, exist_ok=True)

    for folder_name in folders_with_xml:
        xml_file_path = os.path.join(WORKDIR, 'content', folder_name, 'text.xml')
        text_file_path = os.path.join(output_dir, f'{folder_name}.txt')
        content_file_map[xml_file_path] = text_file_path
    
    process_xml_files(content_file_map, clear_folder_path=output_dir)

if __name__ == "__main__":
    run_test()
    run_content()
