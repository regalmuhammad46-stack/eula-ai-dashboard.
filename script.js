// Variabel Slideshow
let slideInterval; 
const activeSlideIndex = { home: 0, game: 0, audio: 0, whatsapp: 0, developer: 0 };

// Variabel Tic Tac Toe
let boardModern = ['', '', '', '', '', '', '', '', ''];
let currentPlayerModern = 'X';
let gameActiveModern = true;

// Variabel Typing Text
let typingTimeout; 
const texts = {
  home: "Halo Selamat datang Di Website Eula Ai hehe",
  game: "🎯 Tantang Eula di Tic Tac Toe! Klik kotak untuk mulai main! 🎮",
  audio: "🎵 Putar musik favoritmu sambil eksplorasi fitur Eula AI! 🎶",
  whatsapp: "💬 Hubungi Eula langsung via WhatsApp Bot! Kirim pesan sekarang! 📱",
  developer: "👨‍💻 Regal - Developer keren di balik keajaiban Eula AI! ✨"
};

// Variabel Audio
let isPlaying = false;
const audio = document.getElementById('bgAudio');

// ===== PARTIKEL BERGERAK =====
function createParticles() {
  const particlesBg = document.getElementById('particlesBg');
  for (let i = 0; i < 100; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 25 + 's';
    particle.style.opacity = Math.random() * 0.8 + 0.2;
    particlesBg.appendChild(particle);
  }
}

// ===== SLIDESHOW =====
function getSlideIds(pageId) {
    let slidesWrapperId, indicatorsId;
    if (pageId === 'home') {
        slidesWrapperId = 'slidesWrapper';
        indicatorsId = 'indicatorsHome';
    } else {
        slidesWrapperId = 'slidesWrapper' + pageId.charAt(0).toUpperCase() + pageId.slice(1);
        indicatorsId = 'indicators' + pageId.charAt(0).toUpperCase() + pageId.slice(1);
    }
    return { slidesWrapperId, indicatorsId };
}

function updateSlide(pageId) {
    const { slidesWrapperId, indicatorsId } = getSlideIds(pageId);
    const slidesWrapper = document.getElementById(slidesWrapperId);
    const indicators = document.querySelectorAll('#' + indicatorsId + ' .indicator');
    const currentSlide = activeSlideIndex[pageId];

    if (slidesWrapper) {
        slidesWrapper.style.transform = `translateX(-${currentSlide * 25}%)`;
    }
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(n, wrapperId, indicatorsId) {
    let pageId;
    if (wrapperId === 'slidesWrapper') {
        pageId = 'home';
    } else {
        pageId = wrapperId.replace('slidesWrapper', '').toLowerCase();
    }
    activeSlideIndex[pageId] = n;
    updateSlide(pageId);
    resetAutoSlide(pageId);
}

function nextSlide(pageId) {
    activeSlideIndex[pageId] = (activeSlideIndex[pageId] + 1) % 4;
    updateSlide(pageId);
}

function startAutoSlide(pageId) {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => nextSlide(pageId), 2000);
}

function resetAutoSlide(pageId) {
    startAutoSlide(pageId);
}

// ===== TEKS MENGETIK =====
function typeText(elementId, text) {
  if (typingTimeout) clearTimeout(typingTimeout);
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.textContent = '';
  let charIndex = 0;
  
  function type() {
    if (charIndex < text.length) {
      element.textContent += text.charAt(charIndex);
      charIndex++;
      typingTimeout = setTimeout(type, 50);
    } else {
      typingTimeout = setTimeout(() => {
        element.textContent = '';
        charIndex = 0;
        type();
      }, 3000);
    }
  }
  type();
}

// ===== SIDEBAR & PAGE NAVIGATION =====
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const mainContent = document.getElementById('mainContent');
  const menuButton = document.getElementById('menuButton');
  const audioButton = document.getElementById('audioButton');
  
  sidebar.classList.toggle('open');
  mainContent.classList.toggle('sidebar-open');
  
  if (sidebar.classList.contains('open')) {
    overlay.classList.remove('hidden');
    menuButton.style.display = 'none';
    audioButton.style.display = 'none';
  } else {
    overlay.classList.add('hidden');
    menuButton.style.display = 'block';
    audioButton.style.display = 'block';
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const mainContent = document.getElementById('mainContent');
  const menuButton = document.getElementById('menuButton');
  const audioButton = document.getElementById('audioButton');
  
  sidebar.classList.remove('open');
  mainContent.classList.remove('sidebar-open');
  overlay.classList.add('hidden');
  menuButton.style.display = 'block';
  audioButton.style.display = 'block';
}

function showPage(pageId) {
  document.querySelectorAll('.content-page').forEach(page => {
    page.classList.remove('active');
  });

  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.remove('active');
  });

  document.getElementById(pageId).classList.add('active');
  document.querySelector(`.sidebar-item[onclick="showPage('${pageId}')"]`).classList.add('active'); 

  const titles = {
    'home': 'Beranda',
    'game': 'Tic Tac Toe',
    'audio': 'Audio Player',
    'whatsapp': 'WhatsApp Bot',
    'developer': 'Tentang Developer'
  };
  const pageTitleElement = document.getElementById('pageTitle');
  if (pageTitleElement) {
     pageTitleElement.textContent = titles[pageId];
  }
  
  updateSlide(pageId);
  startAutoSlide(pageId); 

  const typingElementId = 'typingText' + pageId.charAt(0).toUpperCase() + pageId.slice(1);
  if (texts[pageId]) {
    typeText(typingElementId, texts[pageId]);
  }
  
  if (pageId === 'game') {
    initializeGame();
  }
  
  closeSidebar();
}

