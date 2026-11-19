(function () {
  "use strict";

  // Kopfzeile
  var kopf = document.querySelector(".kopf");
  var knopf = document.querySelector(".menu-knopf");
  var nav = document.getElementById("nav");
  if (knopf && nav) {
    knopf.addEventListener("click", function () {
      var offen = nav.classList.toggle("offen");
      knopf.setAttribute("aria-expanded", offen ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { nav.classList.remove("offen"); knopf.setAttribute("aria-expanded", "false"); }
    });
  }
  if (kopf) {
    var onScroll = function () { kopf.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Lightbox für Bilder
  var box = document.createElement("div");
  box.className = "lightbox";
  box.hidden = true;
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", "Bild in gross");
  box.innerHTML = '<button type="button" aria-label="Schliessen">&times;</button><img alt="">';
  document.body.appendChild(box);
  var letzterFokus = null;
  function zu() { box.hidden = true; if (letzterFokus) letzterFokus.focus(); }
  box.addEventListener("click", zu);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !box.hidden) zu(); });
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-lightbox]");
    if (!a) return;
    e.preventDefault();
    letzterFokus = a;
    var bild = box.querySelector("img");
    bild.src = a.getAttribute("href");
    bild.alt = (a.querySelector("img") || {}).alt || "";
    box.hidden = false;
    box.querySelector("button").focus();
  });

  // Jahresprogramm
  var ziel = document.getElementById("programm");
  if (ziel && window.EVENTS) {
    var MON = ["Jan.", "Feb.", "März", "April", "Mai", "Juni", "Juli", "Aug.", "Sept.", "Okt.", "Nov.", "Dez."];
    var TAG = ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."];
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
    var zeit = function (d) { return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); };
    var jetzt = new Date();
    var alle = window.EVENTS.map(function (e) {
      var s = new Date(e.start), en = e.ende ? new Date(e.ende) : new Date(s.getFullYear(), s.getMonth(), s.getDate(), 23, 59);
      return { e: e, s: s, en: en };
    });
    var karte = function (x, kommend) {
      var e = x.e, s = x.s;
      var wann = TAG[s.getDay()] + ", " + s.getDate() + ". " + MON[s.getMonth()] + " " + s.getFullYear() + ", " + zeit(s) + (e.ende ? " – " + zeit(x.en) : "") + " Uhr";
      var bilder = (e.bilder || []).map(function (b) {
        return '<a href="assets/img/' + esc(b) + '" data-lightbox><img src="assets/img/' + esc(b) + '" alt="' + esc(e.titel) + '" loading="lazy"></a>';
      }).join("");
      return '<li><details class="event' + (kommend ? " kommend" : "") + '"' + (kommend ? " open" : "") + ">" +
        '<summary><div class="event-datum"><b>' + s.getDate() + "</b><span>" + MON[s.getMonth()] + "</span></div>" +
        '<div><div class="event-titel">' + esc(e.titel) + "</div>" +
        '<div class="event-meta">' + TAG[s.getDay()] + " " + zeit(s) + " Uhr · " + esc(e.ort) + "</div></div>" +
        '<span class="event-pfeil" aria-hidden="true"></span></summary>' +
        '<div class="event-inhalt' + (bilder ? "" : " ohne-bild") + '">' +
        (bilder ? '<div class="event-bilder">' + bilder + "</div>" : "") +
        "<div><h3>Zeit &amp; Ort</h3><p>" + esc(wann) + "\n" + esc(e.ort) + "</p>" +
        (e.kurz ? "<h3>Über die Veranstaltung</h3><p>" + esc(e.kurz) + "</p>" : "") +
        (e.text ? "<p><br>" + esc(e.text) + "</p>" : "") +
        "</div></div></details></li>";
    };
    var kommend = alle.filter(function (x) { return x.en >= jetzt; }).sort(function (a, b) { return a.s - b.s; });
    var vorbei = alle.filter(function (x) { return x.en < jetzt; }).sort(function (a, b) { return b.s - a.s; });
    var html = "";
    if (kommend.length) {
      html += '<h2 class="jahr">Demnächst</h2><ul class="events">' + kommend.map(function (x) { return karte(x, true); }).join("") + "</ul>";
    }
    if (vorbei.length) html += '<p class="label gross rueckblick">Rückblick</p>';
    var jahr = null;
    vorbei.forEach(function (x) {
      var j = x.s.getFullYear();
      if (j !== jahr) { html += (jahr ? "</ul>" : "") + '<h2 class="jahr">' + j + '</h2><ul class="events">'; jahr = j; }
      html += karte(x, false);
    });
    if (jahr) html += "</ul>";
    ziel.innerHTML = html;
  }

  // Sanftes Einblenden beim Scrollen
  var teile = document.querySelectorAll(".auftauchen");
  if ("IntersectionObserver" in window) {
    var beob = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("sichtbar"); beob.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    teile.forEach(function (t) { beob.observe(t); });
  } else {
    teile.forEach(function (t) { t.classList.add("sichtbar"); });
  }

  // Froschfamilie: antippen wechselt zur Feierabend-Version
  document.querySelectorAll(".frosch-wechsel").forEach(function (b) {
    b.addEventListener("click", function () {
      var an = b.classList.toggle("an");
      b.setAttribute("aria-pressed", an ? "true" : "false");
    });
  });

  // Anmeldeformular
  // Das Formular wird ganz normal an FormSubmit (formsubmit.co) geschickt – die Adresse steht
  // in verein.html im action-Attribut. Hier werden nur Betreff und Danke-Seite ergänzt.
  var form = document.getElementById("anmeldung");
  if (form) {
    form.addEventListener("submit", function () {
      var vor = form.elements["Vorname"], nach = form.elements["Nachname"];
      var name = ((vor ? vor.value : "") + " " + (nach ? nach.value : "")).trim();
      if (name) form.elements["_subject"].value = "Neue Anmeldung Verein: " + name;
      form.elements["_next"].value = new URL("danke.html", window.location.href).href;
      var k = form.querySelector('button[type="submit"]');
      if (k) { k.textContent = "Wird gesendet …"; setTimeout(function () { k.disabled = true; }, 0); }
    });
  }
})();
