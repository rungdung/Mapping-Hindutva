<script>
  import Search from "$lib/Search.svelte";
  import Timeline from "$lib/Timeline.svelte";
  import RightBar from "$lib/RightBar.svelte";

  export let eventsInHighlight;
  export let searchRange;
  export let map;
</script>

<div class="h-screen py-5">
  <div class="mx-20 mt-[15vh] h-[50vh] ">
    <div class="mb-10 md:w-[50vh] ">
      <h1 class="title">
        <i class="text-orange-200">always</i> more than<wbr /> what was
        <wbr />reported.
      </h1>
      <nav
        class="text-xs list-none flex gap-2 mt-3 underline !text-neutral-600"
      >
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
      </nav>
    </div>

    <h3 class="meta-body text-sm">
      This is a prototype to explore linked stories of Hindutva, communal
      violence and related incidents. <br /> <br />
    </h3>

    <div class="overflow-y-scroll h-full">
      <RightBar {eventsInHighlight} bind:searchRange />
    </div>
  </div>
</div>

<style lang="postcss">
  .title {
    font-family: Junicode;
    font-variation-settings:
      "wght" 600,
      "wdth" -70;
    line-height: 2.2rem;
    font-size: 2.7rem;
    word-break: normal;
  }

  #meta-info li a {
    @apply text-neutral-600;
  }

  .meta-body {
    font-family: Junicode;
    font-variation-settings:
      "wght" 400,
      "wdth" 100;
  }
</style>
