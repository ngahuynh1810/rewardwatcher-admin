import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  const groupBy = (items, key) => items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [
        ...(result[item[key]] || []),
        item,
      ],
    }), 
    {},
  );
  const navArray = groupBy(data, "section");
  console.log(Object.keys(navArray))
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {Object.keys(navArray).map(nav => 
          <>
          <div className='section_title'>{nav || ""}</div>
          {
            data.filter(e => e.section == nav).map((item) => (
              <NavItem key={item.title} item={item} />
            ))
          }
          </>
        )}
        {/* {data.filter(e => !e.section).map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
        <div className='section_title'>Cashback</div>
        {data.filter(e => e.section === "cashback").map((item) => (
          <NavItem key={item.title} item={item} />
        ))} */}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, info } = item;

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />

      {info && info}
    </StyledNavItem>
  );
}
