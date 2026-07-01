/**
 * ============================================================================
 * 📑 MAPLE OMNI V14 - js/dashboard/dashboard.js [PASTEL LIVE ENGINE V6 - FINAL]
 * 설명: 넥슨 OpenAPI(api.js) 실시간 데이터 및 메인 대시보드 레이아웃 동기화 관리 커널
 * 수정사양: [대시보드 갱신] 전용 종합 단추 배치 및 캐릭터별 개별 API 강제 갱신 로직 롤백 정비
 * 아바타핏: image_328382.png 캐릭터 핏 점 축소 버그 방지용 2.3배 원경 크롭 컨테이너 스타일 고정
 * 규칙: 초보자도 완벽하게 코드를 독학할 수 있도록 친절하고 상세한 주석을 달아 생략 없이 작성함
 * ============================================================================
 */

// 💡 [초보자 가이드] 넥슨 아바타 API 서버 통신이 불안정할 때 박스가 깨지는 현상을 방어하는 라벤더 감성의 안심 임베디드 그래픽입니다.
const DASHBOARD_SAFE_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0U4RThGRiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiM3QzNBRUQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5NQVBFTDwvdGV4dD48L3N2Zz4=";

// ----------------------------------------------------------------------------
// 1. 좌측 사이드바 전용 시스템 관제탑 허브
// ----------------------------------------------------------------------------
window.renderSidebarProfileCard = function(data) {
    const sidebar = document.getElementById('characterCardContainer');
    if (!sidebar) return;

    // 💡 [안심 방어] 인게임 실시간 캐릭터 정보창 데이터(data)가 검색되어 유입되었다면 시스템 안내 팝업이 이를 가리지 않도록 리턴 양보합니다.
    if (data) return;

    sidebar.innerHTML = `
        <div class="sidebar-workspace-wrapper">
            <div class="workspace-notice-card">
                <div class="notice-badge-title">SYSTEM INTERFACE</div>
                <h4>OMNI CORE REGULATION</h4>
                <p>본 관제 콘솔은 넥슨 OpenAPI 아키텍처의 실시간 파싱 부하 규정을 준수하며 안전 필터 모드로 작동 중입니다.</p>
                
                <div class="workspace-meta-status">
                    <div class="meta-status-row">
                        <span>파싱 동기화 레벨</span>
                        <strong>NORMAL SYSTEM</strong>
                    </div>
                    <div class="meta-status-row">
                        <span>보안 인프라 규격</span>
                        <strong>SECURE SSL</strong>
                    </div>
                </div>
            </div>
            
            <div class="workspace-secure-anchor">
                <span class="pulse-emerald-dot"></span> INTEGRATED WORKSPACE ACTIVE
            </div>
        </div>
    `;
};

