/**
 * ============================================================================
 * 📑 MAPLE OMNI V14 - js/todo/todo.js [PREMIUM EXPANDED RAID ENGINE - PERFECT COMPLETED]
 * 설명: 하드코딩 샘플을 전면 소각하고 일퀘, 주퀘, 보스 패킷 구조를 100% 무결 동기화합니다.
 * 구조보존: 유저가 제공한 고유 레이아웃 아키텍처 및 폰트 설정을 단 1%도 변형하지 않고 원형 영구 격리 적용
 * 규칙: 초보자도 완벽하게 독학하고 커스텀할 수 있도록 상세한 주석을 누락 없이 기입한 완본 스펙
 * 개혁교정: index.html에 의존하던 타이틀 및 하위 화면 그릇 스페이스 구조를 스크립트 내부로 완전히 이전하여 단독으로 기동됩니다.
 * ============================================================================
 */

// [초보자 가이드] 프로그램 전체에서 전역으로 공유할 투두(할일) 상태값 관리소입니다.
window.omniTodoState = {
    activeSubTab: "boss", // 보스 정산 탭을 메인 디폴트로 즉시 앵커링

    // 👥 관제 명단 데이터베이스 (하드코딩 닉네임 완전 소각, 범용 빈 배열로 태초 리셋)
    characters: [],

    // 💰 솔플 기준 주간/월간 결정석 정산 시세표 명세 (검밑솔부터 검윗솔까지 난이도별 세분화 이식)
    bossPrices: {
        "n_suu": 34000000,       // 노말 스우
        "h_suu": 117000000,      // 하드 스우
        "ex_suu": 1120000000,    // 익스트림 스우
        "n_demian": 37000000,    // 노말 데미안
        "h_demian": 111000000,   // 하드 데미안
        "n_gaensl": 43000000,    // 노말 가디언 엔젤 슬라임
        "c_gaensl": 71200000,    // 카오스 가디언 엔젤 슬라임
        "e_lucid": 40000000,     // 이지 루시드
        "n_lucid": 56000000,     // 노말 루시드
        "h_lucid": 136000000,    // 하드 루시드
        "e_will": 44000000,      // 이지 윌
        "n_will": 66000000,      // 노말 윌
        "h_will": 145000000,     // 하드 윌
        "n_dusk": 70000000,      // 노말 더스크
        "c_dusk": 162000000,     // 카오스 더스크
        "n_dunkel": 77000000,    // 노말 듄켈
        "h_dunkel": 175000000,   // 하드 듄켈
        "n_hilla": 89000000,     // 노말 진 힐라
        "h_hilla": 200000000,    // 하드 진 힐라
        "b_mage": 1360000000,    // 검은 마법사 (하드)
        "n_seren": 268000000,    // 선택받은 세렌 (노말)
        "h_seren": 411000000,    // 선택받은 세렌 (하드)
        "e_kalos": 300000000,    // 감시자 칼로스 (이지)
        "n_kalos": 450000000,    // 감시자 칼로스 (노말)
        "c_kalos": 600000000,    // 감시자 칼로스 (카오스)
        "e_kaling": 350000000,   // 카링 (이지)
        "n_kaling": 520000000,   // 카링 (노말)
        "h_kaling": 800000000,   // 카링 (하드)
        "n_limbo": 650000000,    // 림보 (노말)
        "h_limbo": 1200000000    // 림보 (하드)
    },

    // 🛡️ 체크박스 및 카운터 정보 보존소
    checkData: {},

    // 📅 미니 달력 제어 버퍼
    calendarCheckedDays: {}
};

// 💡 넥슨 아바타 이미지 유실 방지용 라벤더 세이프티 가상 스킨 패킷
const SAFE_FALLBACK_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0E4QjJGNiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNFMkVBRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5NQVBFTDwvdGV4dD48L3N2Zz4=";

/**
 * 💡 [초보자 가이드] 투두 시스템 기동 시 로컬 스토리지를 정밀 역추적하여 복원합니다.
 */
window.initOmniTodoTab = function() {
    // 현재 HTML 브라우저 화면에 주간할일 메인 섹션(#page-todo)이 렌더링되어 있는지 확인합니다.
    const pageTodoSection = document.getElementById('page-todo');
    if (!pageTodoSection) return; // 만약 라우터가 아직 방을 안 만들었다면 에러 방지를 위해 잠시 대기합니다.

    // [독립 구동 업그레이드]: index.html에서 지워버린 대타이틀 레이아웃을 자바스크립트가 직접 판별해 안전 기입합니다.
    let pageHeader = pageTodoSection.querySelector('.page-header');
    if (!pageHeader) {
        pageHeader = document.createElement('div');
        pageHeader.className = 'page-header';
        pageHeader.style = 'border-left: 4px solid #7c3aed; padding-left: 15px; margin-bottom: 25px;';
        pageHeader.innerHTML = `<h2 style="margin: 0; font-size: 20px; font-weight: 900; color: #1e293b; letter-spacing: -0.5px;">주간 숙제 및 보스 정산 시스템</h2>`;
        pageTodoSection.appendChild(pageHeader);
    }

    // 1. 기존 브라우저 로컬 저장소에 저장되어 있던 캐릭터 목록을 불러와 데이터 구조체에 주입합니다.
    const savedChars = localStorage.getItem("omni_v14_todo_characters_list");
    if (savedChars) window.omniTodoState.characters = JSON.parse(savedChars);
    
    // 2. 사용자가 손으로 체크했거나 API로 받아온 일퀘/보스 완료 여부 정산 원장을 불러옵니다.
    const savedChecks = localStorage.getItem("omni_v14_todo_perfect_storage");
    if (savedChecks) window.omniTodoState.checkData = JSON.parse(savedChecks);

    // 3. 달력 위젯에 기입해 둔 스케줄 체크 현황을 불러옵니다.
    const savedCalChecked = localStorage.getItem("omni_v14_todo_calendar_checked");
    if (savedCalChecked) window.omniTodoState.calendarCheckedDays = JSON.parse(savedCalChecked);

    // 4. 불러온 캐릭터들의 데이터 필드가 누락되었거나 비어있다면 에러가 나지 않도록 기본 틀을 세팅해 줍니다.
    window.omniTodoState.characters.forEach(c => {
        if (!c.id) c.id = c.name;
        if (!window.omniTodoState.checkData[c.id]) {
            window.omniTodoState.checkData[c.id] = {};
        }
        
        const d = window.omniTodoState.checkData[c.id];
        if (d.daily_m_park === undefined) d.daily_m_park = 0;
        
        // 보스 30종 키 배열을 순회하며 혹시 값이 없으면 전부 미완료(false) 상태로 초기 설정 유도합니다.
        const defaultBossKeys = [
            "n_suu", "h_suu", "ex_suu", "n_demian", "h_demian", "n_gaensl", "c_gaensl",
            "e_lucid", "n_lucid", "h_lucid", "e_will", "n_will", "h_will", "n_dusk", "c_dusk",
            "n_dunkel", "h_dunkel", "n_hilla", "h_hilla", "b_mage", "n_seren", "h_seren",
            "e_kalos", "n_kalos", "c_kalos", "e_kaling", "n_kaling", "h_kaling", "n_limbo", "h_limbo"
        ];
        defaultBossKeys.forEach(k => {
            if (d[`boss_${k}`] === undefined) d[`boss_${k}`] = false;
        });
    });
    // 보정 완료된 깔끔한 데이터를 다시 로컬 저장소에 안전하게 백업 보관합니다.
    localStorage.setItem("omni_v14_todo_perfect_storage", JSON.stringify(window.omniTodoState.checkData));

    // 5. 상단 서브 탭 메뉴 단추들을 조립하고, 최초 디폴트 활성화 탭인 'boss(레이드 정산)' 화면을 트리거합니다.
    window.renderTodoSubTabHeaders();
    window.switchTodoTab(window.omniTodoState.activeSubTab);
};

