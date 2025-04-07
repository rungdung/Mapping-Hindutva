<script>
    import { eventsInHighlight, filteredEvents, singleEventInHighlight } from "./stores.js";
    import { Button, MultiSelect } from "carbon-components-svelte";
    import { onMount } from "svelte";

    // Get all unique categories from events
    $: categories = [...new Set($eventsInHighlight?.map(event => 
      event?.properties?.category_slug || "Uncategorised"
    ))];
    
    // Get all unique groups involved from events
    $: allGroups = [...new Set($eventsInHighlight?.flatMap(event => 
      event?.properties?.involved ? eval(event.properties.involved) : []
    ))];
    
    // Get min and max dates from events
    $: dateRange = $eventsInHighlight?.reduce((acc, event) => {
      const date = event?.properties?.date?.slice(0, 10);
      if (date) {
        const dateObj = new Date(date);
        if (!acc.min || dateObj < acc.min) acc.min = dateObj;
        if (!acc.max || dateObj > acc.max) acc.max = dateObj;
      }
      return acc;
    }, { min: null, max: null });
    
    // Filter state
    let selectedCategories = [];
    let selectedGroups = [];
    
    // Custom date range slider variables
    let sliderContainer;
    let sliderTrack;
    let leftHandle;
    let rightHandle;
    let rangeSelection;
    let isDraggingLeft = false;
    let isDraggingRight = false;
    let sliderWidth = 0;
    let leftPos = 0;     // 0-100%
    let rightPos = 100;  // 0-100%
    
    let minDate, maxDate;
    let dateMarkers = [];
    
    // Initialize date range and markers when events are loaded
    $: if (dateRange?.min && dateRange?.max) {
      minDate = dateRange.min;
      maxDate = dateRange.max;
      
      // Create markers for years and months
      const startYear = minDate.getFullYear();
      const endYear = maxDate.getFullYear();
      
      // Calculate total months between min and max dates
      const totalMonths = (endYear - startYear) * 12 + maxDate.getMonth() - minDate.getMonth() + 1;
      dateMarkers = [];
      
      // Create markers for each year
      for (let year = startYear; year <= endYear; year++) {
        const yearDate = new Date(year, 0, 1);
        // Skip if before min date
        if (yearDate < minDate) continue;
        // Skip if after max date
        if (yearDate > maxDate) break;
        
        const percentage = calculateDatePercentage(yearDate);
        dateMarkers.push({
          position: percentage,
          label: year.toString(),
          isYear: true
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
              isYear: false
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
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[month];
    }
    
    // Format date for display
    function formatDate(date) {
      if (!date) return '';
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
    
    // Calculate start and end dates based on slider values
    $: startDate = dateRange?.min && dateRange?.max ? getDateFromPercentage(leftPos) : null;
    $: endDate = dateRange?.min && dateRange?.max ? getDateFromPercentage(rightPos) : null;
    
    // Handle mouse events for the slider
    function handleMouseDown(e, handle) {
      if (handle === 'left') {
        isDraggingLeft = true;
      } else if (handle === 'right') {
        isDraggingRight = true;
      }
      
      // Prevent text selection during drag
      document.body.style.userSelect = 'none';
      
      // Add event listeners for move and up
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseUp);
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
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
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
    
    onMount(() => {
      updateRangeSelection();
    });
    
    // Apply filters
    $: {
      if ($eventsInHighlight) {
        $filteredEvents = $eventsInHighlight?.filter(event => {
          // Category filter
          const categoryMatch = selectedCategories.length === 0 || 
            selectedCategories.includes(event?.properties?.category_slug || "Uncategorised");
          
          // Date filter
          const eventDate = event?.properties?.date ? new Date(event.properties.date.slice(0, 10)) : null;
          const dateMatch = (!startDate || !eventDate || eventDate >= startDate) && 
                            (!endDate || !eventDate || eventDate <= endDate);
          
          // Groups filter
          const eventGroups = event?.properties?.involved ? eval(event.properties.involved) : [];
          const groupsMatch = selectedGroups.length === 0 || 
            eventGroups.some(group => selectedGroups.includes(group));
          
          return categoryMatch && dateMatch && groupsMatch;
        });
      }
    }
  </script>
  
  <div class="filters-container p-2 bg-gray-800 rounded mb-2 text-xs">
    <h3 class="text-sm font-bold mb-1 text-orange-300">Filters</h3>
    
    <!-- Custom Date Range Slider -->
    <div class="mb-2 ">
      <h4 class="text-xs font-semibold mb-1 text-orange-200">Date Range</h4>
      
      <!-- Custom slider implementation -->
      <div class="custom-slider" bind:this={sliderContainer}>
        <!-- Base track -->
        <div class="slider-track" bind:this={sliderTrack}></div>
        
        <!-- Selected range -->
        <div class="range-selection" bind:this={rangeSelection}></div>
        
        <!-- Handles -->
        <div 
          class="handle handle-left" 
          bind:this={leftHandle}
          on:mousedown={(e) => handleMouseDown(e, 'left')}
        >
          <div class="handle-grip"></div>
        </div>
        <div 
          class="handle handle-right" 
          bind:this={rightHandle}
          on:mousedown={(e) => handleMouseDown(e, 'right')}
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
              <div class="marker-label">{marker.label}</div>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Selected range display -->
      <div class="date-display">
        <span>{startDate ? formatDate(startDate) : 'N/A'}</span>
        <span>to</span>
        <span>{endDate ? formatDate(endDate) : 'N/A'}</span>
      </div>
    </div>
    
    <!-- Categories Filter -->
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
    
    <!-- Groups Filter
    <div class="mb-2">
      <h4 class="text-xs font-semibold mb-1 text-orange-200">Involved Groups</h4>
      <MultiSelect
        titleText=""
        placeholder="Choose groups"
        items={allGroups.map(group => ({ id: group, text: group }))}
        selectedIds={selectedGroups}
        on:select={({ detail }) => selectedGroups = detail.selectedIds}
        size="sm"
      />
    </div> -->
    
    <!-- Filter Actions -->
    <div class="flex justify-between mt-2">
      <Button 
        kind="danger" 
        size="sm"
        on:click={resetFilters}
      >
        Reset
      </Button>
      
      <div class="text-xs text-orange-200">
        {$filteredEvents?.length}/{$eventsInHighlight?.length} events
      </div>
    </div>
  </div>
  
  <style>
    .filters-container {
      border: 1px solid #555;
      font-size: 0.75rem;
      @apply mx-2;
    }
    
    /* Custom date slider styles */
    .custom-slider {
      position: relative;
      height: 24px;
      margin: 20px 15px 40px;
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
    
    .handle-grip::before, .handle-grip::after {
      content: "";
      height: 1px;
      width: 6px;
      background-color: rgba(0, 0, 0, 0.3);
    }
    
    .handle-grip::before {
      box-shadow: 0 3px 0 rgba(0, 0, 0, 0.3), 0 6px 0 rgba(0, 0, 0, 0.3);
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
    
    .date-display {
      display: flex;
      justify-content: space-between;
      color: #e0b072;
      font-size: 0.7rem;
      margin-top: -10px;
    }
    
    /* Override Carbon component styles */
    :global(.filters-container .bx--label) {
      color: #faf6eb;
      font-size: 0.75rem;
    }
    
    :global(.filters-container .bx--text-input, 
            .filters-container .bx--dropdown,
            .filters-container .bx--list-box__field) {
      background-color: #333;
      color: #faf6eb;
      border-color: #555;
      height: 2rem;
      min-height: 2rem;
    }
    
    :global(.filters-container .bx--list-box) {
      height: auto;
      min-height: 2rem;
    }
    
    :global(.filters-container .bx--list-box__menu) {
      max-height: 12rem;
    }
    
    :global(.filters-container .bx--list-box__menu-item) {
      height: 1.5rem;
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }
    
    :global(.filters-container .bx--btn) {
      padding: 0.25rem 0.75rem;
      min-height: 1.5rem;
      height: 1.5rem;
    }
  </style>