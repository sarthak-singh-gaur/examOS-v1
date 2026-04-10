"""
Master Extractor for ExamOS
Handles multiple subjects and formats (docx tables, docx paragraphs, txt inline, txt key).
"""
import sys, os, re, json
from docx import Document

def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()

def parse_docx_paragraphs(path):
    doc = Document(path)
    full_text = '\n'.join(p.text.strip() for p in doc.paragraphs if p.text.strip())
    questions = []
    
    # Anchor on "Correct Answer: X"
    answer_positions = list(re.finditer(r'Correct\s+Answer:\s*([A-D])', full_text))
    
    for idx, ans_match in enumerate(answer_positions):
        correct_letter = ans_match.group(1).upper()
        correct_idx = ord(correct_letter) - ord('A')
        
        search_start = answer_positions[idx-1].end() if idx > 0 else 0
        block_text = full_text[search_start:ans_match.end()]
        
        # Look for Q\d. or \d.
        q_header = re.search(r'(?:Q)?(\d+)[\.\)]\s*(?:\[(\w+)\])?\s*', block_text)
        if not q_header: continue
        
        # Options
        opt_a = re.search(r'A\)\s*', block_text)
        opt_b = re.search(r'B\)\s*', block_text)
        opt_c = re.search(r'C\)\s*', block_text)
        opt_d = re.search(r'D\)\s*', block_text)
        
        if not (opt_a and opt_b and opt_c and opt_d):
            # Try searching in the broader block if headers are weird
            continue
            
        q_text = block_text[q_header.end():opt_a.start()].strip()
        o_a = block_text[opt_a.end():opt_b.start()].strip()
        o_b = block_text[opt_b.end():opt_c.start()].strip()
        o_c = block_text[opt_c.end():opt_d.start()].strip()
        o_d = block_text[opt_d.end():ans_match.start()].strip()
        
        # After answer - get explanation
        explanation_block = full_text[ans_match.end():]
        next_q = answer_positions[idx+1].start() if idx+1 < len(answer_positions) else len(full_text)
        expl_text = full_text[ans_match.end():next_q]
        e_match = re.search(r'(?:Detailed\s+)?Explanation:\s*(.+?)(?=\n(?:Q?\d+\.|UNIT|$))', expl_text, re.DOTALL)
        explanation = clean_text(e_match.group(1)) if e_match else ""

        questions.append({
            "question": clean_text(q_text),
            "options": [clean_text(o_a) or "(formula)", clean_text(o_b) or "(formula)", clean_text(o_c) or "(formula)", clean_text(o_d) or "(formula)"],
            "correctAnswer": correct_idx,
            "explanation": explanation
        })
    return questions

