// URL
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Function to update bar chart
function barchart(samp,id) {
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
    title: {text:`Top 10 OTUs: for ID ${id}`,
            font: { color: "red", size: 24 }},
    height: 400,
    
  };
 // Create the bar chart
  Plotly.newPlot('bar', barch, barlayout);
}

// Function to update bubble chart
function bubblechart(samp,id) {
  let bubbletrace = {
    type: 'scatter',
    mode: 'markers',
    x: samp.otu_ids,
    y: samp.sample_values,
    text: samp.otu_labels,
    marker: {
      size: samp.sample_values,
      color: samp.otu_ids,
      colorscale: "Earth",
    
    },
  };

  let bubblech = [bubbletrace];

  let bubblelayout = {
    title: {text:`Bacteria Cultures Per Sample: for ID ${id}`, 
    font: { color: "red", size: 24 } } ,
    width: 1180,
    xaxis: { title: "OTU ID" },
    height:600

  };
 // Create the bubble chart
  Plotly.newPlot('bubble', bubblech, bubblelayout);
}

// Function to update gauge chart
function gaugechart(wfreq,id) {
  let gaugetrace = {
    type: "indicator",
    mode: "gauge+number+delta",
    value: wfreq,
    title: {
      text: `Belly Button Washing Frequency<br>Scrubs per Week:  for ID ${id}`, 
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
    barchart(sampdata,selectedvalue);
    bubblechart(sampdata,selectedvalue);
    // Get the data for the gauge chart
    let indata = data.metadata.find(metadata => metadata.id == selectedvalue); 
    let wfreq = indata.wfreq;
    gaugechart(wfreq,selectedvalue);
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

  // Select the first item from the list of names
  let initialitem = names[0];

  // Append items to the dropdown
  names.forEach((name) => {
    d3.select("#selDataset").append("option").text(name);
  });

  // Set the selected item in the dropdown to the first item
  d3.select("#selDataset").property("value", initialitem);

  // Call the optionChanged function to update the charts and metadata
  optionChanged(initialitem);
});


// Add events mousenter and mouseleave to display the type of chart 
// Bar chart
// Get the div element and add a mouseenter event listener
let bardiv = document.getElementById("bar");
bardiv.addEventListener("mouseenter", function() {
  // Create a text element to display the chart title
  let title = document.createElement("p");
  title.textContent = "Bar Chart Top 10 OTUs";

  // Style the text element to display it on top
  title.style.fontWeight = "bold";
  title.style.fontStyle = "italic";
  title.style.position = "absolute";
  title.style.top = "0"; 
  title.style.backgroundColor = "black";
  title.style.color = "yellow";
  
  // Append the text element to the div
  bardiv.appendChild(title);
});

// Add a mouseleave event listener to remove the text when the mouse leaves
bardiv.addEventListener("mouseleave", function() {
  let title = bardiv.querySelector("p");
  bardiv.removeChild(title);
 
});

// Bubble chart
// Get the div element and add a mouseenter event listener
let bubblediv = document.getElementById("bubble");
bubblediv.addEventListener("mouseenter", function() {
  // Create a text element to display the chart title
  let title = document.createElement("p");
  title.textContent = "Bubble Chart";

  // Style the text element to display it on top
  title.style.fontWeight = "bold";
  title.style.fontStyle = "italic";
  title.style.position = "absolute";
  title.style.top = "0"; 
  title.style.backgroundColor = "black";
  title.style.color = "cyan";
  
  // Append the text element to the div
  bubblediv.appendChild(title);
});

// Add a mouseleave event listener to remove the text when the mouse leaves
bubblediv.addEventListener("mouseleave", function() {
  let title = bubblediv.querySelector("p");
  bubblediv.removeChild(title);
 
});

// Gauge chart
// Get the div element and add a mouseenter event listener
let gaugediv = document.getElementById("gauge");
gaugediv.addEventListener("mouseenter", function() {
  // Create a text element to display the chart title
  let title = document.createElement("p");
  title.textContent = "Gauge Chart";

  // Style the text element to display it on top
  title.style.fontWeight = "bold";
  title.style.fontStyle = "italic";
  title.style.position = "absolute";
  title.style.top = "0"; 
  title.style.backgroundColor = "black";
  title.style.color = "magenta";
  
  // Append the text element to the div
  gaugediv.appendChild(title);
});

// Add a mouseleave event listener to remove the text when the mouse leaves
gaugediv.addEventListener("mouseleave", function() {
  let title = gaugediv.querySelector("p");
  gaugediv.removeChild(title);
 
});

