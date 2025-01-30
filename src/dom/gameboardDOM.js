export default class GameboardDOM {
	static createGameboard(type, gameboard) {
		const gameboardDOM = document.createElement('div');
		gameboardDOM.classList.add('gameboard');
		gameboardDOM.classList.add(type);
		const gameboardTextDOM = document.createElement('div');
		gameboardTextDOM.classList.add('gameboard-text');

		const gameboardText = {
			player: 'Your Board',
			computer: `Opponent's Board`,
		};

		gameboardTextDOM.innerText = gameboardText[type];

		const coordinates = [' abcdefghij', Array.from({ length: 10 })];

		for (let rowIndex = 0; rowIndex <= gameboard.board.length; rowIndex++) {
			const rowDOM = document.createElement('div');
			rowDOM.classList.add('row');
			rowDOM.dataset.row = rowIndex;
			gameboardDOM.appendChild(rowDOM);

			for (
				let columnIndex = 0;
				columnIndex <= gameboard.board.length;
				columnIndex++
			) {
				if (rowIndex === gameboard.board.length) {
					const coorDOM = document.createElement('div');
					coorDOM.classList.add('coor');
					coorDOM.innerText = coordinates[0][columnIndex];
					rowDOM.appendChild(coorDOM);
					continue;
				} else if (columnIndex === 0) {
					const coorDOM = document.createElement('div');
					coorDOM.classList.add('coor');
					coorDOM.innerText = coordinates[1].length - rowIndex - 1;
					rowDOM.appendChild(coorDOM);
					continue;
				}

				const cellDOM = this.createCell(
					this.getCellType(gameboard, type, rowIndex, columnIndex)
				);
				cellDOM.classList.add(type);
				rowDOM.appendChild(cellDOM);
			}
		}

		gameboardDOM.appendChild(gameboardTextDOM);

		return gameboardDOM;
	}

	static getCellType(gameboard, type, rowIndex, columnIndex) {
		const coor = [rowIndex, columnIndex - 1].toString();

		if (
			gameboard.hits.has(coor) &&
			gameboard.ships.includes(
				gameboard.board[rowIndex][columnIndex - 1]
			) &&
			type === 'player'
		) {
			return 'shiphit';
		} else if (gameboard.hits.has(coor)) {
			return 'hit';
		} else if (gameboard.attacks.has(coor)) {
			return 'miss';
		} else if (
			gameboard.ships.includes(
				gameboard.board[rowIndex][columnIndex - 1]
			) &&
			type === 'player'
		) {
			return 'ship';
		}
	}

	static createCell(type) {
		const cellDOM = document.createElement('div');
		cellDOM.classList.add('cell');

		const cellType = {
			shiphit: 'shiphit',
			miss: 'miss',
			hit: 'hit',
			ship: 'ship',
		};

		cellDOM.classList.add(cellType[type] || 'empty');

		return cellDOM;
	}
}
