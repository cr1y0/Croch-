# Rangel Luxo — Landing Page Oficial

Landing page de alta conversão, performance e segurança desenvolvida para a marca **“Rangel Luxo”**, atelier especializado em mesa posta sofisticada, sousplats rendados e trilhos de mesa florais em crochê manual de luxo com plaqueta metálica gravada (*Rangel Handmade*).

---

## ✨ Novos Recursos & Inspiração Imaterial (Mobile-First)

1. **Menu Mobile Totalmente Nítido (Zero Blur)**:
   - Resolução definitiva do problema de embaçamento ao abrir no celular.
   - O menu foi reestruturado de forma **mobile-first**, isolado da cascata do header e renderizado com fundo sólido `#FFFFFF`, área de toque otimizada (≥ 44-48px) e zero artefatos de `backdrop-filter`.
   - Incorporação de barra de busca instantânea dentro do próprio drawer e atalhos rápidos para encomenda e carrinho.
2. **Hero Visual com Animação Fluída & Leve**:
   - Imagem principal com moldura nobre em gradiente dourado, perfeitamente enquadrada e com animação orgânica suave (`@keyframes heroGentleFloat`).
3. **Box Banners de Categorias Curadas**:
   - Destaques visuais interativos para Sousplats Prime, Trilhos 3D, Coleções Coordenadas e Projetos Sob Medida.
4. **Barra de Filtros e Busca Dinâmica no Catálogo**:
   - Abas por categoria (*Todas as Peças*, *Sousplats*, *Trilhos 3D*, *Coleções*) com contadores dinâmicos e campo de busca rápida em tempo real.
5. **Manifesto do Artesanato de Luxo (*Slow Design*)**:
   - Seção editorial inspirada na filosofia artesanal da Imaterial (*"Não basta ser artesanal: é preciso ter alma, técnica e sofisticação"*).
6. **Tipografia Nobre**:
   - Combinação de *Cormorant Garamond* (serifa editorial para toques de alta costura) com *Poppins* (sans-serif moderna para clareza em dispositivos móveis).
7. **Carrinho de Compras Interativo & Painel Admin**:
   - Gaveta lateral (*Slide-over Cart Drawer*), autenticação de clientes e administradora (`admin@rangeluxo.com.br` / `admin`) e gestão de pedidos.

---

## 🔒 Segurança Front-End Rigorosa

- **Content-Security-Policy (CSP)** estrita configurada em HTML, `_headers` e `vercel.json` (incluindo permissão de conexões seguras ao Supabase).
- **Honeypot Anti-Spam** e **Rate Limiting** de 30 segundos no envio de encomendas.
- **Higienização completa contra ataques XSS** em todos os formulários.
- Código 100% Vanilla JS sem dependências pesadas de terceiros.

---

## 🗄️ Integração com Banco de Dados em Nuvem (Supabase)

A landing page possui suporte nativo e híbrido ao **Supabase Cloud Database**:

1. **Estrutura das Tabelas**:
   - `orders`: Recebe pedidos do carrinho, solicitações de encomendas de peças e formulários de contato em tempo real.
   - `clients`: Registra novos clientes e perfis de acesso.
2. **Script de Criação Rápida**:
   - O arquivo [`supabase-setup.sql`](supabase-setup.sql) contém todo o SQL necessário com regras de segurança de nível de linha (*Row Level Security - RLS*).
3. **Configuração Simples**:
   - **Opção A (Pelo Painel Admin)**: Faça login no site como administradora (`admin@rangeluxo.com.br` / senha `admin`), abra o painel administrativo, clique em **"Configurar Conexão"**, insira sua *Project URL* e *Anon Public Key* e clique em **Salvar & Testar**.
   - **Opção B (No código)**: Insira as chaves em `DEFAULT_CONFIG` no arquivo [`js/supabase.js`](js/supabase.js).
4. **Tolerância a Falhas & Modo Offline**:
   - Se o Supabase estiver desconectado ou o visitante estiver sem internet, o sistema grava automaticamente no `localStorage` local e sincroniza assim que a conexão for reestabelecida.

---

## 📱 Progressive Web App (PWA) & Empacotamento em APK (TWA)

A aplicação foi convertida em uma **PWA completa, 100% instalável e em conformidade estrita com o padrão Trusted Web Activity (TWA)**, permitindo gerar um arquivo **APK/AAB nativo para Android** publicável na Google Play Store.

### 📁 Arquivos do Ecossistema PWA
- [`manifest.json`](manifest.json): Manifesto com dados de identificação, ícones (incluindo versões maskable com safe zone), shortcuts para telas principais, screenshots e cores de tema.
- [`sw.js`](sw.js): Service Worker com estratégias avançadas de cache:
  - **Network First** para páginas HTML com fallback para [`offline.html`](offline.html);
  - **Cache First / Stale-While-Revalidate** para assets estáticos (CSS, JS, imagens, fontes);
  - **Bypass seguro** para chamadas de API do Supabase e métodos POST/PUT/DELETE.
