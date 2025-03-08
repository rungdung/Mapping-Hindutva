import { writable } from "svelte/store";

export let resourceBlob = writable();
export let eventsInHighlight = writable();
export let singleEventInHighlight = writable();

export let searchQuery = writable();
export const searchRange = writable(50);
export const map = writable();
export let mapContainer = writable();
export let lookingGlassBool = writable(true);
export const loadStatus = writable({
  mapLoaded: false,
  dataLoaded: false,
});
export const title = writable("Where does Hate live?");
export const parentSearchSuggestions = [
  "RSS",
  "BJP",
  "Twitter",
  "Facebook",
  "Instagram",
  "YouTube",
  "Congress",
  "Gandhi",
  "Nehru",
  "Love",
  "Jihad",
  "Intercaste",
  "marriage",
  "rape",
  "Modi",
  "Narendra Modi",
  "Rahul Gandhi",
  "Amit Shah",
  "Arvind Kejriwal",
  "Dalit",
  "Caste",
  "Muslim",
];
