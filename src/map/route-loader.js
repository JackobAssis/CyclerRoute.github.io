/**
 * Route Loader
 * Funcionalidades para carregar e visualizar rotas salvas
 */

import {
  addMarker,
  addPolyline,
  addCircle,
  clearDrawing,
  createDefaultIcon,
  createStartIcon,
  createEndIcon,
  createCurrentIcon,
  removeLayer,
  fitBounds,
  getMap
} from './map-init.js';

import { calculateTotalDistance, formatDistance, findNearestPoint } from '../utils/distance.js';

let displayedRoute = null;
let displayedMarkers = [];
let displayedPolyline = null;
let navigationMode = false;
let navigationMarker = null;
let currentPointIndex = 0;
let gpsWatchId = null;

/**
 * Carrega e renderiza uma rota no mapa
 * @param {Object} route - Dados da rota
 */
export function loadRoute(route) {
  if (!route || !route.points || route.points.length < 2) {
    throw new Error('Rota inválida');
  }

  displayedRoute = route;
  clearDrawing();
  displayedMarkers = [];

  // Adiciona marcadores
  route.points.forEach((point, index) => {
    let icon;
    if (index === 0) {
      icon = createStartIcon();
    } else if (index === route.points.length - 1) {
      icon = createEndIcon();
    } else {
      icon = createDefaultIcon();
    }

    const marker = addMarker(point, {
      icon,
      title: `Ponto ${index + 1}`
    });

    displayedMarkers.push(marker);
  });

  // Adiciona polyline
  displayedPolyline = addPolyline(
    route.points.map(p => [p.lat, p.lng]),
    {
      color: '#1db854',
      weight: 3,
      opacity: 0.8
    }
  );

  // Centraliza mapa
  fitBounds(route.points);
}

/**
 * Obtém a rota atualmente exibida
 * @returns {Object}
 */
export function getDisplayedRoute() {
  return displayedRoute;
}

/**
 * Obtém informações da rota exibida
 * @returns {Object}
 */
export function getDisplayedRouteInfo() {
  if (!displayedRoute) return null;

  return {
    name: displayedRoute.name,
    pointsCount: displayedRoute.points.length,
    distance: displayedRoute.distance || calculateTotalDistance(displayedRoute.points),
    distanceFormatted: displayedRoute.distance 
      ? formatDistance(displayedRoute.distance)
      : formatDistance(calculateTotalDistance(displayedRoute.points)),
    createdAt: displayedRoute.createdAt,
    updatedAt: displayedRoute.updatedAt
  };
}

/**
 * Inicia modo navegação
 * @param {Object} callbacks - Callbacks {onProgressUpdate, onPointReached}
 */