/**
 * 🎨 [초보자 가이드] 요약, 플래너, 일퀘, 주퀘, 보스 5대 서브메뉴를 화면 상단에 안전하게 그려내는 엔진입니다.
 */
window.renderTodoSubTabHeaders = function() {
    const pageTodoSection = document.getElementById('page-todo');
    if (!pageTodoSection) return;

    // 이미 메뉴 덤프가 마운트되어 있다면 중복 생성을 막고, 없다면 새 그릇(.sub-tab-menu)을 만들어 대타이틀 바로 다음에 배치합니다.
    let tabMenuWrapper = pageTodoSection.querySelector('.sub-tab-menu');
    if (!tabMenuWrapper) {
        tabMenuWrapper = document.createElement('div');
        tabMenuWrapper.className = 'sub-tab-menu';
        
        // .page-header 요소가 있으면 그 뒤에 넣고, 없으면 맨 앞에 추가합니다.
        const header = pageTodoSection.querySelector('.page-header');
        if (header && header.nextSibling) {
            pageTodoSection.insertBefore(tabMenuWrapper, header.nextSibling);
        } else {
            pageTodoSection.insertBefore(tabMenuWrapper, pageTodoSection.firstChild);
        }
    }

    // [버그 해결 코어]: HTML 내부에 5대 메뉴 단추가 삭제되더라도 언제든 완벽 복구될 수 있게 내부 코드를 명시합니다.
    tabMenuWrapper.innerHTML = `
        <button class="tab-btn" onclick="window.switchTodoTab('summary')">📋 주간할일 요약</button>
        <button class="tab-btn" onclick="window.switchTodoTab('planner')">📅 전략 플래너</button>
        <button class="tab-btn" onclick="window.switchTodoTab('daily')">☀️ 일일 퀘스트</button>
        <button class="tab-btn" onclick="window.switchTodoTab('weekly')">📦 주간 콘텐츠</button>
        <button class="tab-btn" onclick="window.switchTodoTab('boss')">😈 레이드 정산</button>
    `;
};

/**
 * 🔄 [초보자 가이드] 사용자가 메뉴 단추를 누를 때마다 화면 인터페이스를 해당 기능으로 안전하게 전환해주는 네비게이터입니다.
 */
window.switchTodoTab = function(tabId) {
    window.omniTodoState.activeSubTab = tabId;

    const pageTodoSection = document.getElementById('page-todo');
    if (!pageTodoSection) return;

    // [안전 장치 보강]: 라우터가 화면을 지웠을 가능성에 대비하여, 전환할 때마다 상단 메뉴 바 존재 여부를 상시 체크 및 강제 주입합니다.
    window.renderTodoSubTabHeaders();

    // 모든 버튼에서 active(불 들어오는 효과) 클래스를 걷어내고, 현재 선택한 탭 버튼에만 active 클래스를 부여합니다.
    pageTodoSection.querySelectorAll('.sub-tab-menu .tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId)) {
            btn.classList.add('active');
        }
    });

    // [자체 생존 코어 개혁]: index.html에서 날려버린 5대 하위 서브 섹션 그릇들을 자바스크립트 내부 루프를 통해 동적으로 완벽 생성합니다.
    ['summary', 'planner', 'daily', 'weekly', 'boss'].forEach(t => {
        let sect = document.getElementById(`todo-${t}`);
        if (!sect) {
            sect = document.createElement('div');
            sect.id = `todo-${t}`;
            sect.className = 'sub-section';
            pageTodoSection.appendChild(sect);
        }
        sect.classList.remove('active');
        sect.innerHTML = ""; // 이전 페이지에 남아있던 잔여 뷰 텍스트를 깨끗하게 청소합니다.
    });

    // 현재 타겟이 된 서브 섹션 그릇을 찾아서 active 클래스를 켜줌으로써 눈에 보이게 만듭니다.
    const targetSection = document.getElementById(`todo-${tabId}`);
    if (targetSection) targetSection.classList.add('active');

    // 각 서브메뉴의 전용 드로잉 엔진을 호출하여 내부에 실시간 정산 수치 UI를 완벽하게 그려냅니다.
    if (tabId === 'summary') window.renderTodoSummaryContent();
    if (tabId === 'planner') window.renderTodoPlannerContent();
    if (tabId === 'daily') window.renderTodoDailyContent();
    if (tabId === 'weekly') window.renderTodoWeeklyContent();
    if (tabId === 'boss') window.renderTodoBossContent();
};

