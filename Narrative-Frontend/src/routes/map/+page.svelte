<script>
  import MapContainer from "$lib/MapContainer.svelte";
  import RightBar from "$lib/RightBar.svelte";
  import LeftBar from "$lib/LeftBar.svelte";
  import { lookingGlassBool } from "../../lib/stores";
  import { onMount } from "svelte";
  import { Button, Modal } from "carbon-components-svelte";
  import Search from "../../lib/Search.svelte";
  let height;
  let modalOpen = true;

  onMount(() => {
    let params = new URLSearchParams(window.location.search);
    let displayType = params.get("view");
    if (displayType == "looking_glass") {
      $lookingGlassBool = true;
    } else if (displayType == "map") {
      $lookingGlassBool = false;
    }
  });
</script>

<div id="" class="absolute left-2 top-2 z-20 !text-gray-600 w-[20vw] p-10">
  <LeftBar />
  <Search />
</div>
<div class="grid grid-cols-[3fr_2fr] z-10 w-screen">
  <MapContainer />
  <RightBar />
</div>

<Modal
  bind:open={modalOpen}
  modalHeading="Disclaimer"
  primaryButtonText="Continue"
  on:click:button--primary={() => (modalOpen = false)}
  on:open
  on:close
  on:submit
>
  <p>
    This project is not for public distribution yet, it is a prototype to
    explore linked stories of Hindutva, communal violence and related incidents.
    Use your cursor to navigate the map, events within the looking-glass around
    your cursor will be highlighted on the left. To read more about the events
    being highlighted, right-click and pause the looking glass.
  </p>
</Modal>

<style lang="postcss">
  :global(.bx--btn--primary) {
    background-color: #e07272 !important;
  }
</style>
