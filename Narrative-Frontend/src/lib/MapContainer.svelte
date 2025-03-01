<script>
  /**
   * This is the parent map container
   * It also contains a search component built in
   *
   */
  import maplibre from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";
  import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
  import { onMount, onDestroy } from "svelte";
  import ResourceLayer from "./ResourceLayer.svelte";
  import CircleOverlay from "./CircleOverlay.svelte";
  import ContextMenu from "./ContextMenu.svelte";
  import { lookingGlassBool, map, searchRange } from "./stores.js";

  // Public API key for Maptiler
  const publicMaptilerKey = "XtQybTQjRpKFSRHVSG0G";
  let mapLoaded = false;
  let mapContainer;

  /**
   * Initialize the map on component mount
   */
  onMount(() => {
    $map = new maplibre.Map({
      container: mapContainer,
      style: `https://api.maptiler.com/maps/5b0fdf12-ac62-4bd8-975b-50ac01e3abbd/style.json?key=${publicMaptilerKey}`,
      center: [77.695313, 23.160563],
      pitch: 0,
      bearing: 0,
      zoom: 3,
      maxZoom: 14,
      minZoom: 3,
      transformRequest: (url) => ({ url, cache: "force-cache" }),
    });

    $map.dragRotate.disable();
    $map.keyboard.disable();

    $map.addControl(new maplibre.NavigationControl());

    // Handle map load event
    $map.on("load", () => {
      // Load ResourceLayer
      mapLoaded = true;
    });

    $map.on("click", (event) => {
      $lookingGlassBool = false;
    });
  });

  /**
   * Clean up map resources on component destroy
   */
  onDestroy(() => {
    if ($map) $map.remove();
  });
</script>

<ContextMenu />
<section id="map" class="h-screen">
  <div class="h-full w-full" bind:this={mapContainer}>
    {#if mapLoaded}
      <ResourceLayer />
      {#if $lookingGlassBool}
        <CircleOverlay />
      {/if}
    {/if}
  </div>
</section>
