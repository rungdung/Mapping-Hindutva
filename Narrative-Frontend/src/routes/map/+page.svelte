<script>
  import MapContainer from "$lib/MapContainer.svelte";
  import RightBar from "$lib/RightBar.svelte";
  import LeftBar from "$lib/LeftBar.svelte";
  import {
    lookingGlassBool,
    eventsInHighlight,
    singleEventInHighlight,
  } from "../../lib/stores";
  import { onMount } from "svelte";
  import { Button, Modal, ToastNotification } from "carbon-components-svelte";
  import { Drawer } from "vaul-svelte";

  let openDrawer = false;
  let width;

  onMount(() => {
    let params = new URLSearchParams(window.location.search);
    let displayType = params.get("view");
    if (displayType == "looking_glass") {
      $lookingGlassBool = true;
    } else if (displayType == "map") {
      $lookingGlassBool = false;
    }
  });

  $: openDrawer =
    $eventsInHighlight?.features?.length > 0 &&
    !$singleEventInHighlight &&
    width < 768
      ? true
      : false;
</script>

<svelte:window bind:innerWidth={width} />
<div
  id=""
  class="absolute md:left-1 md:top-1 z-20 !text-gray-600 md:w-[20vw] md:p-4 {openDrawer
    ? 'blur-sm opacity-60'
    : 'blur-none opacity-100'}"
>
  <LeftBar />
</div>
<div
  class="grid h-screen {width < 768
    ? 'grid-cols-1 grid-rows-2'
    : 'grid-cols-[3fr_2fr]'}  z-10 w-screen max-h-screen {openDrawer
    ? 'blur-sm'
    : 'blur-none'}"
>
  <MapContainer />
  {#if width > 768}
    <RightBar />
  {/if}
</div>
{#if width < 768}
  <Drawer.Root direction="bottom" bind:open={openDrawer}>
    <Drawer.Trigger class="fixed bottom-0 right-0 left-0 z-30"
      >Open</Drawer.Trigger
    >
    <Drawer.Overlay class="fixed inset-0 bg-black/40" />
    <Drawer.Portal>
      <Drawer.Content
        class="fixed flex flex-col bg-neutral-800 border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 md:left-auto md:top-0 right-0  h-[80vh] mx-[-1px]z-40 z-30 back"
      >
        <RightBar />
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/if}

<div
  class="absolute left-2 bottom-2 z-20 !text-gray-600 p-10 text-xs!important"
>
  <ToastNotification
    title="Disclaimer:"
    subtitle="This project is not for public distribution yet, it is a prototype to
    explore linked stories of Hate, communal violence and related incidents.
    Use your cursor to navigate the map, events within the looking-glass around
    your cursor will be highlighted on the left. To read more about the events
    being highlighted, right-click and pause the looking glass."
  />
</div>

<style lang="postcss">
  :global(.bx--btn--primary) {
    background-color: #e07272 !important;
  }
</style>
