<script>
  /**
   * This is the parent map container
   * It also contains a search component built in
   * 
  */
  import maplibre from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";
  import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.mjs";
  import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
  import { onMount, onDestroy } from "svelte";
  import ResourceLayer from "./ResourceLayer.svelte";
  import CircleOverlay from "./CircleOverlay.svelte";
  import ContextMenu from "./ContextMenu.svelte";
  import { map, searchRange } from "./stores.js";

  // Public API key for Maptiler
  const publicMaptilerKey = "XtQybTQjRpKFSRHVSG0G";
  let mapContainer;
  let mapLoaded = false;

  /**
   * Geocoder API for forward geocoding using Nominatim
   */
  const geocoderApi = {
    forwardGeocode: async (config) => {
      const features = [];
      try {
        const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
        const response = await fetch(request);
        const geojson = await response.json();
        for (const feature of geojson.features) {
          const center = [
            feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
            feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
          ];
          const point = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: center,
            },
            place_name: feature.properties.display_name,
            properties: feature.properties,
            text: feature.properties.display_name,
            place_type: ["place"],
            center,
          };
          features.push(point);
        }
      } catch (e) {
        console.error(`Failed to forwardGeocode with error: ${e}`);
      }
      return { features };
    },
  };

  /**
   * Initialize the map on component mount
   */
  onMount(() => {
    $map = new maplibre.Map({
      container: mapContainer,
      style: `https://api.maptiler.com/maps/5b0fdf12-ac62-4bd8-975b-50ac01e3abbd/style.json?key=${publicMaptilerKey}`,
      center: [77.695313, 23.160563],
      pitch: 32,
      bearing: 20,
      zoom: 3,
      maxZoom: 14,
      minZoom: 3,
      transformRequest: (url) => ({ url, cache: "force-cache" }),
    });

    // Add geocoder control to the map
    $map.addControl(
      new MaplibreGeocoder(geocoderApi, { map: $map }),
    );

    // Handle map load event
    $map.on("load", () => {
      // Load ResourceLayer
      mapLoaded = true;
    });
  });

  /**
   * Clean up map resources on component destroy
   */
  onDestroy(() => {
    if ($map) $map.remove();
  });
</script>

<section id="map" class="h-screen">
  <div class="h-full w-full" bind:this={mapContainer}></div>
  {#if mapLoaded}
    <ResourceLayer />
    <CircleOverlay />
    <ContextMenu />
  {/if}
</section>

