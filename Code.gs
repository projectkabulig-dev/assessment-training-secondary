/**
 * NAT G12 · 21st Century Skills — Google Apps Script backend
 *
 * PAANO I-SET UP (isang beses lang):
 *  1. Gumawa ng bagong Google Sheet. Extensions → Apps Script.
 *  2. I-paste ang buong code na ito, palitan ang PIN sa ibaba, i-Save.
 *  3. Deploy → New deployment → type: Web app
 *       Execute as: Me       Who has access: Anyone
 *  4. Kopyahin ang Web App URL (nagtatapos sa /exec) at i-paste sa config.js
 *       → APPS_SCRIPT_URL
 *  5. Tuwing may babaguhin sa code na ito, mag-Deploy → Manage deployments → Edit → New version.
 *
 * Isang sheet lang ang ginagamit: "Responses" (isang row bawat participant).
 */
const SETTINGS = {
  PIN: "2026",            // ← PALITAN. Ito ang PIN para sa dashboard.
  SHEET: "Responses",
  N: 15                   // bilang ng items
};

const COL = { ID:0, REG:1, NAME:2, SCHOOL:3, DIST:4, STATUS:5, CUR:6, ISTART:7, UPD:8,
              SCORE:9, ENG:10, SCI:11, MATH:12, TOTAL:13, Q0:14 };   // Q1..Q15 = 14..28, T1..T15 = 29..43

function headers_() {
  const h = ["ID","Registered","Name","School","District","Status","Current item (0 = Item 1)",
             "Item start (ms)","Updated (ms)","Score /15","English /5","Science /5","Math /5","Total seconds"];
  for (let i = 1; i <= SETTINGS.N; i++) h.push("Q" + i);
  for (let i = 1; i <= SETTINGS.N; i++) h.push("T" + i + " (sec)");
  return h;
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SETTINGS.SHEET);
  if (!sh) sh = ss.insertSheet(SETTINGS.SHEET);
  if (sh.getLastRow() === 0) {
    const h = headers_();
    sh.getRange(1, 1, 1, h.length).setValues([h]).setFontWeight("bold")
      .setBackground("#312e81").setFontColor("#ffffff");
    sh.setFrozenRows(1);
    sh.getRange(2, 2, 1000, 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");
  }
  return sh;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------------- POST: mula sa test ng participant ---------------- */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    const ev = JSON.parse(e.postData.contents);
    const sh = sheet_();
    const last = sh.getLastRow();
    const ids = last > 1 ? sh.getRange(2, 1, last - 1, 1).getValues().map(r => r[0]) : [];
    const idx = ids.indexOf(ev.id);
    const now = Date.now();
    const width = headers_().length;

    if (ev.event === "register") {
      if (idx === -1) {
        const row = new Array(width).fill("");
        row[COL.ID] = ev.id; row[COL.REG] = new Date(); row[COL.NAME] = ev.name;
        row[COL.SCHOOL] = ev.school; row[COL.DIST] = ev.district; row[COL.STATUS] = "registered";
        row[COL.CUR] = -1; row[COL.ISTART] = now; row[COL.UPD] = now; row[COL.SCORE] = 0;
        sh.appendRow(row);
      }
      return json_({ ok: true });
    }

    if (idx === -1) return json_({ ok: false, error: "unknown id" });
    const rowNo = idx + 2;
    const range = sh.getRange(rowNo, 1, 1, width);
    const row = range.getValues()[0];

    if (ev.event === "progress") {
      if (Number(row[COL.CUR]) !== ev.current) row[COL.ISTART] = now;   // bagong item = bagong simula ng oras
      row[COL.CUR] = ev.current;
      row[COL.STATUS] = "taking";
      row[COL.SCORE] = ev.score;
      for (let i = 0; i < SETTINGS.N; i++) {
        row[COL.Q0 + i] = ev.answers[i] || "";
        row[COL.Q0 + SETTINGS.N + i] = ev.times[i] == null ? "" : ev.times[i];
      }
    } else if (ev.event === "finish") {
      row[COL.STATUS] = "done";
      row[COL.CUR] = SETTINGS.N;
      row[COL.SCORE] = ev.score; row[COL.ENG] = ev.eng; row[COL.SCI] = ev.sci; row[COL.MATH] = ev.math;
      row[COL.TOTAL] = ev.totalSecs;
      for (let i = 0; i < SETTINGS.N; i++) {
        row[COL.Q0 + i] = ev.answers[i] || "";
        row[COL.Q0 + SETTINGS.N + i] = ev.times[i] == null ? "" : ev.times[i];
      }
    }
    row[COL.UPD] = now;
    range.setValues([row]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* ---------------- GET: para sa dashboard ---------------- */
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === "ping") return json_({ ok: true, now: Date.now() });
  if (String(p.pin || "") !== String(SETTINGS.PIN)) return json_({ ok: false, error: "Maling PIN" });

  if (p.action === "live") {
    const sh = sheet_();
    const last = sh.getLastRow();
    const rows = [];
    if (last > 1) {
      const width = headers_().length;
      const vals = sh.getRange(2, 1, last - 1, width).getValues();
      vals.forEach(v => {
        if (!v[COL.ID]) return;
        const answers = [], times = [];
        for (let i = 0; i < SETTINGS.N; i++) {
          answers.push(String(v[COL.Q0 + i] || ""));
          const t = v[COL.Q0 + SETTINGS.N + i];
          times.push(t === "" ? null : Number(t));
        }
        rows.push({
          id: v[COL.ID], registered: v[COL.REG] instanceof Date ? v[COL.REG].getTime() : 0,
          name: v[COL.NAME], school: v[COL.SCHOOL], district: v[COL.DIST], status: v[COL.STATUS],
          current: Number(v[COL.CUR]), itemStart: Number(v[COL.ISTART]), updated: Number(v[COL.UPD]),
          score: Number(v[COL.SCORE]) || 0, eng: Number(v[COL.ENG]) || 0, sci: Number(v[COL.SCI]) || 0,
          math: Number(v[COL.MATH]) || 0, totalSecs: Number(v[COL.TOTAL]) || 0, answers: answers, times: times
        });
      });
    }
    return json_({ ok: true, now: Date.now(), rows: rows });
  }

  if (p.action === "clear") {            // i-archive ang lumang data para sa bagong batch
    const lock = LockService.getScriptLock();
    lock.waitLock(25000);
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sh = ss.getSheetByName(SETTINGS.SHEET);
      if (sh && sh.getLastRow() > 1) {
        sh.setName("Archive_" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmmss"));
      }
      sheet_();   // gagawa ng bagong "Responses" kung na-archive ang luma
      return json_({ ok: true });
    } finally { lock.releaseLock(); }
  }
  return json_({ ok: false, error: "unknown action" });
}
