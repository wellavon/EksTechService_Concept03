/* =========================================================
   Concept 04 — «Пульт» · VHS edition
   Меню · часы Сыктывкара · валидация · шкала заполнения
   ========================================================= */
(function () {
  'use strict';

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.textContent = open ? '✕' : '☰';
    });
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.textContent = '☰';
      });
    });
  }

  const clock = document.getElementById('panelClock');
  if (clock) {
    const tick = () => {
      const now = new Date();
      const local = new Date(now.getTime() + (now.getTimezoneOffset() + 180) * 60000);
      const hh = String(local.getHours()).padStart(2, '0');
      const mm = String(local.getMinutes()).padStart(2, '0');
      const ss = String(local.getSeconds()).padStart(2, '0');
      clock.textContent = `${hh}:${mm}:${ss}`;
    };
    tick();
    setInterval(tick, 1000);
  }

  const form = document.getElementById('leadForm');
  const msg = document.getElementById('formMsg');
  const status = document.getElementById('termStatus');
  const levelBar = document.getElementById('levelBar');
  const levelPct = document.getElementById('levelPct');
  if (!form) return;

  const fields = {
    name: document.getElementById('f-name'),
    phone: document.getElementById('f-phone'),
    service: document.getElementById('f-service')
  };

  function setInvalid(key, bad) {
    if (fields[key]) fields[key].classList.toggle('invalid', bad);
  }

  function setStatus(text, ok) {
    if (!status) return;
    status.classList.toggle('ok', ok);
    status.innerHTML = `<span class="dot ${ok ? 'dot-on' : 'dot-warn'}"></span> ${text}`;
  }

  function validate() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const digits = phone.replace(/\D/g, '');

    const nameBad = name.length < 2;
    const phoneBad = !(digits.length >= 10 && digits.length <= 11) || !/^[+\d\s()-]+$/.test(phone);
    const serviceBad = !service;

    setInvalid('name', nameBad);
    setInvalid('phone', phoneBad);
    setInvalid('service', serviceBad);
    return !nameBad && !phoneBad && !serviceBad;
  }

  function updateLevel() {
    if (!levelBar) return;
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;

    const parts = [name.length >= 2, phone.replace(/\D/g, '').length >= 10, !!service];
    const filled = parts.filter(Boolean).length;
    const total = 10;
    const on = Math.round((filled / 3) * total);

    const spans = levelBar.querySelectorAll('.level-track span');
    spans.forEach((s, i) => s.classList.toggle('on', i < on));
    if (levelPct) levelPct.textContent = `${Math.round((on / total) * 100)}%`;
  }

  ['name', 'phone', 'service'].forEach((key) => {
    const input = document.getElementById(key);
    if (!input) return;
    input.addEventListener('input', () => { setInvalid(key, false); updateLevel(); });
    input.addEventListener('change', () => { setInvalid(key, false); updateLevel(); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (msg) { msg.classList.remove('ok'); msg.textContent = ''; }
    if (!validate()) {
      setStatus('Ошибка ввода', false);
      return;
    }
    if (msg) {
      msg.textContent = 'Заявка принята (демо). Свяжемся в рабочее время.';
      msg.classList.add('ok');
    }
    setStatus('Заявка принята', true);
    form.reset();
    updateLevel();
    setTimeout(() => {
      if (msg) msg.classList.remove('ok');
      setStatus('Ожидание', false);
    }, 6000);
  });
})();