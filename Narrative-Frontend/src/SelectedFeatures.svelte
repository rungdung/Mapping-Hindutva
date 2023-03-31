<!-- SelectedFeaturesList.svelte -->
<script>
  import { selectedFeatures } from "./stores.js";
  import "leaflet"
  import {map} from "./Map.svelte";
  
  let highlightLayer = new L.FeatureGroup();

  function zoomToFeature(feature){
    highlightLayer.clearLayers();
    console.log("Zooming to feature")

    // Add a circle marker to highlight the feature
    highlightLayer.addLayer(new L.CircleMarker(feature.geometry.coordinates.reverse(), {
        radius: 30,
        color: "#ff7800",
        weight: 5,
        opacity: 0.65
    }));


    map.flyTo(feature.geometry.coordinates, 8);
    highlightLayer.addTo(map);

  }
</script>


<h2 class="font-semibold text-xl ">Events in focus</h2>

{#if $selectedFeatures.length > 0}
  <ul>
    {#each $selectedFeatures as feature}
      <li>{@html feature.properties.title}</li>
      <!-- To zoom to selected feature-->
      <button on:click={() => zoomToFeature(feature)}
        class="bg-slate-700">
        Zoom to event
      </button>
    {/each}
  </ul>
{:else}
  <p>No events selected. Please open an event and click, "Add to list"</p>
{/if}

<style>
button {
  margin-top: 0.2em;
  size: 1em;
  padding: 0.2em 0.5em;
}

ul {
  list-style-type: none;
  padding: 1em;
}
</style>