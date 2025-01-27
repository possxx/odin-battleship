import Gameboard from '../gameboard';

describe('gameboard works as expected', () => {
	let gameboard;

	beforeEach(() => {
		gameboard = new Gameboard();
	});

	test('gameboard is 10x10 size', () => {
		expect(gameboard.board.length).toEqual(10);
		gameboard.board.forEach((row) => {
			expect(row.length).toEqual(10);
		});
	});

	test('handles placement of ships', () => {
		const pos1 = [
			[0, 0],
			[0, 1],
			[0, 2],
		];
		const pos2 = [
			[9, 9],
			[9, 8],
			[9, 7],
			[9, 6],
			[9, 5],
		];

		gameboard.placeShip(pos1, 'Cruiser');
		expect(
			gameboard.board[0][0].name &&
				gameboard.board[0][1].name &&
				gameboard.board[0][2].name
		).toEqual('Cruiser');

		gameboard.placeShip(pos2, 'Carrier');
		expect(
			gameboard.board[9][9].name &&
				gameboard.board[9][8].name &&
				gameboard.board[9][7].name &&
				gameboard.board[9][6].name &&
				gameboard.board[9][5].name
		).toEqual('Carrier');
	});

	test('handles ship attacks', () => {
		const pos = [
			[0, 0],
			[0, 1],
			[0, 2],
		];

		gameboard.placeShip(pos);
		gameboard.receiveAttack([0, 0]);
		expect(gameboard.board[0][0].hits).toEqual(1);

		gameboard.receiveAttack([9, 8]);
		expect(gameboard.missedAttacks.has([9, 8].toString())).toEqual(true);
	});

	test('handles all ships sunk', () => {
		const positions = [[[0, 0]], [[8, 8]], [[6, 6]], [[5, 5]]];

		positions.forEach((pos) => {
			gameboard.placeShip(pos, '', 1);
			gameboard.receiveAttack(pos[0]);
		});

		expect(gameboard.allSunk()).toEqual(true);
	});
});
