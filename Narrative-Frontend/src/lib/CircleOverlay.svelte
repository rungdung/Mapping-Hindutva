<script>
  /**
   * This component creates a canvas element and draws a circle on it.
   * It then adds the canvas as a source to the map and uses it to create
   * a buffer around the user's mouse position.
   * When the user moves the mouse, it updates the buffer and uses it to
   * select the events that are within the buffer.
   * The selected events are then displayed on the map as red circles.
   *
   */

  import { onMount } from "svelte";
  import {
    buffer,
    point,
    bbox,
    bboxPolygon,
    pointsWithinPolygon,
  } from "@turf/turf";

  import {
    eventsInHighlight,
    searchRange,
    map,
    resourceBlob,
    loadStatus,
  } from "./stores.js";

  let debounceTimer;

  /**
   * Draws a circle on the canvas element.
   * The circle is centered at the center of the canvas and has a radius
   * that is half the width of the canvas.
   */
  const drawCircle = () => {
    const canvas = document.getElementById("circleCanvas");
    canvas.style.display = "none";
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 30;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "transparent";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 30;
    ctx.fill();
    ctx.stroke();

    $map.addSource("buffer", {
      type: "canvas",
      canvas: "circleCanvas",
      coordinates: [
        [75.99829734320153, 22.95840468059591],
        [77.96495488768724, 22.95840468059591],
        [77.96495488768724, 24.75704540804498],
        [75.99829734320153, 24.75704540804498],
      ],
    });
    $map.addLayer({
      id: "buffer",
      type: "raster",
      source: "buffer",
    });

    $map.addSource("highlights", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });
    $map.addLayer({
      id: "highlights",
      type: "circle",
      source: "highlights",
      paint: {
        "circle-color": "red",
        "circle-opacity": 0.5,
        "circle-radius": 5,
      },
    })
  };

  $: if ($loadStatus.dataLoaded) {
    /**
     * When the user moves the mouse, update the buffer and use it to
     * select the events that are within the buffer.
     */
    $map.on("mousemove", async (e) => {
      let mousePosition = [e.lngLat.lng, e.lngLat.lat];
      let bufferPolygon = buffer(point(mousePosition), $searchRange);
      let bboxBuffer = bboxPolygon(bbox(bufferPolygon.geometry)).geometry
        .coordinates[0];
      bboxBuffer.pop();

      $map.getSource("buffer").setCoordinates(bboxBuffer);

      // debounce the function
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        $eventsInHighlight = pointsWithinPolygon($resourceBlob, bufferPolygon);
        $map.getSource("highlights").setData({
          type: "FeatureCollection",
          features: $eventsInHighlight.features,
        });
      }, 10);
    });
  }

  onMount(() => {
    drawCircle();
  });
</script>

<canvas id="circleCanvas" class="circleCanvas" width="800" height="800" />
