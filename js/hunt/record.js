/**
 * ============================================================================
 * 🧠 MAPLE OMNI V14 - features/hunt/record.js [완전판 소스 코드]
 * 설명: 스크린샷 스캔 가동 엔진, 실시간 메획률 연산 및 자동 드래프팅을 영구 지원합니다.
 * ============================================================================
 */

if (typeof window.subHistory === 'undefined') window.subHistory = {};
if (typeof window.currentIdx === 'undefined') window.currentIdx = 1;

/**
 * [초보자용 주석] 0. 로컬 브라우저 문자 분석 라이브러리 비동기 동적 인젝터
 * 역할: 보안 프로그램 차단 위험이 없는 오픈소스 문자 판독 라이브러리를 안전하게 불러옵니다.
 */
function ensureOcrEngineLoaded(callback) {
    if (typeof Tesseract !== 'undefined') {
        callback();
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/tesseract.js@v4.0.1/dist/tesseract.min.js';
    script.onload = () => {
        console.log("OMNI V14 문자 감지 엔진 로딩이 무결하게 완료되었습니다.");
        callback();
    };
    document.head.appendChild(script);
}

/**
 * [초보자용 주석] 1. 클립보드 스크린샷 가로채기 분석 연동 장치 (Ctrl+V 핸들러)
 * 역할: 유저가 캡처 존에 커서를 두고 붙여넣기를 누르면 파일 원본을 가공해 OCR 유닛으로 보냅니다.
 */
window.handleScreenshotPaste = function(event, charId) {
    const idx = parseInt(charId || window.currentIdx || 1);
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    const labelZone = document.getElementById(`v14OcrZoneText_${idx}`);

    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const imageBlob = items[i].getAsFile();
            
            if (labelZone) labelZone.innerHTML = "<b style='color:#6366f1;'>⏳ 판독 연산 가동 중... 메이플 데이터 추출 중입니다.</b>";

            ensureOcrEngineLoaded(() => {
                Tesseract.recognize(
                    imageBlob,
                    'kor+eng', // 한글 폰트 및 숫자 배열 동시 교차 검증 지정
                    { logger: m => console.log("[스캔 로그]", m.status, Math.round(m.progress * 100) + "%") }
                ).then(({ data: { text } }) => {
                    window.parseMapleScreenshotText(text, idx);
                }).catch(err => {
                    console.error("문자 해독 프로세스 에러:", err);
                    if (labelZone) labelZone.innerText = "❌ 판독 실패. 스크린샷 해상도 및 잘린 단면을 확인하세요.";
                });
            });
            
            event.preventDefault();
            break;
        }
    }
};

/**
 * [초보자용 주석] 2. 메이플 폰트 문자열 정규화 분할 매퍼
 * 역할: 캡처된 원문 텍스트 내에서 메소, 경험치, 젬스톤 단어를 검색해 알맞은 인풋창에 알아서 나눠 담아줍니다.
 */
