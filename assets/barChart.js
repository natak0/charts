
//data preparation
const filterData = (data) => {
    return data.filter(d=>{return (d.year == 2020)})
}

//main
const prepareData = (items) => {
    const itemsClean = filterData(items);
    const barChartData =itemsClean.sort((a, b) => { return b.healthy_life_expectancy_at_birth - a.healthy_life_expectancy_at_birth });
    return barChartData;
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
    const margin = { top: 100, right: 30, bottom: 30, left: 150 };
    const width = 800;
    const height = 1000;
    const widthChart = width - margin.left - margin.right;
    const heightChart = height - margin.top - margin.bottom;

    //Scales
    const xExtent = d3.extent(data, d => d.healthy_life_expectancy_at_birth!=='' ? d.healthy_life_expectancy_at_birth : null);
    const xMax = d3.max(data, d => d.healthy_life_expectancy_at_birth!=='' ? d.healthy_life_expectancy_at_birth : null)


    const xScale = d3
        .scaleLinear()
        .domain(xExtent)
        .range([0, widthChart]);
    const yScale = d3
        .scaleBand()
        .domain(data.map(d => d.country_name))
        .rangeRound([0, heightChart])
        .paddingInner(0.25);
    
    //draw chart base
    const svg = d3.select('.bar-chart__container')
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
        .text('Healthy Life expectation');
    header
        .append('tspan')
        .attr('x', 0)
        .attr('dy','1.5em')
        .style('font-size', '0.8em')
        .style('fill', 'gray')
        .text('All countries from World Happiness Report 2020')
    // draw bars //
    const bars = svg
        .selectAll('bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('y', d => yScale(d.country_name))
        .attr('width', d => xScale(d.healthy_life_expectancy_at_birth))
        .attr('height', yScale.bandwidth())
        .style('fill', 'blue');
    
    function formatTicks(d) {
        return d3.format('~s')(d);
    }
    // draw axes //
    const xAxis = d3
        .axisTop(xScale)
        .tickFormat(formatTicks) // add space between values //
        .tickSizeInner(-heightChart)
        .tickSizeOuter(0);
    const yAxis = d3
        .axisLeft(yScale)
        .tickSize(0);
    
    const xAxisDraw = svg
        .append('g')
        .attr('class', 'x-axis')
        .call(xAxis);
    const yAxisDraw = svg
        .append('g')
        .attr('class', 'y-axis')
        .call(yAxis);
    
    yAxisDraw
        .selectAll('text')
        .attr('dx', '-0.6em')
}
//load data
let obj;

async function getData () {
    await d3.csv('data/world-happiness-report.csv', type)
        .then(res => { obj = prepareData(res) })
        .catch(error => console.log(error));
    console.log('obj', obj);
    defineChart(obj);
}
getData();

