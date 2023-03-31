<script>
  import { searchLayer } from "./lib/search.js";
  import Map, {map, dbLayer} from "./Map.svelte";
  import SelectedFeatures from "./SelectedFeatures.svelte";
  let funcs, searchQuery;
</script>

<main>
  <Map />
  <div id="left-bar" class="p-4">
    <div id="meta-info" class="m-3">
      <h1 class="font-bold text-3xl ">Explorer for Hindutva Watch</h1>
      <h3>This is a prototype to explore linked stories of Hindutva</h3>
    </div>

    <!-- <div id="">
      <button
        on:click={() => funcs.loadSavedData()}
        class="btn btn-dark btn-small"
        id="load">Load GeoJSON</button
      >
    </div> -->

    <div id="search" class="m-2">
      <input
        type="text"
        id="search-input"
        bind:value={searchQuery}
        class="rounded-md text-white p-1"
        placeholder="Search for an event"
      />
      <button
        on:click={() => searchLayer(dbLayer, searchQuery, map)}
        class="rounded-md p-1 bg-slate-700"
        id="search-button">Search</button
      >
    </div>
  </div>
  <div id="right-bar">
    <SelectedFeatures />
  </div>
</main>

<style>
  #left-bar {
    position: absolute;
    top: 5%;
    left: 5%;
    width: 40%;
  }

  #right-bar {
    position: absolute;
    top: 5%;
    right: 5%;
    width: 40%;
  }
  #left-bar,
  #right-bar {
    z-index: 2000;
    padding: 1em;
    text-align: left;
    color: black;
    border-radius: 10px;
    background-color: antiquewhite;
    max-width: 20%;
  }

  #meta-info {
    
  }
</style>
