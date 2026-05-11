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

const DAILY_QUESTIONS = [
  "What's one small thing your partner did recently that you didn't thank them for?",
  "Describe your partner using only three words — go.",
  "What's a memory from early in your relationship that still makes you smile?",
  "What's something you'd love to do together that you haven't tried yet?",
  "What's one thing your partner does that always cheers you up?",
  "If you could relive one day together, which would it be and why?",
  "What's something you've learned about yourself through this relationship?",
  "What's your favourite thing about your partner that they might not know?",
  "What's a dream or goal you want to work toward together?",
  "How do you want your partner to feel every single day?",
  "What's one way your partner makes ordinary moments feel special?",
  "If you wrote your partner a letter they'd read in 10 years, what would it say?",
  "What song reminds you of your partner and why?",
  "When do you feel most loved by your partner?",
  "What's something you want to get better at for your relationship?",
  "What's a little ritual or habit you two share that you love?",
  "What's one thing you wish you could do more of together?",
  "What part of your partner's personality do you find most admirable?",
  "What does your ideal lazy day together look like?",
  "What's something your partner taught you that changed how you see the world?",
  "How has your partner helped you grow as a person?",
  "What's a challenge you've faced together that made you stronger?",
  "What's the most thoughtful thing your partner has ever done for you?",
  "What's something small you could do tomorrow to make your partner smile?",
  "If you could give your relationship a title like a movie, what would it be?",
  "What's one boundary or need you feel safe expressing to your partner?",
  "What's something your partner does that you hope they never stop doing?",
  "What's a place you'd love to explore together someday?",
  "What's one thing you appreciate about how your partner handles hard times?",
  "How would you describe your relationship to someone who's never met you both?",
];

