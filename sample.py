import sys
import docx

def read_sample(filename):
    print(f"Reading from {filename}")
    doc = docx.Document(filename)
    for i, p in enumerate(doc.paragraphs):
        if str(p.text).strip() != "":
            print(f"P{i}: {p.text}")
        if i > 50:
            break

if __name__ == "__main__":
    if len(sys.argv) > 1:
        read_sample(sys.argv[1])
