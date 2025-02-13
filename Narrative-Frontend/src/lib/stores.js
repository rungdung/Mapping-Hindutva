import { writable } from "svelte/store";

export let resourceBlob = writable();
export const eventsInHighlight = writable();
export const searchRange = writable(50);
export const map = writable();
export let mapContainer = writable();
export let lookingGlassBool = writable(true);
export const loadStatus = writable({
    "mapLoaded": false,
    "dataLoaded": false,
});