<script>
  /**
   * A context menu that appears on right-click.
   * Provides a search range slider and a freeze button.
   * When the freeze button is clicked, the map is frozen and the search range is disabled.
   * When the freeze button is clicked again, the map is unfrozen and the search range is enabled.
   */
  import { fade } from "svelte/transition"
  import {searchRange} from "./stores"
  /**
   * The mouse position of the context menu.
   * @type {number[]}
   */
  let mousePosition;
  /**
   * Whether the context menu is visible.
   * @type {boolean}
   */
  let contextmenu = false;
  /**
   * The timeout for the context menu.
   * @type {number}
   */
  let rightClickTimeout;
  /**
   * Whether the map is frozen.
   * @type {boolean}
   */
  let freezeStatus = false;
  /**
   * The context menu element.
   * @type {HTMLElement}
   */
  let contextMenuElement;
  /**
   * The event listener for clicks outside of the context menu.
   * @type {EventListener}
   */
  let clickEventListener;
  /**
   * The event listener for mouse moves outside of the context menu.
   * @type {EventListener}
   */
  let moveoutEventListener

  /**
   * Create the context menu on right-click.
   * @param {MouseEvent} e The right-click event.
   */
  const rightClickContextMenu = (e) => {
    e.preventDefault();
    document.removeEventListener("click", clickEventListener);
    document.removeEventListener("mousemove", moveoutEventListener);

    contextmenu = true;
    mousePosition = [e.clientX, e.clientY];

    rightClickTimeout = setTimeout(() => {
      //if mouse moves outside of the context menu, close it
      moveoutEventListener = document.addEventListener("mousemove", (event) => {
        if (!contextMenuElement || !contextMenuElement.contains(event.target)) {
          contextmenu = false;
        }
      });
    }, 5000);

    //create a event listener for click outside
    clickEventListener = document.addEventListener("click", (event) => {
      if (!contextMenuElement || !contextMenuElement.contains(event.target)) {
        contextmenu = false;
      }
    });
  };

  /**
   * Toggle the freeze status of the map.
   */
  const toggleFreeze = () => {
    const mapContainer = document.getElementById("map");

    if (!freezeStatus) {
      freezeStatus = true;
      contextmenu = true;
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
</script>

<svelte:window on:contextmenu|preventDefault={rightClickContextMenu} />
{#if contextmenu}
  <div
    class="contextmenu bg-neutral-800 text-white text-[0.6rem] w-[10vw] absolute z-10 p-2"
    style="top: {mousePosition[1]}px; left: {mousePosition[0]}px;"
    bind:this={contextMenuElement}
    transition:fade
  >
    <div class="slidecontainer">
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
    </div>
    <button
      class="hover:bg-neutral-700 rounded-none w-full p-1"
      on:click={toggleFreeze}>{freezeStatus ? "Unfreeze" : "Freeze and study"}</button
    >
  </div>
{/if}

<style>
  input {
    size: 2px;
  }
</style>
