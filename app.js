const $ = (id) => document.getElementById(id);
const dialog = $('connect-dialog');
const input = $('device-url');
const message = $('connect-message');
const demoNote = $('demo-note');
let pollTimer;

$('connect-open').addEventListener('click', () => dialog.showModal());
$('connect-button').addEventListener('click', connectDevice);
input.addEventListener('keydown', (event) => { if (event.key === 'Enter') connectDevice(); });

function setConnected(connected, text = '') {
  $('connection-dot').classList.toggle('connected', connected);
  $('side-dot').classList.toggle('connected', connected);
  $('connection-text').textContent = connected ? 'ESP32 connected · live readings' : 'ESP32 not connected';
  $('device-status').textContent = connected ? 'Live connection' : 'Demo mode';
  $('mode-label').textContent = connected ? 'LIVE DATA' : 'DEMO DATA';
  $('mode-label').parentElement.classList.toggle('connected', connected);
  $('chart-source').textContent = connected ? 'Trend illustration' : 'Illustrative data';
  document.querySelector('.chart-foot > span:last-child').textContent = connected ? 'Live values above · trend is illustrative' : 'Connect ESP32 for live values';
  demoNote.hidden = connected;
  if (text) message.textContent = text;
}

function displayReading(data) {
  const temperature = Number(data.temperature);
  const humidity = Number(data.humidity);
  const ph = Number(data.ph);
  if (![temperature, humidity, ph].every(Number.isFinite)) {
    throw new Error('The device response needs numeric temperature, humidity, and ph values.');
  }
  $('temp-value').textContent = temperature.toFixed(1);
  $('humidity-value').textContent = humidity.toFixed(0);
  $('ph-value').textContent = ph.toFixed(1);
  $('temp-note').textContent = 'Current ESP32 reading';
  $('humidity-note').textContent = 'Current ESP32 reading';
  $('ph-note').textContent = 'Current ESP32 reading';
}

async function connectDevice() {
  const baseUrl = input.value.trim().replace(/\/$/, '');
  if (!baseUrl) {
    message.textContent = 'Enter the ESP32 address first, for example http://192.168.1.50';
    message.className = 'dialog-hint error';
    return;
  }
  try {
    new URL(baseUrl);
  } catch {
    message.textContent = 'Enter a valid address including http://';
    message.className = 'dialog-hint error';
    return;
  }
  clearInterval(pollTimer);
  $('connect-button').disabled = true;
  $('connect-button').textContent = 'Connecting';
  message.className = 'dialog-hint';
  message.textContent = 'Checking the ESP32 sensor endpoint…';
  try {
    await readDevice(baseUrl);
    setConnected(true, 'Connected. Readings refresh every 5 seconds while this page is open.');
    message.className = 'dialog-hint success';
    pollTimer = setInterval(async () => {
      try { await readDevice(baseUrl); }
      catch { clearInterval(pollTimer); setConnected(false); message.textContent = 'Connection lost. Check Wi-Fi and try again.'; message.className = 'dialog-hint error'; }
    }, 5000);
  } catch (error) {
    setConnected(false);
    message.textContent = error.message || 'Could not reach the ESP32. Check the address and device Wi-Fi.';
    message.className = 'dialog-hint error';
  } finally {
    $('connect-button').disabled = false;
    $('connect-button').textContent = 'Connect';
  }
}

async function readDevice(baseUrl) {
  const response = await fetch(`${baseUrl}/api/sensors`, { cache: 'no-store', signal: AbortSignal.timeout(4000) });
  if (!response.ok) throw new Error(`ESP32 returned HTTP ${response.status}.`);
  displayReading(await response.json());
}

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});
