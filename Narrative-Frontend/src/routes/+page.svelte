<script>
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
  
    let mounted = false;
  
    onMount(() => {
      mounted = true;
    });
  
    async function handleNav(href) {
      mounted = false;
      await new Promise(resolve => setTimeout(resolve, 300)); // Shorter transition time
      goto(href);
    }
  </script>
  
  {#if mounted}
    <div 
      class="mx-auto"
      in:fade="{{ duration: 400 }}"
      out:fade="{{ duration: 300 }}"
    >
      <h1 
        class="title"
        in:fade="{{ duration: 500, delay: 100 }}"
        out:fade="{{ duration: 300 }}"
      >
        Spatial archive of Hindutva and related ethno-violence
      </h1>
      
      <br>
      
      <div 
        class="flex gap-4 justify-center"
        in:fade="{{ duration: 500, delay: 200 }}"
        out:fade="{{ duration: 300 }}"
      >
        <button 
          on:click={() => handleNav('/map')}
          class="bg-neutral-700 text-xs px-4 py-2 rounded hover:bg-neutral-600 transition-colors"
        >
          Map View
        </button>
        
        <!-- <button 
          on:click={() => handleNav('/map?view=looking_glass')}
          class="bg-neutral-700 text-xs px-4 py-2 rounded hover:bg-neutral-600 transition-colors"
        >
          Looking glass
        </button> -->
        
        <button 
          on:click={() => handleNav('/about')}
          class="bg-neutral-700 text-xs px-4 py-2 rounded hover:bg-neutral-600 transition-colors"
        >
          About
        </button>
      </div>
    </div>
  {/if}
  
  <style>
    .title {
      @apply text-2xl font-bold mb-6 text-center;
    }
  </style>