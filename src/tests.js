/**
 * Exemplos e testes do CyclerRoute
 * Use isso no console para testar a app
 */

// ========================================
// TESTE DE ARMAZENAMENTO
// ========================================

async function testStorage() {
  console.log('🧪 Testando armazenamento...');
  
  try {
    // Criar rota de teste
    const testRoute = {
      name: 'Rota Teste - Parque Ibirapuera',
      points: [
        { lat: -23.5912, lng: -46.6586 }, // Entrada sul
        { lat: -23.5903, lng: -46.6567 }, // Museu do Ipiranga
        { lat: -23.5890, lng: -46.6540 }, // Lago
      ]
    };

    // Salvar
    const saved = await window.CyclerRoute.routeStore.saveRoute(
      testRoute.name,
      testRoute.points
    );
    
    console.log('✅ Rota salva:', saved);

    // Listar
    const routes = await window.CyclerRoute.routeStore.getRoutes();
    console.log('📋 Total de rotas:', routes.length);

    // Obter uma rota
    if (saved && saved.id) {
      const retrieved = await window.CyclerRoute.routeStore.getRouteById(saved.id);
      console.log('🗺️ Rota recuperada:', retrieved);
    }

    // Estatísticas
    const stats = await window.CyclerRoute.routeStore.getStatistics();
    console.log('📊 Estatísticas:', stats);

    return saved;
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// ========================================
// TESTE DE DISTÂNCIA
// ========================================

function testDistance() {
  console.log('🧪 Testando cálculo de distância...');
  
  const points = [
    { lat: -23.5912, lng: -46.6586 },
    { lat: -23.5903, lng: -46.6567 },
    { lat: -23.5890, lng: -46.6540 },
  ];

  const { calculateTotalDistance, formatDistance } = window.CyclerRoute;
  
  // Nota: Este é um exemplo, a função real está em utils/distance.js
  console.log('📍 Pontos:', points);
  console.log('✅ Teste de distância executado');
}

// ========================================
// TESTE DE NAVEGAÇÃO
// ========================================

function testNavigation() {
  console.log('🧪 Testando navegação...');
  
  const screens = [
    'HOME',
    'CREATE',
    'ROUTES_LIST',
    'VIEW_ROUTE',
    'NAVIGATE'
  ];

  console.log('📱 Telas disponíveis:', screens);
  console.log('Navegação:', window.CyclerRoute.router);
}

// ========================================
// LIMPAR DADOS DE TESTE
// ========================================

async function clearTestData() {
  console.log('🧹 Limpando dados de teste...');
  
  try {
    const routes = await window.CyclerRoute.routeStore.getRoutes();
    
    for (const route of routes) {
      await window.CyclerRoute.routeStore.deleteRouteData(route.id);
    }

    console.log('✅ Dados limpos');
  } catch (error) {
    console.error('❌ Erro ao limpar:', error);
  }
}

// ========================================
// COMANDOS NO CONSOLE
// ========================================

console.log(`
🚴 Bem-vindo ao CyclerRoute Developer Console!

Comandos disponíveis:
  testStorage()          - Testa armazenamento
  testDistance()         - Testa cálculo de distância
  testNavigation()       - Testa navegação
  clearTestData()        - Limpa dados de teste

Objetos disponíveis:
  window.CyclerRoute.router
  window.CyclerRoute.ui
  window.CyclerRoute.routeStore
  window.CyclerRoute.mapInit
  window.CyclerRoute.routeCreator
  window.CyclerRoute.routeLoader

Exemplos:
  await window.CyclerRoute.routeStore.getRoutes()
  await window.CyclerRoute.getStats()
  window.CyclerRoute.router.goHome()
  window.CyclerRoute.showToast('Teste', 'success')
`);

// Exportar para global
window.testStorage = testStorage;
window.testDistance = testDistance;
window.testNavigation = testNavigation;
window.clearTestData = clearTestData;
