import Entity from '../Entity.js';
import Jump from '../traits/Jump.js';
import Go from '../traits/Go.js';
import Stomper from '../traits/Stomper.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import {loadAudioBoard} from '../loaders/audio.js';
import {loadSpriteSheet} from '../loaders.js';

const SLOW_DRAG = 1/2000;
const FAST_DRAG = 1/5000;

export function loadMario(audioContext) {
	return Promise.all([
		loadSpriteSheet('mario'),
		loadAudioBoard('mario', audioContext)
	]).then(([sprite, audio]) => {
		return createMarioFactory(sprite, audio);
	});
};

function createMarioFactory(sprite, audio) {
	const runAnimation = sprite.animations.get('run');

	function routeFrame(mario) {
		if (mario.jump.falling) {
			return 'jump';
		}

		if (mario.go.distance > 0) {
			if (mario.vel.x > 0 && mario.go.diraction < 0 || mario.vel.x < 0 && mario.go.diraction > 0) {
				return 'break';
			}

			return runAnimation(mario.go.distance);
		}
 
		return 'idle';
	}

	function setTurboState(turboOn) {
		this.go.dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
	}

	function drawMario(context) {
		sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0);
	};

	return function createMario() {
		const mario = new Entity();
		mario.audio = audio;
		mario.size.set(14, 16);

		mario.addTrait(new Physics());
		mario.addTrait(new Solid());
		mario.addTrait(new Go());
		mario.addTrait(new Jump());
		mario.addTrait(new Stomper());
		mario.addTrait(new Killable());

		mario.killable.removeAfter = 0;

		mario.turbo = setTurboState;
		mario.draw =drawMario;

		mario.turbo(false);

		return mario;
	};
};
