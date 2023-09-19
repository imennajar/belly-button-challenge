// URL
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Function to update bar chart
function barchart(samp) {
  let outid10 = samp.otu_ids.slice(0, 10);
  let sample10 = samp.sample_values.slice(0, 10);
  let labels10 = samp.otu_labels.slice(0, 10);

  let bartrace = {
    type: 'bar',
    orientation: 'h',
    x: sample10.reverse(),
    y: outid10.map(otu => `OTU ${otu}`).reverse(),
    hovertext: labels10.reverse(),
  };

  let barch = [bartrace];

  let barlayout = {
    title: 'Top 10 OTUs',
    height: 400
  };
 // Create the bar chart
  Plotly.newPlot('bar', barch, barlayout);
}

// Function to update bubble chart
function bubblechart(samp) {
  let bubbletrace = {
    type: 'scatter',
    mode: 'markers',
    x: samp.otu_ids,
    y: samp.sample_values,
    text: samp.otu_labels,
    marker: {
      size: samp.sample_values,
      color: samp.otu_ids,
      colorscale: 'Viridis',
      opacity: 0.5,
    },
  };

  let bubblech = [bubbletrace];

  let bubblelayout = {
    title: 'Bubble Chart',
    xaxis: { title: 'OTU IDs' },
    yaxis: { title: 'Sample Values' },
  };
 // Create the bubble chart
  Plotly.newPlot('bubble', bubblech, bubblelayout);
}

// Function to update gauge chart
function gaugechart(wfreq) {
  let gaugetrace = {
    type: "indicator",
    mode: "gauge+number+delta",
    value: wfreq,
    title: {
      text: "Belly Button Washing Frequency<br>Scrubs per Week",
      font: { color: "red", size: 24 },
      delta: { reference: 9, increasing: { color: "RebeccaPurple" } }
    },
    gauge: {
      axis: {
          range: [0, 9], 
          tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 
          
          tickcolor: "red",
          tickwidth: 3
      },
      bar: { color: "darkred" },
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "gray",
      steps: [
          { range: [0, 1], color: "lightgray" },
          { range: [1, 2], color: "lightyellow" },
          { range: [2, 3], color: "lightgreen" },
          { range: [3, 4], color: "yellow" },
          { range: [4, 5], color: "lime" },
          { range: [5, 6], color: "lightblue" },
          { range: [6, 7], color: "blue" },
          { range: [7, 8], color: "purple" },
          { range: [8, 9], color: "darkpurple" }
      ]
    }
  };

  let gaugechart = [gaugetrace];

  let gaugelayout = {
    width: 500,
    height: 400,
    margin: { t: 0, b: 0 },
    paper_bgcolor: "white"
  };

  // Create the gauge chart
  Plotly.newPlot("gauge", gaugechart, gaugelayout);
}

// Function optionChanged
function optionChanged(selectedvalue) {
  d3.json(url).then(function(data) {
    displaymetadata(selectedvalue, data);
    // Get the data for the bar and bubble chart
    let sampdata = data.samples.find(sample => sample.id === selectedvalue);
    barchart(sampdata);
    bubblechart(sampdata);
    // Get the data for the gauge chart
    let individualData = data.metadata.find(metadata => metadata.id == selectedvalue); 
    let wfreq = individualData.wfreq;
    gaugechart(wfreq);
  });
}

// Function to display sample metadata
function displaymetadata(indid, data) {
  let indata = data.metadata.find(metadata => metadata.id == indid);
  document.getElementById('sample-metadata').innerHTML = '';

  for (let [key, value] of Object.entries(indata)) {
    let p = document.createElement('p');
    p.textContent = `${key}: ${value}`;
    document.getElementById('sample-metadata').appendChild(p);
  }
}

// Populate the dropdown from the JSON data
d3.json(url).then(function(data) {
  let names = data.names;
  names.forEach((name) => {
    d3.select("#selDataset").append("option").text(name);
  });

  // Initial selected item 
  let initialitem = "940";
  displaymetadata(initialitem, data);

  // Update the charts for the initial value
  let initialsamp = data.samples.find(sample => sample.id === initialitem);
  barchart(initialsamp);
  bubblechart(initialsamp);
  let individualData = data.metadata.find(metadata => metadata.id == initialitem); 
  let wfreq = individualData.wfreq; 
  gaugechart(wfreq);
});