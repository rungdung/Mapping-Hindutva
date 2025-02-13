<script>
  import Search from "$lib/Search.svelte";
  import Timeline from "$lib/Timeline.svelte";
  import RightBar from "$lib/RightBar.svelte";

</script>

<div class="">
  <div class=" ">
    <div class="mb-2 ">
      <h1 class="title text-xl">
        Spatial archive of Hindutva and related ethno violence
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

    <!-- <h3 class=" text-xs">
      This is a prototype to explore linked stories of Hindutva, communal
      violence and related incidents. <br /> <br />
    </h3> -->
    </div>


  </div>
</div>

<style lang="postcss">


  #meta-info li a {
    @apply text-gray-600;
  }

  .meta-body {
    font-family: Junicode;
    font-variation-settings:
      "wght" 400,
      "wdth" 100;
  }
</style>
