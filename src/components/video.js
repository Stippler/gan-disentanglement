import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import useWalk from '@component/stores/walk';

/**
 * VideoCard component for walk animation.
 * Displays a card with a video player and play/pause button.
 * @param {string} path - The path to the video file.
 * @returns {JSX.Element} VideoCard component.
 */
export default function VideoCard({ path }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false); // New state for Play and Pause
    // const end = useWalk(state => state.end);
    const setCurrent = useWalk(state => state.setCurrent);
    const current = useWalk(state => state.current);
    const end = useWalk(state => state.end);
    const videoPath = path;

    /**
     * Toggles between play and pause of the video.
     */
    const togglePlayPause = () => { // New method for Play and Pause
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        const video = videoRef.current;
        let lastUpdateTime = 0;
        if (video) {
            // Update the slider's max value whenever the video's duration changes
            video.onloadedmetadata = () => {
                // setEnd(99);
            };

            video.ontimeupdate = () => {
                let currentUpdateTime = video.currentTime * 20;
                if (currentUpdateTime > end) {
                    setIsPlaying(false);
                    setCurrent(end);
                    video.pause();
                } else {
                    setCurrent(Math.floor(currentUpdateTime));
                }
                lastUpdateTime = currentUpdateTime;
            };
            if (!video.isPlaying) {
                video.currentTime = current / 20;
            }
        }

        return () => {
            if (video) {
                video.onloadedmetadata = null;
                video.ontimeupdate = null;
            }
        };
    }, [videoRef, current]);

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CardMedia
                    sx={{ maxWidth: 256 }}
                    component="video"
                    src={videoPath}
                    ref={videoRef}
                    title="green iguana"
                />
                <Button onClick={togglePlayPause}>
                    {isPlaying ? 'Pause' : 'Play'}
                </Button>
            </Box>
        </Card>
    );
}
