// Variáveis Globais
let accessToken = null;
let player = null;
let currentTrack = null;
let isPlaying = false;
let audioPreview = null;
let deviceId = null;
let playedTracks = [];
let isPremiumUser = false; // Indica se o usuário é Premium

// Definir o Client ID diretamente no código
const clientId = 'SEU_CLIENT_ID'; // Substitua pelo seu Client ID
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
    authorize();
  }
};

// Função para Inicializar o Player
async function initializePlayer() {
  currentTrack = await getRandomTrack();
  updateUI(currentTrack);
  playTrack(currentTrack);
}

// Função para Definir o Background Dinâmico
function setDynamicBackground(imageUrl) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = imageUrl;
  img.onload = () => {
    const colorThief = new ColorThief();
    const dominantColor = colorThief.getColor(img);

    if (!document.body.classList.contains('light-theme') && !document.body.classList.contains('dark-theme')) {
      document.body.style.backgroundColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
    }

    const brightness = (dominantColor[0] * 299 + dominantColor[1] * 587 + dominantColor[2] * 114) / 1000;
    const textColor = brightness > 125 ? 'black' : 'white';

    document.body.style.color = textColor;
    document.getElementById('track-name').style.color = textColor;
    document.getElementById('artist-name').style.color = textColor;
  };
}

// Função para Atualizar a Interface do Usuário
function updateUI(track) {
  document.getElementById('cover-image').src = track.album.images[0].url;
  document.getElementById('track-name').textContent = track.name;
  document.getElementById('artist-name').textContent = track.artists.map(artist => artist.name).join(', ');
  setDynamicBackground(track.album.images[0].url);
}

// Função para Buscar uma Faixa Aleatória de Rap Brasileiro
async function getRandomTrack() {
  try {
    const totalResponse = await fetch(
      `https://api.spotify.com/v1/search?q=genre:%22rap%20brasileiro%22&type=track&market=BR&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const totalData = await totalResponse.json();
    const totalTracks = Math.min(totalData.tracks.total, 10000);

    const limit = 50;
    const maxOffset = Math.max(totalTracks - limit, 0);
    const randomOffset = Math.floor(Math.random() * (maxOffset + 1));

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

    tracks = tracks.filter(track => !playedTracks.includes(track.id));

    if (tracks.length === 0) {
      playedTracks = [];
      return getRandomTrack();
    }

    const selectedTrack = tracks[Math.floor(Math.random() * tracks.length)];
    playedTracks.push(selectedTrack.id);
    return selectedTrack;
  } catch (error) {
    alert('Erro ao carregar faixa. Por favor, tente novamente.');
    console.error('Erro ao buscar faixa:', error);
  }
}

// Função para Reproduzir a Faixa
async function playTrack(track) {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();

  isPremiumUser = data.product === 'premium';

  if (isPremiumUser) {
    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [track.uri] }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Monitorar o término da música e iniciar a próxima
      monitorTrackEnd();
    } catch (error) {
      console.error('Erro ao reproduzir a faixa:', error);
    }
  } else {
    if (track.preview_url) {
      audioPreview = new Audio(track.preview_url);
      audioPreview.play().then(() => {
        // Monitorar o término da música e iniciar a próxima
        monitorTrackEnd();
      });
    } else {
      alert('Prévia não disponível para esta faixa.');
    }
  }
}

// Função para alternar o ícone de play/pause
function togglePlayPause() {
  if (isPlaying) {
    audioPreview.pause();
    document.getElementById('play-pause-button').innerHTML = '<i class="fas fa-play"></i>';
  } else {
    audioPreview.play();
    document.getElementById('play-pause-button').innerHTML = '<i class="fas fa-pause"></i>';
  }
  isPlaying = !isPlaying;
}

// Adicionar o evento de click ao botão play/pause
document.getElementById('play-pause-button').addEventListener('click', () => {
  if (audioPreview) {
    togglePlayPause();
  } else {
    playTrack(currentTrack); // Iniciar a faixa se ainda não estiver tocando
  }
});

// Função para monitorar o término da faixa e iniciar a próxima
function monitorTrackEnd() {
  if (isPremiumUser) {
    // Aqui, se necessário, pode-se adicionar lógica para premium users também, mas o Spotify SDK geralmente cuida disso
  } else if (audioPreview) {
    audioPreview.onended = async () => {
      currentTrack = await getRandomTrack();
      updateUI(currentTrack);
      playTrack(currentTrack);
    };
  }
}
