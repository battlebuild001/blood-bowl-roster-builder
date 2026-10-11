"""Build the BB2025 team dataset from saved pages of the two user-specified sites.

Inputs: /tmp/bb2025-pages/*.html from bloodbowlbase.ru/bb2025/teams/
Slann data: bbroster.com/new-team and its same-origin roster data bundle.
"""
import json
import re
from pathlib import Path
from lxml import html

root = Path('/tmp/bb2025-pages')
output = {}
for file in sorted(root.glob('*.html')):
    tree = html.parse(str(file))
    article = tree.xpath('//article[contains(@class,"md-content__inner")]')[0]
    slug = file.stem
    key = slug.lower().replace('_', '')
    name = article.xpath('./h1')[0].text_content().strip()
    tier_text = article.xpath('./h1/following-sibling::p[1]')[0].text_content()
    tier = int(re.search(r'TIER\s+(\d)', tier_text).group(1))
    positions = []
    for index, row in enumerate(article.xpath('.//h3[@id="positionals"]/following-sibling::table[1]//tbody/tr')):
        cells = row.xpath('./td')
        for deleted in cells[0].xpath('.//del'): deleted.drop_tree()
        qty = cells[0].text_content().strip()
        limit = int(re.search(r'0[^\d]+(\d+)', qty).group(1))
        raw_name = ''.join(cells[1].xpath('./text()')).strip()
        big_guy = raw_name.endswith('*')
        position_name = raw_name.rstrip('*').strip()
        type_name = cells[1].xpath('./em')[0].text_content().strip('()').split(',')[0]
        stats = [x.text_content().strip() for x in cells[2:7]]
        for deleted in cells[7].xpath('.//del'): deleted.drop_tree()
        skill_names = [x.strip() for x in re.split(r'•', cells[7].text_content()) if x.strip() and x.strip() != '-']
        skill_links = cells[7].xpath('.//a[contains(@href,"skills_and_traits/#")]')
        assert len(skill_names) == len(skill_links), (slug, position_name)
        skills = [[skill_name, link.get('href').split('#')[-1]] for skill_name, link in zip(skill_names, skill_links)]
        price = int(re.search(r'(\d+)K', cells[10].text_content()).group(1))*1000
        positions.append([f'p{index}', position_name, limit, price, type_name, stats, skills, big_guy])
    staff_h = article.xpath('.//h3[@id="staff"]')[0]
    staff_text = staff_h.getnext().text_content()
    reroll = int(re.search(r'Re-roll\s*-\s*(\d+)K', staff_text).group(1))*1000
    league_h = article.xpath('.//h3[@id="league"]')[0]
    leagues = [x.text_content().strip() for x in league_h.getnext().xpath('./li')]
    special_h = article.xpath('.//h3[@id="special-rules"]')
    special = [x.text_content().strip() for x in special_h[0].getnext().xpath('./li')] if special_h else []
    big_max = {'Chaos_Chosen':1,'Chaos_Renegades':3,'Underworld_Denizens':1,'Old_World_Alliance':1}.get(slug)
    output[key] = dict(name=name,tier=tier,reroll=reroll,apothecary='Apothecary' in staff_text,positions=positions,bigGuyMax=big_max,leagues=leagues,specialRules=special,source=f'https://bloodbowlbase.ru/bb2025/teams/{slug}/')

# BB Roster lists Slann as a NAF team. Its new-team roster bundle lists these
# four position entries (IDs 137, 138, 139, 46) and a 50K reroll.
output['slann'] = dict(name='Slann',tier=2,reroll=50000,apothecary=True,positions=[
    ['p0','Slann Lineman',16,60000,'Lineman',['6','3','3+','4+','9+'],[['Pogo Stick','pogo-active']],False],
    ['p1','Slann Catcher',2,80000,'Catcher',['7','2','2+','3+','8+'],[['Diving Catch','diving-catch-active'],['On The Ball','on-the-ball-active'],['Pogo Stick','pogo-active'],['Very Long Legs','very-long-legs-active']],False],
    ['p2','Slann Blitzer',2,100000,'Blitzer',['7','3','3+','4+','9+'],[['Diving Tackle','diving-tackle-active'],['Hit and Run','hit-and-run-active'],['Jump Up','jump-up-active'],['Pogo Stick','pogo-active']],False],
    ['p3','Kroxigor',1,140000,'Big Guy',['6','5','5+','6+','10+'],[['Bone Head','bone-head-passive'],['Loner (4+)','loner-x-passive'],['Mighty Blow','mighty-blow-active'],['Prehensile Tail','prehensile-tail-active'],['Thick Skull','thick-skull-passive']],True],
],bigGuyMax=1,leagues=['Lustrian Superleague'],specialRules=[],nafTeam=True,source='https://bbroster.com/new-team')
assert len(output)==31, len(output)
assert sum(len(t['positions']) for t in output.values())==163
Path('dist/teams.js').write_text('const TEAMS = '+json.dumps(output,ensure_ascii=False,separators=(',',':'))+';\n')
Path('data').mkdir(exist_ok=True)
Path('data/teams-2025.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
print(len(output),'teams',sum(len(t['positions']) for t in output.values()),'positions')
