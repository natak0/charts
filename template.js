
//data preparation


//main


//utilities


//conversion for types


//d3 chart
//dimensions
const defineChart = (data) => {
    const margin = { top: 20, right: 30, bottom: 30, left: 150 };
    const width = 800;
    const height = 1000;
    const widthChart = width - margin.left - margin.right;
    const heightChart = height - margin.top - margin.bottom;
}
    //scales
    
    //draw base
    const svg = d3.select('.')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // draw x axis
    // draw y axis

    //load data
