<script>
  import Map from "$lib/Map.svelte";
  import RightBar from "$lib/RightBar.svelte";
  import LeftBar from "$lib/LeftBar.svelte";

  let height;

  let map;
  let eventsInHighlight;
  let searchRange;

</script>

<div class="grid md:grid-cols-8">
  <div id="meta-info" class="m-4  md:col-span-4 text-white h-screen    ">
    <LeftBar {eventsInHighlight} {searchRange} bind:map />
  </div>
  <div class="md:col-span-4 md:p-0 border-8 border-double border-yellow-50/60">
    <Map bind:map bind:eventsInHighlight bind:searchRange />
  </div>
</div>

<style lang="postcss">

</style>
