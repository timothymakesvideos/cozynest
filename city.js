// ── CITY MAP ──────────────────────────────────────────────
const MAP_W=800,MAP_H=700;
let camX=0,camY=0,camZ=1,isDrag=false,pinchDist=0;

const HOTSPOTS=[
  {id:'nest',   x:60,  y:60,  w:160,h:140},
  {id:'cafe',   x:300, y:60,  w:160,h:140},
  {id:'park',   x:540, y:60,  w:200,h:140},
  {id:'cinema', x:60,  y:280, w:160,h:150},
  {id:'library',x:300, y:280, w:160,h:150},
  {id:'bakery', x:540, y:280, w:200,h:150},
  {id:'rooftop',x:160, y:500, w:180,h:150},
  {id:'secret', x:440, y:500, w:180,h:150},
];

function buildCityMap(){
  const vp=document.getElementById('city-viewport');
  const vpW=vp.clientWidth||360,vpH=vp.clientHeight||400;
  camZ=Math.min(vpW/MAP_W,vpH/MAP_H)*0.92;
  camX=(vpW-MAP_W*camZ)/2; camY=(vpH-MAP_H*camZ)/2;
  document.getElementById('city-canvas').innerHTML=makeCitySVG();
  applyCam(); setupCityEvents();
}

function makeCitySVG(){
  const bldgs=HOTSPOTS.map(hs=>makeBldg(hs,BLDGS.find(b=>b.id===hs.id),((SS&&SS.city)||{nest:true})[hs.id]||hs.id==='nest')).join('');
  return`<svg width="${MAP_W}" height="${MAP_H}" viewBox="0 0 ${MAP_W} ${MAP_H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${MAP_W}" height="${MAP_H}" fill="#C8E8B0"/>
  <ellipse cx="400" cy="460" rx="280" ry="60" fill="#B5D99C" opacity=".4"/>
  <!-- Roads -->
  <rect x="0" y="228" width="${MAP_W}" height="34" fill="#C4B5A5" opacity=".8"/>
  <rect x="0" y="458" width="${MAP_W}" height="34" fill="#C4B5A5" opacity=".8"/>
  <rect x="228" y="0" width="34" height="${MAP_H}" fill="#C4B5A5" opacity=".8"/>
  <rect x="498" y="0" width="34" height="${MAP_H}" fill="#C4B5A5" opacity=".8"/>
  <!-- Road dashes -->
  ${rh(0,245,800)} ${rh(0,475,800)} ${rv(245,0,700)} ${rv(515,0,700)}
  <!-- Sidewalk edges -->
  <rect x="0" y="222" width="${MAP_W}" height="6" fill="#D9CCC5" opacity=".6"/>
  <rect x="0" y="262" width="${MAP_W}" height="6" fill="#D9CCC5" opacity=".6"/>
  <rect x="0" y="452" width="${MAP_W}" height="6" fill="#D9CCC5" opacity=".6"/>
  <rect x="0" y="492" width="${MAP_W}" height="6" fill="#D9CCC5" opacity=".6"/>
  <rect x="222" y="0" width="6" height="${MAP_H}" fill="#D9CCC5" opacity=".6"/>
  <rect x="262" y="0" width="6" height="${MAP_H}" fill="#D9CCC5" opacity=".6"/>
  <rect x="492" y="0" width="6" height="${MAP_H}" fill="#D9CCC5" opacity=".6"/>
  <rect x="532" y="0" width="6" height="${MAP_H}" fill="#D9CCC5" opacity=".6"/>
  <!-- Fountain plaza -->
  <circle cx="380" cy="345" r="60" fill="#D4EDD4" stroke="#7BA68A" stroke-width="2"/>
  <circle cx="380" cy="345" r="38" fill="#B2EBF2" stroke="#5BA4A4" stroke-width="1.5"/>
  <circle cx="380" cy="345" r="20" fill="#5BA4A4" opacity=".4"/>
  <text x="380" y="353" font-size="22" text-anchor="middle">⛲</text>
  <!-- Trees -->
  ${[{x:210,y:170},{x:480,y:170},{x:210,y:410},{x:480,y:410},{x:110,y:480},{x:660,y:110},{x:660,y:410},{x:130,y:610},{x:630,y:610},{x:380,y:120},{x:380,y:580}].map(t=>`<g><circle cx="${t.x}" cy="${t.y}" r="16" fill="#7BA68A" opacity=".85"/><rect x="${t.x-4}" y="${t.y+10}" width="8" height="16" fill="#8B6355" opacity=".7"/></g>`).join('')}
  ${bldgs}
</svg>`;
}

function rh(x,y,maxX){let s='';for(let i=x;i<maxX;i+=44)s+=`<rect x="${i}" y="${y-1}" width="24" height="3" fill="white" opacity=".45" rx="1"/>`;return s;}
function rv(x,y,maxY){let s='';for(let i=y;i<maxY;i+=44)s+=`<rect x="${x-1}" y="${i}" width="3" height="24" fill="white" opacity=".45" rx="1"/>`;return s;}

