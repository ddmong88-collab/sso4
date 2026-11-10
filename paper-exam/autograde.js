/* =========================================================
 * 키워드 자동 채점 규칙과 채점 엔진
 * - 형별 모범답안·채점 기준표를 바탕으로 만든 규칙입니다.
 * - 결과는 O(충족) / X(미충족) / ?(확인 필요) 세 가지입니다.
 * - 서술형(탐구 ⑥, 탐구 ⑧)은 키워드로 판단하지 않고 ‘?’로 남겨
 *   교사 확인 또는 Claude 1차 채점으로 넘깁니다.
 * - 단어 목록은 띄어쓰기를 무시하고 비교합니다. 필요하면 여기에서 단어를 더하거나 뺄 수 있습니다.
 * ========================================================= */
(function () {
  const REVIEW = { type: "review" };

  const RULES = {
    /* ---------------- A형: 푸코잔틴 → 대추방울토마토 생장 (탐구과제 2) ---------------- */
    A: {
      p1: { type: "groups", minLen: 10, groups: [["푸코잔틴", "갈조류", "해조류", "괭생이"], ["토마토", "식물"], ["생장", "성장", "자라", "촉진", "항산화"]], need: [0], min: 2,
            names: ["푸코잔틴(갈조류)", "토마토·식물", "생장 효과"] },
      p2: { type: "groups", minLen: 10, groups: [["유화", "유상", "용액을제조", "용액을만", "용액제조", "제조"], ["희석", "비율", "농도", "1000", "500"], ["토마토", "생장률", "생장율", "줄기", "무게"]], min: 2,
            names: ["푸코잔틴 용액 제조", "희석 비율", "토마토 생장 비교"] },
      p3: { type: "pair" },
      q1: { type: "groups", minLen: 10, groups: [["푸코잔틴", "용액", "농도", "비율"], ["생장", "성장", "자라", "줄기", "무게", "길이"], ["것이다", "것이", "촉진", "증가", "클", "많이", "달라질", "높", "잘"]], min: 3,
            names: ["푸코잔틴(농도)", "생장", "예상 표현"] },
      q2: { type: "groups", groups: [["비율", "농도", "희석", "1000", "500", "100:1", "푸코잔틴"]], min: 1,
            names: ["푸코잔틴 용액 비율(농도)"], swap: ["줄기길이", "무게변화", "생장률", "생장율", "증가율"] },
      q3: { type: "groups", groups: [["줄기", "무게", "길이", "생장률", "생장율", "생장정도", "증가율", "변화율"]], min: 1,
            names: ["줄기 길이·무게(생장률)"], swap: ["1000:1", "500:1", "100:1", "비율", "농도"] },
      q4: { type: "count", min: 2, items: [
            ["토양", "흙", "450g"], ["ph"], ["온도"], ["급수", "물의양", "물양", "200ml", "물을주", "물주"], ["장소", "생명과학실"], ["광원", "빛", "파장", "조명"],
            ["처리량", "10ml", "용액의양", "주입량"], ["모종", "비슷한", "같은크기", "품종"], ["기간", "4주"], ["화분"]],
            names: ["토양의 양", "토양 pH", "실내 온도", "급수량", "장소", "광원", "용액 처리량", "모종 상태", "기간", "화분"] },
      q5: { type: "steps", minSteps: 3, minHits: 3, groups: [["모종", "심", "화분", "고르", "선별"], ["초기", "처음", "심기전", "처리전"], ["처리", "주입", "뿌", "줄", "10ml"], ["4주", "기르", "키우", "관찰", "2주"], ["측정", "재", "계산", "생장률", "생장율", "비교"]],
            names: ["모종 고르기·심기", "초기 길이·무게 측정", "용액 처리", "4주 기르기", "길이·무게 측정·비교"] },
      q6: REVIEW,
      q7: { type: "count", min: 1, items: [
            ["항산화", "활성산소", "ros", "산화"], ["광합성", "색소", "카로티노이드", "크산토필", "엽록"], ["생장률", "생장율", "상대생장"], ["대조군", "실험군", "변인"],
            ["유화", "계면활성", "에멀젼", "에멀전"], ["희석", "농도"], ["갈조류", "해조류"]],
            names: ["항산화·활성산소", "광합성 색소", "생장률", "대조군·변인", "유화(계면활성제)", "농도·희석", "갈조류"] },
      q8: REVIEW
    },

    /* ---------------- B형: 브로멜린 효소 (기초 탐구 2. 농도 의존성) ---------------- */
    B: {
      p1: { type: "groups", minLen: 10, groups: [["브로멜린", "파인애플", "효소"], ["단백질", "분해", "세정", "벌레", "곤충"]], min: 2,
            names: ["브로멜린(효소)", "단백질 분해·세정"] },
      p2: { type: "groups", minLen: 10, groups: [["파인애플즙", "레몬", "젤라틴", "단백질분해"], ["농도"], ["온도"], ["이산화티타늄", "tio2", "광촉매"], ["코팅", "디스플레이", "지문"]], min: 2,
            names: ["단백질 분해 비교", "농도 실험", "온도 실험", "이산화티타늄(광촉매)", "코팅 적용"] },
      p3: { type: "pair" },
      q1: { type: "groups", minLen: 10, groups: [["농도"], ["분해", "젤라틴", "단백질", "이동"], ["것이다", "달라", "증가", "커", "클", "많", "높", "차이", "잘"]], min: 3,
            names: ["브로멜린 농도", "젤라틴 분해", "예상 표현"] },
      q2: { type: "groups", groups: [["농도", "0%", "1%", "5%", "10%", "0.2g", "브로멜린의양", "브로멜린양"]], min: 1,
            names: ["브로멜린 농도"], swap: ["이동거리", "이동한거리", "거리"] },
      q3: { type: "groups", groups: [["이동거리", "이동한거리", "거리", "흘러", "분해정도", "방울"]], min: 1,
            names: ["방울 이동 거리(분해 정도)"], swap: ["0%", "1%", "5%", "10%"] },
      q4: { type: "count", min: 2, items: [
            ["젤라틴농도", "젤라틴1%", "1%젤라틴", "젤라틴의농도", "젤라틴양", "젤라틴의양", "젤라틴용액"], ["점적량", "방울양", "방울의양", "떨어뜨리는양", "떨어뜨린양"], ["냉장", "1시간", "전처리"],
            ["각도", "90"], ["기울이는시간", "기울인시간", "1초"], ["온도", "실온"], ["부피", "20ml", "용액의양"], ["용기", "비커"]],
            names: ["젤라틴 농도", "점적량", "냉장 시간", "기울인 각도", "기울인 시간", "온도", "용액 부피", "용기"] },
      q5: { type: "steps", minSteps: 3, minHits: 3, groups: [["젤라틴", "0.6g", "녹", "가열"], ["브로멜린", "넣"], ["냉장", "1시간"], ["떨어뜨", "스포이드", "기울", "90", "점적"], ["거리", "측정", "재", "자로"]],
            names: ["젤라틴 용액 만들기", "브로멜린 넣기", "냉장 1시간", "떨어뜨려 기울이기", "이동 거리 측정"] },
      q6: REVIEW,
      q7: { type: "count", min: 1, items: [
            ["효소", "촉매"], ["기질", "활성부위", "활성화에너지"], ["단백질", "아미노산", "펩타이드", "펩티드"], ["가수분해"], ["변성", "최적온도", "최적ph"],
            ["광촉매", "이산화티타늄", "활성산소"], ["대조군", "실험군", "변인", "가설"], ["혼잡", "최적농도"]],
            names: ["효소·촉매", "기질·활성 부위", "단백질·아미노산", "가수분해", "변성·최적 조건", "광촉매", "대조군·변인·가설", "최적 농도"] },
      q8: REVIEW
    },

    /* ---------------- C형: 가변형 방호울타리 (이중기둥 실험) ---------------- */
    C: {
      p1: { type: "groups", minLen: 10, groups: [["방호울타리", "울타리", "가드레일"], ["충격", "보행자", "안전", "흡수"]], min: 2,
            names: ["방호울타리", "충격·보행자 안전"] },
      p2: { type: "groups", minLen: 10, groups: [["기울", "벡터", "힘분해", "힘센서", "쇠구슬"], ["이중", "단일"], ["용수철", "스프링"], ["프로토타입", "3d", "카트", "시뮬레이션"], ["레일"]], min: 2,
            names: ["기울어진 기둥 실험", "이중기둥 실험", "용수철 탐구", "프로토타입 실험", "레일"] },
      p3: { type: "pair" },
      q1: { type: "groups", minLen: 10, groups: [["이중"], ["충격", "충격량", "블록", "덜", "줄", "흡수", "작"]], min: 2,
            names: ["이중기둥", "충격 감소"] },
      q2: { type: "groups", groups: [["울타리", "기둥", "구조"], ["단일", "이중", "두께"]], need: [0], min: 1,
            names: ["울타리(기둥) 종류·구조", "단일·이중 구분"], swap: ["블록개수", "블록의개수", "날아간거리", "쓰러진블록"] },
      q3: { type: "groups", groups: [["블록", "충격량", "날아간거리", "쓰러진"]], min: 1, names: ["블록 개수·거리"], swap: ["단일기둥", "이중기둥", "두께"] },
      q4: { type: "count", min: 2, items: [
            ["속도", "속력"], ["높이"], ["각도"], ["레일", "가속", "가속도"], ["블록배치", "같은블록", "블록의수", "블록탑", "블록개수"], ["반복", "5회"]],
            names: ["충돌 속도", "충돌 높이", "충돌 각도", "레일·가속 방법", "블록 배치", "반복 횟수"] },
      q5: { type: "steps", minSteps: 3, minHits: 3, groups: [["울타리를만", "제작", "만든", "만들"], ["블록", "쌓"], ["카트", "충돌"], ["세", "측정", "tracker", "거리"], ["반복", "바꿔", "바꾸어"]],
            names: ["울타리 제작", "블록 쌓기", "카트 충돌", "블록 수·거리 측정", "반복"] },
      q6: REVIEW,
      q7: { type: "count", min: 1, items: [
            ["충격량"], ["충격력"], ["운동량"], ["운동에너지", "에너지"], ["벡터", "힘의분해", "분해"], ["돌림힘", "토크"], ["훅의법칙", "탄성", "용수철"], ["좌굴", "응력"]],
            names: ["충격량", "충격력", "운동량", "운동 에너지", "힘의 분해", "돌림힘", "훅의 법칙·탄성", "좌굴·응력"] },
      q8: REVIEW
    },

    /* ---------------- D형: 해조류 중금속 흡착률 비교 (연구 나) ---------------- */
    D: {
      p1: { type: "groups", minLen: 10, groups: [["해조류", "폐해조류", "괭생이", "갈파래", "알긴산"], ["중금속", "흡착", "필터", "샤워기"]], min: 2,
            names: ["해조류(폐해조류)", "중금속 흡착"] },
      p2: { type: "groups", minLen: 10, groups: [["알긴산", "추출"], ["흡착률", "비교", "6종", "6가지", "종류별"], ["샤워기", "필터", "석고"]], min: 2,
            names: ["알긴산 추출·흡착", "해조류 흡착률 비교", "샤워기 필터 볼"] },
      p3: { type: "pair" },
      q1: { type: "groups", minLen: 10, groups: [["해조류", "종류", "괭생이", "갈파래", "클로렐라", "미역", "톳"], ["흡착", "중금속", "구리"], ["다를", "것이다", "높", "클", "많", "차이", "잘"]], min: 3,
            names: ["해조류 종류", "중금속 흡착", "예상 표현"] },
      q2: { type: "groups", groups: [["해조류의종류", "해조류종류", "종류", "괭생이", "미역", "톳", "갈파래", "클로렐라"]], min: 1,
            names: ["해조류의 종류"], swap: ["ph", "탁도"] },
      q3: { type: "groups", groups: [["ph", "탁도", "흡착률", "흡착량", "흡착정도"]], min: 1,
            names: ["pH·탁도(흡착률)"], swap: ["괭생이", "미역", "톳", "갈파래", "클로렐라"] },
      q4: { type: "count", min: 2, items: [
            ["중금속의종류", "중금속종류", "황산구리", "구리"], ["농도", "250ml", "4g"], ["해조류의양", "해조류양", "20g", "첨가량", "넣는양"], ["크기", "20mesh", "메쉬", "입자"],
            ["시간", "6시간"], ["센서", "측정기"], ["원심분리"], ["온도"]],
            names: ["중금속 종류", "수용액 농도", "해조류의 양", "분말 크기", "흡착 시간", "측정 센서", "원심분리", "온도"] },
      q5: { type: "steps", minSteps: 3, minHits: 3, groups: [["분쇄", "막자", "갈아", "빻"], ["메쉬", "거르", "걸러", "20g"], ["황산구리", "수용액"], ["6시간", "방치", "랩", "두"], ["원심분리", "상층액"], ["ph", "탁도", "측정", "비교"]],
            names: ["해조류 분쇄", "체로 걸러 20g", "황산구리 수용액에 넣기", "6시간 두기", "원심분리·상층액", "pH·탁도 측정"] },
      q6: REVIEW,
      q7: { type: "count", min: 1, items: [
            ["흡착"], ["중금속", "생물농축"], ["알긴산", "작용기", "카복시", "카르복시", "다당류"], ["이온교환", "이온"], ["ph", "산성", "염기"], ["탁도"],
            ["갈조류", "녹조류", "조류"], ["전류", "전기전도", "전해질"]],
            names: ["흡착", "중금속·생물농축", "알긴산·작용기", "이온(이온 교환)", "pH", "탁도", "갈조류·녹조류", "전류·전해질"] },
      q8: REVIEW
    }
  };

  const norm = (s) => String(s == null ? "" : s).toLowerCase().normalize("NFC").replace(/[\s·.,()'"“”‘’\-]/g, "");
  const hit = (t, list) => list.some((w) => t.includes(norm(w)));
  const textOf = (q, v) => {
    if (v == null) return "";
    if (Array.isArray(v)) return v.join(" ");
    if (typeof v === "object") return Object.values(v).join(" ");
    return String(v);
  };

  function gradeOne(rule, q, v) {
    const raw = textOf(q, v), t = norm(raw);
    if (!rule) return null;
    if (rule.type === "review") {
      if (!t) return { mark: "X", why: "미작성" };
      return { mark: "?", why: "서술형: 교사 확인 또는 Claude 1차 채점 필요" };
    }
    if (rule.type === "pair") {
      const keys = (q.fields || []).map((f) => f.key), obj = (v && typeof v === "object") ? v : { [keys[0]]: v };
      const empty = (q.fields || []).filter((f) => !norm(obj[f.key])).map((f) => f.label);
      if (empty.length === keys.length) return { mark: "X", why: "미작성" };
      if (empty.length) return { mark: "X", why: `${empty.join("·")} 칸이 비어 있음` };
      return { mark: "?", why: "결과·결론 모두 작성 · 내용은 교사 확인 또는 Claude 1차 채점 필요" };
    }
    if (!t) return { mark: "X", why: "미작성" };
    if (rule.type === "groups") {
      if (rule.minLen && t.length < rule.minLen) return { mark: "X", why: `답이 너무 짧아 문장으로 보기 어려움 (‘${raw.trim().slice(0, 20)}’)` };
      const ok = rule.groups.map((g) => hit(t, g));
      const n = ok.filter(Boolean).length, needOk = (rule.need || []).every((i) => ok[i]);
      const found = rule.names.filter((_, i) => ok[i]), miss = rule.names.filter((_, i) => !ok[i]);
      if (rule.swap && n === 0 && hit(t, rule.swap)) return { mark: "X", why: "독립·종속변인을 바꿔 쓴 것으로 보임 (다르게 판단되면 체크해 주세요)" };
      if (needOk && n >= rule.min) return { mark: "O", why: `키워드 확인: ${found.join(", ")}` };
      if (!found.length) return { mark: "X", why: "핵심 단어를 찾지 못함 (다른 표현으로 맞게 썼다면 체크해 주세요)" };
      return { mark: "?", why: `일부만 확인: ${found.join(", ")} (부족: ${miss.join(", ")})` };
    }
    if (rule.type === "count" || rule.type === "typed") {
      const found = rule.names.filter((_, i) => hit(t, rule.items[i]));
      if (rule.swap && !found.length && hit(t, rule.swap)) return { mark: "X", why: "독립·종속변인을 바꿔 쓴 것으로 보임 (다르게 판단되면 체크해 주세요)" };
      if (rule.type === "typed" && !hit(t, rule.head) && found.length < rule.min) return { mark: "?", why: found.length ? `종류 일부: ${found.join(", ")}` : "‘소화제 종류’를 찾지 못함" };
      if (found.length >= rule.min) return { mark: "O", why: `${found.length}가지 확인: ${found.join(", ")}` };
      if (!found.length) return { mark: "X", why: "해당 항목을 찾지 못함 (다른 표현으로 맞게 썼다면 체크해 주세요)" };
      return { mark: "?", why: `${found.length}가지만 확인: ${found.join(", ")} (기준 ${rule.min}가지 이상)` };
    }
    if (rule.type === "steps") {
      const steps = (Array.isArray(v) ? v : [raw]).map(norm).filter(Boolean);
      if (!steps.length) return { mark: "X", why: "미작성" };
      if (steps.length < rule.minSteps) return { mark: "X", why: `단계가 ${steps.length}개뿐임 (기준 ${rule.minSteps}단계 이상)` };
      const present = rule.groups.map((g) => steps.some((s) => hit(s, g)));
      const found = rule.names.filter((_, i) => present[i]);
      let pos = 0, ordered = true;                       // 핵심 단계가 앞 단계보다 뒤에 나오는지 차례로 확인
      rule.groups.forEach((g, i) => { if (!present[i]) return; const k = steps.findIndex((s, j) => j >= pos && hit(s, g)); if (k < 0) ordered = false; else pos = k; });
      const nHit = found.length;
      if (nHit >= rule.minHits && ordered) return { mark: "O", why: `${steps.length}단계, 핵심 단계 확인: ${found.join(" → ")}` };
      if (nHit >= rule.minHits) return { mark: "?", why: `핵심 단계는 있으나 순서 확인 필요: ${found.join(", ")}` };
      return { mark: "?", why: found.length ? `핵심 단계 일부만 확인: ${found.join(", ")}` : "핵심 단계를 찾지 못함" };
    }
    return null;
  }

  window.AutoGrade = {
    RULES,
    /* 한 학생 답안 → { qid: {mark, why} } */
    gradeStudent(form, questions, answers) {
      const R = RULES[form]; if (!R) return {};
      const out = {};
      questions.filter((q) => q.area !== "extra").forEach((q) => { const r = gradeOne(R[q.id], q, (answers || {})[q.id]); if (r) out[q.id] = r; });
      /* 탐구 ⑦: 목록에 없는 개념이라도 논문에 있는 개념을 탐구 ⑧에서 옳게 설명했다면 충족 → 미충족 대신 교사 확인으로 넘김 */
      const q8 = String((answers || {}).q8 || "").trim();
      if (out.q7 && out.q7.mark === "X" && q8.length >= 10) {
        const kw = ((answers || {}).q7 || []).filter((x) => String(x || "").trim()).join(", ");
        if (kw) out.q7 = { mark: "?", why: `목록에 없는 개념(‘${kw.slice(0, 20)}’) · 논문에 있는 개념이고 탐구 ⑧에서 옳게 설명했으면 충족` };
      }
      return out;
    }
  };
})();
