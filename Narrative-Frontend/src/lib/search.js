import "leaflet-search/dist/leaflet-search.min.css";
import "leaflet-search";
import "leaflet";

// searches a geojson layer for a given string
// zooms to the first result
// returns the number of results
let searchResultsLayer = L.featureGroup();

export function searchLayer(dbLayer, searchQuery, map) {
  searchResultsLayer.clearLayers();
  // Loop through all layers in the dbLayer group and filter based on search query
  dbLayer.eachLayer(layer => {
    if (layer.feature.properties.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) {
      searchResultsLayer.addLayer(new L.CircleMarker(layer.getLatLng(), {
        radius: 30,
        color: "#ff7800",
        weight: 5,
        opacity: 0.65
        }));
    }
  });

  // If search results are found, zoom to the bounds of the search results layer and add to map
  if (searchResultsLayer.getLayers().length > 0) {
    console.log(searchResultsLayer.getBounds());
    map.fitBounds(searchResultsLayer.getBounds());
    searchResultsLayer.addTo(map);
  } else {
    alert("No results found.");
  }
}