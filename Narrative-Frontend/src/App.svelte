<script>
  window.global ||= window;
  import Map from "./Map.svelte";
  // import SelectedFeatures from "./SelectedFeatures.svelte";
  import Search from "./Search.svelte";
  import { CollapsibleCard } from "svelte-collapsible/dist/index.mjs";

  let innerWidth;
  let innerHeight;

  let height;

  let map;

  $: height = innerHeight / 1.4;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<main class="h-screen w-screen">
  <Map bind:map />
  <div id="left-bar" class="p-4">
    <div id="meta-info" class="m-3">
      <h1 class="font-bold text-3xl">
        Explorer for Ethno-Political activity in India
      </h1>
      <h3>
        This is a prototype to explore linked stories of Hindutva, communal
        violence and related incidents
      </h3>
    </div>

    <div id="search" class="m-2">
      <Search bind:map />
    </div>
  </div>
  <!-- <div id="right-bar" class="p-4">
  <CollapsibleCard>
      <h2 class="font-semibold text-xl " slot="header">Events in focus &#8964;</h2>
      <div slot='body'>
        <SelectedFeatures 
          height={height}/>
      </div>

  </CollapsibleCard>
</div> -->
</main>

<style>
  #left-bar {
    position: absolute;
    top: 5%;
    left: 5%;
    width: 50%;
  }

  #right-bar {
    position: absolute;
    top: 5%;
    right: 5%;
    width: 90%;
    max-width: 40% !important;
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
