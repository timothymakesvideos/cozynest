// ── CONSTANTS ────────────────────────────────────────────────
const TODAY=()=>new Date().toISOString().split('T')[0];
const POOL=[
  {id:'p1',name:'Daily question',desc:'What made you smile today?',icon:'💬',color:'var(--teal-l)',coins:8},
  {id:'p2',name:'No-phones dinner',desc:'Put phones away and just be present',icon:'🍽️',color:'var(--rose-l)',coins:12},
  {id:'p3',name:'Send appreciation',desc:'Tell your partner one thing you love',icon:'💛',color:'var(--amber-l)',coins:10},
  {id:'p4',name:'Share a memory',desc:'Send a photo or describe a favourite moment',icon:'📸',color:'var(--sage-l)',coins:8},
  {id:'p5',name:"Rate each other's playlist",desc:'Share a song, guess their taste',icon:'🎵',color:'var(--teal-l)',coins:8},
  {id:'p6',name:'Kind surprise',desc:'Do one small unexpected kind thing today',icon:'🎁',color:'var(--rose-l)',coins:15},
  {id:'p7',name:'Evening check-in',desc:'10 minutes without distractions, just talking',icon:'🌙',color:'var(--brown-l)',coins:10},
  {id:'p8',name:'Morning text',desc:'Send a good morning message first thing',icon:'☀️',color:'var(--amber-l)',coins:6},
  {id:'p9',name:'Watch something together',desc:'Pick a show or movie for tonight',icon:'🎬',color:'var(--sage-l)',coins:10},
  {id:'p10',name:'Ask a deep question',desc:'Pick a question and really answer it',icon:'🤔',color:'var(--teal-l)',coins:12},
  {id:'p11',name:'Cook together',desc:'Make any meal together',icon:'🍳',color:'var(--rose-l)',coins:12},
  {id:'p12',name:'Go for a walk',desc:'15 min outside, phones in pockets',icon:'🚶',color:'var(--sage-l)',coins:10},
];
const BLDGS=[
  {id:'nest',   name:'Our Nest',       icon:'🏠',cost:0,   desc:'Your home base, always open.',                          activity:"This is where it all starts. Your cozy home base together."},
  {id:'cafe',   name:'Maple Café',     icon:'☕',cost:100,  desc:'Conversation prompts & cozy coffee date challenges.',    activity:"\"What's one thing you haven't told me yet?\" Talk for 15 minutes over something warm."},
  {id:'park',   name:'Willow Park',    icon:'🌿',cost:200,  desc:'Outdoor date challenges & nature activity unlocks.',     activity:"15-minute phone-free walk. Notice three things you've never talked about."},
  {id:'cinema', name:'Star Theatre',   icon:'🎬',cost:350,  desc:'Movie night challenges & watch-together activities.',    activity:'Pick a film together, no phones, popcorn mandatory. Discuss it after.'},
  {id:'library',name:'Cozy Library',   icon:'📚',cost:500,  desc:'Reading challenges & deep-question jar unlocks.',        activity:'Read the same chapter of anything. Discuss over tea. No wrong answers.'},
  {id:'bakery', name:'Sweet Bakery',   icon:'🧁',cost:650,  desc:'Cook-together challenges & surprise treat activities.',  activity:'Bake something together. The messier the kitchen, the better the memory.'},
  {id:'rooftop',name:'Sunset Rooftop', icon:'🌅',cost:900,  desc:'Romantic milestone unlocks & special date challenges.', activity:'Watch the sunset together — in person or on a call. No talking required.'},
  {id:'secret', name:'???',            icon:'🔮',cost:1500, desc:"A mystery location. Unlock to find out what's inside.", activity:'You found the secret spot! 💫 A surprise date generator awaits.'},
];
const TIPS=[
  'Ask your partner about the best part of their day — not just "how was your day?"',
  'A small act of kindness beats a grand gesture. Leave a sticky note.',
  'Put your phone away for 20 minutes tonight and just be present together.',
  'Tell your partner one specific thing you appreciate about them today.',
  'Plan something small to look forward to — even just a shared walk.',
  'Check in on how your partner is really doing this week.',
  'Send a voice note instead of a text — they\'ll love hearing your voice.',
  'Surprise your partner with their favourite snack. No occasion needed.',
  'Ask "What can I do for you today?" and mean it.',
  'Laugh together. Be silly. Watch something funny.',
];
const PLANTS=['🌱','🌿','🍀','🪴','🌺','🌸'];
const PETS=['🐣','🐥','🐤','🐦','🦜'];

