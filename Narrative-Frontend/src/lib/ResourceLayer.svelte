<script>
  /**
   * ResourceLayer component
   * This component adds a layer to the map which contains the resource data.
   * It fetches the data from the server and adds it to the map when the component is mounted.
   * It also adds a popup to the map which is displayed when the user clicks on a feature.
   * The popup is a MarkerPopup component which is passed the feature's properties as props.
   */
  import { onMount } from "svelte";
  import "maplibre-gl/dist/maplibre-gl.css";
  import {
    resourceBlob,
    map,
    loadStatus,
    eventsInHighlight,
    lookingGlassBool,
    singleEventInHighlight,
  } from "./stores";

  /**
   * Fetches the resource data from the server and returns it as a promise
   */
  async function getResource(path) {
    return await fetch(path).then((response) => response.json());
  }

  /**
   * Adds the resource layer to the map
   * This function is called when the component is mounted.
   * It fetches the resource data from the server and adds it to the map.
   * It also adds a popup to the map which is displayed when the user clicks on a feature.
   */
  const addResourceLayer = async () => {
    $resourceBlob = [
      {
        id: "hwdb",
        layerId: "hwdb-point",
        name: "Hindutva Watch aggregated News Articles",
        attribution:
          "News Articles belong to the News Agencies Cited. Aggregated by Hindutva Watch",
        sourceLink: "hindutvawatch.org",
        blob: await getResource(
          "/HWdb_23_09_2024_openai_geocoded_final.geojson",
        ),
        type: "geojson",
        layerType: "symbol",
        layerStyle: {
          "circle-radius": 4,
          "circle-color": "gray",
          "circle-opacity": 0.5,
        },
        filterVisibility: true,
        visibility: true,
        sprite: "star"
      },
      {
        id: "altnews",
        layerId: "altnews-point",
        name: "Alt News Fact Checks",
        attribution: "Fact Checks belong to AltNews",
        sourceLink: "altnews.in",
        blob: await getResource("/altnews_openai_13_03_2025_geocoded.geojson"),
        filterVisibility: true,
        visibility: true,
        type: "geojson",
        layerType: "symbol",
        layerStyle: {
          "circle-radius": 4,
          "circle-color": "green",
          "circle-stroke-color": "brown",
          "circle-stroke-width": 1,
          "circle-opacity": 0.5,
        },
        sprite: "rhombus"
      },
    ];

    $resourceBlob.forEach((layer) => {
      const images = $map.style.imageManager.images;
      console.log('Available images:', Object.keys(images));
      $map.addSource(layer.id, {
        type: layer.type,
        data: layer.blob,
        attribution: layer.attribution,
      });

      $map.addLayer({
        id: layer.layerId,
        type: layer.layerType,
        source: layer.id,
        layout: {
          'icon-image': layer.sprite,
          'icon-size': 0.5,
          'icon-allow-overlap': true,
        }
      });

      $map.on("dblclick", layer.layerId, (e) => {
        if ($lookingGlassBool == false) {
          let properties = e.features[0].properties;
          const coordinates = e.features[0].geometry.coordinates.slice();
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180)
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;

          if ($eventsInHighlight?.length > 0) {
            $eventsInHighlight = [
              e.features[0],
              ...$eventsInHighlight,
            ];
          } else {
            $eventsInHighlight = [e.features[0]];
          }

          $singleEventInHighlight = e.features[0]
        }
      });
    });

    $loadStatus.dataLoaded = true;
  };
  onMount(() => addResourceLayer());
</script>
