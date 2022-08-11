import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { darkTheme, lightTheme } from '../components/theme/theme';
import useDarkMode from 'use-dark-mode';

import { AuthContextProvider } from '../store/auth-context';
import PrivateRoute from '../components/HOC/withAuth';
// import NoAuthRoute from '../components/HOC/withNoAuth';

import ScreenLoader from '../components/UI/ScreenLoader';

import Layout from '../components/HOC/Layout/Layout';

import '../styles/globals.css';

export default function MyApp(props) {
  const router = useRouter();

  const { value: isDark } = useDarkMode(false);
  const theme = isDark ? darkTheme : lightTheme;

  const [loading, setLoading] = useState(false);

  const { Component, pageProps } = props;
  const protectedRoutes = [
    '/user/myBlogs',
    '/user/myProfile',
    '/blog/edit/[slug]',
    '/blog/create',
  ];
  // const noAuthRoutes = ['/auth/login', '/auth/signup'];

  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const notistackRef = React.createRef();
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  useEffect(() => {
    router.events.on('routeChangeStart', startLoading);
    router.events.on('routeChangeComplete', stopLoading);

    return () => {
      router.events.off('routeChangeStart', startLoading);
      router.events.off('routeChangeComplete', stopLoading);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>My page</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
        <meta
          name='description'
          content='Web app for blogging application Blog App'
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          ref={notistackRef}
          action={(key) => (
            <IconButton onClick={onClickDismiss(key)}>
              <ClearIcon style={{ color: 'white' }} fontSize='small' />
            </IconButton>
          )}
        >
          <AuthContextProvider>
            <PrivateRoute protectedRoutes={protectedRoutes}>
              {/* <NoAuthRoute noAuthRoutes={noAuthRoutes}> */}
              <Layout>
                {loading ? <ScreenLoader /> : <Component {...pageProps} />}
              </Layout>
              {/* </NoAuthRoute> */}
            </PrivateRoute>
          </AuthContextProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}