// ── IN-MEMORY STATE ──────────────────────────────────────────
let ME=null,PARTNER=null,COUPLE=null,SS=null;
let MY_MOOD=null,P_MOOD=null,NOTES=[],DATES=[],CUSTOM_ACTS=[],ACT_DONE_TODAY=[];
let REALTIME_CH=null;

// ── UTIL ─────────────────────────────────────────────────────
function hsh(s){let h=0;for(let i=0;i<s.length;i++)h=(Math.imul(31,h)+s.charCodeAt(i))|0;return h;}
function pickPool(d){const seed=hsh(d);return[...POOL].sort((a,b)=>hsh(a.id+seed)-hsh(b.id+seed)).slice(0,4);}
function g(id){return document.getElementById(id);}
function toast(msg){const t=g('toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2800);}
function coinPop(n){const e=document.createElement('div');e.className='coin-pop';e.textContent='+'+n+' 🪙';document.body.appendChild(e);setTimeout(()=>e.remove(),1600);}

// ── AUTH ─────────────────────────────────────────────────────
let authAv='🐻';
function showAuth(mode){
  g('loading-screen').classList.add('hidden');
  g('couple-screen').classList.add('hidden');
  g('app-shell').classList.add('hidden');
  g('auth-screen').classList.remove('hidden');
  const isL=mode==='login';
  g('auth-screen').innerHTML=`<div class="auth-wrap">
    <div class="auth-logo">🏠</div>
    <div class="auth-title">Cozy Nest</div>
    <div class="auth-sub">${isL?'Welcome back':'Create your account'}</div>
    <div class="auth-card">
      ${!isL?`<div class="ob-lbl">Your name</div>
      <input class="ob-inp" id="aname" placeholder="e.g. Jamie" maxlength="20" style="margin-bottom:10px">
      <div class="ob-lbl">Your avatar</div>
      <div class="ob-emrow" style="margin-bottom:14px">
        <button class="ob-em on" data-e="🐻" onclick="authAv_(this)">🐻</button>
        <button class="ob-em" data-e="🐱" onclick="authAv_(this)">🐱</button>
        <button class="ob-em" data-e="🐰" onclick="authAv_(this)">🐰</button>
        <button class="ob-em" data-e="🦊" onclick="authAv_(this)">🦊</button>
        <button class="ob-em" data-e="🐸" onclick="authAv_(this)">🐸</button>
      </div>`:''}
      <div class="ob-lbl">Email</div>
      <input class="ob-inp" id="aemail" type="email" placeholder="you@example.com" style="margin-bottom:10px">
      <div class="ob-lbl">Password</div>
      <input class="ob-inp" id="apass" type="password" placeholder="••••••••" style="margin-bottom:6px">
      <div id="aerr" style="font-size:12px;color:var(--rose);min-height:16px;margin-bottom:8px"></div>
      <button class="btn-main" id="abtn" onclick="authGo('${mode}')">${isL?'Sign in':'Create account'}</button>
    </div>
    <div style="font-size:13px;color:var(--text3);margin-top:14px;cursor:pointer" onclick="showAuth('${isL?'signup':'login'}')">
      ${isL?"Don't have an account? <u>Sign up</u>":'Already have an account? <u>Sign in</u>'}
    </div>
  </div>`;
}
function authAv_(btn){document.querySelectorAll('#auth-screen .ob-em').forEach(b=>b.classList.remove('on'));btn.classList.add('on');authAv=btn.dataset.e;}
async function authGo(mode){
  const btn=g('abtn');btn.disabled=true;btn.textContent='...';g('aerr').textContent='';
  const email=g('aemail').value.trim(),pass=g('apass').value;
  try{
    if(mode==='signup'){
      const name=(g('aname')?.value||'').trim()||'You';
      const {error}=await db.auth.signUp({email,password:pass,options:{data:{name,avatar:authAv}}});
      if(error)throw error;
      toast('Check your email to confirm! Then sign in.');
      showAuth('login');
    } else {
      const {error}=await db.auth.signInWithPassword({email,password:pass});
      if(error)throw error;
    }
  }catch(e){g('aerr').textContent=e.message||'Something went wrong';btn.disabled=false;btn.textContent=mode==='login'?'Sign in':'Create account';}
}
async function signOut(){await db.auth.signOut();}

// ── COUPLE SCREEN ────────────────────────────────────────────
function showCouple(){
  g('auth-screen').classList.add('hidden');
  g('loading-screen').classList.add('hidden');
  g('app-shell').classList.add('hidden');
  g('couple-screen').classList.remove('hidden');
  const code='NEST'+Math.random().toString(36).substring(2,6).toUpperCase();
  g('my-invite-code').textContent=code;
  g('couple-screen').dataset.code=code;
}
async function createCouple(){
  const code=g('couple-screen').dataset.code;
  const {data,error}=await db.from('couples').insert({invite_code:code,user1_id:ME.id}).select().single();
  if(error){toast('Error: '+error.message);return;}
  COUPLE=data;
  await db.from('profiles').update({couple_id:data.id}).eq('id',ME.id);
  ME.couple_id=data.id;
  await db.from('shared_state').insert({couple_id:data.id});
  toast('Nest created! Share your code 💌');
  await boot();
}
async function joinCouple(){
  const code=g('join-code-inp').value.trim().toUpperCase();
  if(!code){toast('Enter your partner\'s code');return;}
  const {data:couple,error}=await db.from('couples').select('*').eq('invite_code',code).single();
  if(error||!couple){toast('Code not found');return;}
  if(couple.user2_id){toast('This couple is already full');return;}
  if(couple.user1_id===ME.id){toast("That's your own code!");return;}
  await db.from('couples').update({user2_id:ME.id}).eq('id',couple.id);
  await db.from('profiles').update({couple_id:couple.id}).eq('id',ME.id);
  ME.couple_id=couple.id;COUPLE={...couple,user2_id:ME.id};
  toast('Joined! You\'re now linked 💛');
  await boot();
}

// ── BOOT ─────────────────────────────────────────────────────
function loading(on){
  ['auth-screen','couple-screen','app-shell'].forEach(id=>g(id).classList.add('hidden'));
  g('loading-screen').classList.toggle('hidden',!on);
}
async function boot(){
  loading(true);
  try{
    const {data:{user}}=await db.auth.getUser();
    if(!user){loading(false);showAuth('login');return;}
    const {data:profile}=await db.from('profiles').select('*').eq('id',user.id).single();
    ME=profile;
    if(!ME.couple_id){loading(false);showCouple();return;}
    const {data:couple}=await db.from('couples').select('*').eq('id',ME.couple_id).single();
    COUPLE=couple;
    const pid=couple.user1_id===ME.id?couple.user2_id:couple.user1_id;
    if(pid){const {data:p}=await db.from('profiles').select('*').eq('id',pid).single();PARTNER=p;}
    let {data:ss}=await db.from('shared_state').select('*').eq('couple_id',COUPLE.id).single();
    if(!ss){const {data:n}=await db.from('shared_state').insert({couple_id:COUPLE.id}).select().single();ss=n;}
    SS=ss;
    const {data:moods}=await db.from('moods').select('*').eq('couple_id',COUPLE.id).order('created_at',{ascending:false}).limit(30);
    MY_MOOD=(moods||[]).find(m=>m.user_id===ME.id)||null;
    P_MOOD=(moods||[]).find(m=>m.user_id!==ME.id)||null;
    const {data:notes}=await db.from('notes').select('*').eq('couple_id',COUPLE.id).order('created_at',{ascending:true}).limit(60);
    NOTES=notes||[];
    const {data:dates}=await db.from('special_dates').select('*').eq('couple_id',COUPLE.id).order('date',{ascending:true});
    DATES=dates||[];
    const {data:ca}=await db.from('custom_activities').select('*').eq('couple_id',COUPLE.id);
    CUSTOM_ACTS=ca||[];
    const {data:done}=await db.from('activities').select('act_id').eq('couple_id',COUPLE.id).eq('user_id',ME.id).eq('act_date',TODAY());
    ACT_DONE_TODAY=(done||[]).map(r=>r.act_id);
    subscribeRT();
    loading(false);
    g('couple-screen').classList.add('hidden');
    g('auth-screen').classList.add('hidden');
    g('app-shell').classList.remove('hidden');
    initUI();
  }catch(e){console.error(e);loading(false);toast('Error loading — please refresh');}
}

// ── REALTIME ─────────────────────────────────────────────────
function subscribeRT(){
  if(REALTIME_CH)sb.removeChannel(REALTIME_CH);
  REALTIME_CH=db.channel('cn-'+COUPLE.id)
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'moods',filter:`couple_id=eq.${COUPLE.id}`},p=>{
      if(p.new.user_id!==ME.id){P_MOOD=p.new;renderMood();renderHome();toast((PARTNER?.name||'Partner')+' updated their mood 💭');}
    })
    .on('postgres_changes',{event:'UPDATE',schema:'public',table:'shared_state',filter:`couple_id=eq.${COUPLE.id}`},p=>{
      SS=p.new;renderNest();updateBar();
    })
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'notes',filter:`couple_id=eq.${COUPLE.id}`},p=>{
      if(p.new.user_id!==ME.id){NOTES.push(p.new);renderNotes();}
    })
    .subscribe();
}

