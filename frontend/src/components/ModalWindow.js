import React, { useEffect, useState } from 'react'
import { Box, Backdrop, Modal, Fade, Button, Typography, IconButton, Stack, Paper, Autocomplete, TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import { LocationOn } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { Close } from '@mui/icons-material';
import Card from './NewsCard'
import { changeState } from '../store/stateSlice'
import { useDispatch, useSelector } from 'react-redux';
import { changeSearch } from '../store/searchSlice';
import {http} from '../assets/http'
import { getStateCodeByStateName, getStateNameByStateCode, sanitizeStateCode, sanitizeStateName } from 'us-state-codes';
import data from '../zipnews.postman_collection.json'
import dayjs from 'dayjs';
import Loader from './Loader';

const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '75vw',
    height: '75vh',
    bgcolor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '15px',
    boxShadow: 0,
    border: '2px solid white',
    outline: 'none',
    overflow: 'hidden',
    overflowY: 'scroll',
};

const grid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gridGap: '1rem',
    padding: '1rem',
    margin: '1rem',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    overflowY: 'scroll',
    
}

const header = {
    position: 'sticky',
    top: '0',
    zIndex: '1',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)', /* Safari */
    padding: '10px',
}




const ModalWindow = ({selectedState }) => {
    const [open, setOpen] = useState(false);
    const [news, setNews] = useState([]);
    const state = useSelector((state) =>  state.currentState.value)
    const searchValue = useSelector((state) => state.searchValue.value)
    const dispatch = useDispatch();
    const date = useSelector((state) => state.date.value)
    const [loading, setLoading] = useState(true);

    const getNews = async () => {
        setLoading(true)
        const d = new dayjs(date).subtract(1, 'days')
        const formattedDate = new Date(d.$d).toISOString().slice(0,10);
        const startTime = formattedDate + " 00:00:00"
        const endTime = formattedDate + " 23:59:59"
        console.log('news date',formattedDate)
        await http.get(`/v1/news?start_time=${startTime}&end_time=${endTime}&state_code=${getStateCodeByStateName(state)}`).then((res) => {
            if(res.status === 200) {
                // setNews([...news, ...res.data.news])
                setNews([...res.data.news])
            }
        }).catch((err) => {
            console.log(err)
        })
        setLoading(false)
        // setNews([...JSON.parse(data.item[0].response[0].body).news, ...JSON.parse(data.item[0].response[0].body).news])
        // console.log(JSON.parse(data.item[0].response[0].body).news)
    }

    const getSearch = async () => {
        setLoading(true)
        const d = new dayjs(date).subtract(1, 'days')
        const formattedDate = new Date(d.$d).toISOString().slice(0,10);
        const startTime = formattedDate + " 00:00:00"
        const endTime = formattedDate + " 23:59:59"
        await http.get(`/v1/search?start_time=${startTime}&end_time=${endTime}&search_phrase=${searchValue}`).then((res) => {
            if(res.status === 200) {
                // setNews([...news, ...res.data.news])
                setNews([...res.data.news])
            }
        }).catch((err) => {
            console.log(err)
        })
        setLoading(false)
        // setNews([...JSON.parse(data.item[0].response[0].body).news, ...JSON.parse(data.item[0].response[0].body).news])
        // console.log(JSON.parse(data.item[0].response[0].body).news)
    }

    useEffect(() => {
        if (searchValue) {
            if(states.includes(sanitizeStateName(searchValue))) {
                dispatch(changeState(sanitizeStateName(searchValue)))
                dispatch(changeSearch(''))
            }
            else {
                getSearch()
            }
            setOpen(true);
            // dispatch(changeState(searchValue))
        }
        if(state) {
            getNews();
            setOpen(true);
        }
    }, [searchValue, state, date])

    const handleClose = () => {
        setOpen(false);
        dispatch(changeSearch(''));
        dispatch(changeState(''));
    }

    const handleSelect = (e, value) => {
        dispatch(changeSearch(''));
        dispatch(changeState(e.target.innerHTML))
    };

    const AutocompleteComponent = (<Paper
        component="form"
        elevation={0}
        sx={{
            p: '2px 4px', display: 'flex', alignItems: 'center', width: 300, height: 50,
            borderRadius: '50px 50px 50px 50px',
        }}
    >
        <IconButton sx={{ p: '10px' }} aria-label="menu">
            {searchValue ? <SearchIcon /> :<LocationOn />}
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        {state?     (<Autocomplete
        width="200px"
        options={states}
        value={state ? state : searchValue}
        onChange={handleSelect}
        clearIcon={null}
        renderInput={(params) => (
            <TextField {...params} sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                },
                width: "200px",
                alignItems: 'center',
            }} variant="outlined" color="success" />

        )}
    />)
    :
    <>{searchValue}</>}

    </Paper>)

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 1000,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <Stack direction="row" justifyContent="space-between" style={header}>
                        <Typography fontWeight={600} color="#0A4C6A" id="transition-modal-title" sx={{ opacity: '0.5', display: { lg: 'block', xs: 'none' }, fontSize: '24px' }}>
                            {(searchValue && !state) ? "Keyword" : 'State'}
                        </Typography>
                        {AutocompleteComponent}
                        <IconButton onClick={handleClose}>
                            <Close />
                        </IconButton>
                    </Stack>
                        {(news.length > 0 || !loading) ? <Stack direction="row" sx={{ gap: { xl: '12px', lg: '7px', xs: '2px' } }} flexWrap="wrap" justifyContent="center" alignItems="stretch">
                            {news.map((news, index) => {
                                return <Card props={news} key={index} />
                            })}

                        </Stack> : <Loader />}
                        {(news.length == 0 && !loading) ? <h1 style={{textAlign: 'center'}}>No news found.</h1> : '' }
                </Box>
            </Fade>
        </Modal>


    )
}

export default ModalWindow