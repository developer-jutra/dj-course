import sys
import os
import dotenv

dotenv.load_dotenv()
# Force UTF-8 encoding for Windows console and HTTP libraries

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
    os.environ["PYTHONIOENCODING"] = "utf-8"

import chat

if __name__ == "__main__":
    chat.init_chat()
    chat.main_loop()
