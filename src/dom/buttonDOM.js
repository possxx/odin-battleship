export default class ButtonDOM {
	createButton(type) {
		const buttonDOM = document.createElement('button');
		buttonDOM.classList.add(`${type} control-button`);

		const text = {
			reset: 'Reset Positions',
			start: 'Start Game',
			again: 'Play Again',
			random: 'Random Positions',
		};

		buttonDOM.innerText = text[type];

		return buttonDOM;
	}
}
