<svelte:options accessors={true} />

<script context=module>
  export let map;
  export let dbLayer;
</script>

<script>
  import { onMount } from "svelte";
  import "leaflet/dist/leaflet.css";
  import "leaflet/dist/leaflet.js";
  import "leaflet.markercluster";
  import "leaflet.markercluster/dist/MarkerCluster.css";
  import "leaflet.markercluster/dist/MarkerCluster.Default.css";

  import Popup from "./MarkerPopup.svelte";
  

  onMount(() => {
    // Initialize Leaflet map
    map = L.map("map", {
      renderer: L.canvas(),
    }).setView([13.086066, 77.609997], 7);

    // Add OpenStreetMap tiles
    var tileLayer = L.tileLayer(
      "https://api.mapbox.com/styles/v1/rungdung/clftq8tyw001r01nwuzgk0gic/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicnVuZ2R1bmciLCJhIjoiY2tqeWh6cXF4MDgzMjJvbWVmbGQzYjAwMyJ9.U-aJyoqyKvTXlhVk43jV1A",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Mapbox Imagery',
        maxZoom: 20,
        minZoom: 3,
        maxBounds: [
          [12.846638, 77.125397],
          [13.283409, 78.016663],
        ],
        renderer: L.canvas(),
      }
    );
    tileLayer.addTo(map);

    // Initialize a layer group for comments
    dbLayer = L.markerClusterGroup().addTo(map);

    loadSavedData();
  });

  export async function loadSavedData() {
    // load geojson data
    const response = await fetch("HWdb_geocoded.geojson");
    var data = await response.json();

    // add geojson layer from db
    L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        let popupContainer = document.createElement("div");
        new Popup({
          target: popupContainer,
          props: {
            title: feature.properties.title,
            date: feature.properties.date,
            link: feature.properties.link,
            excerpt: feature.properties.excerpt,
            feature: feature,
          },
        });
        layer.bindPopup(popupContainer);
      },
    }).addTo(dbLayer);
  }
</script>

<main>
  <div id="map" />
</main>

<style>
  #map {
    height: 100vh;
    width: 100vw;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Change cursor when mousing over clickable layer */
  .leaflet-clickable {
    cursor: crosshair !important;
  }
  /* Change cursor when over entire map */
  .leaflet-container {
    cursor: help !important;
  }

  .leaflet-popup-content-wrapper,
  .leaflet-popup-tip {
    background: transparent;
    transform: translate(10%, 5%);
    box-shadow: 0 0 0 0 !important;
  }

  .leaflet-popup-close-button {
    transform: translate(-78px, 40px);
  }

  .btn {
    margin: 0.04em;
  }

  .popup {
    width: 800px;
  }

  .leaflet-popup-content {
    width: 400px !important;
  }
  .leaflet-popup-content-wrapper {
    min-height: 40vh;
  }

  .btn-sm {
    padding: 0.1em 0.3em !important;
  }
</style>
