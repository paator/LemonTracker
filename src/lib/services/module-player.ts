import { allPatternRows, currentPatternIndex, cursorPosition } from '$lib/stores/stores';
import { get } from 'svelte/store';

export function playCurrentPattern() {
	const rows = get(allPatternRows);
	const currentPatternIdx = get(currentPatternIndex);
	const firstRowOfCurrentPattern = rows[currentPatternIdx];

	if (firstRowOfCurrentPattern.isPlaceholder) {
		return;
	}

	const remainingRows = rows.slice(firstRowOfCurrentPattern.globalIndex);
	let speedDecimal = 3;

	remainingRows.forEach(async (visibleRow) => {
		let speedHex: string | null = null;

		//assuming C > B > A priority
		if (visibleRow.row.channelsData[2].effect === 'B') {
			speedHex = visibleRow.row.channelsData[2].effectParamZ;
		} else if (visibleRow.row.channelsData[1].effect === 'B') {
			speedHex = visibleRow.row.channelsData[1].effectParamZ;
		} else if (visibleRow.row.channelsData[0].effect === 'B') {
			speedHex = visibleRow.row.channelsData[0].effectParamZ;
		}

		if (speedHex !== null) {
			speedDecimal = parseInt(speedHex, 16);
		}

		const delay = speedDecimal * (1.0 / 50) * 1000;

		const cursorPos = get(cursorPosition);

		await new Promise((resolve) => setTimeout(resolve, delay));

		cursorPosition.incrementYBy(1);
	});
}

export function stop() {}
