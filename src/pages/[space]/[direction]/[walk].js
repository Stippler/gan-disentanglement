import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import Copyright from '@component/components/copyright';

import { Card, CardContent, CardMedia, Slider } from "@mui/material";
import { RadarChartDisplay } from "@component/components/radarChartDisplay";
import VideoCard from '@component/components/video';
import useWalk from '@component/stores/walk';

/**
 * Generate an array of equally spaced numbers.
 * @param {number} start - The start value.
 * @param {number} end - The end value.
 * @param {number} n - The number of values.
 * @returns {number[]} The array of equally spaced numbers.
 */
function linspace(start, end, n) {
    const diff = end - start;
    const step = diff / (n - 1);
    return Array.from({ length: n }, (_, i) => start + i * step);
}

export async function getStaticPaths() {
    // Here you would fetch all walk IDs and their directions you want to pre-render.
    // For the sake of example, let's assume that you can get them from an API.


    // const paths = walks.map((walk) => ({
    //     params: { walkId: walk.id.toString(), direction: walk.direction },
    // }))

    return { paths: [], fallback: true }
}

export async function getStaticProps({ params }) {
    // Fetch necessary data for the walk using params.walkId and params.direction
    const space = params.space
    const direction = params.direction
    const walk = params.walk

    return { props: { direction: direction, walk: walk, space: space } }
}

const ImageStripe = ({ videos, path }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', overflow: 'hidden', paddingTop: '26px', paddingLeft: '26px', paddingRight: '26px' }}>
            {
                videos.map((video) =>
                    <Box key={video.i} sx={{ flexBasis: '10%', flexGrow: 1, maxWidth: '10%' }}>
                        <CardMedia
                            component="video"
                            src={path}
                            ref={video.ref}
                            title="green iguana"
                            sx={{ width: '100%' }}
                        />
                    </Box>
                )
            }
        </Box>
    );
}

/**
 * Walk component for detailed exploration of a single walk.
 * Displays the walk visualization.
 * @param {Object} props - The component props.
 * @param {string} props.space - The space value (either z (latent) or w (style) space).
 * @param {string} props.direction - The direction value.
 * @param {string} props.walk - The walk index.
 * @returns {JSX.Element} Walk component.
 */
const Walk = ({ space, direction, walk }) => {
    const router = useRouter();
    const setSpaceDirectionWalk = useWalk(state => state.setSpaceDirectionWalk);

    const start = useWalk(state => state.start);
    const current = useWalk(state => state.current);
    const end = useWalk(state => state.end);
    const setStart = useWalk(state => state.setStart);
    const setCurrent = useWalk(state=>state.setCurrent);
    const setEnd = useWalk(state => state.setEnd);

    const videos = linspace(0, 1, 10).map((i) => {
        return {
            ref: useRef(null),
            i: i
        }
    });

    /**
     * Update the video players' current time based on the slider values.
     */
    useEffect(() => {
        const startSec = start / 20;
        const endSec = end / 20;
        const delta = endSec - startSec;
        videos.forEach(videoData => {
            let video = videoData.ref.current;
            if (video) {
                const newTime = startSec + delta * videoData.i;
                video.currentTime = newTime;
            }
        });
    }, [start, end, ...videos.map(video => video.ref)]);

    const minDistance = 1;

    /**
     * Handle the slider change event to select start and end of walk.
     * @param {Object} event - The event object.
     * @param {number[]} newValue - The new slider values.
     * @param {number} activeThumb - The active thumb index.
     */
    const handleSlider = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }
        if (activeThumb === 0) {
            setStart(Math.min(newValue[0], end - minDistance));
        } else if (activeThumb == 1) {
            const val = Math.max(
                Math.min(newValue[1], end - minDistance),
                start + minDistance
            );
            setCurrent(val);
        } else {
            setEnd(Math.max(newValue[2], start + minDistance));
        }
    };

    useEffect(() => {
        if (space && direction && walk) {
            setSpaceDirectionWalk(space, direction, walk);
        }
    }, [space, direction, walk]);

    if (router.isFallback) {
        // This will be displayed while waiting for getStaticProps to finish
        return <div>Loading...</div>
    }


    const path = `/videos/${space}/${direction}/${walk}.mp4`
    return (
        <>
            <AppBar position="relative">
                <Toolbar>
                    <PersonSearchIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" color="inherit" noWrap>
                        VISUALIZATION - WALK
                    </Typography>
                </Toolbar>
            </AppBar>
            <main>
                <Container sx={{ py: 4 }} maxWidth="lg">
                    <Grid container spacing={2} alignItems={"stretch"}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Card
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <ImageStripe videos={videos} path={path} />
                                <CardContent>
                                    <Slider
                                        value={[start, current, end]}
                                        onChange={handleSlider}
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={0}
                                        max={99}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <VideoCard path={`/videos/${space}/${direction}/${walk}.mp4`} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <RadarChartDisplay direction={{ value: direction }} walk={walk} />
                        </Grid>
                    </Grid>
                </Container>
            </main>
            {/* Footer */}
            <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
                <Typography variant="h6" align="center" gutterBottom>
                    Footer
                </Typography>
                <Typography
                    variant="subtitle1"
                    align="center"
                    color="text.secondary"
                    component="p"
                >
                    Visualization 2 - Implementation of "Interactively Assessing Disentanglement in GANs"
                </Typography>
                <Copyright />
            </Box>
        </>
    );
}

export default Walk