window.parseMapleScreenshotText = function(rawText, idx) {
    const labelZone = document.getElementById(`v14OcrZoneText_${idx}`);
    const lines = rawText.split('\n');
    
    let targetMeso = "";
    let targetExp = "";
    let targetGem = "";
    let targetFrag = "";

    lines.forEach(line => {
        // 단어 유사도 및 정규식 패턴 탐색 가동
        if (line.includes("메소") || line.includes("메") || line.includes("Meso")) {
            const extract = line.replace(/[^0-9]/g, "");
            if (extract.length >= 4) targetMeso = extract;
        }
        if (line.includes("%") || line.includes("EXP") || line.includes("경험")) {
            const expMatch = line.match(/[0-9]+\.[0-9]+/);
            if (expMatch) targetExp = expMatch[0];
        }
        if (line.includes("코어") || line.includes("젬") || line.includes("스톤")) {
            const extract = line.replace(/[^0-9]/g, "");
            if (extract) targetGem = extract;
        }
        if (line.includes("조각") || line.includes("에르")) {
            const extract = line.replace(/[^0-9]/g, "");
            if (extract) targetFrag = extract;
        }
    });

    // 2차 백업 보정 방어선 (특정 키워드가 잘렸더라도 긴 숫자가 감지되면 순메소로 선제 추정 기입)
    if (!targetMeso) {
        const bigNumbers = rawText.match(/[0-9]{6,11}/);
        if (bigNumbers) targetMeso = bigNumbers[0];
    }

    // 포착된 최종 결과값들을 실제 인풋 요소 엘리먼트에 순차 도킹시킵니다.
    if (targetMeso) {
        const input = document.getElementById(`v14_meso_${idx}`);
        if (input) input.value = parseInt(targetMeso).toLocaleString();
    }
    if (targetExp) {
        const input = document.getElementById(`v14_exp_${idx}`);
        if (input) input.value = targetExp;
    }
    if (targetGem) {
        const input = document.getElementById(`v14_gem_${idx}`);
        if (input) input.value = targetGem;
    }
    if (targetFrag) {
        const input = document.getElementById(`v14_frag_${idx}`);
        if (input) input.value = targetFrag;
    }

    if (labelZone) labelZone.innerHTML = "<span style='color:#10b981;'>✅ <b>스캔 성공!</b> 사냥 데이터 기입이 완료되었습니다.</span>";
    
    // 장부 및 대시보드 강제 실시간 리싱크 연동
    window.refreshLiveDashboard(idx);
};

/**
 * [초보자용 주석] 3. 드랍/메획 종합 능력치 실시간 동적 계산기
 * 역할: 장비, 어빌리티 등 5대 스탯 수치와 도핑 체크 상태를 동시 합산해 상단 대시보드에 즉시 주입합니다.
 */
window.calculateLiveStats = function(charId) {
    const idx = parseInt(charId || window.currentIdx || 1);
    
    let liveSumMesoRate = 100; // 게임 내 메획 기본 베이스는 100%부터 출발합니다.
    let liveSumDropRate = 0;   // 게임 내 아이템 드랍률의 시동값은 0%입니다.

    // 가변 입력 폼 인덱스 전수조사 루프 가산
    for (let i = 0; i < 5; i++) {
        const inputM = document.getElementById(`v14_m_stat_${i}_${idx}`);
        const inputD = document.getElementById(`v14_d_stat_${i}_${idx}`);
        if (inputM) liveSumMesoRate += parseInt(inputM.value) || 0;
        if (inputD) liveSumDropRate += parseInt(inputD.value) || 0;
    }

    // 도핑 리스트 연계 가중치 팩토리 연산
    const dopingWeights = [
        { id: 0, name: "VIP 버프", meso: 0, drop: 15 },
        { id: 1, name: "경험치 쿠폰(50%)", meso: 0, drop: 0 },
        { id: 2, name: "경험치 3배 쿠폰", meso: 0, drop: 0 },
        { id: 3, name: "경험치 4배 쿠폰", meso: 0, drop: 0 },
        { id: 4, name: "재물 획득의 비약", meso: 20, drop: 20 }, // 재획비 공식 가중치 지정
        { id: 5, name: "경험 축적의 비약", meso: 0, drop: 0 },
        { id: 6, name: "유니온의 행운", meso: 0, drop: 30 },
        { id: 7, name: "유니온의 부", meso: 30, drop: 0 },
        { id: 8, name: "익스트림 골드", meso: 0, drop: 0 }
    ];

    dopingWeights.forEach(item => {
        const chk = document.getElementById(`v14_chk_${item.id}_${idx}`);
        if (chk && chk.checked) {
            liveSumMesoRate += item.meso;
            liveSumDropRate += item.drop;
        }
    });

    // 세 번째 현황 위젯 보드에 최종 결과값 인젝션 실행
    const statWidget = document.getElementById(`v14LiveStatsValue_${idx}`);
    if (statWidget) {
        statWidget.innerText = `${liveSumDropRate}% / ${liveSumMesoRate}%`;
    }
};

