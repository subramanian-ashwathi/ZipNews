import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import dummyImg from "../assets/images/live-from-space.jpg"
import { Link } from 'react-router-dom';

export default function NewsCard(props) {
    const news = props.props;
    // const theme = useTheme();
    // let title = `Two Options the NFL Has for the Bills - Bengals Game`;
    // const MAX_WORDS = 8;
    // const words = title.split(' ');

    // if (words.length > MAX_WORDS) {
    //     title = words.slice(0, MAX_WORDS).join(' ') + '...';
    // }

    React.useEffect(() => {
        // console.log(news)
    }, [])

    return (
        <Link to={news.url} target='_blank' style={{ textDecoration: 'none' }}>
            <Card sx={{
                display: 'flex', width: { lg: '450px', sm: '300px' },
                // height: { lg: '125px', sm: '30px' },
                height: '100%',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                ':hover': {
                    backgroundColor: '#D5EEEF',
                    boxShadow: '0px 0px 5px 1px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    transform: 'scale(1.02)'
                }
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" fontWeight="bolder" >
                            {news.title}
                        </Typography>
                        <Typography component="div" fontSize="10px" fontWeight="ligher">
                            Location: {news.location}
                        </Typography>
                        <Typography component="div" fontSize="10px" fontWeight="ligher">
                            Published On: {news.pub_time}
                        </Typography>
                        <Typography component="div" fontSize="10px" fontWeight="ligher">
                            Category: {news.category}
                        </Typography>
                        <Typography fontSize="13px" fontWeight="bold">
                            Click card to read at source
                        </Typography>
                        {/* <Typography variant="subtitle1" color="text.secondary" component="div" fontSize="10px">
                            determining between right now the first option is the nfl essentially cancels the game or
                            gives both team a tie that would mean both teams play one less game than the 30 other nfl teams and the kansas city chiefs
                        </Typography> */}
                    </CardContent>
                </Box>
                <CardMedia
                    component="img"
                    sx={{ width: 100 }}
                    image={news.image_url}
                    alt="No image found"
                />
            </Card>
        </Link>
    );
}
