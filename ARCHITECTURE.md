# 🏗️ Arquitetura do CyclerRoute

## Visão Geral

CyclerRoute é um PWA construído com Vanilla JavaScript, sem frameworks. A arquitetura segue um padrão modular com separação clara de responsabilidades.

```
┌─────────────────────────────────────────┐
│          Interface (UI)                 │
│  (HTML + CSS + Event Listeners)         │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│     App Orchestrator (app.js)           │
│  (Gerencia fluxo e inicialização)       │
└──────────────────┬──────────────────────┘
     ┌─────────┬───┴────┬──────────┐
     │         │        │          │
┌────▼──┐ ┌───▼───┐ ┌──▼────┐ ┌──▼──────┐
│ Router│ │ Map   │ │Storage│ │Utils    │
│       │ │ Mgmt  │ │CRUD   │ │Helpers  │
└───────┘ └───────┘ └───────┘ └─────────┘
```

## Módulos

### 1. **app.js** - Orquestrador Principal
Responsabilidades:
- Inicializar a aplicação
- Registrar event listeners
- Gerenciar PWA (beforeinstallprompt, etc)
- Conectar UI com lógica

Fluxo:
```
DOMContentLoaded
    ↓
setupPWA()          → Detecta prompt de instalação
setupConnectivity() → Detecta online/offline
setupUIEventListeners() → Mapeia botões
initializeApp()     → Pronto para uso
```

### 2. **router.js** - Navegação entre Telas
Responsabilidades:
- Controlar qual tela está ativa
- Manter histórico de navegação
- Transições suaves

Telas:
- HOME: Inicial
- CREATE: Criar rota
- ROUTES_LIST: Listar rotas
- VIEW_ROUTE: Visualizar rota
- NAVIGATE: Percorrer rota

### 3. **ui.js** - Gerenciador de UI
Responsabilidades:
- Renderizar listas
- Mostrar/esconder modals
- Notificações (toasts)
- Download/upload de arquivos
- Atualizar elementos DOM

Funcionalidades principais:
```javascript
showScreen(screenId)           // Mostra tela
showModal(modalId)             // Abre modal
renderRoutesList(routes, cb)   // Lista rotas
updatePointsCount(count)       // Atualiza contador
showToast(msg, type)           // Notificação
```

### 4. **map/map-init.js** - Leaflet Manager
Responsabilidades:
- Inicializar Leaflet com tema escuro
- Adicionar marcadores e polylines
- Gerenciar controles do mapa
- Limpar desenhos

API:
```javascript
initMap(containerId, options)
addMarker(latlng, options)
addPolyline(points, options)
fitBounds(points)
onMapClick(callback)
destroyMap()
```

### 5. **map/route-creator.js** - Criador de Rotas
Responsabilidades:
- Gerenciar pontos da rota
- Desenhar polyline
- Validar rota
- Calcular distância em tempo real

Estado:
- `routePoints[]` - Pontos adicionados
- `routeMarkers[]` - Marcadores renderizados
- `routePolyline` - Linha desenhada

### 6. **map/route-loader.js** - Visualizador/Navegador
Responsabilidades:
- Carregar rotas do banco
- Renderizar no mapa
- Gerenciar modo navegação
- Rastrear GPS

Modos:
- **View**: Exibição estática
- **Navigate**: Com GPS (ou simulação)

### 7. **storage/db.js** - IndexedDB Manager
Responsabilidades:
- Operações CRUD no IndexedDB
- Promise wrappers para async/await
- Validação de schema

Operações:
```javascript
openDB()
writeRoute(route)
readRoute(id)
updateRoute(route)
deleteRoute(id)
readAllRoutes()
```

### 8. **storage/route-store.js** - Store de Rotas
Responsabilidades:
- Lógica de negócio para rotas
- Validação
- Enriquecimento de dados
- CRUD completo

Métodos:
```javascript
saveRoute(name, points)
getRoutes()
getRouteById(id)
updateRouteData(id, updates)
deleteRouteData(id)
getStatistics()
```

### 9. **utils/distance.js** - Cálculos Geográficos
Responsabilidades:
- Calcular distâncias (Haversine)
- Progressão em rota
- Encontrar pontos próximos

