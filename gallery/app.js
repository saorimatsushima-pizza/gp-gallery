(() => {
  'use strict';

  // Every entry below is fictional and exists only in the visitor's browser memory.
  const teams = [
    { id: 'tomato', name: 'Tomato Studio', emoji: '🍅', note: 'Sauce & Story', people: [['Mia Marinara', '🎨'], ['Theo Cherry', '🧢'], ['Lulu Pomodoro', '🌟'], ['Nico Ruby', '🎸']] },
    { id: 'cheese', name: 'Cheese Lab', emoji: '🧀', note: 'Melt & Make', people: [['Coco Cheddar', '🛼'], ['Max Mozza', '🪄'], ['Emi Brie', '🌼'], ['Leo Gouda', '🚲']] },
    { id: 'basil', name: 'Basil Works', emoji: '🌿', note: 'Fresh Ideas', people: [['Bibi Leaf', '🪴'], ['Sora Verde', '🦕'], ['Rin Herb', '🧩'], ['Kai Pesto', '🛹']] },
    { id: 'mushroom', name: 'Mushroom Club', emoji: '🍄', note: 'Wild & Wonder', people: [['Momo Morel', '🔭'], ['Finn Forest', '🎧'], ['Ari Button', '📷'], ['Pico Truffle', '🛸']] }
  ];

  const content = document.querySelector('#step-content');
  const title = document.querySelector('#panel-title');
  const stepLabel = document.querySelector('#step-label');
  const stepStatus = document.querySelector('#step-status');
  const backButton = document.querySelector('#back-button');
  const progressBars = [...document.querySelectorAll('.progress span')];
  const overlay = document.querySelector('#success-overlay');
  const background = [document.querySelector('.nav'), document.querySelector('main')];
  const headings = ['どのチームですか？', 'あなたの名前は？', 'これで合っていますか？'];
  // The CSS media query cannot reach scrollIntoView, so the preference is read here too.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selectedTeam = null;
  let selectedPerson = null;
  let step = 1;

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));

  // The step panel is rebuilt wholesale on every render, so it must not be a live
  // region itself — that would re-read the entire panel on each keystroke. Instead
  // a dedicated status element carries one short message per action.
  const announce = (message) => { stepStatus.textContent = message; };

  function updateHeader() {
    title.textContent = headings[step - 1];
    stepLabel.textContent = `STEP ${step} / 3`;
    progressBars.forEach((bar, index) => bar.classList.toggle('active', index < step));
    backButton.classList.toggle('hidden', step === 1);
  }

  function renderTeams() {
    step = 1;
    updateHeader();
    content.innerHTML = `<div class="card-grid">${teams.map((team) => `
      <button class="team-card" type="button" data-team="${escapeHtml(team.id)}">
        <span class="team-emoji" aria-hidden="true">${escapeHtml(team.emoji)}</span>
        <span><strong>${escapeHtml(team.name)}</strong><small>${escapeHtml(team.note)}</small></span>
        <span class="arrow" aria-hidden="true">→</span>
      </button>`).join('')}</div>`;
    content.querySelectorAll('[data-team]').forEach((button) => button.addEventListener('click', () => {
      selectedTeam = teams.find((team) => team.id === button.dataset.team);
      renderPeople();
    }));
    announce(`STEP 1 / 3 ${headings[0]}`);
  }

  function renderPeople(query = '', isSearch = false) {
    step = 2;
    updateHeader();
    const safeQuery = query.trim().toLowerCase();
    const matches = selectedTeam.people.filter(([name]) => name.toLowerCase().includes(safeQuery));
    content.innerHTML = `
      <div class="search-wrap"><span aria-hidden="true">⌕</span><input id="name-search" type="search" placeholder="名前を検索" autocomplete="off" value="${escapeHtml(query)}" aria-label="名前を検索"></div>
      <div class="name-grid">${matches.map(([name, avatar]) => `
        <button class="name-card" type="button" data-name="${escapeHtml(name)}">
          <span class="avatar" aria-hidden="true">${escapeHtml(avatar)}</span><span><strong>${escapeHtml(name)}</strong><small>${escapeHtml(selectedTeam.name)}</small></span>
        </button>`).join('')}</div>
      ${matches.length ? '' : '<p class="empty-state">該当する名前が見つかりませんでした。</p>'}`;
    const search = content.querySelector('#name-search');
    search.addEventListener('input', (event) => renderPeople(event.target.value, true));
    search.focus({ preventScroll: true });
    search.setSelectionRange(query.length, query.length);
    content.querySelectorAll('[data-name]').forEach((button) => button.addEventListener('click', () => {
      selectedPerson = selectedTeam.people.find(([name]) => name === button.dataset.name);
      renderConfirmation();
    }));
    announce(isSearch
      ? (matches.length ? `${matches.length}件見つかりました` : '該当する名前が見つかりませんでした')
      : `STEP 2 / 3 ${headings[1]}`);
  }

  function renderConfirmation() {
    step = 3;
    updateHeader();
    content.innerHTML = `<div class="confirm-box">
      <div class="confirm-avatar" aria-hidden="true">${escapeHtml(selectedPerson[1])}</div>
      <h3>${escapeHtml(selectedPerson[0])}</h3>
      <p>${escapeHtml(selectedTeam.emoji)} ${escapeHtml(selectedTeam.name)}</p>
      <button class="primary-button" id="confirm-button" type="button">チェックイン！</button>
    </div>`;
    const confirmButton = content.querySelector('#confirm-button');
    confirmButton.addEventListener('click', showSuccess);
    // The clicked name card was just removed from the DOM; without this, focus
    // falls back to <body> and keyboard users have to tab in from the top again.
    confirmButton.focus({ preventScroll: true });
    announce(`STEP 3 / 3 ${headings[2]}`);
  }

  function showSuccess() {
    document.querySelector('#success-name').textContent = selectedPerson[0];
    document.querySelector('#success-team').textContent = `${selectedTeam.emoji} ${selectedTeam.name}`;
    const confetti = document.querySelector('#confetti');
    confetti.replaceChildren();
    const colors = ['#f0523a', '#f7c843', '#2c8a64', '#7152a8'];
    for (let index = 0; index < 34; index += 1) {
      const piece = document.createElement('i');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[index % colors.length];
      piece.style.animationDelay = `${Math.random() * 1.7}s`;
      piece.style.animationDuration = `${2.1 + Math.random() * 1.8}s`;
      confetti.append(piece);
    }
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    // `aria-modal="true"` only promises containment — `inert` is what delivers it,
    // keeping the nav and the panel behind the overlay out of the tab order.
    background.forEach((region) => { region.inert = true; });
    document.querySelector('#reset-button').focus();
  }

  function reset() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    background.forEach((region) => { region.inert = false; });
    selectedTeam = null;
    selectedPerson = null;
    renderTeams();
    // Return focus to the panel rather than dropping it on <body> when the dialog closes.
    content.querySelector('[data-team]').focus({ preventScroll: true });
    document.querySelector('#checkin').scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  }

  backButton.addEventListener('click', () => step === 3 ? renderPeople() : renderTeams());
  document.querySelector('#start-button').addEventListener('click', () => document.querySelector('#checkin').scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'start' }));
  document.querySelector('#reset-button').addEventListener('click', reset);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !overlay.hidden) reset(); });
  renderTeams();
})();
