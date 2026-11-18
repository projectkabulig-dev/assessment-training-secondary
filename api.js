/* ==========================================================
   API — pinagsasaluhan ng test at dashboard
   LIVE mode: Google Apps Script (Google Sheet)
   DEMO mode: localStorage (kapag walang APPS_SCRIPT_URL)
   ========================================================== */
(function () {
  const N = window.ITEMS.length;
  const URL_ = (window.CONFIG.APPS_SCRIPT_URL || "").trim();
  const MODE = URL_ ? "live" : "demo";
  const DEMO_KEY = "nat21_demo_rows_v1";

  function scoreOf(answers) {
    const by = { English: 0, Science: 0, Math: 0 };
    let total = 0;
    window.ITEMS.forEach((it, i) => {
      if (answers[i] && answers[i] === it.key) { total++; by[it.subject]++; }
    });
    return { total, by };
  }

  /* ---------- DEMO store (kapareho ng logic ng Code.gs) ---------- */
  function demoRead() { try { return JSON.parse(localStorage.getItem(DEMO_KEY) || "[]"); } catch (e) { return []; } }
  function demoWrite(rows) { localStorage.setItem(DEMO_KEY, JSON.stringify(rows)); }
  function demoApply(ev) {
    const now = Date.now(), rows = demoRead();
    let r = rows.find(x => x.id === ev.id);
    if (ev.event === "register") {
      if (!r) {
        r = { id: ev.id, registered: now, name: ev.name, school: ev.school, district: ev.district, status: "registered",
              current: -1, itemStart: now, updated: now, score: 0, eng: 0, sci: 0, math: 0, totalSecs: 0,
              answers: Array(N).fill(""), times: Array(N).fill(null) };
        rows.push(r);
      }
    } else if (r) {
      if (ev.event === "progress") {
        if (ev.current !== r.current) r.itemStart = now;
        r.current = ev.current; r.status = "taking";
        r.answers = ev.answers; r.times = ev.times; r.score = ev.score;
      } else if (ev.event === "finish") {
        r.status = "done"; r.current = N; r.answers = ev.answers; r.times = ev.times;
        r.score = ev.score; r.eng = ev.eng; r.sci = ev.sci; r.math = ev.math; r.totalSecs = ev.totalSecs;
      }
      r.updated = now;
    }
    demoWrite(rows);
  }

  const Api = {
    mode: MODE,
    scoreOf,

    send(ev) {
      if (MODE === "demo") { demoApply(ev); return Promise.resolve(true); }
      return fetch(URL_, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(ev)
      }).then(() => true).catch(() => false);
    },

    /* may kasamang retry para hindi mawala ang sagot kapag nawalan ng signal */
    async sendRetry(ev, tries) {
      for (let i = 0; i < (tries || 3); i++) {
        if (await Api.send(ev)) return true;
        await new Promise(r => setTimeout(r, 1500 * (i + 1)));
      }
      return false;
    },

    async live(pin) {
      if (MODE === "demo") return { ok: true, now: Date.now(), rows: demoRead() };
      const res = await fetch(URL_ + "?action=live&pin=" + encodeURIComponent(pin) + "&t=" + Date.now());
      return await res.json();
    },

    async clear(pin) {
      if (MODE === "demo") { demoWrite([]); return { ok: true }; }
      const res = await fetch(URL_ + "?action=clear&pin=" + encodeURIComponent(pin));
      return await res.json();
    }
  };
  window.Api = Api;
})();
