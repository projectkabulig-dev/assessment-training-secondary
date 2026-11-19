/* ==========================================================
   CONFIG — dito lang ang kailangang baguhin
   ========================================================== */
window.CONFIG = {
  // I-paste dito ang Web App URL ng Google Apps Script (nagtatapos sa /exec).
  // Kapag walang laman, tatakbo ang app sa DEMO MODE (naka-save lang sa browser na ito).
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbxnNzAWRKMowBw3j-2UIA0zGNM8WUiX5asGsbGpzp4sWxs1_4PHyW93_9-Fg7jFqRPs/exec",

  TITLE: "NAT Grade 12 · 21st Century Skills",
  SUBTITLE: "Sample Online Test para sa mga School Head",
  EVENT: "SDO Romblon · Curriculum Implementation Division",

  SECONDS_PER_ITEM: 60,   // time allocation bawat item
  WARN_AT: 10,            // babala kapag ito na lang ang natitirang segundo
  CAUTION_AT: 20,         // dilaw na kulay

  // Palitan kung kailangan (lahat ng municipality; idagdag o alisin kung kailangan)
  DISTRICTS: [
    "Alcantara", "Banton", "Cajidiocan", "Calatrava", "Concepcion", "Corcuera", "Ferrol", "Looc",
    "Magdiwang", "Odiongan", "Romblon", "San Agustin", "San Andres", "San Fernando", "San Jose",
    "Santa Fe", "Santa Maria"
  ],

  POLL_MS: 3000           // gaano kadalas mag-refresh ang dashboard
};
