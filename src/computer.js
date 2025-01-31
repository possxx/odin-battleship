import Player from './player';

export default class Computer extends Player {
	constructor() {
		super();
		this.attacks = new Set();
	}

	getMove() {
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
}
