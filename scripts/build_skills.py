"""Create in-app skill reference from Blood Bowl Base BB2025 skills and traits.

Input: /tmp/bb2025-skills.html from
https://bloodbowlbase.ru/bb2025/core_rules/skills_and_traits/
Only entries used by the team rosters are included.
"""
import json
import re
from pathlib import Path
from lxml import html

teams = json.loads(Path('data/teams-2025.json').read_text())
needed = {skill[1] for team in teams.values() for p in team['positions'] for skill in p[6]}
tree = html.parse('/tmp/bb2025-skills.html')
source = 'https://bloodbowlbase.ru/bb2025/core_rules/skills_and_traits/'
output = {}
for heading in tree.xpath('//h4[@id]'):
    skill_id = heading.get('id')
    if skill_id not in needed:
        continue
    title = re.sub(r'\s*\((ACTIVE|PASSIVE)\)\s*$', '', ' '.join(heading.text_content().split())).rstrip('*')
    kind = 'active' if '(ACTIVE)' in heading.text_content() else 'passive'
    parts = []
    sibling = heading.getnext()
    while sibling is not None and sibling.tag not in ('h2', 'h3', 'h4'):
        part = ' '.join(sibling.text_content().split())
        if part: parts.append(part)
        sibling = sibling.getnext()
    assert parts, skill_id
    output[skill_id] = {'title': title.title(), 'kind': kind, 'paragraphs': parts, 'source': source + '#' + skill_id}
assert set(output) == needed, sorted(needed-set(output))
Path('data/skills-2025.json').write_text(json.dumps(output, ensure_ascii=False, indent=2)+'\n')
Path('dist/skills.js').write_text('const SKILLS = '+json.dumps(output, ensure_ascii=False, separators=(',', ':'))+';\n')
print(len(output), 'skills')
