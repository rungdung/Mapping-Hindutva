<script>
  import {
    eventsInHighlight,
    filteredEvents,
    resourceBlob,
    singleEventInHighlight,
  } from "./stores.js";
  import { Button, Checkbox, MultiSelect } from "carbon-components-svelte";
  import { getDomainFromUrl } from "./utils.js";
  import { onMount } from "svelte";

  // Get all unique categories from events
  $: categories = [
    ...new Set(
      $eventsInHighlight?.map(
        (event) => event?.properties?.category_slug || "Uncategorised",
      ),
    ),
  ];

  //   // Get all unique groups involved from events
  //   $: allGroups = [
  //     ...new Set(
  //       $eventsInHighlight?.flatMap((event) =>
  //         event?.properties?.involved ? eval(event.properties.involved) : [],
  //       ),
  //     ),
  //   ];

  // Get min and max dates from events
  $: dateRange = $eventsInHighlight?.reduce(
    (acc, event) => {
      const date = event?.properties?.date?.slice(0, 10);
      if (date) {
        const dateObj = new Date(date);
        if (!acc.min || dateObj < acc.min) acc.min = dateObj;
        if (!acc.max || dateObj > acc.max) acc.max = dateObj;
      }
      return acc;
    },
    { min: null, max: null },
  );

  // Filter state
  let selectedCategories = [];
  let selectedGroups = [];
  let selectedSources = $resourceBlob.map((item) => {
    return item.sourceLink;
  });

  // Custom date range slider variables
  let sliderContainer;
  let sliderTrack;
  let leftHandle;
  let rightHandle;
  let rangeSelection;
  let isDraggingLeft = false;
  let isDraggingRight = false;
  let sliderWidth = 0;
  let leftPos = 0; // 0-100%
  let rightPos = 100; // 0-100%

  let minDate, maxDate;
  let dateMarkers = [];

  // Create data structure for event counts by year and month
  $: eventCountsByYearAndMonth = $eventsInHighlight?.reduce((acc, event) => {
    if (event?.properties?.date) {
      const dateObj = new Date(event.properties.date.slice(0, 10));
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth();

      // Initialize year if needed
      if (!acc[year]) {
        acc[year] = { total: 0, months: Array(12).fill(0) };
      }

      // Increment counts
      acc[year].total++;
      acc[year].months[month]++;
    }
    return acc;
  }, {});

  // Initialize date range and markers when events are loaded
  $: if (dateRange?.min && dateRange?.max) {
    minDate = dateRange.min;
    maxDate = dateRange.max;

    // Create markers for years and months
    const startYear = minDate.getFullYear();
    const endYear = maxDate.getFullYear();

    // Calculate total months between min and max dates
    const totalMonths =
      (endYear - startYear) * 12 + maxDate.getMonth() - minDate.getMonth() + 1;
    dateMarkers = [];

    const yearStep = Math.max(1, Math.floor(totalMonths / 12 / 10) + 1);

    // Create markers for each year
    for (let year = startYear; year <= endYear; year += yearStep) {
      const yearDate = new Date(year, 0, 1);
      // Skip if before min date
      if (yearDate < minDate) continue;
      // Skip if after max date
      if (yearDate > maxDate) break;

      const percentage = calculateDatePercentage(yearDate);
      dateMarkers.push({
        position: percentage,
        label: year.toString(),
        count: eventCountsByYearAndMonth?.[year]?.total || 0,
        isYear: true,
        year: year,
      });

      // Add month markers only if less than 24 months total (to avoid crowding)
      if (totalMonths <= 24) {
        // Add markers for each quarter (3 months)
        for (let month = 3; month <= 9; month += 3) {
          const monthDate = new Date(year, month, 1);
          // Skip if before min date or after max date
          if (monthDate < minDate || monthDate > maxDate) continue;

          const monthPercentage = calculateDatePercentage(monthDate);
          dateMarkers.push({
            position: monthPercentage,
            label: getMonthAbbr(month),
            isYear: false,
          });
        }
      }
    }
  }

  // Helper to calculate percentage position between min and max dates
  function calculateDatePercentage(date) {
    const totalRange = maxDate.getTime() - minDate.getTime();
    const position = date.getTime() - minDate.getTime();
    return (position / totalRange) * 100;
  }

  // Helper to get date from percentage
  function getDateFromPercentage(percentage) {
    const totalRange = maxDate.getTime() - minDate.getTime();
    const position = (percentage / 100) * totalRange;
    return new Date(minDate.getTime() + position);
  }

  // Helper to get month abbreviation
  function getMonthAbbr(month) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[month];
  }

  // Function to get CSS color class based on event count
  function getHeatmapColor(count, maxCount) {
    if (!count) return "bg-gray-700";

    const intensity = Math.min(Math.ceil((count / maxCount) * 5), 5);

    switch (intensity) {
      case 1:
        return "bg-orange-900";
      case 2:
        return "bg-orange-800";
      case 3:
        return "bg-orange-700";
      case 4:
        return "bg-orange-600";
      case 5:
        return "bg-orange-500";
      default:
        return "bg-gray-700";
    }
  }

  // Calculate maximum monthly event count for heatmap scaling
  $: maxMonthlyCount = Object.values(eventCountsByYearAndMonth || {}).reduce(
    (max, yearData) => {
      const yearMax = Math.max(...yearData.months);
      return Math.max(max, yearMax);
    },
    0,
  );

  // Format date for display
  function formatDate(date) {
    if (!date) return "";
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  }

  // Calculate start and end dates based on slider values
  $: startDate =
    dateRange?.min && dateRange?.max ? getDateFromPercentage(leftPos) : null;
  $: endDate =
    dateRange?.min && dateRange?.max ? getDateFromPercentage(rightPos) : null;

  // Handle mouse events for the slider
  function handleMouseDown(e, handle) {
    if (handle === "left") {
      isDraggingLeft = true;
    } else if (handle === "right") {
      isDraggingRight = true;
    }

    // Prevent text selection during drag
    document.body.style.userSelect = "none";

    // Add event listeners for move and up
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseUp);
  }

  function handleMouseMove(e) {
    if (!sliderContainer) return;

    const rect = sliderContainer.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    let percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));

    // Update position based on which handle is being dragged
    if (isDraggingLeft) {
      // Ensure left handle doesn't go past right handle
      leftPos = Math.min(percentage, rightPos - 5);
    } else if (isDraggingRight) {
      // Ensure right handle doesn't go before left handle
      rightPos = Math.max(percentage, leftPos + 5);
    }

    updateRangeSelection();
  }

  function handleMouseUp() {
    isDraggingLeft = false;
    isDraggingRight = false;
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mouseleave", handleMouseUp);
  }

  function updateRangeSelection() {
    if (rangeSelection) {
      rangeSelection.style.left = `${leftPos}%`;
      rangeSelection.style.width = `${rightPos - leftPos}%`;
    }
    if (leftHandle) {
      leftHandle.style.left = `${leftPos}%`;
    }
    if (rightHandle) {
      rightHandle.style.left = `${rightPos}%`;
    }
  }

  // Reset filters
  function resetFilters() {
    selectedCategories = [];
    selectedGroups = [];
    leftPos = 0;
    rightPos = 100;
    updateRangeSelection();
  }

  onMount(async () => {
    updateRangeSelection();
  });

  $: {
    if ($eventsInHighlight) {
      // First sort by date
      const sortedEvents = [...$eventsInHighlight].sort((a, b) => {
        const dateA = a?.properties?.date
          ? new Date(a.properties.date.slice(0, 10))
          : new Date(0);
        const dateB = b?.properties?.date
          ? new Date(b.properties.date.slice(0, 10))
          : new Date(0);
        return dateA.getTime() - dateB.getTime();
      });

      $filteredEvents = sortedEvents?.filter((event) => {
        // Category filter
        const categoryMatch =
          selectedCategories.length === 0 ||
          selectedCategories.includes(
            event?.properties?.category_slug || "Uncategorised",
          );

        // Date filter
        const eventDate = event?.properties?.date
          ? new Date(event.properties.date.slice(0, 10))
          : null;
        const dateMatch =
          (!startDate || !eventDate || eventDate >= startDate) &&
          (!endDate || !eventDate || eventDate <= endDate);

        // Groups filter
        const eventGroups = event?.properties?.involved
          ? eval(event.properties.involved)
          : [];
        const groupsMatch =
          selectedGroups.length === 0 ||
          eventGroups.some((group) => selectedGroups.includes(group));

        // Source filter
        const sourceUrl = event?.properties?.link || "";
        const domain = getDomainFromUrl(sourceUrl);

        const sourceMatch =
          selectedSources.length === 0 ||
          selectedSources.some((source) => source === domain);

        return categoryMatch && dateMatch && groupsMatch && sourceMatch;
      });
    }
  }