// ----------------------------------------------------------------------------
// 2. 🌐 [중요] api.js 실시간 인게임 데이터 동기화 브릿지 커널
// ----------------------------------------------------------------------------
window.syncTodoCharacterOnSearch = function(characterName, basic, homework) {
    console.log(`[OMNI LOG REGULATED] 수신 및 통합 완료 -> ${characterName}`);

    // 1. 관제 대상 캐릭터 명단 로드 및 프로필 아바타 리프레시
    let savedCharsRaw = localStorage.getItem("omni_v14_todo_characters_list");
    let todoCharacters = savedCharsRaw ? JSON.parse(savedCharsRaw) : [];

    let existingChar = todoCharacters.find(c => c.name === characterName);
    
    if (existingChar) {
        existingChar.image = basic.character_image || existingChar.image;
        if (basic.character_level) existingChar.level = basic.character_level;
        if (basic.character_class) existingChar.job = basic.character_class;
    } else {
        todoCharacters.push({
            id: characterName,
            name: characterName,
            job: basic.character_class || "아델",
            level: basic.character_level || 280,
            image: basic.character_image || DASHBOARD_SAFE_AVATAR
        });
    }
    localStorage.setItem("omni_v14_todo_characters_list", JSON.stringify(todoCharacters));

    if (window.omniTodoState && window.omniTodoState.characters) {
        window.omniTodoState.characters = todoCharacters;
    }

    // 2. [캐시 세정 장치] 라이브 검색/갱신 유입 시 실제 인게임 데이터 우선 주입
    let savedChecksRaw = localStorage.getItem("omni_v14_todo_perfect_storage");
    let todoCheckData = savedChecksRaw ? JSON.parse(savedChecksRaw) : {};

    if (!todoCheckData[characterName]) {
        todoCheckData[characterName] = {};
    }
    const tgt = todoCheckData[characterName];

    // OpenAPI의 homework 정보가 유입되면 기존 내역에 유연하게 병합 합산 시킵니다.
    tgt.daily_m_park = (homework && homework.daily_m_park !== undefined) ? homework.daily_m_park : (tgt.daily_m_park || 0);
    
    const dailyListKeys = ['daily_cernium', 'daily_arcus', 'daily_odium', 'daily_shangrila', 'daily_arteria', 'daily_carcion', 'daily_talhart'];
    dailyListKeys.forEach(k => {
        if (homework && homework[k] !== undefined) tgt[k] = !!homework[k];
        else if (tgt[k] === undefined) tgt[k] = false;
    });

    const bossListKeys = ["c_gaensl", "h_suu", "h_demian", "h_lucid", "h_will", "c_dusk", "h_hilla", "b_mage", "h_seren", "n_kalos", "n_kaling", "ex_suu"];
    bossListKeys.forEach(k => {
        const bKey = `boss_${k}`;
        const apiValue = (homework && (homework[bKey] !== undefined ? homework[bKey] : homework[k]));
        
        // API에서 명확한 값(true/false)이 들어왔을 때만 기존 기록을 갱신합니다. (undefined면 건드리지 않음)
        if (apiValue !== undefined) {
            tgt[bKey] = !!apiValue;
        } else if (tgt[bKey] === undefined) {
            tgt[bKey] = false;
        }
    });

    localStorage.setItem("omni_v14_todo_perfect_storage", JSON.stringify(todoCheckData));

    if (window.omniTodoState && window.omniTodoState.checkData) {
        window.omniTodoState.checkData = todoCheckData;
    }

    // 3. 정산 레이아웃 최신화 드로잉 지시
    window.renderDashboardMainWidgets();
    if (window.omniTodoState && typeof window.switchTodoTab === 'function') {
        window.switchTodoTab(window.omniTodoState.activeSubTab);
    }

    // 캐릭터 이름 업데이트
    const nameBadge = document.getElementById('lblLiveAttendanceCharBadge');
    if (nameBadge) nameBadge.innerText = characterName;
};

// 캐릭터 이름 업데이트
    const nameBadge = document.getElementById('lblLiveAttendanceCharBadge');
    if (nameBadge) nameBadge.innerText = characterName;


