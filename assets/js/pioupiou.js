/* PIOUPIOU — assistante virtuelle SOS DOC (accueil des parents) */
!function(){
  "use strict";
  var WA_CONTACT = "242055972427";
  var WA_MOBILE_MONEY = "+242 06 656 50 50";
  var WA_AIRTEL_MONEY = "+242 05 597 24 27";

  function lang(){
    try { return localStorage.getItem("sosdoc_lang") === "en" ? "en" : "fr"; } catch(e){ return "fr"; }
  }
  function waLink(text){
    return "https://wa.me/" + WA_CONTACT + "?text=" + encodeURIComponent(text);
  }

  var KB = {
    fr: [
      { k: ["bonjour","salut","bjr","coucou","hello"],
        a: "Bonjour ! 🐣 Je suis <b>PIOUPIOU</b>, l'amie des enfants et des parents chez SOS DOC. Je peux t'expliquer comment obtenir une consultation avec un docteur, comment payer, ou répondre à tes questions. Qu'est-ce qui t'amène ?",
        chips: ["Comment ça marche ?","Comment payer ?","Parler à un humain"] },
      { k: ["comment ça marche","procedure","procédure","inscription","dossier","etapes","étapes","comment faire"],
        a: "C'est tout simple ! 💛<br>1️⃣ On crée le <b>dossier de l'enfant</b> (nom, âge, ville…)<br>2️⃣ On décrit la situation — par texte, message vocal, photo ou vidéo<br>3️⃣ Un <b>docteur vérifié</b> répond et peut fixer un <b>rendez-vous de contrôle</b><br>4️⃣ On règle la consultation<br>5️⃣ Le docteur envoie son <b>ordonnance</b>, et je transmets un petit mot de prompt rétablissement sur WhatsApp, avec le prénom de l'enfant 🌈",
        chips: ["Créer le dossier","Comment payer ?"] },
      { k: ["payer","paiement","mobile money","airtel","argent","tarif","prix","combien","cout","coût"],
        a: "Le règlement se fait facilement par <b>Mobile Money</b> ou <b>Airtel Money</b> 💳<br>📱 Mobile Money : <b>" + WA_MOBILE_MONEY + "</b><br>📱 Airtel Money : <b>" + WA_AIRTEL_MONEY + "</b><br>Une fois le paiement confirmé et l'ordonnance du docteur reçue, j'envoie un message de prompt rétablissement directement sur le WhatsApp inscrit dans le dossier — avec le prénom du petit patient. 🥰",
        chips: ["Comment ça marche ?","Parler à un humain"] },
      { k: ["ordonnance","prescription","medicament","médicament","traitement"],
        a: "Une fois que le docteur a examiné la situation, il peut rédiger une <b>ordonnance</b>. Dès qu'elle est prête (et la consultation réglée), j'envoie tout de suite un petit message d'encouragement sur WhatsApp, en citant le prénom de l'enfant, pour lui souhaiter un prompt rétablissement. 💌",
        chips: ["Comment payer ?"] },
      { k: ["urgence","urgent","danger","grave"],
        a: "🚨 Si la vie de l'enfant est en danger, contacte <b>immédiatement les secours de ton pays</b>. SOS DOC ne remplace pas les services d'urgence locaux — mais tu peux aussi signaler la situation comme prioritaire dans le formulaire, pour que le docteur réponde plus vite.",
        chips: ["Créer le dossier"] },
      { k: ["whatsapp","humain","medecin","médecin","docteur","parler","contact","appeler"],
        a: "Bien sûr ! Je peux te mettre directement en contact avec l'équipe SOS DOC sur WhatsApp. 💬",
        chips: [] },
      { k: ["merci"],
        a: "Avec grand plaisir ! 🐥 Je reste juste ici si tu as une autre question.",
        chips: ["Comment ça marche ?"] },
      { k: ["qui es tu","qui es-tu","pioupiou","tu es qui"],
        a: "Je suis PIOUPIOU 🐣, la mascotte de SOS DOC ! Je suis là pour accueillir les parents et rassurer les enfants avant de parler au docteur. On y va ensemble ?",
        chips: ["Comment ça marche ?"] }
    ]
  };

  var STR = {
    fr: {
      greeting: "Bonjour ! 🐣 Je suis <b>PIOUPIOU</b>, l'amie des enfants et des parents chez SOS DOC. Je peux t'expliquer comment obtenir une consultation avec un docteur, comment payer, ou répondre à tes questions. Qu'est-ce qui t'amène ?",
      greetingChips: ["Comment ça marche ?","Comment payer ?","Parler à un humain"],
      defaultReply: "Je note ta question ! Pour une réponse précise, je peux transmettre ça directement à l'équipe SOS DOC sur WhatsApp. Tu veux que je l'envoie ?",
      defaultChips: ["Oui, envoyer sur WhatsApp","Comment ça marche ?"],
      waConfirm: "Parfait ! J'ouvre WhatsApp avec ton message tout prêt. 💛",
      waSendNow: "💬 Envoyer sur WhatsApp",
      relayText: function(t){ return "Bonjour SOS DOC, je viens de discuter avec PIOUPIOU sur le site à propos de : \"" + t + "\". Pouvez-vous me recontacter ?"; },
      noThanksReply: "Avec plaisir ! Je reste juste ici si besoin. 🐥",
      online: "Prête à t'aider",
      placeholder: "Écris ta question…",
      disclaimer: "PIOUPIOU relaie vos questions à l'équipe SOS DOC (WhatsApp) avant toute réponse engageante.",
      ariaOpen: "Ouvrir PIOUPIOU, l'assistante de SOS DOC",
      ariaClose: "Fermer",
      voiceOn: "Voix activée — PIOUPIOU te lit ses réponses",
      voiceOff: "Activer la voix de PIOUPIOU",
      listening: "Je t'écoute…"
    }
  };

  var VOICE_KEY = "pioupiou_voice_on";
  var voiceEnabled = false;
  try { voiceEnabled = localStorage.getItem(VOICE_KEY) === "1"; } catch(e){}
  var cachedVoices = [];
  if ("speechSynthesis" in window){
    function refreshVoices(){ cachedVoices = window.speechSynthesis.getVoices() || []; }
    refreshVoices();
    if ("onvoiceschanged" in window.speechSynthesis) window.speechSynthesis.onvoiceschanged = refreshVoices;
  }
  function pickVoice(){
    if (!cachedVoices.length) return null;
    var preferred = ["Google français","Amélie","Microsoft Julie","Microsoft Denise"];
    for (var i=0; i<preferred.length; i++){
      var m = cachedVoices.filter(function(v){ return v.name === preferred[i]; })[0];
      if (m) return m;
    }
    var fem = cachedVoices.filter(function(v){ return v.lang && v.lang.toLowerCase().indexOf("fr") === 0 && /female|woman/i.test(v.name); })[0];
    if (fem) return fem;
    return cachedVoices.filter(function(v){ return v.lang && v.lang.toLowerCase().indexOf("fr") === 0; })[0] || null;
  }
  function stripHTML(html){
    var d = document.createElement("div");
    d.innerHTML = html;
    return (d.textContent || d.innerText || "").replace(/\s+/g," ").trim();
  }
  function speak(html){
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    var text = stripHTML(html);
    if (!text) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "fr-FR";
      var v = pickVoice();
      if (v) u.voice = v;
      u.rate = 1.02;
      u.pitch = 1.45;
      u.volume = 1;
      u.onstart = function(){ document.body.classList.add("pp-speaking"); };
      u.onend = u.onerror = function(){ document.body.classList.remove("pp-speaking"); };
      window.speechSynthesis.speak(u);
    } catch(e){}
  }

  var STYLE = "" +
  ".pp-launcher{position:fixed;bottom:26px;right:26px;z-index:90;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;background:linear-gradient(135deg,var(--gold),#F2C878);box-shadow:0 12px 30px -6px rgba(227,169,74,.5);animation:ppFloat 3.8s ease-in-out infinite}" +
  "@keyframes ppFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}" +
  ".pp-launcher .pp-avatar{width:100%;height:100%;border-radius:50%;overflow:hidden;background-image:url('assets/img/pioupiou-avatar.webp');background-size:cover;background-position:center;animation:ppBreathe 4.4s ease-in-out infinite alternate}" +
  "@keyframes ppBreathe{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}" +
  ".pp-dot{position:absolute;top:5px;right:5px;width:11px;height:11px;border-radius:50%;background:#4CA783;border:2px solid var(--bg)}" +
  ".pp-panel{position:fixed;bottom:98px;right:26px;z-index:95;width:340px;max-width:90vw;height:min(520px,72vh);background:var(--bg-panel);border:1px solid var(--blue-dim);border-radius:20px;box-shadow:0 30px 70px -20px rgba(0,0,0,.6);display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(20px) scale(.97);pointer-events:none;transition:.28s ease}" +
  ".pp-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}" +
  ".pp-hero{position:relative;height:172px;flex:none;overflow:hidden;background:linear-gradient(160deg,#101C33,#070B14)}" +
  ".pp-hero-img{position:absolute;left:50%;bottom:0;width:132px;height:172px;transform:translateX(-50%);background-image:url('assets/img/pioupiou-hero.webp');background-size:cover;background-position:top center;border-radius:14px 14px 0 0;filter:drop-shadow(0 10px 16px rgba(0,0,0,.4));animation:ppHeroBreathe 4.2s ease-in-out infinite}" +
  "@keyframes ppHeroBreathe{0%,100%{transform:translateX(-50%) translateY(0) scale(1)}50%{transform:translateX(-50%) translateY(-4px) scale(1.02)}}" +
  "@keyframes ppHeroTalk{0%,100%{transform:translateX(-50%) translateY(0) scale(1)}50%{transform:translateX(-50%) translateY(-2px) scale(1.04)}}" +
  "body.pp-speaking .pp-hero-img{animation:ppHeroTalk .45s ease-in-out infinite}" +
  ".pp-hero.pp-listening .pp-hero-img{animation:ppHeroBreathe 4.2s ease-in-out infinite,ppListenGlow 1.4s ease-in-out infinite}" +
  "@keyframes ppListenGlow{0%,100%{box-shadow:0 10px 16px rgba(0,0,0,.4)}50%{box-shadow:0 0 0 5px rgba(63,169,160,.45),0 10px 16px rgba(0,0,0,.4)}}" +
  ".pp-tag{position:absolute;top:14px;left:16px;z-index:2}" +
  ".pp-tag b{display:block;font-family:var(--sans);font-size:.9rem;color:#fff}" +
  ".pp-tag small{font-family:var(--mono);font-size:.68rem;color:#8fd6c9;display:flex;align-items:center;gap:5px}" +
  ".pp-tag small::before{content:'';width:6px;height:6px;border-radius:50%;background:#4CA783}" +
  ".pp-voice-btn,.pp-close{position:absolute;top:12px;z-index:2;width:28px;height:28px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.28);color:#EEF1F7;display:flex;align-items:center;justify-content:center;cursor:pointer}" +
  ".pp-close{right:12px}.pp-voice-btn{right:46px}" +
  ".pp-voice-btn svg,.pp-close svg{width:14px;height:14px}" +
  "body.pp-voice-on .pp-voice-btn{background:var(--gold);border-color:transparent;color:#1a1204}" +
  ".pp-body{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:10px;background:var(--bg-panel)}" +
  ".pp-msg{max-width:88%;padding:10px 13px;border-radius:14px;font-family:var(--sans);font-size:13.5px;line-height:1.5;color:var(--ink)}" +
  ".pp-msg.bot{align-self:flex-start;background:var(--bg-field,#0B1524);border:1px solid var(--blue-dim);border-bottom-left-radius:4px}" +
  ".pp-msg.user{align-self:flex-end;background:var(--gold);color:#1a1204;font-weight:600;border-bottom-right-radius:4px}" +
  ".pp-quick{display:flex;flex-wrap:wrap;gap:7px;margin:2px 0 4px}" +
  ".pp-chip{font-family:var(--sans);font-size:12px;border:1px solid var(--gold-line);color:var(--gold);background:transparent;border-radius:999px;padding:7px 12px;cursor:pointer}" +
  ".pp-chip:hover{background:rgba(227,169,74,.14)}" +
  ".pp-typing{display:flex;gap:4px;padding:10px 13px;background:var(--bg-field,#0B1524);border-radius:14px;width:fit-content;align-self:flex-start}" +
  ".pp-typing span{width:6px;height:6px;border-radius:50%;background:var(--ink-faint);animation:ppTypingDot 1.2s ease-in-out infinite}" +
  ".pp-typing span:nth-child(2){animation-delay:.15s}.pp-typing span:nth-child(3){animation-delay:.3s}" +
  "@keyframes ppTypingDot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-4px);opacity:1}}" +
  ".pp-foot{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--blue-dim);flex:none}" +
  ".pp-foot input{flex:1;background:var(--bg-field,#0B1524);border:1px solid var(--blue-dim);border-radius:999px;padding:10px 14px;color:var(--ink);font-size:13px;font-family:var(--sans)}" +
  ".pp-foot input:focus{outline:none;border-color:var(--gold-line)}" +
  ".pp-foot button{width:38px;height:38px;border-radius:50%;border:none;background:var(--gold);color:#1a1204;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:none}" +
  ".pp-foot button svg{width:16px;height:16px}" +
  ".pp-disclaimer{font-family:var(--mono);font-size:9.5px;color:var(--ink-faint);text-align:center;padding:0 14px 10px;letter-spacing:.02em}" +
  "@media (max-width:480px){.pp-panel{right:12px;bottom:88px;width:calc(100vw - 24px)}.pp-launcher{right:16px;bottom:16px;width:54px;height:54px}}";

  function el(tag, cls, html){
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function init(){
    var styleEl = document.createElement("style");
    styleEl.textContent = STYLE;
    document.head.appendChild(styleEl);

    var launcher = el("button","pp-launcher");
    launcher.setAttribute("aria-label", STR.fr.ariaOpen);
    launcher.innerHTML = '<div class="pp-avatar"></div><span class="pp-dot"></span>';
    document.body.appendChild(launcher);

    var panel = el("div","pp-panel");
    document.body.appendChild(panel);

    var hasVoice = "speechSynthesis" in window;
    var greeted = false, open = false;

    function render(){
      var s = STR.fr;
      panel.innerHTML =
        '<div class="pp-hero">' +
          '<div class="pp-hero-img"></div>' +
          '<div class="pp-tag"><b>PIOUPIOU</b><small>' + s.online + '</small></div>' +
          (hasVoice ? '<button class="pp-voice-btn" type="button" aria-pressed="' + voiceEnabled + '" title="' + (voiceEnabled ? s.voiceOn : s.voiceOff) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg></button>' : '') +
          '<button class="pp-close" aria-label="' + s.ariaClose + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
        '</div>' +
        '<div class="pp-body" id="ppBody"></div>' +
        '<form class="pp-foot" id="ppForm">' +
          '<input type="text" id="ppInput" placeholder="' + s.placeholder + '" autocomplete="off">' +
          '<button type="submit" aria-label="Envoyer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2 11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg></button>' +
        '</form>' +
        '<div class="pp-disclaimer">' + s.disclaimer + '</div>';
      document.body.classList.toggle("pp-voice-on", voiceEnabled);
    }
    render();

    var body = panel.querySelector("#ppBody");
    var form = panel.querySelector("#ppForm");
    var input = panel.querySelector("#ppInput");
    var closeBtn = panel.querySelector(".pp-close");
    var voiceBtn = panel.querySelector(".pp-voice-btn");
    var heroEl = panel.querySelector(".pp-hero");

    function scrollDown(){ body.scrollTop = body.scrollHeight; }

    function addBot(html, chips){
      var msg = el("div","pp-msg bot", html);
      body.appendChild(msg);
      speak(html);
      if (chips && chips.length){
        var q = el("div","pp-quick");
        chips.forEach(function(c){
          var b = el("button","pp-chip", c);
          b.type = "button";
          b.addEventListener("click", function(){ handle(c); });
          q.appendChild(b);
        });
        body.appendChild(q);
      }
      scrollDown();
    }
    function addUser(text){
      var safe = text.replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; });
      body.appendChild(el("div","pp-msg user", safe));
      scrollDown();
    }
    function showTyping(cb){
      var t = el("div","pp-typing","<span></span><span></span><span></span>");
      body.appendChild(t);
      scrollDown();
      setTimeout(function(){ t.remove(); cb(); }, 500 + Math.random()*400);
    }
    function findAnswer(text){
      var t = text.toLowerCase();
      var entries = KB.fr;
      for (var i=0;i<entries.length;i++){
        for (var j=0;j<entries[i].k.length;j++){
          if (t.indexOf(entries[i].k[j]) !== -1) return entries[i];
        }
      }
      return null;
    }
    function handle(text){
      addUser(text);
      input.value = "";
      var t = text.toLowerCase();
      var s = STR.fr;
      if (t.indexOf("whatsapp") !== -1 || t.indexOf("humain") !== -1 || t.indexOf("docteur") !== -1 || t.indexOf("médecin") !== -1 || t.indexOf("medecin") !== -1){
        showTyping(function(){
          addBot(KB.fr.filter(function(e){return e.k.indexOf("whatsapp")!==-1;})[0].a);
          var q = el("div","pp-quick");
          var a = el("a","pp-chip", s.waSendNow);
          a.href = waLink("Bonjour SOS DOC, je souhaite parler à un médecin pour mon enfant.");
          a.target = "_blank"; a.rel = "noopener";
          q.appendChild(a);
          body.appendChild(q);
          scrollDown();
        });
        return;
      }
      if (t.indexOf("oui") !== -1 && (t.indexOf("whatsapp") !== -1 || t.indexOf("envoyer") !== -1)){
        showTyping(function(){
          addBot(s.waConfirm);
          window.open(waLink(s.relayText(text)), "_blank");
        });
        return;
      }
      if (t.indexOf("non merci") !== -1 || t.indexOf("non, merci") !== -1){
        showTyping(function(){ addBot(s.noThanksReply); });
        return;
      }
      if (t.indexOf("créer le dossier") !== -1 || t.indexOf("creer le dossier") !== -1){
        window.location.href = "espace-patient.html";
        return;
      }
      var match = findAnswer(text);
      showTyping(function(){
        if (match) addBot(match.a, match.chips);
        else addBot(s.defaultReply, s.defaultChips);
      });
    }

    form.addEventListener("submit", function(e){
      e.preventDefault();
      var v = input.value.trim();
      if (v) handle(v);
    });
    closeBtn.addEventListener("click", function(){
      panel.classList.remove("open");
      if ("speechSynthesis" in window){ window.speechSynthesis.cancel(); document.body.classList.remove("pp-speaking"); }
    });
    if (voiceBtn){
      voiceBtn.addEventListener("click", function(){
        voiceEnabled = !voiceEnabled;
        try { localStorage.setItem(VOICE_KEY, voiceEnabled ? "1" : "0"); } catch(e){}
        var s = STR.fr;
        voiceBtn.setAttribute("aria-pressed", voiceEnabled);
        voiceBtn.title = voiceEnabled ? s.voiceOn : s.voiceOff;
        document.body.classList.toggle("pp-voice-on", voiceEnabled);
        if (!voiceEnabled && "speechSynthesis" in window){ window.speechSynthesis.cancel(); document.body.classList.remove("pp-speaking"); }
      });
    }
    input.addEventListener("focus", function(){
      heroEl.classList.add("pp-listening");
      var tag = heroEl.querySelector(".pp-tag small");
      if (tag) tag.textContent = STR.fr.listening;
    });
    input.addEventListener("blur", function(){
      heroEl.classList.remove("pp-listening");
      var tag = heroEl.querySelector(".pp-tag small");
      if (tag) tag.textContent = STR.fr.online;
    });

    launcher.addEventListener("click", function(){
      open = !open;
      panel.classList.toggle("open", open);
      if (open){
        if (!greeted){
          showTyping(function(){ addBot(STR.fr.greeting, STR.fr.greetingChips); });
          greeted = true;
        }
        input.focus();
      } else if ("speechSynthesis" in window){
        window.speechSynthesis.cancel();
        document.body.classList.remove("pp-speaking");
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}();
