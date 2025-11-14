/**
 * Calcula a distância entre dois pontos geográficos usando a fórmula de Haversine
 * @param {number} lat1 - Latitude do ponto 1
 * @param {number} lon1 - Longitude do ponto 1
 * @param {number} lat2 - Latitude do ponto 2
 * @param {number} lon2 - Longitude do ponto 2
 * @returns {number} Distância em quilômetros
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Calcula a distância total de uma rota
 * @param {Array} points - Array de pontos com {lat, lng}
 * @returns {number} Distância total em quilômetros
 */
export function calculateTotalDistance(points) {
  if (!points || points.length < 2) {
    return 0;
  }

  let totalDistance = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const point1 = points[i];
    const point2 = points[i + 1];
    
    const distance = calculateDistance(
      point1.lat,
      point1.lng,
      point2.lat,
      point2.lng
    );
    
    totalDistance += distance;
  }

  return totalDistance;
}

/**
 * Formata distância para string legível
 * @param {number} distance - Distância em quilômetros
 * @returns {string} Distância formatada
 */
export function formatDistance(distance) {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(2)} km`;
}

/**
 * Calcula a progressão na rota
 * @param {Array} points - Array de pontos da rota
 * @param {number} currentIndex - Índice atual do ponto
 * @returns {number} Percentual (0-100)
 */
export function calculateProgress(points, currentIndex) {
  if (!points || points.length === 0) {
    return 0;
  }
  return Math.round((currentIndex / (points.length - 1)) * 100);
}

/**
 * Encontra o ponto mais próximo na rota
 * @param {Array} points - Array de pontos da rota
 * @param {number} userLat - Latitude do usuário
 * @param {number} userLng - Longitude do usuário
 * @returns {number} Índice do ponto mais próximo
 */
export function findNearestPoint(points, userLat, userLng) {
  if (!points || points.length === 0) {
    return 0;
  }

  let nearestIndex = 0;
  let minDistance = Infinity;

  for (let i = 0; i < points.length; i++) {
    const distance = calculateDistance(
      userLat,
      userLng,
      points[i].lat,
      points[i].lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = i;
    }
  }

  return nearestIndex;
}
