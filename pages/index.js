import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from '../helpers/axios-orders';
import Pagination from '@material-ui/lab/Pagination';

import { useSnackbar } from 'notistack';

import BlogCards from '../components/BlogCards/BlogCards';

const Home = (props) => {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const paginationHandler = (event, page) => {
    const currentPath = router.pathname;
    const currentQuery = router.query;
    currentQuery.page = page;

    router.push({
      pathname: currentPath,
      query: currentQuery,
    });
  };

  if (props.error) {
    enqueueSnackbar(props.error, { variant: 'error' });
    return null;
  }
  return (
    <div>
      <Head>
        <title>Blog App</title>
        <meta
          name='description'
          content='All blogs list for blogging application Blog App'
        />
      </Head>
      {props.data ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <BlogCards data={props.data.data} />
          <div style={{ alignSelf: 'center', marginTop: '3rem' }}>
            <Pagination
              count={Math.ceil(props.data.totalResults / (props.limit * 1))}
              page={props.page * 1}
              onChange={paginationHandler}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const page = query.page || 1;
  const limit = 20;
  try {
    const data = await axios.get(
      `api/v1/blogs?limit=${limit}&fields=title,description,user,slug,createdAt,updatedAt&page=${page}`
    );
    return { props: { data: data.data, page, limit } };
  } catch (error) {
    if (error.response)
      return { props: { error: error.response.data.message } };
    else
      return {
        props: { error: 'Something went wrong. Please reload to view content' },
      };
  }
}

export default Home;
