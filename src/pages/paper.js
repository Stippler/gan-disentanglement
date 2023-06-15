import React, { useRef, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { Button, Card, CardContent, CardMedia, Slider } from "@mui/material";
import Stack from "@mui/material/Stack";

import { FilterDialog } from "@component/components/filterDialog";
import { UmapDisplay } from "@component/components/umapDisplay";
import RegressionScatterplot from "@component/components/regressionScatterplot";
import Copyright from "@component/components/copyright";
import { useRouter } from "next/router";
import { LineChartDisplay } from "@component/components/lineChartDisplay";
import { useEffect } from "react";
import useWalks from "../stores/walks";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

function linspace(start, end, n) {
  const diff = end - start;
  const step = diff / (n - 1);
  return Array.from({ length: n }, (_, i) => start + i * step);
}

const ImageStripe = ({ path }) => {
  const start = 0;
  const end = 99;

  const videos = linspace(0, 1, 10).map((i) => {
    return {
      ref: useRef(null),
      i: i
    }
  });

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
  }, [path, ...videos.map(video => video.ref)]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        overflow: 'hidden',
        paddingTop: '26px',
        paddingLeft: '26px',
        paddingRight: '26px',
        minHeight: '110px'  // Add a minimum height here 
      }}
    >
      {
        videos.map((video) =>
          <Box key={video.i} sx={{ flexBasis: '10%', flexGrow: 1, maxWidth: '10%' }}>
            <CardMedia
              component="video"
              src={path}
              ref={video.ref}
              title="video stripe"
              sx={{
                width: '100%',
                height: '110px', // explicit height setting
                objectFit: 'contain' // added to maintain aspect ratio
              }}
            />
          </Box>
        )
      }
    </Box>
  );
}

/**
 * PaperPage component.
 * Renders the reimplementation of the visualization presented in the chosen paper.
 * @returns {JSX.Element} PaperPage component.
 */
export default function PaperPage() {

  const direction = useWalks(state => state.direction);
  const selectedWalks = useWalks(state => state.selectedWalks);
  const loading = useWalks(state=>state.loading);

  const router = useRouter();

  let walk = 1;
  if (selectedWalks.length > 0) {
    walk = selectedWalks[0];
  }

  const setSpace = useWalks(state => state.setSpace);
  const setSpaceAndDirection = useWalks(state => state.setSpaceAndDirection);
  const space = useWalks(state => state.space);
  const path = `/videos/${space}/${direction}/${walk}.mp4`;

  const handleSpaceChange = (event) => {
    setSpace(event.target.value);
  };

  useEffect(() => {
    // You can replace 'spaceValue' and 'directionValue' with the actual values you want to use
    if(!loading){
      setSpaceAndDirection(space, direction);
    }
  }, []);

  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <PersonSearchIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            VISUALIZATION
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Container sx={{ py: 4 }} maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <ImageStripe path={path} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction={'row'} justifyContent={'space-between'}>
                    <FilterDialog />
                    <FormControl>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        defaultValue={'z'}
                        value={space}
                        onChange={handleSpaceChange}
                      >
                        <FormControlLabel value="z" control={<Radio />} label="latent space (z)" disabled={loading} />
                        <FormControlLabel value="w" control={<Radio />} label="style space (w)" disabled={loading} />
                      </RadioGroup>
                    </FormControl>
                    <Button variant="contained" onClick={() => { router.push(`${space}/${direction}/${walk}`) }}>Explore Single Walk</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <UmapDisplay />
                </Grid>
                <Grid item xs={12}>
                  <RegressionScatterplot />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <LineChartDisplay />
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
      {/* End footer */}
    </>
  );
}
