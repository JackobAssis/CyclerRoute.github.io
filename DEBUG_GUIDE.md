# 🔍 Guia de Debug - CyclerRoute

## Problema: Botões não respondem aos cliques

---

## ✅ Checklist - Abra o Console do Navegador (F12 → Console)

### 1️⃣ Verificar Inicialização (deve ver isto no console)

```
🚴 CyclerRoute iniciando...
[App] 1/5 - Iniciando PWA setup...
[App] 2/5 - Iniciando conectividade...
[App] 3/5 - Configurando UI event listeners...
[App] 4/5 - Inicializando database...
[App] 5/5 - Initialization complete!
✓ CyclerRoute inicializado com sucesso
```

**Se NÃO vê isto**: App não inicializou. **AÇÃO**: Tire um screenshot do console e envie.

---

### 2️⃣ Verificar Event Listeners

Após 500ms, deve ver:

```
📋 Estado do App:
- Router disponível: object
- UI disponível: object
- RouteStore disponível: object
- MapInit disponível: object
- Home screen: screen active
- Botões encontrados:
  - btn-create-route: true
  - btn-my-routes: true
  - btn-import-route: true
```

**Se algum botão for `false`**: Elemento não existe no HTML. **AÇÃO**: Verifique index.html linha onde deveria ter `<button id="btn-create-route">`.

---

### 3️⃣ Testar no Console Manualmente

Copie e cole CADA comando abaixo no console:

#### Teste 1: Verificar se botão existe
```javascript
document.getElementById('btn-create-route')
```
**Esperado**: `<button id="btn-create-route">...`
**Se `null`**: Elemento não existe

---

#### Teste 2: Verificar se listener foi adicionado
```javascript
document.getElementById('btn-create-route').onclick
```
**Esperado**: `null` ou algo (listeners adicionados com `addEventListener` podem não aparecer, mas funcionar)

---

#### Teste 3: Simular clique manualmente
```javascript
document.getElementById('btn-create-route').click()
```
**Esperado**: Deve aparecer `[App] Click em "Criar Rota"` no console
**Se não aparecer**: Event listener não foi adicionado

---

#### Teste 4: Verificar router
```javascript
console.log(router)
```
**Esperado**: Object com funções (`goToCreateRoute`, `goToRoutesList`, etc)
**Se `undefined`**: Import falhou

---

#### Teste 5: Testar navegação manual
```javascript
router.goToCreateRoute()
```
**Esperado**: Tela muda para "CREATE"
**Se falhar**: Erro no router/ui

---

### 4️⃣ Verificar Service Worker

```javascript
navigator.serviceWorker.controller
```
**Esperado**: `ServiceWorkerContainer {}`
**Se `null`**: SW não ativado (pode estar servindo cached code)

---

### 5️⃣ Limpar Cache e Testar

Se teste manual funciona mas cliques reais não:

1. Abra **DevTools** (F12)
2. Vá em **Application** tab
3. Clique em **Clear site data**
4. Hard refresh: **Ctrl + Shift + R**
5. Teste novamente

---

## 📋 Exemplos de Outputs do Console

### ✅ Cenário Bom (Deve Ver)
```
🚴 CyclerRoute iniciando...
[App] 1/5 - Iniciando PWA setup...
[App] 2/5 - Iniciando conectividade...
[App] 3/5 - Configurando UI event listeners...
✓ btn-create-route listener OK
✓ btn-my-routes listener OK
✓ btn-import-route listener OK
[App] 4/5 - Inicializando database...
[App] 5/5 - Initialization complete!
✓ CyclerRoute inicializado com sucesso

📋 Estado do App:
- Router disponível: object
- UI disponível: object
- RouteStore disponível: object
- MapInit disponível: object
- Home screen: screen active
- Botões encontrados:
  - btn-create-route: true
  - btn-my-routes: true
  - btn-import-route: true

[Clique no botão] 
[App] Click em "Criar Rota"
```

---

### ❌ Cenário Ruim 1 (Elemento não encontrado)
```
🚴 CyclerRoute iniciando...
[App] 1/5 - Iniciando PWA setup...
[App] 2/5 - Iniciando conectividade...
[App] 3/5 - Configurando UI event listeners...
❌ btn-create-route não encontrado!
❌ btn-my-routes não encontrado!
...
```
**Problema**: Elementos no HTML têm IDs diferentes

---

### ❌ Cenário Ruim 2 (Erro durante inicialização)
```
🚴 CyclerRoute iniciando...
[App] 1/5 - Iniciando PWA setup...
[App] 2/5 - Iniciando conectividade...
❌ Erro ao inicializar app: ReferenceError: window.SplashScreen is not defined
Stack: ...
```
**Problema**: Script de splash-screen não carregou

---

## 🎯 Se Tudo Estiver Bem e Mesmo Assim Não Funciona

Teste isto no console:
```javascript
// Verificar CSS
window.getComputedStyle(document.getElementById('screen-home')).display
```
**Esperado**: `"flex"` (ou valor visual equivalente)
**Se `"none"`**: CSS escondendo o botão

---

## 📤 Para Reportar Problema

1. Abra DevTools (F12)
2. Console → Limpe e atualize
3. Tire screenshot do console completo após inicialização
4. Tire screenshot após clicar botão
5. Envie junto com:
   - URL do site
   - Navegador/versão
   - Erros vistos no console

---

## 🚀 Próximos Passos de Debug

Se "Teste 3" funciona mas clique real não:
- [ ] Cache do Service Worker está servindo código antigo
- [ ] CSS há elemento overlay bloqueando clicks
- [ ] Evento propagation está sendo prevenido

**Ação recomendada**: Ctrl+Shift+R para hard refresh + Clear site data
