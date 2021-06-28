import { useContext, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// import Alert from '@material-ui/lab/Alert';
import { useSnackbar } from 'notistack';

import axios from '../../helpers/axios-orders';

import Comment from './Comment/Comment';
import AddComment from './AddComment';

// import AuthContext from '../../store/auth-context';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '2rem',
    maxWidth: 800,
    paddingBottom: '3rem',

    [theme.breakpoints.down('sm')]: {
      margin: 0,
      marginTop: '2rem',
    },
  },
}));

const CommentsBox = (props) => {
  const classes = useStyles();
  // const authCtx = useContext(AuthContext);
  // const { token } = authCtx;
  const [commentsData, setCommentsData] = useState(props.data);

  const { enqueueSnackbar } = useSnackbar();

  const updateComments = async () => {
    try {
      const data = await axios.get(`api/v1/blogs/${props.blog}/comments`);
      setCommentsData(data.data.data);
    } catch (err) {
      if (err.response)
        enqueueSnackbar(err.response.data.message, {
          variant: 'error',
        });
      else
        enqueueSnackbar(`Couldn't add comment, please try again later`, {
          variant: 'error',
        });
    }
  };

  const comments = commentsData.map((item, index) => {
    // console.log(item);
    return <Comment key={item.id} data={item} blog={props.blog} />;
  });

  return (
    <div className={classes.root}>
      <Typography variant='h5' style={{ marginBottom: '2rem' }}>
        Comments
      </Typography>
      <div>Add a Comment!</div>
      <AddComment blog={props.blog} updateComments={updateComments} />
      {/* {!token ? (
        <Alert severity='warning'>Please login to enter comment!</Alert>
      ) : (
        <>
          <div style={{ marginBottom: '.7rem' }}>Add a Comment!</div>

          <AddComment token={token} blog={props.blog} updateComments={updateComments}/>
        </>
      )} */}
      {comments}
    </div>
  );
};

export default CommentsBox;