// ── SHARED STATE ─────────────────────────────────────────────
async function updateSS(patch){
  Object.assign(SS,patch);
  await db.from('shared_state').update({...patch,updated_at:new Date().toISOString()}).eq('couple_id',COUPLE.id);
}
async function tryStreak(){
  const t=TODAY();if(SS.last_streak_date===t)return;
  const y=new Date(Date.now()-86400000).toISOString().split('T')[0];
  await updateSS({streak:SS.last_streak_date===y?(SS.streak||0)+1:1,last_streak_date:t});
}
async function earnCoins(n){await updateSS({coins:(SS.coins||0)+n});updateBar();coinPop(n);}

// ── UI ───────────────────────────────────────────────────────
function initUI(){updateBar();updateGreeting();renderHome();renderMood();renderNest();renderNotes();renderDates();goTab('home');}
function updateBar(){g('sc').textContent=(SS?.streak||0)===1?'1 day':(SS?.streak||0)+' days';g('cc').textContent=SS?.coins||0;}
function updateGreeting(){
  const h=new Date().getHours();
  g('bn-greet').textContent=h<12?'Good morning ☀️':h<17?'Good afternoon 🌤️':'Good evening 🌙';
  const days=Math.max(1,Math.floor((Date.now()-new Date(COUPLE.created_at))/86400000)+1);
  g('bn-day').textContent='Day '+days+' together';
  g('nest-sub').textContent='Day '+days+' · '+(SS?.streak||0)+' day streak 🔥';
}