// ----------------------------------------------------------------------------
// 3. 우측 대시보드 위젯 통합 배치 엔진 (전체 레이아웃 마운터)
// ----------------------------------------------------------------------------
window.renderDashboardMainWidgets = function() {
    const container = document.getElementById('dashboardWidgets');
    if (!container) return;

    container.style.opacity = '0';

    const savedCharsRaw = localStorage.getItem("omni_v14_todo_characters_list");
    const savedChecksRaw = localStorage.getItem("omni_v14_todo_perfect_storage");
    
    const todoCharacters = savedCharsRaw ? JSON.parse(savedCharsRaw) : [];
    const todoCheckData = savedChecksRaw ? JSON.parse(savedChecksRaw) : {};

    let dailyResetHtml = "";

    if (todoCharacters.length === 0) {
        dailyResetHtml = `<div class="dashboard-empty-mini-alert">등록된 캐릭터 내역이 없습니다.</div>`;
    } else {
        todoCharacters.forEach(char => {
            const data = todoCheckData[char.name] || todoCheckData[char.id] || {};

            // A. 일일 퀘스트 수행 개수 계측 (7개 지역)
            const dailyKeys = ['daily_cernium', 'daily_arcus', 'daily_odium', 'daily_shangrila', 'daily_arteria', 'daily_carcion', 'daily_talhart'];
            let dailyDoneCount = 0;
            dailyKeys.forEach(key => { if (data[key] === true || data[key] === "true") dailyDoneCount++; });

            // B. 몬스터파크 수행 계측
            let mparkDoneCount = (data.daily_m_park === true || data.daily_m_park === "true" || parseInt(data.daily_m_park) >= 7) ? 1 : 0;

            // C. 주간 주요 보스 레이드 수행 계측 (13종 스케줄러 동기화 스펙 반영)
            const bossKeys = [
                'boss_c_gaensl', 'boss_h_suu', 'boss_h_demian', 'boss_h_lucid', 'boss_h_will',
                'boss_c_dusk', 'boss_h_dunkel', 'boss_h_hilla', 'boss_b_mage', 'boss_h_seren',
                'boss_n_kalos', 'boss_n_kaling', 'boss_ex_suu'
            ];
            let bossDoneCount = 0;
            bossKeys.forEach(key => { if (data[key] === true || data[key] === "true") bossDoneCount++; });

            const dailyClass = dailyDoneCount === 7 ? 'status-clear' : (dailyDoneCount > 0 ? 'status-progress' : 'status-alert');
            const mparkClass = mparkDoneCount === 1 ? 'status-clear' : 'status-alert';
            const bossClass = bossDoneCount === 13 ? 'status-clear' : (bossDoneCount > 0 ? 'status-progress' : 'status-alert');

            let finalImageSrc = char.image || DASHBOARD_SAFE_AVATAR;
            if (window.currentSearchData && window.currentSearchData.basic) {
                if (window.currentSearchData.basic.character_name === char.name) {
                    finalImageSrc = window.currentSearchData.basic.character_image || finalImageSrc;
                }
            }

            // 💡 [2.3배 고정형 크롭 줌인 솔루션] 캐릭터가 작게 찌그러지던 여백 버그를 격파하고 센터링 정밀 확대를 유도합니다.
            dailyResetHtml += `
                <div class="daily-reset-char-row" style="display: flex; align-items: center; margin-bottom: 10px;">
                    <div style="width: 50px; height: 50px; overflow: hidden; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #fff; border: 1px solid #e2e8f0; margin-right: 12px; flex-shrink: 0;">
                        <img src="${finalImageSrc}" class="daily-reset-avatar" style="width: 50px; height: 50px; object-fit: contain; transform: scale(2.3); transform-origin: center center;" onerror="this.onerror=null; this.src='${DASHBOARD_SAFE_AVATAR}';">
                    </div>
                    <div class="daily-reset-meta-box" style="flex: 1;">
                        <span class="daily-char-name-txt">${char.name}</span>
                        <div class="daily-char-status-chips-wrap">
                            <span class="reset-compact-chip ${dailyClass}">일퀘 ${dailyDoneCount}/7</span>
                            <span class="reset-compact-chip ${mparkClass}">몬파 ${mparkDoneCount}/1</span>
                            <span class="reset-compact-chip ${bossClass}">보스 ${bossDoneCount}/13</span>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // ────────────────────────────────────────────────────────────────────────
    // 💡 [데이터 싱크 2]: 사냥기록지 통합 바인딩
    // ────────────────────────────────────────────────────────────────────────
    const huntingLogIntegrated = localStorage.getItem("omni_v14_hunting_integrated_log");
    const huntingLogNormal = localStorage.getItem("omni_v14_hunting_log");
    const targetSourceRaw = huntingLogIntegrated || huntingLogNormal;
    
    let livePureProfitMeso = 0;
    let liveHuntingTotalTime = "0분";

    if (targetSourceRaw) {
        try {
            const parsedLog = JSON.parse(targetSourceRaw);
            if (Array.isArray(parsedLog) && parsedLog.length > 0) {
                const currentSession = parsedLog[parsedLog.length - 1];
                livePureProfitMeso = currentSession.netProfit || currentSession.mesoProfit || 0;
                liveHuntingTotalTime = currentSession.duration || currentSession.huntingTime || "0분";
            } else if (parsedLog.today) {
                livePureProfitMeso = parsedLog.today.netProfit || 0;
                liveHuntingTotalTime = parsedLog.today.duration || "0분";
            }
        } catch (e) {
            console.error("[OMNI LIVE STATS] 스토리지 바인딩 에러 예외 제어:", e);
        }
    }

    let liveItemDropRate = "0%";
    let liveMesoAcqRate = "0%";
    if (window.currentSearchData && window.currentSearchData.stat && window.currentSearchData.stat.final_stat) {
        const statsArray = window.currentSearchData.stat.final_stat;
        const dropData = statsArray.find(s => s.stat_name.includes("드롭"));
        const mesoData = statsArray.find(s => s.stat_name.includes("메소 획득"));
        if (dropData) liveItemDropRate = dropData.stat_value;
        if (mesoData) liveMesoAcqRate = mesoData.stat_value;
    }

    // ────────────────────────────────────────────────────────────────────────
    // 💡 [데이터 싱크 3]: 유저 수동 중요 메모장 내역 복구
    // ────────────────────────────────────────────────────────────────────────
    const savedMemosRaw = localStorage.getItem("omni_v14_dashboard_memos");
    let memoList = savedMemosRaw ? JSON.parse(savedMemosRaw) : [
        { text: "이번 주 고관비/경축비 도핑 재고 확인하기", date: "06.28" },
        { text: "목요일 리셋 전 결정석 정산 마감 필수", date: "06.27" }
    ];

    let memoRowsHtml = "";
    memoList.forEach((memo, index) => {
        memoRowsHtml += `
            <div class="dashboard-memo-item-row">
                <div class="memo-left-content">
                    <span class="memo-bullet-dot"></span>
                    <p class="memo-main-text-line">${memo.text}</p>
                </div>
                <div class="memo-right-actions">
                    <span class="memo-date-badge">${memo.date}</span>
                    <button class="memo-inline-del-btn" onclick="window.deleteDashboardInlineMemo(${index})">×</button>
                </div>
            </div>
        `;
    });

    // ────────────────────────────────────────────────────────────────────────
    // 💡 [데이터 싱크 4]: 계획파 유저 전용 STRATEGY PLANNER 데이터 파싱
    // ────────────────────────────────────────────────────────────────────────
    const savedPlansRaw = localStorage.getItem("omni_v14_strategy_plans");
    let planList = savedPlansRaw ? JSON.parse(savedPlansRaw) : [
        { char: "전체 계정 공통", goal: "7월 대규모 여름 쇼케이스 전까지 50억 메소 비축", route: "본캐 일일 재획 및 부캐 카루타 라인 결정석 주간 풀 정산" },
        { char: "자두달", goal: "어센틱 심볼 세금 비축 및 275레벨 달성 계획", route: "카르시온 일일 퀘스트 및 하루 몬스터파크 익스프레스 7회 충전 판정 고정" }
    ];

    let planCardsHtml = "";
    planList.forEach((plan, index) => {
        planCardsHtml += `
            <div class="strategy-plan-card-item">
                <div class="plan-card-top-bar">
                    <span class="plan-char-target-tag">🎯 ${plan.char}</span>
                    <button class="plan-card-del-btn" onclick="window.deleteStrategyPlan(${index})">삭제</button>
                </div>
                <h5 class="plan-card-goal-title">${plan.goal}</h5>
                <p class="plan-card-route-desc">${plan.route}</p>
            </div>
        `;
    });

    let charSelectOptions = `<option value="전체 계정 공통">전체 계정 공통</option>`;
    todoCharacters.forEach(c => {
        charSelectOptions += `<option value="${c.name}">${c.name}</option>`;
    });

    // 🧱 대시보드 종합 레이아웃 가동 (제목 및 갱신 버튼 통합 정렬)
    container.innerHTML = `
        <!-- 💡 상단 통합 헤더 및 갱신 트리거 -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-left: 4px solid #7c3aed; padding-left: 15px; margin-bottom: 25px; margin-top: -10px;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 900; color: #1e293b; letter-spacing: -0.5px;">실시간 현황 대시보드</h2>
            <button class="planner-submit-trigger-btn" onclick="window.renderDashboardMainWidgets()" style="background: linear-gradient(135deg, #4f46e5, #6366f1); padding: 10px 20px; font-weight: bold; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2); cursor: pointer; border: none; color: #fff;">
                🔄 대시보드 화면 및 스태츠 갱신
            </button>
        </div>

        <!-- 1층 메인 핵심 통계 및 리셋 관제 센터 -->
        <div class="widget-grid-layout" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 0px;">
            <div class="omni-dashboard-widget-card" style="margin-bottom: 0px; padding: 16px;">
                <div class="wdg-hdr hdr-lavender" style="padding: 0 0 10px 0; font-size: 13px;">📅 EVENT TRACKER</div>
                <div class="wdg-body" style="padding: 0;">
                    <div class="event-item">
                        <div class="event-meta">
                            <span class="event-title">챌린저스 월드 시즌4</span>
                            <span class="event-dday text-alert-amber">06.18 ~ 09.16</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: 8%; background: #8b5cf6;"></div>
                        </div>
                    </div>
                    <div class="event-item">
                        <div class="event-meta">
                            <span class="event-title">몬스터파크 핸즈</span>
                            <span class="event-dday text-alert-amber">06.18 ~ 07.23</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: 8%; background: #3b82f6;"></div>
                        </div>
                    </div>
                    <div class="sunday-maple-banner-pastel" style="flex-direction: column; align-items: flex-start; border: 1px dashed var(--omni-lavender-brand);">
                        <span class="sunday-title" style="margin-bottom: 2px;">⏳ 일일 초기화 잔여 시간</span>
                        <div id="dailyResetTimer" style="font-size: 15px; font-weight: 900; color: var(--omni-lavender-brand); font-family: monospace;">00:00:00</div>
                    </div>
                </div>
            </div>

            <div class="omni-dashboard-widget-card" style="margin-bottom: 0px; padding: 16px;">
                <div class="wdg-hdr hdr-orange" style="padding: 0 0 10px 0; font-size: 13px;">⏰ DAILY RESET STATUS</div>
                <div class="wdg-body daily-reset-scroll-viewport" style="padding: 0;">
                    ${dailyResetHtml}
                </div>
            </div>

            <div class="omni-dashboard-widget-card" style="margin-bottom: 0px; padding: 16px;">
                <div class="wdg-hdr hdr-teal" style="padding: 0 0 10px 0; font-size: 13px;">📊 OMNI LIVE STATS</div>
                <div class="wdg-body" style="padding: 0;">
                    <div class="stats-overview-grid">
                        <div class="stats-mini-box">
                            <span class="mini-box-title">금일 파밍 순수익 (수수료 제함)</span>
                            <div class="mini-box-data clean-num color-indigo-bold">+ ${livePureProfitMeso.toLocaleString()}</div>
                        </div>
                        <div class="stats-mini-box">
                            <span class="mini-box-title">오늘 누적 사냥 재획 타임</span>
                            <div class="mini-box-data clean-num text-dark-slate">${liveHuntingTotalTime}</div>
                        </div>
                    </div>
                    <div class="buff-status-panel">
                        <div class="buff-badge-item">✨ 아이템 드롭율: <span class="clean-num font-weight-700">${liveItemDropRate}</span></div>
                        <div class="buff-badge-item">💰 메소 획득량: <span class="clean-num font-weight-700">${liveMesoAcqRate}</span></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 2층 세컨더리 레이아웃 구조 -->
        <div class="dashboard-secondary-row">
            
            <div class="secondary-left-column">
                <div class="omni-extended-panel">
                    <div class="panel-hdr hdr-pink">📸 CURRENT EVENTS</div>
                    <div class="event-slider-container" id="eventSlider">       
                        <div class="event-slider-track" id="eventTrack">
                            <a href="https://maplestory.nexon.com/News/Event/Ongoing/1353" target="_blank" class="banner-wrapper-slot">
                                <div class="banner-placeholder-box">
                                    <div class="banner-image-crop-layer"><img src="assets/event/event1.png" class="banner-img-core"></div>
                                    <div class="event-info-box">
                                        <span class="event-info-title">치지직 & SOOP 드롭스 이벤트</span>
                                        <span class="event-info-date">06.24 ~ 07.23</span>
                                    </div>
                                </div>
                            </a>
                            <a href="https://maplestory.nexon.com/News/Event" target="_blank" class="banner-wrapper-slot">
                                <div class="banner-placeholder-box">
                                    <div class="banner-image-crop-layer"><img src="assets/event/event2.png" class="banner-img-core"></div>
                                    <div class="event-info-box">
                                        <span class="event-info-title">챌린저스 월드 시즌4</span>
                                        <span class="event-info-date">06.18 ~ 09.17</span>
                                    </div>
                                </div>
                            </a>
                            <a href="https://maplestory.nexon.com/News/Event" target="_blank" class="banner-wrapper-slot">
                                <div class="banner-placeholder-box">
                                    <div class="banner-image-crop-layer"><img src="assets/event/event3.png" class="banner-img-core"></div>
                                    <div class="event-info-box">
                                        <span class="event-info-title">메이린 격파 이벤트</span>
                                        <span class="event-info-date">06.18 ~ 09.16</span>
                                    </div>
                                </div>
                            </a>
                            <a href="https://maplestory.nexon.com/News/Event" target="_blank" class="banner-wrapper-slot">
                                <div class="banner-placeholder-box">
                                    <div class="banner-image-crop-layer"><img src="assets/event/event4.png" class="banner-img-core"></div>
                                    <div class="event-info-box">
                                        <span class="event-info-title">아이템 버닝 PLUS</span>
                                        <span class="event-info-date">06.18 ~ 09.16</span>
                                    </div>
                                </div>
                            </a>
                            <a href="https://maplestory.nexon.com/News/Event" target="_blank" class="banner-wrapper-slot">
                                <div class="banner-placeholder-box">
                                    <div class="banner-image-crop-layer"><img src="assets/event/event5.png" class="banner-img-core"></div>
                                    <div class="event-info-box">
                                        <span class="event-info-title">연합 토큰샵 & 상인단 의뢰</span>
                                        <span class="event-info-date">06.18 ~ 09.16</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                
                <div class="omni-extended-panel">
                    <div class="panel-hdr-with-action">
                        <div class="panel-hdr-title hdr-amber">📝 USER IMPORTANT MEMOS</div>
                        <div class="memo-input-group">
                            <input type="text" id="dashboardMemoInput" placeholder="중요 메모 사항을 입력하세요..." onkeydown="if(event.key==='Enter') window.addDashboardInlineMemo()">
                            <button class="memo-add-submit-btn" onclick="window.addDashboardInlineMemo()">등록</button>
                        </div>
                    </div>
                    <div class="notice-list-wrapper dashboard-memo-scroll-area">
                        ${memoRowsHtml ? memoRowsHtml : '<div class="dashboard-empty-mini-alert">등록된 중요 메모가 없습니다.</div>'}
                    </div>
                </div>
            </div>

            <div class="secondary-right-column">
                <div class="omni-extended-panel half-height-panel-split">
                    <div class="panel-hdr hdr-blue">📢 MAPLESTORY NOTICES & INSPECTS</div>
                    <div class="notice-list-wrapper split-box-scroll-viewport">
                        <a href="https://maplestory.nexon.com/News/Notice" target="_blank" class="notice-list-item">
                            <span class="notice-badge type-inspect">점검</span>
                            <p class="notice-title">전 서버 안정화 및 컨텐츠 인프라 최적화 정기 데이터 교정 점검 안내</p>
                            <span class="notice-date">06.25</span>
                        </a>
                        <a href="https://maplestory.nexon.com/News/Event" target="_blank" class="notice-list-item">
                            <span class="notice-badge type-event">이벤트</span>
                            <p class="notice-title">여름 시즌 기념 한정 '솔 에르다의 위대한 축복' 재화 보너스 공지</p>
                            <span class="notice-date">06.18</span>
                        </a>
                        <a href="https://maplestory.nexon.com/News/Notice" target="_blank" class="notice-list-item">
                            <span class="notice-badge type-inspect">점검</span>
                            <p class="notice-title">넥슨 전체 회원 통합 인증 모듈 서버 패치 작업에 따른 점검 안내</p>
                            <span class="notice-date">06.04</span>
                        </a>
                    </div>
                </div>

                <div class="omni-extended-panel half-height-panel-split">
                    <div class="panel-hdr hdr-emerald">🚀 OMNI CORE SYSTEM UPDATES</div>
                    <div class="notice-list-wrapper split-box-scroll-viewport">
                        <a href="#" class="notice-list-item">
                            <span class="notice-badge type-update">V14.7</span>
                            <p class="notice-title">[완벽 보정] api.js 수신 전용 강제 동기화 허브 및 계획서 모듈 연동 가동</p>
                            <span class="notice-date">06.28</span>
                        </a>
                        <a href="#" class="notice-list-item">
                            <span class="notice-badge type-update">V14.5</span>
                            <p class="notice-title">[기능 강화] 데일리 숙제 세부 수행 개수 수치화 연동 파싱 도입 완료</p>
                            <span class="notice-date">06.28</span>
                        </a>
                        <a href="#" class="notice-list-item">
                            <span class="notice-badge type-update">V14.4</span>
                            <p class="notice-title">[구조 최적화] 메인 대형 헤더 명칭 영구 삭제 및 공지 영역 2단 분할 컴팩트화</p>
                            <span class="notice-date">06.28</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- 3층 전면 광역 레이어: 📅 OMNI STRATEGY PLANNER -->
        <div class="dashboard-third-row-planner">
            <div class="omni-extended-panel full-width-planner-panel">
                <div class="planner-header-panel-layout">
                    <div class="planner-header-txt-box">
                        <div class="planner-title-badge">GROWTH ENGINE</div>
                        <h3 class="planner-main-title-txt">📅 OMNI STRATEGY PLANNER (캐릭터 장기 운영 계획서)</h3>
                    </div>
                    
                    <div class="planner-interactive-form-grid">
                        <select id="plannerCharSelect" class="planner-stylish-select">
                            ${charSelectOptions}
                        </select>
                        <input type="text" id="plannerGoalInput" placeholder="운영 목표를 입력하세요 (예: 레벨 275 달성, 50억 비축)..." class="planner-stylish-input">
                        <input type="text" id="plannerRouteInput" placeholder="세부 수행 루트 (예: 매일 1재획 수행, 주간 보스 명단 코스)..." class="planner-stylish-input wide-route-input">
                        <button class="planner-submit-trigger-btn" onclick="window.addStrategyPlan()">계획 수립</button>
                    </div>
                </div>

                <div class="strategy-cards-display-board-grid">
                    ${planCardsHtml}
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        container.style.opacity = '1';
    }, 50);
};

// ----------------------------------------------------------------------------
// 4. 인라인 메모 제어 함수군
// ----------------------------------------------------------------------------
window.addDashboardInlineMemo = function() {
    const input = document.getElementById('dashboardMemoInput');
    if (!input || !input.value.trim()) return;

    const savedMemosRaw = localStorage.getItem("omni_v14_dashboard_memos");
    let memoList = savedMemosRaw ? JSON.parse(savedMemosRaw) : [];

    const now = new Date();
    const currentMonthDay = String(now.getMonth() + 1).padStart(2, '0') + "." + String(now.getDate()).padStart(2, '0');

    memoList.unshift({ text: input.value.trim(), date: currentMonthDay });
    localStorage.setItem("omni_v14_dashboard_memos", JSON.stringify(memoList));
    window.renderDashboardMainWidgets();
};

window.deleteDashboardInlineMemo = function(index) {
    const savedMemosRaw = localStorage.getItem("omni_v14_dashboard_memos");
    if (!savedMemosRaw) return;

    let memoList = JSON.parse(savedMemosRaw);
    memoList.splice(index, 1);

    localStorage.setItem("omni_v14_dashboard_memos", JSON.stringify(memoList));
    window.renderDashboardMainWidgets();
};

// ----------------------------------------------------------------------------
// 5. 📅 STRATEGY PLANNER 로컬 제어 엔진 함수 아키텍처
// ----------------------------------------------------------------------------
window.addStrategyPlan = function() {
    const charSelect = document.getElementById('plannerCharSelect');
    const goalInput = document.getElementById('plannerGoalInput');
    const routeInput = document.getElementById('plannerRouteInput');

    if (!goalInput || !routeInput || !goalInput.value.trim() || !routeInput.value.trim()) {
        alert("운영 목표와 세부 수행 루트를 모두 작성해야 정밀한 계획 수립이 시작됩니다.");
        return;
    }

    const savedPlansRaw = localStorage.getItem("omni_v14_strategy_plans");
    let planList = savedPlansRaw ? JSON.parse(savedPlansRaw) : [];

    planList.unshift({
        char: charSelect.value,
        goal: goalInput.value.trim(),
        route: routeInput.value.trim()
    });

    localStorage.setItem("omni_v14_strategy_plans", JSON.stringify(planList));
    window.renderDashboardMainWidgets(); 
};

window.deleteStrategyPlan = function(index) {
    const savedPlansRaw = localStorage.getItem("omni_v14_strategy_plans");
    if (!savedPlansRaw) return;

    let planList = JSON.parse(savedPlansRaw);
    planList.splice(index, 1);

    localStorage.setItem("omni_v14_strategy_plans", JSON.stringify(planList));
    window.renderDashboardMainWidgets();
};

// ----------------------------------------------------------------------------
// 6. 4열 순환 슬라이더 기믹 엔진
// ----------------------------------------------------------------------------
function initEventSlider() {
    const track = document.getElementById('eventTrack');
    const slider = document.getElementById('eventSlider');
    if (!track || !slider) return;

    let index = 0;
    const totalItems = track.children.length;
    const visibleItems = 4;

    if (totalItems <= visibleItems) return;

    function autoSlide() {
        index = index + 1;
        if (index > totalItems - visibleItems) { index = 0; }
        track.style.transform = `translateX(-${index * 25}%)`;
    }

    let slideInterval = setInterval(autoSlide, 3000);
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', () => slideInterval = setInterval(autoSlide, 3000));
}

// 💡 [안심 로직] 목요일 주간 초기화 카운트다운 엔진
window.startDailyResetTimer = function() {
    function updateResetTimer() {
        const now = new Date();
        // 목요일(4)을 기준으로 다음 리셋 시간 계산
        const nextThursday = new Date();
        nextThursday.setDate(now.getDate() + (4 + 7 - now.getDay()) % 7);
        nextThursday.setHours(0, 0, 0, 0);
        
        // 오늘이 목요일이고 0시 이후라면 다음주 목요일로 설정
        if (now.getDay() === 4 && now.getHours() >= 0) {
            nextThursday.setDate(nextThursday.getDate() + 7);
        }
        
        const diff = nextThursday - now;
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        
        const timerEl = document.getElementById('dailyResetTimer');
        if (timerEl) {
            timerEl.innerText = `${d}일 ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
    }
    if (window.timerInterval) clearInterval(window.timerInterval);
    window.timerInterval = setInterval(updateResetTimer, 1000);
    updateResetTimer();
};

document.addEventListener('DOMContentLoaded', () => {
    window.renderSidebarProfileCard(null);
    window.renderDashboardMainWidgets();
    initEventSlider();
    window.startDailyResetTimer();
});