import Entity, {Sides, Trait} from '../Entity.js';
import PendulumMove from '../traits/PendulumMove.js';
import Killable from '../traits/Killable.js';
import {loadSpriteSheet} from '../loaders.js';

const STATE_WALKING = Symbol('walking');
const STATE_HIDING = Symbol('hiding');
const STATE_PANIC = Symbol('panic');

export function loadKoopa() {
	return loadSpriteSheet('koopa')
		.then(createKoopaFactory);
};

class Behaivor extends Trait {
	constructor() {
		super('behavior');
		this.state = STATE_WALKING;
		this.hideTime = 0;
		this.hideDuration = 5;
		this.panicSpeed = 300;
		this.walkSpeed = null;
	}

	collides(us, them) {
		if (us.killable.dead) {
			return;
		}

		if (them.stomper) {
			if (them.vel.y > us.vel.y) {
				this.handleStomp(us, them);
			} else {
				this.handleNudge(us, them);
			}	
		}
	}

	handleNudge(us, them) {
		if (this.state === STATE_WALKING) {
			them.killable.kill();
		} else if (this.state === STATE_HIDING) {
			this.panic(us, them);
		} else if (this.state === STATE_PANIC) {
			const travelDir = Math.sign(us.vel.x);
			const impactDir = Math.sign(us.pos.x);

			if (travelDir !== 0 && travelDir !== impactDir) {
				them.killable.kill();
			}
		}
	}

	handleStomp(us, them) {
		if (this.state === STATE_WALKING) {
			this.hide(us);
		} else if (this.state === STATE_HIDING) {
			us.killable.kill();
			us.vel.set(100, -200);
			us.canCollide = false;
		} else if (this.state === STATE_PANIC) {
			this.hide(us);
		}
	}

	hide(us) {
		us.vel.x = 0;
		us.pendulumMove.enable = false;
		if (this.walkSpeed === null) {
			this.walkSpeed = us.pendulumMove.speed;
		}
		this.hideTime = 0;
		this.state = STATE_HIDING;
	}

	panic(us, them) {
		us.pendulumMove.enable = true;
		us.pendulumMove.speed = this.panicSpeed * Math.sign(them.vel.x);
		this.state = STATE_PANIC;
	}

	unhide(us) {
		us.pendulumMove.enable = true;
		us.pendulumMove.speed = this.walkSpeed;
		this.state = STATE_WALKING;
	}

	update(us, deltaTime) {
		if (this.state === STATE_HIDING) {
			this.hideTime += deltaTime;

			if (this.hideTime > this.hideDuration) {
				this.unhide(us);
			}
		}
	}
}

function createKoopaFactory(sprite) {
	const walkAnimation = sprite.animations.get('walk');
	const wakeAnimation = sprite.animations.get('wake');

	function routeAnim(koopa) {
		if (koopa.behavior.state === STATE_HIDING) {
			if (koopa.behavior.hideTime > 3) {
				return wakeAnimation(koopa.behavior.hideTime);
			}

			return 'hiding';
		}

		if (koopa.behavior.state === STATE_PANIC) {
			return 'hiding';
		}

		return walkAnimation(koopa.lifetime)
	}

	function drawKoopa(context) {
		sprite.draw(routeAnim(this), context, 0, 0, this.vel.x < 0);
	}

	return function createKoopaFactory() {
		const koopa = new Entity();
		koopa.size.set(16, 16);
		koopa.offset.y = +8;

		koopa.addTrait(new PendulumMove());
		koopa.addTrait(new Behaivor());
		koopa.addTrait(new Killable());

		koopa.draw = drawKoopa;

		return koopa;
	}
};