// HOME
function renderHome(){
  g('hav-me').textContent=ME?.avatar||'🐻';g('hn-me').textContent=ME?.name||'You';
  g('hav-p').textContent=PARTNER?.avatar||'🐱';g('hn-p').textContent=PARTNER?.name||'Partner';
  g('hm-me').textContent=MY_MOOD?.emoji||'—';g('hnote-me').textContent=MY_MOOD?.note||MY_MOOD?.label||'No mood yet';
  g('hm-p').textContent=P_MOOD?.emoji||'—';g('hnote-p').textContent=P_MOOD?.note||P_MOOD?.label||(PARTNER?'No mood yet':'Waiting for partner...');
  const pool=pickPool(TODAY());
  const all=[...pool,...CUSTOM_ACTS.map(a=>({...a,color:'var(--brown-l)'}))];
  g('act-list').innerHTML=all.map(a=>{
    const done=ACT_DONE_TODAY.includes(a.id);
    return`<div class="act-item">
      <div class="act-icon" style="background:${a.color||'var(--teal-l)'}">${a.icon}</div>
      <div class="act-info"><div class="act-name">${a.name}</div><div class="act-desc">${a.desc||''}</div><div class="act-reward">+${a.coins} 🪙</div></div>
      <div class="act-chk ${done?'done':''}" onclick="${done?'':'doAct(\''+a.id+'\','+a.coins+')'}">✓</div>
    </div>`;
  }).join('');
  g('daily-tip').textContent=TIPS[new Date().getDay()%TIPS.length];
}
async function doAct(id,coins){
  if(ACT_DONE_TODAY.includes(id))return;
  const act=[...pickPool(TODAY()),...CUSTOM_ACTS].find(a=>a.id===id);
  if(!act)return;
  ACT_DONE_TODAY.push(id);
  await db.from('activities').insert({couple_id:COUPLE.id,user_id:ME.id,act_id:id,act_name:act.name,act_date:TODAY(),coins});
  await tryStreak();await earnCoins(coins);
  toast('✓ '+act.name+' complete!');
  await updPet(5,5,3);await updPlant(4);
  renderHome();updateBar();
}

