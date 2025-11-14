/**
 * Version Manager + Update Notifier
 * Detecta quando app foi atualizado e notifica usuário
 */

const APP_VERSION = '1.0.0';
const VERSION_KEY = 'cyclerroute_version';
const UPDATE_CHECK_INTERVAL = 60000; // 1 minuto

// Salva versão atual
function saveCurrentVersion() {
  try {
    localStorage.setItem(VERSION_KEY, APP_VERSION);
  } catch (e) {
    console.warn('[VersionManager] Erro ao salvar versão:', e);
  }
}

// Obtém versão anterior
function getPreviousVersion() {
  try {
    return localStorage.getItem(VERSION_KEY);
  } catch (e) {
    console.warn('[VersionManager] Erro ao obter versão anterior:', e);
    return null;
  }
}

// Verifica se app foi atualizado
function checkForUpdate() {
  const previousVersion = getPreviousVersion();

  if (!previousVersion) {
    // Primeira visita
    saveCurrentVersion();
    console.log('[VersionManager] Primeira visita, versão:', APP_VERSION);
    return false;
  }

  if (previousVersion !== APP_VERSION) {
    console.log(`[VersionManager] Atualização detectada: ${previousVersion} → ${APP_VERSION}`);
    saveCurrentVersion();
    return true;
  }

  return false;
}

// Mostra notificação de atualização
function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.className = 'update-notification';
  notification.innerHTML = `
    <div class="update-content">
      <div class="update-message">
        <span class="update-icon">🎉</span>
        <div class="update-text">
          <strong>CyclerRoute Atualizado!</strong>
          <p>Novas features e melhorias disponíveis</p>
        </div>
      </div>
      <button class="btn-update-close" onclick="this.parentElement.parentElement.remove()">✕</button>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto-remove após 8 segundos
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }, 8000);
}

// Função pública para forçar refresh
window.CyclerRouteUpdateApp = function() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SKIP_WAITING'
    });

    navigator.serviceWorker.oncontrollerchange = () => {
      window.location.reload();
    };
  } else {
    window.location.reload();
  }
};

// Inicializa
window.addEventListener('load', () => {
  const wasUpdated = checkForUpdate();

  if (wasUpdated) {
    showUpdateNotification();
  }

  // Monitora Service Worker para atualizações
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[VersionManager] Service Worker atualizado');
      // Opcional: mostrar notificação quando SW muda
    });
  }
});

// Exportar para uso global
window.VersionManager = {
  version: APP_VERSION,
  checkForUpdate,
  showUpdateNotification
};
