<script>
  import Search from "$lib/Search.svelte";
  import { title } from "$lib/stores";
  import Legend from "./Legend.svelte";
  import { ExpandableTile } from "carbon-components-svelte";
</script>

<div class="">
  <div class=" ">
    <div class="mb-2 bg-neutral-600 text-white space-y-2 p-2">
      <h1 class="title text-xl">{$title}</h1>
      <div class="text-xs/1!important">
        What goes on in your village, in your city, and the next street next to
        yours?
      </div>
      <nav
        class="text-xs list-none flex gap-2 mt-3 underline !text-neutral-600"
      >
        <li>
          <a href="/">About</a>
        </li>
      </nav>
    </div>
  </div>
</div>

<div>Legend</div>
<div>
  <Legend />
</div>

<div>Search</div>
<div>
  <Search />
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