function makeBldg(hs,b,owned){
  const {id,x,y,w,h}=hs,cx=x+w/2,op=owned?'1':'0.45';
  const locked=owned?'':
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="rgba(30,10,0,.38)"/>
     <text x="${cx}" y="${y+h/2-8}" font-size="24" text-anchor="middle">🔒</text>
     <text x="${cx}" y="${y+h/2+14}" font-size="11" font-weight="bold" fill="white" text-anchor="middle">${b.cost} 🪙</text>`;
  return`<g id="bld-${id}" style="cursor:pointer">
    ${bldgFacade(id,x,y,w,h,owned,op)}
    ${locked}
    <rect x="${x}" y="${y+h-28}" width="${w}" height="28" rx="10" fill="rgba(255,248,243,.9)"/>
    <text x="${cx}" y="${y+h-12}" font-size="11" font-weight="700" fill="${owned?'#3D2B23':'#B8958A'}" text-anchor="middle">${b.name}</text>
  </g>`;
}

function bldgFacade(id,x,y,w,h,owned,op){
  const cx=x+w/2;
  const f={
    nest:`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#FFF0E6" stroke="#E8735A" stroke-width="2" opacity="${op}"/>
      <polygon points="${cx-28},${y+20} ${cx+28},${y+20} ${cx+28},${y} ${cx-28},${y}" fill="#E8735A" opacity="${owned?.65:.25}"/>
      <rect x="${x+14}" y="${y+22}" width="${w-28}" height="${h-52}" rx="5" fill="#FDEEE9" opacity="${op}"/>
      <rect x="${x+18}" y="${y+36}" width="28" height="20" rx="3" fill="#EBF5F5" stroke="#B8958A" stroke-width="1" opacity="${op}"/>
      <rect x="${x+w-46}" y="${y+36}" width="22" height="20" rx="3" fill="#EBF5F5" stroke="#B8958A" stroke-width="1" opacity="${op}"/>
      <rect x="${cx-14}" y="${y+58}" width="28" height="${h-88}" rx="4" fill="#8B6355" opacity="${owned?.8:.3}"/>
      <circle cx="${cx+8}" cy="${y+72}" r="3" fill="#E8A83A" opacity="${op}"/>`,
    cafe:`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#FFF8E1" stroke="#E8A83A" stroke-width="1.5" opacity="${op}"/>
      <rect x="${x}" y="${y+18}" width="${w}" height="18" rx="4" fill="#E8A83A" opacity="${owned?.8:.3}"/>
      <text x="${cx}" y="${y+31}" font-size="10" text-anchor="middle" fill="white" font-weight="700" opacity="${op}">CAFÉ</text>
      <rect x="${x+14}" y="${y+38}" width="${w-28}" height="${h-68}" rx="5" fill="#FEF5E4" opacity="${op}"/>
      <rect x="${x+18}" y="${y+52}" width="28" height="20" rx="3" fill="#EBF5F5" stroke="#B8958A" stroke-width="1" opacity="${op}"/>
      <rect x="${x+w-46}" y="${y+52}" width="28" height="20" rx="3" fill="#EBF5F5" stroke="#B8958A" stroke-width="1" opacity="${op}"/>
      <rect x="${cx-12}" y="${y+70}" width="24" height="${h-100}" rx="3" fill="#8B6355" opacity="${owned?.7:.3}"/>`,
    park:`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#E8F5E9" stroke="#7BA68A" stroke-width="1.5" opacity="${op}"/>
      <circle cx="${x+40}" cy="${y+65}" r="30" fill="#66BB6A" opacity="${owned?.85:.35}"/>
      <rect x="${x+36}" y="${y+90}" width="10" height="28" fill="#5D4037" opacity="${op}"/>
      <circle cx="${x+w-50}" cy="${y+60}" r="24" fill="#43A047" opacity="${owned?.75:.3}"/>
      <rect x="${x+w-54}" y="${y+80}" width="10" height="24" fill="#5D4037" opacity="${op}"/>
      <circle cx="${cx}" cy="${y+75}" r="20" fill="#81C784" opacity="${owned?.7:.3}"/>
      <rect x="${cx-5}" y="${y+92}" width="10" height="20" fill="#5D4037" opacity="${op}"/>`,
    cinema:`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#F3E5F5" stroke="#9C77B0" stroke-width="1.5" opacity="${op}"/>
      <rect x="${x}" y="${y+16}" width="${w}" height="26" rx="4" fill="#3D2B23" opacity="${owned?.9:.4}"/>
      <text x="${cx}" y="${y+33}" font-size="9" fill="white" text-anchor="middle" opacity="${op}">★ STAR THEATRE ★</text>
      <rect x="${x+16}" y="${y+44}" width="9" height="62" fill="#B8958A" opacity="${owned?.6:.3}"/>
      <rect x="${x+30}" y="${y+44}" width="9" height="62" fill="#B8958A" opacity="${owned?.6:.3}"/>
      <rect x="${x+w-40}" y="${y+44}" width="9" height="62" fill="#B8958A" opacity="${owned?.6:.3}"/>
      <rect x="${x+w-25}" y="${y+44}" width="9" height="62" fill="#B8958A" opacity="${owned?.6:.3}"/>
      <rect x="${x+44}" y="${y+60}" width="${w-88}" height="46" rx="4" fill="#3D2B23" opacity="${owned?.65:.3}"/>
      <circle cx="${x+20}" cy="${y+16}" r="5" fill="#E8A83A" opacity="${op}"/>
      <circle cx="${cx}" cy="${y+14}" r="5" fill="#E8A83A" opacity="${op}"/>
      <circle cx="${x+w-20}" cy="${y+16}" r="5" fill="#E8A83A" opacity="${op}"/>`,
    library:`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#FFF8F3" stroke="#8B6355" stroke-width="1.5" opacity="${op}"/>
      <rect x="${x+14}" y="${y+14}" width="${w-28}" height="${h-44}" rx="4" fill="#F5EDE9" opacity="${op}"/>
      <text x="${cx}" y="${y+28}" font-size="9" text-anchor="middle" font-weight="700" fill="#3D2B23" opacity="${op}">📚 LIBRARY</text>
      ${[0,1,2,3,4,5].map(i=>`<rect x="${x+20+i*18}" y="${y+36}" width="12" height="${28+i%3*6}" rx="2" fill="${['#E8735A','#5BA4A4','#E8A83A','#7BA68A','#9C77B0','#E8735A'][i]}" opacity="${op}"/>`).join('')}
      ${[0,1,2,3].map(i=>`<rect x="${x+20+i*18}" y="${y+78}" width="12" height="${22+i%2*8}" rx="2" fill="${['#5BA4A4','#E8A83A','#7BA68A','#E8735A'][i]}" opacity="${op}"/>`).join('')}
      <rect x="${cx-12}" y="${y+90}" width="24" height="${h-120}" rx="3" fill="#8B6355" opacity="${owned?.7:.3}"/>`,
    bakery:`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#FFF0E6" stroke="#E8735A" stroke-width="1.5" opacity="${op}"/>
      <rect x="${x}" y="${y+16}" width="${w}" height="18" rx="4" fill="#E8735A" opacity="${owned?.7:.3}"/>
      <text x="${cx}" y="${y+29}" font-size="10" text-anchor="middle" fill="white" font-weight="700" opacity="${op}">BAKERY</text>
      <circle cx="${cx-20}" cy="${y+68}" r="20" fill="#E8A83A" opacity="${owned?.7:.3}"/>
      <circle cx="${cx+10}" cy="${y+62}" r="16" fill="#E8735A" opacity="${owned?.6:.3}"/>
      <circle cx="${cx-6}" cy="${y+82}" r="16" fill="#E8A83A" opacity="${owned?.65:.3}"/>
      <rect x="${cx-12}" y="${y+92}" width="24" height="${h-122}" rx="3" fill="#8B6355" opacity="${owned?.7:.3}"/>`,
    rooftop:`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#1A237E" opacity="${owned?.9:.4}"/>
      <circle cx="${cx}" cy="${y+48}" r="22" fill="#FF8F00" opacity="${owned?.85:.3}"/>
      <path d="M${cx-28},${y+62} Q${cx},${y+22} ${cx+28},${y+62}" fill="none" stroke="#FF8F00" stroke-width="3" opacity="${op}"/>
      <rect x="${x+18}" y="${y+88}" width="16" height="26" rx="2" fill="#1565C0" opacity="${op}"/>
      <rect x="${x+42}" y="${y+80}" width="16" height="34" rx="2" fill="#1565C0" opacity="${op}"/>
      <rect x="${x+w-58}" y="${y+84}" width="16" height="30" rx="2" fill="#1565C0" opacity="${op}"/>
      <rect x="${x+w-34}" y="${y+88}" width="16" height="26" rx="2" fill="#1565C0" opacity="${op}"/>`,
    secret:`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#1A0030" opacity="${owned?.9:.5}"/>
      <circle cx="${cx}" cy="${y+h/2-18}" r="36" fill="#4A0080" opacity="${owned?.5:.2}"/>
      <text x="${cx}" y="${y+h/2-6}" font-size="28" text-anchor="middle" opacity="${op}">🔮</text>
      ${owned?`<text x="${cx}" y="${y+h/2+18}" font-size="10" text-anchor="middle" fill="#E040FB" font-weight="700">SECRET SPOT</text>`:''}`
  };
  return f[id]||`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#eee" opacity="${op}"/>`;
}

