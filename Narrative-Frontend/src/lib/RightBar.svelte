<script>
  import {
    eventsInHighlight,
    searchRange,
    map,
    searchQuery,
    singleEventInHighlight,
  } from "./stores.js";

  import { Button } from "carbon-components-svelte";
  import { LocationFilled, Link } from "carbon-icons-svelte";
  import Timeline from "./Timeline.svelte";

  import { getDomainFromUrl } from "$lib/utils.js";

  let involvedGroups = $state([]);

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
</script>

<div
  id="meta-info"
  class="text-[#faf6eb] rounded-none grid grid-rows-10 gap-2 max-h-screen"
>
  <Timeline />
  {#snippet header()}
    <div>
      Events under the looking glass within a radius of {$searchRange}km
    </div>

    <br />
  {/snippet}
  <div class="row-span-7 overflow-y-scroll">
    {#each $eventsInHighlight as row}
      <div
        class="card space-y-2 overflow-y-scroll hover:bg-orange-200 hover:text-black {$singleEventInHighlight
          ?.properties?.title == row?.properties?.title
          ? 'highlight'
          : ''}"
        onclick={() => handleClick(row)}
        onmouseover={() => handleHover(row)}
      >
        <div>
          {@html row?.properties?.title}
          <br />
          <div class="grid grid-cols-5 mt-2">
            <div class="col-span-2">
              <span class=" text-xs">
                Category:
                <span class="px-1 bg-orange-300 text-black"
                  >{row?.properties?.category_slug
                    ? row?.properties?.category_slug
                    : "Uncategorised"}</span
                ></span
              ><br />
              <span class="text-xs">
                Source:
                <a
                  href={row?.properties?.link}
                  target="
              _blank"
                >
                  <span class="px-1 bg-red-300 text-black"
                    >{getDomainFromUrl(row?.properties?.link)}
                    <Link class="inline" size="10" /></span
                  >
                </a>
              </span>

              <br />
              <span class=" text-xs">
                Location:
                <span class="px-1 bg-orange-300 text-black"
                  >{row?.properties?.natural_locations_openai}</span
                ></span
              ><br />
              <span class=" text-xs">
                Article Dated
                <span class="px-1 bg-orange-300 text-black"
                  >{row?.properties?.date.slice(0, 10)}</span
                ></span
              >
              <!-- <div class="w-full">
            <Button
              iconDescription="Locate"
              icon={LocationFilled}
              onclick={() => handleClick(row)}
              kind="tertiary"
              size="small"
            ></Button>
          </div> -->
            </div>

            <div class="excerpt space-y-2 col-span-3">
              {@html row?.properties?.excerpt?.replace("<p>", "")}
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
      </div>
    {/each}
  </div>
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
</style>
