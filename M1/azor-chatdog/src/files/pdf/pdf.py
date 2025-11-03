from fpdf import FPDF
import textwrap
import os
from files.config import OUTPUT_DIR
from cli import console
from markdown import Markdown

def generate_pdf_from_markdown(markdown_content, output_filename):
    pdf = FPDF()

    font_path = os.path.join(os.path.dirname(__file__), 'Lato')    
    pdf.add_font('Lato', '', os.path.join(font_path, 'Lato-Regular.ttf'))
    pdf.add_font('Lato', 'B', os.path.join(font_path, 'Lato-Bold.ttf'))
    pdf.add_font('Lato', 'I', os.path.join(font_path, 'Lato-Italic.ttf'))
    pdf.add_font('Lato', 'BI', os.path.join(font_path, 'Lato-BoldItalic.ttf'))

    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    pdf.set_font("Lato", size=12) 

    LINE_HEIGHT = 8
    
    md = Markdown()
    html_content = md.convert(markdown_content)
    
    # Użycie tagu <font> jest konieczne dla poprawnego ustawienia czcionki po Parsowaniu.
    html_template = f"""
    <font face="Lato">
    {html_content}
    </font>
    """
    
    pdf.write_html(html_template)


    final_filename = os.path.join(OUTPUT_DIR, output_filename)
    
    target_dir = os.path.dirname(final_filename)
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)

    pdf.output(final_filename)
    console.print_info(f"PDF file: {final_filename} generated successfully.")
