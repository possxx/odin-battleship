import Ship from './ship';

export default class Gameboard {
	constructor() {
		this.board = this.createBoard();
		this.ships = [];
		this.hits = new Set();
		this.attacks = new Set();
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
		} else {
			this.attacks.add(coordinate.toString());
		}
	}

	allSunk() {
		return this.ships.every((ship) => ship.isSunk());
	}

	randomShipPlacement() {
		this.board = this.createBoard();
		this.ships = [];

		const ships = [
			{ name: 'Carrier', length: 5 },
			{ name: 'Battleship', length: 4 },
			{ name: 'Cruiser', length: 3 },
			{ name: 'Submarine', length: 3 },
			{ name: 'Destroyer', length: 2 },
		];

		ships.forEach((ship) => {
			let placed = false;

			while (!placed) {
				const isHorizontal = Math.random() > 0.5 ? true : false;

				const startX = Math.floor(
					Math.random() * (isHorizontal ? 10 - ship.length : 10)
				);
				const startY = Math.floor(
					Math.random() * (isHorizontal ? 10 : 10 - ship.length)
				);

				const position = [];
				for (let i = 0; i < ship.length; i++) {
					isHorizontal
						? position.push([startX + i, startY])
						: position.push([startX, startY + i]);
				}

				if (this.positionIsAvailable(position)) {
					this.placeShip(position, ship.name, ship.length);
					placed = true;
				}
			}
		});
	}

	positionIsAvailable(position) {
		return position.every((coor) => {
			const [x, y] = coor;
			return !(this.board[x][y] instanceof Ship);
		});
	}
}
