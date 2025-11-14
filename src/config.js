/**
 * Configurações do CyclerRoute
 */

export const CONFIG = {
  // Mapa
  MAP: {
    DEFAULT_CENTER: [-23.5505, -46.6333], // São Paulo
    DEFAULT_ZOOM: 13,
    MIN_ZOOM: 10,
    MAX_ZOOM: 19,
    TILE_PROVIDER: 'cartodb_dark'
  },

  // Banco de dados
  DB: {
    NAME: 'CyclerRouteDB',
    VERSION: 1,
    STORE: 'routes'
  },

  // UI
  UI: {
    TOAST_DURATION: 3000,
    MODAL_ANIMATION_DURATION: 300,
    MAP_PADDING: [50, 50]
  },

  // Rota
  ROUTE: {
    MIN_POINTS: 2,
    DEFAULT_COLOR: '#1db854',
    START_COLOR: '#4CAF50',
    END_COLOR: '#F44336',
    CURRENT_COLOR: '#ffaa00',
    LINE_WEIGHT: 3,
    MARKER_ICON_SIZE: 24
  },

  // GPS
  GPS: {
    ENABLE_HIGH_ACCURACY: true,
    TIMEOUT: 5000,
    MAXIMUM_AGE: 0
  },

  // PWA
  PWA: {
    ENABLED: true,
    CACHE_NAME: 'cyclerroute-v1',
    UPDATE_CHECK_INTERVAL: 24 * 60 * 60 * 1000 // 24 horas
  },

  // Desenvolvimento
  DEBUG: {
    ENABLED: typeof window !== 'undefined' && window.location.hostname === 'localhost',
    LOG_API_CALLS: true,
    LOG_STORAGE: true
  }
};

export default CONFIG;
