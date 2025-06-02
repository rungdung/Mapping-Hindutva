<script>
  import {
    eventsInHighlight,
    searchRange,
    map,
    searchQuery,
    filteredEvents,
    singleEventInHighlight,
  } from "./stores.js";

  import { Button } from "carbon-components-svelte";
  import { LocationFilled, Link } from "carbon-icons-svelte";
  import Timeline from "./Timeline.svelte";

  import { getDomainFromUrl } from "$lib/utils.js";
  import Filters from "./Filters.svelte";

  let involvedGroups;

  // Handle click on top of map
  let handleClick = (event) => {
    $singleEventInHighlight = event;
    let coords = event._geometry?.coordinates
      ? event._geometry.coordinates
      : event.geometry.coordinates;
    $map.flyTo({
      center: coords,
      zoom: 12,
      essential: true,
      duration: 3000,
    });

    // add to highlight layer and make it red
    if ($map.getSource("single-highlight")) {
      $map.getSource("single-highlight").setData({
        type: "FeatureCollection",
        features: [event],
      });
    } else {
      $map.addSource("single-highlight", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [event],
        },
      });
      $map.addLayer({
        id: "single-highlight",
        type: "circle",
        source: "single-highlight",
        paint: {
          "circle-radius": 10,
          "circle-color": "red",
          "circle-opacity": 0.5,
        },
      });
    }
  };

  let handleHover = (event) => {
    $singleEventInHighlight = event;

    // add to highlight layer and make it red
    if ($map.getSource("single-highlight")) {
      $map.getSource("single-highlight").setData({
        type: "FeatureCollection",
        features: [event],
      });
    } else {
      $map.addSource("single-highlight", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [event],
        },
      });
      $map.addLayer({
        id: "single-highlight",
        type: "circle",
        source: "single-highlight",
        paint: {
          "circle-radius": 10,
          "circle-color": "red",
          "circle-opacity": 0.5,
        },
      });
    }
  };

  $: $filteredEvents = $eventsInHighlight;
</script>

<div id="meta-info" class="text-[#faf6eb] grid grid-rows-10 h-screen p-4 max-h-screen">
  {#await $filteredEvents then}
    {#if $filteredEvents}
      <div class="row-span-3">
        <Filters></Filters>
      </div>
    {/if}
    <div class="row-span-7 overflow-y-scroll space-y-2">
      {#each $filteredEvents as row}
        <button
          class="card space-y-2 bg-neutral-800 hover:bg-orange-200 hover:text-black !text-left {$singleEventInHighlight
            ?.properties?.title == row?.properties?.title
            ? 'highlight'
            : ''}"
          onclick={() => handleClick(row)}
          onmouseover={() => handleHover(row)}
        >
          <div>
            <h3>
              {@html row?.properties?.title}, reported on <span
                >{new Date(row?.properties?.date).toLocaleString(
                  "en-GB",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}</span
              >
            </h3>
            <div class="">
              <span class="bg-orange-300 text-xs text-black"
                >{row?.properties?.category_slug
                  ? row?.properties?.category_slug
                  : "Uncategorised"} from {row?.properties?.natural_locations_openai} </span
              >
            </div>
            <br />
            <div class="mt-2 ">
              <div class="excerpt space-y-2">
                <p>{@html row?.properties?.excerpt?.replace("<p>", "")}</p>
                <div class="line-height-10">
                  {#each eval(row?.properties?.involved) as group}
                    <span class="px-1 text-xs bg-orange-200 text-black"
                      >{group}</span
                    >,
                  {/each}
                </div>
              </div>
            </div>
          </div>
          <Button
          size="sm"
          class="hover:cursor-default"
          kind="tertiary"
          href={row?.properties?.link}
          target="blank"
        >
          <span class="px-1 text-xs"
            > Read more from {getDomainFromUrl(row?.properties?.link)}
            <Link class="inline" size="10" /></span
          >
        </Button>
        </button>
      {/each}
    </div>
  {/await}
</div>

<style>
  :global(table th #title) {
    width: 10rem;
  }
  table {
    table-layout: fixed;
  }

  .highlight {
    @apply bg-red-400 text-black;
  }
  th {
    text-align: left;
    background-color: black;
    font-weight: 800;
  }

  tr:hover {
    background-color: #e0b072 !important;
    cursor: cell;
  }

  .card {
    @apply w-full p-2 px-4;
  }

  .card h3 {
    font-family: Junicode;
    font-variation-settings:
      "wght" 400,
      "wdth" 0;
    line-height: 1.5rem;
    font-size: 1.4rem;
    word-break: normal;
  }
</style>