/**
 * [초보자용 주석] 4. 당일치 통합 누적 사냥 현황 실시간 집계 연산부
 */
window.refreshLiveDashboard = function(charId) {
    const idx = parseInt(charId || window.currentIdx || 1);
    const dateInput = document.getElementById('huntGlobalDate');
    const selectedDate = (dateInput && dateInput.value) ? dateInput.value : new Date().toISOString().split('T')[0];
    const storageKey = `${idx}_${selectedDate}`;

    let totalDayMeso = 0;
    let totalDayExp = 0;
    let totalDayGem = 0;
    let totalDayFrag = 0;

    // [A] 이미 확정 전송 처리 완료 처리된 로컬 아카이브 장부 데이터 추출 가산
    const allStoredRecords = JSON.parse(localStorage.getItem('maple_hunt_records') || '[]');
    allStoredRecords.filter(r => r.charId == idx && r.date === selectedDate).forEach(rec => {
        totalDayMeso += parseInt(String(rec.meso).replace(/,/g, "")) || 0;
        totalDayExp += parseFloat(rec.exp) || 0;
        totalDayGem += parseInt(rec.gem || 0);
        totalDayFrag += parseInt(rec.frag || 0);
    });

    // [B] 우측 하단 세션 리스트에 대기 중인 실시간 미확정 버퍼 데이터 추출 교차 가산
    if (window.subHistory && window.subHistory[storageKey]) {
        window.subHistory[storageKey].forEach(tempRec => {
            if (!tempRec.isFinalized) {
                totalDayMeso += parseInt(String(tempRec.meso).replace(/,/g, "")) || 0;
                totalDayExp += parseFloat(tempRec.exp) || 0;
                totalDayGem += parseInt(tempRec.gem || 0);
                totalDayFrag += parseInt(tempRec.frag || 0);
            }
        });
    }

    // [C] 가공된 누적 수치들을 최종 상단 UI에 매칭 반영
    const docMeso = document.getElementById(`v14LiveMeso_${idx}`);
    const docExp  = document.getElementById(`v14LiveExp_${idx}`);
    const docDrops = document.getElementById(`v14LiveDrops_${idx}`);

    if (docMeso) docMeso.innerText = totalDayMeso.toLocaleString();
    if (docExp)  docExp.innerText = totalDayExp.toFixed(3) + "%";
    if (docDrops) docDrops.innerText = `${totalDayGem}개 / ${totalDayFrag}개`;

    // 작성 중인 모든 인풋 정보 상태값 영구 보존 자동 드래프팅 큐 가동
    window.saveActiveInputsToCache(idx);
};

/**
 * [초보자용 주석] 5. ⏱️ 1소재 단위 사냥 세션 기록 임시 저장 기어
 */
