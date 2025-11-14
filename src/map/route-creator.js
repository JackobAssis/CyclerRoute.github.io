/**
 * Route Creator
 * Funcionalidades para criar rotas no mapa
 */

import {
  addMarker,
  addPolyline,
  clearDrawing,
  createDefaultIcon,
  createStartIcon,
  createEndIcon,
  removeLayer,
  fitBounds
} from './map-init.js';

import { calculateTotalDistance, formatDistance } from '../utils/distance.js';

let routePoints = [];
let routePolyline = null;
let routeMarkers = [];
let callbacks = {
  onPointsChanged: null,
  onDistanceChanged: null
};

/**
 * Inicializa o criador de rota
 */
export function initRouteCreator() {
  resetRoute();
}

/**
 * Reseta a rota atual
 */
export function resetRoute() {
  routePoints = [];
  routeMarkers = [];
  routePolyline = null;
  clearDrawing();
}

/**
 * Adiciona um ponto à rota
 * @param {Object} point - {lat, lng}
 */
export function addPoint(point) {
  routePoints.push(point);

  // Adiciona marcador
  const icon = routePoints.length === 1 
    ? createStartIcon() 
    : routePoints.length === 2 
      ? createEndIcon()
      : createDefaultIcon();

  const marker = addMarker(point, {
    icon,
    title: `Ponto ${routePoints.length}`
  });

  routeMarkers.push(marker);

  // Redesenha polyline
  redrawPolyline();

  // Callback
  if (callbacks.onPointsChanged) {
    callbacks.onPointsChanged(routePoints.length);
  }

  if (callbacks.onDistanceChanged) {
    const distance = calculateTotalDistance(routePoints);
    callbacks.onDistanceChanged(distance);
  }
}

/**
 * Remove o último ponto
 */
export function removeLastPoint() {
  if (routePoints.length === 0) return;

  routePoints.pop();
  
  const marker = routeMarkers.pop();
  if (marker) {
    removeLayer(marker);
  }

  // Redesenha polyline
  redrawPolyline();

  // Callback
  if (callbacks.onPointsChanged) {
    callbacks.onPointsChanged(routePoints.length);
  }

  if (callbacks.onDistanceChanged) {
    const distance = calculateTotalDistance(routePoints);
    callbacks.onDistanceChanged(distance);
  }
}

/**
 * Redesenha a polyline da rota
 */
function redrawPolyline() {
  // Remove polyline anterior
  if (routePolyline) {
    removeLayer(routePolyline);
  }

  // Desenha nova polyline se tiver 2+ pontos
  if (routePoints.length >= 2) {
    routePolyline = addPolyline(
      routePoints.map(p => [p.lat, p.lng]),
      {
        color: '#1db854',
        weight: 3,
        opacity: 0.8
      }
    );
  }
}

/**
 * Obtém os pontos atuais
 * @returns {Array}
 */
export function getRoutePoints() {
  return [...routePoints];
}

/**
 * Obtém a distância total da rota
 * @returns {number}
 */
export function getRouteDistance() {
  return calculateTotalDistance(routePoints);
}

/**
 * Obtém a distância formatada
 * @returns {string}
 */
export function getRouteDistanceFormatted() {
  return formatDistance(getRouteDistance());
}

/**
 * Verifica se a rota está válida
 * @returns {boolean}
 */
export function isRouteValid() {
  return routePoints.length >= 2;
}

/**
 * Finaliza a rota
 * @returns {Object} Objeto da rota
 */
export function finalizeRoute() {
  if (!isRouteValid()) {
    throw new Error('Rota deve ter pelo menos 2 pontos');
  }

  return {
    points: [...routePoints],
    distance: getRouteDistance(),
    pointsCount: routePoints.length
  };
}

/**
 * Exporta a rota como JSON
 * @returns {string}
 */
export function exportRouteAsJSON() {
  if (!isRouteValid()) {
    throw new Error('Rota deve ter pelo menos 2 pontos');
  }

  const routeData = {
    points: routePoints,
    distance: getRouteDistance(),
    pointsCount: routePoints.length,
    createdAt: new Date().toISOString()
  };

  return JSON.stringify(routeData, null, 2);
}

/**
 * Centraliza o mapa para visualizar a rota
 */
export function centerMapToRoute() {
  if (routePoints.length > 0) {
    fitBounds(routePoints);
  }
}

/**
 * Registra callback para mudanças de pontos
 * @param {Function} callback
 */
export function onPointsChanged(callback) {
  callbacks.onPointsChanged = callback;
}

/**
 * Registra callback para mudanças de distância
 * @param {Function} callback
 */
export function onDistanceChanged(callback) {
  callbacks.onDistanceChanged = callback;
}

/**
 * Obtém informações da rota
 * @returns {Object}
 */
export function getRouteInfo() {
  return {
    pointsCount: routePoints.length,
    distance: getRouteDistance(),
    distanceFormatted: getRouteDistanceFormatted(),
    isValid: isRouteValid(),
    points: [...routePoints]
  };
}

/**
 * Substitui os pontos da rota
 * @param {Array} points - Novos pontos
 */
export function setRoutePoints(points) {
  resetRoute();
  
  for (const point of points) {
    addPoint(point);
  }
}
