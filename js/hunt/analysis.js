/**
 * ============================================================================
 * 📉 MAPLE OMNI V14 - features/hunt/analysis.js [완전판 수정 코어]
 * 설명: a is not defined 런타임 크래시 에러를 완전 패치하고 캐릭터 아바타를 복원합니다.
 * ============================================================================
 */

// 전역 차트 및 캐릭터 버퍼 구조 선언 안전필터
if (typeof window.analysisModel === 'undefined') {
    window.analysisModel = {
        currentAvatarUrl: "",
        chartCachedInstance: null
    };
}

/**
 * [초보자 가이드] 1. 옴니 캐릭터 아바타 추적 및 화면 복원 엔진
 * 역할: 넥슨 오픈 API로부터 파싱된 캐릭터 고유 아바타 주소를 캐시에서 불러와 화면에 강제 주입합니다.
 */
window.renderOmniAvatar = function(charId) {
    const idx = parseInt(charId || window.currentIdx || 1);
    const avatarImgElement = document.getElementById(`v14AnalysisAvatar_${idx}`);
    
    if (!avatarImgElement) return;

    // 로컬 스토리지에 보관된 캐릭터 정보 바구니를 확인합니다.
    const savedMeta = JSON.parse(localStorage.getItem(`omni_char_meta_${idx}`) || '{}');
    
    // [보안 필터] 만약 실제 연동된 넥슨 API 아바타 주소가 없다면 기본 버섯 그래픽이나 디폴트 아바타로 복원합니다.
    if (savedMeta.character_image) {
        window.analysisModel.currentAvatarUrl = savedMeta.character_image;
    } else {
        // 임시 테스트용 기본 메이플 아바타 플레이스홀더 주소 매칭
        window.analysisModel.currentAvatarUrl = "https://open.api.nexon.com/static/maplestory/Character/001.png";
    }

    // 화면 이미지 소스에 안전하게 대입
    avatarImgElement.src = window.analysisModel.currentAvatarUrl;
    avatarImgElement.style.display = "block";
    console.log(`[아바타 엔진] 캐릭터 ${idx}번 외형 복원 완료 완료.`);
};

/**
 * [초보자 가이드] 2. 사냥 데이터 누적 집계 계산 트래커
 * 역할: 누적 장부를 읽어와 총 수확량, 평균 수치, 누적 성장 곡선을 산출해 도표 화면에 반영합니다.
 */
window.processGrowthStats = function(charId) {
    const idx = parseInt(charId || window.currentIdx || 1);
    const records = JSON.parse(localStorage.getItem('maple_hunt_records') || '[]');
    
    // 현재 선택한 캐릭터 고유 데이터만 안전하게 필터링합니다.
    const myRecords = records.filter(r => r.charId == idx);

    let totalMeso = 0;
    let totalExp = 0.0;
    let totalGem = 0;
    let totalFrag = 0;

    // [에러 교정 포인트] 이전 코드에서 선언 없이 쓰였던 임의의 알파벳 루프 변수들을 'recordItem'으로 전면 교체
    myRecords.forEach(recordItem => {
        totalMeso += parseInt(String(recordItem.meso).replace(/,/g, "")) || 0;
        totalExp += parseFloat(recordItem.exp) || 0;
        totalGem += parseInt(recordItem.gem) || 0;
        totalFrag += parseInt(recordItem.frag) || 0;
    });

    // 화면 상단 통계 수치 필드 매칭 컴포넌트 이식
    const viewMeso = document.getElementById(`v14_total_meso_${idx}`);
    const viewExp = document.getElementById(`v14_total_exp_${idx}`);
    const viewGem = document.getElementById(`v14_total_gem_${idx}`);
    const viewFrag = document.getElementById(`v14_total_frag_${idx}`);

    if (viewMeso) viewMeso.innerText = totalMeso.toLocaleString() + " 메소";
    if (viewExp)  viewExp.innerText = totalExp.toFixed(3) + "%";
    if (viewGem)  viewGem.innerText = totalGem.toLocaleString() + " 개";
    if (viewFrag) viewFrag.innerText = totalFrag.toLocaleString() + " 개";
};

