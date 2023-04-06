<script context="module">
  export let nodes = [];
</script>

<script>
  import "leaflet";
  import { map } from "./Map.svelte";
  import Svelvet from "svelvet";

  import { selectedFeatures } from "./stores.js";
  import { onMount } from "svelte";

  let highlightLayer = new L.FeatureGroup();

  let edges = [];
  let id = 1;
  export let width;
  export let height

  function zoomToFeature(feature) {
    highlightLayer.clearLayers();
    console.log("Zooming to feature");

    // Add a circle marker to highlight the feature
    highlightLayer.addLayer(
      new L.CircleMarker(feature.geometry.coordinates.reverse(), {
        radius: 30,
        color: "#ff7800",
        weight: 5,
        opacity: 0.65,
      })
    );

    map.flyTo(feature.geometry.coordinates, 4);
    highlightLayer.addTo(map);
  }

  function highlightAllFeatures(feature) {
    highlightLayer.clearLayers();
    console.log("Zooming to feature");

    $selectedFeatures.forEach((feature) => {
      highlightLayer.addLayer(
        new L.CircleMarker(feature.feature.geometry.coordinates.reverse(), {
          radius: 30,
          color: "#ff7800",
          weight: 5,
          opacity: 0.9,
        })
      );
    });

    // map.flyTo(feature.geometry.coordinates, 8);
    highlightLayer.addTo(map);
  }
  
  // update nodes on load
  const features = $selectedFeatures;
  features.forEach((feature) => {
    nodes.push({
      id: `${id++}`,
      position: { x: 0, y: 0 },
      data: { html: String(feature.title) },
      width: 100,
      height: 50,
      clickCallback: () => zoomToFeature(feature.feature),
    });
  });
  // on new addition
  $: {
    const features = $selectedFeatures;
    const lastFeature = features[features.length - 1];
    if (lastFeature) {
      nodes.push({
        id: `${id++}`,
        position: { x: 0, y: 0 },
        data: { html: String(lastFeature.title) },
        width: 100,
        height: 50,
        clickCallback: () => zoomToFeature(lastFeature.feature),
      });
    }
  }

</script>

<div id="events-in-focus">
  {#key $selectedFeatures}
    <Svelvet
      nodes={nodes}
      edges={edges}
      width={width}
      height={height}
      background={true}
      bgColor={"antiquewhite"}
      nodeCreate={true}
      snap={true}
      editable
      initialZoom={1}
      shareable={false}
    />
  {/key}

  {#if nodes.length < 1}
    <p>No events selected. Please open an event and click, "Add to list"</p>
  {:else}
    <button
      on:click={() => highlightAllFeatures(selectedFeatures)}
      class="bg-slate-700"
    >
      Highlight all events
    </button>

    <button
      on:click={() => {
        selectedFeatures.set([]);
        highlightLayer.clearLayers();
        nodes = [];
      }}
      class="bg-slate-700"
    >
      Clear all events
    </button>
  {/if}
</div>

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
