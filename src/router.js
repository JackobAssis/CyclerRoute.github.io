/**
 * Router
 * Gerencia navegação entre telas do app
 */

import { showScreen } from './ui.js';

const SCREENS = {
  HOME: 'screen-home',
  CREATE: 'screen-create',
  ROUTES_LIST: 'screen-routes-list',
  VIEW_ROUTE: 'screen-view-route',
  NAVIGATE: 'screen-navigate'
};

let currentScreen = SCREENS.HOME;
let screenHistory = [];

/**
 * Vai para uma tela
 * @param {string} screenName - Nome da tela (chave do objeto SCREENS)
 */
export function goToScreen(screenName) {
  const screenId = SCREENS[screenName];
  
  if (!screenId) {
    console.error(`Tela desconhecida: ${screenName}`);
    return;
  }

  // Adiciona ao histórico
  if (currentScreen !== screenId) {
    screenHistory.push(currentScreen);
  }

  currentScreen = screenId;
  showScreen(screenId);
}

/**
 * Volta para tela anterior
 */
export function goBack() {
  if (screenHistory.length > 0) {
    const previousScreen = screenHistory.pop();
    currentScreen = previousScreen;
    showScreen(previousScreen);
  } else {
    goToScreen('HOME');
  }
}

/**
 * Vai para home
 */
export function goHome() {
  screenHistory = [];
  currentScreen = SCREENS.HOME;
  showScreen(SCREENS.HOME);
}

/**
 * Vai para criar rota
 */
export function goToCreateRoute() {
  goToScreen('CREATE');
}

/**
 * Vai para lista de rotas
 */
export function goToRoutesList() {
  goToScreen('ROUTES_LIST');
}

/**
 * Vai para visualizar rota
 */
export function goToViewRoute() {
  goToScreen('VIEW_ROUTE');
}

/**
 * Vai para navegar rota
 */
export function goToNavigate() {
  goToScreen('NAVIGATE');
}

/**
 * Obtém tela atual
 * @returns {string}
 */
export function getCurrentScreen() {
  return currentScreen;
}

/**
 * Obtém ID da tela
 * @param {string} screenName - Nome da tela
 * @returns {string}
 */
export function getScreenId(screenName) {
  return SCREENS[screenName] || null;
}

/**
 * Verifica se está em tela específica
 * @param {string} screenName - Nome da tela
 * @returns {boolean}
 */
export function isCurrentScreen(screenName) {
  return currentScreen === SCREENS[screenName];
}

/**
 * Limpa histórico
 */
export function clearHistory() {
  screenHistory = [];
}

/**
 * Retorna ao home limpando histórico
 */
export function goToHomeClean() {
  clearHistory();
  goHome();
}