/**
 * [초보자 가이드] 3. 212라인 런타임 에러 추적 및 이벤트 루프 교정 장치
 * 역할: Uncaught ReferenceError: a is not defined 에러가 발생하던 문제의 핵심 영역입니다.
 *      선언부 바깥에서 핸들러 인자 'a'를 참조하려던 제어구문을 완벽히 교정 차단했습니다.
 */
window.initAnalysisLayoutListeners = function(charId) {
    const idx = parseInt(charId || window.currentIdx || 1);
    const actionBox = document.getElementById(`v14AnalysisRefreshBtn_${idx}`);

    if (!actionBox) return;

    // [완벽 보완] 이벤트 리스너 인풋 파라미터를 'event'로 정확히 명시하고 스코프를 가두었습니다.
    actionBox.addEventListener('click', function(event) {
        // 이전 코드 오류 원인 제거: 'a.preventDefault()' 형태로 undeclared 참조하던 버그 완전 패치
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        
        console.log("[분석엔진] 유저 수동 리프레시 시그널 감지. 데이터 재정렬을 시작합니다.");
        
        // 데이터 및 캐릭터 외형 실시간 동시 복구 재구동
        window.processGrowthStats(idx);
        window.renderOmniAvatar(idx);
    });
};

/**
 * [초보자 가이드] 4. 성장분석 페이지 통합 초기화 마운트 (`window.renderAnalysisPage`)
 */
window.renderAnalysisPage = function() {
    const container = document.getElementById('hunt-analysis');
    if (!container) return;

    const currentTabIdx = parseInt(window.currentIdx) || 1;

    // 미니멀리즘 가로형 프레임워크 규격 구조 생성
    container.innerHTML = `
        <div class="v14-plate-card" style="margin: 10px;">
            <div class="v14-plate-header" style="justify-content: space-between;">
                <span>📊 누적 성장분석 리포트</span>
                <button type="button" id="v14AnalysisRefreshBtn_${currentTabIdx}" style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:3px 8px; font-size:10px; font-weight:bold; cursor:pointer;">🔄 동기화 새로고침</button>
            </div>
            
            <div style="display: flex; gap: 20px; align-items: center; background: #f8fafc; border-radius: 14px; padding: 15px;">
                <!-- 🖼️ 옴니 아바타 렌더링 스페이스 (실종 상태 복원 완료) -->
                <div style="width: 90px; height: 90px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <img id="v14AnalysisAvatar_${currentTabIdx}" src="" alt="Character Avatar" style="width: 100%; height: auto; display: none;" />
                </div>
                
                <!-- 대형 지표 그리드 표기 구역 -->
                <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 11px;">
                    <div>💰 총 누적 메소: <b id="v14_total_meso_${currentTabIdx}" style="font-size:12px; color:#b45309;">0 메소</b></div>
                    <div>📈 총 누적 경험치: <b id="v14_total_exp_${currentTabIdx}" style="font-size:12px; color:#6d28d9;">0.000%</b></div>
                    <div>🔮 총 누적 젬스톤: <b id="v14_total_gem_${currentTabIdx}" style="font-size:12px; color:#0369a1;">0 개</b></div>
                    <div>✨ 총 누적 에르다 조각: <b id="v14_total_frag_${currentTabIdx}" style="font-size:12px; color:#be123c;">0 개</b></div>
                </div>
            </div>
        </div>
    `;

    // 컴포넌트 마운트 즉시 하위 기어 자동 인젝션
    window.processGrowthStats(currentTabIdx);
    window.renderOmniAvatar(currentTabIdx);
    window.initAnalysisLayoutListeners(currentTabIdx);
};

// 최초 DOM 로드 시 바인딩 감지 자동 시작 처리
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('hunt-analysis')) {
        window.renderAnalysisPage();
    }
});