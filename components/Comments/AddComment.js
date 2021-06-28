import { useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { useSnackbar } from 'notistack';

import axios from '../../helpers/axios-orders';

import AuthContext from '../../store/auth-context';

const AddComment = (props) => {
  const { enqueueSnackbar } = useSnackbar();

  const [value, setValue] = useState('');

  const authCtx = useContext(AuthContext);
  const { token } = authCtx;

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handlePostClick = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      if (value === '')
        throw new Error('Comment cannot be empty, please add comment');

      if (props.parentComment) {
        await axios.post(
          `/api/v1/blogs/${props.blog}/comments/reply/${props.parentComment}`,
          { comment: value },
          config
        );
        props.getReplies();
      } else {
        await axios.post(
          `/api/v1/blogs/${props.blog}/comments`,
          { comment: value },
          config
        );
        props.updateComments();
      }
      enqueueSnackbar('Comment added', {
        variant: 'success',
      });
      setValue('');
    } catch (err) {
      if (err.response)
        enqueueSnackbar(err.response.data.message, {
          variant: 'error',
        });
      else if (err.message) {
        enqueueSnackbar(err.message, {
          variant: 'error',
        });
      } else
        enqueueSnackbar(`Couldn't add comment, please try again later`, {
          variant: 'error',
        });
    }
  };

  return (
    <div style={{ marginTop: '.7rem' }}>
      {!token ? (
        <Alert severity='warning'>Please login to enter comment!</Alert>
      ) : (
        <>
          <TextField
            style={{ width: '100%' }}
            id='outlined-multiline-static'
            label='Your Comment'
            multiline
            rows={3}
            value={value}
            onChange={handleChange}
            variant='outlined'
          />
          <Button
            variant='contained'
            color='primary'
            onClick={handlePostClick}
            style={{ marginTop: 10 }}
          >
            Post
          </Button>
        </>
      )}
    </div>
  );
};

export default AddComment;
