import { writable } from 'svelte/store';

export const isTrackPlaying = writable<boolean>(false);
