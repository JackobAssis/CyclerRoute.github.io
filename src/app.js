/**
 * CyclerRoute - PWA para Ciclistas
 * Arquivo principal que inicializa e gerencia todo o app
 */

import * as router from './router.js';
import * as ui from './ui.js';
import * as routeStore from './storage/route-store.js';
import * as mapInit from './map/map-init.js';
import * as routeCreator from './map/route-creator.js';
import * as routeLoader from './map/route-loader.js';
import { formatDistance } from './utils/distance.js';

// ========================================
// ESTADO GLOBAL
// ========================================

let currentRouteId = null;
let deferredPrompt = null;
let isOnline = navigator.onLine;

// ========================================
// INICIALIZAÇÃO
// ========================================

window.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
  console.log('🚴 CyclerRoute iniciando...');

  try {
    // Detecta instalação PWA
    setupPWA();

    // Detecta mudanças de conectividade
    setupConnectivity();

    // Mapeia eventos de UI
    setupUIEventListeners();

    // Inicializa DB
    await routeStore.getRoutes();

    console.log('✓ CyclerRoute inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar app:', error);
    ui.showToast('Erro ao inicializar app', 'error');
  }
}

// ========================================
// PWA SETUP
// ========================================

function setupPWA() {
  // Detecta prompt de instalação
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    ui.setInstallButtonVisible(true);
  });

  // App foi instalada
  window.addEventListener('appinstalled', () => {
    console.log('✓ App instalado');
    deferredPrompt = null;
    ui.setInstallButtonVisible(false);
  });

  // Display mode changed
  window.matchMedia('(display-mode: standalone)').addListener(() => {
    console.log('Display mode mudou');
  });
}

// ========================================
// CONECTIVIDADE
// ========================================

function setupConnectivity() {
  window.addEventListener('online', () => {
    isOnline = true;
    ui.showToast('Conectado à internet', 'success', 2000);
  });

  window.addEventListener('offline', () => {
    isOnline = false;
    ui.showToast('Desconectado da internet', 'warning', 2000);
  });
}

// ========================================
// EVENT LISTENERS - UI
// ========================================

