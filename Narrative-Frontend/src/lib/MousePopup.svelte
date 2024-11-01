<script>
    /**
     * Component that displays a helpful popup when the user moves their mouse over the map.
     * The popup will disappear after 2 seconds.
     * The popup will only appear when the mouse is hovering over the map itself,
     * and will not appear when the mouse is hovering over the popup or other elements.
     * The content of the popup is a helpful message to the user, telling them how to use the map.
     */
    import { onMount } from "svelte";
    
    let mousePopupContainer;
    /**
     * Function that handles the mouse move event.
     * It will reposition the popup to be close to the user's mouse
     * and change its opacity to 1.
     * After 2 seconds, it will change the opacity back to 0, effectively hiding the popup.
     * @param {MouseEvent} event The event that triggered this function.
     */
    const followMouse = (event) => {
        if (event.target.classList.contains("maplibregl-canvas")) {
            mousePopupContainer.style.left = `${event.clientX - 150}px`;
            mousePopupContainer.style.top = `${event.clientY + 50}px`;
            mousePopupContainer.style.opacity = "1";
            setTimeout(() => (mousePopupContainer.style.opacity = "0"), 2000);
            mousePopupContainer.textContent =
                "Right-click to adjust radius or freeze map for details";
        } else {
            mousePopupContainer.style.opacity = "0";
        }
    };

    /**
     * Add an event listener to the window to listen for mouse move events.
     * When this event is triggered, the followMouse function is called.
     */
    onMount(() => window.addEventListener("mousemove", followMouse));
</script>

<div
    class="mousePopupContainer absolute p-2 bg-orange-200 rounded-xs w-[200px] text-[0.5rem] text-black"
    bind:this={mousePopupContainer}
/>
