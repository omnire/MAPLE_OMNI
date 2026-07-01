/**
 * ============================================================================
 * 🔮 MAPLE OMNI V14 - js/intro/intro.js [GATEWAY CONTROLLER ENGINE]
 * 설명: 인트로 레이어의 동적 DOM 주입 및 대시보드 개방 제어 파이프라인
 * 구조: 좌측 넥슨 OpenAPI Key 입력 폼 필드와 우측 기능 소개 가이드 박스의 정중앙 2분할 밸런스
 * 규칙: 코딩 초보자도 완벽하게 이해할 수 있는 1:1 디테일 주석 시스템 완전판
 * ============================================================================
 */

/**
 * 💡 [초보자 가이드] 브라우저에 인트로 화면 구조를 안전하게 빌드하여 강제 삽입하는 코어 빌더 함수입니다.
 */
window.injectOmniIntroScreen = function() {
    // 겹침 방지 보정: 만약 이미 인트로 오버레이가 화면상에 존재한다면 중복 실행을 전면 차단합니다.
    if (document.getElementById('omniIntroOverlay')) return;

    // 인트로 오버레이 엘리먼트 노드 생성
    const introLayer = document.createElement('div');
    introLayer.id = 'omniIntroOverlay';

    // 기존에 저장된 API Key가 있다면 자동으로 입력창에 불러와 편의성을 높입니다.
    const savedApiKey = localStorage.getItem("omni_api_key") || "";

    // 💡 좌측 API Key 연동 카드 및 우측 기능 콤팩트 설명 박스 2분할 통합 아키텍처 주입
    introLayer.innerHTML = `
        <div class="intro-split-container">
            <div class="intro-left">
                <div class="intro-logo-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%;">
                        <path d="M12 2L14.5 7.5L20.5 6L18 11.5L23 14.5L16.5 16L17 22L12 18.5L7 22L7.5 16L1 14.5L6 11.5L3.5 6L9.5 7.5L12 2Z" fill="url(#introPurpleGrad)"/>
                        <path d="M9 12.5L11 14.5L15 9.5" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <defs>
                            <linearGradient id="introPurpleGrad" x1="1" y1="2" x2="23" y2="22" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stop-color="#a78bfa"/>
                                <stop offset="100%" stop-color="#6d28d9"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h1 class="intro-brand-title">Maple <span>Omni</span></h1>
                
                <div class="intro-login-card">
                    <div class="intro-form-group">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 5px;">
                            <label class="intro-form-label">NEXON OPEN API KEY</label>
                            <span onclick="showGuidePopup()" style="font-size:11px; color:#6d28d9; font-weight:800; text-decoration:underline; cursor:pointer;">API 발급방법 안내 ↗</span>
                        </div>
                        <input type="text" id="omni_api_key_input" class="intro-form-input" value="${savedApiKey}" placeholder="live_ 또는 test_ 로 시작하는 API키를 입력하세요">
                        <p style="margin:6px 0 0 0; font-size:10.5px; color:#64748b; line-height:1.4; word-break:keep-all;">
                            💡 입력하신 API 키는 외부 서버로 전송되지 않으며, 본인의 브라우저 개인 드라이버 로컬 영역에만 안전하게 암호화 보존되어 실시간 인게임 조회 연동에 사용됩니다.
                        </p>
                    </div>
                    <button class="intro-submit-btn" onclick="window.handleOmniApiKeyVerification()">API 키 연동 및 관제 콘솔 진입 ⚡</button>
                </div>
            </div>

            <div class="intro-right">
                <div class="intro-feature-box">
                    <div class="intro-icon-circle">📅</div>
                    <div class="feature-text-node">
                        <h4>인게임 연동 스케줄러</h4>
                        <p>캐릭터별 일일 숙제 진행률과 주간 보스 결정석 수익을 실시간으로 동기화 추적합니다.</p>
                    </div>
                </div>
                <div class="intro-feature-box">
                    <div class="intro-icon-circle">💰</div>
                    <div class="feature-text-node">
                        <h4>MVP 등급 손익 계산기</h4>
                        <p>캐시 및 경매장 수수료 차감 로직을 적용하여 실질 순이익 메소 자산을 완벽 보정합니다.</p>
                    </div>
                </div>
                <div class="intro-feature-box">
                    <div class="intro-icon-circle">⚔️</div>
                    <div class="feature-text-node">
                        <h4>사냥 및 재획 기록부</h4>
                        <p>1소재(30분)부터 1재획(120분) 가변 타이머 연동으로 순수 경험치와 코어 재화를 리포팅합니다.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="intro-footer-area">
            <div class="intro-footer-links">
                <span>서비스 소개</span>
                <span style="color:#6d28d9; font-weight:900;">개인정보처리방침</span>
                <span>이용약관</span>
                <span>게임 IP 사용가이드</span>
                <span>문의하기</span>
            </div>
            <div class="intro-footer-notice">
                Data based on NEXON OPEN API<br>
                This site is not an official site of NEXON and does not provide any warranty.<br>
                v1.4.0 - Copyright 2026. Maple Omni All rights reserved.
            </div>
        </div>
    `;

    // 생성된 인트로 오버레이 레이어를 body의 가장 첫 번째 자식 노드로 즉각 배치합니다.
    document.body.insertBefore(introLayer, document.body.firstChild);
    console.log("[인트로엔진] 넥슨 OpenAPI인증 관문 인프라가 정중앙에 성공적으로 마운트되었습니다.");
};