// CUSTOM ACT
let actIcon='🍳',dateIcon='💍';
function pickIcon(btn,type){btn.closest('.modal-sh').querySelectorAll('.ob-em').forEach(b=>b.classList.remove('on'));btn.classList.add('on');if(type==='act')actIcon=btn.dataset.e;else dateIcon=btn.dataset.e;}
async function saveAct(){
  const name=g('act-name-inp').value.trim(),coins=Math.min(50,Math.max(1,parseInt(g('act-coins-inp').value)||10));
  if(!name){toast('Give it a name 😊');return;}
  const {data,error}=await db.from('custom_activities').insert({couple_id:COUPLE.id,name,icon:actIcon,coins}).select().single();
  if(error){toast('Error: '+error.message);return;}
  CUSTOM_ACTS.push(data);hideModal('modal-act');g('act-name-inp').value='';renderHome();toast('Activity added! ✓');
}

// MOOD — coins only once per day
let moodE=null,moodL=null;
function selMood(el_){
  document.querySelectorAll('.mood-opt').forEach(e=>e.classList.remove('on'));
  el_.classList.add('on');moodE=el_.dataset.e;moodL=el_.dataset.l;
  const wasToday=MY_MOOD&&new Date(MY_MOOD.created_at).toISOString().split('T')[0]===TODAY();
  g('mood-coin-note').textContent=wasToday?'✓ Coins already earned today — share freely!':'+5 🪙 for your first mood share today';
}
async function saveMood(){
  if(!moodE){toast('Pick a mood first 😊');return;}
  const note=g('mood-note').value.trim();
  const wasToday=MY_MOOD&&new Date(MY_MOOD.created_at).toISOString().split('T')[0]===TODAY();
  const {data:nm,error}=await db.from('moods').insert({couple_id:COUPLE.id,user_id:ME.id,emoji:moodE,label:moodL,note}).select().single();
  if(error){toast('Error: '+error.message);return;}
  MY_MOOD=nm;
  if(!wasToday){await tryStreak();await earnCoins(5);toast('Mood shared! +5 🪙');}
  else toast('Mood updated 💌');
  await updPlant(3);await updPet(3,0,2);
  g('mood-note').value='';moodE=null;moodL=null;
  document.querySelectorAll('.mood-opt').forEach(e=>e.classList.remove('on'));
  g('mood-coin-note').textContent='';
  renderMood();renderHome();updateBar();
}
function renderMood(){
  g('pm-e').textContent=P_MOOD?.emoji||'—';
  g('pm-l').textContent=P_MOOD?.label||(PARTNER?'No mood yet':'Waiting for partner...');
  g('pm-n').textContent=P_MOOD?.note?'"'+P_MOOD.note+'"':'';
  const stressed=['😤','😔','😢','😰','😡','🤒'].includes(P_MOOD?.emoji);
  g('pm-sug').textContent=P_MOOD?(stressed?'💛 '+(PARTNER?.name||'Partner')+' might be having a rough time. A love note or cozy plan could help.':'✨ '+(PARTNER?.name||'Partner')+' is doing well! A small kind gesture keeps the good vibes going.'):'Your partner hasn\'t shared their mood yet.';
  g('mhist').textContent='';
}

