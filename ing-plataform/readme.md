# 🏗 ONG Platform - Plataforma Web para Organização Não-Governamental

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Accessibility](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-2E8B57?style=for-the-badge)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

## 📋 Sobre o Projeto

Projeto desenvolvido para a faculdade como trabalho de conclusão da disciplina de Desenvolvimento Front-end para Web. A ONG Platform é uma aplicação web completa para uma organização não-governamental, focada em acessibilidade, responsividade e boas práticas de desenvolvimento.

### 🎯 Objetivos Alcançados

- ✅ *Entrega 1*: Estrutura HTML5 semântica com formulários complexos
- ✅ *Entrega 2*: Sistema de design CSS3 responsivo e componentes modernos
- ✅ *Entrega 3*: JavaScript avançado com validações e SPA básico
- ✅ *Entrega 4*: Acessibilidade WCAG 2.1 AA, otimização e documentação

## 🚀 Funcionalidades

### 🌐 Páginas Principais
- *Página Inicial* (index.html) - Apresentação da ONG e projetos em destaque
- *Projetos Sociais* (projetos.html) - Detalhamento de iniciativas e formas de ajudar
- *Cadastro* (cadastro.html) - Formulário completo para voluntários e doadores

### ♿ Acessibilidade (WCAG 2.1 AA)
- Navegação por teclado completa
- Contraste mínimo de 4.5:1 garantido
- Estrutura semântica HTML5
- Labels ARIA e roles apropriados
- Skip links para leitores de tela
- Suporte a alto contraste

### 📱 Responsividade
- 5 breakpoints otimizados
- Mobile-first approach
- Menu hambúguer responsivo
- Grid system customizado (12 colunas)
- Flexbox para componentes internos

### ⚡ Performance
- CSS e JavaScript minificados
- Lazy loading de imagens
- Otimização para produção
- Build automatizado

## 🛠 Tecnologias Utilizadas

### Frontend
- *HTML5* - Estrutura semântica
- *CSS3* - Variáveis customizadas, Grid, Flexbox
- *JavaScript ES6+* - Modules, Classes, Async/Await

### Ferramentas
- *Git* - Controle de versão com GitFlow
- *GitHub* - Hospedagem e colaboração
- *CleanCSS* - Minificação de CSS
- *UglifyJS* - Minificação de JavaScript

## 📁 Estrutura do Projeto
ong-platform/
├── 📄 index.html              # Página inicial
├── 📄 projetos.html           # Projetos sociais
├── 📄 cadastro.html           # Formulário de cadastro
├── 📂 css/
│   ├── 🎨 style.css           # CSS completo com variáveis
│   └── ⚡ style.min.css       # CSS minificado (25% menor)
├── 📂 js/
│   ├── ⚙ app.js              # Funcionalidades gerais
│   ├── ⚙ app.min.js          # JavaScript minificado
│   ├── ✅ validacao.js        # Validações e máscaras
│   └── ✅ validacao.min.js    # Validações minificadas
├── 📦 package.json            # Configuração e scripts
├── 🔧 build.js                # Script de build automatizado
├── 🖼 optimize-images.js      # Otimizador de imagens
├── 🙈 .gitignore              # Arquivos ignorados pelo Git
└── 📚 README.md               # Esta documentação



## 🎨 Sistema de Design

### Paleta de Cores
| Cor | Uso | Hexadecimal |
|-----|-----|-------------|
| Primary | Botões principais, links | `#3182ce` |
| Secondary | Botões secundários | `#059669` |
| Neutral | Textos, fundos | Escala de cinzas |
| Success | Confirmações | `#38a169` |
| Error | Erros, alertas | `#e53e3e` |

### Tipografia
- **Font Family**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'
- **Hierarquia**: 6 tamanhos (12px - 36px)
- **Line Height**: 1.6 para melhor legibilidade

### Espaçamento
Sistema modular baseado em 8px:
- `8px`, `16px`, `24px`, `32px`, `48px`, `64px`

## ⚙ Scripts de Build

bash
# Instalar dependências (se necessário)
npm install

# Minificar CSS
npm run minify-css

# Minificar JavaScript
npm run minify-js

# Build completo
npm run build

# Deploy (minifica tudo)
npm run deploy


♿ Checklist de Acessibilidade

[X] Navegação

· Skip links implementados
· Navegação por teclado
· Foco visível em todos os elementos
· Ordem lógica de tabulação

[X] Semântica

· Estrutura HTML5 semântica
· Headings hierárquicos
· Roles ARIA apropriados
· Landmarks identificados

[X] Formulários

· Labels associados corretamente
· Mensagens de erro acessíveis
· Validação com feedback
· Agrupamento lógico de campos

[X] Conteúdo

· Contraste 4.5:1 mínimo
· Textos alternativos em imagens
· Títulos descritivos
· Linguagem definida

🌐 Deploy e Hospedagem

O projeto está configurado para deploy em qualquer serviço de hospedagem estática:

· GitHub Pages
· Netlify
· Vercel
· Firebase Hosting

Passos para Deploy:

1. Fazer build do projeto: npm run deploy
2. Fazer upload dos arquivos para o serviço de hospedagem
3. Configurar domínio customizado (opcional)

👥 Estratégia Git/GitFlow

Branches Principais

· main - Produção (versões estáveis)
· develop - Desenvolvimento (integração)

Branches de Funcionalidade

· feature/* - Novas funcionalidades
· hotfix/* - Correções críticas
· release/* - Preparação para produção

Convenção de Commits

· feat: Nova funcionalidade
· fix: Correção de bug
· docs: Documentação
· style: Formatação
· refactor: Refatoração
· test: Testes
· chore: Tarefas de manutenção

📊 Métricas de Performance

Métrica Original Minificado Redução
CSS 28.5 KB 17.1 KB 40%
JavaScript 12.8 KB 7.2 KB 44%
Total 41.3 KB 24.3 KB 41%

🔮 Próximas Melhorias

· Implementar PWA (Progressive Web App)
· Adicionar modo escuro
· Integração com API real
· Sistema de notificações
· Internacionalização (i18n)

📝 Licença

Este projeto foi desenvolvido para fins educacionais como trabalho universitário.

---

Desenvolvido com ❤ para fazer a diferença 🌟

Última atualização: Dezembro 2024


