/* =========================================================
 * 과학주제 선행연구 탐색 및 분석 수행평가 - 설정 파일
 * 이 파일만 고치면 학교 상황에 맞게 바꿀 수 있습니다.
 * ========================================================= */
window.EXAM_CONFIG = {
  /* 1) Firebase 설정값
   *    Firebase 콘솔 > 프로젝트 설정 > 내 앱 > SDK 설정 및 구성(구성)에서 복사해 붙여넣으세요.
   *    apiKey가 "YOUR_"로 시작하는 동안에는 '데모 모드'(이 브라우저 안에서만 저장)로 동작합니다. */
  firebaseConfig: {
    apiKey: "AIzaSyAsGGh69AUrM5HoHYo1Vkdnq-Wy8vcuC2c",
    authDomain: "research-paper-2026.firebaseapp.com",
    databaseURL: "https://research-paper-2026-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "research-paper-2026",
    storageBucket: "research-paper-2026.firebasestorage.app",
    messagingSenderId: "577143092281",
    appId: "1:577143092281:web:796424295b0e7097bb89e8"
  },

  /* 2) 교사 계정 확인은 Firebase 보안 규칙(교사 이메일)으로 합니다.
   *    공개 저장소에 이메일이 드러나지 않도록 여기에는 비워 둡니다. */
  teacherEmails: [],

  /* 3) 데이터베이스 저장 위치 (기존 수업 앱과 겹치지 않게 분리) */
  rootPath: "paperExam2026",

  /* 4) 학년·학급 */
  grade: 1,
  classCount: 12,

  /* 5) 평가 정보 */
  examTitle: "과학주제 선행연구 탐색 및 분석",
  examSubtitle: "2026학년도 2학기 과학탐구실험2 수행평가",

  /* 6) 형별 논문과 지정 실험 (쪽 번호는 '뷰어 화면의 쪽 번호' 기준) */
  forms: {
    A: {
      label: "A형",
      field: "생물",
      paperTitle: "해파리와 옥수수 속대를 이용한 식물생장촉진제 제조 및 효과 검증에 관한 연구",
      source: "제71회 전국과학전람회 출품작 (2025)",
      file: "papers/A.pdf",
      focusName: "연구 2. 식물생장촉진제에 의한 식물 생장 효과 분석 중 「1) 식물 발아 효과 분석」",
      focusPages: "실험 방법 12~13쪽, 실험 결과 19~22쪽",
      jumpPage: 12
    },
    B: {
      label: "B형",
      field: "지구 및 환경",
      paperTitle: "물과 소화기를 대체하는 산불 잔불 진압에 효과적인 친환경 조개껍데기 소화제 개발 연구",
      source: "제71회 전국과학전람회 출품작 (2025)",
      file: "papers/B.pdf",
      focusName: "연구 과제 2. 화재 진압 실험",
      focusPages: "14~18쪽",
      jumpPage: 14
    },
    C: {
      label: "C형",
      field: "물리",
      paperTitle: "보행자의 안전을 위한 방호울타리의 충격 흡수 메커니즘 및 가변형 구조에 관한 연구",
      source: "제70회 전국과학전람회 출품작 (2024)",
      file: "papers/C.pdf",
      focusName: "과제2. 이중기둥의 충격 흡수 성능에 관한 탐구",
      focusPages: "17~21쪽",
      jumpPage: 17
    }
  },

  /* 7) 문항 (평가계획서 채점기준과 1:1 대응)
   *    area: process(과정 10점) / inquiry(탐구 25점) / extra(채점 제외)
   *    scope: paper(논문 전체) / focus(지정 실험)
   *    type: text / steps / keywords */
  questions: [
    { id: "p1", area: "process", no: "과정 ①", scope: "paper", type: "text", rows: 4,
      title: "연구 목적과 연구 문제",
      prompt: "이 연구가 무엇을 알아보려고 했는지(연구 목적)와 해결하려는 문제를 2~3문장으로 요약하세요.",
      criterion: "연구자료의 탐구 목적 및 연구 문제를 파악하여 요약하였는가?" },
    { id: "p2", area: "process", no: "과정 ②", scope: "paper", type: "text", rows: 5,
      title: "탐구 방법과 실험 설계",
      prompt: "연구자들이 어떤 실험들을 어떤 순서로 진행했는지, 논문 전체의 탐구 방법과 실험 설계를 요약하세요.",
      criterion: "탐구 방법 및 실험 설계를 파악하여 요약하였는가?" },
    { id: "p3", area: "process", no: "과정 ③", scope: "paper", type: "text", rows: 5,
      title: "주요 실험 결과와 결론",
      prompt: "주요 실험 결과와 연구자가 내린 결론을 요약하세요.",
      criterion: "주요 실험 결과 및 결론을 요약하였는가?" },

    { id: "q1", area: "inquiry", no: "탐구 ①", scope: "focus", type: "text", rows: 3,
      title: "탐구 가설",
      prompt: "지정 실험의 가설을 '~하면 ~할 것이다' 형태로 쓰세요. 논문에 가설이 직접 쓰여 있지 않다면 연구 목적과 실험 설계를 바탕으로 찾아 쓰세요.",
      criterion: "탐구 가설을 찾아 올바르게 서술하였는가?" },
    { id: "q2", area: "inquiry", no: "탐구 ②", scope: "focus", type: "text", rows: 3,
      title: "독립변인 (조작변인)",
      prompt: "연구자가 의도적으로 다르게 한 조건은 무엇인가요? 조건의 구체적인 값(종류, 비율, 농도 등)까지 쓰세요.",
      criterion: "독립변인을 구분하여 파악하고 서술하였는가?" },
    { id: "q3", area: "inquiry", no: "탐구 ③", scope: "focus", type: "text", rows: 3,
      title: "종속변인",
      prompt: "독립변인에 따라 달라지는지 측정한 값은 무엇인가요? 어떻게 측정했는지도 함께 쓰세요.",
      criterion: "종속변인을 구분하여 파악하고 서술하였는가?" },
    { id: "q4", area: "inquiry", no: "탐구 ④", scope: "focus", type: "text", rows: 3,
      title: "통제변인",
      prompt: "공정한 비교를 위해 모든 실험에서 같게 유지한 조건을 3가지 이상 쓰세요.",
      criterion: "통제변인을 구분하여 파악하고 서술하였는가?" },
    { id: "q5", area: "inquiry", no: "탐구 ⑤", scope: "focus", type: "steps",
      title: "실험 과정 (단계별)",
      prompt: "지정 실험의 과정을 핵심 단계별로 순서에 맞게 쓰세요. 한 칸에 한 단계씩 씁니다.",
      criterion: "실험 과정을 핵심 단계별로 순서에 맞게 파악하고 서술하였는가?" },
    { id: "q6", area: "inquiry", no: "탐구 ⑥", scope: "focus", type: "text", rows: 5,
      title: "가설과 변인에 근거한 예상 결과와 결론",
      prompt: "가설이 옳다면 종속변인이 어떻게 나타날지 예상하고, 그 결과로부터 내릴 수 있는 결론을 쓰세요. 이어서 논문의 실제 결과가 예상과 같았는지 비교해 보세요.",
      criterion: "가설과 변인에 근거한 예상 결과와 결론을 과학적으로 서술하였는가?" },
    { id: "q7", area: "inquiry", no: "탐구 ⑦", scope: "paper", type: "keywords",
      title: "핵심 과학 개념",
      prompt: "이 연구를 이해하는 데 꼭 필요한 핵심 과학 개념(용어)을 2~3개 쓰세요.",
      criterion: "선행연구자료에 관련된 핵심 과학 개념을 파악하여 서술하였는가?" },
    { id: "q8", area: "inquiry", no: "탐구 ⑧", scope: "paper", type: "text", rows: 5,
      title: "핵심 과학 개념 설명",
      prompt: "탐구 ⑦에서 쓴 개념 중 1개 이상을 골라 뜻을 설명하고, 이 연구에서 어떻게 쓰였는지 연결하여 쓰세요.",
      criterion: "핵심 과학 개념을 올바르게 설명하고 서술하였는가?" },

    { id: "ai", area: "extra", no: "기록", scope: "paper", type: "text", rows: 2,
      title: "AI·자료 활용 기록 (선택, 채점 제외)",
      prompt: "AI나 다른 자료를 활용했다면 사용한 도구, 질문 내용, 출처를 쓰세요. 활용하지 않았다면 비워 두세요.",
      criterion: "" }
  ],

  /* 8) 점수표 (평가계획서 기준) */
  scoring: {
    process: { 3: 10, 2: 8, 1: 6, 0: 4 },          // 과정 3개 기준
    inquiry: { 8: 25, 7: 23, 6: 21, 5: 19, 4: 17, 3: 15, 2: 13, 1: 11, 0: 9 },
    blank: 11,      // 본인 의사로 미응시, 백지 제출 (기본 점수)
    absent: 10      // 장기 미인정 결석
  }
};