function setupUIEventListeners() {
  // Home Screen
  document.getElementById('btn-create-route')?.addEventListener('click', () => {
    router.goToCreateRoute();
    initCreateRouteScreen();
  });

  document.getElementById('btn-my-routes')?.addEventListener('click', () => {
    router.goToRoutesList();
    initRoutesListScreen();
  });

  document.getElementById('btn-import-route')?.addEventListener('click', handleImportRoute);

  // Create Route Screen
  document.getElementById('btn-back-create')?.addEventListener('click', () => {
    routeCreator.resetRoute();
    mapInit.destroyMap();
    router.goBack();
  });

  document.getElementById('btn-undo-point')?.addEventListener('click', () => {
    routeCreator.removeLastPoint();
  });

  document.getElementById('btn-finish-route')?.addEventListener('click', () => {
    if (routeCreator.isRouteValid()) {
      ui.showModal('dialog-save-route');
      ui.focusElement('input-route-name');
    } else {
      ui.showToast('Adicione pelo menos 2 pontos', 'warning');
    }
  });

  // Save Route Dialog
  document.getElementById('btn-cancel-save')?.addEventListener('click', () => {
    ui.hideModal('dialog-save-route');
  });

  document.getElementById('btn-confirm-save')?.addEventListener('click', handleSaveRoute);

  // Allow Enter key to save
  document.getElementById('input-route-name')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSaveRoute();
    }
  });

  // Routes List Screen
  document.getElementById('btn-back-list')?.addEventListener('click', () => {
    router.goBack();
  });

  // View Route Screen
  document.getElementById('btn-back-view')?.addEventListener('click', () => {
    routeLoader.clearDisplay();
    mapInit.destroyMap();
    router.goBack();
  });

  document.getElementById('btn-navigate-route')?.addEventListener('click', handleStartNavigation);
  document.getElementById('btn-export-route')?.addEventListener('click', handleExportRoute);
  document.getElementById('btn-delete-route')?.addEventListener('click', handleDeleteRoute);

  // Navigate Screen
  document.getElementById('btn-stop-navigate')?.addEventListener('click', () => {
    routeLoader.stopNavigation();
    router.goToViewRoute();
    initViewRouteScreen();
  });

  // Install PWA button
  document.getElementById('install-btn')?.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Resultado instalação: ${outcome}`);
    deferredPrompt = null;
    ui.setInstallButtonVisible(false);
  });
}

// ========================================
// CREATE ROUTE SCREEN
// ========================================

function initCreateRouteScreen() {
  // Inicializa mapa
  mapInit.initMap('map', {
    center: [-23.5505, -46.6333],
    zoom: 13
  });

  // Inicializa criador de rota
  routeCreator.initRouteCreator();

  // Setup callbacks
  routeCreator.onPointsChanged((count) => {
    ui.updatePointsCount(count);
  });

  routeCreator.onDistanceChanged((distance) => {
    ui.updateDistanceDisplay(distance);
  });

  // Click no mapa para adicionar ponto
  mapInit.onMapClick((point) => {
    routeCreator.addPoint(point);
  });

  // Atualiza display
  ui.updatePointsCount(0);
  ui.updateDistanceDisplay(0);
}

// ========================================
// ROUTES LIST SCREEN
// ========================================

async function initRoutesListScreen() {
  try {
    const routes = await routeStore.getRoutes();

    ui.renderRoutesList(routes, async (routeId) => {
      // Carrega rota selecionada
      currentRouteId = routeId;
      const route = await routeStore.getRouteById(routeId);

      // Vai para visualizar
      router.goToViewRoute();
      initViewRouteScreen();
    });
  } catch (error) {
    console.error('Erro ao carregar rotas:', error);
    ui.showToast('Erro ao carregar rotas', 'error');
  }
}

// ========================================
// VIEW ROUTE SCREEN
// ========================================

async function initViewRouteScreen() {
  if (!currentRouteId) {
    router.goBack();
    return;
  }

  try {
    // Carrega rota
    const route = await routeStore.getRouteById(currentRouteId);

    // Renderiza info
    ui.renderRouteInfo(route);

    // Inicializa mapa
    mapInit.initMap('map-view', {
      center: [route.points[0].lat, route.points[0].lng],
      zoom: 13
    });

    // Carrega rota no mapa
    routeLoader.loadRoute(route);
  } catch (error) {
    console.error('Erro ao visualizar rota:', error);
    ui.showToast('Erro ao visualizar rota', 'error');
    router.goBack();
  }
}

// ========================================
// NAVIGATE ROUTE SCREEN
// ========================================

function initNavigateRouteScreen() {
  // Inicializa mapa para navegação
  const route = routeLoader.getDisplayedRoute();
  
  if (!route) {
    router.goBack();
    return;
  }

  mapInit.initMap('map-navigate', {
    center: [route.points[0].lat, route.points[0].lng],
    zoom: 15
  });

  // Carrega rota no mapa
  routeLoader.loadRoute(route);

  // Inicia navegação
  routeLoader.startNavigation({
    onProgressUpdate: (status) => {
      ui.updateNavigationStatus(status);
    },
    onPointReached: (index, point) => {
      console.log(`Chegou ao ponto ${index + 1}`);
      ui.showToast(`Ponto ${index + 1} atingido!`, 'success', 1500);
    },
    onNavigationComplete: () => {
      ui.showToast('Rota concluída!', 'success', 3000);
    },
    onSimulationMode: (enabled) => {
      if (enabled) {
        ui.showToast('Modo teste: clique no mapa para avançar', 'info', 3000);
      }
    }
  });

  // Atualiza UI inicial
  const status = routeLoader.getNavigationStatus();
  if (status) {
    ui.updateNavigationStatus(status);
  }
}

// ========================================
// HANDLERS - CREATE/SAVE ROUTE
// ========================================

async function handleSaveRoute() {
  const routeName = ui.getInputValue('input-route-name');

  if (!routeName) {
    ui.showToast('Digite um nome para a rota', 'warning');
    return;
  }

  if (!routeCreator.isRouteValid()) {
    ui.showToast('Rota inválida', 'error');
    return;
  }

  try {
    const points = routeCreator.getRoutePoints();
    await routeStore.saveRoute(routeName, points);

    ui.hideModal('dialog-save-route');
    ui.clearInput('input-route-name');
    routeCreator.resetRoute();
    mapInit.destroyMap();

    ui.showToast('✓ Rota salva com sucesso', 'success', 2000);
    router.goToRoutesList();
    initRoutesListScreen();
  } catch (error) {
    console.error('Erro ao salvar rota:', error);
    ui.showToast('Erro ao salvar rota', 'error');
  }
}

// ========================================
// HANDLERS - VIEW/NAVIGATE ROUTE
// ========================================

function handleStartNavigation() {
  router.goToNavigate();
  initNavigateRouteScreen();
}

async function handleExportRoute() {
  if (!currentRouteId) return;

  try {
    const json = await routeStore.exportRoute(currentRouteId);
    const route = await routeStore.getRouteById(currentRouteId);
    const filename = `rota-${route.name}-${Date.now()}.json`;

    ui.downloadFile(json, filename, 'application/json');
    ui.showToast('✓ Rota exportada', 'success', 2000);
  } catch (error) {
    console.error('Erro ao exportar:', error);
    ui.showToast('Erro ao exportar rota', 'error');
  }
}

function handleDeleteRoute() {
  if (!currentRouteId) return;

  ui.showConfirmDialog(
    'Deletar Rota',
    'Tem certeza que deseja deletar esta rota?',
    async () => {
      try {
        await routeStore.deleteRouteData(currentRouteId);
        ui.showToast('✓ Rota deletada', 'success', 2000);
        routeLoader.clearDisplay();
        mapInit.destroyMap();
        router.goToRoutesList();
        initRoutesListScreen();
      } catch (error) {
        console.error('Erro ao deletar:', error);
        ui.showToast('Erro ao deletar rota', 'error');
      }
    }
  );
}

// ========================================
// HANDLERS - IMPORT/EXPORT
// ========================================

async function handleImportRoute() {
  try {
    const file = await ui.openFileDialog();
    const content = await ui.readFile(file);
    const imported = await routeStore.importRoutes(content);

    ui.showToast(`✓ ${imported} rota(s) importada(s)`, 'success', 2000);
    router.goToRoutesList();
    initRoutesListScreen();
  } catch (error) {
    console.error('Erro ao importar:', error);
    ui.showToast('Erro ao importar rota: ' + error.message, 'error');
  }
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

window.addEventListener('keydown', (e) => {
  // ESC para voltar
  if (e.key === 'Escape') {
    const currentScreen = router.getCurrentScreen();
    if (currentScreen !== 'screen-home') {
      router.goBack();
    }
  }
});

// ========================================
// RESIZE HANDLER
// ========================================

window.addEventListener('resize', () => {
  mapInit.invalidateSize();
});

// ========================================
// EXPORTS (para debug em console)
// ========================================

window.CyclerRoute = {
  router,
  ui,
  routeStore,
  mapInit,
  routeCreator,
  routeLoader,
  goHome: () => router.goHome(),
  showToast: (msg, type) => ui.showToast(msg, type),
  getStats: () => routeStore.getStatistics()
};

console.log('💡 Use window.CyclerRoute para acessar funções de debug');