function applyCam(){document.getElementById('city-canvas').style.transform=`translate(${camX}px,${camY}px) scale(${camZ})`;}
function clampCam(){
  const vp=document.getElementById('city-viewport');
  const vpW=vp.clientWidth,vpH=vp.clientHeight;
  camX=Math.min(80,Math.max(vpW-MAP_W*camZ-80,camX));
  camY=Math.min(80,Math.max(vpH-MAP_H*camZ-80,camY));
}
function zoomCity(f){
  const vp=document.getElementById('city-viewport');
  const cx=vp.clientWidth/2,cy=vp.clientHeight/2;
  const nz=Math.min(2,Math.max(0.3,camZ*f));
  camX=cx-(cx-camX)*(nz/camZ); camY=cy-(cy-camY)*(nz/camZ); camZ=nz;
  clampCam(); applyCam();
}

function setupCityEvents(){
  const vp=document.getElementById('city-viewport');
  let t0=null,startPinch=0;
  vp.addEventListener('touchstart',e=>{
    document.getElementById('city-hint').style.opacity='0';
    isDrag=false;
    if(e.touches.length===1){t0={x:e.touches[0].clientX,y:e.touches[0].clientY,cx:camX,cy:camY};}
    else if(e.touches.length===2){
      const dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY;
      startPinch=Math.sqrt(dx*dx+dy*dy);
      t0={x:(e.touches[0].clientX+e.touches[1].clientX)/2,y:(e.touches[0].clientY+e.touches[1].clientY)/2,cx:camX,cy:camY,z:camZ};
    }
    e.preventDefault();
  },{passive:false});
  vp.addEventListener('touchmove',e=>{
    if(e.touches.length===1&&t0){
      const dx=e.touches[0].clientX-t0.x,dy=e.touches[0].clientY-t0.y;
      if(Math.abs(dx)>4||Math.abs(dy)>4)isDrag=true;
      camX=t0.cx+dx; camY=t0.cy+dy; clampCam(); applyCam();
    } else if(e.touches.length===2&&t0){
      const dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY;
      const nd=Math.sqrt(dx*dx+dy*dy),nz=Math.min(2,Math.max(0.3,t0.z*(nd/startPinch)));
      camX=t0.x-(t0.x-t0.cx)*(nz/t0.z); camY=t0.y-(t0.y-t0.cy)*(nz/t0.z); camZ=nz;
      clampCam(); applyCam(); isDrag=true;
    }
    e.preventDefault();
  },{passive:false});
  vp.addEventListener('touchend',e=>{
    if(!isDrag&&t0&&e.changedTouches.length===1){
      // It was a tap — find which building was hit
      const touch=e.changedTouches[0];
      const vr=vp.getBoundingClientRect();
      // Convert screen coords to SVG canvas coords
      const svgX=(touch.clientX-vr.left-camX)/camZ;
      const svgY=(touch.clientY-vr.top-camY)/camZ;
      const hit=HOTSPOTS.find(h=>svgX>=h.x&&svgX<=h.x+h.w&&svgY>=h.y&&svgY<=h.y+h.h);
      if(hit) openLoc(hit.id);
    }
    isDrag=false;
    t0=null;
  },{passive:true});

  let lx=0,ly=0,mouseDown=false;
  vp.addEventListener('mousedown',e=>{mouseDown=true;isDrag=false;lx=e.clientX;ly=e.clientY;vp.classList.add('grabbing');});
  document.addEventListener('mousemove',e=>{
    if(!mouseDown)return;
    const dx=e.clientX-lx,dy=e.clientY-ly;
    if(Math.abs(dx)>3||Math.abs(dy)>3)isDrag=true;
    camX+=dx;camY+=dy;lx=e.clientX;ly=e.clientY;clampCam();applyCam();
  });
  document.addEventListener('mouseup',e=>{
    if(!isDrag&&mouseDown){
      const vr=vp.getBoundingClientRect();
      const svgX=(e.clientX-vr.left-camX)/camZ;
      const svgY=(e.clientY-vr.top-camY)/camZ;
      const hit=HOTSPOTS.find(h=>svgX>=h.x&&svgX<=h.x+h.w&&svgY>=h.y&&svgY<=h.y+h.h);
      if(hit) openLoc(hit.id);
    }
    mouseDown=false;vp.classList.remove('grabbing');isDrag=false;
  });
  vp.addEventListener('wheel',e=>{
    const r=vp.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;
    const nz=Math.min(2,Math.max(0.3,camZ*(e.deltaY>0?.9:1.1)));
    camX=mx-(mx-camX)*(nz/camZ);camY=my-(my-camY)*(nz/camZ);camZ=nz;clampCam();applyCam();e.preventDefault();
  },{passive:false});
}

