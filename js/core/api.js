/**
 * ============================================================================
 * 🌐 MAPLE OMNI V14 - js/core/api.js [SMART CACHING LIVE USER ENGINE]
 * 설명: 트래픽 과부하 방지용 전역 로컬 스토리지 캐시 관리 및 실제 동일 직업 유저 파싱 커널
 * 가이드: 초보자도 비동기 수집 흐름과 필터링 연산을 직관적으로 이해하도록 상세 주석 처리
 * ============================================================================
 */

// 💡 [초보자 가이드] 파싱 완료된 실시간 인게임 검색 패킷을 브라우저 전역에 보존하는 코어 메모리 저장소입니다.
window.currentSearchData = null;

// 🛡️ [중복 요청 방어벽] 현재 API 통신이 수행 중인지 여부를 기록하는 글로벌 플래그입니다.
window.isOmniSearching = false;

// 🔑 넥슨 OpenAPI 마스터 인증키 및 베이스 주소 고정
const NEXON_API_KEY = "test_b4b72659365dd8f8e050630f7d05b6098575a130c43c81be285680f4ee2c14a7efe8d04e6d233bd35cf2fabdeb93fb0d";
const NEXON_BASE_URL = "https://open.api.nexon.com";

/**
 * 💡 [초보자 가이드] 메이플스토리 OpenAPI 검색에 필요한 날짜 포맷(yyyy-mm-dd)을 연산합니다.
 */
window.getOmniCustomTargetDate = function(daysAgo = 1) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    
    return `${yyyy}-${mm}-${dd}`;
};

/**
 * 💡 [초보자 가이드] 넥슨 서버 트래픽 과부하 에러(429)를 우회하기 위한 미세 딜레이 타이머입니다.
 */
const omniApiSleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 🛡️ [중앙 집중형 단일 비동기 통신 커널]
 */
window.fetchFromNexon = async function(endpoint, queryParams = {}) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value);
        }
    }
    
    const queryString = searchParams.toString();
    const fullUrl = NEXON_BASE_URL + "/maplestory/v1" + endpoint + (queryString ? '?' + queryString : '');
    
    const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
            "accept": "application/json",
            "x-nxopen-api-key": NEXON_API_KEY
        }
    });

    if (!response.ok) {
        const errorPacket = new Error(`Nexon API Error Status: ${response.status}`);
        errorPacket.status = response.status;
        throw errorPacket;
    }

    return await response.json();
};

window.MapleApiHub = {
    async getAccountCharacterList(ouid) { return await window.fetchFromNexon("/character/list", { ouid : ouid }); },
    async getCharacterOcid(characterName) { return await window.fetchFromNexon("/id", { character_name: characterName }); },
    async getUnionInfo(ocid, confirmedDate) { return await window.fetchFromNexon("/user/union", { ocid: ocid, date: confirmedDate }); },
    async getGuildId(guildName, worldName) { return await window.fetchFromNexon("/guild/id", { guild_name: guildName, world_name: worldName }); },
    async getTrainingRoomReplayId(ocid, confirmedDate) { return await window.fetchFromNexon("/character/training-room/replay-id", { id: ocid, date: confirmedDate }); },
    async getStarforceHistory(count = 10) { return await window.fetchFromNexon("/history/starforce", { count: count }); },
    async getAccountOuid() { return await window.fetchFromNexon("/ouid"); },
    async getPotentialHistory(count = 10) { return await window.fetchFromNexon("/history/potential", { count: count }); },
    async getCubeHistory(count = 10) { return await window.fetchFromNexon("/history/cube", { count: count }); },
    async getSchedulerStatus(ocid, confirmedDate) { return await window.fetchFromNexon("/character/state", { ocid: ocid, date: confirmedDate }); },
    async getOverallRanking(confirmedDate, page = 1, characterClass = "") { 
        const params = { date: confirmedDate, page: page };
        if (characterClass) params.character_class = characterClass;
        return await window.fetchFromNexon("/ranking/overall", params); 
    },
    async getRecentNotices() { return await window.fetchFromNexon("/notice"); }
};

/**
 * 🚀 [실제 일반 유저 동적 발굴 엔진]
 * 설명: 가짜 데이터(더미)를 일체 배제하고 랭킹 데이터베이스에서 실존 유저만 정밀 연계 수집합니다.
 */
