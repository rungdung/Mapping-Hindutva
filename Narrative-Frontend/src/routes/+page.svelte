<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import About from "$lib/Body.svx";

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
    class="mx-auto h-[40vh]"
    in:fade={{ duration: 400 }}
    out:fade={{ duration: 300 }}
  >
    <h1
      class="title max-w-[50vw]"
      in:fade={{ duration: 500, delay: 100 }}
      out:fade={{ duration: 300 }}
    >
      What are the relationships between Law Making, Hindutva and Media
      coverage: an effort to make them apparent, but by no definition a thesis.
    </h1>

    <br />

    <div
      class=" gap-4 mt-20 justify-center h-full"
      in:fade={{ duration: 500, delay: 200 }}
      out:fade={{ duration: 300 }}
    >
      <About></About>
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
    @apply text-2xl font-bold mb-6 text-center;
  }
</style>
