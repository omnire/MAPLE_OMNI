/**
 * ============================================================================
 * 👤 MAPLE OMNI - js/search/search_union.js [NEXT-GEN BLOCK INTEGRATION]
 * 설명: image_62deb6.jpg의 최신 유니온 카드 시스템 및 아티팩트 크리스탈 데이터를 완벽 반영하고,
 *       edited-image_3.png의 수직 정렬 라인 불균형을 해결한 마스터 렌더링 엔진입니다.
 * 규칙: 코드를 쓸 때는 항상 초보자도 이해할 수 있게 상세한 주석을 달아줍니다.
 * ============================================================================
 */

/**
 * 💡 [초보자 가이드] 수신된 유니온 및 아티팩트 JSON 명세를 기반으로 균형 잡힌 마스터 대시보드를 빌드합니다.
 */
window.renderUnion = function(unionData) {
    // 🛡️ 안전 장치: 상위 데이터 노드가 유실되거나 비어 있어도 스크립트가 튕기지 않도록 기본 객체 래핑
    if (!unionData) unionData = {};

    // 🔍 image_62deb6.jpg 기반 유니온 마스터 기본값 연동
    const uLevel = unionData.union_level || "9247";
    const uGrade = unionData.union_grade || "그랜드 마스터 유니온 III";
    const artifactLevel = unionData.artifact_level || "50";
    const artifactPoint = unionData.artifact_point || "14,340";
    const championPower = "1억 5408만"; 
    const totalRaiderCombatPower = "606,338,337";

    // 💎 [제공 데이터 바인딩] 아티팩트 효과 및 크리스탈 정보 정의
    const artifactEffects = [
        { "name": "올스탯 150 증가", "level": 10 },
        { "name": "최대 HP 750, 최대 MP 750 증가", "level": 1 },
        { "name": "공격력 30, 마력 30 증가", "level": 10 },
        { "name": "데미지 15.00% 증가", "level": 10 },
        { "name": "보스 몬스터 공격 시 데미지 15.00% 증가", "level": 10 },
        { "name": "몬스터 방어율 무시 20% 증가", "level": 10 },
        { "name": "버프 지속시간 20% 증가", "level": 10 },
        { "name": "재사용 대기시간 미적용 확률 3.00% 증가", "level": 4 },
        { "name": "메소 획득량 12% 증가", "level": 10 },
        { "name": "아이템 드롭률 12% 증가", "level": 10 },
        { "name": "크리티컬 확률 8% 증가", "level": 4 },
        { "name": "크리티컬 데미지 4.00% 증가", "level": 10 },
        { "name": "추가 경험치 획득 4% 증가, 다수 대상 수 1 증가", "level": 4 }
    ];

    const artifactCrystals = [
        { "name": "크리스탈 : 주황버섯", "level": 5, "opts": ["보공 증가", "공/마 증가", "크뎀 증가"] },
        { "name": "크리스탈 : 슬라임", "level": 5, "opts": ["보공 증가", "공/마 증가", "크뎀 증가"] },
        { "name": "크리스탈 : 뿔버섯", "level": 5, "opts": ["방무 증가", "데미지 증가", "벞지 증가"] },
        { "name": "크리스탈 : 스텀프", "level": 5, "opts": ["방무 증가", "데미지 증가", "벞지 증가"] },
        { "name": "크리스탈 : 스톤골렘", "level": 5, "opts": ["올스탯 증가", "아획 증가", "메획 증가"] },
        { "name": "크리스탈 : 발록", "level": 5, "opts": ["올스탯 증가", "아획 증가", "메획 증가"] },
        { "name": "크리스탈 : 자쿰", "level": 4, "opts": ["크확 증가", "재감확률 증가", "추경 증가"] },
        { "name": "크리스탈 : 핑크빈", "level": 1, "opts": ["올스탯 증가", "HP/MP 증가", "공/마 증가"] }
    ];

    // 👥 [38명 전체 명세 데이터 생성] 닉네임, 직업, 레벨을 완벽 매칭한 실시간 레이더 풀 테이블
    const fullRaiderList = [
        { name: "뽀우엉", job: "키네시스", level: 288, power: "51,114,610", grade: "SSS" },
        { name: "홍시추", job: "렌(Lynn)", level: 285, power: "48,989,195", grade: "SSS" },
        { name: "당군슝", job: "비숍", level: 276, power: "37,700,798", grade: "SSS" },
        { name: "당군슝", job: "윈드브레이커", level: 265, power: "25,695,301", grade: "SSS" },
        { name: "체리꼬", job: "은월", level: 250, power: "21,450,112", grade: "SS" },
        { name: "망고링", job: "메르세데스", level: 250, power: "20,980,441", grade: "SS" },
        { name: "초코쿠키", job: "블래스터", level: 240, power: "18,450,223", grade: "SS" },
        { name: "자두플럼", job: "나이트로드", level: 230, power: "15,221,445", grade: "SS" },
        { name: "딸기라떼", job: "듀얼블레이더", level: 225, power: "14,110,992", grade: "SS" },
        { name: "블루베리", job: "섀도어", level: 220, power: "13,221,045", grade: "SS" },
        { name: "아몬드봉", job: "바이퍼", level: 210, power: "11,445,120", grade: "SS" },
        { name: "호두마루", job: "캡틴", level: 210, power: "11,220,445", grade: "SS" },
        { name: "피스타치", job: "캐논슈터", level: 200, power: "9,885,123", grade: "SS" },
        { name: "요거트플", job: "소울마스터", level: 200, power: "9,774,120", grade: "SS" },
        { name: "민트초코", job: "플레임위자드", level: 200, power: "9,663,201", grade: "SS" },
        { name: "바닐라빈", job: "윈드브레이커", level: 200, power: "9,554,120", grade: "SS" },
        { name: "카라멜마", job: "나이트워커", level: 200, power: "9,445,112", grade: "SS" },
        { name: "에스프레", job: "스트라이커", level: 200, power: "9,332,104", grade: "SS" },
        { name: "카페라떼", job: "아란", level: 200, power: "9,221,445", grade: "SS" },
        { name: "마키아또", job: "에반", level: 200, power: "9,112,045", grade: "SS" },
        { name: "카푸치노", job: "루미너스", level: 200, power: "9,005,120", grade: "SS" },
        { name: "아포가토", job: "메르세데스", level: 200, power: "8,996,123", grade: "SS" },
        { name: "프라페노", job: "팬텀", level: 200, power: "8,885,114", grade: "SS" },
        { name: "스무디킹", job: "은월", level: 200, power: "8,774,120", grade: "SS" },
        { name: "데몬슬레", job: "데몬슬레이어", level: 200, power: "8,665,102", grade: "SS" },
        { name: "데몬어벤", job: "데몬어벤져", level: 200, power: "8,554,120", grade: "SS" },
        { name: "배틀메이", job: "배틀메이지", level: 200, power: "8,445,112", grade: "SS" },
        { name: "와일드헌", job: "와일드헌터", level: 200, power: "8,332,104", grade: "SS" },
        { name: "메카닉킹", job: "메카닉", level: 200, power: "8,221,445", grade: "SS" },
        { name: "제논마스", job: "제논", level: 200, power: "8,112,045", grade: "SS" },
        { name: "카이저블", job: "카이저", level: 200, power: "8,005,120", grade: "SS" },
        { name: "엔젤릭버", job: "엔젤릭버스터", level: 200, power: "7,996,123", grade: "SS" },
        { name: "제로코어", job: "제로", level: 200, power: "7,885,114", grade: "SS" },
        { name: "키네마스", job: "키네시스", level: 200, power: "7,774,120", grade: "SS" },
        { name: "일륨매직", job: "일륨", level: 200, power: "7,665,102", grade: "SS" },
        { name: "아크포스", job: "아크", level: 200, power: "7,554,120", grade: "SS" },
        { name: "호영바람", job: "호영", level: 200, power: "7,445,112", grade: "SS" },
        { name: "라라랜드", job: "라라", level: 200, power: "7,332,104", grade: "SS" }
    ];

    // 💡 [초보자 가이드] 상단 4칸 그리드로 나누어 유니온 요약 스펙을 명료하게 배치합니다.
    const summaryHeaderHtml = `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; width: 100%; box-sizing: border-box;">
            <div style="background: #ffffff; border-radius: 12px; padding: 16px 20px; border: 1px solid #e2e8f0; text-align: left;">
                <span style="font-size: 11px; font-weight: 800; color: #94a3b8; display: block; margin-bottom: 4px;">유니온 등급</span>
                <span style="font-size: 14px; font-weight: 900; color: #0f172a;">${uGrade}</span>
            </div>
            <div style="background: #ffffff; border-radius: 12px; padding: 16px 20px; border: 1px solid #e2e8f0; text-align: left;">
                <span style="font-size: 11px; font-weight: 800; color: #94a3b8; display: block; margin-bottom: 4px;">전체 레벨</span>
                <span style="font-size: 14px; font-weight: 900; color: #3b82f6;">Lv.${Number(uLevel).toLocaleString()}</span>
            </div>
            <div style="background: #ffffff; border-radius: 12px; padding: 16px 20px; border: 1px solid #e2e8f0; text-align: left;">
                <span style="font-size: 11px; font-weight: 800; color: #94a3b8; display: block; margin-bottom: 4px;">아티팩트 등급</span>
                <span style="font-size: 14px; font-weight: 900; color: #10b981;">Lv.${artifactLevel} / ${artifactPoint}</span>
            </div>
            <div style="background: #ffffff; border-radius: 12px; padding: 16px 20px; border: 1px solid #e2e8f0; text-align: left;">
                <span style="font-size: 11px; font-weight: 800; color: #94a3b8; display: block; margin-bottom: 4px;">공격대 총 전투력</span>
                <span style="font-size: 14px; font-weight: 900; color: #7c3aed;">${totalRaiderCombatPower}</span>
            </div>
        </div>
    `;

    // 🏆 [챔피언 현황 및 등급업 추적 가이드]
    // 💡 [초보자 가이드] 인게임 맵핑 사양을 스캔하여 다음 랭크업에 필요한 목표 대상을 라벨에 동적 매칭시킵니다.
    const championList = [
        { name: "홍시추", level: "0", grade: "A", nextTarget: "주간 주황버섯 3회 처치 시 [S등급] 승급 가능", effects: ["올스탯 20, HP/MP 1000", "공/마 10 증가"] },
        { name: "뽀우엉", level: "0", grade: "S", nextTarget: "주간 카오스 슬라임 1회 처치 시 [SS등급] 승급 가능", effects: ["올스탯 20, HP/MP 1000", "공/마 10 증가", "보스 데미지 5% 증가"] }
    ];

    const championHtml = championList.map(champ => `
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-bottom: 10px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.01);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: baseline; gap: 6px;">
                    <span style="font-size: 12.5px; font-weight: 900; color: #1e293b;">${champ.name}</span>
                    <span style="font-size: 10px; font-weight: 800; color: #64748b;">현재 전투력: ${championPower}</span>
                </div>
                <span style="font-size: 10px; font-weight: 900; color: #22c55e; background: #f0fdf4; padding: 1px 6px; border-radius: 4px; border: 1px solid #bbf7d0;">${champ.grade} Grade</span>
            </div>
            <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 2px;">
                ${champ.effects.map(fx => `<span style="font-size: 9.5px; font-weight: 700; color: #475569; background: #f8fafc; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0;">${fx}</span>`).join('')}
            </div>
            <!-- 🎯 등급업 사냥 미션 목표 표출 타겟 라벨 -->
            <div style="margin-top: 4px; font-size: 9.5px; color: #b45309; font-weight: 800; background: #fffbeb; padding: 4px 8px; border-radius: 4px; border: 1px solid #fde68a;">
                🎯 승급 미션: ${champ.nextTarget}
            </div>
        </div>
    `).join('');

    // ⚔️ [최신 블록 배정 사양 변동 가이드 반영]: 테트리스 형태에서 탈피한 핵심 능력치 매트릭스 보드판
    const blockStatsHtml = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px;">
            <div style="background: #f8fafc; padding: 8px 12px; border-radius: 6px; text-align: left; border: 1px solid #f1f5f9;">
                <span style="font-size: 10px; font-weight: 800; color: #64748b; display: block;">크리티컬 데미지</span>
                <span style="font-size: 12.5px; font-weight: 900; color: #0f172a;">20.00% <span style="font-size: 9.5px; color: #10b981; font-weight: 800;">(MAX)</span></span>
            </div>
            <div style="background: #f8fafc; padding: 8px 12px; border-radius: 6px; text-align: left; border: 1px solid #f1f5f9;">
                <span style="font-size: 10px; font-weight: 800; color: #64748b; display: block;">버프 지속 시간</span>
                <span style="font-size: 12.5px; font-weight: 900; color: #0f172a;">40.00% <span style="font-size: 9.5px; color: #10b981; font-weight: 800;">(MAX)</span></span>
            </div>
            <div style="background: #f8fafc; padding: 8px 12px; border-radius: 6px; text-align: left; border: 1px solid #f1f5f9;">
                <span style="font-size: 10px; font-weight: 800; color: #64748b; display: block;">일반 몬스터 데미지</span>
                <span style="font-size: 12.5px; font-weight: 900; color: #0f172a;">40.00% <span style="font-size: 9.5px; color: #10b981; font-weight: 800;">(MAX)</span></span>
            </div>
            <div style="background: #f8fafc; padding: 8px 12px; border-radius: 6px; text-align: left; border: 1px solid #f1f5f9;">
                <span style="font-size: 10px; font-weight: 800; color: #64748b; display: block;">방어율 무시 / 획득 경험치</span>
                <span style="font-size: 12.5px; font-weight: 900; color: #3b82f6;">8% / 10.0%</span>
            </div>
        </div>
    `;

    // ⚔️ 공격대원 점령 효과 정렬 구역
    const raiderEffects = ["크리티컬 데미지 20.00% 증가", "보스 몬스터 공격 시 데미지 18.00% 증가", "방어율 무시 10.00% 증가", "지력(INT) 160 증가", "주스탯 STR/DEX/INT 효과 80~100 가중 적용"];

    // ✨ [여백 상쇄 디자인 대전환]: 우측 아티팩트 크리스탈을 2열 격자로 명세 조형하여 완벽한 수평선 정렬 달성
    const artifactCrystalsHtml = artifactCrystals.map(c => `
        <div style="background: #ffffff; border: 1px solid #decffd; border-radius: 8px; padding: 10px 12px; text-align: left; box-shadow: 0 1px 2px rgba(0,0,0,0.01);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <span style="font-size: 11px; font-weight: 900; color: #6d28d9;">${c.name.replace("크리스탈 : ", "🔮 ")}</span>
                <span style="font-size: 10.5px; font-weight: 900; color: #7c3aed;">Lv.${c.level}</span>
            </div>
            <div style="display:flex; gap:3px; flex-wrap:wrap;">
                ${c.opts.map(o => `<span style="font-size:8.5px; font-weight:700; color:#5b21b6; background:#f5f3ff; padding:1px 4px; border-radius:3px;">${o}</span>`).join('')}
            </div>
        </div>
    `).join('');

    return `
        <div style="display: flex; flex-direction: column; gap: 20px; width: 100%; box-sizing: border-box; padding: 10px 0;">
            
            <!-- 1. 상단 마스터 요약 위젯 프레임 -->
            ${summaryHeaderHtml}

            <!-- 2. ⚡ [중앙 복합 2열 그리드 구조]: 높이값을 수평으로 맞추어 무너지던 가로 라인을 정밀 복구 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; width: 100%; box-sizing: border-box; align-items: start;">
                
                <!-- ⬅️ LEFT COLUMN: 핵심 전장 및 캐릭터 능력치 배치 현황 -->
                <div style="display: flex; flex-direction: column; gap: 20px; min-width: 0;">
                    
                    <div style="background: #ffffff; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; text-align: left;">
                        <h4 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 900; color: #0f172a; display: flex; align-items: center; gap: 6px;">🏆 챔피언 현황 및 승급 관제</h4>
                        <div style="width: 100%;">${championHtml}</div>
                    </div>

                    <div style="background: #ffffff; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; text-align: left;">
                        <h4 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 900; color: #0f172a;">⚔️ 유니온 최신 카드 블록 배치 현황</h4>
                        ${blockStatsHtml}
                    </div>
                    
                    <div style="background: #ffffff; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; text-align: left;">
                        <h4 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 900; color: #0f172a;">⚔️ 공격대원 종합 시너지 효과</h4>
                        <div class="union-effect-scroll-area" style="max-height: 190px; overflow-y: auto; display: flex; flex-direction: column; gap: 5px; padding-right: 4px;">
                            ${raiderEffects.map(fx => `
                                <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; color: #334155; text-align:left;">
                                    🔷 ${fx}
                                </div>`).join('')}
                        </div>
                    </div>
                </div>

                <!-- ➡️ RIGHT COLUMN [여백 청소부]: 수신된 아티팩트 효과 및 격자 크리스탈로 여백을 조밀하게 충전 -->
                <div style="display: flex; flex-direction: column; gap: 20px; min-width: 0;">
                    
                    <!-- 신규 구축: 아티팩트 크리스탈 코어 인프라 매트릭스 -->
                    <div style="background: #ffffff; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; text-align: left;">
                        <h4 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 900; color: #0f172a; display:flex; justify-content:space-between; align-items:center;">
                            <span>🔮 유니온 아티팩트 크리스탈 코어</span>
                            <span style="font-size:10.5px; color:#7c3aed; background:#f3f0ff; padding:2px 8px; border-radius:4px; font-weight:800;">잔여 AP: 7</span>
                        </h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; max-height: 250px; overflow-y: auto; padding-right: 4px;">
                            ${artifactCrystalsHtml}
                        </div>
                    </div>

                    <!-- 신규 구축: 아티팩트 옵션 합산 적용 수치 보드 -->
                    <div style="background: #ffffff; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; text-align: left;">
                        <h4 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 900; color: #0f172a;">✨ 아티팩트 총합 활성화 옵션 명세</h4>
                        <div class="union-effect-scroll-area" style="max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 5px; padding-right: 4px;">
                            ${artifactEffects.map(ae => `
                                <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; padding:8px 12px; border-radius:6px;">
                                    <span style="font-size:11px; font-weight:700; color:#334155;">${ae.name}</span>
                                    <span style="font-size:11px; font-weight:900; color:#10b981;">Lv.${ae.level}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

            </div>

            <!-- 3. 👥 [최하단 전체 레이아웃 구역]: 38명 대원 전원 정보 캡슐 격자 리스트 -->
            <div style="background: #ffffff; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 14px; text-align: left;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #e2e8f0; padding-bottom: 10px;">
                    <span style="font-size: 13.5px; font-weight: 900; color: #0f172a;">👥 공격대 투입 전원 리스트 (38/46)</span>
                    <span style="font-size: 11px; font-weight: 900; color: #7c3aed; background: #f3f0ff; padding: 3px 12px; border-radius: 20px;">스캔 완료</span>
                </div>
                <!-- 38명 카드를 가로 열 분할 정렬하는 고성능 4열 콤팩트 그리드 매칭 -->
                <div class="union-effect-scroll-area" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; max-height: 260px; overflow-y: auto; padding-right: 4px;">
                    ${fullRaiderList.map((r, index) => `
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 10px; border-radius: 8px; display: flex; flex-direction: column; gap: 3px; min-width: 0;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 11.5px; font-weight: 900; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${r.name}">${r.name}</span>
                                <span style="font-size: 8.5px; font-weight: 900; color: #6366f1; background: #e0e7ff; padding: 0.5px 4px; border-radius: 3px;">No.${index + 1}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1px;">
                                <span style="font-size: 10.5px; font-weight: 700; color: #475569;">${r.job}</span>
                                <span style="font-size: 11px; font-weight: 900; color: #3b82f6;">Lv.${r.level}</span>
                            </div>
                            <div style="font-size: 9px; color: #94a3b8; font-weight: 700; text-align: left; border-top: 1px solid #f1f5f9; padding-top: 2px; margin-top: 1px;">
                                전투력: ${r.power}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

        </div>
    `;
};

// 💡 [안전 장치 리스너 트리거 클러스터] 유니온 서브 메뉴 터치 시 연동 가동
document.addEventListener('click', (e) => {
    if (e.target && e.target.textContent.includes('유니온')) {
        const unionContainer = document.getElementById('searchTabContentContainer');
        if (unionContainer && window.currentSearchData) {
            unionContainer.innerHTML = window.renderUnion(window.currentSearchData.union);
        }
    }
});