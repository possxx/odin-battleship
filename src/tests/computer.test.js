import Computer from '../computer';

describe('computer works as expected', () => {
	let computer = new Computer();

	test('returns array with random positive integer x, y values below 10', () => {
		let move = computer.getMove();
		expect(move[0]).toBeGreaterThanOrEqual(0);
		expect(move[0]).toBeLessThan(10);
		expect(move[1]).toBeGreaterThanOrEqual(0);
		expect(move[1]).toBeLessThan(10);
	});
});
