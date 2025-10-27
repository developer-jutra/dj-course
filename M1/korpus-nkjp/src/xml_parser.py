import xml.etree.ElementTree as ET
import os

WORKDIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def extract_text_from_xml(xml_file):
    tree = ET.parse(xml_file)
    root = tree.getroot()
    text = ""
    for elem in root.iter():
        if elem.tag.endswith('}ab'):
            if elem.text:
                text += elem.text.strip() + '\n'
    return text