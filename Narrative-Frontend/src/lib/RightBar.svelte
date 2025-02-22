<script>
  import { eventsInHighlight, searchRange, map } from "./stores.js";

  import maplibre from "maplibre-gl";

  import {
    Datatable,
    TableHandler,
    RowsPerPage,
    ThSort,
    RowCount,
    Pagination,
  } from "@vincjo/datatables/server";

  import { mount } from "svelte";

  import MarkerPopup from "./MarkerPopup.svelte";

  let table;

  let involvedGroups = $state([]);
  let involvedGroupsFreq = $state([]);

  let canvas;
  // Update table
  let processData = (data) => {
    let events = data?.features.map((item) => ({
      id: item.id,
      title: item.properties.title,
      date: item.properties.date,
      involved: item.properties.involved_groups_openai,
      excerpt: item.properties.excerpt,
      link: item.properties.link, // Added link property
      selected: false,
      coords: item.geometry.coordinates,
    }));
    return events;
  };

  table = new TableHandler([], { rowsPerPage: 10, selectBy: "id" });

  table.load(async ({ rowsPerPage, offset, setTotalRows }) => {
    let data = processData($eventsInHighlight);
    setTotalRows(data.length);
    return data.slice(offset, offset + rowsPerPage);
  });

  table.createView([
    { index: 0, isFrozen: true },
    { index: 1, isFrozen: true },
  ]);

  const { start, end, total } = $derived(table.rowCount);
  const search = table.createSearch();

  $effect(() => {
    if ($eventsInHighlight?.features?.length > 0) {
      table.invalidate();
      involvedGroups = [];
      // debouncedUpdate();
    }
  });

  // Handle click on top of map
  let handleClick = (event) => {
    $map.flyTo({ center: event.coords, zoom: 12 });
    // create popup

    let popup = new maplibre.Popup()
      .setLngLat(event.coords)
      .setHTML("")
      .addTo($map);
    let child = popup.getElement();
    mount(MarkerPopup, {
      target: child.children[1],
      props: {
        title: event.title,
        excerpt: event.excerpt,
        date: event.date,
        link: event.link,
        map: $map,
        coordinates: event.coords,
      },
    });
  };
</script>

<div
  id="meta-info"
  class="text-[#faf6eb] rounded-none overflow-y-auto py-5 max-h-screen"
>
  <Datatable {table}>
    {#snippet header()}
      <div>
        Events under the looking glass within a radius of {$searchRange}km
      </div>
      <br />

      <p class="text-xs underline mb-1">
        Right click to freeze and study the area in focus
      </p>

      <br />
      <RowsPerPage {table} />
    {/snippet}
    <p>
      {#if involvedGroupsFreq.length > 0}
        Involved groups: {involvedGroupsFreq.join(", ")}
      {/if}
    </p>
    <input
      type="text"
      class="text-black w-full bg-gray-300 p-1"
      bind:value={search.value}
      oninput={() => search.set()}
      placeholder="Search for an event"
    />
    <table class="scrollable w-100">
      <colgroup>
        <col span="1" style="width: 20%;" />
        <col span="1" style="width: 15%;" />
        <col span="1" style="width: 60%;" />
      </colgroup>
      <thead class="bg-gray-300 text-xs">
        <tr>
          <ThSort {table} field="title" id="title">Title</ThSort>
          <ThSort {table} field="date" id="date">Date</ThSort>
          <ThSort {table} field="excerpt" id="excerpt">Excerpt</ThSort>
          <!-- <ThSort {table} field="involved">Involved</ThSort>
                   <ThSort {table} field="link">Link</ThSort> -->
        </tr>
      </thead>
      <tbody>
        {#each table.rows as row}
          <tr onclick={() => handleClick(row)}>
            <td>{@html row.title}</td>
            <td>{row.date.slice(0, 10)}</td>
            <td class="excerpt w-[10vw]"
              >{@html row.excerpt.replace("<p>", "")}</td
            >
            <!-- <td>{row.involved}</td><td>{@html row.link}</td> -->
          </tr>
        {/each}
      </tbody>
    </table>
    {#snippet footer()}
      <small>Showing {start} to {end} of {total} rows</small>

      <Pagination {table} />
    {/snippet}
  </Datatable>
</div>

<style>
  :global(table th #title) {
    width: 10rem;
  }
  table {
    table-layout: fixed;
  }

  th {
    text-align: left;
    background-color: black;
    font-weight: 800;
  }

  tr:hover {
    background-color: #e0b072 !important;
    cursor: cell;
  }
</style>