// ── IN-MEMORY STATE ──────────────────────────────────────────
let ME=null,PARTNER=null,COUPLE=null,SS=null;
let MY_MOOD=null,P_MOOD=null,NOTES=[],DATES=[],CUSTOM_ACTS=[],ACT_DONE_TODAY=[];
let REALTIME_CH=null;
let TODAY_QUESTION=null, MY_Q_ANSWER=null, PARTNER_Q_ANSWER=null;

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
  // Update couple first, then profile — order matters for RLS
  const {error:e1}=await db.from('couples').update({user2_id:ME.id}).eq('id',couple.id);
  if(e1){toast('Error joining: '+e1.message);return;}
  const {error:e2}=await db.from('profiles').update({couple_id:couple.id}).eq('id',ME.id);
  if(e2){toast('Error updating profile: '+e2.message);return;}
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
    // Step 1: Auth
    const {data:{user}, error:authErr} = await db.auth.getUser();
    console.log('boot: auth', user?.id, authErr?.message);
    if(authErr||!user){ loading(false); showAuth('login'); return; }

    // Step 2: Profile
    const {data:profile, error:profErr} = await db.from('profiles').select('*').eq('id',user.id).single();
    console.log('boot: profile', profile?.id, profErr?.message);
    if(profErr||!profile){ loading(false); showAuth('login'); return; }
    ME = profile;

    // Step 3: No couple yet
    if(!ME.couple_id){ loading(false); showCouple(); return; }

    // Step 4: Couple
    const {data:couple, error:coupleErr} = await db.from('couples').select('*').eq('id',ME.couple_id).single();
    console.log('boot: couple', couple?.id, coupleErr?.message);
    if(coupleErr||!couple){ loading(false); showCouple(); return; }
    COUPLE = couple;

    // Step 5: Partner (optional — may not have joined yet)
    const pid = couple.user1_id===ME.id ? couple.user2_id : couple.user1_id;
    if(pid){
      const {data:partner} = await db.from('profiles').select('*').eq('id',pid).single();
      PARTNER = partner||null;
      console.log('boot: partner', PARTNER?.name);
    }

    // Step 6: Shared state
    let {data:ss} = await db.from('shared_state').select('*').eq('couple_id',COUPLE.id).single();
    if(!ss){
      const {data:newSS} = await db.from('shared_state').insert({couple_id:COUPLE.id}).select().single();
      ss = newSS;
    }
    SS = ss;
    console.log('boot: shared_state loaded', !!SS);

    // Step 7: All other data
    const [moodsRes, notesRes, datesRes, caRes, doneRes, qRes] = await Promise.all([
      db.from('moods').select('*').eq('couple_id',COUPLE.id).order('created_at',{ascending:false}).limit(30),
      db.from('notes').select('*').eq('couple_id',COUPLE.id).order('created_at',{ascending:true}).limit(60),
      db.from('special_dates').select('*').eq('couple_id',COUPLE.id).order('date',{ascending:true}),
      db.from('custom_activities').select('*').eq('couple_id',COUPLE.id),
      db.from('activities').select('act_id').eq('couple_id',COUPLE.id).eq('user_id',ME.id).eq('act_date',TODAY()),
      db.from('daily_question_answers').select('*').eq('couple_id',COUPLE.id).eq('question_date',TODAY()),
    ]);
    const moods = moodsRes.data||[];
    MY_MOOD  = moods.find(m=>m.user_id===ME.id)||null;
    P_MOOD   = moods.find(m=>m.user_id!==ME.id)||null;
    NOTES    = notesRes.data||[];
    DATES    = datesRes.data||[];
    CUSTOM_ACTS   = caRes.data||[];
    ACT_DONE_TODAY= (doneRes.data||[]).map(r=>r.act_id);
    // Daily question
    const qIdx = Math.floor(new Date(TODAY()).getTime()/86400000) % DAILY_QUESTIONS.length;
    TODAY_QUESTION = DAILY_QUESTIONS[qIdx];
    const qAnswers = qRes.data||[];
    MY_Q_ANSWER = qAnswers.find(a=>a.user_id===ME.id)||null;
    PARTNER_Q_ANSWER = qAnswers.find(a=>a.user_id!==ME.id)||null;
    console.log('boot: all data loaded');

    // Step 8: Show app
    subscribeRT();
    loading(false);
    g('auth-screen').classList.add('hidden');
    g('couple-screen').classList.add('hidden');
    g('app-shell').classList.remove('hidden');
    await initUI();
    registerPush();

  } catch(e) {
    console.error('boot failed:', e);
    _booted = false;
    // Always escape the loading screen
    loading(false);
    g('app-shell').classList.remove('hidden');
    toast('Something went wrong — please refresh');
  }
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
      // If sequence modal is open, refresh it
      const modal = document.getElementById('modal-sequence');
      if(modal && !modal.classList.contains('hidden')){
        const seqId = modal.dataset.seqid;
        if(seqId){
          const roomKey = Object.keys(ACTIVITY_SEQUENCES).find(k=>ACTIVITY_SEQUENCES[k].id===seqId);
          if(roomKey) renderSequenceModal(ACTIVITY_SEQUENCES[roomKey]);
        }
      }
      renderNestRooms();
    })
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'notes',filter:`couple_id=eq.${COUPLE.id}`},p=>{
      if(p.new.user_id!==ME.id){NOTES.push(p.new);renderNotes();}
    })
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'daily_question_answers',filter:`couple_id=eq.${COUPLE.id}`},p=>{
      if(p.new.user_id!==ME.id){PARTNER_Q_ANSWER=p.new;renderDailyQuestion();toast((PARTNER?.name||'Partner')+' answered today\'s question 💬');}
    })
    .on('postgres_changes',{event:'UPDATE',schema:'public',table:'couples',filter:`id=eq.${COUPLE.id}`},async p=>{
      // Partner just joined — load their profile
      COUPLE=p.new;
      const pid=COUPLE.user1_id===ME.id?COUPLE.user2_id:COUPLE.user1_id;
      if(pid&&!PARTNER){
        const {data:partner}=await db.from('profiles').select('*').eq('id',pid).single();
        PARTNER=partner;renderHome();renderMood();renderSettings();toast((PARTNER?.name||'Partner')+' joined your nest! 💛');
      }
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
async function initUI(){
  const safe = (fn, name) => { try{ fn(); } catch(e){ console.warn(name+' error:',e); } };
  safe(()=>updateBar(),        'updateBar');
  safe(()=>updateGreeting(),   'updateGreeting');
  safe(()=>renderHome(),       'renderHome');
  safe(()=>renderDailyQuestion(),'renderDailyQuestion');
  safe(()=>renderNest(),       'renderNest');
  safe(()=>renderNestRooms(),  'renderNestRooms');
  safe(()=>renderNotes(),      'renderNotes');
  safe(()=>renderDates(),      'renderDates');
  safe(()=>renderNestActivity(),'renderNestActivity');
  safe(()=>goTab('home'),      'goTab');
  try{ await renderMood(); } catch(e){ console.warn('renderMood error:',e); }
}
function updateBar(){g('sc').textContent=(SS?.streak||0)===1?'1 day':(SS?.streak||0)+' days';g('cc').textContent=SS?.coins||0;}
function updateGreeting(){
  const h=new Date().getHours();
  if(g('bn-greet')) g('bn-greet').textContent=h<12?'Good morning ☀️':h<17?'Good afternoon 🌤️':'Good evening 🌙';
  const days=Math.max(1,Math.floor((Date.now()-new Date(COUPLE.created_at))/86400000)+1);
  if(g('bn-day')) g('bn-day').textContent='Day '+days+' together';
  if(g('nest-sub')) g('nest-sub').textContent='Day '+days+' · '+(SS?.streak||0)+' day streak 🔥';
}

// HOME
function renderHome(){
  g('hav-me').textContent=ME?.avatar||'🐻';g('hn-me').textContent=ME?.name||'You';
  g('hav-p').textContent=PARTNER?.avatar||'🐱';g('hn-p').textContent=PARTNER?.name||'Partner';
  g('hm-me').textContent=MY_MOOD?.emoji||'—';g('hnote-me').textContent=MY_MOOD?.note||MY_MOOD?.label||'No mood yet';
  g('hm-p').textContent=P_MOOD?.emoji||'—';g('hnote-p').textContent=P_MOOD?.note||P_MOOD?.label||(PARTNER?'No mood yet':'Waiting for partner...');
  const pool=pickPool(TODAY()).map(a=>({...a,isCustom:false}));
  const custom=CUSTOM_ACTS.map(a=>({...a,color:'var(--brown-l)',isCustom:true}));
  const all=[...pool,...custom];
  g('act-list').innerHTML=all.map(a=>{
    const done=ACT_DONE_TODAY.includes(a.id);
    const chkClick=done?`unDoAct('${a.id}')`:`doAct('${a.id}',${a.coins})`;
    const delBtn=a.isCustom?`<span class="act-del" onclick="deleteCustomAct('${a.id}')">✕</span>`:'';
    return`<div class="act-item">
      <div class="act-icon" style="background:${a.color||'var(--teal-l)'}">${a.icon}</div>
      <div class="act-info"><div class="act-name">${a.name}</div><div class="act-desc">${a.desc||''}</div><div class="act-reward">+${a.coins} 🪙</div></div>
      <div style="display:flex;align-items:center;gap:6px">
        <div class="act-chk ${done?'done':''}" onclick="${chkClick}">✓</div>
        ${delBtn}
      </div>
    </div>`;
  }).join('');
  g('daily-tip').textContent=TIPS[new Date().getDay()%TIPS.length];
}
// ── DAILY QUESTION ──────────────────────────────────────────
function renderDailyQuestion(){
  const card = g('daily-question-card');
  if(!card||!TODAY_QUESTION) return;
  const answered = !!MY_Q_ANSWER;
  const partnerAnswered = !!PARTNER_Q_ANSWER;
  const partnerName = PARTNER?.name||'Partner';

  let html = `<div style="font-family:'Lora',serif;font-size:14px;font-style:italic;color:var(--text);line-height:1.6;margin-bottom:12px">"${TODAY_QUESTION}"</div>`;

  if(!answered){
    html += `<textarea id="dq-inp" class="mood-note-area" style="height:72px" placeholder="Write your answer... (your partner sees it after they answer too)"></textarea>
    <button class="btn-save" style="margin-top:8px" onclick="saveDailyAnswer()">Share my answer 💬 · +8 🪙</button>`;
  } else {
    html += `<div style="background:var(--rose-l);border-radius:var(--rsm);padding:10px 12px;margin-bottom:8px">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--rose);margin-bottom:4px">Your answer</div>
      <div style="font-size:13px;color:var(--text);line-height:1.5">${MY_Q_ANSWER.answer}</div>
    </div>`;
    if(partnerAnswered){
      html += `<div style="background:var(--teal-l);border-radius:var(--rsm);padding:10px 12px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--teal);margin-bottom:4px">${partnerName}'s answer</div>
        <div style="font-size:13px;color:var(--text);line-height:1.5">${PARTNER_Q_ANSWER.answer}</div>
      </div>`;
    } else {
      html += `<div style="font-size:12px;color:var(--text3);padding:8px 0;text-align:center">⏳ Waiting for ${partnerName} to answer...</div>`;
    }
  }
  card.innerHTML = `<div class="ctitle">💬 Today's question</div>${html}`;
}

async function saveDailyAnswer(){
  const inp = g('dq-inp');
  const answer = inp?.value?.trim();
  if(!answer){ toast('Write something first 💬'); return; }
  const {data, error} = await db.from('daily_question_answers')
    .insert({couple_id:COUPLE.id, user_id:ME.id, answer, question_date:TODAY(), question:TODAY_QUESTION})
    .select().single();
  if(error){ toast('Error saving: '+error.message); return; }
  MY_Q_ANSWER = data;
  await earnCoins(8);
  await tryStreak();
  sendPushNotification('note', (ME?.name||'You')+' answered today\'s question — your turn!');
  renderDailyQuestion();
  toast('Answer shared! +8 🪙 💬');
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

async function unDoAct(id){
  // Remove from DB
  const{error}=await db.from('activities').delete()
    .eq('couple_id',COUPLE.id).eq('user_id',ME.id).eq('act_id',id).eq('act_date',TODAY());
  if(error){toast('Error unchecking');return;}
  ACT_DONE_TODAY=ACT_DONE_TODAY.filter(x=>x!==id);
  renderHome();toast('Activity unchecked');
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

async function deleteCustomAct(id){
  if(!confirm('Remove this activity?'))return;
  const{error}=await db.from('custom_activities').delete().eq('id',id).eq('couple_id',COUPLE.id);
  if(error){toast('Error: '+error.message);return;}
  CUSTOM_ACTS=CUSTOM_ACTS.filter(a=>a.id!==id);
  ACT_DONE_TODAY=ACT_DONE_TODAY.filter(x=>x!==id);
  renderHome();toast('Activity removed');
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
  if(!wasToday){await tryStreak();await earnCoins(5);toast('Mood shared! +5 🪙');sendPushNotification('mood',moodL+(nm.note?' · '+nm.note:''));}
  else{toast('Mood updated 💌');sendPushNotification('mood',moodL+(nm.note?' · '+nm.note:''));}
  await updPlant(3);await updPet(3,0,2);
  g('mood-note').value='';moodE=null;moodL=null;
  document.querySelectorAll('.mood-opt').forEach(e=>e.classList.remove('on'));
  g('mood-coin-note').textContent='';
  renderMood();renderHome();updateBar();
}
async function renderMood(){
  if(!COUPLE) return;
  if(!g('pm-e')) return; // mood screen not in DOM yet
  g('pm-e').textContent=P_MOOD?.emoji||'—';
  g('pm-l').textContent=P_MOOD?.label||(PARTNER?'No mood yet':'Waiting for partner...');
  g('pm-n').textContent=P_MOOD?.note?'"'+P_MOOD.note+'"':'';

  // Smart suggestion based on partner's recent moods
  if(P_MOOD){
    const stressed=['😤','😔','😢','😰','😡','🤒'];
    const positive=['😄','😊','🥰','😌','🤩','😎','🥳'];
    const isStressed=stressed.includes(P_MOOD.emoji);
    const isPositive=positive.includes(P_MOOD.emoji);
    let sug='';
    if(isStressed) sug='💛 '+(PARTNER?.name||'Partner')+' seems to be having a tough time. A love note or cozy plan tonight could mean a lot.';
    else if(P_MOOD.emoji==='😴') sug='🌙 '+(PARTNER?.name||'Partner')+' is tired. Maybe suggest an early cozy night in together?';
    else if(P_MOOD.emoji==='🤔') sug='🫂 '+(PARTNER?.name||'Partner')+' has something on their mind. Ask them about it tonight.';
    else if(P_MOOD.emoji==='😐') sug='☕ '+(PARTNER?.name||'Partner')+' is feeling meh. A small surprise or kind gesture could turn their day around.';
    else if(isPositive) sug='✨ '+(PARTNER?.name||'Partner')+' is feeling great! Keep the good energy going — do something fun together.';
    else sug='💛 Check in with '+(PARTNER?.name||'Partner')+' today — let them know you are thinking of them.';
    g('pm-sug').textContent=sug;
  } else {
  g('pm-sug').textContent="Your partner hasn't shared their mood yet today.";
  }

  // Load real mood history from DB
  const{data:moods}=await db.from('moods')
    .select('*').eq('couple_id',COUPLE.id)
    .order('created_at',{ascending:false}).limit(14);
  const hist=g('mhist');
  if(!hist) return;
  if(!moods||moods.length===0){hist.innerHTML='<div style="font-size:13px;color:var(--text3);padding:8px 0">No mood history yet — start sharing!</div>';return;}
  hist.innerHTML=moods.map(m=>{
    const mine=m.user_id===ME.id;
    const who=mine?(ME?.name||'You'):(PARTNER?.name||'Partner');
    const dt=new Date(m.created_at).toLocaleDateString('en',{weekday:'short',month:'short',day:'numeric'});
    return`<div class="mhrow">
      <div style="font-size:20px">${m.emoji}</div>
      <div class="mhinfo"><div class="mhname">${who} · ${m.label}</div>${m.note?`<div class="mhnote">"${m.note}"</div>`:''}</div>
      <div class="mhtime">${dt}</div>
    </div>`;
  }).join('');
}

// NEST
async function updPet(l,h,hl){await updateSS({pet_love:Math.min(100,(SS.pet_love||60)+l),pet_happy:Math.min(100,(SS.pet_happy||75)+h),pet_health:Math.min(100,(SS.pet_health||50)+hl)});}
async function updPlant(v){await updateSS({plant_progress:Math.min(100,(SS.plant_progress||20)+v)});}
async function feedPet(){
  const field=COUPLE.user1_id===ME.id?'pet_fed_user1':'pet_fed_user2';
  if((SS[field]||'')===TODAY()){toast('You already fed Pebble today! Come back tomorrow 🌙');return;}
  await updateSS({[field]:TODAY()});await updPet(10,12,8);await tryStreak();await earnCoins(3);toast('Pebble loved that! 🌟');renderNest();
}
async function waterPlant(){
  const field=COUPLE.user1_id===ME.id?'plant_wat_user1':'plant_wat_user2';
  if((SS[field]||'')===TODAY()){toast('You already watered Sprout today! Come back tomorrow 💧');return;}
  await updateSS({[field]:TODAY()});await updPlant(10);await tryStreak();await earnCoins(3);toast('Sprout is growing! 🌱');renderNest();
}
function renderNest(){
  if(!SS)return;
  const{pet_love:pl=60,pet_happy:ph=75,pet_health:phl=50,plant_progress:pp=20}=SS;
  ['love','happy','health'].forEach((k,i)=>{const v=[pl,ph,phl][i];g('st-'+k).style.width=v+'%';g('st-'+k+'-n').textContent=v+'%';});
  const ptl=Math.min(Math.floor((pl+ph+phl)/(300/PETS.length)),PETS.length-1);
  g('pet-art').textContent=PETS[ptl];g('pet-in-room').textContent=PETS[ptl];
  const iU1=COUPLE?.user1_id===ME?.id;
  const myFedField=iU1?'pet_fed_user1':'pet_fed_user2';
  const pFedField =iU1?'pet_fed_user2':'pet_fed_user1';
  const myWatField=iU1?'plant_wat_user1':'plant_wat_user2';
  const pWatField =iU1?'plant_wat_user2':'plant_wat_user1';
  const fed=(SS[myFedField]||'')===TODAY();
  const pFed=(SS[pFedField]||'')===TODAY();
  g('feed-btn').disabled=fed;g('feed-btn').style.opacity=fed?.5:1;
  g('pet-fed-badge').textContent=fed?'You fed Pebble ✓':(pFed?(PARTNER?.name||'Partner')+' fed Pebble ✓':'');
  g('pet-lim').textContent=fed?'You already fed Pebble today':(pFed?'You can still feed Pebble today!':'Both of you can feed once per day');
  const lvl=Math.min(Math.floor(pp/20),PLANTS.length-1);
  g('plant-art').textContent=PLANTS[lvl];g('plant-bar').style.width=pp+'%';
  g('plant-lbl').textContent=['Seedling','Sprout','Sapling','Young plant','Blooming','In full bloom'][lvl]+' · '+Math.round(pp)+'% grown';
  const wat=(SS[myWatField]||'')===TODAY();
  const pWat=(SS[pWatField]||'')===TODAY();
  g('water-btn').disabled=wat;g('water-btn').style.opacity=wat?.5:1;
  g('plant-watered-badge').textContent=wat?'You watered Sprout 💧':(pWat?(PARTNER?.name||'Partner')+' watered Sprout 💧':'');
  g('plant-lim').textContent=wat?'You already watered Sprout today':(pWat?'You can still water Sprout today!':'Both of you can water once per day');
}

// CITY buy
async function buyLoc(id){
  const b=BLDGS.find(x=>x.id===id);if(!b)return;
  if((SS.coins||0)<b.cost){toast('Not enough coins 🪙');return;}
  const newCity={...(SS.city||{}),[id]:true};
  const{error}=await db.from('shared_state')
    .update({coins:SS.coins-b.cost,city:newCity,updated_at:new Date().toISOString()})
    .eq('couple_id',COUPLE.id);
  if(error){toast('Error: '+error.message);return;}
  SS.coins=SS.coins-b.cost;
  SS.city=newCity;
  updateBar();
  toast('🎉 '+b.name+' unlocked!');
  // Rebuild map then reopen as unlocked
  buildCityMap();
  setTimeout(()=>openLoc(id),100);
}

// NOTES
function renderNotes(){
  const el=g('notes-list'); if(!el) return;
  el.innerHTML=NOTES.map(n=>{
    const mine=n.user_id===ME.id;
    if(n.sticker)return`<div class="nbub sticker ${mine?'me':'p'}" onclick="${mine?`deleteNote('${n.id}')`:''}">${n.sticker}</div>`;
    const t=new Date(n.created_at).toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'});
    return`<div class="nbub ${mine?'me':'p'}">
      <div class="nt">${n.text}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:3px">
        <div class="ntm">${t}</div>
        ${mine?`<div class="ntm" style="cursor:pointer;opacity:.5" onclick="deleteNote('${n.id}')">✕</div>`:''}
      </div>
    </div>`;
  }).join('');
  setTimeout(()=>{const s=g('notes-scroll');if(s)s.scrollTop=s.scrollHeight;},60);
}
async function sendNote(){
  const inp=g('note-inp'),txt=inp.value.trim();if(!txt)return;
  inp.value='';inp.style.height='';
  const {data:note,error}=await db.from('notes').insert({couple_id:COUPLE.id,user_id:ME.id,text:txt,sticker:''}).select().single();
  if(error){toast('Error sending');return;}
  NOTES.push(note);renderNotes();await earnCoins(2);
  sendPushNotification('note', txt.substring(0,80));
}
async function sendStkr(s){
  const {data:note}=await db.from('notes').insert({couple_id:COUPLE.id,user_id:ME.id,text:'',sticker:s}).select().single();
  if(note){NOTES.push(note);renderNotes();}
}
async function deleteNote(id){
  if(!confirm('Delete this note?'))return;
  const{error}=await db.from('notes').delete().eq('id',id).eq('user_id',ME.id);
  if(error){toast('Error deleting');return;}
  NOTES=NOTES.filter(n=>n.id!==id);renderNotes();
}

function autoR(el_){el_.style.height='';el_.style.height=Math.min(el_.scrollHeight,110)+'px';}

function toggleStickers(){
  const row=g('stickers-row');
  const btn=g('stkr-toggle-btn');
  const hidden=row.classList.toggle('hidden');
  btn.textContent=hidden?'😊':'✕';
  if(!hidden) setTimeout(()=>{const s=g('notes-scroll');if(s)s.scrollTop=s.scrollHeight;},50);
}

// DATES
function renderDates(){
  const el=g('dates-list'); if(!el) return;
  const today=new Date();today.setHours(0,0,0,0);
  el.innerHTML=(DATES||[]).map(d=>{
    const dt=new Date(d.date+'T00:00:00');
    let next=new Date(dt);next.setFullYear(today.getFullYear());
    if(next<today)next.setFullYear(today.getFullYear()+1);
    const diff=Math.ceil((next-today)/86400000);
    return`<div class="date-card"><div style="font-size:26px;flex-shrink:0">${d.icon}</div>
      <div style="flex:1"><div class="date-name">${d.name}</div><div class="date-when">${dt.toLocaleDateString('en',{month:'long',day:'numeric'})}</div></div>
      <div style="display:flex;align-items:center;gap:10px">
        <div><div class="date-days">${diff===0?'🎉':diff}</div><div class="date-dlbl">${diff===0?'today!':'days'}</div></div>
        <div style="font-size:16px;cursor:pointer;opacity:.4;padding:4px" onclick="deleteDate('${d.id}')">🗑️</div>
      </div>
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

async function deleteDate(id){
  if(!confirm('Delete this date?'))return;
  const{error}=await db.from('special_dates').delete().eq('id',id).eq('couple_id',COUPLE.id);
  if(error){toast('Error deleting');return;}
  DATES=DATES.filter(d=>d.id!==id);renderDates();toast('Date removed');
}

// TABS
const TABS=['home','mood','nest','city','notes','dates','settings'];
function goTab(t){TABS.forEach(x=>{g('s-'+x).classList.add('hidden');g('t-'+x).classList.remove('on');});g('s-'+t).classList.remove('hidden');g('t-'+t).classList.add('on');if(t==='notes')setTimeout(()=>{const s=g('s-notes');s.scrollTop=s.scrollHeight;},80);if(t==='city')buildCityMap();if(t==='settings')renderSettings();if(t==='nest'){renderNestRooms();renderNest();}}

// MODALS
function showModal(id){if(id==='modal-date')g('date-date-inp').value=TODAY();g(id).classList.remove('hidden');}
function hideModal(id){g(id).classList.add('hidden');}
function ovClose(e,id){if(e.target.classList.contains('modal-ov'))hideModal(id);}

// BOOT — only run boot on actual sign-in/out events, not token refreshes
let _booted = false;
db.auth.onAuthStateChange((event, session) => {
  if(event === 'SIGNED_OUT'){ _booted = false; loading(false); showAuth('login'); return; }
  if(session && !_booted){ _booted = true; boot(); }
});

// ── SERVICE WORKER + PUSH REGISTRATION ───────────────────────
async function registerPush(){
  if(!('serviceWorker' in navigator)||!('PushManager' in window)){
    console.warn('Push not supported');return;
  }
  if(!VAPID_PUBLIC_KEY||VAPID_PUBLIC_KEY==='YOUR_VAPID_PUBLIC_KEY'){
    console.warn('VAPID key not set');return;
  }
  try{
    const reg = await navigator.serviceWorker.register('/sw.js',{scope:'/'});
    await navigator.serviceWorker.ready;

    // Always get/create a fresh subscription
    let sub = await reg.pushManager.getSubscription();

    // Unsubscribe old one first so we always get a fresh valid sub
    if(sub){ await sub.unsubscribe(); }

    const perm = await Notification.requestPermission();
    if(perm !== 'granted'){console.warn('Push permission denied');return;}

    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    // Delete any old subscriptions for this user first, then insert fresh one
    await db.from('push_subscriptions').delete().eq('user_id', ME.id);
    const{error}=await db.from('push_subscriptions').insert({
      user_id: ME.id,
      couple_id: COUPLE.id,
      endpoint: sub.endpoint,
      subscription: sub.toJSON()
    });
    if(error) console.warn('Push save failed:',error.message);
    else console.log('Push registered successfully');
  } catch(e){ console.warn('Push registration failed:',e.message||e); }
}

function urlBase64ToUint8Array(base64String){
  const padding='='.repeat((4-base64String.length%4)%4);
  const base64=(base64String+padding).replace(/-/g,'+').replace(/_/g,'/');
  const raw=atob(base64);
  return Uint8Array.from([...raw].map(c=>c.charCodeAt(0)));
}

async function sendPushNotification(type, content){
  if(!COUPLE||!ME) return;
  try{
    // Use the current user session token for auth
    const{data:{session}}=await db.auth.getSession();
    const token=session?.access_token||SUPABASE_ANON;
    const res=await fetch(`${SUPABASE_URL}/functions/v1/push-notify`, {
      method: 'POST',
      headers: {'Content-Type':'application/json','Authorization':'Bearer '+token},
      body: JSON.stringify({type, couple_id:COUPLE.id, sender_id:ME.id, sender_name:ME.name||'Partner', content})
    });
    if(!res.ok){
      const txt=await res.text();
      console.warn('Push notify failed:',res.status, txt);
    } else {
      console.log('Push sent:', await res.text());
    }
  } catch(e){ console.warn('Push send failed:', e.message||e); }
}

// Call this from browser console to test: testPush()
async function testPush(){
  console.log('Testing push...');
  await sendPushNotification('note','Test notification from Cozy Nest!');
}

// ── SETTINGS ─────────────────────────────────────────────────
function renderSettings(){
  if(!ME) return;
  // Profile
  g('settings-avatar').textContent = ME?.avatar||'🐻';
  g('settings-name').textContent = ME?.name||'You';
  g('settings-email').textContent = ME?.email||(db.auth.getUser().then(r=>r.data?.user?.email||''));
  g('settings-name-inp').value = ME?.name||'';

  // Highlight current avatar
  g('settings-av-row').querySelectorAll('.ob-em').forEach(b=>{
    b.classList.toggle('on', b.dataset.e === ME?.avatar);
  });

  // Couple block
  const block = g('settings-couple-block');
  if(!COUPLE){
    block.innerHTML = `<div class="settings-no-partner">
      <div class="settings-no-partner-icon">💌</div>
      <div class="settings-no-partner-text">You haven't linked with a partner yet.<br>Share your invite code or enter theirs.</div>
      <button class="btn-save" onclick="goTab('settings');showCouple()">Link with partner</button>
    </div>`;
    return;
  }

  // Has couple — show invite code + partner status
  const code = COUPLE.invite_code||'—';
  updateNotifStatus();
  const hasPartner = !!(COUPLE.user1_id && COUPLE.user2_id);
  block.innerHTML = `
    <div class="ob-lbl">Your invite code</div>
    <div class="settings-code" onclick="copyCode('${code}')" title="Tap to copy">${code}</div>
    <div class="settings-copy-hint">Tap to copy · share with your partner</div>
    ${hasPartner ? `
    <div style="margin-top:14px">
      <div class="ob-lbl">Partner</div>
      <div class="settings-partner-row">
        <div style="font-size:28px">${PARTNER?.avatar||'🐱'}</div>
        <div>
          <div style="font-size:14px;font-weight:600">${PARTNER?.name||'Partner'}</div>
          <div style="font-size:11px;color:var(--sage);font-weight:600;margin-top:2px">✓ Linked</div>
        </div>
      </div>
    </div>` : `
    <div style="margin-top:12px;padding:10px 12px;background:var(--amber-l);border-radius:var(--rsm);font-size:13px;color:var(--brown);line-height:1.5">
      ⏳ Waiting for your partner to join using your code above.
    </div>
    <div style="margin-top:10px">
      <div class="ob-lbl">Or enter their code</div>
      <div style="display:flex;gap:8px;margin-top:6px">
        <input class="ob-inp" id="settings-join-inp" placeholder="e.g. NEST42" maxlength="8" style="flex:1;text-align:center;font-family:Lora,serif;font-size:18px;letter-spacing:3px;text-transform:uppercase">
        <button class="btn-save" style="width:auto;padding:11px 16px;margin-top:0" onclick="settingsJoin()">Join</button>
      </div>
    </div>`}`;
}

function copyCode(code){
  navigator.clipboard.writeText(code).then(()=>toast('Code copied! 📋')).catch(()=>toast('Your code: '+code));
}

async function saveName(){
  const name = g('settings-name-inp').value.trim();
  if(!name){toast('Enter a name');return;}
  const {error} = await db.from('profiles').update({name}).eq('id', ME.id);
  if(error){toast('Error saving');return;}
  ME.name = name;
  g('settings-name').textContent = name;
  renderHome(); toast('Name updated ✓');
}

async function saveAvatar(btn){
  const avatar = btn.dataset.e;
  const {error} = await db.from('profiles').update({avatar}).eq('id', ME.id);
  if(error){toast('Error saving');return;}
  ME.avatar = avatar;
  g('settings-avatar').textContent = avatar;
  g('settings-av-row').querySelectorAll('.ob-em').forEach(b=>b.classList.toggle('on', b.dataset.e===avatar));
  renderHome(); toast('Avatar updated ✓');
}

// ── NEST ACTIVITY (interactive home card) ─────────────────
const NEST_ACTIVITIES=[
  {q:"What is one thing your partner did recently that made you smile?",type:'reflect'},
  {q:'Send your partner a voice note right now — just say hi.',type:'action'},
  {q:"Name one thing you love about your partner that they might not know.",type:'reflect'},
  {q:'Plan one small thing to do together this week.',type:'action'},
  {q:"What is your partner's love language? Are you speaking it today?",type:'reflect'},
  {q:'Send a photo that reminds you of a happy memory together.',type:'action'},
  {q:"What is something your partner has been working hard on lately?",type:'reflect'},
  {q:"Write your partner a 3-sentence love letter in the notes tab.",type:'action'},
];

function renderNestActivity(){
  if(!ME||!COUPLE) return;
  const card=g('nest-activity-card');
  if(!card)return;
  const idx=Math.floor(Date.now()/86400000)%NEST_ACTIVITIES.length;
  const act=NEST_ACTIVITIES[idx];
  const isAction=act.type==='action';
  card.style.display='block';
  g('nest-act-content').innerHTML=`
    <div style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:10px;font-family:'Lora',serif;font-style:italic">"${act.q}"</div>
    <div style="display:flex;gap:8px">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:4px 10px;border-radius:var(--rpill);background:${isAction?'var(--teal-l)':'var(--amber-l)'};color:${isAction?'var(--teal)':'var(--brown)'}">
        ${isAction?'🎯 Action':'💭 Reflection'}
      </div>
    </div>`;
}

// ── INTERACTIVE ACTIVITY SEQUENCES ───────────────────────────
// Each room can have a multi-step turn-based sequence tracked in shared_state.
// State stored in SS.activity_sequences: { [sequenceId]: { step, completedBy, startedAt, done } }

const ACTIVITY_SEQUENCES = {
  kitchen: {
    id: 'kitchen_cook',
    title: '🍳 Cook Together',
    icon: '🍳',
    coins: 20,
    steps: [
      { role: 1, text: 'Wash and chop the vegetables', icon: '🥕' },
      { role: 2, text: 'Season and prep the meat or protein', icon: '🥩' },
      { role: 1, text: 'Add the vegetables to the pot', icon: '🥘' },
      { role: 2, text: 'Cook everything and stir together', icon: '🔥' },
      { role: 1, text: 'Set the table and plate the food', icon: '🍽️' },
    ]
  },
  living: {
    id: 'living_movie',
    title: '🎬 Movie Night Setup',
    icon: '🎬',
    coins: 15,
    steps: [
      { role: 1, text: 'Pick tonight\'s movie or show', icon: '📺' },
      { role: 2, text: 'Prepare snacks and drinks', icon: '🍿' },
      { role: 1, text: 'Get the blankets and pillows ready', icon: '🛋️' },
      { role: 2, text: 'Dim the lights and start the film', icon: '🌙' },
    ]
  },
  garden: {
    id: 'garden_walk',
    title: '🌿 Garden Ritual',
    icon: '🌿',
    coins: 12,
    steps: [
      { role: 1, text: 'Water the plants together', icon: '💧' },
      { role: 2, text: 'Clear any leaves or tidy up', icon: '🍂' },
      { role: 1, text: 'Pick a spot and sit outside for 5 minutes', icon: '☀️' },
      { role: 2, text: 'Share one thing you noticed outside today', icon: '💬' },
    ]
  },
  bedroom: {
    id: 'bedroom_wind',
    title: '🌙 Wind Down Together',
    icon: '🌙',
    coins: 12,
    steps: [
      { role: 1, text: 'Put both phones on Do Not Disturb', icon: '📵' },
      { role: 2, text: 'Make a warm drink for both of you', icon: '☕' },
      { role: 1, text: 'Share one thing you\'re grateful for today', icon: '💛' },
      { role: 2, text: 'Give your partner a goodnight compliment', icon: '🌸' },
    ]
  },
};

function getSeqState(seqId){
  try{ return (SS?.activity_sequences || {})[seqId] || null; }
  catch(e){ return null; }
}

function isUser1(){ return COUPLE?.user1_id === ME?.id; }
function myRole(){ return isUser1() ? 1 : 2; }
function partnerRole(){ return isUser1() ? 2 : 1; }

function openSequence(roomId){
  const seq = ACTIVITY_SEQUENCES[roomId];
  if(!seq){ toast('No sequence for this room yet'); return; }
  const modal = document.getElementById('modal-sequence');
  modal.dataset.seqid = seq.id;
  renderSequenceModal(seq);
  modal.classList.remove('hidden');
}

function renderSequenceModal(seq){
  const state = getSeqState(seq.id);
  const modal = document.getElementById('modal-sequence');
  const body = document.getElementById('seq-body');
  const currentStep = state ? state.step : 0;
  const isDone = state?.done;
  const myR = myRole();

  let html = `<div style="font-size:28px;text-align:center;margin-bottom:4px">${seq.icon}</div>
    <div style="font-family:'Lora',serif;font-size:17px;font-weight:600;text-align:center;color:var(--text);margin-bottom:16px">${seq.title}</div>`;

  if(isDone){
    html += `<div style="text-align:center;padding:20px 0">
      <div style="font-size:40px">🎉</div>
      <div style="font-size:14px;font-weight:600;color:var(--sage);margin-top:8px">Sequence complete!</div>
      <div style="font-size:12px;color:var(--text3);margin-top:4px">+${seq.coins} 🪙 earned</div>
      <button class="btn-save" style="margin-top:14px;background:var(--text2)" onclick="resetSequence('${seq.id}')">Start over</button>
    </div>`;
  } else {
    html += seq.steps.map((step, i) => {
      const done = i < currentStep;
      const active = i === currentStep;
      const isMyTurn = active && step.role === myR;
      const isPartnerTurn = active && step.role !== myR;
      const partnerName = PARTNER?.name || 'Partner';
      const myName = ME?.name || 'You';
      const whoLabel = step.role === myR ? myName : partnerName;

      let bg = 'var(--bd)';
      let opacity = '0.45';
      let border = '1.5px solid transparent';
      if(done){ bg = 'var(--sage-l)'; opacity = '1'; border = '1.5px solid var(--sage)'; }
      if(isMyTurn){ bg = 'var(--rose-l)'; opacity = '1'; border = '1.5px solid var(--rose)'; }
      if(isPartnerTurn){ bg = 'var(--amber-l)'; opacity = '1'; border = '1.5px solid var(--amber)'; }

      return `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:${bg};border:${border};opacity:${opacity};margin-bottom:8px">
        <div style="font-size:22px;flex-shrink:0">${done ? '✅' : step.icon}</div>
        <div style="flex:1">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${done?'var(--sage)':isMyTurn?'var(--rose)':'var(--brown)'};margin-bottom:2px">${done?'Done':isMyTurn?'Your turn':''+whoLabel+''}</div>
          <div style="font-size:13px;color:var(--text);line-height:1.4">${step.text}</div>
        </div>
      </div>`;
    }).join('');

    if(currentStep < seq.steps.length){
      const active = seq.steps[currentStep];
      const isMyT = active.role === myR;
      if(isMyT){
        html += `<button class="btn-save" style="margin-top:6px" onclick="advanceSequence('${seq.id}')">Mark my step done ✓</button>`;
      } else {
        html += `<div style="text-align:center;padding:10px 0;font-size:13px;color:var(--text3)">⏳ Waiting for ${PARTNER?.name||'your partner'} to complete their step...</div>`;
      }
    }
  }

  body.innerHTML = html;
}

async function advanceSequence(seqId){
  const seq = ACTIVITY_SEQUENCES[Object.keys(ACTIVITY_SEQUENCES).find(k => ACTIVITY_SEQUENCES[k].id === seqId)];
  if(!seq) return;
  const state = getSeqState(seqId) || { step: 0, done: false };
  const nextStep = state.step + 1;
  const done = nextStep >= seq.steps.length;
  const newState = { step: nextStep, done, completedAt: done ? new Date().toISOString() : null };
  const newSeqs = { ...(SS.activity_sequences || {}), [seqId]: newState };
  await updateSS({ activity_sequences: newSeqs });
  if(done){ await earnCoins(seq.coins); toast('Sequence complete! +'+seq.coins+' 🪙 🎉'); }
  else { toast('Step done! Partner\'s turn 💛'); sendPushNotification('note', (ME?.name||'You')+' completed a step — your turn!'); }
  renderSequenceModal(seq);
}

async function resetSequence(seqId){
  const newSeqs = { ...(SS.activity_sequences || {}) };
  delete newSeqs[seqId];
  await updateSS({ activity_sequences: newSeqs });
  const seq = ACTIVITY_SEQUENCES[Object.keys(ACTIVITY_SEQUENCES).find(k => ACTIVITY_SEQUENCES[k].id === seqId)];
  if(seq) renderSequenceModal(seq);
  toast('Starting fresh! 🌱');
}

// ── NOTIFICATION SETTINGS ─────────────────────────────────
async function updateNotifStatus(){
  if(!ME||!COUPLE) return;
  const statusEl=g('notif-status');
  const toggleEl=g('notif-toggle');
  if(!statusEl||!toggleEl)return;
  if(!('Notification' in window)){
    statusEl.textContent='Not supported on this browser';
    toggleEl.style.display='none';return;
  }
  const perm=Notification.permission;
  if(perm==='granted'){
    // Check if actually subscribed
    const{data:subs}=await db.from('push_subscriptions').select('id').eq('user_id',ME.id);
    if(subs&&subs.length>0){
      statusEl.textContent='✓ Enabled — you will receive notifications';
      toggleEl.textContent='Disable';
      toggleEl.style.background='var(--text3)';
    } else {
      statusEl.textContent='Permission granted but not registered';
      toggleEl.textContent='Enable';
      toggleEl.style.background='var(--rose)';
    }
  } else if(perm==='denied'){
    statusEl.textContent='Blocked — enable in your browser settings';
    toggleEl.textContent='Blocked';
    toggleEl.disabled=true;
    toggleEl.style.opacity='.5';
  } else {
    statusEl.textContent='Not yet enabled';
    toggleEl.textContent='Enable';
    toggleEl.style.background='var(--rose)';
  }
}

async function toggleNotifications(){
  const toggleEl=g('notif-toggle');
  if(toggleEl.textContent==='Disable'){
    // Unsubscribe
    const reg=await navigator.serviceWorker.getRegistration('/sw.js');
    if(reg){const sub=await reg.pushManager.getSubscription();if(sub)await sub.unsubscribe();}
    await db.from('push_subscriptions').delete().eq('user_id',ME.id);
    toast('Notifications disabled');
  } else {
    await registerPush();
    toast('Notifications enabled 🔔');
  }
  await updateNotifStatus();
}

async function settingsJoin(){
  const code = g('settings-join-inp').value.trim().toUpperCase();
  if(!code){toast('Enter your partner\'s code');return;}
  const {data:couple,error} = await db.from('couples').select('*').eq('invite_code',code).single();
  if(error||!couple){toast('Code not found');return;}
  if(couple.user2_id){toast('This couple is already full');return;}
  if(couple.user1_id===ME.id){toast("That's your own code!");return;}
  await db.from('couples').update({user2_id:ME.id}).eq('id',couple.id);
  await db.from('profiles').update({couple_id:couple.id}).eq('id',ME.id);
  ME.couple_id=couple.id; COUPLE={...couple,user2_id:ME.id};
  toast('Linked with your partner! 💛');
  await boot();
}

// ── NEST ROOMS ────────────────────────────────────────────────
let nestRoomIdx = 0;

const NEST_ROOMS = [
  {
    id: 'living', name: '🛋️ Living Room',
    activity: { icon:'💬', text:'Sit on the couch together tonight — no phones. Share the best and worst part of your day.' },
    decor: [
      {id:'plant_big',name:'Big Plant',icon:'🪴',cost:30},
      {id:'fairy_lights',name:'Fairy Lights',icon:'✨',cost:40},
      {id:'painting',name:'Wall Art',icon:'🖼️',cost:50},
      {id:'cat_bed',name:'Pet Bed',icon:'🛏️',cost:35},
    ],
    svg: (c,pet) => `<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block">
      <rect width="340" height="200" fill="${c.wall}"/>
      <rect y="155" width="340" height="45" fill="${c.floor}"/>
      <ellipse cx="170" cy="160" rx="95" ry="14" fill="rgba(0,0,0,.06)"/>
      <rect x="75" y="108" width="140" height="50" rx="13" fill="${c.sofa}" opacity=".9"/>
      <rect x="75" y="99" width="140" height="22" rx="10" fill="${c.sofa}" opacity=".7" style="filter:brightness(.85)"/>
      <rect x="75" y="104" width="20" height="54" rx="8" fill="${c.sofa}" opacity=".7" style="filter:brightness(.8)"/>
      <rect x="195" y="104" width="20" height="54" rx="8" fill="${c.sofa}" opacity=".7" style="filter:brightness(.8)"/>
      <ellipse cx="122" cy="112" rx="18" ry="9" fill="white" opacity=".35"/>
      <ellipse cx="168" cy="112" rx="18" ry="9" fill="white" opacity=".25"/>
      <rect x="215" y="24" width="88" height="76" rx="6" fill="#EBF5F5" stroke="#B8958A" stroke-width="1.5"/>
      <line x1="259" y1="24" x2="259" y2="100" stroke="#B8958A" stroke-width="1.5"/>
      <line x1="215" y1="62" x2="303" y2="62" stroke="#B8958A" stroke-width="1.5"/>
      <circle cx="236" cy="45" r="12" fill="#FFD54F" opacity=".55"/>
      <rect x="24" y="44" width="66" height="88" rx="4" fill="#8B6355" opacity=".6"/>
      <rect x="24" y="44" width="66" height="9" rx="2" fill="#7A5C52"/>
      ${[0,1,2,3].map(i=>`<rect x="${30+i*14}" y="${57}" width="10" height="${26+i%2*8}" rx="2" fill="${['#E8735A','#5BA4A4','#E8A83A','#7BA68A'][i]}" opacity=".9"/>`).join('')}
      ${[0,1,2,3].map(i=>`<rect x="${30+i*14}" y="${90}" width="10" height="${22+i%3*6}" rx="2" fill="${['#5BA4A4','#E8A83A','#E8735A','#7BA68A'][i]}" opacity=".85"/>`).join('')}
      <rect x="295" y="134" width="14" height="22" rx="3" fill="#8B6355" opacity=".6"/>
      <circle cx="302" cy="125" r="16" fill="#7BA68A" opacity=".85"/>
      <circle cx="294" cy="132" r="10" fill="#5BA4A4" opacity=".7"/>
      <rect x="220" y="122" width="5" height="32" fill="#B8958A"/>
      <polygon points="210,122 240,122 230,104 220,104" fill="#EF9F27" opacity=".8"/>
      ${c.decor?.fairy_lights?'<path d="M20,30 Q85,18 170,22 Q255,18 320,30" fill="none" stroke="#FFE082" stroke-width="1.5" opacity=".7"/><circle cx="60" cy="25" r="3" fill="#FFE082"/><circle cx="120" cy="21" r="3" fill="#FFE082"/><circle cx="170" cy="22" r="3" fill="#FFE082"/><circle cx="220" cy="21" r="3" fill="#FFE082"/><circle cx="280" cy="25" r="3" fill="#FFE082"/>':''}
      ${c.decor?.plant_big?'<rect x="8" y="128" width="14" height="26" rx="3" fill="#8B6355" opacity=".6"/><circle cx="15" cy="112" r="20" fill="#66BB6A" opacity=".85"/><circle cx="6" cy="122" r="13" fill="#43A047" opacity=".7"/>':''}
      ${c.decor?.painting?'<rect x="140" y="18" width="54" height="38" rx="3" fill="white" stroke="#B8958A" stroke-width="1.5"/><rect x="144" y="22" width="46" height="30" rx="2" fill="#EBF5F5"/><circle cx="167" cy="37" r="8" fill="#E8735A" opacity=".6"/><circle cx="175" cy="32" r="5" fill="#5BA4A4" opacity=".6"/>':''}
      ${c.decor?.cat_bed?`<ellipse cx="145" cy="155" rx="18" ry="10" fill="#FDEEE9" stroke="#F5A48B" stroke-width="1.5"/><text x="145" y="159" font-size="14" text-anchor="middle">${pet}</text>`:`<text x="145" y="159" font-size="16" text-anchor="middle">${pet}</text>`}
    </svg>`
  },
  {
    id: 'kitchen', name: '🍳 Kitchen',
    activity: { icon:'🍳', text:'Cook or bake something together this week — even just breakfast counts.' },
    decor: [
      {id:'herb_garden',name:'Herb Garden',icon:'🌿',cost:25},
      {id:'coffee_maker',name:'Coffee Maker',icon:'☕',cost:45},
      {id:'fruit_bowl',name:'Fruit Bowl',icon:'🍎',cost:20},
      {id:'wine_rack',name:'Wine Rack',icon:'🍷',cost:55},
    ],
    svg: (c,pet) => `<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block">
      <rect width="340" height="200" fill="${c.wall}"/>
      <rect y="148" width="340" height="52" fill="${c.floor}"/>
      <!-- Tiles -->
      ${Array.from({length:8},(_,i)=>Array.from({length:3},(_,j)=>`<rect x="${i*44}" y="${j*18+60}" width="42" height="16" rx="1" fill="white" stroke="#E0D0C8" stroke-width=".5" opacity=".4"/>`).join('')).join('')}
      <!-- Counter -->
      <rect x="0" y="112" width="340" height="40" fill="#8B6355" opacity=".55"/>
      <rect x="0" y="108" width="340" height="10" rx="2" fill="#6D4C41" opacity=".7"/>
      <!-- Stove -->
      <rect x="100" y="68" width="80" height="46" rx="4" fill="#5D4037" opacity=".75"/>
      <rect x="108" y="75" width="64" height="32" rx="3" fill="#3E2723" opacity=".9"/>
      <circle cx="120" cy="86" r="8" fill="#1A1A1A" opacity=".7"/>
      <circle cx="140" cy="86" r="8" fill="#1A1A1A" opacity=".7"/>
      <circle cx="160" cy="86" r="8" fill="#1A1A1A" opacity=".7"/>
      <!-- Fridge -->
      <rect x="265" y="28" width="60" height="84" rx="5" fill="#ECEFF1" stroke="#B0BEC5" stroke-width="1.5"/>
      <rect x="265" y="28" width="60" height="46" rx="5" fill="#F5F5F5"/>
      <line x1="265" y1="74" x2="325" y2="74" stroke="#B0BEC5" stroke-width="1.5"/>
      <rect x="318" y="48" width="5" height="16" rx="2" fill="#90A4AE"/>
      <rect x="318" y="82" width="5" height="16" rx="2" fill="#90A4AE"/>
      <!-- Cabinets -->
      <rect x="0" y="24" width="90" height="56" rx="4" fill="#8B6355" opacity=".55"/>
      <rect x="4" y="28" width="40" height="48" rx="3" fill="#A1887F" opacity=".4"/>
      <rect x="47" y="28" width="40" height="48" rx="3" fill="#A1887F" opacity=".4"/>
      <circle cx="25" cy="52" r="3" fill="#E8A83A" opacity=".8"/>
      <circle cx="67" cy="52" r="3" fill="#E8A83A" opacity=".8"/>
      <!-- Sink -->
      <rect x="196" y="110" width="60" height="32" rx="4" fill="#90A4AE" opacity=".6"/>
      <circle cx="226" cy="120" r="5" fill="#607D8B"/>
      ${c.decor?.coffee_maker?'<rect x="30" y="80" width="28" height="34" rx="4" fill="#3D2B23" opacity=".85"/><rect x="34" y="84" width="20" height="12" rx="2" fill="#1A1A1A"/><circle cx="44" cy="106" r="7" fill="#6D4C41" stroke="#E8A83A" stroke-width="1.5"/>':''}
      ${c.decor?.herb_garden?'<rect x="0" y="58" width="96" height="12" rx="2" fill="#A5D6A7" opacity=".4"/><text x="8" y="68" font-size="12">🌿</text><text x="28" y="68" font-size="12">🌱</text><text x="48" y="68" font-size="12">🌿</text><text x="68" y="68" font-size="12">🌱</text>':''}
      ${c.decor?.fruit_bowl?'<circle cx="165" cy="108" r="12" fill="#FFCC02" opacity=".8"/><text x="155" y="112" font-size="14">🍎</text>':''}
      ${c.decor?.wine_rack?'<rect x="205" y="62" width="44" height="46" rx="3" fill="#5D4037" opacity=".6"/><circle cx="218" cy="75" r="5" fill="#9C3030" opacity=".7"/><circle cx="235" cy="75" r="5" fill="#9C3030" opacity=".7"/><circle cx="218" cy="92" r="5" fill="#9C3030" opacity=".6"/><circle cx="235" cy="92" r="5" fill="#9C3030" opacity=".6"/>':''}
      <text x="50" y="158" font-size="16" text-anchor="middle">${pet}</text>
    </svg>`
  },
  {
    id: 'garden', name: '🌿 Garden',
    activity: { icon:'🚶', text:'Go outside together for 15 minutes. Leave your phones at home.' },
    decor: [
      {id:'fountain',name:'Fountain',icon:'⛲',cost:60},
      {id:'bbq',name:'BBQ Grill',icon:'🔥',cost:50},
      {id:'hammock',name:'Hammock',icon:'🌴',cost:45},
      {id:'bird_feeder',name:'Bird Feeder',icon:'🐦',cost:30},
    ],
    svg: (c,pet) => `<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block">
      <rect width="340" height="200" fill="#B3E5FC" opacity=".4"/>
      <rect width="340" height="200" fill="#C8E6C9"/>
      <rect y="0" width="340" height="90" fill="#B3E5FC" opacity=".5"/>
      <circle cx="290" cy="36" r="28" fill="#FFD54F" opacity=".9"/>
      <ellipse cx="80" cy="20" rx="40" ry="16" fill="white" opacity=".8"/>
      <ellipse cx="200" cy="14" rx="34" ry="14" fill="white" opacity=".7"/>
      <rect y="140" width="340" height="60" fill="#A5D6A7" opacity=".6"/>
      <!-- Path -->
      <ellipse cx="170" cy="165" rx="60" ry="14" fill="#DCEDC8" opacity=".8"/>
      <!-- Big trees -->
      <circle cx="44" cy="82" r="38" fill="#66BB6A" opacity=".9"/>
      <circle cx="44" cy="66" r="28" fill="#43A047" opacity=".8"/>
      <rect x="38" y="118" width="14" height="32" fill="#5D4037" opacity=".8"/>
      <circle cx="296" cy="86" r="34" fill="#66BB6A" opacity=".9"/>
      <circle cx="296" cy="70" r="26" fill="#388E3C" opacity=".8"/>
      <rect x="290" y="118" width="14" height="32" fill="#5D4037" opacity=".8"/>
      <!-- Bench -->
      <rect x="148" y="128" width="60" height="8" rx="3" fill="#A1887F"/>
      <rect x="152" y="118" width="8" height="18" rx="2" fill="#8D6E63"/>
      <rect x="196" y="118" width="8" height="18" rx="2" fill="#8D6E63"/>
      <rect x="148" y="118" width="60" height="6" rx="2" fill="#A1887F"/>
      <!-- Flowers -->
      <text x="108" y="148" font-size="14">🌸</text><text x="128" y="142" font-size="12">🌷</text>
      <text x="220" y="148" font-size="14">🌼</text><text x="240" y="142" font-size="12">🌸</text>
      ${c.decor?.fountain?'<circle cx="170" cy="105" r="22" fill="#B2EBF2" stroke="#5BA4A4" stroke-width="2"/><circle cx="170" cy="105" r="12" fill="#5BA4A4" opacity=".4"/><text x="170" y="112" font-size="14" text-anchor="middle">⛲</text>':''}
      ${c.decor?.bbq?'<rect x="220" y="110" width="36" height="28" rx="4" fill="#3D2B23" opacity=".8"/><rect x="226" y="106" width="24" height="8" rx="2" fill="#1A1A1A"/><text x="238" y="132" font-size="10" text-anchor="middle">🔥</text>':''}
      ${c.decor?.hammock?'<line x1="80" y1="116" x2="160" y2="116" stroke="#8B6355" stroke-width="2.5" opacity=".7"/><path d="M82,116 Q120,132 158,116" fill="#E8A83A" opacity=".7" stroke="#BA7517" stroke-width="1"/>':''}
      ${c.decor?.bird_feeder?'<rect x="100" y="96" width="3" height="30" fill="#8B6355"/><rect x="90" y="90" width="22" height="14" rx="4" fill="#A1887F"/><text x="101" y="102" font-size="10" text-anchor="middle">🐦</text>':''}
      <text x="170" y="155" font-size="16" text-anchor="middle">${pet}</text>
    </svg>`
  },
  {
    id: 'bedroom', name: '🌙 Bedroom',
    activity: { icon:'🌙', text:'Before sleep tonight: share one thing you are grateful for about each other.' },
    decor: [
      {id:'candles',name:'Candles',icon:'🕯️',cost:25},
      {id:'starlight',name:'Star Lights',icon:'⭐',cost:40},
      {id:'bookshelf',name:'Bookshelf',icon:'📚',cost:35},
      {id:'telescope',name:'Telescope',icon:'🔭',cost:60},
    ],
    svg: (c,pet) => `<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block">
      <rect width="340" height="200" fill="${c.wall}" opacity=".85"/>
      <rect width="340" height="200" fill="#1A237E" opacity=".08"/>
      <rect y="155" width="340" height="45" fill="${c.floor}"/>
      <!-- Stars if starlight -->
      ${c.decor?.starlight?Array.from({length:20},()=>`<circle cx="${Math.floor(Math.random()*340)}" cy="${Math.floor(Math.random()*80)}" r="${Math.random()>0.7?2:1}" fill="#FFE082" opacity="${0.4+Math.random()*0.6}"/>`).join(''):''}
      <!-- Moon window -->
      <rect x="220" y="20" width="90" height="70" rx="6" fill="#1A237E" opacity=".15" stroke="#B8958A" stroke-width="1.5"/>
      <circle cx="280" cy="40" r="16" fill="#FFF9C4" opacity=".8"/>
      <circle cx="290" cy="34" r="12" fill="${c.wall}" opacity=".6"/>
      <!-- Bed -->
      <rect x="60" y="90" width="180" height="70" rx="8" fill="white" opacity=".9" stroke="#E0D0C8" stroke-width="1"/>
      <rect x="60" y="90" width="180" height="26" rx="8" fill="#B8958A" opacity=".4"/>
      <rect x="60" y="86" width="180" height="20" rx="6" fill="#8B6355" opacity=".5"/>
      <rect x="60" y="86" width="24" height="80" rx="6" fill="#8B6355" opacity=".5"/>
      <rect x="216" y="86" width="24" height="80" rx="6" fill="#8B6355" opacity=".5"/>
      <ellipse cx="100" cy="108" rx="22" ry="14" fill="white" stroke="#E0D0C8" stroke-width="1"/>
      <ellipse cx="150" cy="108" rx="22" ry="14" fill="white" stroke="#E0D0C8" stroke-width="1"/>
      <!-- Nightstands -->
      <rect x="24" y="118" width="32" height="36" rx="4" fill="#8B6355" opacity=".5"/>
      <rect x="284" y="118" width="32" height="36" rx="4" fill="#8B6355" opacity=".5"/>
      ${c.decor?.candles?'<circle cx="40" cy="114" r="4" fill="#FFB300" opacity=".9"/><rect x="38" y="106" width="4" height="12" rx="1" fill="#FFF9C4" opacity=".8"/><circle cx="300" cy="114" r="4" fill="#FFB300" opacity=".9"/><rect x="298" y="106" width="4" height="12" rx="1" fill="#FFF9C4" opacity=".8"/>':''}
      ${c.decor?.bookshelf?'<rect x="0" y="40" width="52" height="75" rx="3" fill="#8B6355" opacity=".55"/><rect x="0" y="40" width="52" height="8" rx="2" fill="#7A5C52"/>${[0,1,2].map(i=>`<rect x="${4+i*16}" y="${52}" width="${12}" height="${28+i*4}" rx="2" fill="${["#E8735A","#5BA4A4","#E8A83A"][i]}" opacity=".85"/>`).join("")}':''}
      ${c.decor?.telescope?'<rect x="300" y="95" width="5" height="55" fill="#5D4037" opacity=".7"/><rect x="285" y="88" width="32" height="14" rx="4" fill="#3D2B23" opacity=".8" transform="rotate(-20 301 95)"/>':''}
      <text x="160" y="158" font-size="16" text-anchor="middle">${pet}</text>
    </svg>`
  },
];

const ROOM_DECOR_DEFAULTS = {wall:'#FFF8F3', floor:'#F5EDE9', sofa:'#E8A83A', decor:{}};

function getRoomColors(){
  return SS?.room_colors || ROOM_DECOR_DEFAULTS;
}

function renderNestRooms(){
  try{
    const c = getRoomColors();
    const pet = document.getElementById('pet-art')?.textContent || '🐣';
    NEST_ROOMS.forEach(room => {
      const el = document.getElementById('room-' + room.id);
      if(el) el.innerHTML = room.svg(c, pet);
    });
    renderNestRoom(nestRoomIdx);
  } catch(e){ console.warn('renderNestRooms error:', e); }
}

function renderNestRoom(idx){
  nestRoomIdx = idx;
  const room = NEST_ROOMS[idx];
  const c = getRoomColors();
  const pet = document.getElementById('pet-art')?.textContent || '🐣';
  // Update SVG preview
  const svgEl = document.getElementById('nest-room-svg');
  if(svgEl) svgEl.innerHTML = room.svg(c, pet);
  // Update dots
  const dotsEl = document.getElementById('nest-room-dots');
  if(dotsEl) dotsEl.innerHTML = NEST_ROOMS.map((r,i)=>
    `<div style="width:${i===idx?18:7}px;height:7px;border-radius:4px;background:${i===idx?'var(--rose)':'var(--bd2)'};transition:all .3s"></div>`
  ).join('');
  // Update name
  const nameEl = document.getElementById('nest-room-name');
  if(nameEl) nameEl.textContent = room.name;
  // Update nav buttons
  const prev = document.querySelector('.nest-nav-btn:first-child');
  const next = document.querySelector('.nest-nav-btn:last-child');
  if(prev) prev.style.opacity = idx===0?'0.3':'1';
  if(next) next.style.opacity = idx===NEST_ROOMS.length-1?'0.3':'1';
  // Update activity
  const promptEl = document.getElementById('nest-room-prompt');
  if(promptEl){
    const seq = ACTIVITY_SEQUENCES[room.id];
    const seqState = seq ? getSeqState(seq.id) : null;
    const seqStep = seqState ? seqState.step : 0;
    const seqDone = seqState?.done;
    let seqBtnLabel = seq ? (seqDone ? '🔁 Redo sequence' : seqStep > 0 ? `▶ Continue (step ${seqStep+1}/${seq.steps.length})` : '▶ Start sequence') : '';
    let seqBtnColor = seqDone ? 'var(--text2)' : seqStep > 0 ? 'var(--teal)' : 'var(--rose)';
    promptEl.innerHTML = `
      <div style="font-size:28px;flex-shrink:0">${room.activity.icon}</div>
      <div style="flex:1">
        <div style="font-size:13px;line-height:1.6;color:var(--text2);font-style:italic;margin-bottom:${seq?'10px':'0'}">"${room.activity.text}"</div>
        ${seq ? `<button class="btn-save" style="background:${seqBtnColor};margin-top:0;padding:9px 16px;font-size:13px" onclick="openSequence('${room.id}')">${seqBtnLabel}</button>` : ''}
      </div>`;
  }
  // Update decor shop
  const shopEl = document.getElementById('nest-decor-shop');
  if(shopEl) shopEl.innerHTML = room.decor.map(d=>{
    const owned = c.decor?.[d.id];
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 10px;border-radius:12px;border:1.5px solid ${owned?'var(--sage)':'var(--bd2)'};background:${owned?'var(--sage-l)':'white'};cursor:pointer;min-width:64px" onclick="${owned?'':'buyDecor(\''+d.id+'\','+d.cost+')'}">
      <div style="font-size:24px">${d.icon}</div>
      <div style="font-size:10px;font-weight:700;color:${owned?'var(--sage)':'var(--text3)'}">${d.name}</div>
      <div style="font-size:10px;font-weight:700;color:${owned?'var(--sage)':'var(--amber)'}">${owned?'✓ Owned':'🪙 '+d.cost}</div>
    </div>`;
  }).join('');
}

function goNestRoom(idx){
  if(idx<0||idx>=NEST_ROOMS.length) return;
  nestRoomIdx = idx;
  renderNestRoom(idx);
}

async function buyDecor(itemId, cost){
  if((SS.coins||0)<cost){toast('Not enough coins 🪙');return;}
  const newColors = getRoomColors();
  if(!newColors.decor) newColors.decor = {};
  newColors.decor[itemId] = true;
  await updateSS({coins:SS.coins-cost, room_colors:newColors});
  toast('Item added to your nest! ✨');updateBar();renderNestRooms();
}

function showCustomize(){
  // Pre-select current colors
  const c = getRoomColors();
  document.querySelectorAll('#wall-colors .color-chip').forEach(el=>{el.classList.toggle('on',el.dataset.color===c.wall);});
  document.querySelectorAll('#floor-colors .color-chip').forEach(el=>{el.classList.toggle('on',el.dataset.color===c.floor);});
  document.querySelectorAll('#sofa-colors .color-chip').forEach(el=>{el.classList.toggle('on',el.dataset.color===c.sofa);});
  document.getElementById('modal-customize').classList.remove('hidden');
}

let customizePicks = {};
function pickColor(btn, type){
  btn.closest('.color-row').querySelectorAll('.color-chip').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  customizePicks[type] = btn.dataset.color;
}

async function saveCustomize(){
  const c = getRoomColors();
  const newColors = {...c, ...customizePicks};
  await updateSS({room_colors: newColors});
  customizePicks = {};
  document.getElementById('modal-customize').classList.add('hidden');
  renderNestRooms();
  toast('Nest updated! 🏠');
}

// Swipe support for room navigation
(function(){
  let sx=0,sy=0;
  document.addEventListener('touchstart',e=>{const t=e.target.closest('#nest-rooms-container');if(!t)return;sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});
  document.addEventListener('touchend',e=>{const t=e.target.closest('#nest-rooms-container');if(!t)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){if(dx<0)goNestRoom(Math.min(nestRoomIdx+1,NEST_ROOMS.length-1));else goNestRoom(Math.max(nestRoomIdx-1,0));}},{passive:true});
})();
