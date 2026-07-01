/**
 * ============================================================================
 * 🎮 js/hunt/hunt.js - 전역 환경 설정, 내부 서브 탭 라우팅 매핑 엔진
 * 설명: index.html에 장착된 내부 라우터 단추들과 서브 섹션 간의 스위칭을 관제합니다.
 * ============================================================================
 */

// 전역 범위에 서브 탭 전환 함수를 안전하게 바인딩합니다.
window.switchHuntTab = function(tabId) {
    // 1. 모든 사냥 하부 섹션 블록들을 가져와 비활성화 처리합니다.
    const sections = document.querySelectorAll('#page-hunt .sub-section');
    sections.forEach(sec => sec.classList.remove('active'));

    // 2. 탭 메뉴 내부 버튼들의 하이라이트(active) 클래스를 전부 제거합니다.
    const buttons = document.querySelectorAll('#page-hunt .sub-tab-menu .tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // 3. 유저가 선택한 타겟 서브 섹션과 매칭되는 버튼만 정밀 활성화합니다.
    const targetSection = document.getElementById(`hunt-${tabId}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // 클릭된 버튼을 찾아 시각적 피드백 효과를 부여합니다.
    // HTML 내부 onclick="switchHuntTab('record')" 형태의 아키텍처 지원
    const clickedButton = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(`'${tabId}'`));
    if (clickedButton) {
        clickedButton.classList.add('active');
    }

    // 📈 만약 분석 리포트 탭으로 이동했다면, 그래프 엔진(Chart.js)을 최신 데이터로 실시간 리드로우(Redraw)합니다.
    if (tabId === 'analysis' && typeof window.renderOmniGrowthChart === 'function') {
        window.renderOmniGrowthChart();
    }
    
    // 📜 통합 기록지 탭으로 이동했다면 새로 추가되거나 가공된 내역을 반영하여 테이블을 갱신합니다.
    if (tabId === 'history' && typeof window.renderOmniHistoryTables === 'function') {
        window.renderOmniHistoryTables();
    }
};

// PWA 간편 미니 타이머 토글 제어 스위치
window.toggleMiniTimerMode = function() {
    const miniPanel = document.getElementById('miniTimerContainer');
    if (!miniPanel) return;
    
    miniPanel.classList.toggle('hidden');
    
    // 미니 타이머 활성화 시 내부에 동적 컨트롤 바인딩
    if (!miniPanel.classList.contains('hidden')) {
        miniPanel.innerHTML = `
            <div style="color: #94a3b8; font-size: 11px; font-weight: 800;">PWA MINI MONITOR ACTIVE</div>
            <div style="color: #38bdf8; font-weight: 900; font-size: 16px; font-variant-numeric: tabular-nums;" id="miniTimerDisplay">00:00:00</div>
            <div style="color: #64748b; font-size: 11px;">사냥 본진 탭에서 컨트롤 하세요</div>
        `;
    }
};

// 최초 페이지 로딩 완료 시 기본 무대로 'record' 탭을 강제 설정합니다.
document.addEventListener('DOMContentLoaded', () => {
    // 혹시 모를 오동작 방지를 위해 첫 탭 초기 구동
    window.switchHuntTab('record');
});