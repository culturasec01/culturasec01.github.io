# Setup - Artigos Técnicos

Este é um guia completo para configurar e publicar seu site de artigos técnicos.

## 1. Configuração Local

### Pré-requisitos
- Node.js 22.12.0+
- npm ou yarn
- Git

### Instalação

```bash
cd artigos
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Seu site estará disponível em `http://localhost:3000`

## 2. Criar Novos Artigos

Artigos são arquivos Markdown na pasta `src/content/blog/`.

### Template de Artigo

```markdown
---
title: "Título do Artigo"
description: "Descrição breve para SEO e previews"
pubDate: 2026-09-29
updatedDate: 2026-09-29  # Opcional
tags:
  - Security
  - AppSec
  - Web
---

## Seção 1

Seu conteúdo aqui...

### Subseção

Mais conteúdo...

```

### Tags Disponíveis

- Security
- AppSec
- Reverse Engineering
- Kernel
- FreeBSD
- Linux
- CTF
- Vulnerabilidade
- Web
- Malware

### Adicionar Novas Tags

1. Abra `src/consts.ts`
2. Adicione à array `TAGS`:

```typescript
{ name: 'NovaTag', description: 'Descrição da tag' }
```

## 3. Estrutura do Projeto

```
artigos/
├── src/
│   ├── content/
│   │   └── blog/              # Seus artigos (Markdown)
│   │       ├── artigo1.md
│   │       └── artigo2.md
│   ├── components/            # Componentes reutilizáveis
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── FormattedDate.astro
│   ├── layouts/
│   │   └── BlogPost.astro     # Layout para artigos individuais
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   ├── about.astro        # Página sobre
│   │   ├── blog/
│   │   │   ├── index.astro    # Lista de artigos
│   │   │   └── [...slug].astro # Artigo individual
│   │   └── tags/
│   │       ├── index.astro    # Lista de tags
│   │       └── [tag].astro    # Artigos por tag
│   ├── styles/
│   │   └── global.css         # Estilos globais
│   ├── consts.ts              # Configurações site
│   └── content.config.ts      # Configuração de conteúdo
├── public/
│   ├── favicon.svg
│   └── images/                # Suas imagens
├── astro.config.mjs           # Config Astro
├── tailwind.config.mjs        # Config Tailwind
├── package.json
└── README.md
```

## 4. Personalização

### Mudar Informações do Site

Edite `src/consts.ts`:

```typescript
export const SITE_TITLE = 'Artigos Técnicos';
export const SITE_DESCRIPTION = 'Sua descrição aqui';
export const SITE_AUTHOR = 'Seu Nome';
export const SITE_URL = 'https://seu-site.com';
```

### Página About

Edite `src/pages/about.astro` com suas informações.

### Personalizar Visual

O site usa **Tailwind CSS** para estilos. Edite `tailwind.config.mjs` para mudar:
- Cores
- Fontes
- Breakpoints
- Temas

## 5. Build

```bash
npm run build
```

Arquivos compilados ficarão em `dist/`

## 6. Publicação no GitHub

### Primeiro Setup

```bash
# Inicializar git (se ainda não feito)
git init
git add .
git commit -m "Initial article platform"

# Criar repositório no GitHub
# https://github.com/new

# Configurar remote
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/artigos.git
git push -u origin main
```

### Push de Atualizações

```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

## 7. Deploy em Cloudflare Pages

### Via GitHub Integration

1. Acesse https://dash.cloudflare.com/
2. Clique em "Pages"
3. "Create a project" → "Connect to Git"
4. Selecione seu repositório
5. Configure:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Clique "Save and Deploy"

### Domínio Personalizado

1. Em Cloudflare Pages → Seu projeto → Settings
2. "Domains" → "Add Custom Domain"
3. Aponte seu domínio para Cloudflare (atualize NS records)
4. Cloudflare confirmará automaticamente

## 8. Funcionalidades

### Homepage
- Lista os 6 artigos mais recentes
- Link para ver todos os artigos
- Link para explorar tags

### Página de Artigos (`/blog`)
- Lista todos os artigos ordenados por data
- Clicável para ler cada artigo
- Tags do artigo visíveis
- Data de publicação

### Página de Tags (`/tags`)
- Lista todas as tags com contagem de artigos
- Ordenadas por popularidade

### Filtro por Tag (`/tags/[tagname]`)
- Mostra todos os artigos com aquela tag
- Link de volta para lista de tags

### Página Individual (`/blog/[artigo]`)
- Artigo completo em Markdown
- Autor e data
- Tags clicáveis (filtram por tag)
- Navegação de volta

## 9. SEO

O site é otimizado para SEO com:
- Sitemap automático (`sitemap.xml`)
- Meta tags proper
- RSS feed
- URLs amigáveis
- Estrutura semanticamente correta

Acess:
- `https://seu-site.com/sitemap.xml`
- `https://seu-site.com/rss.xml`

## 10. Dark Mode

O site suporta **dark mode automático** baseado nas preferências do sistema.

Controles via CSS variáveis em `src/styles/global.css`.

## 11. Performance

- **Static Generation**: Todo conteúdo é pré-renderizado
- **CDN Global**: Cloudflare Pages distribui globalmente
- **Otimização de Imagens**: Astro otimiza automaticamente
- **Zero JavaScript**: Site funciona sem JS (exceto para interatividade)

## 12. Troubleshooting

### Build falha
```bash
# Limpe cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Site não atualiza após push
- Aguarde 2-3 minutos para deploy completar
- Limpe cache do navegador (Ctrl+Shift+R)
- Verifique logs em Cloudflare Pages Dashboard

### Imagens não carregam
- Coloque imagens em `public/images/`
- Referencia como `/images/nome.jpg`

## 13. Próximos Passos

1. ✅ Instale dependências
2. ✅ Customize `src/consts.ts`
3. ✅ Edite `src/pages/about.astro`
4. ✅ Crie artigos em `src/content/blog/`
5. ✅ Teste localmente com `npm run dev`
6. ✅ Faça push para GitHub
7. ✅ Configure Cloudflare Pages
8. ✅ Aponte domínio personalizado (opcional)

## 14. Recursos

- [Documentação Astro](https://docs.astro.build)
- [Tailwind CSS](https://tailwindcss.com)
- [Markdown Guide](https://www.markdownguide.org)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)

## Support

Para dúvidas:
1. Consulte a documentação oficial
2. Verifique os exemplos de artigos já criados
3. Experimente localmente antes de fazer push

**Divirta-se criando conteúdo técnico de qualidade!** 🚀
