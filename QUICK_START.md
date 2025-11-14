# ⚡ Quick Start - CyclerRoute

Começar em 5 minutos!

## 1️⃣ Instalar & Rodar

```bash
# Clone
git clone <url>
cd CyclerRoute

# Inicie servidor (escolha um):
python -m http.server 8000          # Python
npx http-server                     # Node
```

Abra: **http://localhost:8000**

## 2️⃣ Instalar como App

- Clique "Instalar" na barra superior
- Confirme
- Pronto! App em sua tela inicial

## 3️⃣ Usar

### Criar Rota
1. Clique "➕ Criar Rota"
2. Clique no mapa para adicionar pontos
3. Clique "✓ Salvar Rota"

### Ver Rotas
1. Clique "📋 Minhas Rotas"
2. Selecione uma rota
3. Veja no mapa com distância

### Navegar
1. Na rota, clique "🧭 Percorrer"
2. GPS rastreia sua posição
3. App mostra próximo ponto

### Exportar/Importar
- **Exportar**: Botão "📤" na visualização
- **Importar**: Clique "📥 Importar" na home

## 📚 Documentação

- 📖 [README.md](README.md) - Visão geral
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) - Técnico
- 🚀 [SETUP.md](SETUP.md) - Instalação
- 📝 [CHANGELOG.md](CHANGELOG.md) - Histórico

## 🧪 Teste no Console

```javascript
// Ver todas as rotas
await window.CyclerRoute.routeStore.getRoutes()

// Criar rota de teste
await testStorage()

// Mostrar toast
window.CyclerRoute.showToast('Teste!', 'success')

// Ir para home
window.CyclerRoute.router.goHome()
```

## 🔍 Debug

1. Abra DevTools (F12)
2. Vá para **Application**
3. Veja **IndexedDB** → CyclerRouteDB
4. Veja **Service Workers** (deve estar ativo)
5. Veja **Manifest** (PWA info)

## 🎯 Estrutura Rápida

```
CyclerRoute/
├── index.html              # UI
├── manifest.json           # PWA
├── service-worker.js       # Offline
├── src/
│   ├── app.js              # Orquestrador
│   ├── router.js           # Navegação
│   ├── ui.js               # Interface
│   ├── map/                # Mapas
│   ├── storage/            # Dados
│   └── utils/              # Funções
└── assets/
    └── css/
        └── styles.css      # Estilos
```

## ✅ Funcionalidades Principais

✅ Criar rotas no mapa  
✅ Visualizar rotas salvas  
✅ Percorrer com GPS  
✅ Salvar localmente (IndexedDB)  
✅ Exportar/Importar JSON  
✅ Funciona 100% offline  
✅ Instalável como app  
✅ Responsivo mobile-first  

## 🚀 Deploy

### Firebase
```bash
npm i -g firebase-tools
firebase login
firebase init
firebase deploy
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### Vercel
```bash
npm i -g vercel
vercel --prod
```

## 📱 Testar em Dispositivo

1. Inicie servidor local
2. Acesse `http://<seu-ip>:8000`
3. Instale como app
4. Teste funcionalidades

## 🐛 Troubleshooting

**Mapa não carrega?**
→ Verificar internet (Leaflet via CDN)

**Dados não salvam?**
→ Verificar DevTools → Application → Storage

**PWA não instala?**
→ Usar localhost ou HTTPS

**Service Worker erro?**
→ Hard reload: Ctrl+Shift+R

## 💡 Dicas

- Use "Exportar" para backup
- Todos dados são locais (seguro)
- Sem conexão? Tudo funciona offline
- Modo simulação: clique no mapa durante navegação

## 📞 Ajuda

Veja [SETUP.md](SETUP.md) para guia completo.

---

**Pronto!** 🎉 Agora use CyclerRoute para suas rotas de ciclismo!