<script>
    export let eventsInHighlight;
    export let searchRange=50;

    $: {
        if (eventsInHighlight){
            console.log(eventsInHighlight)
    // loop over properties, get the involved entities
    eventsInHighlight.features.forEach(element => {
        let test = element.properties.involved_groups_openai;
        console.log(test)
    });
    }
        
        
        
    }

</script>

<div id="meta-info" class="bg-neutral-600 text-white rounded-none overflow-y-auto">
    <div class="p-4 ">
        <h2 class="font-bold font-700 text-xs pt-0 mt-0">
            Events within a radius of {searchRange}km
        </h2>
        <p class= "text-xs underline mb-1   ">
            Right click to freeze and study the area in focus
        </p>
    </div>

    <ul class="text-xs columns-3 text-[0.5rem] px-4 py-0  overflow-y-auto">
        {#if eventsInHighlight}
            {#each eventsInHighlight.features as event}
                <a href={event.properties.link} target="_blank"><li class="py-2 text-white">{@html event.properties.title}</li></a>
            {/each}
        {/if}
    </ul>
</div>
