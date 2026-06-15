// ==UserScript==
// @name         BetterEvent — JugRu
// @namespace    https://github.com/Sdju/betterevent
// @version      0.2.0
// @description  BetterEvent на beta.jugru.org
// @author       grindpride
// @match        *://beta.jugru.org/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  // Локально: vp run build && vp preview → http://127.0.0.1:4173/betterevent/
  const BASE = "https://sdju.github.io/betterevent/";
  const q = `?_=${Date.now()}`;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `${BASE}widget.css${q}`;
  document.head.append(link);

  const script = document.createElement("script");
  script.src = `${BASE}widget.js${q}`;
  document.head.append(script);
})();
