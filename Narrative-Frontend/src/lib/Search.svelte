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
    resourceBlob,
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
  }

  export async function searchLayer($searchQuery) {
    /**
     * The features that match the search query.
     * @type {Array<maplibre.Feature>}
     */
    // switch off looking glass
    $lookingGlassBool = false;

    if (!$searchQuery || $searchQuery.trim() === "") {
      $eventsInHighlight = "";
      return;
    }

    try {
      let toBehighlighted = [],
        features;

      let layersToQuery = $resourceBlob
        .filter((layer) => layer.visibility === true)
        .map((layer) => layer.layerId);
      let getNearbyFeatures = $map.queryRenderedFeatures({
        layers: layersToQuery,
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

      $eventsInHighlight = toBehighlighted;
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

        $map.moveLayer("hwdb-highlight")
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
      //timeout
      searchTimeout = setTimeout(() => {
        displaySearchResultsBoolean = false;
        clearTimeout(searchTimeout);
      }, 8000)
      pastQuery = $searchQuery;

    } else if ($searchQuery?.length < 3 && pastQuery) {
      geocodedResults = null;
    }
  }
</script>

<div
  class=""
  on:click={(e) => {
    e.stopPropagation();
  }}
>
  <div class="bg-neutral-200 ">
    <div class="flex">
      <input
        type="text"
        size=5
        id="search-input"
        bind:value={$searchQuery}
        class="bg-neutral-400 flex-auto text-white py-2 px-1 bg-gray-300 z-30"
        placeholder="Search for an event or place"
        on:keydown={(e) => {
          if (e.key === "Enter") {
            searchLayer($searchQuery);
          }
        }}
      />
      <Button
        class=" "
        kind="secondary"
        on:click={() => searchLayer($searchQuery)}
        icon={Search}
      ></Button>
      <!-- <Button
        class="flex-none my-4"
        kind="secondary"
        on:click={() => ($searchQuery = "")}
        icon={CloseLarge}
      ></Button> -->
    </div>
    <div class="grid grid-cols-6">
      <div class="col-span-4 gap-1 py-1 bg-neutral-800 inline-flex flex-wrap">
        {#each searchSuggestions as suggestion}
          <span
            class="text-xs/5 bg-orange-200 px-1 text-black rounded-sm hover:cursor-pointer"
            on:click={() => {
              $searchQuery = suggestion;
              searchLayer(suggestion);
            }}>{suggestion}</span
          >
        {/each}
      </div>
      <div class="gap-2 col-span-2 bg-neutral-800 text-white p-2 text-xs flex-grow">
        <div class="flex gap-2">
          Area search
        </div>
        <div class="flex w-full items-center justify-center">
          <Toggle bind:toggled={$lookingGlassBool} size="sm" />
        </div>
      </div>
    </div>
  </div>
</div>

<div class="mt-2 flex gap-2">

  <!--- show results only if focus is on search input-->

  {#if geocodedResults?.features.length > 0 && displaySearchResultsBoolean}
    <div class=" py-1 h-40 gap-1 flex flex-wrap w-full overflow-y-scroll">
      {#each geocodedResults.features as result}
        <Button
          kind="secondary"
          size="sm"
          class="!text-xs/5 bg-neutral-500 !min-h-[0px] !p-0 !px-1 !rounded-sm w-full h-auto"
          on:click={() =>$map.flyTo({
            center: result.center,
            zoom: 14
          })}>{result.place_name}</Button
        >
      {/each}
    </div>
  {/if}
</div>