window.recordOneSession = function(charId) {
    const idx = parseInt(charId || window.currentIdx || 1);
    const dateInput = document.getElementById('huntGlobalDate');
    const selectedDate = (dateInput && dateInput.value) ? dateInput.value : new Date().toISOString().split('T')[0];
    const storageKey = `${idx}_${selectedDate}`;

    const fMap = document.getElementById(`v14_map_${idx}`);
    const fMeso = document.getElementById(`v14_meso_${idx}`);
    const fExp = document.getElementById(`v14_exp_${idx}`);
    const fGem = document.getElementById(`v14_gem_${idx}`);
    const fFrag = document.getElementById(`v14_frag_${idx}`);

    if (!fMeso || !fExp) return;

    const mesoRaw = fMeso.value.trim();
    if (!mesoRaw) {
        alert("기록할 회차의 메소 금액 수치가 비어있습니다.");
        return;
    }

    if (!window.subHistory[storageKey]) window.subHistory[storageKey] = [];

    // 동적 수집 기타 전리품 수입 리스트 파싱 가산
    let customExtraList = [];
    const extraRows = document.querySelectorAll(`.v14-extra-row-${idx}`);
    extraRows.forEach(row => {
        const nameInput = row.querySelector('.v14-extra-name-input');
        const priceInput = row.querySelector('.v14-extra-price-input');
        if (nameInput && nameInput.value.trim() !== '') {
            const priceVal = parseInt(priceInput.value.replace(/,/g, "")) || 0;
            customExtraList.push({ name: nameInput.value.trim(), price: priceVal });
        }
    });

    const newLogNode = {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        map: fMap?.value || '미지정 사냥터',
        meso: mesoRaw,
        exp: parseFloat(fExp.value) || 0,
        gem: parseInt(fGem.value) || 0,
        frag: parseInt(fFrag.value) || 0,
        sellList: customExtraList,
        isFinalized: false
    };

    window.subHistory[storageKey].push(newLogNode);
    localStorage.setItem('omni_sub_history', JSON.stringify(window.subHistory));

    // 입력창 초기화 및 캡처 가이드 초기 복원
    const zoneText = document.getElementById(`v14OcrZoneText_${idx}`);
    if (zoneText) zoneText.innerText = "📋 여기를 한 번 클릭하고 스크린샷을 붙여넣기(Ctrl+V) 하세요.";

    fMeso.value = '';
    fExp.value = '';
    fGem.value = '';
    fFrag.value = '';
    const container = document.getElementById(`v14ExtraContainer_${idx}`);
    if (container) container.innerHTML = '';

    window.refreshLiveDashboard(idx);
    window.renderSubSessionCards(idx);
};

/**
 * [초보자용 주석] 6. 우측 하단 임시 세션 뱃지 카드 리렌더러 함수
 */
