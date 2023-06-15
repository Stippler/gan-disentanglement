import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import useWalks from '@component/stores/walks';
import { CHART_COLORS } from './colors';

/**
 * Generates a line chart based on the provided data, attribute, and selected walks.
 *
 * @param {object} ref - The reference to the chart container.
 * @param {Array} data - The data used to generate the chart.
 * @param {string} attribute - Name of the changing attribute in the selected direction.
 * @param {Array} selectedWalks - Walk selection for filtering (selected in umapScatterplot).
 */
const generateLineChart = (ref, data, attribute, selectedWalks) => {
    const primary = CHART_COLORS.primary;
    const secondary = CHART_COLORS.secondary;
    const light_grey = CHART_COLORS.light_grey;

    let slopesValues = [];
    let walks = [];
    data.forEach((obj) => {
        let attrObj = obj.attributes.find(attr => attr.name === attribute);
        slopesValues.push(attrObj.slope);
        walks.push(attrObj.steps);
    });

    let selectedWalksData = walks;

    if (selectedWalks.length > 0) {
        selectedWalksData = selectedWalks.map((index) => walks[index]);
        slopesValues = selectedWalks.map((index) => slopesValues[index]);
    }

    const container = d3.select(ref.current)

    container.select('svg').remove();

    const margin = { top: 40, right: 40, bottom: 0, left: 10 };
    const width = container.node().clientWidth - margin.right;
    const height = container.node().clientHeight;

    // line chart settingsflattenWalks
    const lineChartWidth = width * 0.7 - margin.left;
    const innerWidth = lineChartWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // bar chart settings
    const barChartWidth = width * 0.3 - margin.left;
    const barChartHeight = height;

    const svg = container
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // add border
    svg
        .append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'none')
        .attr('stroke', 'grey')
        .attr('stroke-width', 1);

    // add title
    svg
        .append('text')
        .attr('x', margin.left)
        .attr('y', margin.top / 2)
        .text(attribute.replaceAll('_', ' '))
        .attr('font-size', '12px');


    const xScale = d3
        .scaleLinear()
        .domain([0, 99])
        .range([margin.left, lineChartWidth]);

    // const yValues = flattenWalks.map((d) => d);
    const yScale = d3
        .scaleLinear()
        .domain([-1, 1])
        .range([180, margin.top]);

    const line = d3
        .line()
        .x((d, i) => xScale(i))
        .y((d, i) => yScale(d));


    selectedWalksData.forEach((walk) => {
        svg
            .append('path')
            .datum(walk)
            .attr('fill', 'none')
            .attr('stroke', 'grey')
            .attr('stroke-width', 0.5)
            .attr('d', line);
    });

    // generate Bar Chart

    const extent = d3.extent(slopesValues);
    const maxAbsVal = Math.max(Math.abs(extent[0]), Math.abs(extent[1]));

    const thresholds = d3.range(-4, 5, 1).map(d => d * maxAbsVal / 4);

    const bins = d3.bin()
        .domain([-maxAbsVal, maxAbsVal])
        .thresholds(thresholds)(slopesValues);

    const numBins = bins.length;
    const maxLength = d3.max(bins, d => d.length);

    const padding = 0.2;

    const xBarScale = d3
        .scaleBand()
        .domain(bins.map(d => d.x0)) // Use the bin start values as the domain
        .range([0, barChartWidth])
        .paddingInner(padding)
        .paddingOuter(padding / 2);

    const yBarScale = d3
        .scaleLinear()
        .domain([0, maxLength])
        .range([barChartHeight, margin.top]);

    const barChartContainer = svg
        .append('g')
        .attr('class', 'bar-chart-container')
        .attr('transform', `translate(${lineChartWidth + margin.left}, 0)`);

    barChartContainer
        .selectAll('rect')
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", d => xBarScale(+d.x0))
        .attr("y", d => yBarScale(+d.length))
        .attr("height", d => barChartHeight - yBarScale(+d.length))
        .attr("width", xBarScale.bandwidth())
        .attr('fill', d => (+d.x0 >= 0 ? secondary : primary));

    svg.append("line")
        .attr("x1", lineChartWidth)  // x position of the first end of the line
        .attr("y1", 0)  // y position of the first end of the line
        .attr("x2", lineChartWidth)  // x position of the second end of the line
        .attr("y2", height)    // y position of the second end of the line
        .attr("stroke-width", 1)
        .attr("stroke", light_grey);
}

/**
 * LineChart component displays a line chart based on the provided attribute.
 *
 * @param {object} props - The component props.
 * @param {string} props.attribute - The changing attribute for the line chart.
 * @returns {JSX.Element} - The LineChart component, displaying a linechart for a single attribute for a selection of walks.
 */
export function LineChart({ attribute }) {
    const chartRef = useRef();
    const walks = useWalks(state => state.walks);
    const selectedWalks = useWalks(state => state.selectedWalks);

    // generate line chart after data is loaded
    useEffect(() => {
        if (walks.length > 0) {
            generateLineChart(chartRef, walks, attribute, selectedWalks);
        }
    }, [walks, attribute, selectedWalks]);

    return (
        <svg style={{ width: '300px', height: '110px' }} ref={chartRef} />
    );
};
