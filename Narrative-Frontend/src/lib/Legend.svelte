<script>
  import { map, resourceBlob } from "./stores";
  import { Checkbox } from "carbon-components-svelte";

  const updateVisibility = (resourceBlob) => {
    resourceBlob.forEach((layer) => {
      $map.setLayoutProperty(
        layer.layerId,
        "visibility",
        layer.visibility ? "visible" : "none"
      );
    });
  };

  // only start on being mounted
  $: if ($map?.isStyleLoaded()) {
    updateVisibility($resourceBlob);
  }
</script>

<div class="bg-neutral-800 text-white space-y-2 p-4 w-full">
  {#each $resourceBlob as layer}
    <div class="mt-2 text-xs gap-2 grid grid-cols-6 w-full">
      <Checkbox
        class="text-xs col-span-4"
        bind:checked={layer.visibility}
        labelText={layer.name + ' with ' + layer.blob.features.length + ' events'}
      ></Checkbox> <img class="col-span-2 align-middle" src="/{layer.sprite}.png"/>
    </div>
  {/each}
   <p class="!text-xs"> ⓘ Each event may not be a unique report. If a report mentions multiple places, it is placed in multiple places and is thus duplicated. Go to <a href="/about#how-it-works">How it works</a> for more info</p>  
</div>
