function buildMetadata(sample) {

  console.log(sample);

  let url = `/metadata/${sample}`;
  d3.json(url).then(function(sample) {

    let panel = d3.select("#sample-metadata");
    panel.html("");

    Object.entries(sample).forEach(([key, value]) => {
      let cell = panel.append("p");
      cell.text(`${key}: ${value}`);
      console.log(sample);
    });
  });
}


function buildCharts(sample) { 
  let graphdata = `/samples/${sample}`;
  d3.json(graphdata).then(function (sample) {
    
    let otu_ids = sample.otu_ids;
    let sample_values = sample.sample_values;
    let otu_labels = sample.otu_labels;

    console.log(otu_ids);
    console.log(sample_values);
    console.log(otu_labels);

    let trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: 'Earth'
      }
    };

    let data = [trace];

    let layout = {
      showlegend: false,
      height: 600,
      width: 1800
    };
    Plotly.newPlot('bubble', data, layout);
  });

  d3.json(graphdata).then(function (sample2) {
    let otu_ids2 = sample2.otu_ids.slice(0, 10);
    let sample_values2 = sample2.sample_values.slice(0, 10);
    let otu_labels2 = sample2.otu_labels.slice(0, 10);

    console.log(otu_ids2);
    console.log(sample_values2);
    console.log(otu_labels2);

    let trace2 = {
      labels: otu_ids2,
      values: sample_values2,
      hoverinfo: otu_labels2,
      textinfo: 'none',
      type: 'pie'
    }
  
    let data1 = [trace2];

    let layout1 = {
      height: 500,
      width: 500
    };
    Plotly.newPlot('pie', data1, layout1);
  });
}

function init() {
  let selector = d3.select("#selDataset");

  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();
