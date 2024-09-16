// Variáveis Globais
let accessToken = null;
let player = null;
let currentTrack = null;
let isPlaying = false;
let audioPreview = null;
let deviceId = null;
let playedTracks = []; // Histórico de músicas tocadas

// Definir o Client ID diretamente no código
const clientId = 'SEU_CLIENT_ID_AQUI'; // Substitua pelo seu Client ID
const redirectUri = 'http://localhost:5500/'; // Certifique-se de que este URI está registrado no Spotify

// Função para obter o token de acesso do URL
function getAccessToken() {
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');
    return token;
  }
  return null;
}

// Função de Autenticação
function authorize() {
  const scopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'streaming',
  ];
  const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(
    scopes.join(' ')
  )}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  window.location.href = authUrl;
}

// Inicialização ao Carregar a Página
window.onload = async () => {
  accessToken = getAccessToken();
  if (accessToken) {
    document.getElementById('player').style.display = 'block';
    await initializePlayer();
  } else {
    // Se não houver token, iniciar o processo de autenticação
    authorize();
  }
};

// Função para Inicializar o Player
async function initializePlayer() {
  // Configurar os botões de controle
  setupEventListeners();

  // Obter uma faixa aleatória
  currentTrack = await getRandomTrack();
  updateUI(currentTrack);
}

