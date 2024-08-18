import React, { useEffect, useState } from 'react'
import { styled, alpha } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { changeSearch } from '../store/searchSlice';
import { useDispatch, useSelector } from 'react-redux';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    // pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(8)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '20ch',
            '&:focus': {
                width: '40ch',
            },
        },
    },
}));

const SearchBar = ({ }) => {
    const [searchValue, setSearchValue] = useState('');

    const search = useSelector((state) => state.searchValue.value)

    useEffect(() => {
        setSearchValue(search)
    }, [search])

    const dispatch = useDispatch();

    const onSearch = () => {
        // handleSearch(searchValue);
        console.log(searchValue)
        dispatch(changeSearch(searchValue))
        // Call a function to process the search value here
    };

    const onChange = (e) => {
        setSearchValue(e.target.value);
    }

    const handleKeyPressed = (e) => {
        if (e.key === 'Enter' && searchValue) {
            onSearch();
        }
    }

    return (
        <Box>
            <Search>
                <SearchIconWrapper>
                    <IconButton onClick={onSearch}>
                        <SearchIcon />
                    </IconButton>
                </SearchIconWrapper>
                <StyledInputBase
                    value={searchValue}
                    onChange={(e) => onChange(e)}
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    onKeyDown={handleKeyPressed}
                />

            </Search>
        </Box>
    )
}

export default SearchBar