def parse_txt_dsa(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    questions = []
    
    # Check if this file has an "ANSWER KEY"
    if "ANSWER KEY" in content:
        # Split into questions and key
        body, key_part = content.split("ANSWER KEY", 1)
        # Parse key
        # Format: 1 c 2 c ...
        key_matches = re.findall(r'(\d+)\s+([a-d])', key_part, re.IGNORECASE)
        key_dict = {int(num): letter.lower() for num, letter in key_matches}
        
        # Parse questions from body
        q_blocks = re.split(r'\n(?=\d+\.\s)', body)
        for block in q_blocks:
            q_header = re.match(r'(\d+)\.\s*(.+?)(?=\na\))', block, re.DOTALL)
            if not q_header: continue
            
            num = int(q_header.group(1))
            q_text = clean_text(q_header.group(2))
            
            opts = re.findall(r'[a-d]\)\s*(.+?)(?=\n[a-d]\)|\n|$)', block, re.DOTALL)
            if len(opts) < 4: continue
            
            ans_letter = key_dict.get(num)
            if not ans_letter: continue
            
            questions.append({
                "question": q_text,
                "options": [clean_text(o) for o in opts[:4]],
                "correctAnswer": ord(ans_letter) - ord('a'),
                "explanation": "Fundamental topic in basic Data Structures."
            })
    else:
        # Inline ✅ Answer: x format
        q_blocks = re.split(r'\n(?=\d+\.\s)', content)
        for block in q_blocks:
            q_header = re.match(r'(\d+)\.\s*(.+?)(?=\na\))', block, re.DOTALL)
            if not q_header: continue
            
            q_text = clean_text(q_header.group(2))
            opts = re.findall(r'[a-d]\)\s*(.+?)(?=\n[a-d]\)|\n✅|\n|$)', block, re.DOTALL)
            if len(opts) < 4: continue
            
            ans_match = re.search(r'✅ Answer:\s*([a-d])', block, re.IGNORECASE)
            if not ans_match: continue
            
            questions.append({
                "question": q_text,
                "options": [clean_text(o) for o in opts[:4]],
                "correctAnswer": ord(ans_match.group(1).lower()) - ord('a'),
                "explanation": "Core DSA principle covered in foundational units."
            })
    return questions

# === SUBJECT TAGGING ===
def tag_topic(q, subject):
    text = (q['question'] + ' '.join(q['options'])).lower()
    if subject == 'dsa':
        if any(w in text for w in ['stack', 'push', 'pop', 'lifo']): return 'stacks-expressions'
        if any(w in text for w in ['queue', 'fifo', 'rear', 'front']): return 'queues'
        if any(w in text for w in ['linked', 'node', 'pointer']): return 'linked-lists'
        if any(w in text for w in ['tree', 'bst', 'root']): return 'trees-bst'
        if any(w in text for w in ['graph', 'edge', 'vertex']): return 'graphs'
        return 'data-structures-basics'
    if subject == 'oops':
        if any(w in text for w in ['class', 'object', 'member']): return 'classes-objects'
        if any(w in text for w in ['inhertance', 'base', 'derived', 'virtual']): return 'inheritance-polymorphism'
        if any(w in text for w in ['template', 'generic']): return 'templates'
        return 'cpp-basics'
    if subject == 'finance':
        if any(w in text for w in ['journal', 'ledger', 'debit', 'credit']): return 'accounting-cycle'
        if any(w in text for w in ['asset', 'liability', 'equity']): return 'accounting-basics'
        return 'general-finance'
    return 'general'

# === EXECUTION ===
subjects = {
    'dsa': {
        'docx': [r'resources\MCQs\DSA\BCA Data Structures MCQ Generation.docx'],
        'txt': [r'resources\MCQs\DSA\DSA_unit1.txt', r'resources\MCQs\DSA\DSA_unit2.txt', r'resources\MCQs\DSA\DSA_unit3.txt', r'resources\MCQs\DSA\DSA_unit4.txt', r'resources\MCQs\DSA\DSA_unit5.txt']
    },
    'finance': {
        'docx': [r'resources\MCQs\FINNANCE and ACCOUNTING\BCA Financial Accounting Exam Prep.docx']
    },
    'oops': {
        'docx': [r'resources\MCQs\C++\C++ MCQ Bank Generation.docx', r'resources\MCQs\C++\C++ OOP MCQ Bank Generation.docx']
    }
}

for sub, paths in subjects.items():
    all_qs = []
    if 'docx' in paths:
        for p in paths['docx']:
            all_qs.extend(parse_docx_paragraphs(p))
    if 'txt' in paths:
        for p in paths['txt']:
            all_qs.extend(parse_txt_dsa(p))
    
    print(f"Extracted {len(all_qs)} questions for {sub}")
    
    # Update JSON
    bank_path = f"frontend/src/data/mcq_bank_{sub}.json"
    if not os.path.exists(bank_path): continue
    
    with open(bank_path, 'r', encoding='utf-8') as f:
        bank = json.load(f)
    
    # Group by topics
    topic_map = {t['id']: t for t in bank['topics']}
    for q in all_qs:
        tid = tag_topic(q, sub)
        # Find matching topic or use default
        target = topic_map.get(tid)
        if not target and bank['topics']:
            target = bank['topics'][0]
        
        if target:
            # Check for duplicates by question text
            if any(q['question'].lower()[:50] in ex['question'].lower()[:50] for ex in target['questions']):
                continue
            
            q_id = f"{sub}-{tid}-new-{len(target['questions'])+1}"
            target['questions'].append({
                "id": q_id,
                "question": q['question'],
                "options": q['options'],
                "correctAnswer": q['correctAnswer'],
                "explanation": q['explanation'] or "Explanation available in reference materials."
            })
    
    with open(bank_path, 'w', encoding='utf-8') as f:
        json.dump(bank, f, indent=2, ensure_ascii=False)
    print(f"Updated {bank_path} to {sum(len(t['questions']) for t in bank['topics'])} questions.")
