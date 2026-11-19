/* ==========================================================
   deck.js — awtomatikong gumagawa ng PowerPoint (item analysis +
   snapshot ng performance ng buong klase) mula sa live data.
   ========================================================== */
(function () {
  const C = window.CONFIG, ITEMS = window.ITEMS, N = ITEMS.length, LIM = C.SECONDS_PER_ITEM;
  const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
  const pct = x => Math.round(x * 100) + "%";
  const r1 = x => (Math.round(x * 10) / 10).toFixed(1);

  const levelOf = p => p >= .81 ? "Very easy" : p >= .61 ? "Easy" : p >= .41 ? "Average" : p >= .21 ? "Difficult" : "Very difficult";
  const diOf = d => d == null ? "n/a" : d >= .40 ? "Very good" : d >= .30 ? "Good" : d >= .20 ? "Fair" : d >= 0 ? "Poor: revise" : "Negative: check key";

  /* ---------- ANALYSIS ---------- */
  function analyze(rows) {
    const n = rows.length;
    const sorted = rows.map(r => r.score).sort((a, b) => a - b);
    const mean = avg(sorted);
    const sd = Math.sqrt(avg(sorted.map(s => (s - mean) ** 2)));
    const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    const bands = [0, 0, 0]; let zero = 0;
    rows.forEach(r => { if (r.score >= 11) bands[2]++; else if (r.score >= 6) bands[1]++; else if (r.score >= 1) bands[0]++; else zero++; });

    const subj = {};
    window.SUBJECTS.forEach(s => {
      const k = ITEMS.filter(i => i.subject === s).length;
      const key = s === "English" ? "eng" : s === "Science" ? "sci" : "math";
      subj[s] = avg(rows.map(r => r[key])) / k;
    });

    const skillMap = {};
    ITEMS.forEach((it, i) => {
      const o = skillMap[it.skill] = skillMap[it.skill] || { c: 0, t: 0, items: [] };
      o.items.push(i + 1);
      rows.forEach(r => { o.t++; if (r.answers[i] === it.key) o.c++; });
    });
    const skills = Object.keys(skillMap).map(k => ({ name: k, p: skillMap[k].c / skillMap[k].t, items: skillMap[k].items }))
      .sort((a, b) => b.p - a.p);

    const dm = {};
    rows.forEach(r => { (dm[r.district] = dm[r.district] || []).push(r.score); });
    const districts = Object.keys(dm).map(d => ({ name: d, n: dm[d].length, mean: avg(dm[d]) })).sort((a, b) => b.mean - a.mean);

    const ranked = rows.slice().sort((a, b) => b.score - a.score);
    const k = Math.max(1, Math.round(n * 0.27));
    const upper = ranked.slice(0, k), lower = ranked.slice(n - k);

    const items = ITEMS.map((it, i) => {
      const dist = { A: 0, B: 0, C: 0, D: 0 }; let m = 0;
      rows.forEach(r => { if (r.answers[i]) { dist[r.answers[i]]++; m++; } });
      const p = m ? dist[it.key] / m : 0;
      const times = rows.map(r => r.times[i]).filter(t => t != null);
      const ot = times.length ? times.filter(t => t > LIM).length / times.length : 0;
      const di = n >= 10 ? (upper.filter(r => r.answers[i] === it.key).length - lower.filter(r => r.answers[i] === it.key).length) / k : null;
      const topWrong = ["A", "B", "C", "D"].filter(L => L !== it.key).sort((a, b) => dist[b] - dist[a])[0];
      return { i, it, dist, m, p, di, avgT: avg(times), ot, topWrong, wrongShare: m ? dist[topWrong] / m : 0 };
    });
    return { n, mean, sd, median, min: sorted[0], max: sorted[n - 1], bands, zero, subj, skills, districts, items, avgTotal: avg(rows.map(r => r.totalSecs)) };
  }

  /* ---------- DECK ---------- */
  function buildDeck(rows) {
    const A = analyze(rows);
    const P = new PptxGenJS();
    P.layout = "LAYOUT_WIDE";            // 13.33 x 7.5 in
    P.title = C.TITLE + " — Results";
    const NAVY = "1E1B4B", IND = "4F46E5", CY = "06B6D4", GRAY = "64748B", INK = "0F172A", LIGHT = "EEF2FF", GREEN = "16A34A", RED = "DC2626", AMB = "F59E0B";
    const SUBC = { English: "7C3AED", Science: "0D9488", Math: "EA580C" };
    const SUBN = { English: "English", Science: "Science", Math: "Mathematics" };
    const FONT = "Calibri";
    const dateStr = new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });

    function frame(slide, title, sub, color) {
      slide.background = { color: "FFFFFF" };
      slide.addShape(P.ShapeType.rect, { x: 0, y: 0, w: 0.28, h: 7.5, fill: { color: color || IND }, line: { color: color || IND } });
      slide.addText(title, { x: 0.65, y: 0.35, w: 12, h: 0.7, fontFace: FONT, fontSize: 28, bold: true, color: NAVY });
      if (sub) slide.addText(sub, { x: 0.65, y: 1.0, w: 12, h: 0.4, fontFace: FONT, fontSize: 14, color: GRAY });
      slide.addText(C.TITLE + " · n = " + A.n, { x: 0.65, y: 7.05, w: 9, h: 0.3, fontFace: FONT, fontSize: 10, color: "94A3B8" });
    }
    function card(slide, x, y, w, h, val, label, color) {
      slide.addShape(P.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: LIGHT }, line: { color: "E0E7FF" } });
      slide.addText(String(val), { x, y: y + 0.08, w, h: h * 0.55, align: "center", valign: "middle", fontFace: FONT, fontSize: 28, bold: true, color: color || IND });
      slide.addText(label, { x: x + 0.05, y: y + h * 0.58, w: w - 0.1, h: h * 0.38, align: "center", valign: "top", fontFace: FONT, fontSize: 11, color: GRAY });
    }
    const barOpts = (extra) => Object.assign({
      barDir: "col", showLegend: false, showTitle: false, showValue: true, dataLabelFontSize: 12, dataLabelFontFace: FONT, dataLabelColor: INK,
      catAxisLabelFontSize: 12, catAxisLabelFontFace: FONT, valAxisLabelFontSize: 10, valGridLine: { color: "E2E8F0", size: 0.5 }, barGapWidthPct: 60
    }, extra);

    /* 1 — Title */
    let s = P.addSlide();
    s.background = { color: NAVY };
    s.addShape(P.ShapeType.ellipse, { x: 9.3, y: -1.4, w: 6, h: 6, fill: { color: IND, transparency: 55 }, line: { color: IND, transparency: 100 } });
    s.addShape(P.ShapeType.ellipse, { x: 10.8, y: 4.2, w: 4.5, h: 4.5, fill: { color: CY, transparency: 70 }, line: { color: CY, transparency: 100 } });
    s.addText("ITEM ANALYSIS & PERFORMANCE SNAPSHOT", { x: 0.8, y: 1.7, w: 10, h: 0.4, fontFace: FONT, fontSize: 16, bold: true, color: "A5B4FC", charSpacing: 3 });
    s.addText(C.TITLE, { x: 0.8, y: 2.2, w: 10.5, h: 1.6, fontFace: FONT, fontSize: 44, bold: true, color: "FFFFFF", valign: "top" });
    s.addText(C.SUBTITLE, { x: 0.8, y: 3.9, w: 10, h: 0.5, fontFace: FONT, fontSize: 20, color: "C7D2FE" });
    s.addText(C.EVENT + "  ·  " + dateStr + "  ·  " + A.n + " participants who finished", { x: 0.8, y: 5.6, w: 11, h: 0.4, fontFace: FONT, fontSize: 14, color: "A5B4FC" });

    /* 2 — Snapshot */
    s = P.addSlide(); frame(s, "Performance snapshot", "Overall results of " + A.n + " participants (" + ITEMS.length + " items)");
    card(s, 0.65, 1.6, 2.35, 1.35, r1(A.mean) + " / " + N, "Mean score (" + pct(A.mean / N) + ")");
    card(s, 3.15, 1.6, 2.35, 1.35, r1(A.median), "Median score");
    card(s, 5.65, 1.6, 2.35, 1.35, A.min + " – " + A.max, "Lowest – highest");
    card(s, 8.15, 1.6, 2.35, 1.35, r1(A.sd), "Standard deviation");
    card(s, 10.65, 1.6, 2.0, 1.35, Math.round(A.avgTotal / 60 * 10) / 10 + " min", "Avg. total time");
    s.addText("Score distribution (number of participants)", { x: 0.65, y: 3.15, w: 7, h: 0.35, fontFace: FONT, fontSize: 14, bold: true, color: NAVY });
    s.addChart(P.ChartType.bar, [{ name: "Participants", labels: ["1 – 5", "6 – 10", "11 – 15"], values: A.bands }],
      barOpts({ x: 0.65, y: 3.5, w: 7, h: 3.4, chartColors: ["F87171", "FBBF24", "34D399"], dataLabelFormatCode: "0", valAxisMinVal: 0, valAxisLabelFormatCode: "0" }));
    const hi = A.bands[2], mid = A.bands[1], lo = A.bands[0];
    s.addText([
      { text: "What the data say", options: { bold: true, fontSize: 16, color: NAVY, breakLine: true } },
      { text: pct(hi / A.n) + " of participants scored 11–15 (" + hi + ").", options: { bullet: true, breakLine: true } },
      { text: pct(mid / A.n) + " scored 6–10 (" + mid + ").", options: { bullet: true, breakLine: true } },
      { text: pct(lo / A.n) + " scored 1–5 (" + lo + ")." + (A.zero ? " " + A.zero + " scored 0." : ""), options: { bullet: true, breakLine: true } },
      { text: "Mean score is " + r1(A.mean) + " out of " + N + " (" + pct(A.mean / N) + ").", options: { bullet: true } }
    ], { x: 8.0, y: 3.2, w: 4.7, h: 3.6, fontFace: FONT, fontSize: 14, color: INK, valign: "top", paraSpaceAfter: 6 });

    /* 3 — By subject */
    s = P.addSlide(); frame(s, "Performance by subject", "Mean percent correct per subject");
    const sj = window.SUBJECTS;
    s.addChart(P.ChartType.bar, [{ name: "Mean % correct", labels: sj.map(x => SUBN[x]), values: sj.map(x => A.subj[x]) }],
      barOpts({ x: 0.65, y: 1.5, w: 7.3, h: 5.2, chartColors: sj.map(x => SUBC[x]), dataLabelFormatCode: "0%", valAxisMaxVal: 1, valAxisMinVal: 0, valAxisLabelFormatCode: "0%" }));
    const sOrd = sj.slice().sort((a, b) => A.subj[b] - A.subj[a]);
    s.addText([
      { text: "Reading the chart", options: { bold: true, fontSize: 16, color: NAVY, breakLine: true } },
      { text: "Strongest: " + SUBN[sOrd[0]] + " (" + pct(A.subj[sOrd[0]]) + ").", options: { bullet: true, breakLine: true } },
      { text: "Needs most support: " + SUBN[sOrd[2]] + " (" + pct(A.subj[sOrd[2]]) + ").", options: { bullet: true, breakLine: true } },
      { text: "Each subject has 5 items; items are built on 21st century skills, not recall alone.", options: { bullet: true } }
    ], { x: 8.3, y: 1.7, w: 4.4, h: 4, fontFace: FONT, fontSize: 14, color: INK, valign: "top", paraSpaceAfter: 8 });

    /* 4 — By skill */
    s = P.addSlide(); frame(s, "Performance by 21st century skill", "Percent correct across all items measuring each skill", "0D9488");
    const sk = A.skills.slice().reverse();
    s.addChart(P.ChartType.bar, [{ name: "% correct", labels: sk.map(x => x.name + " (items " + x.items.join(", ") + ")"), values: sk.map(x => x.p) }],
      barOpts({ barDir: "bar", x: 0.65, y: 1.5, w: 8.2, h: 5.2, chartColors: [IND], dataLabelFormatCode: "0%", valAxisMaxVal: 1, valAxisMinVal: 0, valAxisLabelFormatCode: "0%", catAxisLabelFontSize: 11 }));
    s.addText([
      { text: "Highlights", options: { bold: true, fontSize: 16, color: NAVY, breakLine: true } },
      { text: "Strongest skill: " + A.skills[0].name + " (" + pct(A.skills[0].p) + ").", options: { bullet: true, breakLine: true } },
      { text: "Weakest skill: " + A.skills[A.skills.length - 1].name + " (" + pct(A.skills[A.skills.length - 1].p) + ").", options: { bullet: true, breakLine: true } },
      { text: "Skills with fewer items are less stable estimates.", options: { bullet: true } }
    ], { x: 9.1, y: 1.7, w: 3.7, h: 4, fontFace: FONT, fontSize: 14, color: INK, valign: "top", paraSpaceAfter: 8 });

    /* 5 — By district */
    s = P.addSlide(); frame(s, "Performance by district", "Mean score out of " + N + " (chart: districts with finishers; table: all districts)");
    const dd = A.districts;
    s.addChart(P.ChartType.bar, [{ name: "Mean score", labels: dd.map(x => x.name), values: dd.map(x => Math.round(x.mean * 10) / 10) }],
      barOpts({ x: 0.65, y: 1.5, w: 8.3, h: 5.3, chartColors: [CY], dataLabelFormatCode: "0.0", valAxisMaxVal: N, valAxisMinVal: 0, catAxisLabelFontSize: 10, catAxisLabelRotate: 315 }));
    const trows = [[{ text: "District", options: { bold: true, color: "FFFFFF", fill: { color: IND } } }, { text: "n", options: { bold: true, color: "FFFFFF", fill: { color: IND }, align: "center" } }, { text: "Mean", options: { bold: true, color: "FFFFFF", fill: { color: IND }, align: "center" } }]]
      .concat(C.DISTRICTS.concat(dd.map(x => x.name).filter(n => !C.DISTRICTS.includes(n))).map(nm => { const x = dd.find(y => y.name === nm); return [{ text: nm }, { text: x ? String(x.n) : "0", options: { align: "center" } }, { text: x ? r1(x.mean) : "–", options: { align: "center", color: x ? INK : "94A3B8" } }]; }));
    s.addTable(trows, { x: 9.2, y: 1.6, w: 3.6, colW: [1.8, 0.7, 1.1], fontFace: FONT, fontSize: 10, color: INK, border: { type: "solid", color: "E2E8F0", pt: 0.5 }, rowH: 0.27 });

    /* 6 — Item analysis table */
    s = P.addSlide(); frame(s, "Item analysis summary", "Difficulty index (p) = proportion correct · Discrimination (DI) = upper 27% minus lower 27%" + (A.n < 10 ? "  (DI needs at least 10 finishers)" : ""));
    const H = t => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: NAVY }, align: "center", fontSize: 10 } });
    const rowsT = [[H("#"), H("Subject"), H("21st century skill"), H("p"), H("Difficulty"), H("DI"), H("Discrimination"), H("Avg sec"), H("Over " + LIM + "s")]];
    A.items.forEach(x => {
      const pc = x.p >= .81 ? "FEF3C7" : x.p < .21 ? "FEE2E2" : "FFFFFF";
      const dc = x.di != null && x.di < .2 ? "FEE2E2" : "FFFFFF";
      rowsT.push([
        { text: String(x.i + 1), options: { align: "center", bold: true } },
        { text: SUBN[x.it.subject], options: { color: SUBC[x.it.subject], bold: true } },
        { text: x.it.skill }, { text: pct(x.p), options: { align: "center", fill: { color: pc } } },
        { text: levelOf(x.p), options: { align: "center", fill: { color: pc } } },
        { text: x.di == null ? "n/a" : x.di.toFixed(2), options: { align: "center", fill: { color: dc } } },
        { text: diOf(x.di), options: { align: "center", fill: { color: dc } } },
        { text: x.avgT ? String(Math.round(x.avgT)) : "–", options: { align: "center" } },
        { text: pct(x.ot), options: { align: "center", color: x.ot >= .5 ? RED : INK, bold: x.ot >= .5 } }]);
    });
    s.addTable(rowsT, { x: 0.65, y: 1.5, w: 12.1, colW: [0.5, 1.2, 2.5, 0.9, 1.4, 0.8, 1.9, 1.2, 1.7], fontFace: FONT, fontSize: 10.5, color: INK, border: { type: "solid", color: "E2E8F0", pt: 0.5 }, rowH: 0.33, valign: "middle" });

    /* 7 — Time on task */
    s = P.addSlide(); frame(s, "Time on task", "Average seconds spent per item (time allocation: " + LIM + " seconds)", "F59E0B");
    s.addChart(P.ChartType.bar, [
      { name: "Average seconds", labels: A.items.map(x => "Q" + (x.i + 1)), values: A.items.map(x => Math.round(x.avgT)) },
      { name: "Allocated seconds", labels: A.items.map(x => "Q" + (x.i + 1)), values: A.items.map(() => LIM) }],
      barOpts({ x: 0.65, y: 1.5, w: 8.6, h: 5.3, chartColors: [AMB, "CBD5E1"], showValue: false, showLegend: true, legendPos: "b", legendFontSize: 11, valAxisMinVal: 0, valAxisLabelFormatCode: "0" }));
    const otSorted = A.items.slice().sort((a, b) => b.ot - a.ot);
    s.addText([
      { text: "Most items that ran over time", options: { bold: true, fontSize: 16, color: NAVY, breakLine: true } },
      ...otSorted.slice(0, 4).map(x => ({ text: "Item " + (x.i + 1) + " (" + SUBN[x.it.subject] + "): " + pct(x.ot) + " went over " + LIM + "s, avg " + Math.round(x.avgT) + "s", options: { bullet: true, breakLine: true } })),
      { text: "Items with a high overtime rate may be too wordy or too hard to complete in " + LIM + " seconds.", options: { bullet: true } }
    ], { x: 9.5, y: 1.7, w: 3.3, h: 5, fontFace: FONT, fontSize: 13, color: INK, valign: "top", paraSpaceAfter: 8 });

    /* 8..22 — one slide per item */
    A.items.forEach(x => {
      const it = x.it, col = SUBC[it.subject];
      s = P.addSlide(); s.background = { color: "FFFFFF" };
      s.addShape(P.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.95, fill: { color: col }, line: { color: col } });
      s.addText("ITEM " + (x.i + 1) + "  ·  " + SUBN[it.subject].toUpperCase(), { x: 0.6, y: 0.12, w: 6, h: 0.7, fontFace: FONT, fontSize: 22, bold: true, color: "FFFFFF", valign: "middle" });
      s.addText(it.skill + "  ›  " + it.subskill, { x: 6.2, y: 0.12, w: 6.6, h: 0.7, fontFace: FONT, fontSize: 14, color: "FFFFFF", align: "right", valign: "middle" });
      s.addText("Content: " + it.content, { x: 0.6, y: 1.1, w: 12.1, h: 0.35, fontFace: FONT, fontSize: 12, italic: true, color: GRAY });
      s.addText(it.q, { x: 0.6, y: 1.5, w: 6.4, h: 1.2, fontFace: FONT, fontSize: 15, bold: true, color: INK, valign: "top" });
      s.addText(it.options.map((t, k) => {
        const L = "ABCD"[k], isKey = L === it.key;
        return { text: L + ".  " + t + (isKey ? "   ✓" : ""), options: { bold: isKey, color: isKey ? GREEN : INK, breakLine: true } };
      }), { x: 0.6, y: 2.75, w: 6.4, h: 3.0, fontFace: FONT, fontSize: 12, valign: "top", paraSpaceAfter: 6 });

      s.addText("Option choices (n = " + x.m + ")", { x: 7.3, y: 1.5, w: 5.4, h: 0.3, fontFace: FONT, fontSize: 13, bold: true, color: NAVY });
      const vals = ["A", "B", "C", "D"].map(L => x.m ? x.dist[L] / x.m : 0);
      s.addChart(P.ChartType.bar, [{ name: "% of participants", labels: ["A", "B", "C", "D"], values: vals }],
        barOpts({ x: 7.3, y: 1.8, w: 5.4, h: 2.7, chartColors: ["ABB5C4", "ABB5C4", "ABB5C4", "ABB5C4"].map((c, k) => "ABCD"[k] === it.key ? "22C55E" : c),
          dataLabelFormatCode: "0%", valAxisMaxVal: 1, valAxisMinVal: 0, valAxisLabelFormatCode: "0%" }));
      card(s, 7.3, 4.65, 1.28, 1.05, pct(x.p), "Difficulty (p)", x.p < .21 ? RED : x.p >= .81 ? AMB : IND);
      card(s, 8.68, 4.65, 1.28, 1.05, x.di == null ? "n/a" : x.di.toFixed(2), "Discrimination", x.di != null && x.di < .2 ? RED : IND);
      card(s, 10.06, 4.65, 1.28, 1.05, x.avgT ? Math.round(x.avgT) + "s" : "–", "Avg time", IND);
      card(s, 11.44, 4.65, 1.28, 1.05, pct(x.ot), "Over " + LIM + "s", x.ot >= .5 ? RED : IND);

      let action;
      if (x.di != null && x.di < 0) action = "The key may be wrong or the item is misleading: high scorers did worse than low scorers. Review before reuse.";
      else if (x.di != null && x.di < .2) action = "Weak discrimination: review the wording and distractors.";
      else if (x.p < .41) action = "Difficult for this group: strengthen instruction on this skill and content.";
      else if (x.p >= .81) action = "Very easy for this group: keep as a basic check, or raise the cognitive demand.";
      else action = "Works well: retain this item.";
      const wrongNote = x.m && x.wrongShare >= .3 ? " Option " + x.topWrong + " drew " + pct(x.wrongShare) + ", a likely common misconception." : "";
      s.addText([
        { text: levelOf(x.p) + " · " + (x.di == null ? "discrimination n/a" : diOf(x.di).toLowerCase() + " discrimination") + ". ", options: { bold: true, color: NAVY } },
        { text: action + wrongNote, options: { color: INK } }
      ], { x: 7.3, y: 5.85, w: 5.4, h: 1.1, fontFace: FONT, fontSize: 12, valign: "top" });
      s.addText("Why: " + it.why, { x: 0.6, y: 6.05, w: 6.4, h: 0.9, fontFace: FONT, fontSize: 10.5, italic: true, color: GRAY, valign: "top" });
    });

    /* 23 — Key findings */
    s = P.addSlide(); frame(s, "Key findings & recommendations", "Generated automatically from the results", "16A34A");
    const hardest = A.items.slice().sort((a, b) => a.p - b.p).slice(0, 3);
    const easiest = A.items.slice().sort((a, b) => b.p - a.p).slice(0, 2);
    const flagged = A.items.filter(x => x.di != null && x.di < .2);
    const wk = A.skills[A.skills.length - 1], st = A.skills[0];
    const bul = (t, b) => ({ text: t, options: { bullet: true, breakLine: true, bold: !!b } });
    s.addText([
      { text: "Findings", options: { bold: true, fontSize: 18, color: NAVY, breakLine: true } },
      bul("Overall mean: " + r1(A.mean) + "/" + N + " (" + pct(A.mean / N) + "); " + pct(A.bands[2] / A.n) + " scored 11–15."),
      bul("Strongest skill: " + st.name + " (" + pct(st.p) + "). Weakest: " + wk.name + " (" + pct(wk.p) + ")."),
      bul("Hardest items: " + hardest.map(x => "#" + (x.i + 1) + " (" + pct(x.p) + ")").join(", ") + "."),
      bul("Easiest items: " + easiest.map(x => "#" + (x.i + 1) + " (" + pct(x.p) + ")").join(", ") + "."),
      bul(flagged.length ? "Items to review (DI < 0.20): " + flagged.map(x => "#" + (x.i + 1)).join(", ") + "." : (A.n < 10 ? "Discrimination needs at least 10 finishers." : "No item has weak discrimination.")),
      bul("Highest overtime: Item " + (otSorted[0].i + 1) + " (" + pct(otSorted[0].ot) + " went over " + LIM + "s).")
    ], { x: 0.65, y: 1.6, w: 6.1, h: 5.2, fontFace: FONT, fontSize: 14, color: INK, valign: "top", paraSpaceAfter: 7 });
    s.addText([
      { text: "Recommendations", options: { bold: true, fontSize: 18, color: NAVY, breakLine: true } },
      bul("Focus follow-up learning on " + wk.name + " (items " + wk.items.join(", ") + ")."),
      bul("Use the hardest items as discussion cases: show the distractor most chosen and the reasoning behind the key."),
      bul("Revise or replace flagged items before reusing the test as a posttest."),
      bul("Items that ran over time: shorten the stem or allow more time."),
      bul("Model 21st century skills in school-level assessments and instructional supervision.")
    ], { x: 7.0, y: 1.6, w: 5.8, h: 5.2, fontFace: FONT, fontSize: 14, color: INK, valign: "top", paraSpaceAfter: 7 });

    /* 24 — Closing */
    s = P.addSlide(); s.background = { color: NAVY };
    s.addText("Maraming salamat!", { x: 0.8, y: 2.6, w: 11.5, h: 1.2, fontFace: FONT, fontSize: 48, bold: true, color: "FFFFFF" });
    s.addText("Results generated from " + A.n + " finished participants · " + dateStr, { x: 0.8, y: 3.9, w: 11.5, h: 0.5, fontFace: FONT, fontSize: 16, color: "A5B4FC" });

    const fn = "NAT21_Item_Analysis_" + new Date().toISOString().slice(0, 10) + ".pptx";
    return P.writeFile({ fileName: fn });
  }

  window.buildDeck = buildDeck;
  window.analyzeRows = analyze;
})();
