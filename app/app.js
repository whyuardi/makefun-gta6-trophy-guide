// Leonida Trophy Guide: a checklist of GTA VI's 55 trophies that remembers
// your ticks in this browser (localStorage), filters the list, hides story
// and hidden trophies until you ask to see them, and shows a full guide for
// the trophy you pick. Everything is local: the only file it fetches is
// data/trophies.json, and the source URLs in that file are shown as text,
// never loaded.
const EARNED_KEY = 'gta6-trophy-checklist-v1';
const SETTINGS_KEY = 'gta6-trophy-settings-v1';

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));

// The platinum roadmap: eight phases, in the order a player should take
// them. Every trophy appears in exactly one phase.
const PHASES = [
  { title: '1 · Before you start', text: 'Set up a clean run: keep a manual save at the start of every chapter (reports say there is no mission replay), leave cheats off (they disable trophies), and read the one missable trophy now — it can bite as early as Chapter 1.', ids: [28] },
  { title: '2 · Play the story', text: 'Chapters 1–4 and the finale. All twelve story trophies are unmissable — just play the main path, and clear side strands as they open instead of leaving them for later.', ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
  { title: '3 · Side strands — the people of Leonida', text: 'Finish the mission chains for Andy, Kenton, Billy, Randy and Tyrone, hunt Bret’s unique animal, and complete eight stranger strands across the state.', ids: [22, 23, 24, 26, 27, 29, 25] },
  { title: '4 · Activities & skill', text: 'Try every activity once, then go deep: gold at all 42 shooting-range challenges, a drone-race win at all 14 locations, 20 different race wins, 250 stunts, and 50 challenges. Beat Cal at fishing, finish an arcade game, and bowl a game.', ids: [16, 17, 18, 19, 20, 21, 32, 46] },
  { title: '5 · Collectibles & exploration', text: 'The long, quiet grind: 100 WAiNK It locations, 3 card sets, 100 vehicles discovered, all 52 areas of Leonida explored, and all 8 garage properties bought.', ids: [30, 31, 35, 42, 54] },
  { title: '6 · Robberies & heat', text: 'The criminal career: 5 bank vaults, an armored truck, a jewelry store without being spotted, one illegal operation from each of the 9 gangs — plus the two partner wanted-level trophies.', ids: [33, 34, 39, 40, 41, 43] },
  { title: '7 · Money & the strange ones', text: 'Launder $250,000 of Marked Bills, spend $100,000 in shops, register 10 vehicles — and chase the eight hidden one-offs whose methods are still unconfirmed. Try the estimates in their guides and check back as players report the real triggers.', ids: [36, 37, 38, 44, 45, 47, 48, 49, 50, 51, 52, 53, 55] },
  { title: '8 · 100% and the platinum', text: 'With everything else done, the 100% checklist should be nearly full — mop up the last entries and A Long Road pops. Then the platinum, Vice Got a Price!, is yours.', ids: [14, 15, 1] },
];

let earned = new Set(JSON.parse(localStorage.getItem(EARNED_KEY) ?? '[]').filter((id) => byId.has(id)));
let settings = { spoilers: true, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}')) };
let selectedId = 28; // Positive Mental Attitude: the missable one, worth seeing first.

const $ = (id) => document.getElementById(id);
const listEl = $('trophies');
const detailEl = $('detail');

function saveEarned() {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}
function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

const isMasked = (t) => settings.spoilers && t.hidden && !earned.has(t.id);

function gradeLabel(grade) {
  return grade[0].toUpperCase() + grade.slice(1);
}

function renderProgress() {
  const n = earned.size;
  const total = trophies.length;
  const pct = Math.round((n / total) * 100);
  $('progress-count').textContent = `${n} of ${total} earned`;
  $('progress-pct').textContent = `${pct}%`;
  $('progress-fill').style.width = `${pct}%`;
  $('progress-bar').setAttribute('aria-valuenow', String(n));
  const counts = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => {
      const ofGrade = trophies.filter((t) => t.grade === g);
      const done = ofGrade.filter((t) => earned.has(t.id)).length;
      return `${gradeLabel(g)} ${done}/${ofGrade.length}`;
    })
    .join(' · ');
  $('grade-counts').textContent = counts;
}

