from files.pdf.pdf import generate_pdf_from_markdown

def main():
    markdown_content = """
# Weekly Report

## Key Activities Summary

This document was generated directly from Markdown text using Python modules.

### Future Conclusions

* Using PyFPDF is very straightforward.
* It allows control over document elements.
* Ideal for simple reports without complex formatting.
"""
    output_file = "daily_report.pdf"
    
    generate_pdf_from_markdown(markdown_content, output_file)

if __name__ == "__main__":
    main()