// ===== AUDIO PLAYER =====
function togglePlay() {
  const audioIcon = document.getElementById('audioIcon');
  const playBtnModern = document.getElementById('playBtnModern');
  
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    audioIcon.className = 'fas fa-music';
    if (playBtnModern) playBtnModern.innerHTML = '<i class="fas fa-play"></i>';
  } else {
    audio.play().catch(e => console.log("Audio play failed:", e));
    isPlaying = true;
    audioIcon.className = 'fas fa-pause';
    if (playBtnModern) playBtnModern.innerHTML = '<i class="fas fa-pause"></i>';
  }
}

function changeVolumeModern(value) {
  audio.volume = value / 100;
}

audio.addEventListener('loadedmetadata', function() {
  const duration = Math.floor(audio.duration);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const durationElement = document.getElementById('durationModern');
  if(durationElement) durationElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

audio.addEventListener('timeupdate', function() {
  const currentTime = Math.floor(audio.currentTime);
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  const currentTimeElement = document.getElementById('currentTimeModern');
  if(currentTimeElement) currentTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
});


// ===== MODAL RESULT =====
function showModal(title, message, iconClass, colorClass) {
    const modal = document.getElementById('gameResultModal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    
    const icon = document.getElementById('modalIcon');
    icon.className = iconClass + ' ' + colorClass;

    modal.style.display = 'flex';
    gameActiveModern = false; // Pastikan game dihentikan
}

function closeModalAndReset() {
    document.getElementById('gameResultModal').style.display = 'none';
    resetGameModern();
}


// ===== TIC TAC TOE LOGIC =====

function initializeGame() {
    const gameGrid = document.getElementById('gameGridModern');
    gameGrid.innerHTML = ''; 
    
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.className = 'game-cell-modern';
      cell.dataset.index = i;
      cell.addEventListener('click', handleCellClick);
      gameGrid.appendChild(cell);
    }
    
    resetGameModern(); 
}

function handleCellClick() {
    const index = parseInt(this.dataset.index);

    if (boardModern[index] === '' && gameActiveModern && currentPlayerModern === 'X') {
        boardModern[index] = 'X';
        this.textContent = 'X';
        this.classList.add('x');
        
        if (checkWinModern('X')) {
            showModal('Kamu Menang! 🎉', 'Selamat, kamu berhasil mengalahkan Eula!', 'fas fa-trophy', 'text-yellow-400');
            return;
        }
        
        if (boardModern.every(cell => cell !== '')) {
            showModal('Seri! 🤝', 'Hasil imbang. Eula terlalu kuat!', 'fas fa-handshake', 'text-gray-400');
            return;
        }
        
        currentPlayerModern = 'O';
        setTimeout(makeAIMoveModern, 500);
    }
}

function resetGameModern() {
  boardModern = ['', '', '', '', '', '', '', '', ''];
  currentPlayerModern = 'X';
  gameActiveModern = true;
  
  const cells = document.querySelectorAll('#gameGridModern .game-cell-modern');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o');
  });
}

function makeAIMoveModern() {
  if (!gameActiveModern) return;
  
  // LOGIKA PELUANG MENANG 20%
  const random = Math.random();
  let move;
  
  if (random < 0.8) { // 80% chance for AI to play smart/best move
    move = getBestMoveModern();
  } else { // 20% chance for AI to play randomly/bad move
    move = getRandomMoveModern();
  }
  
  if (move === undefined || move === null) {
      if (boardModern.every(cell => cell !== '')) {
         showModal('Seri! 🤝', 'Hasil imbang. Eula terlalu kuat!', 'fas fa-handshake', 'text-gray-400');
      }
      return;
  }
  
  boardModern[move] = 'O';
  const cell = document.querySelector(`#gameGridModern [data-index="${move}"]`);
  if (cell) {
    cell.textContent = 'O';
    cell.classList.add('o');
  }
  
  if (checkWinModern('O')) {
    showModal('Eula Menang! 😭', 'Yah, kamu kalah. Coba lagi lain kali!', 'fas fa-robot', 'text-red-400');
    return;
  }
  
  if (boardModern.every(cell => cell !== '')) {
    showModal('Seri! 🤝', 'Hasil imbang. Eula terlalu kuat!', 'fas fa-handshake', 'text-gray-400');
    return;
  }
  
  currentPlayerModern = 'X';
}

// Fungsi getBestMoveModern (AI Pintar)
function getBestMoveModern() {
  const availableMoves = boardModern.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
  if (availableMoves.length === 0) return null;
  
  // 1. Cek apakah AI bisa menang dalam 1 langkah
  for (let move of availableMoves) {
    boardModern[move] = 'O';
    if (checkWinModern('O')) {
      boardModern[move] = '';
      return move;
    }
    boardModern[move] = '';
  }
  
  // 2. Cek apakah harus memblokir pemain
  for (let move of availableMoves) {
    boardModern[move] = 'X';
    if (checkWinModern('X')) {
      boardModern[move] = '';
      return move;
    }
    boardModern[move] = '';
  }
  
  // 3. Ambil tengah
  if (availableMoves.includes(4)) return 4;
  
  // 4. Ambil sudut
  const corners = [0, 2, 6, 8].filter(corner => availableMoves.includes(corner));
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }
  
  // 5. Pindah ke sisi mana pun
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Fungsi getRandomMoveModern (AI Mengalah)
function getRandomMoveModern() {
  const availableMoves = boardModern.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
  if (availableMoves.length === 0) return null;
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function checkWinModern(player) {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  
  return winConditions.some(condition => 
    condition.every(index => boardModern[index] === player)
  );
}

// ===== INITIALIZE (Dijalankan saat halaman dimuat) =====
createParticles();
showPage('home'); 
