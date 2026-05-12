// ============================================================
// COZY NEST — Character Manifest Generator
// Run with: node generate-manifest.js
// Drop PNG files in /assets/character/ subfolders,
// name them as described below, then run this script.
// The manifest.json will be auto-updated.
//
// FILE NAMING:
//   hair/     h_[name].png           e.g. h_shortbob.png
//             h_[name]_[coins].png   e.g. h_longhair_30.png
//   outfits/  out_[name].png
//   hats/     hat_[name].png
//   accessories/ acc_[name].png
//
// Each hair file needs a _front and _back version:
//   h_shortbob_front.png
//   h_shortbob_back.png
// ============================================================

const fs   = require('fs');
const path = require('path');

const BASE = './assets/character';
const OUT  = path.join(BASE, 'manifest.json');

// These never change — edit here to add/remove skin tones or hair colours
const SKIN_COLORS = [
  { id:'s1', label:'Light',  color:'#FDDBB4' },
  { id:'s2', label:'Warm',   color:'#F5C18A' },
  { id:'s3', label:'Golden', color:'#E8A96A' },
  { id:'s4', label:'Brown',  color:'#C68642' },
  { id:'s5', label:'Deep',   color:'#8D5524' },
];

const HAIR_COLORS = [
  { id:'hc1', label:'Black',    color:'#1A1A1A', coins:0  },
  { id:'hc2', label:'Brown',    color:'#6B3A2A', coins:0  },
  { id:'hc3', label:'Blonde',   color:'#C8A882', coins:20 },
  { id:'hc4', label:'Auburn',   color:'#A0522D', coins:20 },
  { id:'hc5', label:'Lavender', color:'#8B7BA8', coins:40 },
  { id:'hc6', label:'Rose',     color:'#E87878', coins:40 },
  { id:'hc7', label:'Blue',     color:'#78B4E8', coins:40 },
];

// Parse a folder of PNGs into manifest items
// prefix: 'h', 'out', 'hat', 'acc'
// For hair: looks for _front files and derives the style id from those
function parseFolder(folder, prefix){
  const dir = path.join(BASE, folder);
  if(!fs.existsSync(dir)){
    console.log(`  ⚠️  Folder not found: ${dir} — skipping`);
    return [];
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
  const seen  = new Set();
  const items = [];

  // For hair, use _front files as the canonical list
  const canonical = prefix === 'h'
    ? files.filter(f => f.includes('_front'))
    : files.filter(f => f.startsWith(prefix + '_'));

  for(const file of canonical){
    // Strip _front suffix for hair
    const base = file
      .replace('.png', '')
      .replace('_front', '')
      .replace('_back', '');

    if(!base.startsWith(prefix + '_')) continue;

    // Strip the prefix_ part
    const rest  = base.slice(prefix.length + 1); // e.g. "shortbob" or "shortbob_30"
    const parts = rest.split('_');

    // Check if last part is a coin cost
    const last  = parts[parts.length - 1];
    const coins = /^\d+$/.test(last) ? parseInt(last) : 0;
    const nameParts = coins ? parts.slice(0, -1) : parts;

    const id    = prefix + '_' + nameParts.join('_');
    if(seen.has(id)) continue;
    seen.add(id);

    const label = nameParts
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const item = { id, label, coins };

    // For hair: store front/back file references
    if(prefix === 'h'){
      item.front = `hair/${prefix}_${nameParts.join('_')}_front.png`;
      item.back  = `hair/${prefix}_${nameParts.join('_')}_back.png`;
    } else {
      item.file = `${folder}/${file}`;
    }

    items.push(item);
  }

  // Sort: free items first, then by label
  return items.sort((a, b) => {
    if(a.coins !== b.coins) return a.coins - b.coins;
    return a.label.localeCompare(b.label);
  });
}

// Build manifest
const manifest = {
  skin:        SKIN_COLORS,
  hairColors:  HAIR_COLORS,
  hair:        parseFolder('hair',        'h'),
  outfits:     parseFolder('outfits',     'out'),
  hats:        parseFolder('hats',        'hat'),
  accessories: parseFolder('accessories', 'acc'),
};

// Ensure output folder exists
fs.mkdirSync(BASE, { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2));

console.log('\n✅ manifest.json generated at', OUT);
console.log(`   ${manifest.hair.length} hairstyle(s)`);
console.log(`   ${manifest.outfits.length} outfit(s)`);
console.log(`   ${manifest.hats.length} hat(s)`);
console.log(`   ${manifest.accessories.length} accessor(ies)`);
console.log('');
if(manifest.hair.length === 0 && manifest.outfits.length === 0){
  console.log('💡 No assets found yet. Create your PNG files in:');
  console.log('   assets/character/hair/        → h_shortbob_front.png, h_shortbob_back.png');
  console.log('   assets/character/outfits/     → out_cozysweater.png');
  console.log('   assets/character/hats/        → hat_beanie.png');
  console.log('   assets/character/accessories/ → acc_glasses_20.png');
}
