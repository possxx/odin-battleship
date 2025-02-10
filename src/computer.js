import Player from './player';
import Ship from './ship';

export default class Computer extends Player {
	constructor() {
		super();
		this.attacks = new Set();
		this.playerBoard = null;
		this.attackDirection = null;
		this.currentShipAttacks = [];
	}

	makeMove() {
		let move;
		if (this.currentShipAttacks[0]) {
			move = this.determineMove();
			this.playerBoard.receiveAttack(move);

			if (
				this.playerBoard.board[move[0]][move[1]] instanceof Ship &&
				this.playerBoard.board[move[0]][move[1]] !==
					this.currentShipAttacks[0][1]
			) {
				const shipAttacks = new Map();
				shipAttacks.set(move.toString(), 'hit');
				const ship = this.playerBoard.board[move[0]][move[1]];
				this.currentShipAttacks.push([shipAttacks, ship]);
			} else if (
				this.playerBoard.board[move[0]][move[1]] instanceof Ship
			) {
				this.currentShipAttacks[0][0].set(move.toString(), 'hit');
				if (this.playerBoard.board[move[0]][move[1]].isSunk()) {
					this.currentShipAttacks.shift();
				}
			} else if (
				this.currentShipAttacks[0][0].keys().toArray().length > 1
			) {
				this.currentShipAttacks[0][0].set(move.toString(), 'miss');
			}

			return move;
		}

		move = this.getRandomMove();
		if (this.playerBoard.board[move[0]][move[1]] instanceof Ship) {
			const shipAttacks = new Map();
			shipAttacks.set(move.toString(), 'hit');
			const ship = this.playerBoard.board[move[0]][move[1]];
			this.currentShipAttacks.push([shipAttacks, ship]);
		}

		this.playerBoard.receiveAttack(move);

		return move;
	}

	determineMove() {
		let move;
		const currentShipAttacksCoor = this.currentShipAttacks[0][0]
			.keys()
			.toArray();
		const currentShipAttacksStatus = this.currentShipAttacks[0][0]
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

			return move;
		} else if (
			currentShipAttacksStatus.some((status) => status === 'miss')
		) {
			currentShipAttacksCoor.forEach((attack) => {
				if (
					attack ===
					currentShipAttacksCoor[currentShipAttacksCoor.length - 1]
				) {
					const keys = Array.from(
						this.currentShipAttacks[0][0].keys()
					);
					const lastKey = keys.pop();
					this.currentShipAttacks[0][0].delete(lastKey);
				}
			});

			move = this.getNextMove(
				[Number(firstHit.at(0)), Number(firstHit.at(2))],
				this.attackDirection,
				'-'
			);

			this.attacks.add(move.toString());

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
				} else if (
					this.playerBoard.board[move[0]][move[1]] !==
					this.currentShipAttacks[0][1]
				) {
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