// Definir window.onSpotifyWebPlaybackSDKReady fora de qualquer função
window.onSpotifyWebPlaybackSDKReady = () => {
  const token = accessToken;
  player = new Spotify.Player({
    name: 'Brasilify Player',
    getOAuthToken: (cb) => {
      cb(token);
    },
  });

  // Listener para erros
  player.addListener('initialization_error', ({ message }) => {
    console.error(message);
  });
  player.addListener('authentication_error', ({ message }) => {
    console.error(message);
  });
  player.addListener('account_error', ({ message }) => {
    console.error(message);
  });
  player.addListener('playback_error', ({ message }) => {
    console.error(message);
  });

  // Listener para quando o player estiver pronto
  player.addListener('ready', async ({ device_id }) => {
    console.log('Player está pronto com Device ID', device_id);
    deviceId = device_id;

    // Transferir a reprodução para o novo dispositivo
    await fetch(`https://api.spotify.com/v1/me/player`, {
      method: 'PUT',
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    // Tentar reproduzir a faixa automaticamente
    playTrack(currentTrack);
  });

  // Conectar o player
  player.connect();
};

// Função para Buscar uma Faixa Aleatória de Rap Brasileiro
async function getRandomTrack() {
  // Primeiro, obter o número total de resultados
  const totalResponse = await fetch(
    `https://api.spotify.com/v1/search?q=genre:%22rap%20brasileiro%22&type=track&market=BR&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const totalData = await totalResponse.json();
  const totalTracks = Math.min(totalData.tracks.total, 10000); // Limite máximo de 10.000

  // Gerar um offset aleatório
  const limit = 50;
  const maxOffset = Math.max(totalTracks - limit, 0);
  const randomOffset = Math.floor(Math.random() * (maxOffset + 1));

  // Fazer a requisição com o offset aleatório
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=genre:%22rap%20brasileiro%22&type=track&market=BR&limit=${limit}&offset=${randomOffset}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  let tracks = data.tracks.items;

  // Filtrar as faixas já tocadas
  tracks = tracks.filter((track) => !playedTracks.includes(track.id));

  // Se todas as músicas já foram tocadas, resetar o histórico
  if (tracks.length === 0) {
    playedTracks = [];
    return getRandomTrack(); // Chamar a função novamente
  }

  // Selecionar uma faixa aleatória do conjunto obtido
  const selectedTrack = tracks[Math.floor(Math.random() * tracks.length)];

  // Adicionar a faixa ao histórico de tocadas
  playedTracks.push(selectedTrack.id);

  return selectedTrack;
}

// Função para Atualizar a Interface do Usuário
function updateUI(track) {
  document.getElementById('cover-image').src = track.album.images[0].url;
  document.getElementById('track-name').textContent = track.name;
  document.getElementById('artist-name').textContent = track.artists
    .map((artist) => artist.name)
    .join(', ');
  setDynamicBackground(track.album.images[0].url);
}

// Função para Definir o Background Dinâmico
function setDynamicBackground(imageUrl) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = imageUrl;
  img.onload = () => {
    const colorThief = new ColorThief();
    const dominantColor = colorThief.getColor(img);
    const [r, g, b] = dominantColor;
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    // Calcular o brilho da cor dominante
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Determinar a cor do texto com base no brilho
    const textColor = brightness > 125 ? 'black' : 'white';

    // Aplicar a cor do texto ao corpo
    document.body.style.color = textColor;

    // Atualizar a cor dos títulos e textos
    document.getElementById('track-name').style.color = textColor;
    document.getElementById('artist-name').style.color = textColor;

    // Atualizar a cor dos ícones dos botões
    const controls = document.querySelectorAll('#controls button');
    controls.forEach((button) => {
      button.style.color = textColor;
    });
  };
}

// Função para Configurar os Eventos dos Botões
function setupEventListeners() {
  document.getElementById('next-button').addEventListener('click', async () => {
    currentTrack = await getRandomTrack();
    updateUI(currentTrack);
    playTrack(currentTrack);
  });

  document.getElementById('prev-button').addEventListener('click', () => {
    alert('Função não implementada.');
  });

  document.getElementById('play-pause-button').addEventListener('click', () => {
    togglePlayPause();
  });
}

// Função para Reproduzir a Faixa
async function playTrack(track) {
  // Pausar o player do Spotify, se estiver tocando
  if (player && isPlaying) {
    await player.pause();
  }

  // Pausar e redefinir o audioPreview, se estiver tocando
  if (audioPreview && !audioPreview.paused) {
    audioPreview.pause();
    audioPreview.currentTime = 0;
    audioPreview = null;
  }

  // Verificar se o usuário é Premium
  fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.product === 'premium') {
        // Usuário Premium - reproduzir a faixa completa

        // Reproduzir a faixa no dispositivo correto
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: [track.uri] }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then(() => {
            isPlaying = true;
            document.getElementById('play-pause-button').innerHTML =
              '<i class="fas fa-pause"></i>';
          })
          .catch((error) => {
            console.error('Erro ao reproduzir a faixa:', error);
            alert(
              'Não foi possível reproduzir a faixa. Verifique se o Spotify está aberto em algum dispositivo.'
            );
          });
      } else {
        // Usuário Free - reproduzir a prévia de 30 segundos
        if (track.preview_url) {
          audioPreview = new Audio(track.preview_url);
          const playPromise = audioPreview.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                isPlaying = true;
                document.getElementById('play-pause-button').innerHTML =
                  '<i class="fas fa-pause"></i>';
              })
              .catch((error) => {
                console.error('Erro ao reproduzir a prévia:', error);
                alert(
                  'A reprodução automática foi bloqueada pelo navegador. Clique em Play para iniciar a música.'
                );
              });
          }
        } else {
          alert('Prévia não disponível para esta faixa.');
        }
      }
    });
}

// Função para Pausar/Reproduzir
function togglePlayPause() {
  if (isPlaying) {
    // Pausar a reprodução
    if (player) {
      player.pause();
    }
    if (audioPreview) {
      audioPreview.pause();
    }
    isPlaying = false;
    document.getElementById('play-pause-button').innerHTML =
      '<i class="fas fa-play"></i>';
  } else {
    // Retomar a reprodução
    if (player) {
      player.resume();
    }
    if (audioPreview) {
      const playPromise = audioPreview.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Erro ao reproduzir a prévia:', error);
          alert(
            'A reprodução automática foi bloqueada pelo navegador. Clique em Play para iniciar a música.'
          );
        });
      }
    }
    isPlaying = true;
    document.getElementById('play-pause-button').innerHTML =
      '<i class="fas fa-pause"></i>';
  }
}
