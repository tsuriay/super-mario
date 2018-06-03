import KeyboardState from './KeyboardState.js';

export function setupKeyboard(entity) {
	const input = new KeyboardState();

	input.addMapping('Space', keyState => {
		if (keyState) {
			entity.jump.start();
		} else {
			entity.jump.cancel();
		}
	});

	input.addMapping('ArrowRight', keyState => {
		entity.go.diraction += keyState ? 1 : -1;
	});
	
	input.addMapping('ArrowLeft', keyState => {
		entity.go.diraction += keyState ? -1 : 1;
	});

	return input;
};