Funções:
```javascript
calculateDistance(lat1, lon1, lat2, lon2)
calculateTotalDistance(points)
findNearestPoint(points, userLat, userLng)
calculateProgress(points, currentIndex)
```

## Fluxos de Dados

### Criar Rota
```
User clica mapa
    ↓
mapClick event listener (app.js)
    ↓
routeCreator.addPoint()
    ↓
Atualiza UI (pointsCount, distance)
    ↓
User clica "Salvar"
    ↓
Modal solicita nome
    ↓
routeStore.saveRoute()
    ↓
Salva em IndexedDB
    ↓
Toast de sucesso
    ↓
Vai para lista
```

### Percorrer Rota
```
User clica "Percorrer"
    ↓
routeLoader.startNavigation()
    ↓
Solicita permissão GPS
    ↓
watchPosition() começar
    ↓
Cada posição: updateNavigationPosition()
    ↓
Atualiza UI com progresso
    ↓
Detecta pontos atingidos
    ↓
Notifica usuário
```

### Importar Rota
```
User clica "Importar"
    ↓
openFileDialog() abre seletor
    ↓
readFile() lê JSON
    ↓
JSON.parse() converte
    ↓
routeStore.importRoutes()
    ↓
Valida cada rota
    ↓
Salva com novo ID
    ↓
Toast com quantidade
```

## Estado Global

Mantido em `app.js`:
```javascript
currentRouteId      // ID da rota sendo visualizada
deferredPrompt      // PWA install prompt
isOnline            // Status de conectividade
```

## Event Listeners

### Mapa
- `click` → Adiciona ponto (create route)

### UI
- `click` nos botões → Ações
- `keypress Enter` → Submeter formulário

### PWA
- `beforeinstallprompt` → Mostrar botão instalar
- `appinstalled` → Esconder botão

### Conectividade
- `online` → Toast conectado
- `offline` → Toast desconectado

### Keyboard
- `Escape` → Voltar para tela anterior

## Padrões Utilizados

### 1. **Module Pattern** (ES Modules)
```javascript
export function myFunction() { ... }
import { myFunction } from './module.js'
```

### 2. **Observer Pattern** (Callbacks)
```javascript
routeCreator.onPointsChanged((count) => {
  ui.updatePointsCount(count)
})
```

### 3. **Promise Pattern** (Async/Await)
```javascript
const routes = await routeStore.getRoutes()
```

### 4. **Singleton Pattern** (Maps)
```javascript
let mapInstance = null
export function getMap() { return mapInstance }
```

## Performance

### Otimizações
- Lazy loading de módulos
- Eventos delegados quando possível
- Remoção de listeners não utilizados
- Cache de elementos DOM frequentes

### Possíveis Melhorias
- Web Workers para cálculos pesados
- Virtual scrolling para listas grandes
- Code splitting por tela

## Segurança

### Medidas
- Escape de HTML (XSS prevention)
- Validação de entrada
- Sem eval() ou innerHTML dinâmico
- IndexedDB isolado por origin

### Não há
- Servidor backend
- Coleta de dados
- Rastreamento
- Cookies

## Testes

Funções de teste disponíveis em `tests.js`:
```javascript
testStorage()      // Cria e recupera rota
testDistance()     // Valida cálculos
testNavigation()   // Verifica telas
clearTestData()    // Limpa banco
```

Use no console:
```javascript
await testStorage()
```

## Debugging

No console, acesse:
```javascript
window.CyclerRoute.router          // Navegação
window.CyclerRoute.ui              // UI
window.CyclerRoute.routeStore      // Storage
window.CyclerRoute.mapInit         // Mapa
window.CyclerRoute.routeCreator    // Criador
window.CyclerRoute.routeLoader     // Carregador
```

## Extensibilidade

### Para adicionar nova tela:
1. Crie HTML em index.html
2. Adicione em router.js (SCREENS)
3. Crie função init* em app.js
4. Mapeie eventos em setupUIEventListeners()

### Para adicionar novo módulo:
1. Crie arquivo em src/
2. Implemente API clara
3. Exporte no window.CyclerRoute
4. Documente no README

## Versionamento

- **v1.0.0** - Release inicial
- Segue semver para atualizações

## Licença

MIT - Código aberto para todos