
const OPENWEATHER_KEY = '69d0c58a5065e0b357f91ed3428baff6';
const clockDisplay = document.getElementById('clockDisplay');
const greetingText = document.getElementById('greetingText');
const weatherDesc = document.getElementById('weatherDesc');
const tempText = document.getElementById('tempText');
const locationText = document.getElementById('locationText');
const weatherIcon = document.getElementById('weatherIcon');
const weatherExtra = document.getElementById('weatherExtra');
const noteInput = document.getElementById('noteInput');
const saveNote = document.getElementById('saveNote');
const newNoteBtn = document.getElementById('newNoteBtn');
const noteList = document.getElementById('noteList');
const clearNotesBtn = document.getElementById('clearNotesBtn');
const presets = document.getElementById('presets');
const accentPreview = document.getElementById('accentPreview');
const wallInput = document.getElementById('wallInput');
const uploadWall = document.getElementById('uploadWall');
const autoTheme = document.getElementById('autoTheme');
const resetTheme = document.getElementById('resetTheme');
const newQuoteBtn = document.getElementById('newQuote');
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const omnibox = document.getElementById('omnibox');
const linksGrid = document.getElementById('linksGrid');
const editLinks = document.getElementById('editLinks');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const todoList = document.getElementById('todoList');
const clearTasks = document.getElementById('clearTasks');
const taskDate = document.getElementById('taskDate');
const colorPicker = document.getElementById('colorPicker');
const randomAccent = document.getElementById('randomAccent');
const darkToggle = document.getElementById('darkToggle');
const darkIcon = document.getElementById('darkIcon');

function formatTime(d){
  return d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
}
function updateClock(){
  const now = new Date();
  clockDisplay.textContent = formatTime(now);
  const h = now.getHours();
  let g = 'Good Morning';
  if(h<5||h>=22) g='Good Night';
  else if(h<12) g='Good Morning';
  else if(h<18) g='Good Afternoon';
  else g='Good Evening';
  greetingText.textContent = `${g}, Samar`;
}
setInterval(updateClock,1000);
updateClock();

omnibox.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ let v = omnibox.value.trim(); if(!v) return; if(!v.includes(' ' ) && (v.includes('.') || v.startsWith('http'))){ if(!v.startsWith('http')) v = 'https://'+v; window.open(v,'_blank'); } else { window.open('https://www.google.com/search?q='+encodeURIComponent(v),'_blank'); } omnibox.value=''; } });

function saveToStorage(key,val){ localStorage.setItem(key, JSON.stringify(val)); }
function loadFromStorage(key, fallback){ const raw=localStorage.getItem(key); if(!raw) return fallback; try{return JSON.parse(raw)}catch{return fallback} }

/* NOTES */
let notes = loadFromStorage('mu_notes', []);
function renderNotes(){
  noteList.innerHTML='';
  notes.slice().reverse().forEach((n,idx)=>{
    const el = document.createElement('div');
    el.className='note-chip';
    el.textContent = n.text.length>80 ? n.text.slice(0,80)+'…' : n.text;
    el.title = n.text;
    el.addEventListener('click', ()=> {
      const ok = confirm('Delete this note?');
      if(ok){
        notes.splice(notes.length-1-idx,1);
        saveToStorage('mu_notes', notes);
        renderNotes();
      }
    });
    noteList.appendChild(el);
  });
}
renderNotes();
saveNote.addEventListener('click', ()=> {
  const t = noteInput.value.trim();
  if(!t) return;
  notes.push({text:t, created:Date.now()});
  saveToStorage('mu_notes', notes);
  noteInput.value='';
  renderNotes();
});
newNoteBtn.addEventListener('click', ()=>{ noteInput.focus(); });
clearNotesBtn.addEventListener('click', ()=> { if(confirm('Clear all notes?')) { notes=[]; saveToStorage('mu_notes', notes); renderNotes(); } });

