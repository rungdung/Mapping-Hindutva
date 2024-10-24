<script>
  import { fade } from "svelte/transition";

  export let searchRange;
  let mousePosition;
  let contextmenu = false;
  let rightClickTimeout;
  let freezeStatus = false;
  let contextMenuElement;
  let clickEventListener;
  let moveoutEventListener

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
      <label for="search-range">Search Range: {searchRange}km</label>
      <input
        type="range"
        id="search-range"
        min="1"
        max="300"
        step="1"
        class="w-full px-auto"
        bind:value={searchRange}
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