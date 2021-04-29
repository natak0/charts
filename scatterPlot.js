//data preparation
const filterData = (data) => {
    return data.filter(d=>{return (d.year == 2020)})
}

//main

// scatter plot data
const prepareScatterData = (items) => {
    const itemsClean = filterData(items);
    const scatterData =itemsClean.sort((a, b) => { return b.healthy_life_expectancy_at_birth - a.healthy_life_expectancy_at_birth });
    
    return scatterData;
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
    const width = 500;
    const height = 500;
    const widthChart = width - margin.left - margin.right;
    const heightChart = height - margin.top - margin.bottom;

    //Scales
    const xExtent = d3
        .extent(data, d => d.healthy_life_expectancy_at_birth !== '' ? d.healthy_life_expectancy_at_birth : null)
        .map((d, i) => i === 0 ? d * 0.95 : d * 1.05);//remove dots from axis
    const yExtent = d3
        .extent(data, d => d.social_support)
        .map((d,i) => (i===0 ? d*0.95 : d*1.05));

    const xScale = d3
        .scaleLinear()
        .domain(xExtent)
        .range([0, widthChart]);
    const yScale = d3
        .scaleLinear()
        .domain(yExtent)
        .range([heightChart, 0])
    
    //draw chart base
    const svg = d3.select('.scatter-plot__container')
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
        .text('Social Support vs. Healthy Life expectation');
    header
        .append('tspan')
        .attr('x', 0)
        .attr('dy','1.5em')
        .style('font-size', '0.8em')
        .style('fill', 'gray')
        .text('All countries from World Happiness Report 2020')

    // draw scatter plot
    const scatter = svg
        .append('g')
        .attr('class','scatter-points')
        .selectAll('scatter')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'scatter')
        .attr('cy', d => yScale(d.social_support))
        .attr('cx', d => xScale(d.healthy_life_expectancy_at_birth))
        .attr('r', 3)
        .style('fill', 'blue')
        .style('fill-opacity', 0.7);
    
    function formatTicks(d) {
        return d3.format('~s')(d);
    }
    // draw axes //
    const xAxis = d3
        .axisBottom(xScale)
        .ticks(5)
        .tickFormat(formatTicks) // add space between values //
        .tickSizeInner(-heightChart)
        .tickSizeOuter(0);
    const yAxis = d3
        .axisLeft(yScale)
        .ticks(5)
        //.tickFormat(formatTicks)
        .tickSizeOuter(0)
        .tickSize(0);
    
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
        .call(addLabel, 'Life Expectancy', 25);
    
    xAxisDraw.selectAll('text').attr('dy','1em')

    const yAxisDraw = svg
        .append('g')
        .attr('class', 'y-axis')
        .call(yAxis)
        .call(addLabel, 'Social Support', 15);
    
    yAxisDraw
        .selectAll('text')
        .attr('dx', '-0.6em')
}
//load data
let obj;

async function getData () {
    await d3.csv('data/world-happiness-report.csv', type)
        .then(res => { obj = prepareScatterData(res) })
        .catch(error => console.log(error));
    console.log('obj', obj, 'scatter', obj);
    defineChart(obj);
}
getData();