/* ===== PASTA DELLA FRANCESCA · main.js ===== */
(function(){
  'use strict';

  /* ---------- INTRO ---------- */
  var intro=document.getElementById('intro'),skip=document.getElementById('intro-skip');
  function closeIntro(){if(intro){intro.classList.add('done');}try{sessionStorage.setItem('pf_seen','1');}catch(e){}}
  var seen=false;try{seen=sessionStorage.getItem('pf_seen')==='1';}catch(e){}
  if(seen&&intro){intro.parentNode.removeChild(intro);}
  else if(intro){setTimeout(closeIntro,2100);if(skip)skip.addEventListener('click',closeIntro);}

  /* ---------- HEADER SCROLL ---------- */
  var header=document.getElementById('site-header');
  function onScroll(){if(header)header.classList.toggle('scrolled',window.scrollY>12);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* ---------- BURGER / NAV ---------- */
  var burger=document.getElementById('burger'),nav=document.querySelector('.nav');
  if(burger&&nav){
    burger.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      burger.setAttribute('aria-expanded',open?'true':'false');
    });
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');burger.setAttribute('aria-expanded','false');});});
  }

  /* ---------- ORARI DINAMICI ---------- */
  // getDay() 0=Dom..6=Sab. Mar–Gio 09–13:30 + 16–19 · Ven–Sab 09–13:30 + 15:30–19 · Dom+Lun chiuso
  var WMG=[[9,13.5],[16,19]], WVS=[[9,13.5],[15.5,19]];
  var TABLE={0:[],1:[],2:WMG,3:WMG,4:WMG,5:WVS,6:WVS};
  var DAYS_IT=['dom','lun','mar','mer','gio','ven','sab'];
  var DAYS_EN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function fmt(h){h=h%24;var H=Math.floor(h),M=Math.round((h-H)*60);return H+':'+(M<10?'0'+M:''+M);}
  function nowRome(){var s=new Date().toLocaleString('en-US',{timeZone:'Europe/Rome'});return new Date(s);}
  function computeLive(){
    var d=nowRome(),day=d.getDay(),hour=d.getHours()+d.getMinutes()/60;
    var wins=TABLE[day]||[],openNow=false,closeAt=null;
    for(var i=0;i<wins.length;i++){if(hour>=wins[i][0]&&hour<wins[i][1]){openNow=true;closeAt=wins[i][1];break;}}
    var nextOpen=null,nextDay=null;
    if(!openNow){
      for(var j=0;j<wins.length;j++){if(wins[j][0]>hour){nextOpen=wins[j][0];nextDay=day;break;}}
      if(nextOpen===null){for(var k=1;k<=7;k++){var dd=(day+k)%7,w2=TABLE[dd];if(w2&&w2.length){nextOpen=w2[0][0];nextDay=dd;break;}}}
    }
    return {openNow:openNow,closeAt:closeAt,nextOpen:nextOpen,nextDay:nextDay,day:day};
  }
  function renderLive(){
    var dot=document.getElementById('live-dot'),txt=document.getElementById('live-text');
    if(!dot||!txt)return;
    var L=computeLive(),en=document.documentElement.lang==='en',DAYS=en?DAYS_EN:DAYS_IT;
    dot.className='';
    if(L.openNow){
      dot.classList.add('open');
      txt.textContent=en?('Open now · until '+fmt(L.closeAt)):('Aperto ora · fino alle '+fmt(L.closeAt));
    }else{
      dot.classList.add('closed');
      if(L.nextOpen!==null){
        var sameDay=L.nextDay===L.day;
        var dl=DAYS[L.nextDay];
        if(en)txt.textContent='Closed · opens '+(sameDay?'':dl+' ')+fmt(L.nextOpen);
        else txt.textContent='Chiuso · apre '+(sameDay?'':dl+' ')+fmt(L.nextOpen);
      }else{txt.textContent=en?'Closed':'Chiuso';}
    }
  }

  /* ---------- I18N ---------- */
  var EN={
    'intro.skip':'Enter →',
    'brand.sub':'Fresh pasta · Sempione',
    'nav.storia':'The shop','nav.trovi':'What you’ll find','nav.nome':'The name','nav.dove':'Find us',
    'cta.book':'Call',
    'hero.eyebrow':'Via Piero della Francesca · Sempione',
    'hero.tag':'the family fresh pasta',
    'hero.sub':'A <b>family shop</b>, one of the few left in Milan. Here the <b>fresh pasta is made in-house</b> every day — ravioli, gnocchi, tortelli — along with the ready dishes, the desserts and the cakes. <em>And yes, the name comes from the street.</em>',
    'hero.cta1':'What you’ll find','hero.cta2':'Call us',
    'hero.live':'Checking hours…','hero.f2':'★ 4.5 · a family shop','hero.badge':'made<br>in-house',
    'storia.kicker':'The shop',
    'storia.h2':'One of the few<br>left.',
    'storia.p1':'Pasta della Francesca is a <b>family shop</b>: one of those few, in Milan, where the <b>fresh pasta is still rolled in-house</b>, every day, by hand.',
    'storia.p2':'You pop in for a tray of ravioli, and you leave with the day’s ready dishes and a cake too. <em>Great food, a welcoming place, and a different menu every day</em> — say the customers who come back every week.',
    'storia.s1b':'In-house','storia.s1':'fresh pasta every day','storia.s2':'on Google','storia.s3b':'Family-run','storia.s3':'a neighbourhood shop',
    'trovi.kicker':'What you’ll find','trovi.h2':'All the good of the day',
    'tc.1t':'The fresh pasta','tc.1p':'Spinach-and-ricotta ravioli, gnocchi al pomodoro, tortelli and tagliatelle: rolled by hand, ready to cook at home in minutes.',
    'tc.2t':'The ready dishes','tc.2p':'A different menu every day: first courses, mains and sides, ready to go — just like you’d make them at home, if only you had the time.',
    'tc.3t':'Desserts &amp; cakes','tc.3p':'Fruit tarts, spoon desserts, little pastries: to finish the meal, or for a celebration.',
    'tc.4t':'And the bread','tc.4p':'«The bread is delicious too», they write. Because a well-laid table always starts there.',
    'trovi.note':'All takeaway, with home delivery. Call and tell us what you need for tonight.',
    'nome.h2':'«Pasta della Francesca»',
    'nome.p':'The name is a small neighbourhood joke: the shop is on <b>Via Piero della Francesca</b>, so we may as well take it lightly. Then again, rolling the sheet thin and even, day after day, <em>really is a bit of an art.</em>',
    'gallery.kicker':'In the window','gallery.h2':'A look at the counter',
    'rev.kicker':'Voices','rev.h2':'“Always delicious”','rev.g1':'Google review · <span>★★★★★</span>',
    'dove.kicker':'Find us','dove.h2':'On Via Piero della Francesca,<br>in the Sempione area.',
    'dove.addr':'Address','dove.addr2':'— Sempione','dove.hours':'Hours','dove.hoursv':'Tue–Thu 9–13:30 & 16–19 · Fri–Sat until 19 · Sun & Mon closed',
    'dove.phone':'Phone','dove.mode':'Service','dove.modev':'Takeaway and home delivery.',
    'dove.call':'Call the shop','dove.route':'Get directions',
    'faq.h2':'Frequently asked questions',
    'faq.q1':'Where is Pasta della Francesca?','faq.a1':'On Via Piero della Francesca 20, in the Sempione area of Milan. The name, yes, comes from the street.',
    'faq.q2':'What will I find in the shop?','faq.a2':'Fresh pasta made in-house — ravioli, gnocchi, tortelli, tagliatelle — the day’s ready dishes, the desserts and cakes, and the bread. A different menu every day.',
    'faq.q3':'Do you do takeaway and delivery?','faq.a3':'Yes: you can order takeaway and there’s home delivery. You’ll also find the fresh pasta to take home and cook in a few minutes.',
    'faq.q4':'When are you open?','faq.a4':'Tuesday to Thursday 9:00–13:30 and 16:00–19:00, Friday and Saturday 9:00–13:30 and 15:30–19:00. Closed Sunday and Monday.',
    'foot.sub':'Family fresh pasta · Sempione · Milan',
    'foot.where':'Where','foot.hours':'Hours','foot.hours2':'Tue–Thu 9–13:30 · 16–19','foot.hours3':'Fri–Sat until 19 · Sun/Mon closed','foot.contact':'Contact',
    'foot.disclaimer':'Demonstration site. Content and photos gathered from public sources (Google Maps); hours, dishes and prices are indicative, to be confirmed with the shop.',
    'ab.call':'Call','ab.trovi':'What you’ll find','ab.route':'Directions'
  };
  var IT={};
  function snapshotIT(){document.querySelectorAll('[data-i18n]').forEach(function(el){IT[el.getAttribute('data-i18n')]=el.innerHTML;});}
  function applyLang(lang){
    var dict=lang==='en'?EN:IT;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n');
      if(dict[k]!==undefined)el.innerHTML=dict[k];
      else if(IT[k]!==undefined)el.innerHTML=IT[k];
    });
    document.documentElement.lang=lang;
    document.querySelectorAll('.lang button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-lang')===lang);});
    try{sessionStorage.setItem('pf_lang',lang);}catch(e){}
    renderLive();
  }
  snapshotIT();
  document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){applyLang(b.getAttribute('data-lang'));});});
  var savedLang='it';try{savedLang=sessionStorage.getItem('pf_lang')||'it';}catch(e){}
  if(savedLang==='en')applyLang('en');else renderLive();

  /* ---------- REVEAL ---------- */
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
  },{threshold:0.1,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  /* ---------- LIGHTBOX ---------- */
  var lb=document.getElementById('lightbox'),lbImg=document.getElementById('lb-img'),lbClose=document.getElementById('lb-close');
  document.querySelectorAll('.g-item').forEach(function(fig){
    fig.addEventListener('click',function(){
      var full=fig.getAttribute('data-full');if(!full)return;
      lbImg.src=full;var im=fig.querySelector('img');lbImg.alt=im?im.alt:'';
      lb.classList.add('open');lb.setAttribute('aria-hidden','false');
    });
  });
  function closeLb(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');setTimeout(function(){lbImg.src='';},300);}
  if(lbClose)lbClose.addEventListener('click',closeLb);
  if(lb)lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('open'))closeLb();});

  /* ---------- LIVE tick ---------- */
  setInterval(renderLive,60000);
})();
