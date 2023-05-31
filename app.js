const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function initialize() {
  const dropdownMenu = d3.select("#selDataset");

  d3.json(url).then(data => {
    const names = data.names;

    names.forEach(name => {
      dropdownMenu
        .append("option")
        .text(name)
        .property("value", name);
    });

    const initialName = names[0];
    createPlots(initialName);
  });
}

function createDemographics(selectedValue) {
  d3.json(url).then(data => {
    const metadata = data.metadata;
    const filteredData = metadata.filter(meta => meta.id == selectedValue);
    const obj = filteredData[0];

    const metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");

    Object.entries(obj).forEach(([key, value]) => {
      metadataPanel
        .append("h5")
        .text(`${key}: ${value}`);
    });
  });
}

function createBarChart(selectedValue) {
  d3.json(url).then(data => {
    const samples = data.samples;
    const filteredData = samples.filter(sample => sample.id === selectedValue);
    const obj = filteredData[0];

    const trace = {
      x: obj.sample_values.slice(0, 10).reverse(),
      y: obj.otu_ids
        .slice(0, 10)
        .map(otu_id => `OTU ${otu_id}`)
        .reverse(),
      text: obj.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      marker: {
        color: "rgb(166,172,237)"
      },
      orientation: "h"
    };

    const data = [trace];

    Plotly.newPlot("bar", data);
  });
}

function createBubbleChart(selectedValue) {
  d3.json(url).then(data => {
    const samples = data.samples;
    const filteredData = samples.filter(sample => sample.id === selectedValue);
    const obj = filteredData[0];

    const trace = {
      x: obj.otu_ids,
      y: obj.sample_values,
      text: obj.otu_labels,
      mode: "markers",
      marker: {
        size: obj.sample_values,
        color: obj.otu_ids,
        colorscale: "Sunset"
      }
    };

    const layout = {
      xaxis: { title: "OTU ID" }
    };

    const data = [trace];

    Plotly.newPlot("bubble", data, layout);
  });
}

function createGaugeChart(selectedValue) {
  d3.json(url).then(data => {
    const metadata = data.metadata;
    const filteredData = metadata.filter(meta => meta.id == selectedValue);
    const obj = filteredData[0];

    const trace = {
      domain: { x: [0, 1], y: [0, 1] },
      value: obj.wfreq,
      title: {
        text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
        font: { size: 24 }
      },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9] },
        bar: { color: "rgb(68,166,198)" },
        steps: [
          { range: [0, 1], color: "rgb(233,245,248)" },