- [`offline.html`](offline.html): Página offline temática e elegante, com botão interativo para reconectar e link direto para WhatsApp e telefone do Atelier.
- [`js/pwa.js`](js/pwa.js): Gerenciador do evento `beforeinstallprompt`, detecção de modo `standalone`, barra inferior mobile e notificações toast.
- [`.well-known/assetlinks.json`](.well-known/assetlinks.json): Arquivo de Digital Asset Links para remoção da barra de URL do navegador no APK nativo.
- `assets/icons/`: Conjunto completo de ícones (`16x16`, `32x32`, `72x72`, `96x96`, `128x128`, `144x144`, `152x152`, `180x180`, `192x192`, `384x384`, `512x512`, `maskable-icon-192`, `maskable-icon-512` e screenshots para a prompt rica de instalação).

---

### 🚀 Como Gerar o APK Real

#### Opção 1: Via PWABuilder (Método Mais Rápido & Fácil)
1. Publique seu site em um domínio HTTPS com certificado SSL ativo (ex: Vercel, Netlify, Cloudflare Pages ou domínio próprio `https://rangeluxocroche.com.br`).
2. Acesse [pwabuilder.com](https://www.pwabuilder.com/).
3. Digite a URL do seu site e clique em **"Start"**.
4. O PWABuilder analisará o `manifest.json`, `sw.js`, segurança e ícones (a pontuação será máxima).
5. Clique em **"Package for Stores"** e selecione **"Android"**.
6. Preencha as informações do app:
   - **Package ID**: `com.rangeluxocroche.app`
   - **App Name**: `Rangel Luxo Crochê`
   - **Launcher Name**: `Rangel Crochê`
   - **Theme color**: `#8C533E`
7. Clique em **"Generate Package"**.
8. Baixe o pacote `.zip`. Nele você terá:
   - O arquivo `.apk` pronto para instalar diretamente no celular (modo sideload/testes);
   - O arquivo `.aab` (Android App Bundle) pronto para envio à Google Play Store;
   - As chaves de assinatura e a instrução para o arquivo `.well-known/assetlinks.json`.

---

#### Opção 2: Via Bubblewrap CLI (Método Oficial do Google - Linha de Comando)

Para desenvolvedores que desejam controle total sobre a compilação e assinatura:

1. **Pré-requisitos**:
   - Node.js instalado (v16+)
   - Java Development Kit (JDK 17 ou 21)
   - Android SDK Command-line Tools

2. **Instalação do Bubblewrap**:
   ```bash
   npm i -g @bubblewrap/cli
   ```

3. **Inicialização do Projeto TWA**:
   ```bash
   bubblewrap init --manifest https://rangeluxocroche.com.br/manifest.json
   ```
   O Bubblewrap irá baixar o `manifest.json`, validar todos os ícones e criar um arquivo `twa-manifest.json`.

4. **Compilação do APK e AAB**:
   ```bash
   bubblewrap build
   ```
   Será gerado um arquivo de keystore (`android.keystore`) e os binários `app-release-signed.apk` e `app-release-bundle.aab`.

5. **Configuração do Digital Asset Links**:
   Copie a impressão digital SHA256 exibida pelo Bubblewrap no terminal e cole dentro de [`.well-known/assetlinks.json`](.well-known/assetlinks.json). Em seguida, envie para o seu servidor. Isso remove completamente a barra de URL do Chrome no Android!

---

### 🧪 Como Testar a Instalação

#### No Computador (Google Chrome / Edge):
1. Execute um servidor local ou abra o site em HTTPS.
2. Pressione `F12` para abrir o **DevTools**.
3. Vá na aba **Application** (ou Aplicação):
   - Em **Manifest**: Confira se o nome, ícones e cores aparecem sem erros;
   - Em **Service Workers**: Verifique se o `sw.js` está com status `Activated and is running`;
4. Clique no ícone de computador com seta para baixo na barra de endereço do navegador ("Instalar aplicativo") ou clique no botão **"Instalar App"** no banner da página.
5. O aplicativo se abrirá em uma janela própria, sem barra de navegação de navegador.

#### No Celular (Android / iOS):
- **Android (Chrome)**: Acesse a URL do site. O banner nobre de instalação do Rangel Luxo aparecerá no topo ou na barra inferior. Clique em "Instalar App". O ícone com o emblema dourado será criado na sua gaveta de aplicativos.
- **iPhone (Safari)**: Toque no botão de compartilhamento (ícone com quadrado e seta para cima) e selecione **"Adicionar à Tela de Início"**. O app responderá em modo standalone nativo.



