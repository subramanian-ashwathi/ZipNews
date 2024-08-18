import React from 'react'
import { Stack, Typography } from '@mui/material';
import { InfinitySpin } from 'react-loader-spinner';

const Loader = () => {
    return (
        <Stack direction="row" justifyContent="center" alignItems="center" width="100%">
            {/* <Typography variant='h5'>
                NO News Found for this Date.
            </Typography> */}
            <InfinitySpin color="gray" />
        </Stack>
    )
}

export default Loader;
