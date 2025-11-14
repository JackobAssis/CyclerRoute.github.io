/**
 * Route Store
 * CRUD completo para gerenciamento de rotas
 */

import {
  readRoute,
  writeRoute,
  updateRoute,
  deleteRoute,
  readAllRoutes,
  exportAllRoutesAsJSON,
  importRoutesFromJSON
} from './db.js';

import { calculateTotalDistance } from '../utils/distance.js';

/**
 * Valida uma rota
 * @param {Object} route - Rota a validar
 * @returns {boolean}
 */
function validateRoute(route) {
  if (!route.name || typeof route.name !== 'string') {
    throw new Error('Nome da rota inválido');
  }

  if (!Array.isArray(route.points) || route.points.length < 2) {
    throw new Error('Rota deve ter pelo menos 2 pontos');
  }

  for (const point of route.points) {
    if (typeof point.lat !== 'number' || typeof point.lng !== 'number') {
      throw new Error('Pontos com coordenadas inválidas');
    }
  }

  return true;
}

/**
 * Calcula dados da rota (distância, etc)
 * @param {Object} route - Rota
 * @returns {Object} Rota com dados calculados
 */
function enrichRoute(route) {
  return {
    ...route,
    distance: calculateTotalDistance(route.points),
    pointsCount: route.points.length,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Salva uma nova rota
 * @param {string} name - Nome da rota
 * @param {Array} points - Array de pontos {lat, lng}
 * @returns {Promise<Object>} Rota salva com ID
 */
export async function saveRoute(name, points) {
  const route = {
    id: Date.now() + Math.random(), // ID único
    name,
    points,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  validateRoute(route);
  const enrichedRoute = enrichRoute(route);

  try {
    await writeRoute(enrichedRoute);
    return enrichedRoute;
  } catch (error) {
    throw new Error('Erro ao salvar rota: ' + error.message);
  }
}

/**
 * Obtém todas as rotas
 * @returns {Promise<Array>}
 */
export async function getRoutes() {
  try {
    const routes = await readAllRoutes();
    // Ordena por data de criação (mais recentes primeiro)
    return routes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    throw new Error('Erro ao obter rotas: ' + error.message);
  }
}

/**
 * Obtém uma rota por ID
 * @param {string} id - ID da rota
 * @returns {Promise<Object>}
 */
export async function getRouteById(id) {
  try {
    const route = await readRoute(id);
    if (!route) {
      throw new Error('Rota não encontrada');
    }
    return route;
  } catch (error) {
    throw new Error('Erro ao obter rota: ' + error.message);
  }
}

/**
 * Atualiza uma rota existente
 * @param {string} id - ID da rota
 * @param {Object} updates - Atualizações {name?, points?}
 * @returns {Promise<Object>}
 */
export async function updateRouteData(id, updates) {
  try {
    const route = await readRoute(id);
    
    if (!route) {
      throw new Error('Rota não encontrada');
    }

    const updatedRoute = {
      ...route,
      ...updates,
      id, // Preserva o ID
      createdAt: route.createdAt // Preserva data de criação
    };

    validateRoute(updatedRoute);
    const enrichedRoute = enrichRoute(updatedRoute);

    await updateRoute(enrichedRoute);
    return enrichedRoute;
  } catch (error) {
    throw new Error('Erro ao atualizar rota: ' + error.message);
  }
}

/**
 * Deleta uma rota
 * @param {string} id - ID da rota
 * @returns {Promise<void>}
 */
export async function deleteRouteData(id) {
  try {
    await deleteRoute(id);
  } catch (error) {
    throw new Error('Erro ao deletar rota: ' + error.message);
  }
}

/**
 * Exporta rota como JSON
 * @param {string} id - ID da rota
 * @returns {Promise<string>}
 */
export async function exportRoute(id) {
  try {
    const route = await readRoute(id);
    if (!route) {
      throw new Error('Rota não encontrada');
    }
    return JSON.stringify(route, null, 2);
  } catch (error) {
    throw new Error('Erro ao exportar rota: ' + error.message);
  }
}

/**
 * Exporta todas as rotas como JSON
 * @returns {Promise<string>}
 */
export async function exportAllRoutes() {
  try {
    return await exportAllRoutesAsJSON();
  } catch (error) {
    throw new Error('Erro ao exportar rotas: ' + error.message);
  }
}

/**
 * Importa uma rota de JSON
 * @param {string} jsonString - String JSON
 * @returns {Promise<Object>}
 */
export async function importRoute(jsonString) {
  try {
    const route = JSON.parse(jsonString);
    validateRoute(route);
    
    // Gera novo ID
    const newRoute = {
      ...route,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString()
    };

    const enrichedRoute = enrichRoute(newRoute);
    await writeRoute(enrichedRoute);
    return enrichedRoute;
  } catch (error) {
    throw new Error('Erro ao importar rota: ' + error.message);
  }
}

/**
 * Importa múltiplas rotas de JSON
 * @param {string} jsonString - String JSON com array de rotas
 * @returns {Promise<number>} Quantidade importada
 */
export async function importRoutes(jsonString) {
  try {
    return await importRoutesFromJSON(jsonString);
  } catch (error) {
    throw new Error('Erro ao importar rotas: ' + error.message);
  }
}

/**
 * Duplica uma rota existente
 * @param {string} id - ID da rota
 * @param {string} newName - Nome para a cópia
 * @returns {Promise<Object>}
 */
export async function duplicateRoute(id, newName) {
  try {
    const route = await readRoute(id);
    if (!route) {
      throw new Error('Rota não encontrada');
    }

    const newRoute = {
      id: Date.now() + Math.random(),
      name: newName || `${route.name} (cópia)`,
      points: [...route.points],
      createdAt: new Date().toISOString()
    };

    const enrichedRoute = enrichRoute(newRoute);
    await writeRoute(enrichedRoute);
    return enrichedRoute;
  } catch (error) {
    throw new Error('Erro ao duplicar rota: ' + error.message);
  }
}

/**
 * Obtém estatísticas gerais
 * @returns {Promise<Object>}
 */
export async function getStatistics() {
  try {
    const routes = await readAllRoutes();
    
    let totalDistance = 0;
    let totalPoints = 0;
    let longestRoute = null;
    let longestDistance = 0;

    for (const route of routes) {
      const distance = route.distance || calculateTotalDistance(route.points);
      totalDistance += distance;
      totalPoints += route.points.length;

      if (distance > longestDistance) {
        longestDistance = distance;
        longestRoute = route.name;
      }
    }

    return {
      totalRoutes: routes.length,
      totalDistance,
      totalPoints,
      longestRoute,
      longestDistance,
      averageDistance: routes.length > 0 ? totalDistance / routes.length : 0
    };
  } catch (error) {
    throw new Error('Erro ao obter estatísticas: ' + error.message);
  }
}
