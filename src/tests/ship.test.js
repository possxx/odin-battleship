import Ship from '../ship';

describe('ships behave correctly', () => {
	let ship;

	beforeEach(() => {
		ship = new Ship('cruiser', 3);
	});

	test('handles hits correctly', () => {
		ship.hit();
		expect(ship.hits).toEqual(1);
		ship.hit();
		expect(ship.hits).toEqual(2);
	});

	test('handles ships sinking', () => {
		ship.hit();
		ship.hit();
		expect(ship.isSunk()).toEqual(false);
		ship.hit();
		expect(ship.isSunk()).toEqual(true);
	});
});
