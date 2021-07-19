import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from '../helpers/axios-orders';
import Pagination from '@material-ui/lab/Pagination';

import { useSnackbar } from 'notistack';

import BlogCards from '../components/BlogCards/BlogCards';
import Spinner from '../components/UI/Spinner';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Home = (props) => {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const page = router.query.page || 1;
  const limit = 20;

  const { data, error } = useSWR(
    `api/v1/blogs?limit=${limit}&fields=title,description,user,slug,createdAt,updatedAt&page=${page}`,
    fetcher
  );

  if (error) {
    let errMessage;
    if (error.response) {
      errMessage = error.response.data.message;
    } else errMessage = 'Something went wrong, Please reload to view content';

    enqueueSnackbar(errMessage, { variant: 'error' });
    return null;
  }

  if (!data) return <Spinner center />;

  const paginationHandler = (event, page) => {
    const currentPath = router.pathname;
    const currentQuery = router.query;
    currentQuery.page = page;

    router.push({
      pathname: currentPath,
      query: currentQuery,
    });
  };

  return (
    <div>
      <Head>
        <title>Blog App</title>
        <meta
          name='description'
          content='All blogs list for blogging application Blog App'
        />
      </Head>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <BlogCards data={data.data} />
        <div style={{ alignSelf: 'center', marginTop: '3rem' }}>
          <Pagination
            count={Math.ceil(data.totalResults / limit)}
            page={page * 1}
            onChange={paginationHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
