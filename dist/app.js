const TEAMS = {
  human: { name: '휴먼', reroll: 50000, apothecary: true, positions: [
    ['lineman','라인맨',16,50000,'기본'],['thrower','스로워',2,80000,'패스'],['catcher','캐처',4,65000,'리시브'],['blitzer','블리처',4,85000,'공격'],['ogre','오거',1,140000,'빅 가이'],['halfling','하플링 호프풀',3,30000,'지원']] },
  orc: { name: '오크', reroll: 60000, apothecary: true, positions: [
    ['lineman','오크 라인맨',16,50000,'기본'],['thrower','오크 스로워',2,65000,'패스'],['goblin','고블린',4,40000,'지원'],['bigun','빅 언 블로커',4,90000,'방어'],['blitzer','오크 블리처',4,80000,'공격'],['troll','트롤',1,115000,'빅 가이']] },
  skaven: { name: '스케이븐', reroll: 50000, apothecary: true, positions: [
    ['lineman','클랜랫',16,50000,'기본'],['thrower','스로워',2,85000,'패스'],['gutter','거터 러너',4,85000,'스피드'],['blitzer','블리처',2,90000,'공격'],['ratogre','랫 오거',1,150000,'빅 가이']] },
  dwarf: { name: '드워프', reroll: 50000, apothecary: true, positions: [
    ['lineman','드워프 블로커',16,70000,'기본'],['runner','러너',2,85000,'스피드'],['blitzer','블리처',2,80000,'공격'],['slayer','트롤 슬레이어',2,95000,'공격'],['deathroller','데스롤러',1,170000,'빅 가이']] },
  undead: { name: '샴블링 언데드', reroll: 70000, apothecary: false, positions: [
    ['skeleton','스켈레톤',16,40000,'기본'],['zombie','좀비',16,40000,'기본'],['ghoul','구울 러너',4,75000,'스피드'],['wight','와이트 블리처',2,90000,'공격'],['mummy','미이라',2,125000,'방어']] },
  darkelf: { name: '다크 엘프', reroll: 50000, apothecary: true, positions: [
    ['lineman','라인맨',16,70000,'기본'],['runner','러너',2,80000,'스피드'],['assassin','어쌔신',2,85000,'공격'],['blitzer','블리처',4,100000,'공격'],['witch','위치 엘프',2,110000,'공격']] }
};
const STORAGE_KEY = 'blood-bowl-roster-2020-v1';
const money = n => Number(n).toLocaleString('ko-KR') + ' gp';
const $ = id => document.getElementById(id);
const fresh = () => ({team:'human',name:'',budget:1000000,players:[],staff:{rerolls:0,assistant:0,cheerleaders:0,fans:0,apothecary:0}});
let state = fresh();
try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); if (saved && TEAMS[saved.team] && Array.isArray(saved.players)) state = normalize(saved); } catch {}

