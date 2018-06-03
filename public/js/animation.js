export const createAnimation = (frames, frameLength) => distance => {
	const frameIndex = Math.floor(distance / frameLength) % frames.length;
	const frameName = frames[frameIndex];
	return frameName;
};