import React, { useRef, useState, useEffect } from 'react';
import { GeoJSON, useMap, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { statesData } from "../util/statesData"
import { Box } from '@mui/material';
import axios from 'axios';


import ModalWindow from './ModalWindow';
import { useDispatch, useSelector } from 'react-redux';
import { changeState } from '../store/stateSlice';
import { http } from '../assets/http';
import info from '../zipnews.postman_collection.json'
import Loader from './Loader';

import { getStateNameByStateCode } from 'us-state-codes';
import dayjs from 'dayjs';

const MapContent = ({ heatmap, handleRefresh }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const date = useSelector((state) => state.date.value)

    const geoJson = useRef(null);
    const map = useMap();
    const state = useSelector((state) => state.currentState.value)
    const searchValue = useSelector((state) => state.searchValue.value)
    const dispatch = useDispatch();
    const [count, setCount] = useState([]);
    const [loading, setLoading] = useState(true);

    const getCount = async () => {
        setLoading(true)
        const d = new dayjs(date).subtract(1, 'days')
        const formattedDate = new Date(d.$d).toISOString().slice(0,10);
        await http.get(`/v1/count?date=${formattedDate}`).then(async (res) => {
            // console.log(res)
            if (res.status === 200) {
                const fetchedData = res.data
                await fetchedData.map(function(data) {
                    // console.log(data)
                    data.state = getStateNameByStateCode(data.state_code)
                    return data
                })
                console.log(fetchedData)
                setCount(fetchedData)
            }
        }).catch((err) => {
            console.log(err)
        })
        
        setLoading(false)
        // const data = await JSON.parse(info.item[1].response[0].body)
        // await data.map(function(data) {
        //     data.state = getStateNameByStateCode(data.state)
        //     return data
        // })
        // setCount(data)
    }

    useEffect(() => {
        console.log(date)
        // console.log(date.toISOString().slice(0,10))
        getCount()
    }, [date]);

    const styles = (f) => {
        let found = count.find((state )=>{
            return state.state == f.properties.name
        } )
        return {
            color: '#666',
            fillColor: mapPolygonColorToDensity(found ? found.count : 100000),
            fillOpacity: 0.8,
            weight: 1,
            dashArray: '3'
        };
    }

    const handleOnEachFeatures = (__, layer) => {
        layer.on({
            click: (e) => {
                zoomToFeature(e);
            },
            mouseout: (e) => {
                resetHighlight(e);
            },
            mouseover: (e) => {
                highlightFeature(e);
            },
        });
    }

    const highlightFeature = (e) => {
        const layer = e.target;
        let found = count.find((state )=>{
            return state.state == e.target.feature.properties.name
        } )
        layer.setStyle({
            dashArray: '',
            color: '#666',
            fillOpacity: 1,
            weight: 5,
            dash: '1',
        });
        e.target.bindTooltip(`${e.target.feature.properties.name} - ${found? found.count: 0}`, {
            sticky: true,
            offset: [0, -10],
            permanent: true,
            interactive: false
        }).openTooltip();
    };

    const resetHighlight = (e) => {
        const layer = e.target;
        layer.setStyle({
            color: '#666',
            fillOpacity: 0.8,
            weight: 1,
            dashArray: '3',
        });
        layer.unbindTooltip();
    };

    const zoomToFeature = (e) => {
        map.fitBounds(e.target.getBounds(), { maxZoom: 6 });
        // setstate(e.target.feature.properties.name);
        dispatch(changeState((e.target.feature.properties.name)));
        handleOpen();
        highlightFeature(e)
    };

    const mapPolygonColorToDensity = (density => {
        if (!heatmap) {
            return '#7EAFB4'
        }
        if (density > 10000) return '#333'
        return density > 25
            ? '#0A4C6A'
            : density > 20
                ? '#166386'
                : density > 15
                    ? '#267C93'
                    : density > 10
                        ? '#38929D'
                        : density > 5
                            ? '#4AA4A7'
                            : '#5FC5C5';
    })

    // const legend = (
    //     <Box sx={{
    //         position: 'absolute',
    //         bottom: '20px',
    //         left: '20px',
    //         backgroundColor: 'white',
    //         padding: '10px',
    //         borderRadius: '5px',
    //         boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    //         fontSize: '16px'
    //     }}>
    //         <p>State: {highlightedState ? highlightedState : 'Hover over a state'}</p>
    //     </Box>
    // );
    return (
        <Box>
            {!loading ? <GeoJSON
                data={statesData}
                key='usa-states'
                ref={geoJson}
                style={styles}
                onEachFeature={handleOnEachFeatures}
            /> : <Loader />}
            {/* {legend} */}
            <ModalWindow open={open} handleClose={handleClose} selectedState={state} />
        </Box>
    );
};

export default MapContent;