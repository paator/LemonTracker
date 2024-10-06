export interface SamplePoint {
	tone: boolean;
	noise: boolean;
	envelope: boolean;
	toneShift: number;
	noiseEnvShift: number;
	volume: number;
}

export default class Sample {
	points: SamplePoint[];
	loopPoint: number;

	constructor(points: SamplePoint[] = [], loopPoint: number = -1) {
		this.points = points;
		this.loopPoint = loopPoint;
	}
}
