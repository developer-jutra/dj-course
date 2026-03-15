import os
import fnmatch

def get_file_stats(root_dir, exclude_dirs, exclude_pattern):
    file_data = []

    for root, dirs, files in os.walk(root_dir):
        # In-place modification of dirs to skip excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]

        for file in files:
            if not (file.endswith('.ts') or file.endswith('.tsx')):
                continue
            
            if fnmatch.fnmatch(file, exclude_pattern):
                continue

            full_path = os.path.join(root, file)
            
            try:
                with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                    lines = sum(1 for _ in f)
                file_data.append((full_path, lines))
            except Exception as e:
                # Log error to stderr if file is inaccessible
                print(f"Error reading {full_path}: {e}")

    return sorted(file_data, key=lambda x: x[1], reverse=True)

def main():
    # Configuration
    target_directory = "."
    excluded_folders = {'node_modules'}
    wildcard_exclude = "*.mocks.ts"

    stats = get_file_stats(target_directory, excluded_folders, wildcard_exclude)

    # Display results
    print(f"{'Lines':>8} | {'Path'}")
    print("-" * 50)
    for path, line_count in reversed(stats):
        print(f"{line_count:8} | {path}")

if __name__ == "__main__":
    main()
