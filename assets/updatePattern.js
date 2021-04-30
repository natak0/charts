const drawBase = () => {
    const svg = d3.select('.svg-container')
        .append('svg')
        .attr('width', 200)
        .attr('height', 200)
        .append('text');
    return svg;
}
drawBase();

function click() {
    const dataset = options[this.dataset.name];
    update(dataset);
}

function update(data) {
    svg
        .selectAll('text')
        .data(data, d => d)//control the update with the key function (check for the repeated content)
        .join(
            enter => {
                enter
                    .append('text')
                    .text(d => d)
                    .attr('x', -30)
                    .attr('y', (d, i) => i * 30 + 50)
                    .style('fill', 'blue')
                    //to return a selection not a transition
                    /*   .call(enter => enter
                        .transition()
                        .attr('x',30)), */
                    .transition()
                    .attr('x', 30)
                },
            update => {
                update
                    .transition()
                    .style('fill', 'gray')
                    .attr('y', (d, i) => i * 30 + 50)
            },
            exit => {
                exit
                    .transition()
                    .attr('x', 200)
                    .style('fill', 'tomato')
                    .remove()
            }
        )
}

//data
const options = {
    jim: ['orange', 'lemon', 'melon'],
    pam: ['orange', 'lemon'],
    andy:  ['orange', 'cherry', 'apricot', 'lemon']
}

const svg = d3.select('svg');

//listen to clicks
d3.selectAll('button').on('click', click);