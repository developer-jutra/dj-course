from fpdf import FPDF
import textwrap
import os
from files.config import OUTPUT_DIR
from cli import console

def generate_pdf_from_markdown(markdown_content, output_filename):
    lines = markdown_content.strip().split('\n')

    pdf = FPDF()

    # FPDF.add_font(family, style, fname)
    font_path = os.path.join(os.path.dirname(__file__), 'Lato')
    # Regular (Normal - "")
    pdf.add_font('Lato', '', os.path.join(font_path, 'Lato-Regular.ttf'))
    # Bold ("B")
    pdf.add_font('Lato', 'B', os.path.join(font_path, 'Lato-Bold.ttf'))
    # Italic ("I")
    pdf.add_font('Lato', 'I', os.path.join(font_path, 'Lato-Italic.ttf'))
    # Bold Italic ("BI")
    pdf.add_font('Lato', 'BI', os.path.join(font_path, 'Lato-BoldItalic.ttf'))
    # ---------------------------------------------

    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    pdf.set_font("Lato", size=12) 

    MARGIN_LEFT = 10
    LINE_HEIGHT = 8
    PAGE_WIDTH = pdf.w - 2 * pdf.l_margin
    TEXT_WIDTH = PAGE_WIDTH - MARGIN_LEFT

    for line in lines:
        line = line.strip()
        if not line:
            pdf.ln(LINE_HEIGHT / 2)
            continue

        if line.startswith('# '):
            pdf.set_font('Lato', 'B', 24)
            pdf.multi_cell(TEXT_WIDTH, 12, line[2:].strip(), 0, 'L')
            pdf.ln(LINE_HEIGHT / 2)

        elif line.startswith('## '):
            pdf.set_font('Lato', 'B', 16)
            pdf.multi_cell(TEXT_WIDTH, 10, line[3:].strip(), 0, 'L')
            pdf.ln(LINE_HEIGHT / 3)

        elif line.startswith('### '):
            pdf.set_font('Lato', 'B', 12)
            pdf.multi_cell(TEXT_WIDTH, 8, line[4:].strip(), 0, 'L')
            pdf.ln(LINE_HEIGHT / 4)

        elif line.startswith('* '):
            pdf.set_font('Lato', '', 12) # Powrót do normalnego stylu
            list_item = line[2:].strip()
            wrapped_text = textwrap.wrap(list_item, width=int(TEXT_WIDTH / 7)) 
            
            pdf.set_x(MARGIN_LEFT + 5)
            pdf.multi_cell(TEXT_WIDTH - 5, LINE_HEIGHT, chr(149) + ' ' + wrapped_text[0], 0, 'L')
            
            for sub_line in wrapped_text[1:]:
                 pdf.set_x(MARGIN_LEFT + 10)
                 pdf.multi_cell(TEXT_WIDTH - 10, LINE_HEIGHT, sub_line, 0, 'L')
            
            pdf.ln(LINE_HEIGHT / 8)

        else:
            pdf.set_font('Lato', '', 12)
            pdf.set_x(MARGIN_LEFT)
            pdf.multi_cell(TEXT_WIDTH, LINE_HEIGHT, line, 0, 'L')

    final_filename = os.path.join(OUTPUT_DIR, output_filename)
    pdf.output(final_filename)
    console.print_info(f"PDF file: {final_filename} generated successfully.")
