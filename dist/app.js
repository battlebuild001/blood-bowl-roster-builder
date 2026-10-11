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
    players.push({id:crypto.randomUUID(),pos:item.pos,name:String(item.name||'').slice(0,32)});
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
  $('positions').innerHTML=team().positions.map(p=>{const n=state.players.filter(x=>x.pos===p[0]).length;const stats=p[5].map((v,i)=>`<span><small>${['MA','ST','AG','PA','AV'][i]}</small>${v}</span>`).join('');const skills=p[6].length?p[6].map(([name,id])=>`<button type="button" class="skill-chip" data-skill="${id}" aria-label="${escapeHTML(name)} 규칙 보기">${escapeHTML(name)}</button>`).join(''):'<span class="no-skills">시작 스킬 없음</span>';return `<div class="position"><div class="position-top"><div><div class="position-name">${escapeHTML(p[1])}</div><div class="position-limit">${n} / ${p[2]}명</div></div><div class="position-cost">${(p[3]/1000).toLocaleString()}k</div></div><div class="position-stats">${stats}</div><div class="position-skills">${skills}</div><div class="position-bottom"><span class="position-type">${escapeHTML(p[4])}${p[7]&&team().bigGuyMax?' · 빅 가이 제한 '+team().bigGuyMax+'명':''}</span><button class="add-btn" data-add="${p[0]}" aria-label="${escapeHTML(p[1])} 영입" ${canAdd(p)?'':'disabled'}>+</button></div></div>`}).join('');
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
  $('roster-body').innerHTML=state.players.map((p,i)=>`<tr><td>${String(i+1).padStart(2,'0')}</td><td><input class="player-name" data-name="${p.id}" value="${escapeHTML(p.name)}" placeholder="선수 이름" maxlength="32" aria-label="${i+1}번 선수 이름"></td><td>${position(p.pos)[1]}</td><td>${money(position(p.pos)[3])}</td><td><button class="remove-btn" data-remove="${p.id}" aria-label="${i+1}번 선수 삭제">×</button></td></tr>`).join('');
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
}
function render(){
  $('team-name').value=state.name;$('team-current').textContent=team().name;$('budget-select').value=String(state.budget);
  $('team-meta').innerHTML=`<span>TIER ${team().tier}${team().nafTeam?' · NAF 팀':''}</span><span>${escapeHTML(state.league)}</span>${team().specialRules.length?`<span>특수 규칙: ${escapeHTML(team().specialRules.join(' · '))}</span>`:''}<a href="${team().source}" target="_blank" rel="noopener">팀 자료 ↗</a>`;
  renderPositions();renderRoster();renderStaff();renderBudget();save();
}
let stage = localStorage.getItem(UI_KEY) || (hadSavedRoster ? 'builder' : 'selection');
let draft = {team:state.team,name:state.name,budget:state.budget,league:state.league};
const selectedTiers = new Set([1,2,3,4]);
let includeNAF = true;
let searchTerm = '';
function setStage(next){
  stage=next;localStorage.setItem(UI_KEY,next);
  $('selection-screen').hidden=next!=='selection';$('builder-screen').hidden=next!=='builder';
  document.body.classList.toggle('picking',next==='selection');
  if(next==='selection')renderPicker();
  window.scrollTo({top:0,behavior:'auto'});
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
$('team-name').addEventListener('input',e=>{state.name=e.target.value;save()});
$('budget-select').addEventListener('change',e=>{state.budget=Number(e.target.value);render()});
document.addEventListener('click',e=>{
  const skill=e.target.closest('[data-skill]');if(skill){openSkill(skill.dataset.skill);return}
  const tier=e.target.closest('[data-tier]');if(tier){const n=Number(tier.dataset.tier);selectedTiers.has(n)?selectedTiers.delete(n):selectedTiers.add(n);renderPicker();return}
  const faction=e.target.closest('[data-faction]');if(faction){draft.team=faction.dataset.faction;draft.league=TEAMS[draft.team].leagues[0];renderPicker();return}
  const add=e.target.closest('[data-add]');if(add){const id=add.dataset.add,p=position(id);if(!p||!canAdd(p))return;state.players.push({id:crypto.randomUUID(),pos:id,name:''});render();return}
  const rem=e.target.closest('[data-remove]');if(rem){state.players=state.players.filter(p=>p.id!==rem.dataset.remove);render();return}
  const step=e.target.closest('[data-step]');if(step){const key=step.dataset.step,max=key==='rerolls'?8:key==='apothecary'?1:key==='fans'?3:6,min=key==='fans'?1:0;state.staff[key]=Math.min(max,Math.max(min,state.staff[key]+Number(step.dataset.delta)));render()}
});
$('skill-close').addEventListener('click',()=>$('skill-dialog').close());
$('skill-dialog').addEventListener('click',e=>{if(e.target===$('skill-dialog'))$('skill-dialog').close()});
document.addEventListener('input',e=>{if(e.target.matches('[data-name]')){const p=state.players.find(p=>p.id===e.target.dataset.name);if(p){p.name=e.target.value;save()}}});
$('reset-btn').addEventListener('click',()=>{if(state.players.length&&!confirm('현재 로스터를 지우고 새로 시작할까요?'))return;state=fresh();draft={team:state.team,name:'',budget:state.budget,league:state.league};render();setStage('selection')});
$('export-btn').addEventListener('click',()=>{const output={ruleset:'Blood Bowl 2025',...state,players:state.players.map(({pos,name})=>({pos,name}))};const blob=new Blob([JSON.stringify(output,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(state.name.trim().replace(/[^\p{L}\p{N}_-]+/gu,'-')||'blood-bowl-roster')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
$('import-btn').addEventListener('click',()=>$('import-file').click());
$('import-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!TEAMS[data.team]||!Array.isArray(data.players))throw Error('형식 오류');if(state.players.length&&!confirm('현재 로스터를 불러온 파일로 교체할까요?'))return;state=normalize(data);render();setStage('builder')}catch{alert('유효한 로스터 JSON 파일을 불러오지 못했습니다.')}finally{e.target.value=''}});
$('print-btn').addEventListener('click',()=>window.print());
render();setStage(stage);
