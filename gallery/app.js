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
  const backButton = document.querySelector('#back-button');
  const progressBars = [...document.querySelectorAll('.progress span')];
  const overlay = document.querySelector('#success-overlay');
  let selectedTeam = null;
  let selectedPerson = null;
  let step = 1;

  const escapeHtml = (value) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));

  function updateHeader() {
    const headings = ['どのチームですか？', 'あなたの名前は？', 'これで合っていますか？'];
    title.textContent = headings[step - 1];
    stepLabel.textContent = `STEP ${step} / 3`;
    progressBars.forEach((bar, index) => bar.classList.toggle('active', index < step));
    backButton.classList.toggle('hidden', step === 1);
  }

  function renderTeams() {
    step = 1;
    updateHeader();
    content.innerHTML = `<div class="card-grid">${teams.map((team) => `
      <button class="team-card" type="button" data-team="${team.id}">
        <span class="team-emoji" aria-hidden="true">${team.emoji}</span>
        <span><strong>${team.name}</strong><small>${team.note}</small></span>
        <span class="arrow" aria-hidden="true">→</span>
      </button>`).join('')}</div>`;
    content.querySelectorAll('[data-team]').forEach((button) => button.addEventListener('click', () => {
      selectedTeam = teams.find((team) => team.id === button.dataset.team);
      renderPeople();
    }));
  }

  function renderPeople(query = '') {
    step = 2;
    updateHeader();
    const safeQuery = query.trim().toLowerCase();
    const matches = selectedTeam.people.filter(([name]) => name.toLowerCase().includes(safeQuery));
    content.innerHTML = `
      <div class="search-wrap"><span aria-hidden="true">⌕</span><input id="name-search" type="search" placeholder="名前を検索" autocomplete="off" value="${escapeHtml(query)}" aria-label="名前を検索"></div>
      <div class="name-grid">${matches.map(([name, avatar]) => `
        <button class="name-card" type="button" data-name="${escapeHtml(name)}">
          <span class="avatar" aria-hidden="true">${avatar}</span><span><strong>${name}</strong><small>${selectedTeam.name}</small></span>
        </button>`).join('')}</div>
      ${matches.length ? '' : '<p class="empty-state">該当する名前が見つかりませんでした。</p>'}`;
    const search = content.querySelector('#name-search');
    search.addEventListener('input', (event) => renderPeople(event.target.value));
    search.focus({ preventScroll: true });
    search.setSelectionRange(query.length, query.length);
    content.querySelectorAll('[data-name]').forEach((button) => button.addEventListener('click', () => {
      selectedPerson = selectedTeam.people.find(([name]) => name === button.dataset.name);
      renderConfirmation();
    }));
  }

  function renderConfirmation() {
    step = 3;
    updateHeader();
    content.innerHTML = `<div class="confirm-box">
      <div class="confirm-avatar" aria-hidden="true">${selectedPerson[1]}</div>
      <h3>${selectedPerson[0]}</h3>
      <p>${selectedTeam.emoji} ${selectedTeam.name}</p>
      <button class="primary-button" id="confirm-button" type="button">チェックイン！</button>
    </div>`;
    content.querySelector('#confirm-button').addEventListener('click', showSuccess);
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
    document.querySelector('#reset-button').focus();
  }

  function reset() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    selectedTeam = null;
    selectedPerson = null;
    renderTeams();
    document.querySelector('#checkin').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  backButton.addEventListener('click', () => step === 3 ? renderPeople() : renderTeams());
  document.querySelector('#start-button').addEventListener('click', () => document.querySelector('#checkin').scrollIntoView({ behavior: 'smooth', block: 'start' }));
  document.querySelector('#reset-button').addEventListener('click', reset);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !overlay.hidden) reset(); });
  renderTeams();
})();
