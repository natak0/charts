//conversion for types
const type = (d) => {
    return {
        country_name: d.country_name,
        year: d.year,
        life_ladder: d.life_ladder,
        gdp_per_capita: d.gdp_per_capita,
        social_support: d.social_support,
        healthy_life_expectancy_at_birth: d.healthy_life_expectancy_at_birth,
        freedom_life_choices: d.freedom_life_choices,
        generosity: d.generosity,
        perceptions_of_corruption: perceptions_of_corruption,
        positive_affect: d.positive_affect,
        negative_affect: d.negative_affect
    }
}

//d3.csv('data/2021_1T_OD_Arbrat_Parcs_BCN.csv').then(res => { console.log(res) });

//load data
d3.csv('data/world-happiness-report.csv', type).then(res => { console.log(res) });

/* const happy = d3.csv('data/world-happiness-report.csv');
const happy2021 = d3.csv('data/world-happiness-report-2021.csv');
Promise.all([happy, happy2021]).then(res => {
    console.log('double requests:',res)
}) */