/**
 * 📊 [초보자 가이드] 총 클리어 횟수 및 이번 주 누적 정산금을 계산하여 공통 상단 위젯 스택 레이아웃을 변환해 주는 함수입니다.
 */
window.renderGlobalTodoSummary = function() {
    const chars = window.omniTodoState.characters;
    const checks = window.omniTodoState.checkData;
    const prices = window.omniTodoState.bossPrices;

    let totalBossCount = 0; 
    let activeBossCharacters = 0; 
    let totalAccumulatedMeso = 0;

    // 저장된 전체 캐릭터를 돌면서 체크박스가 활성화(true)된 보스의 마리수와 메소 가격을 합산 연산합니다.
    chars.forEach(c => {
        const data = checks[c.id] || {};
        let hasBossActive = false;

        Object.keys(prices).forEach(key => {
            if (data[`boss_${key}`] === true) {
                totalBossCount++;
                hasBossActive = true;
                totalAccumulatedMeso += prices[key];
            }
        });

        if (hasBossActive) activeBossCharacters++;
    });

    return `
        <div class="workspace-notice-card" style="width: 100%; margin-bottom: 16px; border-left: 5px solid #8b5cf6; background: #fdfbfe; padding: 14px 18px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-weight: 800; color: #6d28d9; font-size: 13px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                <span>💡 넥슨 실시간 스케줄러 동기화 패널</span>
            </div>
            <p style="margin: 0; font-size: 12px; color: #4b5563; line-height: 1.5; font-weight: 500;">
                인게임 숙제 수행 후 캐시숍을 들렀다 나온 상태에서 카드 우측 상단의 <strong style="color: #ef4444;">삭제(×) 버튼</strong>을 누르고 닉네임을 다시 검색해 주십시오.
                브라우저 잔류 캐시 파쇄 필터가 작동하여 **일일 퀘스트, 주간 에픽던전, 주간 보스 클리어 현황까지 인게임 원본과 완전히 똑같이 100% 실시간 자동 체크 정산**됩니다!
            </p>
        </div>

        <div class="omni-summary-dashboard">
            <div class="omni-summary-card">
                <div class="text-box">
                    <span class="label">총 보스 클리어 횟수</span>
                    <strong class="value">${totalBossCount}<span class="unit">회</span></strong>
                </div>
            </div>
            <div class="omni-summary-card">
                <div class="text-box">
                    <span class="label">레이드 참여 명단</span>
                    <strong class="value">${activeBossCharacters}<span class="unit">명</span></strong>
                </div>
            </div>
            <div class="omni-summary-card primary-highlight" style="grid-column: span 2;">
                <div class="text-box">
                    <span class="label">💰 이번 주 보스 순수익 총 정산금</span>
                    <strong class="value color-indigo">${totalAccumulatedMeso.toLocaleString()}<span class="unit-meso">Meso</span></strong>
                </div>
            </div>
        </div>
    `;
};

/**
 * 📋 [초보자 가이드] 등록된 대역 캐릭터들의 일일/주간 숙제 달성률 퍼센티지 바 그래프를 요약해 띄워주는 서브 섹션입니다.
 */
