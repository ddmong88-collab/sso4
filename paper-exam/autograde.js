/* =========================================================
 * 키워드 자동 채점 규칙과 채점 엔진
 * - 형별 모범답안·채점 기준표를 바탕으로 만든 규칙입니다.
 * - 결과는 O(충족) / X(미충족) / ?(확인 필요) 세 가지입니다.
 * - 서술형(과정 ③, 탐구 ⑥, 탐구 ⑧)은 키워드로 판단하지 않고 ‘?’로 남겨
 *   교사 확인 또는 Claude 1차 채점으로 넘깁니다.
 * - 단어 목록은 띄어쓰기를 무시하고 비교합니다. 필요하면 여기에서 단어를 더하거나 뺄 수 있습니다.
 * ========================================================= */
(function () {
  const REVIEW = { type: "review" };

  const RULES = {
    /* ---------------- A형: 해파리·옥수수 속대 식물생장촉진제 (발아 실험) ---------------- */
    A: {
      p1: { type: "groups", groups: [["해파리"], ["옥수수"], ["촉진제", "비료", "영양제", "생장", "성장"]], min: 3,
            names: ["해파리", "옥수수 속대", "촉진제·생장"] },
      p2: { type: "groups", groups: [["비율", "7:3", "5:5", "3:7", "혼합"], ["고체", "액체", "제형"], ["발아", "생장", "높이", "엽장", "생체중", "엽록소", "스마트팜"],
            ["토양", "ph", "ec", "미생물", "유기물"], ["성분", "원소", "xrf", "분석"]], need: [0], min: 2,
            names: ["비율", "제형", "식물 생장 실험", "토양 분석", "성분 분석"] },
      p3: { type: "pair" },
      q1: { type: "groups", groups: [["촉진제", "해파리", "옥수수", "비율"], ["발아", "생장", "성장", "자라"], ["것이다", "것이", "높아질", "증가할", "달라질", "좋을", "촉진할", "높을"]], min: 3,
            names: ["촉진제(비율)", "발아·생장", "예상 표현"] },
      q2: { type: "groups", groups: [["비율", "7:3", "5:5", "3:7", "혼합"], ["고체", "액체", "제형", "형태"]], min: 1,
            names: ["혼합 비율", "제형"], swap: ["발아율", "발아수", "종자수", "발아종자"] },
      q3: { type: "groups", groups: [["발아"]], min: 1, names: ["발아 관련 측정값"], swap: ["7:3", "5:5", "3:7", "혼합비율"] },
      q4: { type: "count", min: 2, items: [
            ["씨앗수", "씨앗의수", "씨앗개수", "50립", "종자수", "씨앗50", "씨앗의개수"], ["깊이", "1cm"], ["배양토", "흙", "토양의양", "같은토양", "토양"],
            ["물", "급수", "수분"], ["온도"], ["습도"], ["빛", "led", "조명", "광"], ["같은시간", "관찰시간", "측정시간", "시간"], ["기간", "10일"],
            ["플랜트박스", "화분", "용기", "박스"], ["씨앗종류", "품종", "상추", "치커리", "같은씨앗"]],
            names: ["씨앗 수", "깊이", "토양", "물", "온도", "습도", "빛", "관찰 시간", "기간", "용기", "씨앗 종류"] },
      q5: { type: "steps", minSteps: 3, minHits: 3, groups: [["토양", "배양토", "섞", "혼합", "촉진제", "박스"], ["심", "파종", "씨앗"], ["세", "관찰", "확인", "기록", "개체"], ["계산", "발아율", "발아세"]],
            names: ["촉진제 섞은 토양 준비", "씨앗 심기", "발아 수 세기", "발아율 계산"] },
      q6: REVIEW,
      q7: { type: "count", min: 1, items: [
            ["필수원소", "무기질", "무기영양소", "질소", "칼륨", "인산", "다량원소", "미량원소", "원소"], ["호르몬", "옥신", "사이토키닌"], ["발효", "미생물", "em"],
            ["발아율", "발아세"], ["대조군", "변인통제", "통제변인", "대조실험"], ["삼투"], ["광합성", "엽록소"], ["ph", "산성", "염기"]],
            names: ["필수 원소", "식물 호르몬", "발효·미생물", "발아율", "대조군·변인 통제", "삼투압", "광합성·엽록소", "pH"] },
      q8: REVIEW
    },

    /* ---------------- B형: 친환경 조개껍데기 소화제 (화재 진압 실험) ---------------- */
    B: {
      p1: { type: "groups", groups: [["잔불", "산불", "재발화", "화재", "불을끄"], ["친환경", "소화제", "조개", "탄산칼슘", "알긴산"]], min: 2,
            names: ["잔불·산불 문제", "친환경 소화제"] },
      p2: { type: "groups", groups: [["제작", "만들", "만든"], ["화재", "진압", "숯", "분사"], ["식물", "무순", "강낭콩", "발아", "생장"], ["열분해", "이산화탄소", "co2"], ["펠릿", "캡슐", "조개"]], min: 2,
            names: ["소화제 제작", "화재 진압 실험", "식물 생장 실험", "열분해 실험", "조개껍데기 소화제"] },
      p3: { type: "pair" },
      q1: { type: "groups", groups: [["알긴산", "탄산칼슘"], ["온도", "잔불", "진화", "불", "재발화"], ["빠르", "낮추", "낮출", "낮게", "우수", "효과", "유지", "것이다"]], min: 3,
            names: ["알긴산·탄산칼슘", "온도·잔불", "효과 예상"] },
      q2: { type: "typed", head: ["소화제", "용액", "종류", "소화약제"], min: 3,
            items: [["물", "증류수", "수돗물"], ["분말"], ["액체"], ["기체", "가스"], ["베이킹", "탄산수소"], ["탄산칼슘"], ["알긴산"]],
            names: ["물", "분말", "액체", "기체", "베이킹소다", "탄산칼슘", "알긴산"], swap: ["숯의온도", "온도변화", "100℃", "50℃"] },
      q3: { type: "groups", groups: [["온도"]], min: 1, names: ["숯의 온도"], swap: ["베이킹", "탄산칼슘", "알긴산", "분말소화"] },
      q4: { type: "count", min: 3, items: [
            ["숯의양", "숯양", "500g", "숯500", "숯의무게"], ["초기온도", "처음온도", "400", "시작온도"], ["분무기", "분사방식", "고압"], ["분사시간", "120초", "분사하는시간"],
            ["거리", "50cm"], ["대기", "60초", "재발화확인", "기다"]],
            names: ["숯의 양", "초기 온도", "분사 방식", "분사 시간", "분사 거리", "재발화 확인 시간"] },
      q5: { type: "steps", minSteps: 3, minHits: 3, groups: [["가열", "토치", "불을붙", "불붙"], ["초기온도", "온도를측정", "온도측정", "온도를재", "측정"], ["분사", "뿌"], ["기록", "재", "측정"], ["반복", "바꿔", "바꾸어", "종류만"]],
            names: ["숯 가열", "초기 온도 측정", "소화제 분사", "온도 기록", "반복"] },
      q6: REVIEW,
      q7: { type: "count", min: 1, items: [
            ["연소", "3요소", "발화점", "착화점"], ["소화원리", "소화의원리", "소화방법", "산소차단", "산소를차단", "질식", "냉각", "열제거"], ["열분해"], ["이산화탄소", "co2"], ["ph", "산성", "염기", "알칼리"], ["점성", "젤", "겔", "고분자"], ["흡열", "열흡수", "열을흡수"]],
            names: ["연소의 3요소", "소화 원리", "열분해", "이산화탄소", "pH", "점성·젤", "흡열"] },
      q8: REVIEW
    },

    /* ---------------- C형: 가변형 방호울타리 (이중기둥 실험) ---------------- */
    C: {
      p1: { type: "groups", groups: [["방호울타리", "울타리", "가드레일"], ["충격", "보행자", "안전", "흡수"]], min: 2,
            names: ["방호울타리", "충격·보행자 안전"] },
      p2: { type: "groups", groups: [["기울", "벡터", "힘분해", "힘센서", "쇠구슬"], ["이중", "단일"], ["용수철", "스프링"], ["프로토타입", "3d", "카트", "시뮬레이션"], ["레일"]], min: 2,
            names: ["기울어진 기둥 실험", "이중기둥 실험", "용수철 탐구", "프로토타입 실험", "레일"] },
      p3: { type: "pair" },
      q1: { type: "groups", groups: [["이중"], ["충격", "충격량", "블록", "덜", "줄", "흡수", "작"]], min: 2,
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
      return out;
    }
  };
})();
