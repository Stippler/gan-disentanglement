import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import useWalks from "@component/stores/walks";
import { CHART_COLORS } from "./colors";
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

/**
 * Styled component for custom HTML tooltip.
 */
const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

/**
 * Generates the scatterplot chart using D3.
 * @param {React.Ref} ref - Reference to the chart container element for the svg.
 * @param {Array} walks - Array of walk data.
 * @param {Array} selectedWalks - Array of selected walks to change color for selected data points in the umap.
 */
const generateScatterplot = (ref, walks, selectedWalks) => {
    const primary = CHART_COLORS.primary;
    const secondary = CHART_COLORS.secondary;

    const margin = { top: 20, right: 60, bottom: 40, left: 55 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(ref.current).selectAll("svg").remove();

    let data = [];
    // Iterate over each object in the array
    walks.forEach(item => {
        let walk = item.walk;
        // Further iterate over the 'attributes' array inside each object
        item.attributes.forEach(attr => {
            let newObject = {
                'walk': walk,
                'slope': attr.slope,
                'intercept': attr.intercept,
                'r2': attr.r2
            };
            data.push(newObject);
        });
    });


    // create scales for the x and.slope axes
    const minX = d3.min(data, d => +d.slope);
    const maxX = d3.max(data, d => +d.slope);

    const minY = d3.min(data, d => +d.r2);
    const maxY = d3.max(data, d => +d.r2);

    const xScale = d3
        .scaleLinear()
        .domain([minX-(maxX-minX)*0.1, maxX+(maxX-minX)*0.1])
        .range([0, width]);

    const yScale = d3
        .scaleLinear()
        .domain([minY-(maxY-minY)*0.1, maxY+(maxY-minY)*0.1])
        .range([height, 0]);

    // create the x and.slope axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // create the scatterplot
    const svg = d3
        .select(ref.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text")
        .attr("x", margin.left / 2)
        .attr("y", height / 2 - 70)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90,"+margin.left/2+","+height/2+")") // rotate the text to make it vertical
        .style("font-size", "12px")
        .html("R<tspan dy='-5px' style='font-size: 9px;'>2</tspan>");
        
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", height + 35)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("slope");

    svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(+d.slope))
        .attr("cy", (d) => yScale(+d.r2))
        .attr("r", 4)
        .attr("fill", (d) => (selectedWalks.includes(d.walk) ? primary : secondary)) // Change fill color based on condition
        .attr("opacity", (d) => (selectedWalks.includes(d.walk) ? 0.9 : 0.5))
        .attr("class", "scatterplot-circle");

    svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis);

    svg.append("g").call(yAxis);
};

/**
 * Scatterplot component displaying the regression data.
 * For each walk, the slope of all 30 attributes are calculated and displayed.
 * @returns {JSX.Element} Scatterplot component.
 */
const RegressionScatterplot = () => {
    const chartRef = useRef();

    const walks = useWalks(state => state.walks);
    const selectedWalks = useWalks(state => state.selectedWalks);

    useEffect(() => {
        if(walks){
            generateScatterplot(chartRef, walks, selectedWalks);
        }
    }, [walks, selectedWalks]);

    return (
        <>
            <Card
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography variant="h6" component="div" style={{flexGrow: 1, textAlign: 'center'}}>Regression</Typography>
                        <HtmlTooltip
                            title={
                            <>
                                <Typography color="primary">Regreesion Plot</Typography>
                                {/* your explanation goes here */}
                                <p>
                                    In this scatterplot, the points represent combinations of walks and their attribute-specific linear regression models. 
                                    The x-axis shows the model's slope, while the y-axis represents its R2 coefficient. 
                                    This provides a quick overview of the selected direction's quality. 
                                    If the points cluster around the centerline, it indicates that the direction does not reflect any of the attributes. 
                                    Conversely, points spreading out towards the upper left/right suggest consistent decrease/increase in certain attributes.
                                </p>
                                <br/>
                                <p>
                                    <b>Interaction:</b> none
                                </p>
                                
                            </>
                            }
                        >
                            <IconButton>
                                <HelpOutlineIcon/>
                            </IconButton>
                        </HtmlTooltip>
                    </div>
                    <svg
                        viewBox={"0 0 " + 600 + " " + 400}
                        ref={chartRef} />
                </CardContent>
            </Card>
        </>
    );
};
export default RegressionScatterplot;