import { useContext, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Editor from '../../components/Editor/Editor';
import axios from '../../helpers/axios-orders';
import Typography from '@material-ui/core/Typography';
import Spinner from '../../components/UI/Spinner';

import AuthContext from '../../store/auth-context';

import { useSnackbar } from 'notistack';

const CreateBlog = (props) => {
  const router = useRouter();
  const authCtx = useContext(AuthContext);

  const { token } = authCtx;

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const onSaveHandler = async (blogData, title, description) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const toSaveData = {
      title,
      blogData,
      description,
    };

    try {
      setLoading(true);
      const data = await axios.post(`/api/v1/blogs`, toSaveData, config);
      setLoading(false);
      enqueueSnackbar(`Blog Created`, { variant: 'success' });
      router.push(`/blog/edit/${data.data.data.slug}`);
    } catch (error) {
      setLoading(false);
      let errMessage;
      if (error.response) {
        errMessage = error.response.data.message;
      } else errMessage = 'Something went wrong, Please try again later';
      enqueueSnackbar(errMessage, { variant: 'error' });
    }
  };

  return (
    <>
      <Head>
        <title>Create new blog</title>
        <meta name='description' content='Page for creating new blog with blog app'/>
      </Head>
      <Typography variant='h4' style={{ margin: '1rem 0 2rem 0' }}>
        Creat Blog
      </Typography>
      {loading ? <Spinner /> : null}
      <Editor
        onSave={(editorData, title, description) =>
          onSaveHandler(editorData, title, description)
        }
      />
    </>
  );
};

export default CreateBlog;
