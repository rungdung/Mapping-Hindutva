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


<h2>Selected Features</h2>

{#if $selectedFeatures.length > 0}
  <ul>
    {#each $selectedFeatures as feature}
      <li>{feature.properties.title}</li>
      <!-- To zoom to selected feature-->
      <button on:click={() => zoomToFeature(feature)}
        class="btn btn-dark"/>
        Zoom to feature
    {/each}
  </ul>
{:else}
  <p>No features selected.</p>
{/if}
