/**
 * ============================================================================
 * 🧠 history.js - 📜 통합 기록지 달력 코어 작동 엔진
 * 설명: index.html의 #hunt-history 구역에 프리미엄 캘린더를 바인딩하고 데이터를 파싱합니다.
 * ============================================================================
 */

// [초보자 가이드] 전역 연도 및 월 변수가 준비되어 있지 않다면 즉시 오늘 날짜로 세팅 메모리 가동합니다.
if (typeof window.attendanceYear === 'undefined') window.attendanceYear = new Date().getFullYear();
if (typeof window.attendanceMonth === 'undefined') window.attendanceMonth = new Date().getMonth();
if (typeof window.currentIdx === 'undefined') window.currentIdx = 1;

/**
 * [초보자 가이드] 1. 달력 카드 터치 시 작동하는 수동 출석 스위치
 * 기능: 클릭 시 출석 여부 상태를 뒤집어 반전 저장(True <-> False) 합니다.
 */
window.toggleAttendance = function(dateStr, charId) {
    const targetIdx = charId || window.currentIdx || 1;
    let manualAttendance = JSON.parse(localStorage.getItem(`manual_attendance_${targetIdx}`) || '{}');
    
    manualAttendance[dateStr] = !manualAttendance[dateStr];
    localStorage.setItem(`manual_attendance_${targetIdx}`, JSON.stringify(manualAttendance));
    
    // 캘린더 화면과 연계 컴포넌트들을 실시간 갱신합니다.
    if (typeof window.renderAttendance === 'function') window.renderAttendance();
    if (typeof window.refreshWeekly === 'function') window.refreshWeekly();
    
    if (typeof showToast === 'function') {
        showToast(manualAttendance[dateStr] ? "출석 체크 완료! ✅" : "출석이 해제되었습니다.");
    }
};

/**
 * [초보자 가이드] 2. 달력 연월 전환 세퍼레이터 ( ◀ , ▶ 단추 )
 * 기능: 월 증가/감소 연산 시 1월 미만 혹은 12월 초과 시 연도 변환 스위칭을 안전하게 제어합니다.
 */
window.changeMonth = function(offset) { 
    window.attendanceMonth += offset;
    
    if (window.attendanceMonth < 0) { 
        window.attendanceMonth = 11; 
        window.attendanceYear -= 1; 
    } else if (window.attendanceMonth > 11) { 
        window.attendanceMonth = 0; 
        window.attendanceYear += 1; 
    }
    
    if (typeof window.renderAttendance === 'function') window.renderAttendance(); 
};

/**
 * [초보자 가이드] 3. 프리미엄 출석 달력 동적 기하 렌더러
 * 기능: 사용자의 원본 데이터 베이스인 'maple_hunt_records'와 'window.subHistory'를 실시간 추적 바인딩합니다.
 */
