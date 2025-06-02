<script>
  import Search from "$lib/Search.svelte";
  import { title } from "$lib/stores";
  import Legend from "./Legend.svelte";
</script>

<div class="md:mt-4 bg-neutral-800 p-4 space-y-10">
<div class="">
  <div class=" ">
    <div class="text-white space-y-2 prose">
      <h1 class="title">{$title}</h1>
      <p class="text-xs/1 prose text-left">
        <bold class="text-bold">An archive of news:</bold> What kind of hatecrimes, hatespeech, disinformation and other manifestations of hate have been reported in your village, your city or maybe even the street next to yours?
      </p>
      <nav
        class="text-xs list-none flex gap-2 mt-3 underline !text-neutral-600"
      >
        <li>
          <a href="/about">About</a>
        </li>
      </nav>
    </div>
  </div>
</div>

<div>
  <Search />
</div>
</div>

<div class="md:absolute md:bottom-5 ">
  <Legend />
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
