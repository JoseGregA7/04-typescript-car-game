import './assets/styles/styles.scss';
import { Game } from './components/Game';

const game = new Game();
const app = document.getElementById('app') as HTMLElement;

function renderHome() {
  app.innerHTML = `
        <h1 aria-label="Pantalla de Juego de Carreras">Juego de Carreras</h1>
        <input id="nickname" aria-label="Campo para agregar nickname" placeholder="Introduce tu nickname" />
        <button id="addPlayer" aria-label="Boton para agregar jugador">Añadir Jugador</button>
        <div class="player-list" aria-label="Lista de jugadores" id="playerList"></div>
        <button id="startGame" aria-label="Boton para iniciar la carrera" style="display:none;">Iniciar Juego</button>
    `;

  document.getElementById('addPlayer')!.onclick = () => {
    const nicknameInput = document.getElementById('nickname') as HTMLInputElement;
    const nickname = nicknameInput.value.trim();
    if (nickname) {
      const player = game.addPlayer(nickname);
      if (player) {
        updatePlayerList();
        nicknameInput.value = '';
        if (game.players.length >= 2) {
          document.getElementById('startGame')!.style.display = 'inline';
        }
      }
    }
  };

  document.getElementById('startGame')!.onclick = () => {
    startRace();
  };
}

function updatePlayerList() {
  const playerList = document.getElementById('playerList')!;
  playerList.innerHTML = '';
  game.players.forEach(player => {
    const playerDiv = document.createElement('div');
    playerDiv.textContent = `${player.nickname} - ${player.car} (Tecla: ${player.key})`;
    playerList.appendChild(playerDiv);
  });
}

function startRace() {
  app.style.backgroundImage = 'url(/trackSmall.webp)';
  app.innerHTML = `
      <h1 aria-label="Pantalla de Pista de Carreras">Pista de Carreras</h1>
      <div id="countdown" aria-label="Contador regresivo para iniciar carrera"></div>
      <div class="track" id="track" aria-label="Pista de carreras">
          ${game.players.map((player, index) => `
              <div class="car" id="${player.nickname}-car" style="position: absolute; left: 0; bottom: ${index * 50}px;">
                  <div> ${player.car} </div> <div class="car__nickname"> ${player.nickname} </div>
              </div>
          `).join('')}
      </div>
  `;
  game.startRace();
}

renderHome();