// NEST
async function updPet(l,h,hl){await updateSS({pet_love:Math.min(100,(SS.pet_love||60)+l),pet_happy:Math.min(100,(SS.pet_happy||75)+h),pet_health:Math.min(100,(SS.pet_health||50)+hl)});}
async function updPlant(v){await updateSS({plant_progress:Math.min(100,(SS.plant_progress||20)+v)});}
async function feedPet(){
  if(SS.pet_fed_date===TODAY()){toast('Pebble is full! Come back tomorrow 🌙');return;}
  await updateSS({pet_fed_date:TODAY()});await updPet(10,12,8);await tryStreak();await earnCoins(3);toast('Pebble loved that! 🌟');renderNest();
}
async function waterPlant(){
  if(SS.plant_watered_date===TODAY()){toast('Sprout is hydrated! Tomorrow 💧');return;}
  await updateSS({plant_watered_date:TODAY()});await updPlant(10);await tryStreak();await earnCoins(3);toast('Sprout is growing! 🌱');renderNest();
}
function renderNest(){
  if(!SS)return;
  const{pet_love:pl=60,pet_happy:ph=75,pet_health:phl=50,pet_fed_date:pfd='',plant_progress:pp=20,plant_watered_date:pwd=''}=SS;
  ['love','happy','health'].forEach((k,i)=>{const v=[pl,ph,phl][i];g('st-'+k).style.width=v+'%';g('st-'+k+'-n').textContent=v+'%';});
  const ptl=Math.min(Math.floor((pl+ph+phl)/(300/PETS.length)),PETS.length-1);
  g('pet-art').textContent=PETS[ptl];g('pet-in-room').textContent=PETS[ptl];
  const fed=pfd===TODAY();g('feed-btn').disabled=fed;g('feed-btn').style.opacity=fed?.5:1;
  g('pet-fed-badge').textContent=fed?'Fed today ✓':'';g('pet-lim').textContent=fed?'Pebble is full — back tomorrow':'Once per day each partner';
  const lvl=Math.min(Math.floor(pp/20),PLANTS.length-1);
  g('plant-art').textContent=PLANTS[lvl];g('plant-bar').style.width=pp+'%';
  g('plant-lbl').textContent=['Seedling','Sprout','Sapling','Young plant','Blooming','In full bloom'][lvl]+' · '+Math.round(pp)+'% grown';
  const wat=pwd===TODAY();g('water-btn').disabled=wat;g('water-btn').style.opacity=wat?.5:1;
  g('plant-watered-badge').textContent=wat?'Watered today 💧':'';g('plant-lim').textContent=wat?'Sprout is happy — back tomorrow':'Once per day each partner';
}

