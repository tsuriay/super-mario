import {Trait} from '../Entity.js';

export default class Go extends Trait {
	constructor() {
		super('go');

		this.diraction = 0;
		this.acceleration = 400;
		this.deceleration = 300;
		this.dragFactor = 1/5000;

		this.distance = 0;
		this.heading = 1;
	}

	update(entity, {deltaTime}) {
		const absX = Math.abs(entity.vel.x);

		if (this.diraction !== 0) {
			entity.vel.x += this.acceleration * deltaTime * this.diraction;

			if (entity.jump) {
				if (!entity.jump.falling) {
					this.heading = this.diraction;
				}
			} else {
				this.heading = this.diraction;
			}
			
		} else if (entity.vel.x !== 0) {
			const decel = Math.min(absX, this.deceleration * deltaTime);
			entity.vel.x += entity.vel.x > 0 ? -decel : decel;
		} else {
			this.distance = 0;
		}
		
		const drag = this.dragFactor * entity.vel.x *absX;
		entity.vel.x -= drag;

		this.distance += absX * deltaTime;
	}
};
