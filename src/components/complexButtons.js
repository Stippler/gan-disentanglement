import * as React from 'react';
import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';



/**
 * Custom styled component for the image button.
 */
const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    height: 300,
    [theme.breakpoints.down('sm')]: {
        width: '100% !important', // Overrides inline-style
        height: 100,
    },
    '&:hover, &.Mui-focusVisible': {
        zIndex: 1,
        '& .MuiImageBackdrop-root': {
            opacity: 0.15,
        },
        '& .MuiImageMarked-root': {
            opacity: 0,
        },
        '& .MuiTypography-root': {
            border: '4px solid currentColor',
        },
    },
}));

/**
 * Custom styled component for the image source.
 */
const ImageSrc = styled('span')({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
});

/**
 * Custom styled component for the image.
 */
const Image = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
}));

/**
 * Custom styled component for the image backdrop.
 */
const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
}));

/**
 * Custom styled component for the marked image.
 */
const ImageMarked = styled('span')(({ theme }) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
}));

/**
 * Component that renders a grid of image buttons.
 *
 * @returns {JSX.Element} - The ButtonBases component.
 */
export default function ButtonBases() {
    const router = useRouter();

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

    const images = [
        {
            url: '/images/paper.png',
            title: 'Paper Implementation',
            route: '/paper'
        },
        {
            url: '/images/detail.png',
            title: 'Walk',
            route: `/${getRandomSpace()}/${getRandomAttribute()}/${getRandomNumber()}`
        },
    ];

    /**
     * Renders image buttons based on the data in the 'images' array.
     *
     * @returns {Array<JSX.Element>} - Array of image buttons.
     */
    const imageButtons = images.map((image) => {
        return (
            <Grid item md={6} key={image.title}>
                <ImageButton
                    focusRipple
                    key={image.title}
                    style={{
                        width: '100%',
                    }}
                    onClick={() => {
                        router.push(image.route);
                    }}
                >
                    <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
                    <ImageBackdrop className="MuiImageBackdrop-root" />
                    <Image>
                        <Typography
                            component="span"
                            variant="h3"
                            color="inherit"
                            sx={{
                                position: 'relative',
                                p: 4,
                                pt: 2,
                                pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                            }}
                        >
                            {image.title}
                            <ImageMarked className="MuiImageMarked-root" />
                        </Typography>
                    </Image>
                </ImageButton>
            </Grid>
        );
    });
    return (
        <Grid container spacing={2}>
            {imageButtons}
        </Grid>
    );
}