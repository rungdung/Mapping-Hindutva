<script>
    import milestones from "d3-milestones";
    import "d3-milestones/build/d3-milestones.css";
    import { onMount } from "svelte";
    import { xlink_attr } from "svelte/internal";

    export let eventsInHighlight;

    // convert into an array of objects
    let events = [];

    // $: renderEvents(eventsInHighlight);
    async function renderEvents(eventsInHighlight){
        if (eventsInHighlight?.features) {
            for (let i = 0; i < eventsInHighlight.features.length; i++) {
                events[i] = {
                    year: eventsInHighlight.features[i].properties.date.slice(-4),
                    title: "test"// title: eventsInHighlight.features[i].properties.title,
                };
            }

            let timeline = milestones("#timeline")
                .mapping({
                    timestamp: "year",
                    text: "title",
                })
                .parseTime("%Y")
                .aggregateBy("year")
                .render(events);
        }
    }
</script>

<div id="timeline" class="!text-white"></div>

<style>
    #timeline {
        @apply text-white;
    }
</style>