</script>

<div class="filters-container p-2 bg-gray-800 rounded text-xs">

  <!-- Custom Date Range Slider -->
  <div class="mb-2">
    <div class="date-display">
      <span>{startDate ? formatDate(startDate) : "N/A"}</span>
      <span>to</span>
      <span>{endDate ? formatDate(endDate) : "N/A"}</span>
    </div>
    <!-- Custom slider implementation -->
    <div class="custom-slider" bind:this={sliderContainer}>
      <!-- Selected range display -->

      <!-- Base track -->
      <div class="slider-track" bind:this={sliderTrack}></div>

      <!-- Selected range -->
      <div class="range-selection" bind:this={rangeSelection}></div>

      <!-- Handles -->
      <div
        class="handle handle-left"
        bind:this={leftHandle}
        on:drag={(e) => handleMouseDown(e, "left")}
      >
        <div class="handle-grip"></div>
      </div>
      <div
        class="handle handle-right"
        bind:this={rightHandle}
        on:drag={(e) => handleMouseDown(e, "right")}
      >
        <div class="handle-grip"></div>
      </div>

      <!-- Date markers -->
      <div class="date-markers">
        {#each dateMarkers as marker}
          <div
            class="date-marker {marker.isYear ? 'year-marker' : 'month-marker'}"
            style="left: {marker.position}%"
          >
            <div class="marker-line"></div>
            <div class="marker-label">
              {marker.label}
              {#if marker.isYear && marker.count !== undefined}
                <span class="event-count">({marker.count})</span>
              {/if}
            </div>
          </div>
        {/each}
      </div>

      <!-- Heatmap for monthly events -->
      {#if dateRange?.min && dateRange?.max}
        <div class="heatmap">
          {#each Object.entries(eventCountsByYearAndMonth || {}) as [year, yearData]}
            {#each yearData.months as monthCount, monthIndex}
              {#if new Date(parseInt(year), monthIndex) >= minDate && new Date(parseInt(year), monthIndex) <= maxDate}
                {@const position = calculateDatePercentage(
                  new Date(parseInt(year), monthIndex, 15),
                )}
                <div
                  class="heatmap-cell {getHeatmapColor(
                    monthCount,
                    maxMonthlyCount,
                  )}"
                  style="left: {position}%"
                  title="{getMonthAbbr(monthIndex)} {year}: {monthCount} events"
                ></div>
              {/if}
            {/each}
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Categories Filter
 -->
  <div class="grid grid-cols-2 gap-x-10">
    <div class="mb-2 col-span-1">
      <h4 class="text-xs font-semibold mb-1 text-orange-200">
        Filter by source
      </h4>

      <MultiSelect
        placeholder="Choose sources"
        items={$resourceBlob.map((resource) => ({
          id: resource.sourceLink,
          text: resource.sourceLink,
        }))}
        bind:selectedIds={selectedSources}
        size="sm"
      />
    </div>
    <div class="mb-2">
        <h4 class="text-xs font-semibold mb-1 text-orange-200">Categories</h4>
        <MultiSelect
          titleText=""
          placeholder="Choose categories"
          items={categories.map(category => ({ id: category, text: category }))}
          selectedIds={selectedCategories}
          on:select={({ detail }) => selectedCategories = detail.selectedIds}
          size="sm"
        />
      </div>
  </div>

  <!-- Filter Actions -->
  <div class="flex justify-between mt-2">
    <Button kind="danger-tertiary" size="sm" on:click={resetFilters}>Reset</Button>

    <div class="text-xs text-orange-200">
      {$filteredEvents?.length}/{$eventsInHighlight?.length} events
    </div>
  </div>
</div>

<style>
  .filters-container {
    border: 1px solid #555;
    font-size: 0.75rem;
  }

  /* Custom date slider styles */
  .custom-slider {
    position: relative;
    height: 24px;
    margin: 10px 5px 50px; /* Increased bottom margin for heatmap */
    user-select: none;
  }

  .slider-track {
    position: absolute;
    width: 100%;
    height: 6px;
    background-color: #444;
    border-radius: 3px;
    top: 9px;
  }

  .range-selection {
    position: absolute;
    height: 6px;
    background-color: #e0b072;
    border-radius: 3px;
    top: 9px;
    left: 0;
    width: 100%;
  }

  .handle {
    position: absolute;
    top: 0;
    width: 16px;
    height: 24px;
    background-color: #e0b072;
    border-radius: 4px;
    cursor: grab;
    transform: translateX(-50%);
    z-index: 2;
  }

  .handle:active {
    cursor: grabbing;
  }

  .handle-left {
    left: 0;
  }

  .handle-right {
    left: 100%;
  }

  .handle-grip {
    position: absolute;
    top: 6px;
    left: 5px;
    width: 6px;
    height: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .handle-grip::before,
  .handle-grip::after {
    content: "";
    height: 1px;
    width: 6px;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .handle-grip::before {
    box-shadow:
      0 3px 0 rgba(0, 0, 0, 0.3),
      0 6px 0 rgba(0, 0, 0, 0.3);
  }

  /* Date markers */
  .date-markers {
    position: absolute;
    top: 15px;
    left: 0;
    width: 100%;
    height: 30px;
    pointer-events: none;
  }

  .date-marker {
    position: absolute;
    transform: translateX(-50%);
  }

  .marker-line {
    width: 1px;
    background-color: #e0b072;
  }

  .year-marker .marker-line {
    height: 8px;
    background-color: #e0b072;
  }

  .month-marker .marker-line {
    height: 4px;
    background-color: #888;
  }

  .marker-label {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.6rem;
    color: #e0b072;
    white-space: nowrap;
  }

  .year-marker .marker-label {
    color: #e0b072;
    font-weight: 600;
  }

  .month-marker .marker-label {
    color: #aaa;
    font-size: 0.5rem;
    top: 6px;
  }

  .event-count {
    font-size: 0.6rem;
    color: #e0b072;
    margin-left: 2px;
  }

  /* Heatmap styles */
  .heatmap {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    height: 24px;
    pointer-events: none;
  }

  .heatmap-cell {
    position: absolute;
    width: 8px;
    height: 16px;
    border-radius: 2px;
    transform: translateX(-50%);
    margin-top: 2px;
  }

  .date-display {
    display: flex;
    justify-content: space-between;
    color: #e0b072;
    font-size: 0.7rem;
    margin-bottom: 5px; /* Adjusted for heatmap */
  }



</style>
