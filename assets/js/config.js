/* ============================================================
   config.js — Ad network configuration
   Sirf ye file edit karo ads set karne ke liye. Baaki code untouched.
   ============================================================ */
window.AD_CONFIG = {

  /* ---------- GOOGLE ADSENSE ---------- */
  adsense: {
    enabled: false,
    publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',
    slots: {
      'ad-hero':            '0000000000',
      'ad-after-why':       '0000000000',
      'ad-after-framework': '0000000000',
      'ad-after-stories':   '0000000000',
      'ad-before-cta':      '0000000000'
    }
  },

  /* ---------- ADSTERRA ---------- */
  adsterra: {
    enabled: false,
    globalScripts: [
      /* 'Social Bar / Popunder ka poora <script> tag yahan paste karo' */
    ],
    slots: {
      'ad-hero':            '',
      'ad-after-why':       '',
      'ad-after-framework': '',
      'ad-after-stories':   '',
      'ad-before-cta':      ''
    }
  }

};
