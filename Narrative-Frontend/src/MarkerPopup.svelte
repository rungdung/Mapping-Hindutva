<script>
  export let title;
  export let date;
  export let link;
  export let excerpt;
  export let feature;

  import { selectedFeatures } from "./stores.js";
  async function addToList() {
    selectedFeatures.update((features) => [...features, feature]);
    console.log("Clicked");
  }
</script>

<div class="popup">
  <h3>{@html title}</h3>
  <p>{date}</p>
  <a href={link}>Link to article</a>
  <p>{@html excerpt}</p>
  <br />
  <button
    class="bg-slate-700"
    id="addToList"
    on:click={() => addToList()}
  >
    Add to list
  </button>
</div>