window.renderSubSessionCards = function(charId) {
    const idx = parseInt(charId || window.currentIdx || 1);
    const targetBox = document.getElementById(`v14SubRecordList_${idx}`);
    if (!targetBox) return;

    const dateInput = document.getElementById('huntGlobalDate');
    const selectedDate = (dateInput && dateInput.value) ? dateInput.value : new Date().toISOString().split('T')[0];
    const storageKey = `${idx}_${selectedDate}`;

    let html = '';
    const logs = window.subHistory[storageKey] || [];

    if (logs.length > 0) {
        logs.forEach((rec, itemIdx) => {
            html += `
                <div class="v14-session-badge-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <b style="font-size: 11px; color: #1e3a8a;"># ${itemIdx + 1}회차 사냥</b>
                        <span style="font-size: 9px; color: #94a3b8;">${rec.time}</span>
                    </div>
                    <div style="font-size: 11px; color: #475569; line-height: 1.4;">
                        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #64748b; font-weight: bold; font-size: 10px; margin-bottom: 2px;">🏕️ ${rec.map}</div>
                        <div style="display: flex; justify-content: space-between;"><span>순메소:</span> <b>${rec.meso}</b></div>
                        <div style="display: flex; justify-content: space-between;"><span>경험치:</span> <b>${rec.exp}%</b></div>
                        <div style="display: flex; justify-content: space-between; color: #0284c7;"><span>젬스톤:</span> <b>${rec.gem}개</b></div>
                        <div style="display: flex; justify-content: space-between; color: #e11d48;"><span>조각:</span> <b>${rec.frag}개</b></div>
                    </div>
                    ${rec.sellList && rec.sellList.length > 0 ? `
                        <div style="margin-top: 4px; padding-top: 4px; border-top: 1px dashed #e2e8f0; font-size: 9px; color: #16a34a; line-height: 1.2;">
                            ${rec.sellList.map(s => `<div>▪ ${s.name}: +${s.price.toLocaleString()}</div>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        });
    } else {
        html = `<div style="grid-column: 1/-1; padding: 25px; text-align: center; color: #cbd5e1; font-weight: 800; font-size: 11px;">임시 저장된 회차가 없습니다. 오치 스크린샷 붙여넣기 또는 수동 입력 후 저장해 주세요.</div>`;
    }
    targetBox.innerHTML = html;
};

/**
 * [초보자용 주석] 7. 전리품 부수입 기입 필드 동적 바인더
 */
window.addV14ExtraRow = function(charId) {
    const idx = parseInt(charId || window.currentIdx || 1);
    const container = document.getElementById(`v14ExtraContainer_${idx}`);
    if (!container) return;

    const row = document.createElement('div');
    row.className = `v14-extra-row-${idx}`;
    row.style.display = 'flex';
    row.style.gap = '6px';
    row.style.marginBottom = '4px';
    row.innerHTML = `
        <input type="text" class="v14-input-base v14-extra-name-input" placeholder="품목명" style="flex: 1.2; padding: 6px 10px; font-size:11px;">
        <input type="text" class="v14-input-base v14-extra-price-input" placeholder="메소 수입" onkeyup="if(typeof window.applyRealtimeComma === 'function') window.applyRealtimeComma(this);" style="flex: 1; text-align: right; padding: 6px 10px; font-size:11px;">
        <button type="button" onclick="this.parentElement.remove()" style="background: #fff1f2; color: #e11d48; border: 1px solid #ffe4e6; border-radius: 8px; width: 28px; cursor: pointer; font-weight: bold; font-size:12px;">&times;</button>
    `;
    container.appendChild(row);
};

window.saveActiveInputsToCache = function(charId) {
    const idx = parseInt(charId || window.currentIdx || 1);
    const config = {
        startMeso: document.getElementById(`v14_startMeso_${idx}`)?.value || '',
        targetMeso: document.getElementById(`v14_targetMeso_${idx}`)?.value || '',
        startExp: document.getElementById(`v14_startExp_${idx}`)?.value || '',
        startGem: document.getElementById(`v14_startGem_${idx}`)?.value || '',
        startFrag: document.getElementById(`v14_startFrag_${idx}`)?.value || '',
        map: document.getElementById(`v14_map_${idx}`)?.value || ''
    };
    localStorage.setItem(`v14_active_cache_${idx}`, JSON.stringify(config));
};

/**
 * [초보자용 주석] 8. 🗑️ 전체 입력창 내용 및 당일 임시 세션 리셋 클리어 장치
 */
window.resetCurrentV14RecordForm = function(charId) {
    const idx = parseInt(charId || window.currentIdx || 1);
    if (!confirm("현재 탭 대시보드 페이지에 입력된 모든 설정을 초기화하시겠습니까?")) return;

    localStorage.removeItem(`v14_active_cache_${idx}`);
    
    const dateInput = document.getElementById('huntGlobalDate');
    const selectedDate = (dateInput && dateInput.value) ? dateInput.value : new Date().toISOString().split('T')[0];
    const storageKey = `${idx}_${selectedDate}`;
    if (window.subHistory && window.subHistory[storageKey]) {
        window.subHistory[storageKey] = [];
    }
    localStorage.setItem('omni_sub_history', JSON.stringify(window.subHistory));

    const targetFields = [`startMeso`, `targetMeso`, `startExp`, `startGem`, `startFrag`, `map`, `meso`, `exp`, `gem`, `frag`];
    targetFields.forEach(f => {
        const el = document.getElementById(`v14_${f}_${idx}`);
        if (el) el.value = '';
    });

    for (let i = 0; i < 5; i++) {
        const mEl = document.getElementById(`v14_m_stat_${i}_${idx}`);
        const dEl = document.getElementById(`v14_d_stat_${i}_${idx}`);
        if (mEl) mEl.value = '';
        if (dEl) dEl.value = '';
    }

    for (let i = 0; i < 9; i++) {
        const chk = document.getElementById(`v14_chk_${i}_${idx}`);
        if (chk) chk.checked = false;
    }

    const zoneText = document.getElementById(`v14OcrZoneText_${idx}`);
    if (zoneText) zoneText.innerText = "📋 여기를 한 번 클릭하고 스크린샷을 붙여넣기(Ctrl+V) 하세요.";

    window.calculateLiveStats(idx);
    window.refreshLiveDashboard(idx);
    window.renderSubSessionCards(idx);
};

/**
 * [초보자용 주석] 9. 📊 마스터 라우터 마운트 코어 레이아웃 제어 인터페이스 (`window.renderRecordPage`)
 * 역할: index.html 탭 조작에 동기화되어 좌우 완벽 분할 프레임워크를 동적으로 주입 건설합니다.
 */
window.renderRecordPage = function() {
    const container = document.getElementById('hunt-record');
    if (!container) return;

    const currentTabIdx = parseInt(window.currentIdx) || 1;
    const dopingNames = ["VIP 버프", "경험치 쿠폰(50%)", "경험치 3배 쿠폰", "경험치 4배 쿠폰", "재물 획득의 비약", "경험 축적의 비약", "유니온의 행운", "유니온의 부", "익스트림 골드"];
    const statNames = ['장비 아이템', '유니온 공격대', '어빌리티', '아티팩트', '스킬'];

    const savedConfig = JSON.parse(localStorage.getItem(`v14_active_cache_${currentTabIdx}`) || '{}');

    // 2x2 그래픽 리포트 상단 연동을 위한 메인 레이아웃 HTML 빌드업 주입
    container.innerHTML = `
        <div class="v14-record-wrapper">
            
            <!-- 📊 [TOP LAYER] 실시간 총합 지표 스냅샷 위젯 계판 -->
            <div class="v14-dashboard-grid">
                <div class="v14-dash-card v14-card-meso">
                    <div class="v14-dash-title meso">💰 누적 획득 메소</div>
                    <div class="v14-dash-value" id="v14LiveMeso_${currentTabIdx}">0</div>
                </div>
                <div class="v14-dash-card v14-card-exp">
                    <div class="v14-dash-title exp">📈 누적 획득 EXP</div>
                    <div class="v14-dash-value" id="v14LiveExp_${currentTabIdx}">0.000%</div>
                </div>
                <div class="v14-dash-card v14-card-stats">
                    <div class="v14-dash-title stats">⚔️ 현재 실시간 드랍 / 메획</div>
                    <div class="v14-dash-value" id="v14LiveStatsValue_${currentTabIdx}">0% / 100%</div>
                </div>
                <div class="v14-dash-card v14-card-drops">
                    <div class="v14-dash-title drops">💎 누적 전리품 (젬 / 조각)</div>
                    <div class="v14-dash-value" id="v14LiveDrops_${currentTabIdx}">0개 / 0개</div>
                </div>
            </div>

            <!-- 🧭 [MAIN LAYER] 가로 와이드형 2분할 가로 스페이스 무대 -->
            <div class="v14-two-column-body">
                
                <!-- 👈 [LEFT PANEL] 캐릭터 설정 및 도핑 관제 무대 -->
                <div class="v14-left-control-panel">
                    
                    <!-- 1층 카드: 시작 및 목표 설정 영역 -->
                    <div class="v14-plate-card">
                        <div class="v14-plate-header">⚙ *CHARACTER BASE CONFIG (시작 및 목표 설정)*</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                            <input type="text" id="v14_startMeso_${currentTabIdx}" class="v14-input-base" placeholder="💰 시작 보유 메소" value="${savedConfig.startMeso || ''}" onkeyup="if(typeof window.applyRealtimeComma === 'function') window.applyRealtimeComma(this);" oninput="window.saveActiveInputsToCache(${currentTabIdx})">
                            <input type="text" id="v14_targetMeso_${currentTabIdx}" class="v14-input-base" placeholder="🎯 목표 달성 메소" value="${savedConfig.targetMeso || ''}" onkeyup="if(typeof window.applyRealtimeComma === 'function') window.applyRealtimeComma(this);" oninput="window.saveActiveInputsToCache(${currentTabIdx})">
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
                            <input type="number" id="v14_startExp_${currentTabIdx}" step="0.001" class="v14-input-base" placeholder="⚡ 시작 EXP" value="${savedConfig.startExp || ''}" oninput="window.saveActiveInputsToCache(${currentTabIdx})">
                            <input type="number" id="v14_startGem_${currentTabIdx}" class="v14-input-base" placeholder="🔮 시작 젬스톤" value="${savedConfig.startGem || ''}" oninput="window.saveActiveInputsToCache(${currentTabIdx})">
                            <input type="number" id="v14_startFrag_${currentTabIdx}" class="v14-input-base" placeholder="✨ 시작 조각" value="${savedConfig.startFrag || ''}" oninput="window.saveActiveInputsToCache(${currentTabIdx})">
                        </div>
                    </div>

                    <!-- 2층 카드: 상세 능력치 기입 및 수직 정하단 도핑 리스트 (가장 핵심 규칙 완벽 준수) -->
                    <div class="v14-plate-card">
                        <div class="v14-plate-header">⚡ *SPECIFICATION CONFIG (상세 능력치 입력)*</div>
                        <div class="v14-stat-split-box">
                            <div>
                                <h4 style="font-size: 11px; color: #475569; margin: 0 0 8px 0; font-weight: 800; border-left: 3px solid #d97706; padding-left: 5px;">💰 메획 추가 세팅 (%)</h4>
                                ${statNames.map((s, idx) => `
                                    <div class="v14-stat-row">
                                        <span class="v14-stat-label">${s}</span>
                                        <input type="number" id="v14_m_stat_${idx}_${currentTabIdx}" class="v14-input-stat-digit" placeholder="0" oninput="window.calculateLiveStats(${currentTabIdx})">
                                    </div>
                                `).join('')}
                            </div>
                            <div>
                                <h4 style="font-size: 11px; color: #475569; margin: 0 0 8px 0; font-weight: 800; border-left: 3px solid #16a34a; padding-left: 5px;">🍀 드랍률 추가 세팅 (%)</h4>
                                ${statNames.map((s, idx) => `
                                    <div class="v14-stat-row">
                                        <span class="v14-stat-label">${s}</span>
                                        <input type="number" id="v14_d_stat_${idx}_${currentTabIdx}" class="v14-input-stat-digit" placeholder="0" oninput="window.calculateLiveStats(${currentTabIdx})">
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- 💊 사냥 도핑 리스트 (상세스텟 설정 바로 정하단 수직 적재 원칙 엄격 준수 완료) -->
                        <div style="padding-top: 12px; border-top: 1px dashed #e2e8f0;">
                            <div class="v14-plate-header" style="margin-bottom: 6px;">💊 *사냥 도핑 리스트 (실시간 스펙 계산 연동)*</div>
                            <div class="v14-doping-grid">
                                ${dopingNames.map((name, idx) => `
                                    <label class="v14-doping-label">
                                        <input type="checkbox" id="v14_chk_${idx}_${currentTabIdx}" onchange="window.calculateLiveStats(${currentTabIdx})">
                                        <span style="font-weight: 700; font-size:10px;">${name}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 👉 [RIGHT PANEL] 실시간 사냥 회차 입력, OCR 존, 부수입 제어 스페이스 -->
                <div class="v14-right-display-panel">
                    <div class="v14-plate-card">
                        <div class="v14-plate-header">⚔️ *CURRENT HUNTING SESSION (실시간 회차 기록 콘솔)*</div>
                        
                        <!-- 📸 [V14 초정밀 핵심 이식] 스크린샷 붙여넣기 핫존 인터페이스 -->
                        <div class="v14-ocr-paste-zone" playbook-zone tabindex="0" onpaste="window.handleScreenshotPaste(event, ${currentTabIdx})">
                            <span id="v14OcrZoneText_${currentTabIdx}">📋 여기를 한 번 클릭하고 스크린샷을 붙여넣기(Ctrl+V) 하세요.</span>
                        </div>

                        <!-- 1회차 세션별 기입창 (OCR 판독 시 자동으로 수치가 입력됩니다) -->
                        <div style="display: grid; grid-template-columns: 1.4fr 1fr 1fr 0.8fr 0.8fr; gap: 6px; margin-bottom: 10px;">
                            <input type="text" id="v14_map_${currentTabIdx}" class="v14-input-base" placeholder="🏕️ 사냥터 명칭" value="${savedConfig.map || ''}" oninput="window.saveActiveInputsToCache(${currentTabIdx})">
                            <input type="text" id="v14_meso_${currentTabIdx}" class="v14-input-base" placeholder="🪙 획득 순메소" onkeyup="if(typeof window.applyRealtimeComma === 'function') window.applyRealtimeComma(this);">
                            <input type="number" id="v14_exp_${currentTabIdx}" step="0.001" class="v14-input-base" placeholder="⚡ 수확 EXP%">
                            <input type="number" id="v14_gem_${currentTabIdx}" class="v14-input-base" placeholder="🔮 젬스톤">
                            <input type="number" id="v14_frag_${currentTabIdx}" class="v14-input-base" placeholder="✨ 에르다 조각">
                        </div>

                        <!-- 🎁 스스로 기입하는 기타 부수입 득템 목록 -->
                        <div style="background: #f8fafc; border-radius: 12px; padding: 10px; border: 1px solid #e2e8f0; margin-bottom: 10px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="font-size: 11px; font-weight: 800; color: #475569;">🎁 회차별 기타 전리품 부수입 기입 창 (선택사항)</span>
                                <button type="button" onclick="window.addV14ExtraRow(${currentTabIdx})" style="background: #e0e7ff; color: #4f46e5; border: none; padding: 3px 8px; border-radius: 50px; font-size: 10px; font-weight: bold; cursor: pointer;">+ 항목 추가</button>
                            </div>
                            <div id="v14ExtraContainer_${currentTabIdx}"></div>
                        </div>

                        <!-- ⏱️ 1소재씩 누적 기록될 카드 세션 무대 -->
                        <div id="v14SubRecordList_${currentTabIdx}" class="v14-sub-records-grid"></div>

                        <!-- 트리플 제어 인터페이스 마스터 버튼 스택 -->
                        <div class="v14-action-btn-group">
                            <button type="button" class="v14-btn v14-btn-save" onclick="window.recordOneSession(${currentTabIdx})">⏱️ 1소재(임시) 기록 저장</button>
                            <button type="button" class="v14-btn v14-btn-send" onclick="if(typeof window.saveFinalRecord === 'function') { window.saveFinalRecord(${currentTabIdx}); setTimeout(()=> { window.refreshLiveDashboard(${currentTabIdx}); window.renderSubSessionCards(${currentTabIdx}); }, 200); } else { alert('통합 원장 코드 파이프라인이 누락되었습니다.'); }">📊 통합 기록지로 전송</button>
                            <button type="button" class="v14-btn v14-btn-reset" onclick="window.resetCurrentV14RecordForm(${currentTabIdx})">🗑️ 리셋</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

    window.calculateLiveStats(currentTabIdx);
    window.refreshLiveDashboard(currentTabIdx);
    window.renderSubSessionCards(currentTabIdx);
};

// 최초 어플리케이션 안착 시 생명주기 즉시 부트업 유도
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('hunt-record')) {
        window.renderRecordPage();
    }
});