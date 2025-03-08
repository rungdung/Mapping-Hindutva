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
  import {
    eventsInHighlight,
    map,
    lookingGlassBool,
    parentSearchSuggestions,
    searchQuery,
  } from "./stores";
  import { sampleSize, geocoderApi } from "$lib/utils.js";
  import { fly } from "svelte/transition";

  import { Button, Toggle, TextInput } from "carbon-components-svelte";
  import CircleDash from "carbon-icons-svelte/lib/CircleDash.svelte";
  import Cursor_1 from "carbon-icons-svelte/lib/Cursor_1.svelte";
  import Search from "carbon-icons-svelte/lib/Search.svelte";
  import CloseLarge from "carbon-icons-svelte/lib/CloseLarge.svelte";

  /**
   * The search query.
   * @type {string}
   */
  let pastQuery = "";

  let geocodedResults;

  // randomly select
  let searchSuggestions = sampleSize(parentSearchSuggestions, 8);
  let displaySearchResultsBoolean = false;

  // create timeout for search results
  let searchTimeout;
  /**
   * Searches for events in the map.
   * It takes the search query and looks for events that have the search query
   * in their excerpt.
   * The matching events are then added to a new layer called "hwdb-highlight"
   * and styled as red circles.
   */

  export async function searchOSM($searchQuery) {
    geocodedResults = await geocoderApi.forwardGeocode($searchQuery);
    console.log(geocodedResults);
  }

  export async function searchLayer($searchQuery) {
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
            element.properties?.excerpt
              .toLowerCase()
              .includes($searchQuery.toLowerCase())
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
            "circle-color": "#fed7aa",
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

  $: {
    if ($searchQuery?.length > 3 && $searchQuery !== pastQuery) {
      displaySearchResultsBoolean = true;
      searchOSM($searchQuery);
      pastQuery = $searchQuery;
      searchTimeout = setTimeout(
        () => (displaySearchResultsBoolean = false),
        2000
      );
    } else if ($searchQuery?.length < 3 && pastQuery) {
      geocodedResults = null;
    }
  }
</script>

<div class="">
  <div class="bg-neutral-200">
    <div class="flex">
      <input
        type="text"
        id="search-input"
        bind:value={$searchQuery}
        class="bg-neutral-400 flex-auto text-white py-2 px-1 bg-gray-300"
        placeholder="Search for an event or place"
        on:keydown={(e) => {
          if (e.key === "Enter") {
            searchLayer($searchQuery);
          }
        }}
      />
      <Button
        class="w-14 flex-none my-4"
        kind="secondary"
        on:click={() => searchLayer($searchQuery)}
        icon={Search}
      ></Button>
      <Button
        class="w-14 flex-none my-4"
        kind="secondary"
        on:click={() => ($searchQuery = "")}
        icon={CloseLarge}
      ></Button>
    </div>
    <div class="gap-1 p-1 bg-neutral-600 inline-flex flex-wrap">
      <div class="text-xs bold text-white">Search Suggestions:</div>
      {#each searchSuggestions as suggestion}
        <span
          class="text-xs/5 bg-orange-200 px-1 rounded-sm hover:cursor-pointer"
          on:click={() => {
            $searchQuery = suggestion;
            searchLayer(suggestion);
          }}>{suggestion}</span
        >
      {/each}
    </div>
  </div>

  <div class="mt-2 flex gap-2">
    <div class="text-xs bg-neutral-600 p-2 text-white">
      Found <br />
      <div
        class="font-bold text-xl bg-orange-200 w-full flex items-center justify-center"
      >
        <span class=" text-neutral-600"
          >{$eventsInHighlight?.features?.length || 0}</span
        >
      </div>
      events
    </div>
    <div class="gap-2 bg-neutral-600 text-white p-2 text-xs flex-grow">
      <div class="flex gap-2">
        Area search
        <div class=" mx-auto">
          {#if $lookingGlassBool}
            <CircleDash size={24} />
          {:else}
            <Cursor_1 size={24} />
          {/if}
        </div>
      </div>
      <div class="flex w-full items-center justify-center">
        <Toggle bind:toggled={$lookingGlassBool} size="sm" />
      </div>
    </div>
  </div>
  <!--- show results only if focus is on search input-->

  {#if geocodedResults?.features.length > 0 && displaySearchResultsBoolean}
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
