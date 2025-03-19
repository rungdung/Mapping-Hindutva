<script>
  import { eventsInHighlight, map } from "./stores.js";
  import * as d3 from "d3";
  let timelineRef;

  $effect(() => {
    if ($eventsInHighlight?.length > 0) {
      updateTimeline();
      // debouncedUpdate();
    }
  });

  function updateTimeline() {
    if (!timelineRef) return;

    d3.select(timelineRef).selectAll("*").remove();

    if (!$eventsInHighlight) return;

    const events = $eventsInHighlight.map((item) => ({
      date: new Date(item.properties.date),
      title: item.properties.title,
      excerpt: item.properties.excerpt,
      link: item.properties.link,
      coords: item.geometry.coordinates,
      id: item.properties.id,
    }));

    if (events.length === 0) return;

    // Dynamically get the available height
    const containerWidth = timelineRef.clientWidth;
    const containerHeight = timelineRef.clientHeight;

    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = d3
      .select(timelineRef)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Group data by year and month (zero-based months)
    const groupedData = d3.group(
      events,
      (d) => d.date.getFullYear(),
      (d) => d.date.getMonth() // 0 = Jan, 11 = Dec
    );

    const barData = [];
    groupedData.forEach((months, year) => {
      months.forEach((eventsInMonth, month) => {
        barData.push({
          year: +year,
          month: +month,
          count: eventsInMonth.length,
          events: eventsInMonth,
        });
      });
    });

    // Get min and max year
    const years = [...groupedData.keys()].sort(d3.ascending);
    const months = d3.range(0, 12); // 0 = Jan, 11 = Dec

    const x = d3.scaleBand().domain(years).range([0, width]).padding(0.05);
    const y = d3.scaleBand().domain(months).range([height, 0]).padding(0.05);

    // Color scale for heatmap
    const maxCount = d3.max(barData, (d) => d.count);
    const colorScale = d3
      .scaleSequential(d3.interpolateOranges)
      .domain([0, maxCount]);

    // Draw heatmap cells
    svg
      .selectAll("rect")
      .data(barData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.year))
      .attr("y", (d) => y(d.month))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorScale(d.count))
      .on("mouseover", function () {
        d3.select(this).attr("stroke", "#000").attr("stroke-width", 1.5);
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", "#ffffff").attr("stroke-width", 1);
      });

    // X-axis (Years)
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Y-axis (Months, formatted correctly)
    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .tickFormat((monthIndex) =>
            d3.timeFormat("%b")(new Date(2000, monthIndex, 1))
          )
      );

    let legend = svg
      .append("g")
      .attr("transform", `translate(${width + 10}, 0)`)
      .attr("class", "legend");

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", colorScale(maxCount));
  }
</script>

<div id="timeline" class="w-full row-span-3" bind:this={timelineRef}></div>
