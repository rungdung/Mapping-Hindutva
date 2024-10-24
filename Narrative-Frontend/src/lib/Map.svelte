<script>
  // @ts-ignore
  import maplibre from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";
  import { onMount, onDestroy } from "svelte";
  import MarkerPopup from "./MarkerPopup.svelte";
  import { fade } from "svelte/transition";
  import {
    buffer,
    point,
    bbox,
    bboxPolygon,
    pointsWithinPolygon,
  } from "@turf/turf";
    import ContextMenu from "./ContextMenu.svelte";

  /**
   * The public MapTiler key used for the map style.
   * @type {string}
   */
  const publicMaptilerKey = "XtQybTQjRpKFSRHVSG0G";

  /**
   * The map object.
   * @type {maplibre.Map}
   */
  export let map;


  /**
   * The map container element.
   * @type {HTMLElement}
   */
  let mapContainer;

  /**
   * The main data, downloaded.
   * @type {Blob}
   */
  let resourceBlob;

  /**
   * The buffer polygon around the cursor, it is circular
   * @type {GeoJSON.Feature<GeoJSON.Polygon>}
   */
  let bufferPolygon;

  /**
   * The events within the radius of the cursor
   * @type {GeoJSON.FeatureCollection<GeoJSON.Point>}
   */
  export let eventsInHighlight;

  let debounceTimer;
  let shadowOffsetY;

  export let searchRange = 50;
  /**
   * Fetches the resource from the server and adds it to the map.
   * @returns {Promise<void>}
   */
  async function getResource() {
    return await fetch("/HWdb_23_09_2024_openai_geocoded_final.geojson").then(async (response) => {
      return response.json();
    });
  }

  // Function to draw the circle and shadow
  const drawCircle = () => {
    const canvas = document.getElementById("circleCanvas");
    canvas.style.display = "none";
    const ctx = canvas.getContext("2d");

    // Define circle properties
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 30;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Add shadow properties
    // ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    // ctx.shadowBlur = 60;
    // ctx.shadowOffsetX = -60; // Fixed horizontal shadow offset
    // ctx.shadowOffsetY = shadowOffsetY; // Dynamic Y offset based on pitch

    // Draw circle (repositioned to center with enough space for shadow)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "transparent"; // Transparent inner fill
    ctx.strokeStyle = "black"; // Circle stroke
    ctx.lineWidth = 30; // Circle thickness
    ctx.fill();
    ctx.stroke();
  };

  /**
   * Adds the layer to the map.
   * @returns {void}
   */
  const addLayer = async () => {
    resourceBlob = await getResource();

    // Add source and layer to the map
    map.addSource("hwdb", {
      type: "geojson",
      data: resourceBlob,
    });

    map.addLayer({
      id: "point",
      type: "circle",
      source: "hwdb",
      paint: {
        "circle-radius": 4,
        "circle-color": "gray",
        "circle-opacity": 0.5,
      },
    });

    // Initial circle drawing
    drawCircle();

    map.addSource("buffer", {
      type: "canvas",
      canvas: "circleCanvas",
      coordinates: [
        [75.99829734320153, 22.95840468059591],
        [77.96495488768724, 22.95840468059591],
        [77.96495488768724, 24.75704540804498],
        [75.99829734320153, 24.75704540804498],
      ],
    });

    map.addLayer({
      id: "buffer",
      type: "raster",
      source: "buffer",
    });

    map.addSource("highlights", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    map.addLayer({
      id: "highlights-points",
      type: "circle",
      source: "highlights",
      paint: {
        "circle-radius": 4,
        "circle-color": "red",
        "circle-opacity": 0.5,
      },
    });

    map.on("click", "point", async (e) => {
      let properties = e.features[0].properties;
      const coordinates = e.features[0].geometry.coordinates.slice();

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      let popup = new maplibre.Popup()
        .setLngLat(coordinates)
        .setHTML("")
        .addTo(map);
      let child = popup.getElement();

      let p = new MarkerPopup({
        target: child.children[1],
        anchor: null,
        props: {
          title: properties.title,
          excerpt: properties.excerpt,
          date: properties.date,
          link: properties.link,
          locations: properties.natural_locations_openai,
          map: map,
          coordinates: coordinates,
          point: e.point,
        },
      });
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on("mouseenter", "point", async () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "point", async () => {
      map.getCanvas().style.cursor = "";
    });
  };

  /**
   * Event handler for map initialization and resource loading.
   * @returns {void}
   */
  onMount(async () => {
    // Map initialization
    map = new maplibre.Map({
      container: mapContainer,
      style: `https://api.maptiler.com/maps/5b0fdf12-ac62-4bd8-975b-50ac01e3abbd/style.json?key=${publicMaptilerKey}`,
      center: [77.695313, 23.160563],
      pitch: 32,
      bearing: 20,
      zoom: 3,
      maxZoom: 14,
      minZoom: 3,
      transformRequest: (url) => {
        // cache header
        return {
          url: url,
          cache: "force-cache",
        };
      },
    });

    map.on("load", async () => {
      addLayer();
    });

    // // Adjust shadow height based on map pitch
    // map.on("pitch", () => {
    //   let pitch = map.getPitch();
    //   // Map pitch typically goes from 0 to 60, adjust the shadow height proportionally
    //   shadowOffsetY = -((80 * pitch) / 20); // Modify this formula for different effects

    //   // Redraw circle with updated shadow height
    //   drawCircle();
    // });

    /**
     * Create a buffer polygon around the cursor
     * Get all the points within the buffer
     * Highlight the points
     */
    map.on("mousemove", async (e) => {
      let mousePosition = [e.lngLat.lng, e.lngLat.lat];
      bufferPolygon = buffer(point(mousePosition), searchRange);
      let bboxBuffer = bboxPolygon(bbox(bufferPolygon.geometry)).geometry
        .coordinates[0];
      bboxBuffer.pop();

      map.getSource("buffer").setCoordinates(bboxBuffer);

      // debounce the function
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        eventsInHighlight = pointsWithinPolygon(resourceBlob, bufferPolygon);
        map.getSource("highlights").setData({
          type: "FeatureCollection",
          features: eventsInHighlight.features,
        });
      }, 10);
    });

  });


  onDestroy(() => {
    if (map) map.remove();
  });
</script>

<!-- Map and sidebar section -->
<section id="map" class="h-screen">
  <div class="h-full w-full" bind:this={mapContainer} />
</section>
<canvas id="circleCanvas" class="circleCanvas" width="800" height="800" />

<ContextMenu bind:searchRange />
