export default class PatternRow {
  constructor(envelopeValue = 0, noiseValue = 0) {
    this.id = crypto.randomUUID();
    this.envelopeValue = envelopeValue;
    this.noiseValue = noiseValue;
  }
}
