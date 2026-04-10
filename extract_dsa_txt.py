"""
Extract MCQs from DSA TXT files.
Format:
1. Question
a) ...
b) ...
c) ...
d) ...
✅ Answer: x
"""
import sys, os, re, json

def parse_dsa_txt(directory):
    questions = []
    files = [f for f in os.listdir(directory) if f.startswith("DSA_unit") and f.endswith(".txt")]
    
    for filename in files:
        path = os.path.join(directory, filename)
        unit_match = re.search(r'unit(\d)', filename)
        unit_num = unit_match.group(1) if unit_match else "Mixed"
        
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Split by question pattern: digits followed by dot at start of line
        parts = re.split(r'(?=\n?\d+\.\s)', content)
        
        for part in parts:
            if not part.strip(): continue
            
            # Extract question text
            q_match = re.search(r'(\d+)\.\s*(.+?)(?=\n[a-d]\))', part, re.DOTALL)
            if not q_match: continue
            
            q_num = q_match.group(1)
            q_text = q_match.group(2).strip()
            
            # Extract options
            opts_matches = re.findall(r'[a-d]\)\s*(.+?)(?=\n[a-d]\)|\n✅|\n\s*$)', part, re.DOTALL)
            if len(opts_matches) < 4: continue
            
            options = [o.strip() for o in opts_matches[:4]]
            
            # Extract answer
            ans_match = re.search(r'✅ Answer:\s*([a-d])', part, re.IGNORECASE)
            if not ans_match: continue
            
            ans_letter = ans_match.group(1).lower()
            ans_idx = ord(ans_letter) - ord('a')
            
            questions.append({
                "question": q_text.replace('\n', ' '),
                "options": options,
                "correctAnswer": ans_idx,
                "explanation": f"This question is part of Unit {unit_num} fundamentals.",
                "unit": f"Unit {unit_num}",
                "source": "txt_file"
            })
            
    return questions

dsa_directory = r"resources\MCQs\DSA"
new_dsa_qs = parse_dsa_txt(dsa_directory)

print(f"Extracted {len(new_dsa_qs)} questions from DSA TXT files.")

# Load existing DSA bank
bank_path = r"frontend\src\data\mcq_bank_dsa.json"
with open(bank_path, 'r', encoding='utf-8') as f:
    dsa_bank = json.load(f)

# Merge logic: Group by topic as before
def tag_dsa_topic(q):
    text = (q['question'] + ' '.join(q['options'])).lower()
    if any(w in text for w in ['stack', 'push', 'pop', 'lifo', 'postfix', 'infix', 'prefix']): return 'stacks-expressions'
    if any(w in text for w in ['queue', 'fifo', 'enqueue', 'dequeue', 'priority queue']): return 'queues'
    if any(w in text for w in ['linked list', 'node', 'pointer', 'doubly', 'singly']): return 'linked-lists'
    if any(w in text for w in ['tree', 'binary tree', 'bst', 'inorder', 'preorder', 'postorder']): return 'trees-bst'
    if any(w in text for w in ['graph', 'bfs', 'dfs', 'adjacency', 'vertex', 'edge']): return 'graphs'
    if any(w in text for w in ['array', 'matrix', 'row-major', 'column-major']): return 'arrays-matrices'
    if any(w in text for w in ['complexity', 'big o', 'algorithm']): return 'algorithms-complexity'
    return 'data-structures-basics'

# Add new questions to existing topics
topic_map = {t['id']: t for t in dsa_bank['topics']}

for q in new_dsa_qs:
    tid = tag_dsa_topic(q)
    if tid not in topic_map:
        # Create new topic if doesn't exist (though it should)
        new_topic = {
            "id": tid,
            "title": tid.replace('-', ' ').title(),
            "unit": q['unit'],
            "questions": []
        }
        dsa_bank['topics'].append(new_topic)
        topic_map[tid] = new_topic
    
    # Assign unique ID
    q['id'] = f"dsa-{tid}-txt-{len(topic_map[tid]['questions']) + 1}"
    topic_map[tid]['questions'].append({
        "id": q['id'],
        "question": q['question'],
        "options": q['options'],
        "correctAnswer": q['correctAnswer'],
        "explanation": q['explanation']
    })

# Write back
with open(bank_path, 'w', encoding='utf-8') as f:
    json.dump(dsa_bank, f, indent=2, ensure_ascii=False)

total_dsa = sum(len(t['questions']) for t in dsa_bank['topics'])
print(f"Total DSA questions now: {total_dsa}")
