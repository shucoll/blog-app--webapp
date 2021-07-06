import { useContext, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Editor from '../../../components/Editor/Editor';
import axios from '../../../helpers/axios-orders';
import Spinner from '../../../components/UI/Spinner';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AuthContext from '../../../store/auth-context';

import { useSnackbar } from 'notistack';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const EditBlog = (props) => {
  const router = useRouter();
  const { slug } = router.query;
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, error } = useSWR(
    slug ? `api/v1/blogs/slug/${slug}` : null,
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
      await axios.patch(`/api/v1/blogs/${data.data._id}`, toSaveData, config);
      setLoading(false);
      enqueueSnackbar(`Blog Updated`, { variant: 'success' });
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(`${error.response.data.message}`, { variant: 'error' });
    }
  };

  const handleDeleteDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDialogOpen(false);
  };

  const onDeleteHandler = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      setLoading(true);
      await axios.delete(`/api/v1/blogs/${data.data._id}`, config);
      setLoading(false);
      handleDeleteDialogClose();
      enqueueSnackbar(`Blog Deleted`, { variant: 'success' });
      router.push(`/user/myBlogs`);
    } catch (error) {
      setLoading(false);
      handleDeleteDialogClose();
      enqueueSnackbar(`${error.response.data.message}`, { variant: 'error' });
    }
  };

  return (
    <>
      <Head>
        <title>Edit blog</title>
        <meta name='description' content='Edit blog page for Blog App' />
      </Head>
      <Typography variant='h4' style={{ margin: '1rem 0 2rem 0' }}>
        Edit Blog
      </Typography>
      {loading ? <Spinner /> : null}
      <Editor
        data={data}
        onSave={(editorData, title, description) =>
          onSaveHandler(editorData, title, description)
        }
        onDelete={handleDeleteDialogOpen}
      />
      <Dialog
        open={dialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {'Do you want to delete this blog?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deleting a blog is an irreversible operation. Please perform this
            action with caution.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={onDeleteHandler} color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditBlog;
