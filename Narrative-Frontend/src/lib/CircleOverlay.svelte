<script>
  import { onMount, onDestroy } from "svelte";
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
    lookingGlassBool,
  } from "./stores.js";
  import { debounce } from "$lib/utils.js";
  let canvas;
  let mouseMoveUnsubscribe;
  const drawCircle = () => {
    if (!canvas) return;
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
    // Extract coordinate setting to a separate function for clarity
    const bufferCoordinates = [
      [75.99829734320153, 22.95840468059591],
      [77.96495488768724, 22.95840468059591],
      [77.96495488768724, 24.75704540804498],
      [75.99829734320153, 24.75704540804498],
    ];
    if ($map.getSource("buffer")) {
    } else {
      $map.addSource("buffer", {
        type: "canvas",
        canvas: canvas,
        coordinates: bufferCoordinates,
      });
      $map.addLayer({
        id: "buffer",
        type: "raster",
        source: "buffer",
      });
    }
    if ($map.getSource("hwdb-highlight")) {
    } else {
      $map.addSource("hwdb-highlight", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      $map.addLayer({
        id: "hwdb-highlight",
        type: "circle",
        source: "hwdb-highlight",
        paint: {
          "circle-color": "#fed7aa",
          "circle-opacity": 0.5,
          "circle-radius": 5,
        },
      });
    }
  };
  // Separate function for handling mouse move logic
  const handleMouseMove = async (e) => {
    const mousePosition = [e.lngLat.lng, e.lngLat.lat];
    const bufferPolygon = await buffer(point(mousePosition), $searchRange);
    const bboxBuffer =
      await bboxPolygon(bbox(bufferPolygon.geometry))?.geometry?.coordinates?.[0] ??
      [];
    // Remove last coordinate to close polygon
    bboxBuffer.pop();
    $map.getSource("buffer")?.setCoordinates(bboxBuffer);
    $eventsInHighlight = [];
    let layersToSearch = $resourceBlob
      .filter((layer) => layer.visibility === true)
      .map((layer) => layer);
    layersToSearch.forEach((layer) => {
      $eventsInHighlight.push(
        ...pointsWithinPolygon(layer.blob, bufferPolygon).features,
      );
    });
    $map.getSource("hwdb-highlight")?.setData({
      type: "FeatureCollection",
      features: $eventsInHighlight,
    });
    // //move layer to top
    $map.moveLayer("hwdb-highlight");
  };
  // Use the debounced version of handleMouseMove
  const debouncedMouseMove = debounce(handleMouseMove, 2);
  // Reactive statement to set up mouse move listener
  $: if ($loadStatus.dataLoaded && $map) {
    // Remove previous listener if exists
    if (mouseMoveUnsubscribe) {
      mouseMoveUnsubscribe();
    }
    // Add new listener
    $map.on("mousemove", debouncedMouseMove);
    mouseMoveUnsubscribe = () => $map.off("mousemove", debouncedMouseMove);
  }
  onMount(() => {
    drawCircle();
  });
  onDestroy(() => {
    // Clean up event listener
    if (mouseMoveUnsubscribe) {
      mouseMoveUnsubscribe();
    }
  });
</script>

<canvas
  bind:this={canvas}
  id="circleCanvas"
  class="circleCanvas"
  width="800"
  height="800"
/>
