// display most relevant line charts (10)

import { Card, CardContent } from "@mui/material";
import { LineChart } from "@component/components/lineChart";
import { useState } from "react";

/**
 * Renders the LineChartDisplay component. 
 * Here we iterate over all attributes to generate a line chart with slope histograms for each of them. 
 *
 * @returns {JSX.Element} - The LineChartDisplay component.
 */
export function LineChartDisplay() {

    const [showMore, setShowMore] = useState(false);

    /**
     * Array of attributes to display line charts for.
     *
     * @type {Array<string>}
     */
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
        "Chubby", // 10
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

    return (
        <Card
            sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <CardContent 
                sx={{ 
                    flexGrow: 1,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                }}>
                {attributes.map((attribute, index) => (
                    <div key={index}>
                        <LineChart attribute={attribute}/>
                    </div>
                ))}
            </CardContent>
        </Card>
    );

}