window.renderTodoSummaryContent = function() {
    const container = document.getElementById('todo-summary');
    if (!container) return;

    if (window.omniTodoState.characters.length === 0) {
        container.innerHTML = `
            ${window.renderGlobalTodoSummary()}
            <div class="omni-empty-state">스케줄러 명단에 등록된 캐릭터 정보가 없습니다. 상단에서 검색을 진행하세요.</div>
        `;
        return;
    }

    let dailySummaryRows = "";
    let weeklySummaryRows = "";

    window.omniTodoState.characters.forEach(char => {
        const data = window.omniTodoState.checkData[char.id] || {};
        
        // 일일 완료도 연산 (몬파 + 어센틱 아케인 심볼 일퀘 7종 스펙 대조)
        let dailyMax = 8; let dailyDone = 0;
        if (parseInt(data.daily_m_park || 0, 10) >= 7) dailyDone++;
        const dailyKeys = ['daily_cernium', 'daily_arcus', 'daily_odium', 'daily_shangrila', 'daily_arteria', 'daily_carcion', 'daily_talhart'];
        dailyKeys.forEach(k => { if(data[k]) dailyDone++; });
        let dailyPercent = Math.round((dailyDone / dailyMax) * 100);

        // 주간 완료도 연산 (에픽던전 하이마운틴, 앵글러 + 주간 보스 클리어 개수 대조)
        let weeklyMax = 15; let weeklyDone = 0;
        if(data.weekly_mountain) weeklyDone++;
        if(data.weekly_angeler) weeklyDone++;
        Object.keys(window.omniTodoState.bossPrices).forEach(k => {
            if (data[`boss_${k}`]) weeklyDone++;
        });
        let weeklyPercent = Math.round((weeklyDone / weeklyMax) * 100);
        if (weeklyPercent > 100) weeklyPercent = 100;

        // 일일 스태츠 로우 가우징 구조 템플릿 생성
        dailySummaryRows += `
            <div class="char-summary-row" style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="width: 46px; height: 46px; overflow: hidden; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #fff; border: 1px solid #e2e8f0; margin-right: 10px; flex-shrink: 0;">
                    <img src="${char.image || SAFE_FALLBACK_AVATAR}" class="char-avatar" style="width: 46px; height: 46px; object-fit: contain; transform: scale(2.3); transform-origin: center center;">
                </div>
                <div class="char-summary-meta" style="flex: 1;">
                    <div class="char-summary-name-line">
                        <span>${char.name} (Lv.${char.level || 280})</span>
                        <span class="percent-txt">${dailyPercent}%</span>
                    </div>
                    <div class="summary-progress-track">
                        <div class="summary-progress-bar" style="width: ${dailyPercent}%;"></div>
                    </div>
                </div>
            </div>
        `;

        // 주간 스태츠 로우 가우징 구조 템플릿 생성
        weeklySummaryRows += `
            <div class="char-summary-row" style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="width: 46px; height: 46px; overflow: hidden; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #fff; border: 1px solid #e2e8f0; margin-right: 10px; flex-shrink: 0;">
                    <img src="${char.image || SAFE_FALLBACK_AVATAR}" class="char-avatar" style="width: 46px; height: 46px; object-fit: contain; transform: scale(2.3); transform-origin: center center;">
                </div>
                <div class="char-summary-meta" style="flex: 1;">
                    <div class="char-summary-name-line">
                        <span>${char.name} (${char.job || '모험가'})</span>
                        <span class="percent-txt" style="color:#8b5cf6;">${weeklyPercent}%</span>
                    </div>
                    <div class="summary-progress-track">
                        <div class="summary-progress-bar" style="width: ${weeklyPercent}%; background:linear-gradient(90deg, #c4b5fd, #8b5cf6);"></div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        ${window.renderGlobalTodoSummary()}
        <div class="omni-weekly-summary-wrapper">
            <div class="summary-status-grid">
                <div class="summary-brief-card">
                    <div class="brief-card-title">☀️ 일일 콘텐츠 진행 현황 요약</div>
                    ${dailySummaryRows}
                </div>
                <div class="summary-brief-card">
                    <div class="brief-card-title">📦 주간 콘텐츠 & 보스 레이드 스태츠</div>
                    ${weeklySummaryRows}
                </div>
            </div>
        </div>
    `;
};

/**
 * 📅 [초보자 가이드] 장기 유저 전략 플래너 카드와 체크용 미니 달력을 렌더링하는 구역입니다.
 */
window.renderTodoPlannerContent = function() {
    const container = document.getElementById('todo-planner');
    if (!container) return;

    const savedPlansRaw = localStorage.getItem("omni_v14_strategy_plans");
    let planList = savedPlansRaw ? JSON.parse(savedPlansRaw) : [];

    let cardsHtml = "";
    planList.forEach((plan, index) => {
        cardsHtml += `
            <div class="planner-card-item">
                <div class="planner-card-meta">
                    <span class="planner-card-tag">🎯 육성 캐릭터: ${plan.char}</span>
                    <button class="planner-card-del-action" onclick="window.deleteTodoStrategyPlan(${index})">삭제</button>
                </div>
                <h5 class="planner-card-goal"><span class="plan-label-mini">목표</span> ${plan.goal}</h5>
                <p class="planner-card-route"><span class="plan-label-mini-route">동선</span> ${plan.route}</p>
            </div>
        `;
    });

    let selectOptions = ``;
    window.omniTodoState.characters.forEach(c => {
        selectOptions += `<option value="${c.name}">${c.name}</option>`;
    });

    const interactiveCalendarHtml = window.buildMiniCalendarComponentMarkup(planList.length);

    container.innerHTML = `
        ${window.renderGlobalTodoSummary()}
        <div class="omni-planner-container">
            <div class="planner-header-flex">
                <span class="planner-badge">STRATEGY DESIGNER</span>
                <h4 class="planner-main-title">📅 OMNI STRATEGY PLANNER (캐릭터 장기 육성 계획서)</h4>
                
                <div class="planner-form-row">
                    <select id="todoPlannerCharSelect" class="planner-select-box">
                        ${selectOptions ? selectOptions : '<option value="미지정">캐릭터 없음</option>'}
                    </select>
                    <input type="text" id="todoPlannerGoalInput" placeholder="육성 목표 레벨 기입..." class="planner-input-field">
                    <input type="text" id="todoPlannerRouteInput" placeholder="매일 핵심 이동 성장 루트 동선 정의..." class="planner-input-field">
                    <button class="planner-btn-submit" onclick="window.addTodoStrategyPlan()">계획 수립</button>
                </div>
            </div>
            
            <div class="omni-planner-dashboard-layout">
                <div class="planner-grid-cards">
                    ${cardsHtml ? cardsHtml : '<div class="omni-empty-state" style="padding:20px;">수립된 장기 육성 전략 계획서가 존재하지 않습니다.</div>'}
                </div>
                <div>
                    ${interactiveCalendarHtml}
                </div>
            </div>
        </div>
    `;
};

/**
 * 🗓️ [초보자 가이드] 플래너 화면 우측에 들어가는 30일짜리 마킹형 미니 달력을 조립합니다.
 */
window.buildMiniCalendarComponentMarkup = function(planCount) {
    const weekLabels = ['일', '월', '화', '수', '목', '금', '토'];
    let daysHtml = "";
    weekLabels.forEach(l => { daysHtml += `<div class="calendar-day-label">${l}</div>`; });
    daysHtml += `<div class="calendar-date-cell empty-cell"></div>`;

    for(let d=1; d<=30; d++) {
        const isChecked = window.omniTodoState.calendarCheckedDays[d] === true;
        const checkedClass = isChecked ? 'is-checked' : '';
        daysHtml += `<div class="calendar-date-cell ${checkedClass}" onclick="window.toggleCalendarDateCell(${d})">${d}</div>`;
    }

    return `
        <div class="omni-mini-calendar-widget">
            <div class="calendar-header-title">
                <span>🗓️ 달력 체크 스케줄러</span>
            </div>
            <div class="calendar-days-grid">
                ${daysHtml}
            </div>
        </div>
    `;
};

/**
 * 🔄 [초보자 가이드] 미니 달력의 날짜 칸을 클릭했을 때 체크 상태를 반전시키고 로컬 스토리지에 즉시 기입합니다.
 */
window.toggleCalendarDateCell = function(dayNum) {
    window.omniTodoState.calendarCheckedDays[dayNum] = !window.omniTodoState.calendarCheckedDays[dayNum];
    localStorage.setItem("omni_v14_todo_calendar_checked", JSON.stringify(window.omniTodoState.calendarCheckedDays));
    window.switchTodoTab(window.omniTodoState.activeSubTab);
};

/**
 * ☀️ [초보자 가이드] 일일 숙제(몬파 및 지역별 일퀘) 진행 현황판을 풀 드로잉 해주는 엔진 영역입니다.
 */
window.renderTodoDailyContent = function() {
    const container = document.getElementById('todo-daily');
    if (!container) return;
    if (window.omniTodoState.characters.length === 0) {
        container.innerHTML = `
            ${window.renderGlobalTodoSummary()}
            <div class="omni-empty-state">캐릭터를 검색창에 탐색하여 스케줄러 명단에 편입시켜 주십시오.</div>
        `; 
        return;
    }

    let html = window.renderGlobalTodoSummary() + `<div class="omni-character-grid">`;
    window.omniTodoState.characters.forEach(char => {
        const data = window.omniTodoState.checkData[char.id] || {};
        let currentMparkCount = data.daily_m_park || 0;

        html += `
            <div class="omni-char-card">
                <div class="char-header" style="display: flex; align-items: center; position: relative;">
                    <div style="width: 56px; height: 56px; overflow: hidden; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: #fff; border: 1px solid #e2e8f0; margin-right: 12px; flex-shrink: 0;">
                        <img src="${char.image || SAFE_FALLBACK_AVATAR}" class="char-avatar" style="width: 56px; height: 56px; object-fit: contain; transform: scale(2.3); transform-origin: center center;" onerror="this.src='${SAFE_FALLBACK_AVATAR}';">
                    </div>
                    <div class="char-info">
                        <div class="char-name">${char.name}</div>
                        <div class="char-spec">Lv.${char.level || 280} · ${char.job || '아델'}</div>
                    </div>
                    <button class="btn-delete-char" onclick="window.removeTodoCharacter(event, '${char.id}')">×</button>
                </div>
                <div class="hw-scroll-list">
                    <div class="hw-item-row ${currentMparkCount >= 7 ? 'is-done' : ''}" onclick="window.incrementMonsterParkCounter('${char.id}')">
                        <div class="hw-left">
                            <div class="custom-premium-checkbox ${currentMparkCount >= 7 ? 'checked' : ''}">${currentMparkCount >= 7 ? '✓' : ''}</div>
                            <span class="hw-title">몬스터파크 (클릭 시 횟수 증가)</span>
                        </div>
                        <span class="hw-counter">${currentMparkCount} / 7 회</span>
                    </div>
                    ${renderHwItem(char.id, 'daily_cernium', '세르니움 조사', data.daily_cernium, '완료', '미완료')}
                    ${renderHwItem(char.id, 'daily_arcus', '호텔 아르크스 청소', data.daily_arcus, '완료', '미완료')}
                    ${renderHwItem(char.id, 'daily_odium', '오디움 일대 탐사', data.daily_odium, '완료', '미완료')}
                    ${renderHwItem(char.id, 'daily_shangrila', '도원경 오염 정화', data.daily_shangrila, '완료', '미완료')}
                    ${renderHwItem(char.id, 'daily_arteria', '아르테리아 잔당 처치', data.daily_arteria, '완료', '미완료')}
                    ${renderHwItem(char.id, 'daily_carcion', '카르시온 복구 지원', data.daily_carcion, '완료', '미완료')}
                    ${renderHwItem(char.id, 'daily_talhart', '탈라하트 조사', data.daily_talhart, '완료', '미완료')}
                </div>
            </div>
        `;
    });
    container.innerHTML = html + `</div>`;
};

/**
 * 📦 [초보자 가이드] 하이마운틴, 앵글러 컴퍼니 등 주간 에픽 던전 전용 관제 섹션입니다.
 */
window.renderTodoWeeklyContent = function() {
    const container = document.getElementById('todo-weekly');
    if (!container) return;
    if (window.omniTodoState.characters.length === 0) {
        container.innerHTML = `
            ${window.renderGlobalTodoSummary()}
            <div class="omni-empty-state">캐릭터 카드가 등록되어있지 않습니다.</div>
        `;
        return;
    }

    let html = window.renderGlobalTodoSummary() + `<div class="omni-character-grid">`;
    window.omniTodoState.characters.forEach(char => {
        const data = window.omniTodoState.checkData[char.id] || {};
        
        html += `
            <div class="omni-char-card">
                <div class="char-header" style="display: flex; align-items: center; position: relative;">
                    <div style="width: 56px; height: 56px; overflow: hidden; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: #fff; border: 1px solid #e2e8f0; margin-right: 12px; flex-shrink: 0;">
                        <img src="${char.image || SAFE_FALLBACK_AVATAR}" class="char-avatar" style="width: 56px; height: 56px; object-fit: contain; transform: scale(2.3); transform-origin: center center;">
                    </div>
                    <div class="char-info"><div class="char-name">${char.name}</div></div>
                    <button class="btn-delete-char" onclick="window.removeTodoCharacter(event, '${char.id}')">×</button>
                </div>
                <div class="hw-scroll-list">
                    ${renderHwItem(char.id, 'weekly_mountain', '에픽 던전 : 하이마운틴', data.weekly_mountain, '완료', '대기')}
                    ${renderHwItem(char.id, 'weekly_angeler', '에픽 던전 : 앵글러 컴퍼니', data.weekly_angeler, '완료', '대기')}
                </div>
            </div>
        `;
    });
    container.innerHTML = html + `</div>`;
};

/**
 * 😈 [초보자 가이드] 주간 레이드 보스 30선 결정석 금액 가치 정산 리포트를 구현하는 구역입니다.
 */
window.renderTodoBossContent = function() {
    const container = document.getElementById('todo-boss');
    if (!container) return;
    if (window.omniTodoState.characters.length === 0) {
        container.innerHTML = `
            ${window.renderGlobalTodoSummary()}
            <div class="omni-empty-state">보스 명단이 비어있습니다.</div>
        `; 
        return;
    }

    let html = window.renderGlobalTodoSummary() + `<div class="omni-character-grid">`;
    const prices = window.omniTodoState.bossPrices;

    window.omniTodoState.characters.forEach(char => {
        const data = window.omniTodoState.checkData[char.id] || {};
        
        let charMeso = 0;
        Object.keys(prices).forEach(key => {
            if (data[`boss_${key}`] === true) charMeso += prices[key];
        });

        html += `
            <div class="omni-char-card" style="min-width:320px;">
                <div class="char-header" style="display: flex; align-items: center; position: relative;">
                    <div style="width: 56px; height: 56px; overflow: hidden; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: #fff; border: 1px solid #e2e8f0; margin-right: 12px; flex-shrink: 0;">
                        <img src="${char.image || SAFE_FALLBACK_AVATAR}" class="char-avatar" style="width: 56px; height: 56px; object-fit: contain; transform: scale(2.3); transform-origin: center center;" onerror="this.src='${SAFE_FALLBACK_AVATAR}';">
                    </div>
                    <div class="char-info">
                        <div class="char-name">${char.name}</div>
                        <div class="char-spec" style="color:#6d28d9; font-weight:800;">누적 정산: ${charMeso.toLocaleString()}</div>
                    </div>
                    <button class="btn-delete-char" onclick="window.removeTodoCharacter(event, '${char.id}')">×</button>
                </div>
                
                <div class="hw-scroll-list" style="max-height:450px; overflow-y:auto; padding-right:4px;">
                    <div style="font-size:10px; font-weight:900; color:#475569; padding:4px 6px; background:#f1f5f9; border-radius:4px; margin-bottom:6px;">⚔️ 검밑솔 ~ 주간 레이드 세분화 라인</div>
                    ${renderBossItem(char.id, 'boss_n_suu', '노말 스우 수입', '', data.boss_n_suu, prices.n_suu.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_h_suu', '하드 스우 수입', '', data.boss_h_suu, prices.h_suu.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_n_demian', '노말 데미안 수입', '', data.boss_n_demian, prices.n_demian.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_h_demian', '하드 데미안 수입', '', data.boss_h_demian, prices.h_demian.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_n_gaensl', '노말 가엔슬 수입', '', data.boss_n_gaensl, prices.n_gaensl.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_c_gaensl', '카오스 가엔슬 수입', '', data.boss_c_gaensl, prices.c_gaensl.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_e_lucid', '이지 루시드 수입', '', data.boss_e_lucid, prices.e_lucid.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_n_lucid', '노말 루시드 수입', '', data.boss_n_lucid, prices.n_lucid.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_h_lucid', '하드 루시드 수입', '', data.boss_h_lucid, prices.h_lucid.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_e_will', '이지 윌 수입', '', data.boss_e_will, prices.e_will.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_n_will', '노말 윌 수입', '', data.boss_n_will, prices.n_will.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_h_will', '하드 윌 수입', '', data.boss_h_will, prices.h_will.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_n_dusk', '노말 더스크 수입', '', data.boss_n_dusk, prices.n_dusk.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_c_dusk', '카오스 더스크 수입', '', data.boss_c_dusk, prices.c_dusk.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_n_dunkel', '노말 듄켈 수입', '', data.boss_n_dunkel, prices.n_dunkel.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_h_dunkel', '하드 듄켈 수입', '', data.boss_h_dunkel, prices.h_dunkel.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_n_hilla', '노말 진힐라 수입', '', data.boss_n_hilla, prices.n_hilla.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_h_hilla', '하드 진힐라 수입', '', data.boss_h_hilla, prices.h_hilla.toLocaleString(), '0')}
                    
                    <div style="font-size:10px; font-weight:900; color:#b45309; padding:4px 6px; background:#fff7ed; border-radius:4px; margin:10px 0 6px 0;">👑 검윗솔 ~ 최상위 하이엔드 레이드 라인</div>
                    ${renderBossItem(char.id, 'boss_b_mage', '검은 마법사', 'HARD', data.boss_b_mage, prices.b_mage.toLocaleString(), '대기')}
                    ${renderBossItem(char.id, 'boss_n_seren', '노말 세렌 수입', 'NORMAL', data.boss_n_seren, prices.n_seren.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_h_seren', '하드 세렌 수입', 'HARD', data.boss_h_seren, prices.h_seren.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_e_kalos', '이지 칼로스 수입', 'EASY', data.boss_e_kalos, prices.e_kalos.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_n_kalos', '노말 칼로스 수입', 'NORMAL', data.boss_n_kalos, prices.n_kalos.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_c_kalos', '카오스 칼로스 수입', 'CHAOS', data.boss_c_kalos, prices.c_kalos.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_e_kaling', '이지 카링 수입', 'EASY', data.boss_e_kaling, prices.e_kaling.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_n_kaling', '노말 카링 수입', 'NORMAL', data.boss_n_kaling, prices.n_kaling.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_h_kaling', '하드 카링 수입', 'HARD', data.boss_h_kaling, prices.h_kaling.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_n_limbo', '노말 림보 수입', 'NORMAL', data.boss_n_limbo, prices.n_limbo.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_h_limbo', '하드 림보 수입', 'HARD', data.boss_h_limbo, prices.h_limbo.toLocaleString(), '0')}
                    ${renderBossItem(char.id, 'boss_ex_suu', '익스트림 스우', 'EX', data.boss_ex_suu, prices.ex_suu.toLocaleString(), '대기')}
                </div>
            </div>
        `;
    });
    html += `</div>`;
    container.innerHTML = html;
};

// [초보자 가이드] 개별 일퀘 로우 HTML 구문을 리턴하는 빌더 헬퍼 유틸리티입니다.
function renderHwItem(charId, key, title, isChecked, textOn, textOff) {
    return `
        <div class="hw-item-row ${isChecked ? 'is-done' : ''}" onclick="window.toggleTodoCheckboxElement('${charId}', '${key}')">
            <div class="hw-left">
                <div class="custom-premium-checkbox ${isChecked ? 'checked' : ''}">${isChecked ? '✓' : ''}</div>
                <span class="hw-title">${title}</span>
            </div>
            <span class="hw-counter">${isChecked ? textOn : textOff}</span>
        </div>
    `;
}

// [초보자 가이드] 개별 보스 레이드 로우 HTML 구문을 패스텔 배지와 함께 결합해 주는 빌더 헬퍼입니다.
function renderBossItem(charId, key, title, badge, isChecked, textOn, textOff) {
    const badgeHtml = badge ? `<span class="boss-badge-pastel">${badge}</span>` : '';
    return `
        <div class="hw-item-row ${isChecked ? 'is-done' : ''}" onclick="window.toggleTodoCheckboxElement('${charId}', '${key}')">
            <div class="hw-left">
                <div class="custom-premium-checkbox ${isChecked ? 'checked' : ''}">${isChecked ? '✓' : ''}</div>
                <div class="boss-image-placeholder-blank"></div>
                <span class="hw-title">${title} ${badgeHtml}</span>
            </div>
            <span class="hw-counter clean-num" style="font-weight:800; color:${isChecked ? '#6d28d9' : '#94a3b8'};">${isChecked ? textOn : textOff}</span>
        </div>
    `;
}

// [초보자 가이드] 몬파 단추 클릭 시 수치를 1씩 추가하고 7이 넘어가면 다시 0으로 순환시키는 핸들러입니다.
window.incrementMonsterParkCounter = function(charId) {
    const targetData = window.omniTodoState.checkData[charId];
    if (!targetData) return;
    let current = parseInt(targetData.daily_m_park || 0, 10);
    current++; if (current > 7) current = 0; 
    targetData.daily_m_park = current;
    localStorage.setItem("omni_v14_todo_perfect_storage", JSON.stringify(window.omniTodoState.checkData));
    window.switchTodoTab(window.omniTodoState.activeSubTab);
};

// [초보자 가이드] 체크박스를 마우스로 직접 강제 토글할 때 값을 반전해 스토리지에 세이브하는 함수입니다.
window.toggleTodoCheckboxElement = function(charId, objectKey) {
    const targetData = window.omniTodoState.checkData[charId];
    if (!targetData) return;
    targetData[objectKey] = !targetData[objectKey];
    localStorage.setItem("omni_v14_todo_perfect_storage", JSON.stringify(window.omniTodoState.checkData));
    window.switchTodoTab(window.omniTodoState.activeSubTab);
};

// [초보자 가이드] 캐릭터 카드를 삭제하고 관련 잔여 로컬 데이터를 파쇄하는 디스트로이어 기능입니다.
window.removeTodoCharacter = function(event, charId) {
    event.stopPropagation();
    if (!confirm("해당 캐릭터를 스케줄러 명단에서 일시 제거하시겠습니까? 제거한 직후 상단 검색창에 다시 닉네임을 치면 브라우저 잔류 캐시가 원천 분쇄된 상태로 넥슨의 가장 최신 실시간 인게임 원본 데이터가 강제 수신되어 재등록됩니다!")) return;
    
    localStorage.removeItem(`omni_v14_cached_char_${charId}`);

    window.omniTodoState.characters = window.omniTodoState.characters.filter(c => c.id !== charId);
    delete window.omniTodoState.checkData[charId];
    
    localStorage.setItem("omni_v14_todo_characters_list", JSON.stringify(window.omniTodoState.characters));
    localStorage.setItem("omni_v14_todo_perfect_storage", JSON.stringify(window.omniTodoState.checkData));
    
    window.switchTodoTab(window.omniTodoState.activeSubTab);
};

// [초보자 가이드] 플래너 배열에서 해당 인덱스의 설계안을 찾아 소각합니다.
window.deleteTodoStrategyPlan = function(index) {
    const savedPlansRaw = localStorage.getItem("omni_v14_strategy_plans");
    if (!savedPlansRaw) return;

    let planList = JSON.parse(savedPlansRaw);
    planList.splice(index, 1);

    localStorage.setItem("omni_v14_strategy_plans", JSON.stringify(planList));
    window.renderTodoPlannerContent();
};

// [초보자 가이드] 작성한 폼 값을 가져와 신규 플랜 오브젝트를 생성 후 최상단에 배열 주입합니다.
window.addTodoStrategyPlan = function() {
    const charSelect = document.getElementById('todoPlannerCharSelect');
    const goalInput = document.getElementById('todoPlannerGoalInput');
    const routeInput = document.getElementById('todoPlannerRouteInput');

    if (!goalInput || !routeInput || !goalInput.value.trim() || !routeInput.value.trim()) {
        alert("목표와 세부 동선을 입력하셔야 전략 설계가 수립됩니다."); 
        return;
    }

    const savedPlansRaw = localStorage.getItem("omni_v14_strategy_plans");
    let planList = savedPlansRaw ? JSON.parse(savedPlansRaw) : [];

    planList.unshift({
        char: charSelect ? charSelect.value : "미정",
        goal: goalInput.value.trim(),
        route: routeInput.value.trim()
    });

    localStorage.setItem("omni_v14_strategy_plans", JSON.stringify(planList));
    
    goalInput.value = "";
    routeInput.value = "";
    window.renderTodoPlannerContent();
};

/**
 * 🌐 [실시간 스케줄러 패킷 3단계 다차원 동기화 코어]
 * 역할: 최신 넥슨 인게임 실시간 패킷 구조(quest_state, complete_flag)와 100% 무결점 일치 동기화를 실행합니다.
 */
window.syncTodoCharacterOnSearch = function(charName, basicInfo, apiHomework) {
    console.log(`[OMNI LINK V14] 일퀘/주퀘/보스 무결점 3D 동기화 가동 -> ${charName}`);
    let charactersList = window.omniTodoState.characters;

    let targetChar = charactersList.find(c => c.name === charName || c.id === charName);
    if (!targetChar) {
        targetChar = { 
            id: charName, 
            name: charName, 
            job: basicInfo?.character_class || "초보자", 
            level: basicInfo?.character_level || 200, 
            image: basicInfo?.character_image || SAFE_FALLBACK_AVATAR 
        };
        charactersList.push(targetChar);
    } else if (basicInfo) {
        targetChar.level = basicInfo.character_level || targetChar.level;
        targetChar.job = basicInfo.character_class || targetChar.job;
        targetChar.image = basicInfo.character_image || targetChar.image;
    }
    
    if (!window.omniTodoState.checkData[charName]) {
        window.omniTodoState.checkData[charName] = {};
    }
    const d = window.omniTodoState.checkData[charName];

    // 🛡️ 넥슨 서버 실시간 패킷 구조 언패킹 연동 바인딩
    const dailyArr = apiHomework.daily_contents || [];
    const weeklyArr = apiHomework.weekly_contents || [];
    const bossArr = apiHomework.boss_contents || [];

    // [에러 방지 샌드박스]: 글로벌 공통 날짜 유틸리티 함수가 유실되었을 경우를 대비한 가드 클로즈 필터
    const today = window.getOmniCustomTargetDate ? window.getOmniCustomTargetDate(0) : new Date().toISOString().split('T')[0];
    const isToday = (apiHomework.date === today);

    if (d.daily_m_park === undefined) d.daily_m_park = 0;
    const dailyKeys = ['daily_cernium', 'daily_arcus', 'daily_odium', 'daily_shangrila', 'daily_arteria', 'daily_carcion', 'daily_talhart'];
    dailyKeys.forEach(k => { if (d[k] === undefined) d[k] = false; });
    const weeklyKeys = ['weekly_mountain', 'weekly_angeler'];
    weeklyKeys.forEach(k => { if (d[k] === undefined) d[k] = false; });

    // 💡 [일일 퀘스트 검증 매커니즘]
    const syncDailyKey = (keyword, objectKey) => {
        const target = dailyArr.find(c => c.content_name && c.content_name.includes(keyword));
        if (target) {
            d[objectKey] = (String(target.quest_state) === "2");
        }
    };
    
    syncDailyKey("세르니움", "daily_cernium");
    syncDailyKey("아르크스", "daily_arcus");
    syncDailyKey("오디움", "daily_odium");
    syncDailyKey("도원경", "daily_shangrila");
    syncDailyKey("아르테리아", "daily_arteria");
    syncDailyKey("카르시온", "daily_carcion");
    syncDailyKey("탈라하트", "daily_talhart");

    const mparkObj = dailyArr.find(c => c.content_name && c.content_name.includes("몬스터파크"));
    if (mparkObj) {
        d.daily_m_park = mparkObj.now_count || 0;
    } else {
        if (d.daily_m_park === undefined) d.daily_m_park = 0;
    }

    // 2. 주간 콘텐츠 연동 이식 (진행 카운트 검증 병행)
    const syncWeeklyKey = (keyword, objectKey) => {
        const target = weeklyArr.find(c => c.content_name && c.content_name.includes(keyword));
        if (target) {
            d[objectKey] = (String(target.complete_flag) === "true" || target.complete_flag === true || (target.now_count && target.now_count > 0));
        } else {
            if (d[objectKey] === undefined) d[objectKey] = false;
        }
    };
    syncWeeklyKey("하이마운틴", "weekly_mountain");
    syncWeeklyKey("앵글러 컴퍼니", "weekly_angeler");

    // 3. 주간/월간 레이드 보스 30종 정밀 매핑 파싱
    const syncBossKey = (keyword, diff, objectKey) => {
        const target = bossArr.find(c => c.content_name && c.content_name.includes(keyword) && c.difficulty === diff);
        if (target) {
            d[`boss_${objectKey}`] = (String(target.complete_flag) === "true" || target.complete_flag === true);
        } else {
            if (d[`boss_${objectKey}`] === undefined) d[`boss_${objectKey}`] = false;
        }
    };

    syncBossKey("스우", "normal", "n_suu");
    syncBossKey("스우", "hard", "h_suu");
    syncBossKey("스우", "extreme", "ex_suu");
    syncBossKey("데미안", "normal", "n_demian");
    syncBossKey("데미안", "hard", "h_demian");
    syncBossKey("가디언 엔젤 슬라임", "normal", "n_gaensl");
    syncBossKey("가디언 엔젤 슬라임", "chaos", "c_gaensl");
    syncBossKey("루시드", "easy", "e_lucid");
    syncBossKey("루시드", "normal", "n_lucid");
    syncBossKey("루시드", "hard", "h_lucid");
    syncBossKey("윌", "easy", "e_will");
    syncBossKey("윌", "normal", "n_will");
    syncBossKey("윌", "hard", "h_will");
    syncBossKey("더스크", "normal", "n_dusk");
    syncBossKey("더스크", "chaos", "c_dusk");
    syncBossKey("듄켈", "normal", "n_dunkel");
    syncBossKey("듄켈", "hard", "h_dunkel");
    syncBossKey("진 힐라", "normal", "n_hilla");
    syncBossKey("진 힐라", "hard", "h_hilla");
    
    const bmageObj = bossArr.find(c => c.content_name && c.content_name.includes("검은 마법사"));
    if (bmageObj) d.boss_b_mage = (String(bmageObj.complete_flag) === "true" || bmageObj.complete_flag === true);
    
    syncBossKey("선택받은 세렌", "normal", "n_seren");
    syncBossKey("선택받은 세렌", "hard", "h_seren");
    syncBossKey("감시자 칼로스", "easy", "e_kalos");
    syncBossKey("감시자 칼로스", "normal", "n_kalos");
    syncBossKey("감시자 칼로스", "chaos", "c_kalos");
    syncBossKey("카링", "easy", "e_kaling");
    syncBossKey("카링", "normal", "n_kaling");
    syncBossKey("카링", "hard", "h_kaling");
    syncBossKey("림보", "normal", "n_limbo");
    syncBossKey("림보", "hard", "h_limbo");

    localStorage.setItem("omni_v14_todo_characters_list", JSON.stringify(charactersList));
    localStorage.setItem("omni_v14_todo_perfect_storage", JSON.stringify(window.omniTodoState.checkData));
    
    window.switchTodoTab(window.omniTodoState.activeSubTab);
};

// [초보자 가이드] DOM이 먼저 로드되었든 늦게 로드되었든 상관없이 즉시 초기 실행되도록 실행 타이밍 우회 안전핀을 꽂습니다.
if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof window.initOmniTodoTab === 'function') window.initOmniTodoTab();
    });
} else {
    if (typeof window.initOmniTodoTab === 'function') window.initOmniTodoTab();
}