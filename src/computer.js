import Player from './player';

export default class Computer extends Player {
	constructor(playerBoard) {
		super();
		this.attacks = new Set();
		this.playerBoard = playerBoard;
		this.attackDirection = null;
		this.currentShipAttacks = null;
	}

	getMove() {
		if (this.currentShipAttacks) {
		}
	}

	determineMove(shipAttacks) {}

	getRandomMove() {
		let move;

		do {
			move = [
				Math.floor(Math.random() * 10),
				Math.floor(Math.random() * 10),
			];
		} while (this.attacks.has(move.toString()));

		this.attacks.add(move.toString());

		return move;
	}

	getAdjacentMove(hit) {
		let move;
		let possibleMoves = [
			[0, 1],
			[0, -1],
			[1, 0],
			[-1, 0],
		];

		for (let i = 0; i <= 3; i++) {
			if (
				move &&
				!this.attacks.has(move.toString()) &&
				move[0] >= 0 &&
				move[0] <= 9 &&
				move[1] >= 0 &&
				move[1] <= 9
			)
				break;

			move = [hit[0] + possibleMoves[i][0], hit[1] + possibleMoves[i][1]];
		}

		move[0] === hit[0]
			? (this.attackDirection = 'vertical')
			: (this.attackDirection = 'horizontal');

		return move;
	}

	getNextMove(lastHit, direction, sign) {
		let move;

		if (direction === 'vertical')
			sign === '-'
				? (move = [lastHit[0], lastHit[1] - 1])
				: (move = [lastHit[0], lastHit[1] + 1]);
		if (direction === 'horizontal')
			sign === '-'
				? (move = [lastHit[0] - 1, lastHit[1]])
				: (move = [lastHit[0] + 1, lastHit[1]]);

		return move;
	}
}
