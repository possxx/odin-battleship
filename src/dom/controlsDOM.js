import Computer from '../computer';
import Player from '../player';
import GameboardDOM from './gameboardDOM';
import ButtonDOM from './buttonDOM';
import NotificationDOM from './notificationDOM';

export default class Controller {
	constructor() {
		this.computer = new Computer();
		this.player = new Player();
		this.shipSunkLastTurn = null;
	}

	headerDOM = document.querySelector('.header');
	gameDOM = document.querySelector('.game');
	controlsDOM = document.querySelector('.controls');

	randomPlayerPositions() {
		this.player.gameboard.randomShipPlacement();
		this.gameDOM
			.querySelector('.player')
			.replaceWith(
				GameboardDOM.createGameboard('player', this.player.gameboard)
			);
	}

	showComputerShips() {
		this.gameDOM
			.querySelector('.computer')
			.querySelectorAll('.cell')
			.forEach((cell) => {
				const x = cell.getAttribute('data-x');
				const y = cell.getAttribute('data-y');

				if (
					this.computer.gameboard.ships.includes(
						this.computer.gameboard.board[x][y]
					)
				)
					cell.classList.add('ship');
			});
	}

	endGame() {
		this.player.gameboard.allSunk()
			? this.headerDOM
					.querySelector('.notifications')
					.replaceWith(NotificationDOM.createNotification('lose'))
			: this.headerDOM
					.querySelector('.notifications')
					.replaceWith(NotificationDOM.createNotification('win'));
		this.showComputerShips();
		this.controlsDOM.appendChild(ButtonDOM.createButton('again'));
		this.controlsDOM
			.querySelector('.again')
			.addEventListener('click', () => location.reload());
	}

	async computerTurn() {
		this.shipSunkLastTurn
			? this.headerDOM
					.querySelector('.notifications')
					.replaceWith(
						NotificationDOM.createNotification(
							'computerSunk',
							this.shipSunkLastTurn.name
						)
					)
			: this.headerDOM
					.querySelector('.notifications')
					.replaceWith(
						NotificationDOM.createNotification('computerTurn')
					);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		this.handleComputerAttack();
	}

	handleComputerAttack() {
		const move = this.computer.getMove();
		const [x, y] = move;

		this.player.gameboard.receiveAttack([x, y], 'computer');
		this.gameDOM
			.querySelector('.player')
			.replaceWith(
				GameboardDOM.createGameboard('player', this.player.gameboard)
			);

		this.shipSunkLastTurn = null;
		if (
			this.player.gameboard.ships.includes(
				this.player.gameboard.board[x][y]
			)
		) {
			const ship = this.player.gameboard.ships.find(
				(shipValue) => shipValue === this.player.gameboard.board[x][y]
			);
			ship.isSunk()
				? (this.shipSunkLastTurn = ship)
				: (this.shipSunkLastTurn = null);
		}
		if (this.player.gameboard.allSunk()) {
			this.endGame();
			return;
		}
		this.playerTurn();
	}

	playerTurn() {
		this.shipSunkLastTurn
			? this.headerDOM
					.querySelector('.notifications')
					.replaceWith(
						NotificationDOM.createNotification(
							'playerSunk',
							this.shipSunkLastTurn.name
						)
					)
			: this.headerDOM
					.querySelector('.notifications')
					.replaceWith(
						NotificationDOM.createNotification('playerTurn')
					);
		this.gameDOM
			.querySelector('.computer')
			.addEventListener('click', this.handlePlayerAttack);
	}

	handlePlayerAttack = (e) => {
		if (
			e.target.classList.contains('cell') &&
			e.target.classList.contains('empty')
		) {
			const x = e.target.getAttribute('data-x');
			const y = e.target.getAttribute('data-y');
			this.computer.gameboard.receiveAttack([x, y], 'player');
			this.gameDOM
				.querySelector('.computer')
				.replaceWith(
					GameboardDOM.createGameboard(
						'computer',
						this.computer.gameboard
					)
				);

			this.shipSunkLastTurn = null;
			if (
				this.computer.gameboard.ships.includes(
					this.computer.gameboard.board[x][y]
				)
			) {
				const ship = this.computer.gameboard.ships.find(
					(shipValue) =>
						shipValue === this.computer.gameboard.board[x][y]
				);
				ship.isSunk()
					? (this.shipSunkLastTurn = ship)
					: (this.shipSunkLastTurn = null);
			}
			if (this.computer.gameboard.allSunk()) {
				this.endGame();
				return;
			}
			this.computerTurn();
		}
	};

	startGame() {
		this.controlsDOM.innerHTML = '';
		this.playerTurn();
	}

	initGame() {
		this.headerDOM.appendChild(NotificationDOM.createNotification('start'));
		this.player.gameboard.randomShipPlacement();
		this.computer.gameboard.randomShipPlacement();
		this.gameDOM.appendChild(
			GameboardDOM.createGameboard('player', this.player.gameboard)
		);
		this.gameDOM.appendChild(
			GameboardDOM.createGameboard('computer', this.computer.gameboard)
		);
		this.controlsDOM.appendChild(ButtonDOM.createButton('start'));
		this.controlsDOM.appendChild(ButtonDOM.createButton('random'));
		this.controlsDOM
			.querySelector('.random')
			.addEventListener('click', () => this.randomPlayerPositions());
		this.controlsDOM
			.querySelector('.start')
			.addEventListener('click', () => this.startGame());
	}
}
