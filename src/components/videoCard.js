import { Box, Card, CardMedia } from '@mui/material';
import { useEffect, useRef } from 'react';

function VideoCard({ path, direction, space, walk }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.onloadedmetadata = () => {
        video.play();
      };
    }

    return () => {
      if (video) {
        video.onloadedmetadata = null;
      }
    };
  }, []);

  return (
    <Card sx={{ height: '100%', maxWidth: 256 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CardMedia
          component="video"
          sx={{ maxWidth: 256 }}
          src={path}
          ref={videoRef}
          autoPlay
          loop
          muted
          title={`${direction.replaceAll('_', ' ')} (${space}): ${walk}`}
        />
      </Box>
    </Card>
  );
}

export default VideoCard;
