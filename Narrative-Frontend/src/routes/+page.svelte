<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import About from "$lib/Body.svx";
  import { title } from "$lib/stores";

  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  async function handleNav(href) {
    mounted = false;
    await new Promise((resolve) => setTimeout(resolve, 300)); // Shorter transition time
    goto(href);
  }
</script>

{#if mounted}
  <div
    class="mx-auto px-2 h-[40vh] md:w-1/2 my-40"
    in:fade={{ duration: 400 }}
    out:fade={{ duration: 300 }}
  >
    <h1
      class="title"
      in:fade={{ duration: 500, delay: 100 }}
      out:fade={{ duration: 300 }}
    >
      {$title}
    </h1>

    <br />

    <div
      class=" gap-4 h-full"
      in:fade={{ duration: 500, delay: 200 }}
      out:fade={{ duration: 300 }}
    >
      <About />
      <button
        on:click={() => handleNav("/map?view=map")}
        class="bg-neutral-700 text-xs px-4 py-2 rounded hover:bg-neutral-600 transition-colors"
      >
        Map View
      </button>
    </div>
  </div>
{/if}

<style>
  .title {
    @apply text-2xl font-bold mb-6;
  }
</style>
