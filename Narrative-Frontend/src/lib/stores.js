import { writable } from "svelte/store";

/**
 * Array of layers loaded along with blob containing geojson
 */
export let resourceBlob = writable();

/**
 * Events under the lookin gglass or filtered. 
 * Essentially biggest set of events 
 * selected or highlighted in any form
 */
export let eventsInHighlight = writable();

/**
 * data clicked on
 */
export let singleEventInHighlight = writable();

/**
 * Initial copy of eventsInHighlight
 * Then filters are applied
 */
export let filteredEvents = writable();

/**
 * Search query 
 */
export let searchQuery = writable();

/**
 * Search range for looking glass search
 */
export const searchRange = writable(50);

/** The map object */
export const map = writable();

/** HTML map container */
export let mapContainer = writable();

/** Status of looking glass search */
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