function renderRoadmap() {
  const ol = $('phases');
  ol.replaceChildren();
  for (const phase of PHASES) {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    h3.textContent = phase.title;
    const p = document.createElement('p');
    p.textContent = phase.text;
    const done = phase.ids.filter((id) => earned.has(id)).length;
    const tag = document.createElement('p');
    tag.className = 'phase-count';
    tag.textContent = `${done}/${phase.ids.length} done`;
    const names = document.createElement('p');
    names.className = 'phase-trophies';
    for (const id of phase.ids) {
      const t = byId.get(id);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'phase-trophy' + (earned.has(id) ? ' done' : '');
      b.textContent = (earned.has(id) ? '✓ ' : '') + (isMasked(t) ? 'Hidden trophy' : t.name);
      b.addEventListener('click', () => select(id));
      names.append(b);
    }
    li.append(h3, p, tag, names);
    ol.append(li);
  }
}

function matchesFilters(t) {
  const q = $('search').value.trim().toLowerCase();
  if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) return false;
  if ($('grade').value !== 'all' && t.grade !== $('grade').value) return false;
  if ($('kind').value !== 'all' && t.kind !== $('kind').value) return false;
  if ($('status').value === 'earned' && !earned.has(t.id)) return false;
  if ($('status').value === 'unearned' && earned.has(t.id)) return false;
  return true;
}

