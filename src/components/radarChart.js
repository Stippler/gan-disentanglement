import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import useWalk from '@component/stores/walk';
import { CHART_COLORS } from './colors';
import TextField from '@mui/material/TextField';


/**
 * Calculates the x-coordinate for a point on the radar chart.
 *
 * @param {number} radius - The radius of the point.
 * @param {number} index - The index of the point.
 * @param {number} angle - The angle of the point.
 * @returns {number} - The x-coordinate of the point.
 */
function radarX(radius, index, angle) {
  return radius * Math.cos(radarAngle(angle, index));
}

/**
 * Calculates the y-coordinate for a point on the radar chart.
 *
 * @param {number} radius - The radius of the point.
 * @param {number} index - The index of the point.
 * @param {number} angle - The angle of the point.
 * @returns {number} - The y-coordinate of the point.
 */
function radarY(radius, index, angle) {
  return radius * Math.sin(radarAngle(angle, index));
}

/**
 * Calculates the angle for a point on the radar chart.
 *
 * @param {number} angle - The angle of the point.
 * @param {number} index - The index of the point.
 * @returns {number} - The angle for the point.
 */
function radarAngle(angle, index) {
  return angle * index - Math.PI / 2;
}

/**
 * Scales a point based on the index and value.
 *
 * @param {number} index - The index of the point.
 * @param {number} point - The value of the point.
 * @returns {number} - The scaled point.
 */
function scale(index, point) {
  let s = d3.scaleLinear()
    .domain([0, 5])
    .range([0, 0.75 * 5]);
  return s(point);
}

/**
 * Selects the top attributes for the radar chart.
 * The higher the absolute difference between the start and end value the more relevent it is.
 * Additonally sort, so that the first most relevant are positive and the later are negagive changes. 
 *
 * @param {Object} data - The data object.
 * @param {number} start - The start index.
 * @param {number} end - The end index.
 * @param {number} numAxis - The number of axis to display.
 * @returns {Object} - The selected attributes data.
 */
function topAttributes(data, start, end, numAxis) {
  if (start < 0 || start > end || end >= data.attributes[0].steps.length) {
    return "Invalid start or end index";
  }

  let changes = data.attributes.map((attr) => {
    return {
      name: attr.name,
      absChange: Math.abs(attr.steps[end] - attr.steps[start]),
      change: attr.steps[end] - attr.steps[start],
      startValue: attr.steps[start],
      endValue: attr.steps[end]
    }
  });

  changes.sort((a, b) => b.absChange - a.absChange);
  changes = changes.slice(0, numAxis);
  changes.sort((a, b) => b.change - a.change);

  let startOutput = {};
  let endOutput = {};
  let dimensions = [];
  changes.forEach((attr) => {
    startOutput[attr.name] = attr.startValue;
    endOutput[attr.name] = attr.endValue;
    dimensions.push(attr.name);
  })

  return {
    data: [startOutput, endOutput],
    dimensions
  };
}

/**
 * Generates the radar chart. 
 * The first polyline displays the start values of the most relevent attributes. 
 * The second displays the end state. 
 *
 * @param {Object} ref - The chart reference object for svg.
 * @param {Object} walkData - The data of the walks.
 * @param {number} start - The start index of the walk.
 * @param {number} end - The end index of the walk.
 */
