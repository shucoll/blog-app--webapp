import { useState } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import axios from '../../../helpers/axios-orders';

import AddComment from '../AddComment';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: '2rem',
  },
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    marginRight: '1rem',
  },
  author: {
    lineHeight: 1,
    fontSize: '1rem',
    fontWeight: 'bold',
    marginRight: '.5rem',
  },
  // authorBox: {
  //   marginBottom: '.4rem',
  //   display: 'block',
  // },
  comment: {
    marginBottom: '.4rem',
    marginTop: '.4rem',
  },
  commentActions: {
    display: 'inline-block',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.text.primary,
    },
  },
}));

const Comment = (props) => {
  const { data } = props;
  const classes = useStyles();
  const [replies, setReplies] = useState();
  const [replyBox, showReplyBox] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const getRepliesHandler = async (commentId) => {
    try {
      const { data } = await axios.get(`api/v1/comments/${commentId}/`);
      setReplies(data.data.reply);
    } catch (err) {
      enqueueSnackbar(`Couldn't get replies, please try again later`, {
        variant: 'error',
      });
    }
  };

  const createReply = () => {
    showReplyBox(true);
    getRepliesHandler(data.id);
  };

  let commentReplies;

  if (replies) {
    commentReplies = replies.map((item, index) => {
      return <Comment key={item.id} data={item} blog={props.blog} />;
    });
  }

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return (
    <div className={classes.root}>
      <Avatar
        aria-label='user'
        className={classes.avatar}
        alt={data.user.name}
        src={`${process.env.NEXT_PUBLIC_CLOUDINARY_URI}/${data.user.photo}`}
      />
      <div>
        <span className={classes.author}>{data.user.name}</span>
        <Typography variant='caption' color='textSecondary'>
          {new Date(data.createdAt).toLocaleDateString(undefined, dateOptions)}
        </Typography>

        <div>
          <Typography className={classes.comment}>{data.comment}</Typography>

          <div>
            <Typography
              variant='body2'
              color='textSecondary'
              className={classes.commentActions}
              onClick={() => createReply(data.id)}
              style={{ marginRight: '.8rem' }}
            >
              Reply
            </Typography>

            <Typography
              variant='body2'
              color='textSecondary'
              className={classes.commentActions}
              onClick={() => getRepliesHandler(data.id)}
            >
              View replies
            </Typography>
          </div>
          {replyBox ? (
            <AddComment
              blog={props.blog}
              parentComment={data.id}
              getReplies={() => getRepliesHandler(data.id)}
            />
          ) : null}
          {commentReplies ? commentReplies : null}
        </div>
      </div>
    </div>
  );
};

export default Comment;
