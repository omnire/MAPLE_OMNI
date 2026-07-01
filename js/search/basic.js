/**
 * ============================================================================
 * 👤 MAPLE OMNI - js/search/basic.js
 * 설명: 기본 캐릭터 내실 세부 데이터 파서 및 다차원 스텟 그리드 마운트 스크립트
 * 가이드: 초보자도 실시간 스텟 배열에서 손쉽게 데이터를 수확하도록 설계된 유틸 패키지
 * ============================================================================
 */

/**
 * 💡 [초보자 가이드] 수신된 종합 스텟 배열 노드에서 원하는 항목명을 안전하게 탐색해오는 보정 함수입니다.
 * @param {Array} statList - 캐릭터 종합 파싱 결과 최종 스텟 데이터 리스트
 * @param {String} statName - 출력하길 원하는 스텟의 원래 한글 이름
 */
window.getSafeStatValue = function(statList, statName) {
    if (!Array.isArray(statList)) return "-";
    const match = statList.find(s => s.stat_name === statName);
    return match ? match.stat_value : "-";
};

/**
 * 💡 [초보자 가이드] 메인 레이아웃 내부에 추가로 삽입할 디테일 스텟 보정 그리드를 HTML 코드로 구성해줍니다.
 * @param {Array} finalStat - 캐릭터 스텟 정보 노드
 */
window.generateAuxiliaryStatGrid = function(finalStat) {
    const trackingTargets = [
        { title: "💥 크리티컬 데미지", key: "크리티컬 데미지" },
        { title: "😈 보스 공격 데미지", key: "보스 몬스터 공격 시 데미지" },
        { title: "🛡️ 방어율 무시 계수", key: "방어율 무시" },
        { title: "✨ 일반 데미지 비율", key: "데미지" },
        { title: "🎯 크리티컬 확률", key: "크리티컬 확률" },
        { title: "🍀 아이템 드롭 확률", key: "아이템 드롭률" },
        { title: "🪙 메소 획득량 계수", key: "메소 획득량" }
    ];

    let layoutHtml = `<div class="stat-grid-layout-box" style="display:flex; flex-direction:column; gap:8px; width:100%;">`;
    
    trackingTargets.forEach(stat => {
        const val = window.getSafeStatValue(finalStat, stat.key);
        layoutHtml += `
            <div class="stat-grid-item-row" style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; padding:6px 12px; border-radius:8px; font-size: 11.5px;">
                <span style="color: #475569; font-weight: 700;">${stat.title}</span>
                <span style="color: #0f172a; font-weight: 800;">${val}</span>
            </div>
        `;
    });

    layoutHtml += `</div>`;
    return layoutHtml;
};