import Computer from '../computer';

describe('computer works as expected', () => {
	let computer = new Computer();

	test('returns next move after successful hit on adjacent cell', () => {
		let lastHit = [5, 5];
		let nextMove = computer.getNextMove(lastHit, 'horizontal', '-');
		expect(nextMove).toEqual([4, 5]);

		let lastHit2 = [7, 7];
		let nextMove2 = computer.getNextMove(lastHit2, 'vertical');
		expect(nextMove2).toEqual([7, 8]);
	});

	test('returns adjacent moves', () => {
		let move = [0, 0];
		let possibleMoves = [
			[0, 1],
			[1, 0],
		];

		let adjacentMove = computer.getAdjacentMove(move);

		expect(possibleMoves).toContainEqual(
			expect.arrayContaining(adjacentMove)
		);

		let move2 = [5, 5];
		let possibleMoves2 = [
			[5, 6],
			[5, 4],
			[6, 5],
			[6, 4],
		];

		let adjacentMove2 = computer.getAdjacentMove(move2);

		expect(possibleMoves2).toContainEqual(
			expect.arrayContaining(adjacentMove2)
		);
	});

	test('returns array with random positive integer x, y values below 10', () => {
		let move = computer.getRandomMove();
		expect(move[0]).toBeGreaterThanOrEqual(0);
		expect(move[0]).toBeLessThan(10);
		expect(move[1]).toBeGreaterThanOrEqual(0);
		expect(move[1]).toBeLessThan(10);
	});
});
