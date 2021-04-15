//data preparation
const filterData = (data) => {
    return data.filter(d=>{return (d.year == 2020)})
}

const prepareBarChartData = (data) => {
    const dataMap = data.entries(data);
       // v => d3.sum(v, leaf =>leaf.life_ladder),
        //d => d.country_name )
    const dataArray = Array.from(dataMap);
   //const dataArray = Array.from(dataMap, d => ({ country: d[0], lifeLadder: d[1] }));
    return dataArray;
}

//main
const prepareData = (items) => {
    const itemsClean = filterData(items);
    const barChartData =itemsClean.sort((a, b) => { return b.healthy_life_expectancy_at_birth - a.healthy_life_expectancy_at_birth });
    console.log(items, itemsClean, barChartData);
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


//d3.csv('data/2021_1T_OD_Arbrat_Parcs_BCN.csv').then(res => { console.log(res) });
//d3 chart
//margin convention
const defineChart = (data) => {
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 500;
    const height = 500;
    const widthChart = 500 - margin.left - margin.right;
    const heightChart = 500 - margin.top - margin.bottom;

    //draw chart base
    d3.select('.bar-chart__container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    //Scales
    const xExtent = d3.extent(data, d => d.healthy_life_expectancy_at_birth!=='' ? d.healthy_life_expectancy_at_birth : null);
    console.log(xExtent);
    debugger;

    const xScale = d3.scaleLinear()
        .domain([0, xExtent])
        .range([0, 300])
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




//    .then(res => { ready(res) });

/* const happy = d3.csv('data/world-happiness-report.csv');
const happy2021 = d3.csv('data/world-happiness-report-2021.csv');
Promise.all([happy, happy2021]).then(res => {
    console.log('double requests:',res)
}) */