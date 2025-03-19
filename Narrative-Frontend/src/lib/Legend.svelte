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

<div class="mb-2 bg-neutral-600 text-white space-y-2 p-2">
  {#each $resourceBlob as layer}
    <div class="mt-2 text-xs grid grid-cols-5 gap-2">
      <span class="col-span-4">{layer.name}</span>
      <Checkbox
        class="text-xs col-span-1 align-middle my-auto"
        bind:checked={layer.visibility}
      ></Checkbox>
    </div>
  {/each}
</div>
