export function peek<T, TReturn = any, TNext = unknown>(
	generator: Generator<T, TReturn, TNext>
): IteratorResult<T> {
	const current = generator.next();
	if (!current.done) {
		return { value: current.value, done: false };
	}
	return { value: undefined, done: true };
}
