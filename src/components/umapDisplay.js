import { Card, CardContent, CardMedia, Slider } from "@mui/material";
import Scatterplot from "@component/components/umapScatterplot";

/**
 * UMAP Display component. Show the umap projection of all walks for a selected direction.
 * @returns {JSX.Element} UMAP Display component.
 */
export function UmapDisplay() {
    return (
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Scatterplot/>
          </CardContent>
        </Card>
      );
}