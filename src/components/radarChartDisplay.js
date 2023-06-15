import { Card, CardContent} from "@mui/material";
import RadarChart from "@component/components/radarChart";

/**
 * Display component for the RadarChart.
 * @returns {JSX.Element} - The RadarChartDisplay component.
 */
export function RadarChartDisplay() {
    return (
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent sx={{ flexGrow: 1}}>
            <RadarChart/>
          </CardContent>
        </Card>
      );
}