window.renderAttendance = function() {
    const matrixRoot = document.getElementById('omniCalendarMatrixRoot');
    const labelYearMonth = document.getElementById('omniCalendarYearMonthText');
    if (!matrixRoot) return;

    if (labelYearMonth) {
        labelYearMonth.textContent = `${window.attendanceYear}년 ${String(window.attendanceMonth + 1).padStart(2, '0')}월`;
    }

    matrixRoot.innerHTML = ''; // 격자 초기화

    // 첫날의 요일 색인 및 해당 월의 최대 말일수 도출
    const startDayIdx = new Date(window.attendanceYear, window.attendanceMonth, 1).getDay();
    const totalDaysCount = new Date(window.attendanceYear, window.attendanceMonth + 1, 0).getDate();

    const currentTabIdx = parseInt(window.currentIdx) || 1;
    const allRecords = JSON.parse(localStorage.getItem('maple_hunt_records') || '[]');
    const manualAttendance = JSON.parse(localStorage.getItem(`manual_attendance_${currentTabIdx}`) || '{}');

    // 1단계: 1일 시작 전 요일 공백 채우기
    for (let i = 0; i < startDayIdx; i++) {
        const blankBox = document.createElement('div');
        blankBox.className = 'calendar-day-blank-space';
        matrixRoot.appendChild(blankBox);
    }

    // 2단계: 1일부터 한 달 일수만큼 순회하며 실시간 전리품 수치 가산
    for (let day = 1; day <= totalDaysCount; day++) {
        const thisDateObj = new Date(window.attendanceYear, window.attendanceMonth, day);
        const dateKeyStr = thisDateObj.toISOString().split('T')[0]; // YYYY-MM-DD

        let daySumMeso = 0;
        let daySumCores = 0;
        let daySumFrags = 0;

        // [A] 확정 기록 데이터 필터 매핑
        allRecords.filter(r => r.charId == currentTabIdx && r.date === dateKeyStr).forEach(r => {
            daySumMeso += parseInt(String(r.meso).replace(/,/g, "")) || 0;
            daySumCores += parseInt(r.core || 0);
            daySumFrags += parseInt(r.frag || 0);
        });

        // [B] 미확정 세션 임시 버퍼 데이터 필터 매핑
        const sKey = `${currentTabIdx}_${dateKeyStr}`;
        if (window.subHistory && window.subHistory[sKey]) {
            window.subHistory[sKey].forEach(tempRec => {
                if (!tempRec.isFinalized) { 
                    daySumMeso += parseInt(String(tempRec.meso).replace(/,/g, "")) || 0;
                    daySumCores += parseInt(tempRec.core || 0);
                    daySumFrags += parseInt(tempRec.frag || 0);
                }
            });
        }

        // 컴포넌트 형성 및 속성 주입
        const cellCard = document.createElement('div');
        const isAttended = manualAttendance[dateKeyStr] === true;
        
        cellCard.className = `calendar-day-box-item ${isAttended ? 'is-attended-active' : ''}`;
        cellCard.setAttribute('onclick', `window.toggleAttendance('${dateKeyStr}', ${currentTabIdx})`);

        // 단 1개의 수확물이라도 측정되었을 때 내부 정보 요약 텍스트 드로우 진행
        let innerSummaryHtml = '';
        if (daySumMeso > 0 || daySumCores > 0 || daySumFrags > 0) {
            const mesoTextForm = daySumMeso >= 100000000 
                ? (daySumMeso / 100000000).toFixed(1) + '억' 
                : (daySumMeso / 10000).toFixed(0) + '만';

            innerSummaryHtml = `
                <div class="day-summary-data-container">
                    <div class="day-summary-text-row color-meso-text">💰 ${mesoTextForm}</div>
                    <div class="day-summary-text-row color-item-text">💎 젬 ${daySumCores} / 조각 ${daySumFrags}</div>
                </div>
            `;
        }

        cellCard.innerHTML = `
            <div class="day-number-label">${day}</div>
            ${isAttended ? '<div class="day-stamped-check-icon">✅</div>' : ''}
            ${innerSummaryHtml}
        `;

        matrixRoot.appendChild(cellCard);
    }
};

// 최초 DOM 완성 시 통합 기록지 내부에 뼈대를 조립 매운 뒤 실시간 엔진을 작동시킵니다.
document.addEventListener('DOMContentLoaded', () => {
    const historyWorkspace = document.getElementById('hunt-history');
    if (!historyWorkspace) return;

    // 프리미엄 캘린더 전용 돔 이식 (image_04dfc5.png 와 형태 싱크로율 100%)
    historyWorkspace.innerHTML = `
        <div class="omni-calendar-card">
            <div class="calendar-top-flex">
                <div>
                    <h2 class="calendar-main-title">사냥 통합 기록지</h2>
                    <p class="calendar-sub-title">나의 사냥 데이터를 한눈에 확인하세요!</p>
                </div>
                <div class="char-name-badge-pill" id="lblLiveAttendanceCharBadge">캐릭터 선택</div>
            </div>

            <div class="calendar-action-bar">
                <div class="month-stepper-container">
                    <button class="month-step-btn" onclick="window.changeMonth(-1)">◀</button>
                    <span class="month-center-text" id="omniCalendarYearMonthText">2026년 06월</span>
                    <button class="month-step-btn" onclick="window.changeMonth(1)">▶</button>
                </div>
                <button class="btn-all-logs-shortcut" onclick="window.switchHuntTab('history')">새로고침</button>
            </div>

            <div class="calendar-weekdays-grid">
                <div class="weekday-header-cell" style="color: #ef4444;">일</div>
                <div class="weekday-header-cell">월</div>
                <div class="weekday-header-cell">화</div>
                <div class="weekday-header-cell">수</div>
                <div class="weekday-header-cell">목</div>
                <div class="weekday-header-cell">금</div>
                <div class="weekday-header-cell">토</div>
            </div>

            <div class="calendar-days-matrix-grid" id="omniCalendarMatrixRoot"></div>
        </div>
    `;

    // 초기 엔진 시동 작동
    window.renderAttendance();
});