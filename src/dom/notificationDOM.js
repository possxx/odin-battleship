export default class Notification {
	createNotification(type, ship) {
		const notificationDOM = document.createElement('div');
		notificationDOM.classList.add(`${type.toLowerCase()} notifications`);

		const text = {
			start: 'Start Game or Reset Positions',
			win: 'Congratulations! You Win!',
			lose: 'Game Over! You Lose!',
			playerTurn: 'Your Turn!',
			computerTurn: `Opponent's Turn!`,
			playerSunk: `Your ${ship} has been sunk!`,
			computerSunk: `Opponent's ${ship} has been sunk!`,
		};

		notificationDOM.innerText = text[type];
	}
}
