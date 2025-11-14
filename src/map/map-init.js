/**
 * Map Initialization
 * Inicializa e configura o Leaflet com tema escuro e controles minimalistas
 */

let mapInstance = null;
let currentMapContainer = null;

/**
 * Inicializa o mapa Leaflet
 * @param {string} containerId - ID do elemento container
 * @param {Object} options - Opções do mapa
 * @returns {L.Map}
 */
export function initMap(containerId, options = {}) {
  const container = document.getElementById(containerId);
  
  if (!container) {
    throw new Error(`Container ${containerId} não encontrado`);
  }

  // Se já existe um mapa, remove
  if (mapInstance && currentMapContainer === containerId) {
    return mapInstance;
  }

  if (mapInstance) {
    mapInstance.remove();
  }

  currentMapContainer = containerId;

  // Configurações padrão
  const defaultOptions = {
    center: [-23.5505, -46.6333], // São Paulo
    zoom: 13,
    zoomControl: true,
    attributionControl: true,
    preferCanvas: true,
    className: 'dark-map'
  };

  const mapOptions = { ...defaultOptions, ...options };

  // Cria o mapa
  mapInstance = L.map(containerId, mapOptions);

  // Adiciona tile layer (tema escuro com CartoDB)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap | © CartoDB',
    maxZoom: 19,
    minZoom: 10,
    className: 'dark-tiles'
  }).addTo(mapInstance);

  // Customiza controles de zoom
  if (mapInstance.zoomControl) {
    mapInstance.zoomControl.setPosition('bottomright');
  }

  // Adiciona camada para desenho
  mapInstance.drawingLayer = L.featureGroup().addTo(mapInstance);

  return mapInstance;
}

/**
 * Obtém a instância atual do mapa
 * @returns {L.Map}
 */
export function getMap() {
  if (!mapInstance) {
    throw new Error('Mapa não inicializado');
  }
  return mapInstance;
}

/**
 * Define o centro do mapa
 * @param {Array} latlng - [lat, lng]
 * @param {number} zoom - Nível de zoom
 */
export function setMapCenter(latlng, zoom = 13) {
  if (!mapInstance) return;
  mapInstance.setView(latlng, zoom);
}

/**
 * Adiciona listener de clique no mapa
 * @param {Function} callback - Função chamada ao clicar
 */
export function onMapClick(callback) {
  if (!mapInstance) return;
  mapInstance.on('click', (event) => {
    callback({
      lat: event.latlng.lat,
      lng: event.latlng.lng
    });
  });
}

/**
 * Remove listener de clique
 */
export function offMapClick() {
  if (!mapInstance) return;
  mapInstance.off('click');
}

/**
 * Limpa a camada de desenho
 */
export function clearDrawing() {
  if (!mapInstance || !mapInstance.drawingLayer) return;
  mapInstance.drawingLayer.clearLayers();
}

/**
 * Adiciona um marcador no mapa
 * @param {Object} latlng - {lat, lng}
 * @param {Object} options - Opções do marcador
 * @returns {L.Marker}
 */
export function addMarker(latlng, options = {}) {
  if (!mapInstance) return null;

  const defaultOptions = {
    title: options.title || '',
    icon: options.icon || createDefaultIcon()
  };

  const marker = L.marker([latlng.lat, latlng.lng], defaultOptions);
  
  if (mapInstance.drawingLayer) {
    marker.addTo(mapInstance.drawingLayer);
  } else {
    marker.addTo(mapInstance);
  }

  return marker;
}

/**
 * Cria ícone customizado
 * @param {string} color - Cor do ícone
 * @returns {L.Icon}
 */
export function createCustomIcon(color = '#1db854') {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
}

/**
 * Cria ícone padrão
 * @returns {L.Icon}
 */
function createDefaultIcon() {
  return createCustomIcon('#1db854');
}

/**
 * Cria ícone para ponto atual
 * @returns {L.Icon}
 */
export function createCurrentIcon() {
  return createCustomIcon('#ffaa00');
}

/**
 * Cria ícone para início
 * @returns {L.Icon}
 */
export function createStartIcon() {
  return createCustomIcon('#4CAF50');
}

/**
 * Cria ícone para fim
 * @returns {L.Icon}
 */
export function createEndIcon() {
  return createCustomIcon('#F44336');
}

/**
 * Adiciona polyline no mapa
 * @param {Array} points - Array de [lat, lng]
 * @param {Object} options - Opções da polyline
 * @returns {L.Polyline}
 */
export function addPolyline(points, options = {}) {
  if (!mapInstance || points.length < 2) return null;

  const defaultOptions = {
    color: '#1db854',
    weight: 3,
    opacity: 0.8,
    dashArray: null,
    lineCap: 'round',
    lineJoin: 'round'
  };

  const polylineOptions = { ...defaultOptions, ...options };
  const polyline = L.polyline(points, polylineOptions);

  if (mapInstance.drawingLayer) {
    polyline.addTo(mapInstance.drawingLayer);
  } else {
    polyline.addTo(mapInstance);
  }

  return polyline;
}

/**
 * Adiciona círculo (highlight)
 * @param {Object} latlng - {lat, lng}
 * @param {number} radius - Raio em metros
 * @param {Object} options - Opções
 * @returns {L.Circle}
 */
export function addCircle(latlng, radius = 50, options = {}) {
  if (!mapInstance) return null;

  const defaultOptions = {
    color: '#1db854',
    fillColor: '#1db854',
    fillOpacity: 0.1,
    weight: 2
  };

  const circleOptions = { ...defaultOptions, ...options };
  const circle = L.circle([latlng.lat, latlng.lng], radius, circleOptions);

  if (mapInstance.drawingLayer) {
    circle.addTo(mapInstance.drawingLayer);
  } else {
    circle.addTo(mapInstance);
  }

  return circle;
}

/**
 * Ajusta zoom para encaixar pontos
 * @param {Array} points - Array de {lat, lng}
 */
export function fitBounds(points) {
  if (!mapInstance || points.length === 0) return;

  const bounds = L.latLngBounds(
    points.map(p => [p.lat, p.lng])
  );

  mapInstance.fitBounds(bounds, { padding: [50, 50] });
}

/**
 * Remove um elemento do mapa
 * @param {L.Layer} layer - Layer a remover
 */
export function removeLayer(layer) {
  if (!mapInstance || !layer) return;
  mapInstance.removeLayer(layer);
}

/**
 * Obtém centro atual do mapa
 * @returns {Object} {lat, lng}
 */
export function getMapCenter() {
  if (!mapInstance) return null;
  const center = mapInstance.getCenter();
  return { lat: center.lat, lng: center.lng };
}

/**
 * Obtém zoom atual
 * @returns {number}
 */
export function getMapZoom() {
  if (!mapInstance) return 13;
  return mapInstance.getZoom();
}

/**
 * Invalida o tamanho do mapa e redesenha
 */
export function invalidateSize() {
  if (!mapInstance) return;
  setTimeout(() => {
    mapInstance.invalidateSize();
  }, 100);
}

/**
 * Remove o mapa
 */
export function destroyMap() {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
    currentMapContainer = null;
  }
}