export function startNavigation(callbacks = {}) {
  if (!displayedRoute || displayedRoute.points.length < 2) {
    throw new Error('Rota não carregada');
  }

  navigationMode = true;
  currentPointIndex = 0;

  // Redesenha polyline com destaque
  if (displayedPolyline) {
    removeLayer(displayedPolyline);
  }

  displayedPolyline = addPolyline(
    displayedRoute.points.map(p => [p.lat, p.lng]),
    {
      color: '#ffaa00',
      weight: 4,
      opacity: 1,
      dashArray: null
    }
  );

  // Tenta obter localização
  if (navigator.geolocation) {
    gpsWatchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateNavigationPosition(latitude, longitude, callbacks);
      },
      (error) => {
        console.log('Erro ao obter localização:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  } else {
    // Se GPS não disponível, simula com mouse click
    simulateNavigation(callbacks);
  }

  if (callbacks.onNavigationStarted) {
    callbacks.onNavigationStarted();
  }
}

/**
 * Atualiza posição durante navegação
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Object} callbacks - Callbacks
 */
function updateNavigationPosition(lat, lng, callbacks = {}) {
  if (!navigationMode || !displayedRoute) return;

  // Remove marcador anterior
  if (navigationMarker) {
    removeLayer(navigationMarker);
  }

  // Adiciona marcador de posição atual
  navigationMarker = addMarker(
    { lat, lng },
    {
      icon: createCurrentIcon(),
      title: 'Você está aqui'
    }
  );

  // Encontra ponto mais próximo
  const nearestIndex = findNearestPoint(displayedRoute.points, lat, lng);
  
  // Atualiza índice se avançou
  if (nearestIndex > currentPointIndex) {
    currentPointIndex = nearestIndex;
    
    if (callbacks.onPointReached) {
      callbacks.onPointReached(currentPointIndex, displayedRoute.points[currentPointIndex]);
    }
  }

  // Calcula progresso
  const progress = Math.round((currentPointIndex / (displayedRoute.points.length - 1)) * 100);

  if (callbacks.onProgressUpdate) {
    callbacks.onProgressUpdate({
      currentIndex: currentPointIndex,
      totalPoints: displayedRoute.points.length,
      progress,
      nextPoint: displayedRoute.points[Math.min(currentPointIndex + 1, displayedRoute.points.length - 1)]
    });
  }
}

/**
 * Simula navegação (para testes sem GPS)
 * @param {Object} callbacks - Callbacks
 */
function simulateNavigation(callbacks = {}) {
  const map = getMap();
  
  let clickCount = 0;
  
  map.once('click', (event) => {
    updateNavigationPosition(event.latlng.lat, event.latlng.lng, callbacks);
    
    clickCount++;
    if (clickCount < displayedRoute.points.length) {
      simulateNavigation(callbacks);
    } else {
      stopNavigation();
      if (callbacks.onNavigationComplete) {
        callbacks.onNavigationComplete();
      }
    }
  });

  if (callbacks.onSimulationMode) {
    callbacks.onSimulationMode(true);
  }
}

/**
 * Para a navegação
 */
export function stopNavigation() {
  navigationMode = false;

  // Para GPS watch
  if (gpsWatchId !== null) {
    navigator.geolocation.clearWatch(gpsWatchId);
    gpsWatchId = null;
  }

  // Remove marcador de posição
  if (navigationMarker) {
    removeLayer(navigationMarker);
    navigationMarker = null;
  }

  // Redesenha polyline normal
  if (displayedPolyline && displayedRoute) {
    removeLayer(displayedPolyline);
    displayedPolyline = addPolyline(
      displayedRoute.points.map(p => [p.lat, p.lng]),
      {
        color: '#1db854',
        weight: 3,
        opacity: 0.8
      }
    );
  }

  currentPointIndex = 0;
}

/**
 * Verifica se está em modo navegação
 * @returns {boolean}
 */
export function isNavigating() {
  return navigationMode;
}

/**
 * Obtém índice do ponto atual
 * @returns {number}
 */
export function getCurrentPointIndex() {
  return currentPointIndex;
}

/**
 * Obtém o ponto atual
 * @returns {Object}
 */
export function getCurrentPoint() {
  if (!displayedRoute || currentPointIndex >= displayedRoute.points.length) {
    return null;
  }
  return displayedRoute.points[currentPointIndex];
}

/**
 * Obtém próximo ponto
 * @returns {Object}
 */
export function getNextPoint() {
  if (!displayedRoute || currentPointIndex >= displayedRoute.points.length - 1) {
    return null;
  }
  return displayedRoute.points[currentPointIndex + 1];
}

/**
 * Limpa a exibição
 */
export function clearDisplay() {
  stopNavigation();
  clearDrawing();
  displayedRoute = null;
  displayedMarkers = [];
  displayedPolyline = null;
  currentPointIndex = 0;
}

/**
 * Obtém status da navegação
 * @returns {Object}
 */
export function getNavigationStatus() {
  if (!displayedRoute) return null;

  const progress = Math.round((currentPointIndex / (displayedRoute.points.length - 1)) * 100);
  const totalDistance = displayedRoute.distance || calculateTotalDistance(displayedRoute.points);
  const remainingDistance = calculateTotalDistance(
    displayedRoute.points.slice(currentPointIndex)
  );

  return {
    isNavigating: navigationMode,
    currentPointIndex,
    totalPoints: displayedRoute.points.length,
    progress,
    nextPoint: getNextPoint(),
    totalDistance,
    totalDistanceFormatted: formatDistance(totalDistance),
    remainingDistance,
    remainingDistanceFormatted: formatDistance(remainingDistance)
  };
}

/**
 * Alterna modo navegação
 */
export function toggleNavigation(callbacks = {}) {
  if (navigationMode) {
    stopNavigation();
  } else {
    startNavigation(callbacks);
  }
}