function tapBldg(id){
  // isDrag check handled by touch events directly — just open
  openLoc(id);
}

// ── LOCATION ROOMS ────────────────────────────────────────
const ROOMS={
  nest:`<svg viewBox="0 0 380 190" xmlns="http://www.w3.org/2000/svg" style="width:100%">
    <rect width="380" height="190" fill="#FFF8F3"/>
    <rect y="148" width="380" height="42" fill="#F5EDE9"/>
    <rect x="75" y="100" width="145" height="55" rx="13" fill="#E8A83A" opacity=".85"/>
    <rect x="75" y="90" width="145" height="24" rx="10" fill="#BA7517" opacity=".7"/>
    <rect x="75" y="96" width="20" height="59" rx="7" fill="#BA7517" opacity=".65"/>
    <rect x="200" y="96" width="20" height="59" rx="7" fill="#BA7517" opacity=".65"/>
    <ellipse cx="130" cy="103" rx="20" ry="10" fill="#FDEEE9" opacity=".9"/>
    <ellipse cx="178" cy="103" rx="20" ry="10" fill="#EBF5F5" opacity=".9"/>
    <rect x="258" y="24" width="88" height="74" rx="6" fill="#EBF5F5" stroke="#B8958A" stroke-width="1.5"/>
    <line x1="302" y1="24" x2="302" y2="98" stroke="#B8958A" stroke-width="1.5"/>
    <line x1="258" y1="61" x2="346" y2="61" stroke="#B8958A" stroke-width="1.5"/>
    <circle cx="278" cy="45" r="13" fill="#EF9F27" opacity=".5"/>
    <rect x="24" y="38" width="68" height="86" rx="4" fill="#8B6355" opacity=".65"/>
    <rect x="24" y="38" width="68" height="8" fill="#7A5C52"/>
    <rect x="30" y="50" width="9" height="32" rx="2" fill="#E8735A" opacity=".9"/>
    <rect x="41" y="50" width="9" height="28" rx="2" fill="#5BA4A4" opacity=".9"/>
    <rect x="52" y="50" width="9" height="30" rx="2" fill="#E8A83A" opacity=".9"/>
    <rect x="63" y="50" width="9" height="24" rx="2" fill="#7BA68A" opacity=".9"/>
    <rect x="30" y="88" width="9" height="28" rx="2" fill="#5BA4A4" opacity=".9"/>
    <rect x="41" y="88" width="9" height="22" rx="2" fill="#E8735A" opacity=".9"/>
    <rect x="322" y="126" width="14" height="22" rx="3" fill="#8B6355" opacity=".65"/>
    <circle cx="329" cy="118" r="16" fill="#7BA68A" opacity=".8"/>
    <rect x="248" y="114" width="5" height="32" fill="#B8958A"/>
    <polygon points="240,114 266,114 258,96 248,96" fill="#EF9F27" opacity=".8"/>
    <ellipse cx="148" cy="148" rx="100" ry="10" fill="#FDEEE9" opacity=".5"/>
  </svg>`,
  cafe:`<svg viewBox="0 0 380 190" xmlns="http://www.w3.org/2000/svg" style="width:100%">
    <rect width="380" height="190" fill="#FFF8E1"/>
    <rect y="148" width="380" height="42" fill="#F5EDE9"/>
    <rect x="52" y="100" width="276" height="52" rx="8" fill="#8B6355" opacity=".75"/>
    <rect x="52" y="90" width="276" height="18" rx="4" fill="#6D4C41" opacity=".9"/>
    <rect x="72" y="50" width="52" height="46" rx="6" fill="#3D2B23" opacity=".8"/>
    <circle cx="98" cy="68" r="13" fill="#5D4037" stroke="#E8A83A" stroke-width="2"/>
    <rect x="82" y="88" width="32" height="8" rx="2" fill="#E8A83A" opacity=".7"/>
    <rect x="142" y="82" width="20" height="26" rx="4" fill="#E8A83A" opacity=".8"/>
    <rect x="168" y="86" width="20" height="22" rx="4" fill="#E8735A" opacity=".8"/>
    <rect x="194" y="80" width="20" height="28" rx="4" fill="#FFF8F3"/>
    <rect x="268" y="22" width="96" height="66" rx="6" fill="#263238"/>
    <text x="316" y="45" font-size="9" fill="white" text-anchor="middle" opacity=".9">MENU</text>
    <line x1="278" y1="52" x2="354" y2="52" stroke="white" stroke-width="1" opacity=".4"/>
    <text x="316" y="63" font-size="8" fill="white" text-anchor="middle" opacity=".7">Latte ☕</text>
    <text x="316" y="75" font-size="8" fill="white" text-anchor="middle" opacity=".7">Cocoa 🍫</text>
    <rect x="24" y="118" width="76" height="8" rx="4" fill="#8B6355" opacity=".7"/>
    <rect x="30" y="108" width="14" height="18" rx="3" fill="#A1887F" opacity=".7"/>
    <rect x="78" y="108" width="14" height="18" rx="3" fill="#A1887F" opacity=".7"/>
    <line x1="134" y1="0" x2="134" y2="38" stroke="#B8958A" stroke-width="2"/>
    <ellipse cx="134" cy="40" rx="16" ry="8" fill="#E8A83A" opacity=".8"/>
    <line x1="238" y1="0" x2="238" y2="32" stroke="#B8958A" stroke-width="2"/>
    <ellipse cx="238" cy="34" rx="16" ry="8" fill="#E8A83A" opacity=".7"/>
    <circle cx="318" cy="84" r="12" fill="#7BA68A" opacity=".8"/>
    <rect x="314" y="94" width="8" height="12" rx="2" fill="#8B6355" opacity=".7"/>
  </svg>`,
  park:`<svg viewBox="0 0 380 190" xmlns="http://www.w3.org/2000/svg" style="width:100%">
    <rect width="380" height="190" fill="#C8E6C9"/>
    <rect width="380" height="72" fill="#B3E5FC" opacity=".5"/>
    <circle cx="320" cy="34" r="24" fill="#FFD54F"/>
    <ellipse cx="72" cy="26" rx="36" ry="14" fill="white" opacity=".8"/>
    <ellipse cx="100" cy="20" rx="26" ry="12" fill="white" opacity=".8"/>
    <ellipse cx="196" cy="16" rx="30" ry="12" fill="white" opacity=".7"/>
    <rect y="148" width="380" height="42" fill="#A5D6A7" opacity=".7"/>
    <ellipse cx="190" cy="162" rx="130" ry="18" fill="#DCEDC8" opacity=".6"/>
    <circle cx="44" cy="88" r="34" fill="#66BB6A" opacity=".9"/>
    <circle cx="44" cy="73" r="26" fill="#43A047" opacity=".8"/>
    <rect x="38" y="120" width="14" height="28" fill="#5D4037" opacity=".8"/>
    <circle cx="316" cy="82" r="30" fill="#66BB6A" opacity=".9"/>
    <circle cx="316" cy="68" r="24" fill="#388E3C" opacity=".8"/>
    <rect x="310" y="110" width="14" height="26" fill="#5D4037" opacity=".8"/>
    <circle cx="148" cy="100" r="22" fill="#81C784" opacity=".85"/>
    <rect x="142" y="120" width="10" height="20" fill="#5D4037" opacity=".7"/>
    <circle cx="244" cy="104" r="18" fill="#A5D6A7" opacity=".85"/>
    <rect x="238" y="120" width="10" height="18" fill="#5D4037" opacity=".7"/>
    <rect x="164" y="130" width="60" height="7" rx="3" fill="#A1887F"/>
    <rect x="170" y="120" width="8" height="16" rx="2" fill="#8D6E63"/>
    <rect x="212" y="120" width="8" height="16" rx="2" fill="#8D6E63"/>
    <rect x="164" y="120" width="60" height="6" rx="2" fill="#A1887F"/>
    <circle cx="100" cy="152" r="5" fill="#E8735A" opacity=".9"/>
    <circle cx="280" cy="155" r="5" fill="#E8A83A" opacity=".9"/>
  </svg>`,
  cinema:`<svg viewBox="0 0 380 190" xmlns="http://www.w3.org/2000/svg" style="width:100%">
    <rect width="380" height="190" fill="#1A0030"/>
    <rect x="34" y="14" width="312" height="106" rx="6" fill="#0D47A1" opacity=".8"/>
    <circle cx="190" cy="57" r="18" fill="#FFE082" opacity=".7"/>
    <text x="190" y="64" font-size="16" text-anchor="middle">🌙</text>
    <text x="190" y="108" font-size="10" fill="#90CAF9" text-anchor="middle" opacity=".8">♥ Now Playing ♥</text>
    <rect x="24" y="132" width="332" height="14" rx="3" fill="#4A148C" opacity=".7"/>
    <rect x="14" y="150" width="352" height="14" rx="3" fill="#4A148C" opacity=".7"/>
    <rect x="4" y="168" width="372" height="14" rx="3" fill="#311B92" opacity=".7"/>
    <rect x="72" y="133" width="14" height="12" rx="2" fill="#7B1FA2" opacity=".8"/>
    <rect x="92" y="133" width="14" height="12" rx="2" fill="#7B1FA2" opacity=".8"/>
    <rect x="176" y="133" width="14" height="12" rx="2" fill="#E8735A" opacity=".9"/>
    <rect x="196" y="133" width="14" height="12" rx="2" fill="#E8735A" opacity=".9"/>
    <rect x="280" y="133" width="14" height="12" rx="2" fill="#7B1FA2" opacity=".8"/>
    <rect x="178" y="118" width="18" height="17" rx="2" fill="#E8A83A" opacity=".8"/>
    <ellipse cx="187" cy="118" rx="12" ry="4" fill="#FFF8E1" opacity=".9"/>
    ${[60,132,200,280,340].map(sx=>`<circle cx="${sx}" cy="9" r="2" fill="white" opacity="${.6+Math.random()*.3}"/>`).join('')}
  </svg>`,
  library:`<svg viewBox="0 0 380 190" xmlns="http://www.w3.org/2000/svg" style="width:100%">
    <rect width="380" height="190" fill="#FFF8F3"/>
    <rect y="148" width="380" height="42" fill="#F5EDE9"/>
    <rect x="8" y="8" width="364" height="130" rx="4" fill="#8B6355" opacity=".4"/>
    <rect x="8" y="52" width="364" height="5" fill="#7A5C52" opacity=".6"/>
    <rect x="8" y="96" width="364" height="5" fill="#7A5C52" opacity=".6"/>
    ${Array.from({length:18},(_,i)=>`<rect x="${16+i*20}" y="${12}" width="${14}" height="${28+i%4*6}" rx="2" fill="${['#E8735A','#5BA4A4','#E8A83A','#7BA68A','#9C77B0','#E8735A'][i%6]}" opacity=".9"/>`).join('')}
    ${Array.from({length:16},(_,i)=>`<rect x="${16+i*22}" y="${58}" width="${16}" height="${24+i%3*6}" rx="2" fill="${['#5BA4A4','#E8A83A','#E8735A','#7BA68A'][i%4]}" opacity=".85"/>`).join('')}
    <rect x="76" y="124" width="228" height="10" rx="4" fill="#8B6355" opacity=".75"/>
    <rect x="88" y="132" width="14" height="18" rx="2" fill="#7A5C52" opacity=".7"/>
    <rect x="278" y="132" width="14" height="18" rx="2" fill="#7A5C52" opacity=".7"/>
    <rect x="154" y="112" width="68" height="16" rx="2" fill="#FFF8F3"/>
    <line x1="188" y1="112" x2="188" y2="128" stroke="#B8958A" stroke-width="1"/>
    <rect x="292" y="102" width="5" height="26" fill="#B8958A"/>
    <polygon points="284,102 310,102 304,88 290,88" fill="#E8A83A" opacity=".8"/>
  </svg>`,
  bakery:`<svg viewBox="0 0 380 190" xmlns="http://www.w3.org/2000/svg" style="width:100%">
    <rect width="380" height="190" fill="#FFF0E6"/>
    <rect y="148" width="380" height="42" fill="#F5EDE9"/>
    <rect width="380" height="104" fill="#FFF8F3"/>
    ${Array.from({length:10},(_,i)=>Array.from({length:7},(_,j)=>`<rect x="${i*40}" y="${j*16}" width="38" height="14" rx="1" fill="white" stroke="#FDEEE9" stroke-width="1" opacity=".5"/>`).join('')).join('')}
    <rect x="24" y="88" width="332" height="62" rx="8" fill="#F5EDE9" stroke="#B8958A" stroke-width="1.5"/>
    <rect x="24" y="88" width="332" height="20" rx="8" fill="#E8A83A" opacity=".6"/>
    <circle cx="74" cy="130" r="18" fill="#E8A83A" opacity=".9"/>
    <circle cx="74" cy="122" r="14" fill="#FFCC02" opacity=".8"/>
    <circle cx="118" cy="132" r="15" fill="#E8735A" opacity=".8"/>
    <ellipse cx="118" cy="128" rx="14" ry="9" fill="#FDEEE9" opacity=".9"/>
    <circle cx="160" cy="128" r="18" fill="#8B6355" opacity=".7"/>
    <path d="M198,124 Q208,108 218,124 Q208,116 198,124" fill="#E8A83A" opacity=".9"/>
    <path d="M226,124 Q236,108 246,124 Q236,116 226,124" fill="#E8A83A" opacity=".9"/>
    <rect x="284" y="46" width="74" height="52" rx="6" fill="#5D4037" opacity=".8"/>
    <rect x="290" y="52" width="62" height="38" rx="4" fill="#3E2723" opacity=".9"/>
    <circle cx="310" cy="100" r="5" fill="#E8A83A" opacity=".8"/>
    <circle cx="338" cy="100" r="5" fill="#E8A83A" opacity=".7"/>
    <rect x="36" y="0" width="2" height="48" fill="#B8958A" opacity=".5"/>
    <text x="24" y="52" font-size="14">🥄</text>
    <rect x="62" y="0" width="2" height="44" fill="#B8958A" opacity=".5"/>
    <text x="50" y="48" font-size="14">🍴</text>
  </svg>`,
  rooftop:`<svg viewBox="0 0 380 190" xmlns="http://www.w3.org/2000/svg" style="width:100%">
    <rect width="380" height="190" fill="#0D1B2A"/>
    <rect width="380" height="96" fill="#1A237E" opacity=".6"/>
    ${Array.from({length:28},()=>{const sx=Math.floor(Math.random()*380),sy=Math.floor(Math.random()*86);return`<circle cx="${sx}" cy="${sy}" r="${Math.random()>.7?2:1}" fill="white" opacity="${.5+Math.random()*.5}"/>`;}).join('')}
    <circle cx="316" cy="36" r="20" fill="#FFF9C4" opacity=".9"/>
    <circle cx="326" cy="28" r="16" fill="#0D1B2A" opacity=".6"/>
    ${[0,38,74,110,148,184,222,258,296,334].map(bx=>`<rect x="${bx}" y="${90+Math.floor(Math.random()*30)}" width="${30}" height="${100}" fill="#0A0E1A"/>`).join('')}
    ${[60,80,110,130,280,300].map(wx=>`<rect x="${wx}" y="${110+Math.floor(Math.random()*20)}" width="6" height="5" fill="#FFE082" opacity=".6"/>`).join('')}
    <rect y="148" width="380" height="42" fill="#1C2833"/>
    <rect y="148" width="380" height="8" fill="#2C3E50"/>
    <path d="M20,152 Q100,142 190,146 Q280,142 360,152" fill="none" stroke="#FFE082" stroke-width="1.5" opacity=".6"/>
    ${[40,80,130,190,250,310,350].map(lx=>`<circle cx="${lx}" cy="${148+Math.floor((lx-190)*(lx-190)/8000*4)}" r="3" fill="#FFE082" opacity=".9"/>`).join('')}
    <rect x="134" y="156" width="20" height="16" rx="3" fill="#2C3E50"/>
    <rect x="130" y="152" width="24" height="8" rx="2" fill="#34495E"/>
    <rect x="226" y="156" width="20" height="16" rx="3" fill="#2C3E50"/>
    <rect x="222" y="152" width="24" height="8" rx="2" fill="#34495E"/>
    <rect x="172" y="158" width="32" height="4" rx="2" fill="#34495E"/>
    <rect x="188" y="150" width="6" height="10" rx="1" fill="#FFF9C4" opacity=".9"/>
    <circle cx="191" cy="148" r="3" fill="#FFB300" opacity=".9"/>
  </svg>`,
  secret:`<svg viewBox="0 0 380 190" xmlns="http://www.w3.org/2000/svg" style="width:100%">
    <rect width="380" height="190" fill="#1A0030"/>
    <radialGradient id="mg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#7B1FA2" stop-opacity=".6"/><stop offset="100%" stop-color="#1A0030" stop-opacity="0"/></radialGradient>
    <rect width="380" height="190" fill="url(#mg)"/>
    ${Array.from({length:46},()=>{const sx=Math.floor(Math.random()*380),sy=Math.floor(Math.random()*190);return`<circle cx="${sx}" cy="${sy}" r="${Math.random()>.8?2.5:1}" fill="${Math.random()>.5?'#E040FB':'white'}" opacity="${.4+Math.random()*.6}"/>`;}).join('')}
    <circle cx="190" cy="90" r="44" fill="#4A0080" opacity=".5"/>
    <circle cx="190" cy="90" r="30" fill="#7B1FA2" opacity=".4"/>
    <circle cx="190" cy="90" r="18" fill="#E040FB" opacity=".3"/>
    <text x="190" y="100" font-size="30" text-anchor="middle">🔮</text>
    <rect y="152" width="380" height="38" fill="#1A0030"/>
    <rect y="152" width="380" height="6" fill="#4A0080" opacity=".5"/>
    <circle cx="190" cy="168" r="28" fill="none" stroke="#E040FB" stroke-width="1.5" opacity=".4" stroke-dasharray="4 4"/>
    <text x="190" y="184" font-size="10" text-anchor="middle" fill="#CE93D8" opacity=".7">✦ you found the secret spot ✦</text>
  </svg>`
};