window.fetchLiveRivalsByClass = async function(targetClass, confirmedDate, myPowerValue = 0) {
    console.log(`[OMNI SYSTEM] [${targetClass}] 직업군 실시간 랭킹 연계 수집 시동...`);
    try {
        let safeRankingDate = confirmedDate;
        if (safeRankingDate === window.getOmniCustomTargetDate(0)) {
            safeRankingDate = window.getOmniCustomTargetDate(1);
        }

        const rivalList = [];
        const targetPages = [1, 2, 3, 4]; 

        for (const pageNum of targetPages) {
            if (rivalList.length >= 6) break;

            await omniApiSleep(200);
            const rankingData = await window.MapleApiHub.getOverallRanking(safeRankingDate, pageNum, targetClass).catch(() => null);
            if (!rankingData || !rankingData.ranking) continue;

            for (const ranker of rankingData.ranking) {
                if (rivalList.length >= 6) break;

                await omniApiSleep(200);
                try {
                    const rOcidData = await window.MapleApiHub.getCharacterOcid(ranker.character_name).catch(() => null);
                    if (!rOcidData || !rOcidData.ocid) continue;

                    const rStat = await window.fetchFromNexon("/character/stat", { ocid: rOcidData.ocid, date: safeRankingDate }).catch(() => ({ final_stat: [] }));
                    if (!rStat.final_stat || rStat.final_stat.length === 0) continue;

                    const targetPower = parseFloat(rStat.final_stat.find(s => s.stat_name === "전투력")?.stat_value || 0);

                    // 🚨 [조건 강화 필터 준수]: 나보다 전투력이 높은 실제 유저 조건에 맞는지 확인
                    if (myPowerValue > 0 && targetPower <= myPowerValue) {
                        continue; 
                    }

                    const rItem = await window.fetchFromNexon("/character/item-equipment", { ocid: rOcidData.ocid, date: safeRankingDate }).catch(() => ({ item_equipment: [] }));
                    await omniApiSleep(150);
                    const rUnion = await window.fetchFromNexon("/character/union", { ocid: rOcidData.ocid, date: safeRankingDate }).catch(() => ({ union_level: 0 }));
                    await omniApiSleep(150);
                    const rSymbol = await window.fetchFromNexon("/character/symbol-equipment", { ocid: rOcidData.ocid, date: safeRankingDate }).catch(() => ({ symbol: [] }));

                    if (rivalList.some(u => u.name === ranker.character_name)) continue;

                    rivalList.push({
                        name: ranker.character_name,
                        class: ranker.character_class,
                        level: ranker.character_level,
                        stats: rStat.final_stat || [],
                        equipment: rItem.item_equipment || [],
                        union: rUnion || { union_level: 0 },
                        symbol: rSymbol.symbol || []
                    });
                } catch (innerErr) {
                    console.warn("[OMNI LIVE SKIP] 개별 라이벌 통신 차단에 의한 유저 패스 처리");
                }
            }
        }
        return rivalList;
    } catch (err) {
        console.error("[OMNI ERROR] 실제 동직업 유저 라이브 로딩 실패:", err);
        return [];
    }
};

/**
 * 🚀 [최적화 트래픽 세이빙 마스터 스캔 허브]
 * 설명: 캐시가 존재하면 불필요한 API 요청을 원천 차단하고 즉시 인터페이스를 활성화합니다.
 */