function normalize(raw) {
  const base = fresh(), team = TEAMS[raw.team] ? raw.team : 'human';
  const budget = [1000000,1100000,1200000,1500000].includes(Number(raw.budget)) ? Number(raw.budget) : 1000000;
  const allowed = new Map(TEAMS[team].positions.map(p => [p[0],p]));
  const counts = {}; const players = [];
  for (const item of (Array.isArray(raw.players) ? raw.players : [])) {
    const pos = allowed.get(item.pos); if (!pos || players.length >= 16 || (counts[item.pos]||0) >= pos[2]) continue;
    counts[item.pos] = (counts[item.pos]||0)+1;
    players.push({id:crypto.randomUUID(),pos:item.pos,name:String(item.name||'').slice(0,32)});
  }
  const clamp=(n,max)=>Math.min(max,Math.max(0,Number.parseInt(n,10)||0));
  const st=raw.staff||{};
  return {team,name:String(raw.name||'').slice(0,40),budget,players,staff:{rerolls:clamp(st.rerolls,8),assistant:clamp(st.assistant,6),cheerleaders:clamp(st.cheerleaders,6),fans:clamp(st.fans,6),apothecary:TEAMS[team].apothecary?clamp(st.apothecary,1):0}};
}
function team(){return TEAMS[state.team]}
function position(id){return team().positions.find(p=>p[0]===id)}
function playerCost(){return state.players.reduce((sum,p)=>sum+position(p.pos)[3],0)}
function staffCost(){const s=state.staff;return s.rerolls*team().reroll+s.assistant*10000+s.cheerleaders*10000+s.fans*10000+s.apothecary*50000}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));$('save-state').textContent='● 자동 저장됨'}
function renderPositions(){
  $('positions').innerHTML=team().positions.map(p=>{const n=state.players.filter(x=>x.pos===p[0]).length;const disabled=n>=p[2]||state.players.length>=16;return `<div class="position"><div class="position-top"><div><div class="position-name">${p[1]}</div><div class="position-limit">${n} / ${p[2]}명</div></div><div class="position-cost">${(p[3]/1000).toLocaleString()}k</div></div><div class="position-bottom"><span class="position-type">${p[4]}</span><button class="add-btn" data-add="${p[0]}" aria-label="${p[1]} 영입" ${disabled?'disabled':''}>+</button></div></div>`}).join('');
}
function renderRoster(){
  $('player-count-title').textContent=`${state.players.length} / 16`;$('roster-pill').textContent=`${state.players.length}명`;
  $('empty-roster').hidden=state.players.length>0;
  $('roster-body').innerHTML=state.players.map((p,i)=>`<tr><td>${String(i+1).padStart(2,'0')}</td><td><input class="player-name" data-name="${p.id}" value="${escapeHTML(p.name)}" placeholder="선수 이름" maxlength="32" aria-label="${i+1}번 선수 이름"></td><td>${position(p.pos)[1]}</td><td>${money(position(p.pos)[3])}</td><td><button class="remove-btn" data-remove="${p.id}" aria-label="${i+1}번 선수 삭제">×</button></td></tr>`).join('');
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderStaff(){
  const rows=[['rerolls','재굴림',team().reroll,8],['assistant','어시스턴트 코치',10000,6],['cheerleaders','치어리더',10000,6],['fans','열성 팬',10000,6],['apothecary','아포세커리',50000,team().apothecary?1:0]];
  $('staff-list').innerHTML=rows.filter(r=>r[3]>0).map(([key,label,cost,max])=>`<div class="staff-row"><div class="staff-label"><strong>${label}</strong><small>${money(cost)} / 개</small></div><div class="stepper"><button data-step="${key}" data-delta="-1" aria-label="${label} 줄이기" ${state.staff[key]===0?'disabled':''}>−</button><span>${state.staff[key]}</span><button data-step="${key}" data-delta="1" aria-label="${label} 늘리기" ${state.staff[key]>=max?'disabled':''}>+</button></div></div>`).join('');
}
function renderBudget(){
  const pc=playerCost(),sc=staffCost(),spent=pc+sc,remaining=state.budget-spent;
  $('remaining').innerHTML=`${remaining.toLocaleString('ko-KR')} <small>gp</small>`;
  $('remaining').classList.toggle('negative',remaining<0);
  $('budget-progress').style.width=Math.min(100,spent/state.budget*100)+'%';$('budget-progress').classList.toggle('over',remaining<0);
  $('spent-summary').textContent=`사용 ${money(spent)}`;$('budget-summary').textContent=`총 ${money(state.budget)}`;
  $('player-cost').textContent=money(pc);$('staff-cost').textContent=money(sc);$('team-value').textContent=money(spent-state.staff.fans*10000);
  const status=$('status-card');status.className='status-card';
  if(remaining<0){status.classList.add('error');$('status-icon').textContent='×';$('status-title').textContent='예산 초과';$('status-detail').textContent=`${money(-remaining)}를 줄여야 합니다.`}
  else if(state.players.length<11){$('status-icon').textContent='!';$('status-title').textContent='로스터를 구성하세요';$('status-detail').textContent=`경기를 시작하려면 선수 ${11-state.players.length}명이 더 필요합니다.`}
  else{status.classList.add('ready');$('status-icon').textContent='✓';$('status-title').textContent='킥오프 준비 완료';$('status-detail').textContent=`선수 ${state.players.length}명 · 남은 예산 ${money(remaining)}`}
}
function render(){
  $('team-name').value=state.name;$('team-select').value=state.team;$('budget-select').value=String(state.budget);
  renderPositions();renderRoster();renderStaff();renderBudget();save();
}
$('team-select').innerHTML=Object.entries(TEAMS).map(([id,t])=>`<option value="${id}">${t.name}</option>`).join('');
$('team-name').addEventListener('input',e=>{state.name=e.target.value;save()});
$('budget-select').addEventListener('change',e=>{state.budget=Number(e.target.value);render()});
$('team-select').addEventListener('change',e=>{if(state.players.length&&!confirm('종족을 변경하면 현재 선수 명단이 지워집니다. 계속할까요?')){e.target.value=state.team;return}state.team=e.target.value;state.players=[];state.staff.apothecary=0;render()});
document.addEventListener('click',e=>{
  const add=e.target.closest('[data-add]');if(add){const id=add.dataset.add,p=position(id);if(!p||state.players.length>=16||state.players.filter(x=>x.pos===id).length>=p[2])return;state.players.push({id:crypto.randomUUID(),pos:id,name:''});render();return}
  const rem=e.target.closest('[data-remove]');if(rem){state.players=state.players.filter(p=>p.id!==rem.dataset.remove);render();return}
  const step=e.target.closest('[data-step]');if(step){const key=step.dataset.step,max=key==='rerolls'?8:key==='apothecary'?1:6;state.staff[key]=Math.min(max,Math.max(0,state.staff[key]+Number(step.dataset.delta)));render()}
});
document.addEventListener('input',e=>{if(e.target.matches('[data-name]')){const p=state.players.find(p=>p.id===e.target.dataset.name);if(p){p.name=e.target.value;save()}}});
$('reset-btn').addEventListener('click',()=>{if(confirm('현재 로스터를 지우고 새로 시작할까요?')){state=fresh();render()}});
$('export-btn').addEventListener('click',()=>{const output={ruleset:'Blood Bowl 2020',...state,players:state.players.map(({pos,name})=>({pos,name}))};const blob=new Blob([JSON.stringify(output,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(state.name.trim().replace(/[^\p{L}\p{N}_-]+/gu,'-')||'blood-bowl-roster')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
$('import-btn').addEventListener('click',()=>$('import-file').click());
$('import-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!TEAMS[data.team]||!Array.isArray(data.players))throw Error('형식 오류');if(state.players.length&&!confirm('현재 로스터를 불러온 파일로 교체할까요?'))return;state=normalize(data);render()}catch{alert('유효한 로스터 JSON 파일을 불러오지 못했습니다.')}finally{e.target.value=''}});
$('print-btn').addEventListener('click',()=>window.print());
render();
