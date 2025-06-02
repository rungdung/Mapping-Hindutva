<script>
  import MapContainer from "$lib/MapContainer.svelte";
  import RightBar from "$lib/RightBar.svelte";
  import LeftBar from "$lib/LeftBar.svelte";
  import {
    lookingGlassBool,
    eventsInHighlight,
    singleEventInHighlight,
    firstLoad,
  } from "$lib/stores";
  import "carbon-components-svelte/css/g100.css";
  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Checkbox,
  } from "carbon-components-svelte";

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

<ComposedModal
  open={$firstLoad}
  class="bg-neutral-800 opacity-60"
  on:click:button--primary={() => ($firstLoad = false)}
>
  <ModalHeader label="A guide to using the explorer" class="title !text-3xl" title="Where does Hate live?A media explorer" />
  <ModalBody hasForm>
    <div class="md:grid grid-cols-6 gap-4">
      <div class="md:col-span-3">
        <video class="w-full" src="/demo.webm" autoplay loop muted controls></video>
      </div>
      <div class="md:col-span-3">
        We live in a world where an incredibly wide variety of hate reaches us
        in real life, and online. There exists relationships between people, organisations, online accounts and other entities that enables this hate. This is across geography, internet, time and countries, much of which is not apparent in the deluge of news that we read. This geolocated newsmedia archive has been created to illustrate these relationships. This is a work in progress.

        {#if width<768}
        <p class="bg-orange-200 my-3 text-black text-xl p-4">It appears you are on a mobile device. This interface has been designed for a desktop experience. Please use on a laptop.</p>
        {/if}
      </div>
    </div>
  </ModalBody>
  <ModalFooter secondaryButtonText="Explore!" />
</ComposedModal>

<div
  id=""
  class="absolute md:h-screen md:left-4 md:top-0 z-20 !text-gray-600 md:w-[20vw] {openDrawer
    ? 'blur-sm opacity-60'
    : 'blur-none opacity-100'}"
>
  <LeftBar />
</div>
<div
  class="grid h-screen {width < 768
    ? 'grid-cols-1 grid-rows-2'
    : 'grid-cols-[4fr_2fr]'}  z-10 w-screen max-h-screen {openDrawer
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
      >Open Search Results</Drawer.Trigger
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

<style>
  :global(.bx--btn--primary) {
    background-color: #e07272 !important;
  }
  :global(.bx--modal-container){
    background-color: black !important;
    @apply rounded-md;
  }
</style>
