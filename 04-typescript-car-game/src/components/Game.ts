import { Player } from './Player';

const app = document.querySelector<HTMLDivElement>('#app')!;
export class Game {
    players: Player[] = [];
    carOptions = ['🚗', '🚙', '🏎️', '🚓', '🚌'];
    keys: string[] = [];
    raceActive: boolean = false;
    positions: { [key: string]: number } = {};

    getRandomKey(usedKeys: Set<string>): string {
        const possibleKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'a', 'd', 'w', 's'];
        let key: string;
        do {
            key = possibleKeys[Math.floor(Math.random() * possibleKeys.length)];
        } while (usedKeys.has(key));
        return key;
    }

    addPlayer(nickname: string): Player | null {
        if (this.players.length < 5) {
            let car: string;
            do {
                car = this.carOptions[Math.floor(Math.random() * this.carOptions.length)];
            } while (this.players.find(player => player.car === car));

            const key = this.getRandomKey(new Set(this.keys));
            this.keys.push(key);
            const player = new Player(nickname, car, key);
            this.players.push(player);
            this.positions[nickname] = 0;
            return player;
        }
        return null;
    }

    startRace() {
        if (this.players.length < 2) {
            alert("Se requieren al menos 2 jugadores para iniciar la carrera.");
            return;
        }

        this.raceActive = true;
        let countdown = 10;

        const countdownDisplay = document.getElementById('countdown') as HTMLElement;
        countdownDisplay.innerText = `¡Comenzando en ${countdown}!`;

        const countdownInterval = setInterval(() => {
            countdown--;
            countdownDisplay.innerText = `¡Comenzando en ${countdown}!`;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                this.runRace();
            }
        }, 1000);
    }

    runRace() {
        console.log("¡La carrera ha comenzado!");

        const track = document.getElementById('track') as HTMLElement;
        const trackWidth = track.clientWidth;

        const pressedKeys = new Set<string>();

        window.addEventListener('keydown', (event) => {
            if (!this.raceActive) return;

            if (!pressedKeys.has(event.key)) { 
                pressedKeys.add(event.key);

                this.players.forEach(player => {
                    if (event.key === player.key) {
                        this.positions[player.nickname] += 10;
                        const carElement = document.getElementById(`${player.nickname}-car`) as HTMLElement;
                        carElement.style.left = `${this.positions[player.nickname]}px`;
                        if (this.positions[player.nickname] >= trackWidth - carElement.offsetWidth) {
                            this.finishRace(player.nickname);
                        }
                    }
                });
            }
        });

        window.addEventListener('keyup', (event) => {
            pressedKeys.delete(event.key);
        });
    }

    finishRace(winner: string) {
        this.raceActive = false;
        const sortedPlayers = this.players.sort((a, b) => {
            return this.positions[b.nickname] - this.positions[a.nickname];
        });

        const podium = sortedPlayers.slice(0, sortedPlayers.length).map((player, index) => {
            return `${index + 1}. ${player.nickname} con ${player.car}`;
        }).join('<br>');

        app.innerHTML = `
            <h1>¡Carrera Terminada!</h1>
            <h2>Podio:</h2>
            <div>${podium}</div>
            <button id="restart">Reiniciar Juego</button>
        `;

        document.getElementById('restart')!.onclick = () => {
            location.reload();
        };
    }
}
