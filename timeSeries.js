//data preparation
const filterData = (data) => {
    return data;
}
//main

// scatter plot data
const prepareLineChartData = (items) => {
    const itemsClean = filterData(items);
    const groupBy = d => d.year;
    const avgAge = values => d3.sum(values, leaf => leaf.perceptions_of_corruption) / values.length;
    let map1 = new Map();
     map1 = d3.rollup(itemsClean, avgAge, groupBy);
    const avgFreedom = values => d3.sum(values, leaf => leaf.freedom_life_choices) / values.length;
    const map2 = d3.rollup(itemsClean, avgFreedom, groupBy);

    // convert to array
    const valuesY = [
        ...Array.from(map1),
        ...Array.from(map2)
    ];

    const yMax = d3.max(valuesY);
    const dates = Array.from(map1).map(k => k[0]).sort((a, b) => a - b);

    const array1 = Array.from(map1).sort((a, b) => a[0] - b[0]);
    const array2 = Array.from(map2).sort((a, b) => a[0] - b[0]);

    const lineData = {
        series: [
            {
            name: 'Corruption',
            color: 'orange',
                values: array1.map(d => { return ({ date: d[0], value: d[1] }) })
             },
            {
            name: 'Freedom',
            color: 'blue',
            values: array2.map(d=>({date: d[0], value: d[1]}))
            }],
        dates: dates,
        yMax:yMax[1],
    }
    return lineData;
}


//utilities
const parseNA = string => (string === 'NA' ? undefined : string);
const parseDate = string => d3.timeParse('%Y-%m-%d')(string);

//conversion for types
const type = (d) => {
    return {
        country_name: d.country_name,
        year: d.year,
        life_ladder: d.life_ladder,
        gdp_per_capita: d.gdp_per_capita,
        social_support: d.social_support,
        healthy_life_expectancy_at_birth: parseNA(d.healthy_life_expectancy_at_birth),
        freedom_life_choices: d.freedom_life_choices,
        generosity: d.generosity,
        perceptions_of_corruption: d.perceptions_of_corruption,
        positive_affect: d.positive_affect,
        negative_affect: d.negative_affect,
    }
}


//d3 chart
//margin convention
const defineChart = (data) => {
    const margin = { top: 50, right: 100, bottom: 30, left: 150 };
    const width = 700;
    const height = 300;
    const widthChart = width - margin.left - margin.right;
    const heightChart = height - margin.top - margin.bottom;

    //Scales
    const xExtent = d3.extent(data.dates)//).map(y => { return new Date(y) }));
    const yExtent = data.yMax;

    const xScale = d3
        //.scaleTime()
        .scaleLinear()
        .domain(xExtent)
        .range([0, widthChart])
    const yScale = d3
        .scaleLinear()
        .domain([0, yExtent])
        .range([heightChart, 0])
    
    const lineGenerator = d3
        .line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value));

    //draw chart base
    const svg = d3.select('.line-series__container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // draw header

    const header = svg
        .append('g')
        .attr('class', 'scatter-plot__header')
        .attr('transform', `translate(0,${-margin.top * 0.6})`)
        .append('text');
    header
        .append('tspan')
        .text('Corruption perception and freedom over time');
    header
        .append('tspan')
        .attr('x', 0)
        .attr('dy','1.5em')
        .style('font-size', '0.8em')
        .style('fill', 'gray')
        .text('All countries from World Happiness Report, 2005-2020')

    // draw time series
    const chartGroup = svg
        .append('g')
        .attr('class', 'line-chart');
    
    chartGroup
        .selectAll('.line-series')
        .data(data.series)
        .enter()
        .append('path')
        .attr('class', d => `line-series__${d.name.toLowerCase()}`)
        .attr('d', d => lineGenerator(d.values))
        .style('fill', 'none')
        .style('stroke', d => d.color)
    
    // add labels to time lines

    chartGroup
        .append('g')
        .attr('class', '.line-series__label')
        .selectAll('.line-series__label')
        .data(data.series)
        .enter()
        .append('text')
        .attr('x', d => xScale(d.values[d.values.length - 1].date) + 5)//last data point
        .attr('y', d=> yScale(d.values[d.values.length-1].value))
        .text(d => d.name)
        .style('dominant-baseline', 'central')
        .style('font-size', '0.7em')
        .style('font-weight', 'bold')
        .style('fill', d => d.color);
    

    // draw x axes
    const xAxis = d3
        .axisBottom(xScale)
        .tickSizeOuter(0)
        //.tickFormat(d3.timeFormat("%Y"));
    
    const addLabel = (axis, label, x) => {
        axis
            .selectAll('.tick:last-of-type text')
            .clone()
            .text(label)
            .attr('x', x)
            .style('text-anchor', 'start')
    }
    
    const xAxisDraw = svg
        .append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${heightChart})`)
        .call(xAxis)
        .call(addLabel, 'Years', 25);
    

    const yAxis = d3
        .axisLeft(yScale)
        .ticks(5)
        .tickSizeOuter(0)
        .tickSizeInner(-widthChart);

    const yAxisDraw = svg
        .append('g')
        .attr('class', 'y-axis')
        .call(yAxis)
        .call(addLabel, '', 15);
    
    yAxisDraw
        .selectAll('text')
        .attr('dx', '-0.6em')
}
//load data
let obj;

async function getData () {
    await d3.csv('data/world-happiness-report.csv', type)
        .then(res => { obj = prepareLineChartData(res) })
        .catch(error => console.log(error));
    defineChart(obj);
}
getData();