<script>
  import MapContainer from "$lib/MapContainer.svelte";
  import RightBar from "$lib/RightBar.svelte";
  import LeftBar from "$lib/LeftBar.svelte";
  import {eventsInHighlight, searchRange, map} from "../lib/stores";

  let height;

</script>

<div class="grid md:grid-cols-8">
  <div id="meta-info" class="m-4  md:col-span-4 text-white h-screen    ">
    <LeftBar  />
  </div>
  <div class="md:col-span-4 md:p-0 border-8 border-double border-yellow-50/60">
    <MapContainer  />
  </div>
</div>

<style lang="postcss">

</style>
