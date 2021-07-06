import Head from 'next/head';
import axios from '../../helpers/axios-orders';
import Typography from '@material-ui/core/Typography';

import Output from 'editorjs-react-renderer';
import Comments from '../../components/Comments/Comments';

import { makeStyles } from '@material-ui/core/styles';

import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginBottom: '.7rem',
    width: '70%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  description: {
    marginBottom: '2rem',
    width: '70%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  blogContent: {
    marginBottom: '2rem',
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
}));

const blogContentStyle = {
  header: {
    padding: '1rem 0 .3rem 0',
  },
  paragraph: {
    padding: '.5rem 0',
  },
  list: {
    container: {
      marginLeft: '3rem',
    },
    listItem: {
      padding: '.5rem 0',
    },
  },
};

const blogContentConfig = {
  header: {
    disableDefaultStyle: true,
  },
  paragraph: {
    disableDefaultStyle: true,
  },
  list: {
    disableDefaultStyle: true,
  },
};

const BlogDetail = (props) => {
  const classes = useStyles();
  const { data, error } = props;

  const { enqueueSnackbar } = useSnackbar();

  if (error) {
    enqueueSnackbar(error, { variant: 'error' });
    return null;
  }

  return (
    <div className={classes.root}>
      <Head>
        <title>{data.data.title}</title>
        <meta name='description' content={data.data.description} />
      </Head>

      <Typography variant='h4' className={classes.title}>
        {data.data.title}
      </Typography>

      <Typography variant='body2' className={classes.description}>
        {data.data.description}
      </Typography>

      <Typography component='div' className={classes.blogContent}>
        <Output
          data={data.data.blogData}
          style={blogContentStyle}
          config={blogContentConfig}
        />
      </Typography>

      <hr />
      <Comments data={data.data.comment} blog={data.data._id} />
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const { slug } = query;

  try {
    const data = await axios.get(`api/v1/blogs/slug/${slug}`);
    return { props: { data: data.data } };
  } catch (error) {
    if (error.response)
      return { props: { error: error.response.data.message } };
    else
      return {
        props: { error: 'Something went wrong. Please reload to view content' },
      };
  }
}

export default BlogDetail;
