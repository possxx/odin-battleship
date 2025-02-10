import Player from './player';
import Ship from './ship';

export default class Computer extends Player {
	constructor() {
		super();
		this.attacks = new Set();
		this.playerBoard = null;
		this.attackDirection = null;
		this.currentShipAttacks = null;
	}

	makeMove() {
		let move;
		if (this.currentShipAttacks) {
			move = this.determineMove();
			this.playerBoard.receiveAttack(move);

			if (
				this.playerBoard.board[move[0]][move[1]] instanceof Ship &&
				this.playerBoard.board[move[0]][move[1]].isSunk()
			) {
				this.currentShipAttacks = null;
			}

			return move;
		}
		move = this.getRandomMove();
		if (this.playerBoard.board[move[0]][move[1]] instanceof Ship) {
			this.currentShipAttacks = new Map();
			this.currentShipAttacks.set(move.toString(), 'hit');
		}

		this.playerBoard.receiveAttack(move);

		return move;
	}

	determineMove() {
		let move;
		const currentShipAttacksCoor = this.currentShipAttacks.keys().toArray();
		const currentShipAttacksStatus = this.currentShipAttacks
			.values()
			.toArray();
		const firstHit = currentShipAttacksCoor[0];
		const lastHit =
			currentShipAttacksCoor[currentShipAttacksCoor.length - 1];

		if (currentShipAttacksCoor.length === 1) {
			move = this.getAdjacentMove([
				Number(firstHit.at(0)),
				Number(firstHit.at(2)),
			]);

			if (this.playerBoard.board[move[0]][move[1]] instanceof Ship)
				this.currentShipAttacks.set(move.toString(), 'hit');

			return move;
		} else if (
			currentShipAttacksStatus.some((status) => status === 'miss')
		) {
			currentShipAttacksCoor.forEach((attack) => {
				if (
					attack ===
					currentShipAttacksCoor[currentShipAttacksCoor.length - 1]
				) {
					const keys = Array.from(this.currentShipAttacks.keys());
					const lastKey = keys.pop();
					this.currentShipAttacks.delete(lastKey);
				}
			});

			move = this.getNextMove(
				[Number(firstHit.at(0)), Number(firstHit.at(2))],
				this.attackDirection,
				'-'
			);

			this.attacks.add(move.toString());

			if (this.playerBoard.board[move[0]][move[1]] instanceof Ship)
				this.currentShipAttacks.set(move.toString(), 'hit');

			return move;
		} else {
			move = this.getNextMove(
				[Number(lastHit.at(0)), Number(lastHit.at(2))],
				this.attackDirection
			);

			if (this.attacks.has(move.toString())) {
				if (this.playerBoard.board[move[0]][move[1]] === null) {
					move = this.getNextMove(
						[Number(firstHit.at(0)), Number(firstHit.at(2))],
						this.attackDirection,
						'-'
					);
				} else {
					move = this.getNextMove(
						[Number(lastHit.at(0)), Number(lastHit.at(2))],
						this.attackDirection,
						'-'
					);
				}
			}

			this.attacks.add(move.toString());

			if (this.playerBoard.board[move[0]][move[1]] instanceof Ship)
				this.currentShipAttacks.set(move.toString(), 'hit');
			else this.currentShipAttacks.set(move.toString(), 'miss');

			return move;
		}
	}

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

		this.attacks.add(move.toString());

		return move;
	}

	getNextMove(lastHit, direction, sign) {
		let move;

		if (direction === 'vertical') {
			sign === '-'
				? (move = [lastHit[0], lastHit[1] - 1])
				: (move = [lastHit[0], lastHit[1] + 1]);
		}
		if (direction === 'horizontal') {
			sign === '-'
				? (move = [lastHit[0] - 1, lastHit[1]])
				: (move = [lastHit[0] + 1, lastHit[1]]);
		}

		return move;
	}
}