window.startOmniSearch = async function(characterName, forceRefresh = false) {
    if (window.isOmniSearching) return;
    if (!characterName || !characterName.trim()) {
        alert("탐색할 캐릭터명을 입력해 주세요.");
        return;
    }
    
    const cleanName = characterName.trim();
    const cacheStorageKey = `omni_v14_cached_char_${cleanName}`;
    
    // 🛡️ [API 요청 횟수 파괴적 축소 단락]: forceRefresh가 거짓이고 로컬 캐시 데이터가 실존하면 즉시 마운트 후 리턴
    if (!forceRefresh) {
        const cachedPayload = localStorage.getItem(cacheStorageKey);
        if (cachedPayload) {
            console.log(`[OMNI CACHE SYSTEM] ${cleanName} 캐릭터 패킷을 로컬 영구 캐시 저장소에서 즉시 호출합니다.`);
            const parsedResult = JSON.parse(cachedPayload);
            window.currentSearchData = parsedResult;
            window.executeOmniUiRepaint(parsedResult, cleanName);
            return;
        }
    }

    // 갱신 혹은 캐시 부재 시 기존 캐시 삭제 후 비동기 네트워킹 진입
    localStorage.removeItem(cacheStorageKey);

    try {
        window.isOmniSearching = true;
        const idData = await window.MapleApiHub.getCharacterOcid(cleanName);
        const ocid = idData.ocid;
        if (!ocid) throw new Error("캐릭터 고유 식별자(ocid) 파싱에 실패했습니다.");

        let confirmedDate = null;
        let basicData = null;

        for (let i = 1; i <= 5; i++) {
            const testDate = window.getOmniCustomTargetDate(i);
            await omniApiSleep(250);
            try {
                basicData = await window.fetchFromNexon("/character/basic", { ocid: ocid, date: testDate });
                confirmedDate = testDate; 
                break;
            } catch (error) {
                if (error.status === 400 || error.status === 403) continue; 
                throw error;
            }
        }

        if (!confirmedDate || !basicData) throw new Error("유효한 데이터 정산 범위 초과 대상 유저입니다.");

        const statData = await window.fetchFromNexon("/character/stat", { ocid: ocid, date: confirmedDate }).catch(() => ({ final_stat: [] }));
        await omniApiSleep(200);
        const itemData = await window.fetchFromNexon("/character/item-equipment", { ocid: ocid, date: confirmedDate }).catch(() => ({ item_equipment: [] }));
        await omniApiSleep(200);
        const abilityData = await window.fetchFromNexon("/character/ability", { ocid: ocid, date: confirmedDate }).catch(() => ({ remain_fame: "0", ability_info: [] }));
        await omniApiSleep(200);
        const symbolData = await window.fetchFromNexon("/character/symbol-equipment", { ocid: ocid, date: confirmedDate }).catch(() => ({ symbol: [] }));
        await omniApiSleep(200);
        const dojangData = await window.fetchFromNexon("/character/dojang", { ocid: ocid, date: confirmedDate }).catch(() => ({ dojang_best_floor: 0 }));
        await omniApiSleep(200);
        const unionData = await window.fetchFromNexon("/character/union", { ocid: ocid, date: confirmedDate }).catch(() => ({ union_level: "0" }));

        const myPowerValue = statData.final_stat ? (parseFloat(statData.final_stat.find(s => s.stat_name === "전투력")?.stat_value) || 0) : 0;

        // 동종 직업군 실제 일반 유저 수집 트래킹 가동
        const liveRivals = await window.fetchLiveRivalsByClass(basicData.character_class, confirmedDate, myPowerValue);

        const parsedResult = {
            basic: basicData, 
            homework: {}, 
            stat: statData, 
            item: itemData, 
            ability: abilityData,
            symbol: symbolData, 
            dojang: dojangData, 
            union: unionData, 
            ranking: { world: 0, class: 0 },
            link_skill: { character_link_skill: [] }, 
            hexa_skill: { character_hexa_core_equipment: [] }, 
            skill: { character_skill: [] }, 
            hexa_stat: { character_hexa_stat_core: {} },
            liveRivals: liveRivals
        };

        localStorage.setItem(cacheStorageKey, JSON.stringify(parsedResult));
        window.currentSearchData = parsedResult;
        window.executeOmniUiRepaint(parsedResult, cleanName);

    } catch (error) {
        console.error("[OMNI API MASTER ERROR] 라이브 연동 취합 실패 리포트:", error);
        alert(`연동에 실패했습니다. (API 제한 트래픽 초과 상태일 수 있습니다): ${error.message}`);
    } finally {
        window.isOmniSearching = false;
    }
};

window.executeOmniUiRepaint = function(parsedResult, cleanName) {
    if (typeof window.updateScannerContext === 'function') {
        window.updateScannerContext(parsedResult);
    }
    if (typeof window.renderSearchDetail === 'function') {
        window.renderSearchDetail(
            parsedResult.basic, parsedResult.stat, parsedResult.item, parsedResult.ability,
            parsedResult.symbol, parsedResult.dojang, parsedResult.union, parsedResult.ranking,
            parsedResult.link_skill, parsedResult.hexa_skill, parsedResult.skill, parsedResult.hexa_stat
        );
    }
    window.lastSearchedCharacterName = cleanName;
};