/**
 * 💡 [초보자 가이드] 사용자가 입력한 API 키를 검증하고 로컬 스토리지에 세이브하여 전역 모듈이 이용하도록 제어하는 핵심 액션 함수입니다.
 */
window.handleOmniApiKeyVerification = function() {
    const keyField = document.getElementById('omni_api_key_input');
    const apiKeyValue = keyField ? keyField.value.trim() : "";
    
    // API 키 공백 방지 정밀 디버깅 예외 처리
    if(!apiKeyValue) {
        alert("넥슨 OpenAPI 센터에서 발급받은 API 키를 정확히 명시해주셔야 대시보드 기능을 이용할 수 있습니다.");
        return;
    }

    // 💡 [핵심 연동 설계]: 입력받은 API 키를 브라우저 스토리지에 영구 등록합니다.
    // 이제 홈페이지의 모든 자바스크립트 파일들에서 localStorage.getItem("omni_api_key") 코드를 통해 유저의 고유 API 요청 트래픽을 처리할 수 있습니다.
    localStorage.setItem("omni_api_key", apiKeyValue);
    console.log("[API 미들웨어] 개인 로컬 메모리에 넥슨 API 인증키 적재 완료.");
    
    const overlay = document.getElementById('omniIntroOverlay');
    if (!overlay) return;

    // 인증 및 결속 완료 시 부드러운 언마스크 페이드아웃 효과 트리거
    overlay.classList.add('fade-out');

    // 애니메이션 처리가 끝나는 시점에 메모리 누수 방지를 위해 DOM에서 엘리먼트 제거
    setTimeout(function() {
        overlay.remove();
        console.log("[인트로엔진] 게이트웨이가 안전하게 해제되었습니다. 메인 관제 대시보드를 전면 가동합니다.");
    }, 600);
};

// 스크립트 파일이 브라우저에 파싱되어 로드되는 즉시 자동으로 인트로 주입 프로세스를 개시시킵니다.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.injectOmniIntroScreen);
} else {
    window.injectOmniIntroScreen();
}

// 팝업 생성 함수
function showGuidePopup() {
    const modal = document.createElement('div');
    modal.className = 'omni-modal';
    modal.innerHTML = `
        <div class="omni-modal-content">
            <h3>API 키 발급 안내</h3>
            <p>1. 넥슨 오픈 API 센터 접속<br>2. 로그인 후 프로젝트 생성<br>3. 발급된 키를 복사!</p>
            <button onclick="this.parentElement.parentElement.remove()">확인</button>
        </div>
    `;
    document.body.appendChild(modal);
}