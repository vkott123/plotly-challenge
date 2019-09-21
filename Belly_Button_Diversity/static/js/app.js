function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  var url = `/metadata/${sample}`;

  console.log(url);

  d3.json(url).then(function(data) {  
    var sample_metadata = d3.select("#sample-metadata");
      console.log(sample_metadata);
      
    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    Object.entries(data).forEach(([key, value]) => {
      sample_metadata
      .append("p")
      .text(`${key}: ${value}`)
      console.log(`${key}: ${value}`);      
    });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

    // Enter a speed between 0 and 180: 180/9 = 20
    var level = data.WFREQ;

    // Trig to calc meter point
    var degrees = 180 - (level*10),
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ type: 'scatter',
      x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'washFreq',
        text: level,
        hoverinfo: 'text+name'},
      {values: [48/8, 48/8, 48/8, 48/8, 48/8, 48/8, 48/8, 48/8, 48/8, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5',
       '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['rgba(0, 181, 15, .5)', 'rgba(14, 127, 0, .5)', 'rgba(18, 140, 0, .5)', 'rgba(59, 130, 9, .5)', 'rgba(110, 154, 22, .5)',
                            'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                            'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                            'rgba(255, 255, 255, 0)']},
      labels: ['8-9', '7-8', '6-7', '5-6','4-5', '3-4', '2-3', '1-2', '0-1', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: 'Belly Button Washing Frequency <br> Scrubs per Week',
      height: 500,
      width: 500,
      xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };

Plotly.newPlot('gauge', data, layout);
  });

  }

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;

    console.log(url)

  d3.json(url).then(function(sample_data){
    // @TODO: Build a Bubble Chart using the sample data
    var otuIds = sample_data.otu_ids;
    var sampleValues = sample_data.sample_values;
    var markerSize = sample_data.sample_values;
    var markerColor = sample_data.otu_ids;
    var otuLabels = sample_data.otu_labels;

    //Create bubbleTrace
    var bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      hovertext: otuLabels,
      mode: `markers`,
      marker: {
        color: markerColor,
        size: markerSize
      }
    };

    var bubbleData = [bubbleTrace];

    var layout = {
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Sample Values"},
      title: `Belly Button Sample: ${sample}`,
      hovermode: "closest",
    };
 
      //define bubble layout
    Plotly.newPlot("bubble", bubbleData, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var pieData = {
      values: sampleValues.slice(0, 10),
      labels: otuIds.slice(0, 10),
      hovertext: otuLabels.slice(0, 10),
      type:"pie",
    };

    // Create pieTrace
    var pieTrace = [pieData];

    var pieLayout = {
     title: `Belly Button Sample: ${sample}`,
      hovermode: "closest"
    };

    // Define pie chart layout
    Plotly.newPlot("pie", pieTrace, pieLayout);
}); 

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
