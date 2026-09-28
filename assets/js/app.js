/* ============================================================
   app.js — Relationships With Aly
   Ad loaders + code protection layers.
   NOTE: Is file ko obfuscate karna recommended hai (neeche dekho).
   ============================================================ */
(function(){
  'use strict';

  /* ---------- Guard: agar config missing hai to chup-chaap kuchh mat karo ---------- */
  var CFG = window.AD_CONFIG || {};

  /* ============================================================
     HELPERS
     ============================================================ */
  function injectHTML(container, html){
    container.innerHTML = '';
    var temp = document.createElement('div');
    temp.innerHTML = html;
    Array.prototype.slice.call(temp.childNodes).forEach(function(node){
      if (node.nodeType === 1 && node.tagName === 'SCRIPT'){
        var s = document.createElement('script');
        Array.prototype.slice.call(node.attributes).forEach(function(attr){
          s.setAttribute(attr.name, attr.value);
        });
        s.textContent = node.textContent;
        container.appendChild(s);
      } else {
        container.appendChild(node);
      }
    });
  }

  /* ============================================================
     1. GOOGLE ADSENSE
     ============================================================ */
  function initAdsense(cfg){
    if (!cfg || !cfg.enabled) return;
    if (!cfg.publisherId || cfg.publisherId.indexOf('XXXX') !== -1) return;

    document.querySelectorAll('.ad-slot').forEach(function(wrapper){
      var name = wrapper.getAttribute('data-ad-name');
      var ins  = wrapper.querySelector('.adsbygoogle');
      if (!ins || !name) return;
      var slot = cfg.slots && cfg.slots[name];
      if (!slot || slot === '0000000000') return;
      ins.setAttribute('data-ad-client', cfg.publisherId);
      ins.setAttribute('data-ad-slot', slot);
    });

    var s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + cfg.publisherId;
    s.onload = function(){
      document.querySelectorAll('.adsbygoogle').forEach(function(){
        try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch(_){}
      });
    };
    document.head.appendChild(s);
  }

  /* ============================================================
     2. ADSTERRA
     ============================================================ */
  function initAdsterra(cfg){
    if (!cfg || !cfg.enabled) return;

    if (Array.isArray(cfg.globalScripts)){
      cfg.globalScripts.forEach(function(code){
        if (typeof code !== 'string' || !code.trim()) return;
        var holder = document.createElement('div');
        holder.style.display = 'none';
        document.body.appendChild(holder);
        injectHTML(holder, code);
      });
    }

    document.querySelectorAll('.ad-slot').forEach(function(wrapper){
      var name = wrapper.getAttribute('data-ad-name');
      if (!name) return;
      var code = cfg.slots && cfg.slots[name];
      if (typeof code !== 'string' || !code.trim()) return;

      var label = wrapper.querySelector('.ad-label');
      wrapper.innerHTML = '';
      if (label) wrapper.appendChild(label);

      var box = document.createElement('div');
      box.className = 'ad-injected';
      wrapper.appendChild(box);
      injectHTML(box, code);
    });
  }

  /* ============================================================
     3. Auto-hide empty ad slots
     ============================================================ */
  function hideEmptySlots(){
    document.querySelectorAll('.ad-slot').forEach(function(wrapper){
      var hasAdsense  = wrapper.querySelector('.adsbygoogle[data-ad-client]:not([data-ad-client=""])');
      var injected    = wrapper.querySelector('.ad-injected');
      var hasAdsterra = injected && injected.children.length > 0;
      if (!hasAdsense && !hasAdsterra) wrapper.style.display = 'none';
    });
  }

  /* ============================================================
     4. CODE PROTECTION — right-click, drag, keys
     ============================================================ */
  function applyProtection(){
    var protectedSelectors = ['.hero .convo', '.about-art', 'img', 'video', 'iframe'];
    var protectedEls = document.querySelectorAll(protectedSelectors.join(','));

    protectedEls.forEach(function(el){
      ['contextmenu','dragstart','selectstart','mousedown'].forEach(function(evt){
        el.addEventListener(evt, function(e){
          if (evt === 'mousedown' && e.button !== 2) return;
          e.preventDefault();
          return false;
        }, { passive:false, capture:true });
      });
    });

    document.addEventListener('contextmenu', function(e){
      var t = e.target;
      if (t && (t.tagName === 'IMG' || t.classList && (t.classList.contains('about-art') || t.closest('.hero .convo')))){
        e.preventDefault();
        return false;
      }
    }, true);

    document.addEventListener('keydown', function(e){
      var k = e.key;
      if (k === 'F12'){ e.preventDefault(); e.stopPropagation(); return false; }
      if ((e.ctrlKey && e.shiftKey) || (e.metaKey && e.altKey)){
        if (['I','J','C','i','j','c'].indexOf(k) > -1){ e.preventDefault(); e.stopPropagation(); return false; }
      }
      if ((e.ctrlKey || e.metaKey) && ['u','U','s','S','p','P'].indexOf(k) > -1){
        e.preventDefault(); e.stopPropagation(); return false;
      }
    }, true);

    document.querySelectorAll('img').forEach(function(img){
      img.setAttribute('draggable','false');
      img.setAttribute('oncontextmenu','return false;');
      img.style.webkitUserDrag = 'none';
      img.style.userSelect = 'none';
      img.style.webkitUserSelect = 'none';
    });
  }

  /* ============================================================
     5. Console silence (production)
     ============================================================ */
  function silenceConsole(){
    try {
      var noop = function(){};
      var fakeConsole = { log:noop, info:noop, warn:noop, error:noop, debug:noop,
                          trace:noop, dir:noop, table:noop, group:noop, groupEnd:noop };
      Object.defineProperty(window, 'console', { value: fakeConsole, writable:false, configurable:false });
    } catch(_){}
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot(){
    initAdsense(CFG.adsense);
    initAdsterra(CFG.adsterra);
    setTimeout(hideEmptySlots, 600);
    applyProtection();
    silenceConsole();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
