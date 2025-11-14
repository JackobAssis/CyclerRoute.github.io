# 🚀 Guia de Setup do CyclerRoute

## Pré-requisitos

- Navegador moderno (Chrome 80+, Firefox 75+, Edge 79+)
- Servidor HTTP local (PWA requer HTTPS em produção ou localhost)
- Node.js (opcional, para ferramentas)

## Instalação Rápida

### 1. Clonar o Repositório
```bash
git clone <url-do-repositorio>
cd CyclerRoute
```

### 2. Iniciar Servidor Local

**Opção A: Python 3**
```bash
python -m http.server 8000
```

**Opção B: Node.js**
```bash
npx http-server
```

**Opção C: Node.js http-server global**
```bash
npm install -g http-server
http-server
```

**Opção D: VSCode Live Server**
- Instale a extensão "Live Server"
- Clique com direito em index.html
- Selecione "Open with Live Server"

### 3. Abrir no Navegador
```
http://localhost:8000
```

## Instalação do PWA

### Android Chrome/Firefox

1. Abra a app no navegador
2. Clique no menu (⋮) → Instalar app
3. Ou aguarde o prompt de instalação
4. Confirme

### iOS Safari

1. Abra em Safari
2. Clique no ícone Compartilhar (↗️)
3. Selecione "Adicionar à Tela inicial"
4. Nome e confirme

### Desktop (Chrome/Edge)

1. Clique no ícone de instalação (na barra)
2. Selecione onde instalar
3. Confirme

## Verificação de Instalação

### Service Worker
1. DevTools (F12)
2. Application → Service Workers
3. Deve mostrar "cyclerroute" com status "activated"

### IndexedDB
1. DevTools
2. Application → Storage → IndexedDB
3. Deve ter "CyclerRouteDB"

### Manifest
1. DevTools → Application → Manifest
2. Verificar informações do PWA

## Desenvolvimento

### Estrutura de Pastas
```
CyclerRoute/
├── index.html              # UI principal
├── manifest.json           # Configuração PWA
├── service-worker.js       # Cache offline
├── offline.html            # Página offline
├── assets/
│   ├── css/
│   │   └── styles.css      # Estilos
│   └── icons/              # Ícones (gerar)
└── src/
    ├── app.js              # Inicialização
    ├── router.js           # Navegação
    ├── ui.js               # Interface
    ├── config.js           # Configurações
    ├── tests.js            # Testes
    ├── map/
    │   ├── map-init.js     # Leaflet
    │   ├── route-creator.js
    │   └── route-loader.js
    ├── storage/
    │   ├── db.js           # IndexedDB
    │   └── route-store.js  # CRUD
    └── utils/
        └── distance.js     # Cálculos
```

### Editar Código

1. Abra em editor (VSCode recomendado)
2. Abra live server
3. Edite arquivos
4. Navegador recarrega automaticamente

### Debug Console

```javascript
// Testar armazenamento
await testStorage()

// Ver todas as rotas
await window.CyclerRoute.routeStore.getRoutes()

// Navegar
window.CyclerRoute.router.goHome()

// Mostrar notificação
window.CyclerRoute.showToast('Teste', 'success')

// Estatísticas
await window.CyclerRoute.getStats()
```

## Gerar Ícones

### Opção A: Ferramenta Online
1. Acesse https://realfavicongenerator.net/
2. Upload de uma imagem
3. Download do pacote
4. Extraia em `assets/icons/`

### Opção B: Script Local
1. Abra `assets/icons/generate.html`
2. Os ícones serão baixados automaticamente
3. Mova para `assets/icons/`

### Tamanhos Necessários
- icon-192.png (192×192)
- icon-192-maskable.png (192×192, maskable)
- icon-512.png (512×512)
- icon-512-maskable.png (512×512, maskable)

## Deploy em Produção

### Requisitos
1. **HTTPS obrigatório** (PWA requer)
2. **Certificado SSL válido**
3. **Service Worker funcionando**

### Opções de Deploy

#### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Servidor Próprio (Nginx)
```nginx
server {
    listen 443 ssl http2;
    server_name seu-dominio.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/cyclerroute;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache estático
    location ~* \.(js|css|png|jpg|gif|ico|svg|webp)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Não cache o HTML
    location ~* \.(html|json)$ {
        expires -1;
        add_header Cache-Control "public, must-revalidate";
    }
}
```

## Troubleshooting

### Service Worker não registra
- ✅ Abrir em HTTPS ou localhost
- ✅ Verificar console para erros
- ✅ Limpar cache do navegador
- ✅ Hard reload (Ctrl+Shift+R)

### Mapa não carrega
- ✅ Verificar conexão internet (cdn.leaflet)
- ✅ Limpar IndexedDB
- ✅ Verificar console para erros CORS

### Dados não salvam
- ✅ Verificar se IndexedDB está habilitado
- ✅ Verificar limite de storage
- ✅ Limpar dados do site e recarregar

### PWA não instala
- ✅ Usar HTTPS (produção) ou localhost
- ✅ Verificar manifest.json válido
- ✅ Service Worker deve estar ativo

## Performance

### Otimizações Implementadas
- ✅ Cache offline-first
- ✅ Lazy loading de módulos
- ✅ Minification de assets (considere)
- ✅ Compressão Gzip (servidor)

### Dicas Adicionais
- Minifique CSS/JS para produção
- Otimize imagens com webp
- Use compressão Brotli
- Implemente versionamento de cache

## Segurança

### Checklist
- ✅ HTTPS em produção
- ✅ Escape de entrada do usuário
- ✅ Service Worker com versioning
- ✅ Política de segurança de conteúdo (CSP)

### Header Recomendado
```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

## Suporte

### Problemas Comuns

**Q: O app funciona offline?**
A: Sim, totalmente offline após primeira execução.

**Q: Posso usar GPS sem app nativa?**
A: Sim, PWA web tem acesso a GPS (com permissão).

**Q: Dados são sincronizados entre dispositivos?**
A: Não, todos locais. Pode exportar/importar manualmente.

**Q: Como backup rotas?**
A: Use "Exportar" para salvar JSON.

## Licença

MIT - Use livremente