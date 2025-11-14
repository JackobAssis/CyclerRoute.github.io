/**
 * Splash Screen Component
 * Aparece durante o carregamento do app com animação elegante
 */

function createSplashScreen() {
  const splash = document.createElement('div');
  splash.id = 'splash-screen';
  splash.className = 'splash-screen';
  splash.innerHTML = `
    <div class="splash-content">
      <div class="splash-logo">
        <span class="splash-emoji">🚴</span>
      </div>
      <h1 class="splash-title">CyclerRoute</h1>
      <p class="splash-subtitle">Suas Rotas, Seu Ritmo</p>
      
      <div class="splash-loader">
        <div class="loader-dot"></div>
        <div class="loader-dot"></div>
        <div class="loader-dot"></div>
      </div>
      
      <p class="splash-status">Carregando...</p>
    </div>
  `;

  document.body.insertBefore(splash, document.body.firstChild);
  return splash;
}

function updateSplashStatus(message) {
  const status = document.querySelector('.splash-status');
  if (status) {
    status.textContent = message;
  }
}

function hideSplashScreen() {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    splash.classList.add('fade-out');
    setTimeout(() => {
      if (splash.parentElement) {
        splash.remove();
      }
    }, 400);
  }
}

// Exportar
window.SplashScreen = {
  create: createSplashScreen,
  updateStatus: updateSplashStatus,
  hide: hideSplashScreen
};