// CITY buy
async function buyLoc(id){
  const b=BLDGS.find(x=>x.id===id);if(!b||SS.coins<b.cost)return;
  await updateSS({coins:SS.coins-b.cost,city:{...(SS.city||{}),[id]:true}});
  toast('🎉 '+b.name+' unlocked!');updateBar();buildCityMap();openLoc(id);
}

// NOTES
function renderNotes(){
  g('notes-list').innerHTML=NOTES.map(n=>{
    const mine=n.user_id===ME.id;
    if(n.sticker)return`<div class="nbub sticker ${mine?'me':'p'}">${n.sticker}</div>`;
    const t=new Date(n.created_at).toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'});
    return`<div class="nbub ${mine?'me':'p'}"><div class="nt">${n.text}</div><div class="ntm">${t}</div></div>`;
  }).join('');
  setTimeout(()=>{const s=g('s-notes');if(s)s.scrollTop=s.scrollHeight;},60);
}
async function sendNote(){
  const inp=g('note-inp'),txt=inp.value.trim();if(!txt)return;
  inp.value='';inp.style.height='';
  const {data:note,error}=await db.from('notes').insert({couple_id:COUPLE.id,user_id:ME.id,text:txt,sticker:''}).select().single();
  if(error){toast('Error sending');return;}
  NOTES.push(note);renderNotes();await earnCoins(2);
}
async function sendStkr(s){
  const {data:note}=await db.from('notes').insert({couple_id:COUPLE.id,user_id:ME.id,text:'',sticker:s}).select().single();
  if(note){NOTES.push(note);renderNotes();}
}
function autoR(el_){el_.style.height='';el_.style.height=Math.min(el_.scrollHeight,110)+'px';}

// DATES
function renderDates(){
  const today=new Date();today.setHours(0,0,0,0);
  g('dates-list').innerHTML=(DATES||[]).map(d=>{
    const dt=new Date(d.date+'T00:00:00');
    let next=new Date(dt);next.setFullYear(today.getFullYear());
    if(next<today)next.setFullYear(today.getFullYear()+1);
    const diff=Math.ceil((next-today)/86400000);
    return`<div class="date-card"><div style="font-size:26px;flex-shrink:0">${d.icon}</div>
      <div style="flex:1"><div class="date-name">${d.name}</div><div class="date-when">${dt.toLocaleDateString('en',{month:'long',day:'numeric'})}</div></div>
      <div><div class="date-days">${diff===0?'🎉':diff}</div><div class="date-dlbl">${diff===0?'today!':'days'}</div></div>
    </div>`;
  }).join('');
}
async function saveDate(){
  const name=g('date-name-inp').value.trim(),date=g('date-date-inp').value;
  if(!name||!date){toast('Fill in all fields 📅');return;}
  const {data,error}=await db.from('special_dates').insert({couple_id:COUPLE.id,name,date,icon:dateIcon}).select().single();
  if(error){toast('Error: '+error.message);return;}
  DATES.push(data);DATES.sort((a,b)=>a.date.localeCompare(b.date));
  renderDates();hideModal('modal-date');toast('Date added! 🎉');g('date-name-inp').value='';
}

// TABS
const TABS=['home','mood','nest','city','notes','dates'];
function goTab(t){TABS.forEach(x=>{g('s-'+x).classList.add('hidden');g('t-'+x).classList.remove('on');});g('s-'+t).classList.remove('hidden');g('t-'+t).classList.add('on');if(t==='notes')setTimeout(()=>{const s=g('s-notes');s.scrollTop=s.scrollHeight;},80);if(t==='city')buildCityMap();}

// MODALS
function showModal(id){if(id==='modal-date')g('date-date-inp').value=TODAY();g(id).classList.remove('hidden');}
function hideModal(id){g(id).classList.add('hidden');}
function ovClose(e,id){if(e.target.classList.contains('modal-ov'))hideModal(id);}

// BOOT
db.auth.onAuthStateChange((event,session)=>{if(session){boot();}else{loading(false);showAuth('login');}});
