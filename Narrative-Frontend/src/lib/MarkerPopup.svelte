<script>
  import * as Turf from "@turf/turf";

  export let title;
  export let date;
  export let link;
  export let excerpt;
  export let map;
  export let point;
  export let coordinates;
  export let locations;

  let searchTerm;

  async function highlightNetwork() {
    let width = 200;
    let height = 200;
    let toBehighlighted = [];
    let features;
    let parentBbox = [
      [point.x - width / 2, point.y - height / 2],
      [point.x + width / 2, point.y + height / 2],
    ];

    // query the layer for the existence of a keyword in teh title
    // get random points from nearby
    let getNearbyFeatures = map.queryRenderedFeatures(parentBbox, {
      layers: ["point"],
    });

    // loop through the properties
    // if the property exists, add it to the highlight layer
    getNearbyFeatures.forEach((element) => {
      if (
        element.properties.excerpt
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        toBehighlighted.push(element);
      }
    });

    // create a duplicate source for the highlight
    if (map.getSource("hwdb-highlight")) {
      features = map
        .getSource("hwdb-highlight")
        .setData({ type: "FeatureCollection", features: toBehighlighted })[
        "_data"
      ]["features"];
    } else {
      map.addSource("hwdb-highlight", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: "",
        },
      });
      features = map
        .getSource("hwdb-highlight")
        .setData({ type: "FeatureCollection", features: toBehighlighted })[
        "_data"
      ]["features"];
    }

    // Extract coordinates for arcs
    let arcs = features.map((highlightedPoint) => ({
      sourcePosition: coordinates,
      targetPosition: highlightedPoint._geometry.coordinates,
      sourceColor: [0, 255, 0], // RGB color for the source point
      targetColor: [255, 0, 0], // RGB color for the target point
    }));

    // convert to line features in geojson
    let arcgeojson = Turf.featureCollection(
      arcs.map((arc) =>
        Turf.lineString([arc.sourcePosition, arc.targetPosition]),
      ),
    );

    // Draw lines
    if (map.getSource("arcs")) {
      map.getSource("arcs").setData(arcgeojson);
    } else {
      map.addSource("arcs", {
        type: "geojson",
        data: arcgeojson,
      });
      map.addLayer({
        id: "arcs",
        type: "line",
        source: "arcs",
        paint: {
          "line-color": "brown",
          "line-width": 4,
          "line-opacity": 0.8,
        },
      });
    }
  }
</script>

<div class="popup">
  <h3 class="text-md">{@html title}</h3>
  <p>{date}</p>
  <a href={link}>Link to article</a>
  <p class="text-xs">{@html excerpt}</p>
  <br />
  <p>Related locations</p>

    <p>{locations}</p>

  <br />
  <div class="grid grid-cols-3">
    <input
      type="text"
      bind:value={searchTerm}
      placeholder="Search for related organisational involvement nearby"
      class="text-white p-2 rounded-lg col-span-2 "
    />
    <button
      class="bg-neutral-700 text-xs col-span-1"
      id="addToList"
      disabled={searchTerm === ""}
      on:click={highlightNetwork}
    >
      Search
    </button>
  </div>
</div>

<style lang="postcss">
  .popup {
    @apply text-black text-left p-3 rounded-md;
  }
  :global(.maplibre-gl-popup-close-button) {
    @apply text-black bg-neutral-700;
  }
  :global(.maplibregl-popup-content) {
    background: antiquewhite;
  }
</style>
