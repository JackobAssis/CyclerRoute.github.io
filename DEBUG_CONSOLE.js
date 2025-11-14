/**
 * DEBUG_CONSOLE.js
 * Cole isto no console do navegador para testar tudo rapidamente
 */

console.clear();
console.log('🔧 CyclerRoute Debug Toolkit Carregado\n');

// ============================================
// TESTE RÁPIDO DE TUDO
// ============================================

window.CyclerRouteDebug = {
  
  // 1. Verificar elementos
  checkElements: () => {
    console.group('✅ Verificando Elementos DOM');
    const elements = {
      'btn-create-route': '#btn-create-route',
      'btn-my-routes': '#btn-my-routes',
      'btn-import-route': '#btn-import-route',
      'screen-home': '#screen-home',
      'screen-create': '#screen-create',
      'screen-routes-list': '#screen-routes-list',
    };
    
    for (const [name, selector] of Object.entries(elements)) {
      const el = document.querySelector(selector);
      const status = el ? '✓' : '❌';
      console.log(`${status} ${name}: ${selector}`, el);
    }
    console.groupEnd();
  },

  // 2. Verificar módulos
  checkModules: () => {
    console.group('✅ Verificando Módulos');
    console.log('router:', typeof router !== 'undefined' ? '✓' : '❌');
    console.log('ui:', typeof ui !== 'undefined' ? '✓' : '❌');
    console.log('routeStore:', typeof routeStore !== 'undefined' ? '✓' : '❌');
    console.log('mapInit:', typeof mapInit !== 'undefined' ? '✓' : '❌');
    console.groupEnd();
  },

  // 3. Simular click
  simulateClick: (buttonId) => {
    console.group(`🖱️ Simulando click em ${buttonId}`);
    const btn = document.getElementById(buttonId);
    if (!btn) {
      console.error(`❌ Botão ${buttonId} não encontrado`);
      console.groupEnd();
      return;
    }
    console.log('Elemento encontrado:', btn);
    console.log('Disparando click...');
    btn.click();
    console.log('Click disparado');
    console.groupEnd();
  },

  // 4. Testar navegação manual
  testNavigation: (screen) => {
    console.group(`📍 Testando navegação para ${screen}`);
    try {
      router.goToScreen(screen);
      console.log(`✓ Navegou para ${screen}`);
    } catch (error) {
      console.error('❌ Erro:', error);
    }
    console.groupEnd();
  },

  // 5. Verificar CSS
  checkCSS: () => {
    console.group('🎨 Verificando CSS');
    const homeScreen = document.getElementById('screen-home');
    if (homeScreen) {
      const styles = window.getComputedStyle(homeScreen);
      console.log('screen-home display:', styles.display);
      console.log('screen-home visibility:', styles.visibility);
      console.log('Classes:', homeScreen.className);
    }
    console.groupEnd();
  },

  // 6. Verificar SW
  checkServiceWorker: () => {
    console.group('⚙️ Verificando Service Worker');
    navigator.serviceWorker.getRegistrations().then(regs => {
      console.log('Registrations:', regs);
      if (regs.length > 0) {
        console.log('✓ SW registrado');
        console.log('Controller:', navigator.serviceWorker.controller);
      } else {
        console.log('❌ Nenhum SW registrado');
      }
    });
    console.groupEnd();
  },

  // 7. Test completo
  runFullTest: () => {
    console.log('\n🚀 EXECUTANDO TESTE COMPLETO\n');
    window.CyclerRouteDebug.checkElements();
    window.CyclerRouteDebug.checkModules();
    window.CyclerRouteDebug.checkCSS();
    window.CyclerRouteDebug.checkServiceWorker();
    console.log('\n✅ Teste completo terminado\n');
  }
};

console.log('📖 Use:');
console.log('  window.CyclerRouteDebug.runFullTest() - Teste completo');
console.log('  window.CyclerRouteDebug.checkElements() - Verificar elementos');
console.log('  window.CyclerRouteDebug.checkModules() - Verificar módulos');
console.log('  window.CyclerRouteDebug.checkCSS() - Verificar CSS');
console.log('  window.CyclerRouteDebug.simulateClick("btn-create-route") - Simular click');
console.log('  window.CyclerRouteDebug.testNavigation("CREATE") - Testar navegação');
console.log('\n');
