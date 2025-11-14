# 🚀 Deployment no Vercel - CyclerRoute PWA

## Pré-requisitos

- ✅ Git instalado
- ✅ Repositório no GitHub
- ✅ Conta no Vercel (vercel.com)

## Passo 1: Preparar Repositório

```bash
# Certifique-se que está no diretório do projeto
cd d:\Arquivos\ DEV\CyclerRoute

# Verifique se o git já está inicializado
git status

# Se não estiver, inicialize:
# git init

# Configure suas credenciais (se necessário)
# git config user.name "Seu Nome"
# git config user.email "seu@email.com"
```

## Passo 2: Commit Inicial

```bash
# Adicione todos os arquivos
git add .

# Faça commit
git commit -m "Initial commit: CyclerRoute PWA v1.0.0"

# Verifique o status
git status
```

## Passo 3: Push para GitHub

```bash
# Adicione remote (se ainda não existir)
# git remote add origin https://github.com/JackobAssis/CyclerRoute.git

# Envie para GitHub
git push -u origin main
```

## Passo 4: Deploy no Vercel

### Opção A: Via CLI (Recomendado)

```bash
# Instale Vercel CLI
npm install -g vercel

# Faça login
vercel login

# Deploy
vercel

# Siga as instruções:
# - Escolha project name: cyclerroute
# - Escolha project path: ./
# - Override existing project? No (primeira vez)
# - Auto-confirm deployment settings? Yes

# Para produção
vercel --prod
```

### Opção B: Via Website (Mais Fácil)

1. Acesse https://vercel.com
2. Clique em "New Project"
3. Conecte seu repositório GitHub
4. Selecione o repositório "CyclerRoute"
5. Clique em "Import"
6. Configure (vercel.json já faz isso):
   - **Root Directory**: ./
   - **Build Command**: npm run build
   - **Output Directory**: (deixe em branco)
7. Clique "Deploy"

## ✅ Verificação Pós-Deploy

Após deploy bem-sucedido:

```bash
# Verifique a URL fornecida pelo Vercel
# Ex: https://cyclerroute.vercel.app

# Teste as funcionalidades:
- [ ] Abra a URL no navegador
- [ ] Clique em "Criar Rota"
- [ ] Adicione pontos no mapa
- [ ] Salve a rota
- [ ] Teste export/import
- [ ] Teste modo offline
- [ ] Instale como PWA
```

## 🔄 Atualizações Futuras

Depois que o projeto está no Vercel, qualquer push para GitHub automaticamente:

1. Ativa a build no Vercel
2. Roda testes (se configurado)
3. Faz deploy automático

```bash
# Fluxo de atualização:
git add .
git commit -m "Descrição da mudança"
git push origin main

# Vercel detecta e faz deploy automaticamente!
```

## 📋 Arquivos de Configuração

Criados automaticamente para suportar Vercel:

- **vercel.json** - Configuração do deploy
  - Cache headers otimizados
  - Service Worker sem cache
  - Rewrite para index.html
  
- **package.json** - Scripts e metadados
  - Build command
  - Dependencies
  - Engines compatíveis

- **.gitignore** - Arquivos a ignorar
  - Node modules
  - Cache files
  - Logs de debug
  - Variáveis de ambiente

## 🎯 URL de Produção

Após deploy bem-sucedido:

```
https://cyclerroute.vercel.app
```

Ou se customizar domínio:

```
https://seu-dominio.com
```

## 🔒 Variáveis de Ambiente

Se necessário adicionar variáveis no futuro:

1. Acesse Vercel Dashboard
2. Vá para "Settings" > "Environment Variables"
3. Adicione variáveis (se houver)
4. Redeploy automático

Exemplo (não necessário agora):
```
VITE_API_URL=https://api.example.com
```

## 📊 Monitoramento

No dashboard do Vercel você pode:

- ✅ Ver histórico de deploys
- ✅ Visualizar logs
- ✅ Monitorar performance
- ✅ Configurar alertas
- ✅ Integrar com analytics

## 🆘 Troubleshooting

### Erro: "Cannot find module"
```bash
# Limpe cache e rebuild
vercel --prod --force
```

### PWA não instala
- Verifique manifest.json
- Verifique service-worker.js
- Limpe cache do navegador
- Teste em incógnito

### Performance lenta
- Verifique região no Vercel (iad1 é padrão)
- Ative "Edge Functions" se necessário
- Configure CDN em Vercel

### Problema com Service Worker
Edite `vercel.json`:
```json
"headers": [
  {
    "source": "/service-worker.js",
    "headers": [
      {
        "key": "Cache-Control",
        "value": "public, max-age=0, must-revalidate"
      }
    ]
  }
]
```

## 🎉 Próximos Passos

1. Faça deploy
2. Teste em dispositivo móvel
3. Instale como PWA
4. Compartilhe o link
5. Monitore usage no Vercel

## 📝 Comandos Úteis

```bash
# Ver status de deploy
vercel ls

# Ver logs
vercel logs

# Deletar deploy
vercel rm cyclerroute

# Aliases/Domínios
vercel alias

# Confgurações
vercel env ls
```

---

**Dica**: Vercel oferece domínio `.vercel.app` gratuito. Você pode comprar e conectar um domínio customizado depois! 🚀