/* TODOs */
let todos = loadFromStorage('mu_todos', []);
function renderTodos(){
  todoList.innerHTML='';
  todos.forEach((it, i)=>{
    const el = document.createElement('div');
    el.className = 'todo-item' + (it.done ? ' completed' : '');
    const chk = document.createElement('input');
    chk.type='checkbox'; chk.checked=it.done;
    chk.addEventListener('change', ()=> { it.done = chk.checked; saveToStorage('mu_todos', todos); renderTodos(); });
    const txt = document.createElement('div');
    txt.style.flex='1'; txt.textContent = it.text + (it.date ? ' • '+it.date : '');
    const del = document.createElement('button');
    del.className='icon-btn'; del.innerHTML = '<span class="material-symbols-outlined">delete</span>';
    del.addEventListener('click', ()=> { if(confirm('Delete task?')) { todos.splice(i,1); saveToStorage('mu_todos', todos); renderTodos(); } });
    el.appendChild(chk); el.appendChild(txt); el.appendChild(del);
    todoList.appendChild(el);
  });
}
renderTodos();
addTaskBtn.addEventListener('click', ()=> {
  const text = taskInput.value.trim();
  if(!text) return;
  const d = taskDate.value || '';
  todos.push({text, date:d, done:false});
  taskInput.value=''; taskDate.value=''; saveToStorage('mu_todos', todos); renderTodos();
});
clearTasks.addEventListener('click', ()=> { if(confirm('Clear all tasks?')){ todos=[]; saveToStorage('mu_todos', todos); renderTodos(); } });

/* QUOTES */
async function fetchQuote(){
  try{
    const res = await fetch('https://api.quotable.io/random');
    if(!res.ok) throw '';
    const j = await res.json();
    quoteText.textContent = j.content;
    quoteAuthor.textContent = '— ' + j.author;
  }catch(e){
    quoteText.textContent = 'The secret of getting ahead is getting started.';
    quoteAuthor.textContent = '— Mark Twain';
  }
}
newQuoteBtn.addEventListener('click', fetchQuote);
fetchQuote();

/* QUICK LINKS */
function attachLinkHandlers(){
  document.querySelectorAll('.link-card').forEach(card=>{
    card.addEventListener('click', ()=> window.open(card.dataset.url,'_blank'));
  });
}
attachLinkHandlers();
editLinks.addEventListener('click', ()=> {
  const url = prompt('Add link (full URL):');
  if(url && url.startsWith('http')){
    const title = prompt('Title for link (optional):') || url;
    const el = document.createElement('div');
    el.className='link-card'; el.dataset.url=url;
    el.innerHTML = '<div class="link-favicon">'+(title[0]||'L')+'</div><div style="display:flex;flex-direction:column"><div style="font-weight:600">'+title+'</div><div style="font-size:0.85rem;opacity:0.8">'+(new URL(url)).hostname+'</div></div>';
    linksGrid.appendChild(el);
    attachLinkHandlers();
  } else if(url) alert('Invalid URL. Must start with http or https.');
});




/* THEMES & WALLPAPER (enhanced) */
function applyAccent(a){
  document.documentElement.style.setProperty('--accent', a);
  accentPreview.style.background = `linear-gradient(90deg, ${a}, ${a}33)`;
  colorPicker.value = hexFromColor(a);
  saveThemeState();
}
function hexFromColor(c){
  if(!c) return '#6750A4';
  if(c.startsWith('#')) return c;
  return '#6750A4';
}
presets.querySelectorAll('.preset').forEach(p=>{
  p.addEventListener('click', ()=> {
    const a=p.dataset.a;
    applyAccent(a);
  });
});
resetTheme.addEventListener('click', ()=> {
  applyAccent('#6750A4');
  document.documentElement.style.setProperty('--bg1','#f4f7ff');
  document.documentElement.style.setProperty('--bg2','#fff4f8');
  document.body.style.backgroundImage='';
  saveToStorage('mu_wall', null);
  saveThemeState();
});
uploadWall.addEventListener('click', ()=> wallInput.click());
wallInput.addEventListener('change', (e)=>{
  const f=e.target.files[0];
  if(!f) return;
  const url = URL.createObjectURL(f);
  document.body.style.backgroundImage = `url(${url})`;
  document.body.style.backgroundSize='cover';
  document.body.style.backgroundPosition='center';
  document.documentElement.style.setProperty('--bg1','#0000'); document.documentElement.style.setProperty('--bg2','#0000');
  saveToStorage('mu_wall', url);
});

