<script>
  /**
   * A component to search for events in the map.
   * It takes a map object as a prop and exposes a function to search for events.
   * The search is done by querying the "point" layer in the map and looking for
   * events that have the search query in their excerpt.
   * The matching events are then added to a new layer called "hwdb-highlight"
   * and styled as red circles.
   *
   * @param {maplibre.Map} map - The map object.
   */

  import maplibre from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";

  /**
   * The search query.
   * @type {string}
   */
  let searchQuery;

  /**
   * The map object.
   * @type {maplibre.Map}
   */
  export let map;

  /**
   * Searches for events in the map.
   * It takes the search query and looks for events that have the search query
   * in their excerpt.
   * The matching events are then added to a new layer called "hwdb-highlight"
   * and styled as red circles.
   */
  export function searchLayer() {
    /**
     * The features that match the search query.
     * @type {Array<maplibre.Feature>}
     */
    let toBehighlighted = [],
      features;
    // query the layer for the existence of a keyword in teh title
    // get random points from nearby
    let getNearbyFeatures = map.queryRenderedFeatures({
      layers: ["point"],
    });

    // loop through the properties
    // if the property exists, add it to the highlight layer
    getNearbyFeatures.forEach((element) => {
      if (
        element.properties.excerpt
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
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
      map.addLayer({
        id: "hwdb-highlight",
        type: "circle",
        source: "hwdb-highlight",
        paint: {
          "circle-radius": 10,
          "circle-color": "red",
          "circle-opacity": 0.5,
        },
      });
      features = map
        .getSource("hwdb-highlight")
        .setData({ type: "FeatureCollection", features: toBehighlighted })[
        "_data"
      ]["features"];
    }
  }
</script>

<div class="w-full flex">
  <input
    type="text"
    id="search-input"
    bind:value={searchQuery}
    class=" !text-black px-1 w-40 py-0 bg-gray-300"
    placeholder="Search for an event"
  />
  <button
    on:click={() => searchLayer()}
    class=" !text-black px-1 py-0 m-1 bg-gray-300"
    id="search-button">Search</button
  >
</div>

