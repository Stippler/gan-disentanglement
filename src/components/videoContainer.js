import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import VideoCard from './videoCard'; // Import the VideoCard component
import Grid from '@mui/material/Grid';

const attributes = [
    "Arched_Eyebrows",
    "Bags_Under_Eyes",
    "Bald",
    "Bangs",
    "Big_Lips",
    "Black_Hair",
    "Blond_Hair",
    "Brown_Hair",
    "Bushy_Eyebrows",
    "Chubby",
    "Double_Chin",
    "Eyeglasses",
    "Goatee",
    "Gray_Hair",
    "Heavy_Makeup",
    "High_Cheekbones",
    "Male",
    "Mouth_Slightly_Open",
    "Mustache",
    "No_Beard",
    "Pale_Skin",
    "Receding_Hairline",
    "Sideburns",
    "Smiling",
    "Straight_Hair",
    "Wavy_Hair",
    "Wearing_Earrings",
    "Wearing_Hat",
    "Wearing_Lipstick",
    "Young"
]

const spaces = ['z', 'w'];

const getRandomSpace = () => spaces[Math.floor(Math.random() * spaces.length)];
const getRandomAttribute = () => attributes[Math.floor(Math.random() * attributes.length)];
const getRandomNumber = () => Math.floor(Math.random() * 100);

function VideosContainer() {
    const [videoPaths, setVideoPaths] = useState([]);

    // Generate 5 random videos when the component mounts
    useEffect(() => {
        const paths = Array.from({ length: 8 }).map(() => {
            const space = getRandomSpace();
            const attribute = getRandomAttribute();
            const walk = getRandomNumber();
            return {
                path: `/videos/${space}/${getRandomAttribute()}/${getRandomNumber()}.mp4`,
                space: space,
                walk: walk,
                direction: attribute
            }
        });
        setVideoPaths(paths);
    }, []);

    return (
        <Grid container spacing={1} justifyContent={'center'}>
            {videoPaths.map((data, i) => (
                <Grid item key={data.path} md={3}>
                    <VideoCard path={data.path} direction={data.direction} space={data.space} walk={data.walk} />
                </Grid>
            ))}
        </Grid>
    );
}

export default VideosContainer;
