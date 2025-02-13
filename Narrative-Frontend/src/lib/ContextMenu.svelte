<script>
  /**
   * A context menu that appears on right-click.
   * Provides a search range slider and a freeze button.
   * When the freeze button is clicked, the map is frozen and the search range is disabled.
   * When the freeze button is clicked again, the map is unfrozen and the search range is enabled.
   */
  import { fade } from "svelte/transition";
  import { searchRange } from "./stores";

  import { lookingGlassBool } from "./stores";

  import {
    ContextMenu,
    ContextMenuDivider,
    ContextMenuGroup,
    ContextMenuRadioGroup,
    ContextMenuOption,
  } from "carbon-components-svelte";

  /**
   * Whether the map is frozen.
   * @type {boolean}
   */
  let freezeStatus = false;
  let mapInteractivity = ["1"];

  /**
   * Toggle the freeze status of the map.
   */
  const toggleFreeze = () => {
    const mapContainer = document.getElementById("map");

    if (!freezeStatus) {
      freezeStatus = true;
      mapContainer.style.pointerEvents = "none";
      mapContainer.style.cursor = "none";
      mapContainer.style.filter = "blur(0px) sepia(0.1)";
    } else if (freezeStatus) {
      freezeStatus = false;
      mapContainer.style.pointerEvents = "auto";
      mapContainer.style.cursor = "auto";
      mapContainer.style.filter = "blur(0px) sepia(0)";
    }
  };

  const toggleInteractivity = (mapInteractivity) => {
    console.log(mapInteractivity)
    try {
      if  (mapInteractivity[0] == "1") {
      $lookingGlassBool = true
    } else {
      $lookingGlassBool = false
    }
    }
    catch (error) {
      console.log(error)
    }
  
  };

  $:toggleInteractivity(mapInteractivity)
</script>

<ContextMenu>
  <ContextMenuOption labelText="Change the search radius">
    <label for="search-range">Search Range: {$searchRange}km</label>
    <input
      type="range"
      id="search-range"
      min="1"
      max="300"
      step="1"
      class="w-full px-auto"
      bind:value={$searchRange}
    />
  </ContextMenuOption>
  <ContextMenuOption
    labelText={freezeStatus ? "Unfreeze" : "Freeze and study"}
    on:click={toggleFreeze}
  ></ContextMenuOption>

  <ContextMenuGroup bind:selectedIds={mapInteractivity} labelText="Map Interactivity">
    <ContextMenuOption id="1" labelText="Looking glass search" selected/>
  </ContextMenuGroup>
</ContextMenu>

<style>
  input {
    size: 2px;
  }
</style>
