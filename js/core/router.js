/**
 * ========================================================
 * [ROUTER.JS]
 * 용도: 단일 페이지 애플리케이션(SPA)의 완벽한 탭 화면 전환 제어기
 * ========================================================
 */
window.omniSwitchPage = function(pageId) {
    // 1. 모든 메인 페이지 뷰포트 레이어 숨김 처리
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // 2. 타겟으로 지정된 특정 페이지 레이어 활성화 선언
    const targetPage = document.getElementById(pageId);
    if(targetPage) {
        targetPage.classList.add('active');
    }

    // 3. 네비게이션 상단 버튼들의 기존 액티브 클래스 일제 회수
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // 4. 활성화된 페이지에 대응하는 상단 탑 메뉴 버튼을 추적하여 액티브 가이드 인입
    const btnMap = {
        'page-dashboard': 'nav-btn-dashboard',
        'page-todo': 'nav-btn-todo',
        'page-search': 'nav-btn-search',
        'page-scanner': 'nav-btn-scanner',
        'page-builder': 'nav-btn-builder',
        'page-hunt': 'nav-btn-hunt',
        'page-mvp': 'nav-btn-mvp'
    };

    const targetBtnId = btnMap[pageId];
    const targetBtn = document.getElementById(targetBtnId);
    if(targetBtn) {
        targetBtn.classList.add('active');
    }
    
    console.log("SPA 관제 콘솔 인프라 라우팅 목적지 도달 완료: ", pageId);
};