/* auto theme from wallpaper (same as before) */
autoTheme.addEventListener('click', async ()=>{
  const url = loadFromStorage('mu_wall', null);
  if(!url){ alert('Upload a wallpaper first'); return; }
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = url;
  img.onload = ()=> {
    const c = document.createElement('canvas');
    const w = Math.min(200, img.width);
    const h = Math.min(200, img.height);
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    ctx.drawImage(img,0,0,w,h);
    const data = ctx.getImageData(0,0,c.width,c.height).data;
    let r=0,g=0,b=0,count=0;
    for(let i=0;i<data.length;i+=4*30){
      r+=data[i]; g+=data[i+1]; b+=data[i+2]; count++;
    }
    r=Math.round(r/count); g=Math.round(g/count); b=Math.round(b/count);
    const hex = '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
    applyAccent(hex);
  };
  img.onerror = ()=> alert('Cannot read wallpaper for sampling (CORS or invalid)');
});

/* random accent */
randomAccent.addEventListener('click', ()=>{
  const r = Math.floor(Math.random()*200)+30;
  const g = Math.floor(Math.random()*200)+30;
  const b = Math.floor(Math.random()*200)+30;
  const hex = '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
  applyAccent(hex);
});

/* color picker */
colorPicker.addEventListener('input', (e)=> applyAccent(e.target.value));

/* dark mode toggle */
function setDarkMode(v){
  if(v){
    document.body.classList.add('dark');
    darkIcon.textContent='light_mode';
  } else {
    document.body.classList.remove('dark');
    darkIcon.textContent='dark_mode';
  }
  saveThemeState();
}
darkToggle.addEventListener('click', ()=> {
  const isDark = document.body.classList.contains('dark');
  setDarkMode(!isDark);
});

/* load wallpaper from storage */
const savedWall = loadFromStorage('mu_wall', null);
if(savedWall) {
  document.body.style.backgroundImage = `url(${savedWall})`;
  document.body.style.backgroundSize='cover';
  document.body.style.backgroundPosition='center';
  document.documentElement.style.setProperty('--bg1','#0000'); document.documentElement.style.setProperty('--bg2','#0000');
}

/* persist accent + dark setting */
function saveThemeState(){
  const state = {
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6750A4',
    dark: document.body.classList.contains('dark')
  };
  saveToStorage('mu_theme', state);
}
function loadThemeState(){
  const s = loadFromStorage('mu_theme', null);
  if(s){
    if(s.accent) applyAccent(s.accent);
    setDarkMode(!!s.dark);
  } else {
    applyAccent('#6750A4');
  }
}
loadThemeState();

/* keep accent saved when user interacts (fallback) */
new MutationObserver(()=> saveThemeState()).observe(accentPreview, {attributes:true,childList:true,subtree:true});

/* keyboard shortcuts */
document.addEventListener('keydown', (e)=>{
  if(e.key==='/' && document.activeElement!==omnibox){
    e.preventDefault(); omnibox.focus();
  }
  if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='b'){ e.preventDefault(); randomAccent.click(); }
});

/* small helpers */
(function init(){
  document.querySelectorAll('.icon-btn').forEach(b=>b.addEventListener('mousedown', ()=>b.style.transform='translateY(1px)'));
})();


///* WEATHER */

const apiKey = "20f06ce9fd0a977570bf41af5e6e2c2b";

async function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  updateWeatherUI(data);
}

function updateWeatherUI(data) {
  const temp = Math.round(data.main.temp);
  const city = data.name;
  const desc = data.weather[0].description;
  const humidity = data.main.humidity;
  const iconCode = data.weather[0].icon;

  document.getElementById("tempText").innerText = `${temp}°C`;
  document.getElementById("locationText").innerText = city;
  document.getElementById("weatherDesc").innerText = desc;
  document.getElementById("weatherExtra").innerText = `Humidity: ${humidity}%`;

  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.getElementById("weatherIcon").src = iconUrl;
}

// Try to get user's location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      fetchWeather(lat, lon);
    },
    () => {
      // Default to Bhopal if permission denied
      fetchWeather(23.2599, 77.4126);
    }
  );
} else {
  // Fallback
  fetchWeather(23.2599, 77.4126);
}


/* greeting */
function updateGreeting() {
  const greetingText = document.getElementById("greetingText");
  const now = new Date();
  const hour = now.getHours();
  const name = "Samar"; // You can replace this with localStorage or user input

  let greeting = "";

  if (hour < 5 || hour >= 22) {
    greeting = "Good Night";
  } else if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  greetingText.textContent = `${greeting}, ${name}`;
}

// Call once and update every 30 minutes (optional)
updateGreeting();
setInterval(updateGreeting, 1800000);

