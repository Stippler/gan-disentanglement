import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import { Box, Chip, Divider, Grid, Typography } from "@mui/material";
import useWalks from "../stores/walks";


/**
 * Categories attributes for better overview. 
 * Array of general attributes.
 *
 * @type {Array}
 */
const generalAtt = [
  { label: "Male", value: "Male" },
  { label: "Young", value: "Young" },
];

/**
 * Array of face feature attributes.
 *
 * @type {Array}
 */
const faceFeaturesAtt = [
  { label: "Arched Eyebrows", value: "Arched_Eyebrows" },
  { label: "Bushy Eyebrows", value: "Bushy_Eyebrows" },
  { label: "Bags Under Eyes", value: "Bags_Under_Eyes" },
  { label: "Big Lips", value: "Big_Lips" },
  { label: "Double Chin", value: "Double_Chin" },
  { label: "High Cheekbones", value: "High_Cheekbones" },
  { label: "Mouth Slightly Open", value: "Mouth_Slightly_Open" },
  { label: "Smiling", value: "Smiling" },
];

/**
 * Array of hair attributes.
 *
 * @type {Array}
 */
const hairAtt = [
  { label: "Black Hair", value: "Black_Hair" },
  { label: "Blond Hair", value: "Blond_Hair" },
  { label: "Brown Hair", value: "Brown_Hair" },
  { label: "Grey Hair", value: "Grey_Hair" },
  { label: "Bangs", value: "Bangs" },
  { label: "Straight Hair", value: "Straight_Hair" },
  { label: "Wavy Hair", value: "Wavy_Hair" },
  { label: "Receding Hairline", value: "Receding_Hairline" },
  { label: "Bald", value: "Bald" },
];

/**
 * Array of facial hair attributes.
 *
 * @type {Array}
 */
const facialHairAtt = [
  { label: "No Beard", value: "No_Beard" },
  { label: "Goatee", value: "Goatee" },
  { label: "Mustache", value: "Mustache" },
  { label: "Sideburns", value: "Sideburns" },
];

/**
 * Array of accessories attributes.
 *
 * @type {Array}
 */
const accessoiresAtt = [
  { label: "Eyeglasses", value: "Eyeglasses" },
  { label: "Heavy Makeup", value: "Heavy_Makeup" },
  { label: "Wearing Hat", value: "Wearing_Hat" },
  { label: "Wearing Earrings", value: "Wearing_Earrings" },
  { label: "Wearing Lipstick", value: "Wearing_Lipstick" },
];

/**
 * Renders the filter dialog component. Here the user selects the attribute for the direction of the walks. 
 *
 * @returns {JSX.Element} - The FilterDialog component.
 */
export function FilterDialog() {

  const direction = useWalks(state => state.direction);
  const setDirection = useWalks(state => state.setDirection);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChipClick = (attribute) => {
    setDirection(attribute.value);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const chipLayout = (attribute) => {
    const loading = useWalks(state => state.loading);
    return (
      <Grid item key={attribute.value}>
        <Chip
          label={attribute.label}
          clickable
          variant={direction === attribute.value ? "filled" : "outlined"}
          color={direction === attribute.value ? "primary" : "default"}
          onClick={() => {
            handleChipClick(attribute);
            handleClose();
          }}
          disabled={loading}
        />
      </Grid>
    )
  };

  const generalChips = generalAtt.map((att) => chipLayout(att));

  const faceFeatureChips = faceFeaturesAtt.map((att) => chipLayout(att));

  const hairChips = hairAtt.map((att) => chipLayout(att));

  const facialHairChips = facialHairAtt.map((att) => chipLayout(att));

  const accessoiresChips = accessoiresAtt.map((att) => chipLayout(att));

  return (
    <div>
      <Grid container alignItems={"center"} spacing={2}>
        <Grid item>
          <Button
            onClick={handleClickOpen}
            variant="contained"
            color="secondary"
          >
            Direction
          </Button>
        </Grid>
        <Grid item>
          <Typography>{direction.replaceAll('_', ' ')}</Typography>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        disableScrollLock={true}
      >
        <DialogTitle id="scroll-dialog-title">Settings</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Select the direction you want to investiage.
          </DialogContentText>
          <Box sx={{ m: 1 }}>
            <Typography variant="h3">General</Typography>
            <Divider />
            <Grid container spacing={1} sx={{ py: 1 }}>
              {generalChips}
            </Grid>
          </Box>

          <Box sx={{ m: 1 }}>
            <Typography variant="h3">Face Features</Typography>
            <Divider />
            <Grid container spacing={1} sx={{ py: 1 }}>
              {faceFeatureChips}
            </Grid>
          </Box>

          <Box sx={{ m: 1 }}>
            <Typography variant="h3">Hair</Typography>
            <Divider />
            <Grid container spacing={1} sx={{ py: 1 }}>
              {hairChips}
            </Grid>
          </Box>

          <Box sx={{ m: 1 }}>
            <Typography variant="h3">Facial Hair</Typography>
            <Divider />
            <Grid container spacing={1} sx={{ py: 1 }}>
              {facialHairChips}
            </Grid>
          </Box>

          <Box sx={{ m: 1 }}>
            <Typography variant="h3">Accessoires</Typography>
            <Divider />
            <Grid container spacing={1} sx={{ py: 1 }}>
              {accessoiresChips}
            </Grid>
          </Box>
        </DialogContent>

        {/*         <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
        */}
      </Dialog>
    </div>
  );
}
