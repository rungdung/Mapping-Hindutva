<script>
  import { searchLayer } from "./lib/search.js";
  import Map from "./Map.svelte";
  import SelectedFeatures from "./SelectedFeatures.svelte";
  let funcs, searchQuery;
</script>

<main>
  <Map bind:this={funcs} />
  <div id="left-bar">
    <div id="meta-info">
      <h1>Explorer for Hindutva Watch</h1>
      <h3>On maps. A case study on Jakkuru-Sampigehalli lake</h3>
      This is a prototype to explore linked stories of Hindutva
    </div>

    <div id="">
      <button class="btn btn-dark btn-small" id="download"
        >Download GeoJSON</button
      >
      <button
        on:click={() => funcs.loadSavedData()}
        class="btn btn-dark btn-small"
        id="load">Load GeoJSON</button
      >
    </div>

    <div id="search">
      <input
        type="text"
        id="search-input"
        bind:value={searchQuery}
        placeholder="Search for a comment"
      />
      <button
        on:click={() => searchLayer(funcs.dbLayer, searchQuery, funcs.map)}
        class="btn btn-dark btn-small"
        id="search-button">Search</button
      >
    </div>
  </div>
  <div id="right-bar">
    <SelectedFeatures/>
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
  #left-bar, #right-bar{
    z-index: 2000;
    padding: 1em;
    text-align: left;
    color: black;
    border-radius: 10px;
    background-color: antiquewhite;
    max-width: 20%;
  }

  #meta-info {
    margin: 1em;
  }
</style>
