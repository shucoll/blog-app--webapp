import { useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from '../../helpers/axios-orders';
import Pagination from '@material-ui/lab/Pagination';
import Typography from '@material-ui/core/Typography';
import useSWR from 'swr';

import { useSnackbar } from 'notistack';

import Spinner from '../../components/UI/Spinner';
import BlogCards from '../../components/BlogCards/BlogCards';

import AuthContext from '../../store/auth-context';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const MyBlogs = (props) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const authCtx = useContext(AuthContext);
  const { user } = authCtx;

  const page = router.query.page || 1;
  const limit = 20;

  const { data, error } = useSWR(
    user
      ? `api/v1/blogs?limit=${limit}&fields=title,user,slug,description,createdAt,updatedAt&page=${page}&user=${user._id}`
      : null,
    fetcher
  );

  if (error) {
    let errMessage;
    if (error.response) {
      errMessage = error.response.data.message;
    } else errMessage = 'Something went wrong, Please try again later';

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
        <title>My Blogs</title>
        <meta name='description' content='My blogs page for Blog App' />
      </Head>

      <Typography variant='h4' style={{ margin: '1rem 0 2rem 0' }}>
        My Blogs
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <BlogCards data={data.data} editable />
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

export default MyBlogs;
