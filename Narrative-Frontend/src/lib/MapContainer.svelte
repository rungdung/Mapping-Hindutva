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
      style: `https://api.maptiler.com/maps/01968bd2-6fa9-7f27-b872-668712ea8381/style.json?key=${publicMaptilerKey}`,
      center: [77.695313, 23.160563],
      pitch: 0,
      bearing: 0,
      zoom: 5,
      maxZoom: 11,
      minZoom: 4,
      transformRequest: (url) => ({ url, cache: "force-cache" }),
    });

    $map.dragRotate.disable();
    $map.keyboard.disable();

    $map.addControl(new maplibre.NavigationControl());

    // Handle map load event
    $map.on("load", async () => {
      
      const image = await $map.loadImage("rhombus.png")
      await $map.addImage('rhombus', image.data);

      const image2 = await $map.loadImage("star.png")
      await $map.addImage('star', image2.data);

      // Load ResourceLayer
      mapLoaded = true;
      $map.on("click", (event) => {
        $lookingGlassBool = false;
      });

     
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
