import { writable } from 'svelte/store';

export const audioContext = writable<AudioContext>();
export const audioNode = writable<AudioWorkletNode>();
