# Brasilify 🎧🇧🇷

_Sintonize no melhor do rap brasileiro enquanto o seu navegador ganha vida com cores e ritmos...!_

## O que é o Brasilify?

Bem-vindo ao **Brasilify**, o player de música que ninguém sabia que precisava! Este é o lugar onde o rap brasileiro encontra a tecnologia de ponta (ou pelo menos tentamos). Prepare-se para uma experiência musical que vai fazer o seu navegador dançar mais do que você!

**Nota Especial**: Este projeto foi desenvolvido 100% com a utilização do **ChatGPT o1-preview**. Sim, até mesmo este README foi escrito por uma inteligência artificial tentando ser engraçada!

## Características Incríveis (ou nem tanto)

- **Músicas Aleatórias de Rap Brasileiro**: Porque escolher músicas é coisa do passado!
- **Capa do Álbum Dinâmica**: Veja a arte incrível das capas enquanto questiona as escolhas artísticas dos artistas.
- **Background que Muda de Cor**: Sinta-se dentro de um caleidoscópio musical!
- **Controles Básicos**: Play, pause e pular faixa. O suficiente para fingir que temos recursos avançados.
- **Suporte para Usuários Premium e Free**: Se você é premium, ótimo! Se não, aproveite as prévias de 30 segundos (porque somos legais assim).

## Como Usar

1. **Clone o Repositório**

   ```bash
   git clone https://github.com/seu-usuario/brasilify.git
   ```

2. **Navegue até a Pasta do Projeto**

   ```bash
   cd brasilify
   ```

3. **Configure o Spotify**

   - **Crie um Aplicativo no Spotify Developer Dashboard**: Porque burocracia é com a gente mesmo!
     - Acesse: [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
     - Clique em "Create an App" e siga os passos (prometemos que é rápido).
   - **Obtenha o Client ID**: Anote em um post-it e cole na tela do computador.
   - **Configure o Redirect URI**:
     - Adicione `http://localhost:5500/` como Redirect URI nas configurações do app.

4. **Atualize o `app.js`**

   - Abra o arquivo `app.js` e substitua `'SEU_CLIENT_ID_AQUI'` pelo Client ID que você anotou no post-it.

     ```javascript
     const clientId = 'SEU_CLIENT_ID_AQUI';
     ```

5. **Inicie o Servidor Local**

   - Porque abrir o arquivo HTML diretamente é muito mainstream.
   - Use a extensão **Live Server** no VS Code ou qualquer outro servidor que você preferir.

6. **Abra o Brasilify no Navegador**

   - Acesse `http://localhost:5500/` e permita que a mágica aconteça.
   - **Nota**: Você será redirecionado para fazer login no Spotify. Não se preocupe, não vamos roubar suas playlists embaraçosas.

7. **Curta o Som!**

   - Deixe o ritmo te levar enquanto o background muda de cor e você questiona todas as suas decisões de vida.

## Problemas Conhecidos

- **Reprodução Automática Bloqueada**: Se a música não começar sozinha, culpe o navegador e clique no botão Play.
- **Músicas Repetidas**: Estamos trabalhando nisso... ou não.
- **Botão de Faixa Anterior Não Funciona**: É decoração, gostou?
- **Músicas Sobrepostas**: Se duas músicas começarem a tocar juntas, é uma colaboração inesperada! (Mas já corrigimos esse bug, esperamos.)

## Contribuindo

Se você leu até aqui, parabéns! Aceitamos contribuições, estrelas no repositório e até críticas construtivas (mas só as construtivas).

## Licença

Este projeto é 100% livre de licenças porque somos rebeldes sem causa. Mas, falando sério, use como quiser, só não esqueça de nos dar crédito (ou não, tudo bem também).

## Agradecimentos

- **ChatGPT o1-preview**: Por desenvolver este projeto do início ao fim, incluindo este README descontraído.
- **Você**: Por usar este aplicativo e ter paciência com nossos bugs.
- **Café**: Por manter os desenvolvedores acordados (mesmo que sejam virtuais).
- **Nossas Mães**: Por sempre perguntarem se já conseguimos um "emprego de verdade".

---

Espero que este README atenda às suas expectativas e traga um sorriso ao rosto de quem o ler! Se precisar de mais alguma coisa, é só avisar. 🎶