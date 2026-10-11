const STORAGE_KEY = 'blood-bowl-roster-2025-v1';
const UI_KEY = 'blood-bowl-roster-2025-screen';
const LEGACY_KEY = 'blood-bowl-roster-2020-v1';
const LEGACY_POSITIONS = {
  human:{lineman:'p0',halfling:'p1',catcher:'p2',thrower:'p3',blitzer:'p4',ogre:'p5'},
  orc:{lineman:'p0',goblin:'p1',thrower:'p2',blitzer:'p3',bigun:'p4',troll:'p5'},
  skaven:{lineman:'p0',thrower:'p1',gutter:'p2',blitzer:'p3',ratogre:'p4'},
  dwarf:{lineman:'p0',runner:'p1',blitzer:'p2',slayer:'p3',deathroller:'p4'},
  undead:{skeleton:'p0',zombie:'p1',ghoul:'p2',wight:'p3',mummy:'p4'},
  darkelf:{lineman:'p0',runner:'p1',assassin:'p2',blitzer:'p3',witch:'p4'}
};
const money = n => Number(n).toLocaleString('ko-KR') + ' gp';
const $ = id => document.getElementById(id);
const fresh = () => ({team:'human',name:'',budget:1000000,league:TEAMS.human.leagues[0],players:[],staff:{rerolls:0,assistant:0,cheerleaders:0,fans:1,apothecary:0}});
const hadSavedRoster = Boolean(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY));
let state = fresh();
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (saved && TEAMS[saved.team] && Array.isArray(saved.players)) state = normalize(saved);
  else {
    const old = JSON.parse(localStorage.getItem(LEGACY_KEY));
    if (old && Array.isArray(old.players)) {
      const mappedTeam = old.team==='undead' ? 'shamblingundead' : old.team;
      const mappedPlayers = old.players.map(p=>({...p,pos:LEGACY_POSITIONS[old.team]?.[p.pos]}));
      state=normalize({...old,team:mappedTeam,players:mappedPlayers,staff:{...old.staff,fans:1}});
    }
  }
} catch {}