function openLoc(id){
  const b=BLDGS.find(x=>x.id===id);if(!b)return;
  const city=(SS&&SS.city)||{nest:true};
  const owned=city[id]||id==='nest';
  const coins=SS?.coins||0;
  document.getElementById('loc-title').textContent=b.name;
  document.getElementById('loc-subtitle').textContent=owned?'Tap activity to start':'Locked location';
  const body=document.getElementById('loc-body');
  const myAv=ME?.avatar||'🐻', myName=ME?.name||'You';
  const pAv=PARTNER?.avatar||'🐱', pName=PARTNER?.name||'Partner';
  if(owned){
    body.innerHTML=`
      <div style="background:linear-gradient(160deg,#FFF0E6,#E8F5F0)">${ROOMS[id]||''}</div>
      <div class="loc-avatars">
        <div class="loc-avatar"><span class="loc-avatar-em">${myAv}</span><span class="loc-avatar-name">${myName}</span></div>
        <span style="font-size:20px;align-self:center">♥</span>
        <div class="loc-avatar"><span class="loc-avatar-em">${pAv}</span><span class="loc-avatar-name">${pName}</span></div>
      </div>
      <div class="loc-activity-card">
        <div class="loc-act-label">✦ Activity at ${b.name}</div>
        <div class="loc-act-text">${b.activity}</div>
      </div>
      <div style="padding:0 14px 20px">
        <button class="btn-save" onclick="toast('Have fun together! 🎉');closeLoc()">Start this activity 🎉</button>
      </div>`;
  } else {
    const can=coins>=b.cost;
    body.innerHTML=`
      <div style="filter:grayscale(1);opacity:.35;pointer-events:none">${ROOMS[id]||''}</div>
      <div class="loc-locked">
        <div class="loc-locked-icon">${b.icon}</div>
        <div class="loc-locked-title">Unlock ${b.name}</div>
        <div class="loc-locked-sub">${b.desc}</div>
        <div class="loc-locked-price">🪙 ${b.cost} Nest Coins</div><br>
        ${can
          ?`<button class="btn-save" onclick="buyLoc('${id}')">Unlock for 🪙 ${b.cost}</button>`
          :`<button class="btn-save" style="background:var(--text3);cursor:not-allowed" disabled>Need ${b.cost-coins} more 🪙</button>
            <div style="font-size:11px;color:var(--text3);margin-top:8px">Complete activities &amp; share your mood daily</div>`}
      </div>`;
  }
  document.getElementById('loc-overlay').classList.add('open');
}

function closeLoc(){document.getElementById('loc-overlay').classList.remove('open');}
