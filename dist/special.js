const SPECIALS = [
  {
    title:'Bloodlust',group:'뱀파이어',tag:'01 / VAMPIRE',lead:'행동 선언 직후 굴리고, 실패했다면 피를 마실 수 있는 위치와 시점을 계획해야 합니다.',
    diagram:{type:'branch',title:'Bloodlust 판정의 갈림길',start:'행동 선언 → D6 (Block·Blitz +1)',items:[['성공','선언한 행동을 정상 진행'],['실패 + Thrall 물기','활성화 후 인접 Thrall에게 부상 판정'],['실패 + 물기 불가','턴오버·Distracted·공을 들었다면 떨어뜨림']]},
    steps:['활성화한 뒤 행동을 먼저 선언하고 D6을 굴립니다. Block 또는 Blitz를 선언했다면 +1을 적용합니다. 목표값 X+ 미만이거나 자연 1이면 실패입니다.','실패해도 활성화 자체는 계속할 수 있습니다. 원한다면 선언한 행동을 Move로 바꿀 수 있지만, 이미 선언한 턴당 1회 행동은 사용한 것으로 셉니다.','실패한 선수는 활성화 종료 시 인접한 Thrall Lineman을 물 수 있습니다. Thrall의 현재 상태와 관계없이 부상 판정을 하고, 사상자 결과는 Badly Hurt로 취급합니다.','실패 상태에서 패스·핸드오프를 하거나 득점하려면 그 행동 또는 득점 전에 Thrall을 먼저 물어야 합니다.','물지 못하면 턴오버가 나고 뱀파이어는 Distracted가 됩니다. 공을 들고 있었다면 떨어뜨리며, 상대 엔드존에 있어도 터치다운을 기록하지 않습니다.'],
    notes:['물린 Thrall이 공을 들고 있었다면 그 부상으로 턴오버가 날 수 있습니다.','Block·Blitz 보정 후에도 자연 1은 실패입니다.'],
    example:'Bloodlust (3+) 뱀파이어가 Blitz를 선언해 D6에서 자연 1을 냈습니다. +1 보정을 받더라도 실패이며, 득점하기 전에는 Thrall을 물어야 합니다.',
    sources:[['Bloodlust 원문','https://bloodbowlbase.ru/bb2025/core_rules/skills_and_traits/#bloodlust-x-passive']]
  },
  {
    title:'Throw Team-mate + Right Stuff',group:'투척',tag:'02 / THROW',lead:'던질 선수와 던져질 선수의 특성을 모두 확인한 뒤 거리, 흩어짐, 착지를 해결합니다.',
    diagram:{type:'flow',title:'팀메이트 던지기 순서',items:[['선수 확인','Throw Team-mate + 인접 Right Stuff'],['목표·거리','Quick 또는 Short'],['PA 판정','성공·실패·펌블'],['흩어짐·착지','도착 칸과 AG 확인'],['결과','공 소지 여부로 턴오버 확인']]},
    steps:['한 팀 턴에 Throw Team-mate 행동은 한 선수만 선언합니다. 던지는 선수에게 Throw Team-mate, 인접한 아군에게 Right Stuff가 필요합니다. Right Stuff 선수는 엎드린 상태여도 던질 수 있습니다.','던지기 전에 이동할 수 있지만 던진 뒤에는 더 움직이지 못합니다. 목표 칸은 거리자의 첫 두 구간 안에 완전히 있어야 하며 Quick 또는 Short 거리만 가능합니다.','PA 판정은 Quick 보정 없음, Short −1이고 던지는 선수를 마크하는 상대마다 −1을 추가합니다. Superb·Subpar·Fumbled 결과에 따라 목표 칸 또는 던지는 선수의 칸에서 흩어짐/바운스를 처리합니다.','빈 칸에 도착하면 던져진 선수가 AG로 착지합니다. Subpar·Fumbled나 착지 칸의 마킹은 각각 보정을 줍니다. 엎드림·기절·Distracted 상태로 던져졌다면 착지는 자동 실패합니다.','점유된 칸에 떨어지면 그 칸의 선수가 넘어지고 던져진 선수는 바운스한 뒤 넘어집니다. 경기장 밖으로 나가면 군중 부상과 턴오버 절차를 처리합니다.'],
    notes:['착지 실패 또는 점유 칸 충돌로 던져진 선수가 넘어져도, 그 선수가 공을 들고 있지 않았다면 그 이유만으로 턴오버가 나지는 않습니다.','성공적으로 착지한 선수가 이번 턴에 아직 활성화하지 않았다면 나중에 활성화할 수 있습니다.'],
    example:'트리맨이 공이 없는 Gnome을 던졌고 Gnome이 빈 칸에 착지하다 넘어졌습니다. 방어구 판정은 하지만, Gnome이 공을 들지 않았으므로 이 착지 실패만으로 턴오버는 아닙니다.',
    sources:[['던지기·착지 원문','https://bloodbowlbase.ru/bb2025/core_rules/the_game_of_blood_bowl/#throw-team-mate-actions'],['Right Stuff 원문','https://bloodbowlbase.ru/bb2025/core_rules/skills_and_traits/#right-stuff-passive']]
  },
  {
    title:'Secret Weapon',group:'비밀무기',tag:'03 / EJECTION',lead:'드라이브에 참가한 비밀무기 선수는 드라이브가 끝날 때 퇴장 절차를 밟습니다.',
    diagram:{type:'flow',title:'비밀무기 퇴장 시점',items:[['드라이브 참가','필드에 출전'],['드라이브 종료','득점·하프 종료'],['퇴장 처리','끝날 때 필드에 없어도 적용'],['판정 항의','허용된 절차 적용']]},
    steps:['선수 카드에 Secret Weapon 특성이 있는지 먼저 확인합니다.','그 선수가 현재 드라이브에 한 번이라도 참가했다면, 드라이브 종료 절차에서 퇴장됩니다.','드라이브가 끝날 때 이미 필드에서 빠져 있더라도 참가 기록이 있으면 퇴장 규칙을 적용합니다.','이 퇴장은 파울로 퇴장된 것처럼 취급되므로 판정 항의(Argue the Call)를 시도할 수 있습니다.'],
    notes:['비밀무기 효과를 쓴 턴에 즉시 퇴장되는 규칙이 아닙니다. 기본 시점은 참가한 드라이브의 종료입니다.','Bribe 등 별도 유도금의 사용 조건은 해당 규칙을 함께 확인합니다.'],
    example:'체인소 선수가 첫 드라이브에 출전했다가 도중에 벤치로 갔어도, 그 드라이브가 끝나면 Secret Weapon 퇴장 절차를 확인합니다.',
    sources:[['Secret Weapon 원문','https://bloodbowlbase.ru/bb2025/core_rules/skills_and_traits/#secret-weapon-passive'],['드라이브 종료 원문','https://bloodbowlbase.ru/bb2025/core_rules/the_game_of_blood_bowl/#deal-with-secret-weapons']]
  },
  {
    title:'Bombardier',group:'비밀무기',tag:'04 / BOMB',lead:'폭탄은 패스처럼 던지지만 Pass 행동 자체는 아니며, 잡히면 즉시 다시 던집니다.',
    diagram:{type:'branch',title:'폭탄이 떨어지거나 잡히면',start:'Throw Bomb 선언 → 이동 없이 던짐',items:[['잡힘·인터셉트','잡은 선수가 즉시 다시 던짐'],['바닥에 멈춤·펌블','해당 칸에서 즉시 폭발'],['폭발','중심 칸 적중·인접 칸은 D6 4+']]},
    steps:['활성화 시 Throw Bomb 특수 행동을 선언합니다. 한 팀 턴에 한 명만 선언할 수 있고, 폭탄을 던지기 전에 이동하지 못합니다.','패스 행동과 같은 방식으로 던지고 관련 스킬·특성을 적용하지만, 이 행동 자체는 Pass 행동이 아닙니다. On the Ball은 이 폭탄 투척에 적용하지 않습니다.','폭탄이 바닥에 멈추거나 던지는 선수가 펌블하거나 캐치에 실패해 떨어뜨리면 바운스하지 않고 그 칸에서 폭발합니다.','폭발 중심 칸의 선수는 자동으로 맞습니다. 인접 칸의 선수마다 D6을 굴려 4+면 맞습니다. 서 있는 피격 선수는 넘어지고, 엎드리거나 기절한 피격 선수는 방어구 판정을 합니다.','선수가 폭탄을 캐치하거나 인터셉트하면 그 선수가 즉시 같은 절차로 다시 던져야 합니다.'],
    notes:['공과 달리 폭탄은 실패한 캐치 뒤 바닥에서 더 튀지 않고 바로 폭발합니다.','폭탄을 잡은 선수가 다시 던져야 하는 점 때문에 첫 투척의 표적만 보고 안전하다고 판단할 수 없습니다.'],
    example:'상대가 폭탄을 캐치했습니다. 상대는 공처럼 소유한 채 턴을 계속하지 않고 즉시 폭탄을 다시 던집니다.',
    sources:[['Bombardier 원문','https://bloodbowlbase.ru/bb2025/core_rules/skills_and_traits/#bombardier-active']]
  },
  {
    title:'Chainsaw',group:'비밀무기',tag:'05 / CHAINSAW',lead:'공격에는 강한 방어구 보정이 있지만, 역분출이나 넘어짐도 위험합니다.',
    diagram:{type:'branch',title:'체인소 공격 D6',start:'Chainsaw Attack 선언 → D6',items:[['2+','마크한 상대 방어구 판정 +3'],['1','Kick-back: 사용자 자신이 넘어짐'],['사용자가 넘어짐','사용자 방어구 판정에도 +3']]},
    steps:['Chainsaw Attack 특수 행동을 선언하고 D6을 굴립니다. 이 행동을 선언할 수 있는 선수 수에는 팀 턴당 제한이 없습니다.','2+면 마크하고 있는 상대 한 명에게 방어구 판정을 하고 +3 보정을 적용합니다. 1이면 체인소가 튕겨 사용자 자신이 넘어집니다.','체인소 선수가 다른 이유로 넘어지거나 쓰러져도, 그 선수에게 하는 방어구 판정에는 반드시 +3을 적용합니다.','파울할 때 체인소를 사용할 수도 있습니다. 상대 방어구 판정 +3을 받지만 Kick-back 판정도 정상적으로 합니다.','Blitz의 블록을 Chainsaw Attack으로 바꿀 수 있습니다. 이때 체인소 공격이 끝나면 그 선수의 활성화도 끝납니다.'],
    notes:['Chainsaw Attack은 일반 블록 주사위 결과를 굴리는 행동이 아닙니다.','Secret Weapon 특성이 같이 있다면 드라이브 종료 시 퇴장 규칙도 적용합니다.'],
    example:'체인소 공격에서 D6이 1이면 대상의 방어구를 굴리지 않고 사용자가 넘어집니다. 사용자 방어구 판정에는 +3이 붙습니다.',
    sources:[['Chainsaw 원문','https://bloodbowlbase.ru/bb2025/core_rules/skills_and_traits/#chainsaw-active'],['Secret Weapon 원문','https://bloodbowlbase.ru/bb2025/core_rules/skills_and_traits/#secret-weapon-passive']]
  },
  {
    title:'Team Captain',group:'팀 특수 규칙',tag:'06 / CAPTAIN',lead:'시작 로스터에서 주장 선수를 정하면 Pro와 재굴림 혜택을 얻고 배치 의무도 생깁니다.',
    diagram:{type:'flow',title:'주장 지정과 경기 중 효과',items:[['시작 로스터','Big Guy 제외 1명 지정'],['즉시 Pro','선수 비용 증가 없음'],['필드에 있을 때','팀 재굴림 사용'],['자연 6','해당 재굴림 무료']]},
    steps:['Human 또는 Orc처럼 Team Captain 규칙이 있는 팀은 시작 로스터를 짤 때 Big Guy가 아닌 선수 한 명을 주장으로 지정할 수 있습니다.','지정된 선수는 Pro 스킬을 얻지만 선수 비용은 늘지 않습니다.','주장이 필드에 있는 동안 팀 재굴림을 쓸 때마다 D6을 굴릴 수 있습니다. 자연 6이면 그 팀 재굴림은 무료입니다.','드라이브 시작 배치에서 출전할 수 있다면 주장을 필드에 배치해야 합니다.','리그에서는 주장 해고·사망·교체에 별도 제한과 지정 시점이 있습니다. 로스터 관리 때 원문 조건을 확인합니다.'],
    notes:['재굴림 무료 판정은 주장이 필드에 있을 때만 가능합니다.','주장 지정은 Big Guy에게 할 수 없습니다.'],
    example:'Human 팀의 비 Big Guy 선수를 주장으로 지정했습니다. 그 선수가 필드에 있을 때 팀 재굴림을 사용하고 자연 6을 굴리면 그 재굴림을 소모하지 않습니다.',
    sources:[['Team Captain 원문','https://bloodbowlbase.ru/bb2025/core_rules/the_teams/#team-captain']]
  },
  {
    title:'Swarming',group:'팀 특수 규칙',tag:'07 / SWARMING',lead:'양 팀의 기본 배치가 끝난 뒤 리저브의 라인맨을 추가해 11명보다 많이 출전할 수 있습니다.',
    diagram:{type:'flow',title:'Swarming 추가 배치',items:[['양 팀 배치 완료','기본 출전 선수 배치'],['D3 굴림','추가 가능한 라인맨 수'],['리저브 선택','있는 라인맨만'],['합법적 배치','기존 배치 제한 준수']]},
    steps:['드라이브 시작에 양 팀이 먼저 정상적으로 선수를 배치합니다.','그다음 Swarming 팀은 D3을 굴려 리저브에 있는 Lineman을 추가로 배치할 수 있습니다.','추가 선수도 자기 진영, 중앙 스크리미지 라인, 와이드 존 등 일반 배치 규칙을 지켜야 합니다.','효과로 필드 인원이 통상 최대인 11명을 넘어설 수 있습니다. 리저브에 해당 라인맨이 없다면 없는 선수를 새로 만들어 배치할 수는 없습니다.'],
    notes:['11명 제한의 예외는 Swarming 절차로 추가한 선수에 관한 것입니다.','추가 배치는 킥오프가 아니라 양 팀의 기본 배치 직후에 처리합니다.'],
    example:'Snotling 팀이 11명을 배치한 뒤 D3에서 2를 얻고 리저브에 라인맨 2명이 있다면, 배치 규칙을 지켜 최대 13명으로 드라이브를 시작할 수 있습니다.',
    sources:[['Swarming 원문','https://bloodbowlbase.ru/bb2025/core_rules/the_teams/#swarming']]
  },
  {
    title:'Masters of Undeath',group:'팀 특수 규칙',tag:'08 / UNDEATH',lead:'상대 선수의 특정 사망 결과에서 새 라인맨을 일시적으로 얻고, 경기 후 영입을 결정합니다.',
    diagram:{type:'branch',title:'언데드 부활 조건',start:'상대 사상자 판정이 Dead',items:[['조건 충족','ST 4 이하·Stunty 아님 → 경기당 1회 부활'],['즉시 효과','팀 로스터의 Lineman 1명을 리저브에 추가'],['경기 후','로스터 16명 미만이면 무료 영구 영입 가능']]},
    steps:['상대 선수의 사상자 D16 결과가 Dead인지 먼저 확인합니다. 그 선수는 ST 4 이하이며 Stunty 특성이 없어야 합니다.','조건이 맞으면 경기당 한 번 Raise the Dead를 선택할 수 있습니다.','자기 팀 로스터의 Lineman 한 명을 즉시 리저브에 추가합니다. 이 때문에 경기 중에는 일시적으로 16명을 넘을 수도 있습니다.','경기 후 신규 선수 영입 단계에서 팀 초안이 아직 16명 미만이면 그 선수를 무료로 영구 영입할 수 있습니다. 아니면 사라집니다.','영구 영입했다면 그 선수의 전체 가치는 팀 가치에 정상적으로 포함합니다.'],
    notes:['모든 사상자 결과에서 발동하는 규칙이 아니며 Dead 결과에만 적용합니다.','ST가 5 이상이거나 Stunty인 상대 선수의 사망에는 사용할 수 없습니다.'],
    example:'ST 3, Stunty가 없는 상대가 사망했다면 이번 경기에서 아직 능력을 쓰지 않은 언데드 팀은 라인맨을 리저브에 추가할 수 있습니다.',
    sources:[['Masters of Undeath 원문','https://bloodbowlbase.ru/bb2025/core_rules/the_teams/#masters-of-undeath']]
  },
  {
    title:'Low Cost Linemen',group:'팀 특수 규칙',tag:'09 / TEAM VALUE',lead:'리그의 현재 팀 가치 계산에서 라인맨의 고용비만 0으로 보되 성장으로 오른 가치는 남습니다.',
    diagram:{type:'compare',title:'구매 비용과 현재 팀 가치',items:[['선수 영입','라인맨 고용비 정상 지불'],['현재 팀 가치','라인맨의 기본 고용비는 0'],['성장한 가치','추가된 가치 상승분은 포함']]},
    steps:['Low Cost Linemen이 있는 팀은 선수 영입 시 정상적인 고용비를 지불합니다.','리그에서 Current Team Value를 계산할 때 그 팀의 Lineman 선수 고용비를 0 gp로 취급합니다.','해당 라인맨이 성장해 가치가 올라갔다면 그 증가분은 현재 팀 가치에 그대로 더합니다.','이 규칙은 리그의 현재 팀 가치 계산에 관한 것으로, 시작 로스터의 구매 비용이 0이 되는 뜻이 아닙니다.'],
    notes:['팀 가치 계산 단계와 선수 구매 단계를 구분하면 가장 흔한 혼동을 피할 수 있습니다.','Ogre와 Snotling 팀에 적용되는 팀 특수 규칙입니다.'],
    example:'고용비 15,000 gp인 라인맨을 구매할 때는 15,000 gp가 필요합니다. 이후 현재 팀 가치 계산에서는 기본 고용비를 0으로 보고, 성장으로 오른 가치만 포함합니다.',
    sources:[['Low Cost Linemen 원문','https://bloodbowlbase.ru/bb2025/core_rules/the_teams/#low-cost-linemen']]
  },
  {
    title:'Bone Head',group:'빅 가이 특성',tag:'10 / BIG GUY',lead:'활성화 후 2+ 판정에 실패하면 Distracted가 되어 그 활성화가 끝납니다.',
    diagram:{type:'branch',title:'Bone Head D6',start:'행동 선언 → D6',items:[['2+','선언한 행동 정상 수행'],['1','Distracted가 되고 활성화 종료']]},
    steps:['선수를 활성화하고 행동을 먼저 선언합니다.','D6에서 2+면 행동을 정상적으로 수행합니다.','1이면 Distracted가 됩니다. Distracted가 된 순간 활성화가 끝납니다.','Distracted 동안 태클 존이 없고 활성 스킬·특성을 쓰거나 패스 인터셉트·캐치를 시도할 수 없습니다. 다음에 활성화될 때까지 상태가 유지됩니다.'],
    notes:['실패해도 선수가 곧바로 넘어지는 규칙은 아닙니다.','Loner를 가진 선수라면 팀 재굴림을 사용하려 할 때 Loner 판정도 확인해야 합니다.'],
    example:'Bone Head 선수가 Blitz를 선언한 뒤 1을 굴렸습니다. 선 채로 Distracted가 되며, 그 활성화는 즉시 끝납니다.',
    sources:[['Bone Head 원문','https://bloodbowlbase.ru/bb2025/core_rules/skills_and_traits/#bone-head-passive'],['Distracted 원문','https://bloodbowlbase.ru/bb2025/core_rules/rules_and_regulations/#distracted']]
  },
  {
    title:'Really Stupid',group:'빅 가이 특성',tag:'11 / BIG GUY',lead:'기본 4+지만 조건을 만족하는 인접 아군이 있으면 +2를 받을 수 있습니다.',
    diagram:{type:'branch',title:'Really Stupid D6',start:'행동 선언 → D6 (조건부 +2)',items:[['4+','선언한 행동 정상 수행'],['1–3','Distracted·활성화 종료'],['+2 조건','인접한 서 있는 비 Distracted·비 Really Stupid 아군']]},
    steps:['활성화 후 행동을 선언하고 D6을 굴립니다.','인접한 아군 중 서 있고, Distracted가 아니며, Really Stupid 특성이 없는 선수가 있다면 +2 보정을 받을 수 있습니다.','보정 후 4+면 선언한 행동을 수행합니다. 실패하면 Distracted가 되어 활성화가 끝납니다.','Distracted의 태클 존·캐치·활성 스킬 제한도 적용합니다.'],
    notes:['아무 아군이나 인접해 있으면 +2가 아닙니다. 세 조건을 모두 만족해야 합니다.','인접 보정은 활성화 시 판정하기 전에 확인합니다.'],
    example:'트롤 옆에 서 있는 일반 라인맨이 있다면 Really Stupid 판정에 +2를 받을 수 있습니다. 옆 선수가 Distracted라면 그 도움은 받지 못합니다.',
    sources:[['Really Stupid 원문','https://bloodbowlbase.ru/bb2025/core_rules/skills_and_traits/#really-stupid-passive']]
  },
  {
    title:'Take Root',group:'빅 가이 특성',tag:'12 / BIG GUY',lead:'서 있는 선수의 활성화 판정에 실패하면 Rooted가 되어 위치 이동이 제한됩니다.',
    diagram:{type:'branch',title:'Take Root D6',start:'서서 활성화 → 행동 선언 → D6',items:[['2+','선언한 행동 정상 수행'],['1','Rooted: 이동·후속 이동·밀려남 불가'],['해제','넘어짐·엎드림·드라이브 종료']]},
    steps:['선수가 서 있는 상태로 활성화했다면 행동을 선언한 뒤 D6을 굴립니다.','2+면 정상적으로 진행하고, 1이면 Rooted 상태가 됩니다.','Rooted 선수는 이동 행동을 할 수 없고 블록 뒤 Follow-up을 할 수 없으며 밀려나거나 자리를 떠날 수 없습니다. KO나 사상자는 예외입니다.','넘어지거나 엎드리게 되면 Rooted가 즉시 풀립니다. 드라이브가 끝나도 해제됩니다.'],
    notes:['Rooted는 단순히 그 턴의 이동력만 줄이는 효과가 아니라 상태가 풀릴 때까지 위치 이동을 막습니다.','판정은 서 있는 상태로 활성화했을 때 적용합니다.'],
    example:'트리맨이 Take Root에서 1을 굴렸다면 그 자리에서 블록할 수 있는지 등은 선언한 행동의 세부 규칙을 확인하되, Move나 Follow-up으로 자리를 옮길 수 없습니다.',
    sources:[['Take Root 원문','https://bloodbowlbase.ru/bb2025/core_rules/skills_and_traits/#take-root-passive']]
  },
  {
    title:'Unchannelled Fury',group:'빅 가이 특성',tag:'13 / BIG GUY',lead:'기본 4+이고 Block·Blitz 선언 시 +2지만, 실패 효과는 Distracted가 아닌 활성화 종료입니다.',
    diagram:{type:'branch',title:'Unchannelled Fury D6',start:'행동 선언 → D6 (Block·Blitz +2)',items:[['4+','선언한 행동 수행'],['1–3','아무 행동 없이 활성화 종료']]},
    steps:['활성화 후 행동을 선언하고 D6을 굴립니다.','Block 또는 Blitz를 선언했다면 +2 보정을 적용할 수 있습니다.','4+면 정상 수행합니다. 실패하면 아무 일도 하지 않고 활성화가 즉시 끝납니다.','실패했더라도 이 특성 자체가 선수를 Distracted로 만들지는 않습니다.'],
    notes:['같은 4+ 특성인 Really Stupid와 +2 조건, 실패 결과가 다릅니다.','횟수 제한 행동을 선언했다면 선언 자체에 관한 일반 규칙도 확인합니다.'],
    example:'Unchannelled Fury 선수가 Block을 선언하고 자연 2를 굴리면 +2로 4가 되어 행동을 수행할 수 있습니다.',
    sources:[['Unchannelled Fury 원문','https://bloodbowlbase.ru/bb2025/core_rules/skills_and_traits/#unchannelled-fury-passive']]
  },
  {
    title:'Animal Savagery',group:'빅 가이 특성',tag:'14 / BIG GUY',lead:'활성화 판정 실패 시 인접 아군을 공격하며, 공 소지 여부에 따라 턴오버가 달라집니다.',
    diagram:{type:'branch',title:'Animal Savagery D6',start:'행동 선언 → D6 (Block·Blitz +2)',items:[['4+','선언한 행동 수행'],['1–3 + 인접 아군','서 있는 아군 1명 넘어뜨림'],['1–3 + 아군 없음','Distracted·활성화 종료']]},
    steps:['활성화 후 행동을 선언하고 D6을 굴립니다. Block 또는 Blitz를 선언하면 +2 보정을 받을 수 있습니다.','4+면 정상 수행합니다. 1~3으로 실패하면 인접한 서 있는 아군 한 명을 선택해 즉시 넘어뜨립니다.','피해 아군이 공을 들고 있었다면 턴오버입니다. 공이 없다면 이 공격만으로 턴오버가 나지는 않습니다.','사용자에게 Claws 또는 Mighty Blow가 있으면 그 아군의 방어구 판정에 해당 스킬을 반드시 적용합니다.','인접한 서 있는 아군이 없는데 실패했다면 사용자가 Distracted가 됩니다.'],
    notes:['아군을 넘어뜨리는 효과와 Distracted 결과는 인접한 서 있는 아군이 있는지에 따라 갈립니다.','공을 든 아군을 선택하면 팀 턴이 끝날 위험이 있습니다.'],
    example:'Rat Ogre가 판정에 실패했고 옆의 라인맨이 공을 들고 있다면, 그 라인맨을 넘어뜨리면 턴오버가 납니다. 다른 서 있는 아군을 고를 수 있는지 먼저 확인하세요.',
    sources:[['Animal Savagery 원문','https://bloodbowlbase.ru/bb2025/core_rules/skills_and_traits/#animal-savagery-passive']]
  }
];
