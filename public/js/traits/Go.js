import {Trait} from '../Entity.js';

export default class Go extends Trait {
	constructor() {
		super('go');

		this.diraction = 0;
		this.speed = 6000;

		this.distance = 0;
		this.heading = 1;
	}

	update(entity, deltaTime) {
		entity.vel.x = this.speed * this.diraction * deltaTime;

		if (this.diraction) {
			this.heading = this.diraction;
			this.distance += Math.abs(entity.vel.x) * deltaTime;
		} else {
			this.distance = 0;
		}
	}
};