function normalize(raw) {
  const team = TEAMS[raw.team] ? raw.team : 'human';
  const budget = [1000000,1100000,1200000,1500000].includes(Number(raw.budget)) ? Number(raw.budget) : 1000000;
  const allowed = new Map(TEAMS[team].positions.map(p => [p[0],p]));
  const counts = {}; const players = [];
  for (const item of (Array.isArray(raw.players) ? raw.players : [])) {
    const pos = allowed.get(item.pos); if (!pos || players.length >= 16 || (counts[item.pos]||0) >= pos[2]) continue;
    if(pos[7] && TEAMS[team].bigGuyMax && players.filter(x=>allowed.get(x.pos)?.[7]).length>=TEAMS[team].bigGuyMax) continue;
    counts[item.pos] = (counts[item.pos]||0)+1;
    players.push({id:crypto.randomUUID(),pos:item.pos});
  }
  const clamp=(n,max)=>Math.min(max,Math.max(0,Number.parseInt(n,10)||0));
  const st=raw.staff||{};
  const league = TEAMS[team].leagues.includes(raw.league) ? raw.league : TEAMS[team].leagues[0];
  return {team,name:String(raw.name||'').slice(0,40),budget,league,players,staff:{rerolls:clamp(st.rerolls,8),assistant:clamp(st.assistant,6),cheerleaders:clamp(st.cheerleaders,6),fans:Math.min(3,Math.max(1,Number.parseInt(st.fans,10)||1)),apothecary:TEAMS[team].apothecary?clamp(st.apothecary,1):0}};
}
function team(){return TEAMS[state.team]}
function position(id){return team().positions.find(p=>p[0]===id)}
function playerCost(){return state.players.reduce((sum,p)=>sum+position(p.pos)[3],0)}
function fanCost(){return (state.staff.fans-1)*5000}
function staffCost(){const s=state.staff;return s.rerolls*team().reroll+s.assistant*10000+s.cheerleaders*10000+fanCost()+s.apothecary*50000}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));$('save-state').textContent='● 자동 저장됨'}
function canAdd(p){return state.players.length<16 && state.players.filter(x=>x.pos===p[0]).length<p[2] && (!p[7] || !team().bigGuyMax || state.players.filter(x=>position(x.pos)?.[7]).length<team().bigGuyMax)}
function renderPositions(){
  $('positions').innerHTML=team().positions.map(p=>{const n=state.players.filter(x=>x.pos===p[0]).length;const stats=p[5].map((v,i)=>`<span><small>${['MA','ST','AG','PA','AV'][i]}</small>${v}</span>`).join('');const skills=p[6].length?p[6].map(([name,id])=>`<button type="button" class="skill-chip" data-skill="${id}" aria-label="${escapeHTML(name)} 규칙 보기">${escapeHTML(name)}</button>`).join(''):'<span class="no-skills">시작 스킬 없음</span>';return `<div class="position"><div class="position-top"><div><div class="position-name">${escapeHTML(p[1])}</div><div class="position-limit">${n} / ${p[2]}명</div></div><div class="position-cost">${(p[3]/1000).toLocaleString()}k</div></div><div class="position-stats">${stats}</div><div class="position-skills">${skills}</div><div class="position-bottom"><span class="position-type">${escapeHTML(p[4])}${p[7]&&team().bigGuyMax?' · 빅 가이 제한 '+team().bigGuyMax+'명':''}</span><div class="position-actions"><button class="remove-position-btn" data-subtract="${p[0]}" aria-label="${escapeHTML(p[1])} 선수 1명 제외" ${n>0?'':'disabled'}>−</button><button class="add-btn" data-add="${p[0]}" aria-label="${escapeHTML(p[1])} 선수 1명 영입" ${canAdd(p)?'':'disabled'}>+</button></div></div></div>`}).join('');
}
function openSkill(id){
  const skill=SKILLS[id];if(!skill)return;
  $('skill-dialog-title').textContent=skill.title;
  $('skill-dialog-kind').textContent=skill.kind==='active'?'ACTIVE · 액티브':'PASSIVE · 패시브';
  $('skill-dialog-body').innerHTML=skill.paragraphs.map(p=>`<p>${escapeHTML(p)}</p>`).join('');
  $('skill-dialog-source').href=skill.source;
  $('skill-dialog').showModal();
}
function renderRoster(){
  $('player-count-title').textContent=`${state.players.length} / 16`;$('roster-pill').textContent=`${state.players.length}명`;
  $('empty-roster').hidden=state.players.length>0;
  $('roster-body').innerHTML=rosterRows(true);
}
function rosterRows(editable){
  return state.players.map((player,i)=>{const p=position(player.pos);const stats=p[5].map((value,index)=>`<span><small>${['MA','ST','AG','PA','AV'][index]}</small>${escapeHTML(value)}</span>`).join('');const skills=p[6].length?p[6].map(([name,id])=>`<button type="button" class="skill-chip" data-skill="${id}" aria-label="${escapeHTML(name)} 규칙 보기">${escapeHTML(name)}</button>`).join(''):'<span class="no-skills">—</span>';return `<tr><td>${String(i+1).padStart(2,'0')}</td><td class="roster-position">${escapeHTML(p[1])}</td><td><div class="roster-stats">${stats}</div></td><td><div class="roster-skills">${skills}</div></td><td class="roster-price">${money(p[3])}</td>${editable?`<td><button class="remove-btn" data-remove="${player.id}" aria-label="${i+1}번 선수 삭제">×</button></td>`:''}</tr>`}).join('');
}
function canConfirm(){return state.players.length>=11 && state.players.length<=16 && playerCost()+staffCost()<=state.budget}
function renderFinal(){
  const name=state.name.trim()||`${team().name} 로스터`;
  $('final-name').textContent=name;
  $('final-meta').textContent=`${team().name} · Tier ${team().tier} · ${state.league}`;
  $('final-count').textContent=`${state.players.length} / 16`;
  $('final-value').textContent=money(playerCost()+staffCost()-fanCost());
  $('final-remaining').textContent=money(state.budget-playerCost()-staffCost());
  $('final-rerolls').textContent=String(state.staff.rerolls);
  $('final-roster-body').innerHTML=rosterRows(false);
  const support=[['시작 예산',money(state.budget)],['재굴림',`${state.staff.rerolls}개 · ${money(state.staff.rerolls*team().reroll)}`],['어시스턴트 코치',`${state.staff.assistant}명`],['치어리더',`${state.staff.cheerleaders}명`],['열성 팬',`${state.staff.fans} · ${money(fanCost())}`],['아포세커리',state.staff.apothecary?'1명':'없음']];
  $('final-support').innerHTML=support.map(([label,value])=>`<div><span>${label}</span><strong>${value}</strong></div>`).join('');
  $('final-footer-team').textContent=`${name} · ${team().name}`;
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderStaff(){
  const rows=[['rerolls','재굴림',team().reroll,8,0],['assistant','어시스턴트 코치',10000,6,0],['cheerleaders','치어리더',10000,6,0],['fans','열성 팬',5000,3,1],['apothecary','아포세커리',50000,team().apothecary?1:0,0]];
  $('staff-list').innerHTML=rows.filter(r=>r[3]>0).map(([key,label,cost,max,min])=>`<div class="staff-row"><div class="staff-label"><strong>${label}</strong><small>${key==='fans'?'기본 1 · 추가 ':''}${money(cost)} / ${key==='fans'?'단계':'개'}</small></div><div class="stepper"><button data-step="${key}" data-delta="-1" aria-label="${label} 줄이기" ${state.staff[key]===min?'disabled':''}>−</button><span>${state.staff[key]}</span><button data-step="${key}" data-delta="1" aria-label="${label} 늘리기" ${state.staff[key]>=max?'disabled':''}>+</button></div></div>`).join('');
}
function renderBudget(){
  const pc=playerCost(),sc=staffCost(),spent=pc+sc,remaining=state.budget-spent;
  $('remaining').innerHTML=`${remaining.toLocaleString('ko-KR')} <small>gp</small>`;
  $('remaining').classList.toggle('negative',remaining<0);
  $('budget-progress').style.width=Math.min(100,spent/state.budget*100)+'%';$('budget-progress').classList.toggle('over',remaining<0);
  $('spent-summary').textContent=`사용 ${money(spent)}`;$('budget-summary').textContent=`총 ${money(state.budget)}`;
  $('player-cost').textContent=money(pc);$('staff-cost').textContent=money(sc);$('team-value').textContent=money(spent-fanCost());
  const status=$('status-card');status.className='status-card';
  if(remaining<0){status.classList.add('error');$('status-icon').textContent='×';$('status-title').textContent='예산 초과';$('status-detail').textContent=`${money(-remaining)}를 줄여야 합니다.`}
  else if(state.players.length<11){$('status-icon').textContent='!';$('status-title').textContent='로스터를 구성하세요';$('status-detail').textContent=`경기를 시작하려면 선수 ${11-state.players.length}명이 더 필요합니다.`}
  else{status.classList.add('ready');$('status-icon').textContent='✓';$('status-title').textContent='킥오프 준비 완료';$('status-detail').textContent=`선수 ${state.players.length}명 · 남은 예산 ${money(remaining)}`}
  $('confirm-roster-btn').disabled=!canConfirm();
}
function render(){
  $('team-name').value=state.name;$('team-current').textContent=team().name;$('budget-select').value=String(state.budget);
  $('team-meta').innerHTML=`<span>TIER ${team().tier}${team().nafTeam?' · NAF 팀':''}</span><span>${escapeHTML(state.league)}</span>${team().specialRules.length?`<span>특수 규칙: ${escapeHTML(team().specialRules.join(' · '))}</span>`:''}<a href="${team().source}" target="_blank" rel="noopener">팀 자료 ↗</a>`;
  renderPositions();renderRoster();renderStaff();renderBudget();save();
}
let stage = localStorage.getItem(UI_KEY) || (hadSavedRoster ? 'builder' : 'selection');
let referenceFrom = localStorage.getItem('blood-bowl-reference-return') || 'builder';
let guideTab = localStorage.getItem('blood-bowl-guide-tab') || 'rules';
let ruleChapter = 0;
let specialIndex = 0;
let skillCategory = 'All';
let skillQuery = '';
let selectedSkillId = Object.keys(SKILLS)[0];
const SKILL_CATEGORIES = [['All','전체'],['Agility','민첩'],['Devious','반칙'],['General','일반'],['Mutation','돌연변이'],['Passing','패스'],['Strength','힘'],['Trait','특성']];
let tutorialStep = 0;
let draft = {team:state.team,name:state.name,budget:state.budget,league:state.league};
const selectedTiers = new Set([1,2,3,4]);
let includeNAF = true;
let searchTerm = '';
function setStage(next){
  stage=next;localStorage.setItem(UI_KEY,next);
  $('selection-screen').hidden=next!=='selection';$('builder-screen').hidden=next!=='builder';$('final-screen').hidden=next!=='final';$('reference-screen').hidden=next!=='reference';
  document.body.classList.toggle('picking',next==='selection');
  document.body.classList.toggle('finalized',next==='final');
  document.body.classList.toggle('reading',next==='reference');
  if(next==='selection')renderPicker();
  if(next==='final')renderFinal();
  if(next==='reference')renderReference();
  window.scrollTo({top:0,behavior:'auto'});
}
function openReference(tab){
  if(stage!=='reference'){
    referenceFrom=stage;
    localStorage.setItem('blood-bowl-reference-return',referenceFrom);
  }
  guideTab=tab;
  localStorage.setItem('blood-bowl-guide-tab',guideTab);
  setStage('reference');
}
function sourceLink(url){return `<a class="guide-source" href="${url}" target="_blank" rel="noopener">BB2025 원문 보기 ↗</a>`}
function renderReference(){
  const tabs=[['rules','룰북'],['quick','퀵시트'],['tutorial','튜토리얼'],['special','특수 규칙'],['skills','스킬 사전']];
  $('reference-tabs').innerHTML=tabs.map(([id,label])=>`<button type="button" role="tab" data-guide="${id}" aria-selected="${guideTab===id}" class="${guideTab===id?'active':''}">${label}</button>`).join('');
  if(guideTab==='rules')renderRulebook();
  else if(guideTab==='quick')renderQuicksheet();
  else if(guideTab==='special')renderSpecial();
  else if(guideTab==='skills')renderSkillDictionary();
  else renderTutorial();
}
function renderDiagram(key){
  const diagram=typeof key==='string'?GUIDE.diagrams[key]:key;
  if(!diagram)return '';
  let visual='';
  if(diagram.type==='flow'){
    visual=`<div class="diagram-flow">${diagram.items.map(([label,detail],index)=>`${index?'<span class="diagram-arrow" aria-hidden="true">→</span>':''}<div class="diagram-node"><strong>${escapeHTML(label)}</strong><span>${escapeHTML(detail)}</span></div>`).join('')}</div>`;
  }else if(diagram.type==='compare'){
    visual=`<div class="diagram-compare">${diagram.items.map(([label,detail])=>`<div class="diagram-node"><strong>${escapeHTML(label)}</strong><span>${escapeHTML(detail)}</span></div>`).join('')}</div>`;
  }else if(diagram.type==='branch'){
    visual=`<div class="diagram-branch"><div class="diagram-branch-start">${escapeHTML(diagram.start)}</div><div class="diagram-branches">${diagram.items.map(([label,detail])=>`<div class="diagram-node"><strong>${escapeHTML(label)}</strong><span>${escapeHTML(detail)}</span></div>`).join('')}</div></div>`;
  }else if(diagram.type==='pitch'){
    visual='<div class="diagram-pitch"><div class="diagram-pitch-opponent">상대 진영</div><div class="diagram-pitch-line">스크리미지 라인</div><div class="diagram-pitch-zones"><div>왼쪽 와이드 존<strong>최대 2명</strong></div><div class="diagram-pitch-center">중앙 필드<span aria-hidden="true">● ● ●</span><strong>라인에 최소 3명</strong></div><div>오른쪽 와이드 존<strong>최대 2명</strong></div></div><div class="diagram-pitch-own">자기 진영</div></div>';
  }
  return `<figure class="rule-diagram" aria-label="${escapeHTML(diagram.title)}"><figcaption>${escapeHTML(diagram.title)}</figcaption>${visual}${diagram.note?`<p class="diagram-note">${escapeHTML(diagram.note)}</p>`:''}</figure>`;
}
function renderRulebook(){
  const chapter=GUIDE.chapters[ruleChapter];
  $('reference-content').innerHTML=`<div class="rules-layout"><aside class="rules-toc"><div class="section-index">CONTENTS / ${GUIDE.chapters.length} CHAPTERS</div>${GUIDE.chapters.map((item,index)=>`<button type="button" data-rule-chapter="${index}" class="${index===ruleChapter?'active':''}"><span>${String(index+1).padStart(2,'0')}</span>${escapeHTML(item.title)}</button>`).join('')}</aside><article class="guide-article"><div class="guide-kicker">${escapeHTML(chapter.tag)}</div><h2>${escapeHTML(chapter.title)}</h2><p class="guide-lead">${escapeHTML(chapter.lead)}</p>${renderDiagram(chapter.diagram)}${chapter.points.map(([title,body])=>`<section class="guide-point"><h3>${escapeHTML(title)}</h3><p>${escapeHTML(body)}</p></section>`).join('')}<div class="guide-article-foot">${sourceLink(chapter.source)}<span>${ruleChapter+1} / ${GUIDE.chapters.length}</span></div></article></div>`;
}
function quickTable(title,rows,source,note='',extraClass=''){return `<section class="quick-card ${extraClass}"><div class="quick-card-head"><h3>${title}</h3>${source?sourceLink(source):''}</div>${note?`<p class="quick-note">${escapeHTML(note)}</p>`:''}<div class="quick-rows">${rows.map(([key,value])=>`<div><strong>${escapeHTML(key)}</strong><span>${escapeHTML(value)}</span></div>`).join('')}</div></section>`}
function renderQuicksheet(){
  const q=GUIDE.quick,src=q.source;
  $('reference-content').innerHTML=`<div class="quick-intro"><span class="section-index">MATCHDAY / AT A GLANCE</span><h2>경기 중 한눈에</h2><p>핵심 순서와 판정을 빠르게 확인하세요. 세부 예외는 원문을 참고하세요.</p></div><div class="quick-grid">
    ${quickTable('경기 흐름',q.flow,src+'#sequence-of-play')}
    ${quickTable('선수 행동',q.actions,src+'#player-activations')}
    ${quickTable('블록 주사위',q.block,src+'#block-action')}
    ${quickTable('일반 부상 판정 · 2D6',q.injury,src+'#injury-table')}
    ${quickTable('스턴티 부상 판정 · 2D6',q.stuntyInjury,'https://bloodbowlbase.ru/bb2025/core_rules/the_game_of_blood_bowl/#stunty-injury-table')}
    ${quickTable('사상자 판정 · D16',q.casualty,src+'#casualty-table')}
    ${quickTable('영구 부상 · D6',q.lastingInjury,src+'#lasting-injury-table')}
    ${quickTable('날씨 · 2D6',q.weather,src+'#weather-table')}
    ${quickTable('킥오프 이벤트 · 2D6',q.kickoff,src+'#kick-off-event-table')}
    <section class="quick-card quick-turnover"><div class="quick-card-head"><h3>턴오버 확인</h3>${sourceLink(src+'#the-turnover')}</div><ul>${q.turnover.map(item=>`<li>${escapeHTML(item)}</li>`).join('')}</ul></section>
    ${quickTable('너플의 기도 · D16',q.prayers,'https://bloodbowlbase.ru/bb2025/core_rules/inducements/#0-3-prayers-to-nuffle',q.prayerNote,'quick-prayers')}
  </div>`;
}
function renderTutorial(){
  const item=GUIDE.tutorial[tutorialStep],total=GUIDE.tutorial.length;
  $('reference-content').innerHTML=`<div class="tutorial-layout"><aside class="tutorial-steps"><div class="section-index">FIRST GAME / ${total} STEPS</div>${GUIDE.tutorial.map((step,index)=>`<button type="button" data-tutorial-step="${index}" class="${index===tutorialStep?'active':''}" ${index===tutorialStep?'aria-current="step"':''}><span>${String(index+1).padStart(2,'0')}</span>${escapeHTML(step.title)}</button>`).join('')}</aside><article class="tutorial-card"><div class="tutorial-progress"><span>STEP ${String(tutorialStep+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}</span><div><i style="width:${(tutorialStep+1)/total*100}%"></i></div></div><div class="guide-kicker">${escapeHTML(item.tag)}</div><h2>${escapeHTML(item.title)}</h2><p class="guide-lead">${escapeHTML(item.goal)}</p><p class="tutorial-intro">${escapeHTML(item.intro)}</p>${renderDiagram(item.diagram)}<h3 class="tutorial-section-title">진행 순서</h3><ol>${item.steps.map(step=>`<li>${escapeHTML(step)}</li>`).join('')}</ol><section class="tutorial-tips"><h3>꼭 확인할 규칙</h3>${item.tips.map(tip=>`<p>${escapeHTML(tip)}</p>`).join('')}</section><div class="tutorial-example"><strong>경기 상황 예시</strong><p>${escapeHTML(item.example)}</p></div><div class="tutorial-foot">${sourceLink(item.source)}<div><button type="button" data-tutorial-move="-1" ${tutorialStep===0?'disabled':''}>← 이전</button><button type="button" data-tutorial-move="1" ${tutorialStep===total-1?'disabled':''}>다음 →</button></div></div></article></div>`;
  const steps=$('reference-content').querySelector('.tutorial-steps'),active=steps.querySelector('[aria-current="step"]');
  if(steps.scrollWidth>steps.clientWidth){steps.scrollLeft+=active.getBoundingClientRect().left-steps.getBoundingClientRect().left-(steps.clientWidth-active.clientWidth)/2}
}
function renderSpecial(){
  const item=SPECIALS[specialIndex],total=SPECIALS.length;
  $('reference-content').innerHTML=`<div class="rules-layout special-layout"><aside class="rules-toc special-toc" aria-label="특수 규칙 목록"><div class="section-index">SPECIAL RULES / ${total}</div>${SPECIALS.map((entry,index)=>`<button type="button" data-special-index="${index}" class="${index===specialIndex?'active':''}" ${index===specialIndex?'aria-current="page"':''}><span class="special-nav-number">${String(index+1).padStart(2,'0')}</span><span class="special-nav-copy"><small>${escapeHTML(entry.group)}</small>${escapeHTML(entry.title)}</span></button>`).join('')}</aside><article class="guide-article special-article"><div class="guide-kicker">${escapeHTML(item.tag)} · ${escapeHTML(item.group)}</div><h2>${escapeHTML(item.title)}</h2><p class="guide-lead">${escapeHTML(item.lead)}</p>${renderDiagram(item.diagram)}<h3 class="special-heading">판정 순서</h3><ol class="special-steps">${item.steps.map(step=>`<li>${escapeHTML(step)}</li>`).join('')}</ol><section class="special-notes"><h3>헷갈리기 쉬운 지점</h3>${item.notes.map(note=>`<p>${escapeHTML(note)}</p>`).join('')}</section><div class="special-example"><strong>경기 상황 예시</strong><p>${escapeHTML(item.example)}</p></div><div class="special-foot"><div class="special-sources">${item.sources.map(([label,url])=>`<a class="guide-source" href="${url}" target="_blank" rel="noopener">${escapeHTML(label)} ↗</a>`).join('')}</div><span>${specialIndex+1} / ${total}</span></div><div class="special-move"><button type="button" data-special-move="-1" ${specialIndex===0?'disabled':''}>← 이전 규칙</button><button type="button" data-special-move="1" ${specialIndex===total-1?'disabled':''}>다음 규칙 →</button></div></article></div>`;
  const toc=$('reference-content').querySelector('.special-toc'),active=toc.querySelector('[aria-current="page"]');
  if(toc.scrollWidth>toc.clientWidth){toc.scrollLeft+=active.getBoundingClientRect().left-toc.getBoundingClientRect().left-(toc.clientWidth-active.clientWidth)/2}
}
function renderSkillDictionary(){
  $('reference-content').innerHTML=`<div class="dictionary-intro"><span class="section-index">SKILLS & TRAITS / BB2025</span><h2>스킬 사전</h2><p>스킬과 특성 ${Object.keys(SKILLS).length}개를 이름이나 규칙 문구로 찾을 수 있습니다. 상세 내용은 BB2025 영문 원문을 그대로 표시합니다.</p></div><div class="dictionary-controls"><label for="skill-search">스킬 검색</label><input id="skill-search" type="search" autocomplete="off" placeholder="예: Dodge, Block, Loner" value="${escapeHTML(skillQuery)}"><div class="dictionary-filters" id="dictionary-filters" role="group" aria-label="스킬 분류"></div></div><div class="dictionary-layout"><aside class="dictionary-list-panel" aria-label="스킬 목록"><div class="dictionary-count" id="dictionary-count"></div><div class="dictionary-list" id="dictionary-list"></div></aside><article class="guide-article dictionary-detail" id="dictionary-detail" aria-live="polite"></article></div>`;
  renderSkillResults();
}
function renderSkillResults(){
  const all=Object.entries(SKILLS).sort((a,b)=>a[1].title.localeCompare(b[1].title,'en'));
  $('dictionary-filters').innerHTML=SKILL_CATEGORIES.map(([id,label])=>`<button type="button" data-skill-category="${id}" class="${skillCategory===id?'active':''}" aria-pressed="${skillCategory===id}">${label} <span>${id==='All'?all.length:all.filter(([,skill])=>skill.category===id).length}</span></button>`).join('');
  const query=skillQuery.trim().toLocaleLowerCase();
  const filtered=all.filter(([,skill])=>(skillCategory==='All'||skill.category===skillCategory)&&(!query||skill.title.toLocaleLowerCase().includes(query)||skill.paragraphs.some(p=>p.toLocaleLowerCase().includes(query))));
  $('dictionary-count').textContent=`${filtered.length} / ${all.length}개 항목`;
  if(!filtered.some(([id])=>id===selectedSkillId))selectedSkillId=filtered[0]?.[0]||'';
  $('dictionary-list').innerHTML=filtered.length?filtered.map(([id,skill])=>`<button type="button" data-dictionary-skill="${id}" class="${id===selectedSkillId?'active':''}" aria-current="${id===selectedSkillId?'true':'false'}"><strong>${escapeHTML(skill.title)}</strong><span>${escapeHTML(SKILL_CATEGORIES.find(([key])=>key===skill.category)?.[1]||skill.category)} · ${skill.kind==='active'?'액티브':'패시브'}</span></button>`).join(''):'<p class="dictionary-empty">검색 결과가 없습니다. 이름이나 규칙 문구를 바꿔 보세요.</p>';
  renderSkillDetail();
}
function renderSkillDetail(){
  const skill=SKILLS[selectedSkillId];
  $('dictionary-list').querySelectorAll('[data-dictionary-skill]').forEach(button=>{const active=button.dataset.dictionarySkill===selectedSkillId;button.classList.toggle('active',active);button.setAttribute('aria-current',String(active))});
  $('dictionary-detail').innerHTML=skill?`<div class="guide-kicker">${escapeHTML(skill.category.toUpperCase())} / ${skill.kind==='active'?'ACTIVE':'PASSIVE'}</div><h2>${escapeHTML(skill.title)}</h2><p class="dictionary-kind">${skill.category==='Trait'?'특성':'스킬'} · ${escapeHTML(SKILL_CATEGORIES.find(([id])=>id===skill.category)?.[1]||skill.category)} · ${skill.kind==='active'?'액티브':'패시브'}</p><div class="dictionary-paragraphs">${skill.paragraphs.map(p=>`<p>${escapeHTML(p)}</p>`).join('')}</div><div class="guide-article-foot"><a class="guide-source" href="${skill.source}" target="_blank" rel="noopener">BB2025 원문 보기 ↗</a><span>Blood Bowl Base</span></div>`:'<div class="dictionary-detail-empty">표시할 항목이 없습니다.</div>';
}
function renderPicker(){
  $('tier-filters').innerHTML=[1,2,3,4].map(n=>`<button class="tier-filter ${selectedTiers.has(n)?'active':''}" data-tier="${n}" aria-pressed="${selectedTiers.has(n)}" aria-label="등급 ${n}">${['I','II','III','IV'][n-1]}</button>`).join('');
  $('naf-filter').checked=includeNAF;
  const found=Object.entries(TEAMS).filter(([,t])=>selectedTiers.has(t.tier)&&(includeNAF||!t.nafTeam)&&t.name.toLocaleLowerCase().includes(searchTerm));
  $('faction-count').textContent=`${found.length}개`;
  $('faction-grid').innerHTML=found.map(([id,t])=>`<button class="faction-card ${draft.team===id?'selected':''}" data-faction="${id}" aria-pressed="${draft.team===id}"><span class="faction-name">${escapeHTML(t.name)}</span><span class="faction-bottom"><span class="tier-chip">TIER ${t.tier}</span>${t.nafTeam?'<span class="naf-chip">NAF</span>':''}<span>${t.positions.length}개 포지션</span></span></button>`).join('');
  $('picker-empty').hidden=found.length>0;
  const t=TEAMS[draft.team];$('draft-faction').textContent=t.name;
  $('draft-description').textContent=`Tier ${t.tier} · ${t.positions.length}개 포지션${t.nafTeam?' · NAF 팀':''}`;
  $('draft-rule').textContent=t.specialRules.length?`특수 규칙 · ${t.specialRules.join(' · ')}`:'시작 로스터 규칙 적용';
  $('draft-name').value=draft.name;$('draft-budget').value=String(draft.budget);
  $('draft-league').innerHTML=t.leagues.map(l=>`<option value="${escapeHTML(l)}">${escapeHTML(l)}</option>`).join('');
  $('draft-league').value=draft.league;
  $('draft-reroll').textContent=money(t.reroll);$('draft-apothecary').textContent=t.apothecary?'가능':'불가';$('draft-source').href=t.source;
}
$('faction-search').addEventListener('input',e=>{searchTerm=e.target.value.trim().toLocaleLowerCase();renderPicker()});
$('naf-filter').addEventListener('change',e=>{includeNAF=e.target.checked;renderPicker()});
$('draft-name').addEventListener('input',e=>{draft.name=e.target.value});
$('draft-budget').addEventListener('change',e=>{draft.budget=Number(e.target.value)});
$('draft-league').addEventListener('change',e=>{draft.league=e.target.value});
$('create-btn').addEventListener('click',()=>{
  if(state.players.length&&state.team!==draft.team&&!confirm('팩션을 바꾸면 현재 선수 명단이 지워집니다. 계속할까요?'))return;
  if(state.team!==draft.team){state.players=[];state.staff.apothecary=0}
  state.team=draft.team;state.name=draft.name.trim();state.budget=draft.budget;state.league=draft.league;
  render();setStage('builder');
});
$('change-team-btn').addEventListener('click',()=>{draft={team:state.team,name:state.name,budget:state.budget,league:state.league};setStage('selection')});
$('confirm-roster-btn').addEventListener('click',()=>{if(canConfirm())setStage('final')});
$('final-edit-btn').addEventListener('click',()=>setStage('builder'));
$('final-print-btn').addEventListener('click',()=>window.print());
$('reference-return-btn').addEventListener('click',()=>setStage(referenceFrom==='reference'?'builder':referenceFrom));
$('team-name').addEventListener('input',e=>{state.name=e.target.value;save()});
$('budget-select').addEventListener('change',e=>{state.budget=Number(e.target.value);render()});
document.addEventListener('click',e=>{
  const skill=e.target.closest('[data-skill]');if(skill){openSkill(skill.dataset.skill);return}
  const guide=e.target.closest('[data-guide]');if(guide){openReference(guide.dataset.guide);return}
  const chapter=e.target.closest('[data-rule-chapter]');if(chapter){ruleChapter=Number(chapter.dataset.ruleChapter);renderReference();return}
  const tutorial=e.target.closest('[data-tutorial-step]');if(tutorial){tutorialStep=Number(tutorial.dataset.tutorialStep);renderReference();return}
  const tutorialMove=e.target.closest('[data-tutorial-move]');if(tutorialMove){tutorialStep=Math.min(GUIDE.tutorial.length-1,Math.max(0,tutorialStep+Number(tutorialMove.dataset.tutorialMove)));renderReference();document.querySelector('.tutorial-card')?.scrollIntoView({block:'start',behavior:'auto'});return}
  const special=e.target.closest('[data-special-index]');if(special){specialIndex=Number(special.dataset.specialIndex);renderReference();return}
  const specialMove=e.target.closest('[data-special-move]');if(specialMove){specialIndex=Math.min(SPECIALS.length-1,Math.max(0,specialIndex+Number(specialMove.dataset.specialMove)));renderReference();document.querySelector('.special-article')?.scrollIntoView({block:'start',behavior:'auto'});return}
  const category=e.target.closest('[data-skill-category]');if(category){skillCategory=category.dataset.skillCategory;renderSkillResults();return}
  const dictionarySkill=e.target.closest('[data-dictionary-skill]');if(dictionarySkill){selectedSkillId=dictionarySkill.dataset.dictionarySkill;renderSkillDetail();if(window.innerWidth<=800)document.querySelector('.dictionary-detail')?.scrollIntoView({block:'start',behavior:'smooth'});return}
  const tier=e.target.closest('[data-tier]');if(tier){const n=Number(tier.dataset.tier);selectedTiers.has(n)?selectedTiers.delete(n):selectedTiers.add(n);renderPicker();return}
  const faction=e.target.closest('[data-faction]');if(faction){draft.team=faction.dataset.faction;draft.league=TEAMS[draft.team].leagues[0];renderPicker();if(window.innerWidth<=800)document.querySelector('.selection-card')?.scrollIntoView({block:'start',behavior:'smooth'});return}
  const add=e.target.closest('[data-add]');if(add){const id=add.dataset.add,p=position(id);if(!p||!canAdd(p))return;state.players.push({id:crypto.randomUUID(),pos:id});render();return}
  const subtract=e.target.closest('[data-subtract]');if(subtract){const index=state.players.findLastIndex(p=>p.pos===subtract.dataset.subtract);if(index<0)return;state.players.splice(index,1);render();return}
  const rem=e.target.closest('[data-remove]');if(rem){state.players=state.players.filter(p=>p.id!==rem.dataset.remove);render();return}
  const step=e.target.closest('[data-step]');if(step){const key=step.dataset.step,max=key==='rerolls'?8:key==='apothecary'?1:key==='fans'?3:6,min=key==='fans'?1:0;state.staff[key]=Math.min(max,Math.max(min,state.staff[key]+Number(step.dataset.delta)));render()}
});
document.addEventListener('input',e=>{if(e.target.id==='skill-search'){skillQuery=e.target.value;renderSkillResults()}});
$('skill-close').addEventListener('click',()=>$('skill-dialog').close());
$('skill-dialog').addEventListener('click',e=>{if(e.target===$('skill-dialog'))$('skill-dialog').close()});
$('reset-btn').addEventListener('click',()=>{if(state.players.length&&!confirm('현재 로스터를 지우고 새로 시작할까요?'))return;state=fresh();draft={team:state.team,name:'',budget:state.budget,league:state.league};render();setStage('selection')});
$('export-btn').addEventListener('click',()=>{const output={ruleset:'Blood Bowl 2025',...state,players:state.players.map(({pos})=>({pos}))};const blob=new Blob([JSON.stringify(output,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(state.name.trim().replace(/[^\p{L}\p{N}_-]+/gu,'-')||'blood-bowl-roster')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
$('import-btn').addEventListener('click',()=>$('import-file').click());
$('import-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!TEAMS[data.team]||!Array.isArray(data.players))throw Error('형식 오류');if(state.players.length&&!confirm('현재 로스터를 불러온 파일로 교체할까요?'))return;state=normalize(data);render();setStage('builder')}catch{alert('유효한 로스터 JSON 파일을 불러오지 못했습니다.')}finally{e.target.value=''}});
$('print-btn').addEventListener('click',()=>window.print());
render();setStage(stage);
