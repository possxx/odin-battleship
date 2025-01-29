import Ship from './ship';

export default class Gameboard {
	constructor() {
		this.board = this.createBoard();
		this.ships = [];
		this.hits = new Set();
		this.missedAttacks = new Set();
	}

	createBoard() {
		return Array.from({ length: 10 }, () => Array(10).fill(null));
	}

	placeShip(position, name, length) {
		const ship = new Ship(name, length);
		this.ships.push(ship);

		position.forEach((field) => {
			const [x, y] = field;

			this.board[x][y] = ship;
		});
	}

	receiveAttack(coordinate) {
		const [x, y] = coordinate;

		if (this.board[x][y] instanceof Ship) {
			this.board[x][y].hit();
			this.hits.add(coordinate.toString());
		}

		this.missedAttacks.add(coordinate.toString());
	}

	allSunk() {
		return this.ships.every((ship) => ship.isSunk());
	}
}