const generateRadarChart = (ref, walkData, start, end, numAxes) => {
  const primary = CHART_COLORS.primary;
  const secondary = CHART_COLORS.secondary;

  const width = 600;
  const height = 400;
  const scaleR = 200;
  const radius = (width - scaleR) / 2;

  // Firt filter data
  const { data, dimensions } = topAttributes(walkData, start, end, numAxes);

  d3.select(ref.current).selectAll("svg").remove();


  //const names = dimensions.splice(0, 1)

  const svg = d3
    .select(ref.current)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

  const axisRadius = d3
    .scaleLinear()
    .range([0, radius]);

  const maxAxisRadius = 0.75;
  const textRadius = 0.9;

  // render grid lines
  const numLevels = 5;
  const levelSpace = maxAxisRadius / numLevels;
  let levels = [];

  for (let i = 0; i < numLevels; i++) {
    levels[i] = levelSpace * (i + 1);
  }
  const grid = svg
    .selectAll('.grid')
    .data(dimensions)
    .enter()
    .append("g");

  const radarAxisAngle = Math.PI * 2 / dimensions.length;

  levels.forEach(l =>
    grid.append("line")
      .attr("x1", function (d, i) { return radarX(axisRadius(l), i, radarAxisAngle); })
      .attr("y1", function (d, i) { return radarY(axisRadius(l), i, radarAxisAngle); })
      .attr("x2", function (d, i) { return radarX(axisRadius(l), i + 1, radarAxisAngle); })
      .attr("y2", function (d, i) { return radarY(axisRadius(l), i + 1, radarAxisAngle); })
      .attr("class", "line")
      .attr("stroke", CHART_COLORS.light_grey)
      .attr("stroke-width", 1.5)
  );

  // render labels
  const radarAxes = svg
    .selectAll('.axis')
    .data(dimensions)
    .enter()
    .append('g')
    .attr('class', 'axis')

  radarAxes
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr("x2", function (d, i) { return radarX(axisRadius(maxAxisRadius), i, radarAxisAngle); })
    .attr("y2", function (d, i) { return radarY(axisRadius(maxAxisRadius), i, radarAxisAngle); })
    .attr("class", "line")
    .style("stroke", CHART_COLORS.light_grey)
    .attr("stroke-width", 1.5);

  svg.selectAll('.axisLabel')
    .data(dimensions)
    .enter()
    .append('text')
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("x", function (d, i) { return radarX(axisRadius(textRadius), i, radarAxisAngle); })
    .attr("y", function (d, i) { return radarY(axisRadius(textRadius), i, radarAxisAngle); })
    .style("font-size", "12px")
    .style("fill", CHART_COLORS.axis)
    .text(function (d, i) { return dimensions[i].replaceAll('_', ' '); });

    // render polylines
    const color = [CHART_COLORS.radar_primary, CHART_COLORS.radar_secondary];
    const data1 = [data[0]];


  svg.selectAll('path')
    .data(data, function (d) { return d[dimensions[0]]; })
    .join(
      enter => enter
        .append('path')
        .attr('d', function (d, i) {
          let path = 'M ';
          dimensions.forEach(function (dim, j) {

            let x1 = radarX(axisRadius(scale(j, d[dim])), j, radarAxisAngle);
            let y1 = radarY(axisRadius(scale(j, d[dim])), j, radarAxisAngle);
            //let x1 = j;
            //let y1 = j;

            path += x1 + ' ' + y1 + ' ';
          })
          path += "Z";
          return path;
        })
        .attr("stroke", function (d, i) { return color[i] })
        .attr("fill", function (d, i) { return color[i] })
        //.attr("fill", "none")
        .attr('fill-opacity', 0.1)
        .attr("stroke-width", 3)
    );

}

/**
 * Generate the radar chart when the walk data is available or when the start and end indices change.
 *
 * @returns {JSX.Element} - The RadarChart component, displaying a radarchart for a number of attribute for a single walks.
 */
const RadarChart = () => {
  const chartRef = useRef();

  const walkData = useWalk(state => state.walkData);
  const start = useWalk(state => state.start);
  const end = useWalk(state => state.current);

  const [numAxes, setNumAxes] = useState(8);

  useEffect(() => {
    if (walkData) {
      generateRadarChart(chartRef, walkData, start, end, numAxes)
    }
  }, [numAxes]);

  useEffect(() => {
    if (walkData && chartRef.current) {
      generateRadarChart(chartRef, walkData, start, end, numAxes);
    }
  },); // Run only once on component mount

  return (
    <div>
      <TextField
        label="Axes"
        type="number"
        size="small"
        value={numAxes}
        onChange={(event) => setNumAxes(event.target.value)}
        inputProps={{ min: 4, max: 30 }}
        style={{ width: '70px' }}
      />
      <svg viewBox={"0 0 " + 600 + " " + 400} ref={chartRef} />
    </div>
  );
};

export default RadarChart;

