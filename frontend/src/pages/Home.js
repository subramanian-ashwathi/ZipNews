import React, { useState } from 'react'
import Map from '../components/Map'
import { Box } from '@mui/material'
import Navbar from '../components/Navbar'

const Home = () => {
    const [heatmap, setHeatmap] = useState(true)
    const heatmapSelection = (e) => {
        setHeatmap(e);
    }

    return (
        <Box>
            <Navbar heatmapSelection={heatmapSelection} />
            <Map heatmap={heatmap} />
        </Box>
    )
}

export default Home