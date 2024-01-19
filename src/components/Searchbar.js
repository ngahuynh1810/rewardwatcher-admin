import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Input, Slide, Button, IconButton, InputAdornment, ClickAwayListener } from '@mui/material';
// utils
import { bgBlur } from 'src/utils/cssStyles';
// component
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const HEADER_MOBILE = 62;
const HEADER_DESKTOP = 62;

const StyledSearchbar = styled('div')(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  // top: 0,
  // left: 0,
  zIndex: 22299,
  width: '100%',
  display: 'flex',
  // position: 'absolute',
  alignItems: 'center',
  height: HEADER_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    height: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

export default function Searchbar(props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState();

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
       <StyledSearchbar>
            <Input
              autoFocus
              fullWidth
              disableUnderline
              placeholder="Search…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                props.handleSearch(e.target.value)
              }}
              onKeyPress={(event) => {
                if (event?.key === 'Enter' && props.handleSearch) {
                  event.preventDefault(); 
                  props.handleSearch(search);
                }
              }}
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              }
              sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
            />
            {/* <Button variant="contained" onClick={handleClose}>
              Search
            </Button> */}
          </StyledSearchbar>
    </ClickAwayListener>
  );
}