function renderList() {
  listEl.replaceChildren();
  let shown = 0;
  let maskedShown = 0;
  for (const t of trophies) {
    if (!matchesFilters(t)) continue;
    shown++;
    const li = document.createElement('li');
    li.className = `trophy grade-${t.grade}` + (earned.has(t.id) ? ' earned' : '') + (selectedId === t.id ? ' selected' : '');
    const masked = isMasked(t);
    if (masked) maskedShown++;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Earned: ${masked ? 'Hidden trophy' : t.name}`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id);
      else earned.delete(t.id);
      saveEarned();
      renderAll();
    });
    const body = document.createElement('button');
    body.type = 'button';
    body.className = 'trophy-body';
    body.addEventListener('click', () => select(t.id));
    const name = document.createElement('span');
    name.className = 'trophy-name';
    name.textContent = masked ? 'Hidden trophy' : t.name;
    const desc = document.createElement('span');
    desc.className = 'trophy-desc';
    desc.textContent = masked ? 'Hidden until earned — turn off the spoiler setting to reveal it.' : t.description;
    const meta = document.createElement('span');
    meta.className = 'trophy-meta';
    const grade = document.createElement('span');
    grade.className = `badge grade-${t.grade}`;
    grade.textContent = gradeLabel(t.grade);
    meta.append(grade);
    if (t.count) {
      const c = document.createElement('span');
      c.className = 'badge count';
      c.textContent = `× ${t.count.toLocaleString('en-US')}`;
      meta.append(c);
    }
    if (t.missable) {
      const m = document.createElement('span');
      m.className = 'badge missable';
      m.textContent = '⚠ Possibly missable';
      meta.append(m);
    }
    if (!t.confirmed) {
      const u = document.createElement('span');
      u.className = 'badge unconfirmed';
      u.textContent = 'Method unconfirmed';
      meta.append(u);
    }
    body.append(name, desc, meta);
    li.append(box, body);
    listEl.append(li);
  }
  $('shown-count').textContent = `— showing ${shown} of ${trophies.length}`;
  $('spoiler-note').textContent = settings.spoilers
    ? `Spoiler mode is on: ${maskedShown} hidden ${maskedShown === 1 ? 'trophy is' : 'trophies are'} masked in this list. Tick one to reveal it, or turn the setting off.`
    : 'Spoiler mode is off: hidden trophies and their mission names are shown.';
}

function select(id) {
  selectedId = id;
  renderList();
  renderDetail();
  renderRoadmap();
}

function renderDetail() {
  const t = byId.get(selectedId);
  detailEl.replaceChildren();
  const card = document.createElement('div');
  card.className = 'detail-card';
  if (isMasked(t)) {
    const h = document.createElement('h2');
    h.textContent = 'Hidden trophy';
    const p = document.createElement('p');
    p.textContent = 'This trophy stays hidden until you earn it. Turn off “Hide story & hidden trophies” above to see its name and guide, or tick its box in the checklist once you have earned it.';
    card.append(h, p);
    detailEl.append(card);
    return;
  }
  const grade = document.createElement('span');
  grade.className = `badge grade-${t.grade}`;
  grade.textContent = gradeLabel(t.grade);
  const h = document.createElement('h2');
  h.textContent = t.name;
  const desc = document.createElement('p');
  desc.className = 'detail-desc';
  desc.textContent = t.description;
  const flags = document.createElement('p');
  flags.className = 'detail-flags';
  const bits = [];
  if (t.hidden) bits.push('Hidden trophy');
  bits.push(`Type: ${t.kind}`);
  if (t.count) bits.push(`Target: ${t.count.toLocaleString('en-US')}`);
  flags.textContent = bits.join(' · ');
  const guideTitle = document.createElement('h3');
  guideTitle.textContent = 'How to get it';
  const guide = document.createElement('p');
  guide.className = 'detail-guide';
  guide.textContent = t.guide;
  card.append(grade, h, desc, flags, guideTitle, guide);
  if (t.missable && t.missable_note) {
    const warn = document.createElement('p');
    warn.className = 'warn';
    warn.textContent = `⚠ Possibly missable — ${t.missable_note}`;
    card.append(warn);
  }
  if (!t.confirmed) {
    const note = document.createElement('p');
    note.className = 'warn';
    note.textContent = 'Method unconfirmed: no guide has pinned down this trophy’s trigger yet. The approach above is an estimate, not a confirmed fact — check back as players report it.';
    card.append(note);
  }
  const srcTitle = document.createElement('h3');
  srcTitle.textContent = 'Sources';
  const srcList = document.createElement('ul');
  srcList.className = 'sources';
  for (const s of t.sources) {
    const li = document.createElement('li');
    li.textContent = `${s.name} — ${s.url}`;
    srcList.append(li);
  }
  const tick = document.createElement('button');
  tick.type = 'button';
  tick.className = 'detail-tick';
  tick.textContent = earned.has(t.id) ? '✓ Earned — click to untick' : 'Mark as earned';
  tick.addEventListener('click', () => {
    if (earned.has(t.id)) earned.delete(t.id);
    else earned.add(t.id);
    saveEarned();
    renderAll();
  });
  card.append(srcTitle, srcList, tick);
  detailEl.append(card);
}

function renderAll() {
  renderProgress();
  renderRoadmap();
  renderList();
  renderDetail();
}

$('search').addEventListener('input', renderList);
$('grade').addEventListener('change', renderList);
$('kind').addEventListener('change', renderList);
$('status').addEventListener('change', renderList);
$('spoilers').checked = settings.spoilers;
$('spoilers').addEventListener('change', (e) => {
  settings.spoilers = e.target.checked;
  saveSettings();
  renderAll();
});

$('export').addEventListener('click', () => {
  const data = { game: 'Grand Theft Auto VI', exported: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(ids)) throw new Error('no earned list');
    earned = new Set(ids.filter((id) => byId.has(id)));
    saveEarned();
    renderAll();
  } catch {
    alert('That file is not a trophy-progress export from this guide.');
  }
  e.target.value = '';
});
$('reset').addEventListener('click', () => {
  if (confirm('Clear all earned ticks?')) {
    earned = new Set();
    saveEarned();
    renderAll();
  }
});

renderAll();
