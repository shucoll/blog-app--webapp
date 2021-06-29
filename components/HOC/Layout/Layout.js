import React, { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
// import Router from 'next/router';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
// import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListIcon from '@material-ui/icons/List';
import CreateIcon from '@material-ui/icons/Create';
import DarkModeIcon from '@material-ui/icons/NightsStay';
import LightModeIcon from '@material-ui/icons/WbSunny';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
// import { ThemeProvider } from '@material-ui/core/styles';
// import { createMuiTheme } from '@material-ui/core/styles';

import useDarkMode from 'use-dark-mode';

import AuthContext from '../../../store/auth-context';
import router from 'next/router';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      ...theme.typography.body1,
    },
  },
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  title: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function MiniDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();

  const { value: isDark, toggle: toggleDarkMode } = useDarkMode();

  const authCtx = useContext(AuthContext);
  const { token, logout, user } = authCtx;

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  //Deal with icon change problem. Allow having icon only after being in client side.
  const [showThemeIcon, setShowThemeIcon] = useState(false);

  useEffect(() => {
    setShowThemeIcon(true);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const onDrawerItemClickHandler = (path) => {
    setOpen(false);
    router.push(`${path}`);
  };

  const onMenuItemClickHandler = (path) => {
    handleMenuClose();
    router.push(`${path}`);
  };

  const onLogoutClickHandler = () => {
    handleMenuClose();
    logout();
  };

  const avatar = user ? (
    <Avatar
      aria-label='user'
      alt={user.name}
      src={
        user.photo
          ? `${process.env.NEXT_PUBLIC_CLOUDINARY_URI}/${
              user.photo
            }`
          : null
      }
    />
  ) : null;

  const authMarkup = (
    <div style={{ display: 'flex' }}>
      <IconButton
        aria-label='account of current user'
        aria-controls='menu-appbar'
        aria-haspopup='true'
        onClick={handleMenuOpen}
        color='inherit'
      >
        {avatar}
      </IconButton>
      <span style={{ fontSize: '1.1rem', alignSelf: 'center' }}>
        {user ? user.name.split(' ')[0] : null}
      </span>
      <Menu
        id='menu-appbar'
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={menuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => onMenuItemClickHandler('/user/myProfile')}>
          Profile
        </MenuItem>
        <MenuItem onClick={onLogoutClickHandler}>Logout</MenuItem>
      </Menu>
    </div>
  );

  const noAuthMarkup = (
    <div style={{ marginLeft: '.7rem' }}>
      <Link href='/auth/login' passHref>
        <Button
          variant='outlined'
          style={{ color: '#fff', marginRight: '1rem' }}
          color='secondary'
          size='large'
        >
          Login
        </Button>
      </Link>

      <Link href='/auth/signup' passHref>
        <Button variant='contained' color='secondary' size='large'>
          Signup
        </Button>
      </Link>
    </div>
  );

  const drawer = (
    <Drawer
      variant='permanent'
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem
          button
          onClick={() => onDrawerItemClickHandler('/blog/create')}
        >
          <ListItemIcon>
            <CreateIcon />
          </ListItemIcon>
          <ListItemText primary='Create Blog' />
        </ListItem>

        <ListItem
          button
          onClick={() => onDrawerItemClickHandler('/user/myBlogs')}
        >
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary='My Blogs' />
        </ListItem>
      </List>
    </Drawer>
  );

  return (
    <Paper className={classes.root}>
      <AppBar
        position='fixed'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          {token ? (
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              edge='start'
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          <Typography variant='h6' className={classes.title}>
            <Link href='/'>Blog App</Link>
          </Typography>
          <IconButton onClick={toggleDarkMode}>
            {showThemeIcon && isDark ? (
              <DarkModeIcon />
            ) : (
              <LightModeIcon style={{ color: '#ffc400' }} />
            )}
          </IconButton>
          <div>{token ? authMarkup : noAuthMarkup}</div>
        </Toolbar>
      </AppBar>

      {token ? drawer : null}

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </Paper>
  );
}
