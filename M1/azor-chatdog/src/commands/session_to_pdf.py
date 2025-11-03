from typing import List, Dict
from files.pdf.pdf import generate_pdf_from_markdown
from cli import console

def export_session_to_pdf(history: List[Dict], session_id: str, assistant_name: str):
    """
    Exports the session history to a PDF file.

    Args:
        history: List of dictionaries in the format {"role": "user|model", "parts": [{"text": "..."}]}
        session_id: The ID of the session.
        assistant_name: The name of the assistant to display.
    """
    if not history:
        console.print_info("Session history is empty. No PDF will be generated.")
        return

    markdown_content = f"# Chat Session: {session_id}\n\n"

    for message in history:
        role = message.get("role", "")
        display_role = "User" if role == "user" else assistant_name
        
        text = ""
        if 'parts' in message and message['parts']:
            text = message['parts'][0].get('text', '')

        markdown_content += f"## {display_role}\n\n"
        markdown_content += f"{text}\n\n"

    output_filename = f"{session_id}.pdf"
    
    try:
        generate_pdf_from_markdown(markdown_content, output_filename)
    except Exception as e:
        console.print_error(f"Failed to generate PDF: {e}")

