<script>
    /**
     * ResourceLayer component
     * This component adds a layer to the map which contains the resource data.
     * It fetches the data from the server and adds it to the map when the component is mounted.
     * It also adds a popup to the map which is displayed when the user clicks on a feature.
     * The popup is a MarkerPopup component which is passed the feature's properties as props.
     */
    import { onMount } from "svelte";
    import maplibre from "maplibre-gl";
    import "maplibre-gl/dist/maplibre-gl.css";
    import MarkerPopup from "./MarkerPopup.svelte";
    import { resourceBlob, map, loadStatus } from "./stores";

    /**
     * Fetches the resource data from the server and returns it as a promise
     */
    async function getResource() {
      return await fetch("/HWdb_23_09_2024_openai_geocoded_final.geojson").then((response) => response.json());
    }
  
    /**
     * Adds the resource layer to the map
     * This function is called when the component is mounted.
     * It fetches the resource data from the server and adds it to the map.
     * It also adds a popup to the map which is displayed when the user clicks on a feature.
     */
    const addResourceLayer = async () => {
      $resourceBlob = await getResource();
      
      $map.addSource("hwdb", { type: "geojson", data: $resourceBlob })

      $map.addLayer({
        id: "point",
        type: "circle",
        source: "hwdb",
        paint: { "circle-radius": 4, "circle-color": "gray", "circle-opacity": 0.5 },
      });
  
      $loadStatus.dataLoaded = true;
      $map.on("click", "point", (e) => {
        let properties = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  
        let popup = new maplibre.Popup().setLngLat(coordinates).setHTML("").addTo($map);
        let child = popup.getElement();
        new MarkerPopup({
          target: child.children[1],
          props: {
            title: properties.title,
            excerpt: properties.excerpt,
            date: properties.date,
            link: properties.link,
            locations: properties.natural_locations_openai,
            map: $map,
            coordinates: coordinates,
            point: e.point,
          },
        });
      });
    };
  
    onMount(() => addResourceLayer());
  </script>
