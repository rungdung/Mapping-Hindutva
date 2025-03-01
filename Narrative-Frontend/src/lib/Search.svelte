<script>
  /**
   * A component to search for events in the map.
   * It takes a map object as a prop and exposes a function to search for events.
   * The search is done by querying the "point" layer in the map and looking for
   * events that have the search query in their excerpt.
   * The matching events are then added to a new layer called "hwdb-highlight"
   * and styled as red circles.
   *
   * @param {maplibre.Map} map - The map object.
   */

  import maplibre from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";
  import { eventsInHighlight, map, lookingGlassBool } from "./stores";
  import { sampleSize, geocoderApi } from "$lib/utils.js";
  import { fly } from "svelte/transition";

  import { Button, Toggle, TextInput } from "carbon-components-svelte";
  import Search from "carbon-icons-svelte/lib/Search.svelte";
  /**
   * The search query.
   * @type {string}
   */
  let searchQuery;
  let pastQuery = "";

  let geocodedResults;

  /**
   * Searches for events in the map.
   * It takes the search query and looks for events that have the search query
   * in their excerpt.
   * The matching events are then added to a new layer called "hwdb-highlight"
   * and styled as red circles.
   */

  export async function searchOSM(searchQuery) {
    geocodedResults = await geocoderApi.forwardGeocode(searchQuery);
    console.log(geocodedResults);
  }

  export async function searchLayer(searchQuery) {
    /**
     * The features that match the search query.
     * @type {Array<maplibre.Feature>}
     */
    // switch off looking glass
    $lookingGlassBool = false;

    try {
      let toBehighlighted = [],
        features;
      // query the layer for the existence of a keyword in teh title
      // get random points from nearby
      let getNearbyFeatures = $map.queryRenderedFeatures({
        layers: ["point"],
      });

      // loop through the properties
      // if the property exists, add it to the highlight layer
      getNearbyFeatures.forEach((element) => {
        try {
          if (
            element.properties.excerpt
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          ) {
            toBehighlighted.push(element);
          }
        } catch (e) {
          console.error(`Failed to forwardGeocode with error: ${e}`);
        }
      });
      $eventsInHighlight = {
        features: toBehighlighted,
        type: "FeatureCollection",
      };
      $eventsInHighlight = $eventsInHighlight;

      // create a duplicate source for the highlight
      if ($map.getSource("hwdb-highlight")) {
        features = $map
          .getSource("hwdb-highlight")
          .setData({ type: "FeatureCollection", features: toBehighlighted })[
          "_data"
        ]["features"];
      } else {
        $map.addSource("hwdb-highlight", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: "",
          },
        });
        $map.addLayer({
          id: "hwdb-highlight",
          type: "circle",
          source: "hwdb-highlight",
          paint: {
            "circle-radius": 10,
            "circle-color": "red",
            "circle-opacity": 0.5,
          },
        });
        features = $map
          .getSource("hwdb-highlight")
          .setData({ type: "FeatureCollection", features: toBehighlighted })[
          "_data"
        ]["features"];
      }
    } catch (e) {
      console.error(`Failed to forwardGeocode with error: ${e}`);
    }
  }

  $: if (searchQuery?.length > 3 && searchQuery !== pastQuery) {
    searchOSM(searchQuery);
    pastQuery = searchQuery;
  } else if (searchQuery?.length < 3 && pastQuery) {
    geocodedResults = null;
  }
</script>

<div class="">
  <div class="grid">
    <TextInput
      type="text"
      id="search-input"
      bind:value={searchQuery}
      class=" py-2 px-1 bg-gray-300"
      placeholder="Search for an event or place"
      light
    />
  </div>
  <Button
    class="w-full my-4"
    kind="secondary"
    on:click={() => searchLayer(searchQuery)}
    icon={Search}
  >
    Search across events</Button
  >

  <div class="mt-4">
    <div class="text-xs bg-neutral-200 px-2 py-1">
      Found <span class="font-bold px-1 bg-orange-200"
        >{$eventsInHighlight?.features?.length || 0} events</span
      >. You can explore them on the right.
    </div>
    <div class="flex gap-2 my-2 bg-neutral-200 px-2 py-1 text-xs">
      Looking glass mode is switched {$lookingGlassBool ? "on" : "off"} because you
      {$lookingGlassBool ? "are not" : "are"} searching.

      <Toggle bind:toggled={$lookingGlassBool} size="sm" />
    </div>
  </div>
  {#if geocodedResults?.features.length > 0}
    <div class="bg-neutral-200 px-2 py-1 h-40 overflow-y-scroll">
      <p class="mb-0 text-xs">Go to locations</p>
      {#each geocodedResults.features as result}
        <button
          class="text-xs bg-neutral-500 mb-1"
          on:click={() => $map.flyTo(result.center)}>{result.place_name}</button
        >
      {/each}
    </div>
  {/if}
</div>
