import React from 'react';

import Link from 'next/link';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  avatar: {
    width: theme.spacing(3.5),
    height: theme.spacing(3.5),
    marginRight: '.5rem',
  },
  contentHeading: {
    marginBottom: '.5rem',
    display: 'inline-block',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  author: {
    lineHeight: 1,
    fontSize: '.8rem',
    display: 'block',
  },
}));

const HomePageCard = (props) => {
  const { data } = props;
  const classes = useStyles();

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const blogDetailLink = `/blog/${data.slug}`;
  const blogEditLink = `/blog/edit/${data.slug}`;

  return (
    <Grid item sm={6} xs={12}>
      <Card className={classes.root}>
        <CardContent>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '.5rem',
            }}
          >
            <Avatar
              aria-label='user'
              className={classes.avatar}
              alt={data.user.name}
              src={`${process.env.NEXT_PUBLIC_CLOUDINARY_URI}/${data.user.photo}`}
            ></Avatar>
            <div>
              <span className={classes.author}>{data.user.name}</span>
              <Typography variant='caption' color='textSecondary'>
                {new Date(data.createdAt).toLocaleDateString(
                  undefined,
                  dateOptions
                )}
              </Typography>
            </div>
          </div>

          <Typography variant='h5' className={classes.contentHeading}>
            <Link href={blogDetailLink}>{data.title}</Link>
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            {data.description}
          </Typography>
        </CardContent>
        {props.editable ? (
          <CardActions>
            <Tooltip title='Edit'>
              <IconButton aria-label='edit'>
                <Link href={blogEditLink} passHref>
                  <EditIcon />
                </Link>
              </IconButton>
            </Tooltip>
          </CardActions>
        ) : null}
      </Card>
    </Grid>
  );
};

export default HomePageCard;
