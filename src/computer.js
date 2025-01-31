import Player from './player';

export default class Computer extends Player {
	constructor() {
		super();
	}

	getMove() {
		return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
	}
}
