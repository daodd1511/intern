import { logout } from '@js-camp/react/store/auth/dispatchers';
import { selectIsAuthorized } from '@js-camp/react/store/auth/selectors';
import { useAppDispatch, useAppSelector } from '@js-camp/react/store/store';
import { selectUser } from '@js-camp/react/store/user/selectors';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
} from '@mui/material';
import { FC, memo, useState, MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';

import styles from './AppNavbar.module.css';

const AppNavbarComponent: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const [anchorElementUser, setAnchorElementUser] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElementUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElementUser(null);
  };

  const handleLogoutButtonClick = () => {
    dispatch(logout());
  };

  if (location.pathname.startsWith('/auth')) {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="secondary">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Link to="/" className={styles['home-link']}>
            <Typography variant="h6" component="div">
              Anime
            </Typography>
          </Link>
          {user !== null || !isAuthorized ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User avatar" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                anchorEl={anchorElementUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElementUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Link to="/user/profile" className={styles['menu-item']}>
                    <Typography textAlign="center">Profile</Typography>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleLogoutButtonClick}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Link to="auth/login" className={styles['menu-item']}>
              <Typography variant="body2">Login</Typography>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export const AppNavbar = memo(AppNavbarComponent);
