export function peek<T>(generator: Generator<T, any, any>): IteratorResult<T> {
	const current = generator.next();
	if (!current.done) {
		return { value: current.value, done: false };
	}
	return { value: undefined as unknown as T, done: true };
}
