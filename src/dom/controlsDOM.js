import Computer from '../computer';
import Player from '../player';
import Gameboard from '../gameboard';
import GameboardDOM from './gameboardDOM';
import ButtonDOM from './buttonDOM';
import NotificationDOM from './notificationDOM';

export default class Controller {
	constructor() {
		this.computer = new Computer();
		this.player = new Player();
		this.computerBoard = new Gameboard();
		this.playerBoard = new Gameboard();
		this.shipSunkLastTurn = null;
	}

	headerDOM = document.querySelector('.header');
	gameDOM = document.querySelector('.game');
	controlsDOM = document.querySelector('.controls');

	randomPlayerPositions() {
		this.playerBoard.randomShipPlacement();
		this.gameDOM
			.querySelector('.player')
			.replaceWith(
				GameboardDOM.createGameboard('player', this.playerBoard)
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
					this.computerBoard.ships.includes(
						this.computerBoard.board[x][y]
					)
				)
					cell.classList.add('ship');
			});
	}

	endGame() {
		this.playerBoard.allSunk()
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
		if (this.isComputerTurn) return;
		this.isComputerTurn = true;
		if (this.computerBoard.allSunk()) {
			this.endGame();
			return;
		}
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
		this.isComputerTurn = false;
	}

	handleComputerAttack() {
		const move = this.computer.getMove();
		const [x, y] = move;

		if (!this.playerBoard.hits.has(move.toString())) {
			this.playerBoard.receiveAttack([x, y], 'computer');
			this.gameDOM
				.querySelector('.player')
				.replaceWith(
					GameboardDOM.createGameboard('player', this.playerBoard)
				);

			this.shipSunkLastTurn = null;
			if (this.playerBoard.ships.includes(this.playerBoard.board[x][y])) {
				const ship = this.playerBoard.ships.find(
					(shipValue) => shipValue === this.playerBoard.board[x][y]
				);
				ship.isSunk()
					? (this.shipSunkLastTurn = ship)
					: (this.shipSunkLastTurn = null);
			}
		}

		this.playerTurn();
	}

	playerTurn() {
		if (this.playerBoard.allSunk()) {
			this.endGame();
			return;
		}
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
			this.computerBoard.receiveAttack([x, y], 'player');
			this.gameDOM
				.querySelector('.computer')
				.replaceWith(
					GameboardDOM.createGameboard('computer', this.computerBoard)
				);

			this.shipSunkLastTurn = null;
			if (
				this.computerBoard.ships.includes(
					this.computerBoard.board[x][y]
				)
			) {
				const ship = this.computerBoard.ships.find(
					(shipValue) => shipValue === this.computerBoard.board[x][y]
				);
				ship.isSunk()
					? (this.shipSunkLastTurn = ship)
					: (this.shipSunkLastTurn = null);
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
		this.playerBoard.randomShipPlacement();
		this.computerBoard.randomShipPlacement();
		this.gameDOM.appendChild(
			GameboardDOM.createGameboard('player', this.playerBoard)
		);
		this.gameDOM.appendChild(
			GameboardDOM.createGameboard('computer', this.computerBoard)
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
