/* =========================================================
 * 저장소 연결 (Firebase Realtime Database 또는 데모 모드)
 * 데모 모드: config.js의 apiKey가 "YOUR_"로 시작하면 이 브라우저의
 * localStorage에만 저장합니다. 학생 탭과 교사 탭을 같은 브라우저에서
 * 열어 미리 체험해 볼 수 있습니다.
 * ========================================================= */
(function () {
  const C = window.EXAM_CONFIG;
  const ROOT = C.rootPath;
  const isDemo = !C.firebaseConfig || /^YOUR_/.test(C.firebaseConfig.apiKey || "");
  const full = (p) => (p ? ROOT + "/" + p : ROOT);

  /* ---------------- 데모 모드 ---------------- */
  function makeDemo() {
    const KEY = "paperExamDemo:" + ROOT;
    const listeners = new Set();
    const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } };
    const save = (t) => { try { localStorage.setItem(KEY, JSON.stringify(t)); } catch (e) {} };
    const parts = (p) => p.split("/").filter(Boolean);
    const read = (tree, p) => parts(p).reduce((n, k) => (n && typeof n === "object" ? n[k] : undefined), tree);
    const write = (tree, p, v) => {
      const ks = parts(p); let n = tree;
      for (let i = 0; i < ks.length - 1; i++) { if (typeof n[ks[i]] !== "object" || n[ks[i]] === null) n[ks[i]] = {}; n = n[ks[i]]; }
      const last = ks[ks.length - 1];
      if (v === null || v === undefined) delete n[last]; else n[last] = JSON.parse(JSON.stringify(v));
    };
    const notify = () => { const t = load(); listeners.forEach((l) => l.cb(clone(read(t, l.path)))); };
    const clone = (v) => (v === undefined ? null : JSON.parse(JSON.stringify(v)));
    window.addEventListener("storage", (e) => { if (e.key === KEY) notify(); });
    let uid = sessionStorage.getItem("demoUid");
    if (!uid) { uid = "demo-" + Math.random().toString(36).slice(2, 10); sessionStorage.setItem("demoUid", uid); }
    let authCb = null, user = null;
    return {
      isDemo: true,
      async signInStudent() { user = { uid, isAnonymous: true }; authCb && authCb(user); return user; },
      async signInTeacher() { user = { uid, email: "데모 교사", isAnonymous: false }; authCb && authCb(user); return user; },
      currentUser: () => user,
      onAuth(cb) { authCb = cb; setTimeout(() => cb(user), 0); },
      async signOut() { user = null; authCb && authCb(null); },
      isTeacher: (u) => !!u && !u.isAnonymous,
      async checkTeacher() { return true; },
      async get(p) { return clone(read(load(), full(p))); },
      async set(p, v) { const t = load(); write(t, full(p), v); save(t); notify(); },
      async update(p, obj) { const t = load(); Object.entries(obj).forEach(([k, v]) => write(t, full(p) + "/" + k, v)); save(t); notify(); },
      async remove(p) { const t = load(); write(t, full(p), null); save(t); notify(); },
      on(p, cb) { const l = { path: full(p), cb }; listeners.add(l); setTimeout(() => cb(clone(read(load(), l.path))), 0); return () => listeners.delete(l); },
      now: () => Date.now(),
      resetDemo() { localStorage.removeItem(KEY); notify(); }
    };
  }

  /* ---------------- Firebase 모드 ---------------- */
  function makeFirebase() {
    firebase.initializeApp(C.firebaseConfig);
    const db = firebase.database();
    const auth = firebase.auth();
    const ref = (p) => db.ref(full(p));
    const emails = (C.teacherEmails || []).map((e) => e.toLowerCase());
    return {
      isDemo: false,
      async signInStudent() {
        if (auth.currentUser && auth.currentUser.isAnonymous) return auth.currentUser;
        if (auth.currentUser) await auth.signOut();
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const r = await auth.signInAnonymously(); return r.user;
      },
      async signInTeacher() {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        const r = await auth.signInWithPopup(provider); return r.user;
      },
      currentUser: () => auth.currentUser,
      onAuth(cb) { auth.onAuthStateChanged(cb); },
      async signOut() { await auth.signOut(); },
      /* 교사 여부는 서버 보안 규칙으로 확인합니다 (교사만 읽을 수 있는 keys를 읽어 봄).
       * 그래서 공개 저장소의 코드에 교사 이메일을 적어 둘 필요가 없습니다. */
      isTeacher: (u) => !!u && !u.isAnonymous && (!emails.length || (!!u.email && emails.includes(u.email.toLowerCase()))),
      async checkTeacher() { try { await ref("keys").get(); return true; } catch (e) { return false; } },
      async get(p) { const s = await ref(p).get(); return s.exists() ? s.val() : null; },
      async set(p, v) { await ref(p).set(v); },
      async update(p, obj) { await ref(p).update(obj); },
      async remove(p) { await ref(p).remove(); },
      on(p, cb) { const r = ref(p); const h = (s) => cb(s.exists() ? s.val() : null); r.on("value", h, () => cb(null)); return () => r.off("value", h); },
      now: () => firebase.database.ServerValue.TIMESTAMP
    };
  }

  window.Store = isDemo ? makeDemo() : makeFirebase();

  /* ---------------- 공통 도우미 ---------------- */
  window.ExamUtil = {
    /* 학번(5자리) → {grade, cls, no} */
    parseSid(sid) {
      const s = String(sid || "").trim();
      if (!/^\d{5}$/.test(s)) return null;
      const grade = +s[0], cls = +s.slice(1, 3), no = +s.slice(3);
      if (grade !== C.grade || cls < 1 || cls > C.classCount || no < 1) return null;
      return { grade, cls, no };
    },
    /* 이름 가명처리: 서버에는 이름 대신 이 코드만 저장합니다.
     * 같은 학번+이름이면 항상 같은 코드가 나와서, 교사 화면에서 명렬표와 대조할 수 있습니다. */
    normName(n) { return String(n || "").normalize("NFC").replace(/\s+/g, ""); },
    async nameHash(sid, name) {
      const txt = `${C.rootPath}|${String(sid).trim()}|${this.normName(name)}`;
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
    },
    answered(q, v) {
      if (v === undefined || v === null) return false;
      if (q.type === "steps" || q.type === "keywords") return Array.isArray(v) && v.some((x) => String(x || "").trim());
      if (q.type === "pair") { if (typeof v === "string") return v.trim().length > 0; return (q.fields || []).every((f) => String((v || {})[f.key] || "").trim()); }
      return String(v).trim().length > 0;
    },
    toText(q, v) {
      if (v === undefined || v === null) return "";
      if (q.type === "steps") return (v || []).filter((x) => String(x || "").trim()).map((x, i) => (i + 1) + ". " + x.trim()).join("\n");
      if (q.type === "keywords") return (v || []).filter((x) => String(x || "").trim()).map((x) => x.trim()).join(", ");
      if (q.type === "pair") {
        if (typeof v === "string") return v;
        return (q.fields || []).map((f) => `[${f.label}] ${String((v || {})[f.key] || "").trim()}`).filter((t) => !/\]\s*$/.test(t)).join("\n");
      }
      return String(v);
    },
    /* 채점 체크 → 점수 */
    score(checks, special) {
      const S = C.scoring; checks = checks || {};
      if (special === "blank") return { process: null, inquiry: null, total: S.blank, pc: 0, ic: 0 };
      if (special === "absent") return { process: null, inquiry: null, total: S.absent, pc: 0, ic: 0 };
      const pc = C.questions.filter((q) => q.area === "process" && checks[q.id]).length;
      const ic = C.questions.filter((q) => q.area === "inquiry" && checks[q.id]).length;
      const process = S.process[pc], inquiry = S.inquiry[ic];
      return { process, inquiry, total: process + inquiry, pc, ic };
    },
    fmtTime(ts) {
      if (!ts || typeof ts !== "number") return "";
      const d = new Date(ts), z = (n) => String(n).padStart(2, "0");
      return `${d.getMonth() + 1}/${d.getDate()} ${z(d.getHours())}:${z(d.getMinutes())}`;
    },
    esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  };
})();
