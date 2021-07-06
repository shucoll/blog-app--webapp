import { useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import useSWR from 'swr';

import axios from '../../helpers/axios-orders';

import Spinner from '../../components/UI/Spinner';

import AuthContext from '../../store/auth-context';

import { useSnackbar } from 'notistack';

const fetchWithToken = (url, token) =>
  axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    marginTop: theme.spacing(8),
    display: 'flex',
    maxWidth: '600px',
    justifyContent: 'space-between',

    [theme.breakpoints.down(700)]: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
  },
  image: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    [theme.breakpoints.down(450)]: {
      width: theme.spacing(17),
      height: theme.spacing(17),
    },
  },
  profileImageContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down(700)]: {
      marginTop: theme.spacing(5),
    },
  },
  uploadLabel: {
    marginTop: theme.spacing(3),
    alignSelf: 'center',
  },
  saveBtn: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing(10),
    [theme.breakpoints.down(700)]: {
      alignSelf: 'center',
    },
  },
  input: {
    width: '20rem',
    [theme.breakpoints.down(450)]: {
      width: '15rem',
    },
  },
  infoLine: {
    marginTop: theme.spacing(2),
  },
  imgInput: {
    display: 'none',
  },
}));

const MyProfile = (props) => {
  const classes = useStyles();

  const authCtx = useContext(AuthContext);
  const { token, updateUserInfo } = authCtx;

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState();
  const [preview, setPreview] = useState();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!photo) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(photo);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const { data, error, mutate } = useSWR(
    token ? [`api/v1/users/me`, token] : null,
    fetchWithToken,
    {
      onSuccess: (data, key, config) => {
        setName(data.data.name);
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    if (photo) fd.append('photo', photo);
    fd.append('name', name);

    try {
      setLoading(true);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };
      const data = await axios.patch(`/api/v1/users/updateMe`, fd, config);
      updateUserInfo(data.data.data.user);
      enqueueSnackbar('Profile updated successfully', {
        variant: 'success',
      });
      setPhoto(null);
      mutate();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      let errMessage;
      if (error.response) {
        errMessage = error.response.data.message;
      } else if (error.message) errMessage = error.message;
      else errMessage = 'Something went wrong, please try again later';
      enqueueSnackbar(errMessage, { variant: 'error' });
    }
  };

  if (error) {
    let errMessage;
    if (error.response) {
      errMessage = error.response.data.message;
    } else errMessage = 'Something went wrong, Please try again later';

    enqueueSnackbar(errMessage, { variant: 'error' });
    return null;
  }

  if (!data) return <Spinner center />;

  if (loading) return <Spinner center />;

  return (
    <>
      <Head>
        <title>My Profile</title>
        <meta name='description' content='My Profile page for Blog App' />
      </Head>
      <div className={classes.root}>
        <Typography component='h1' variant='h4'>
          My Profile
        </Typography>
        <form
          className={classes.content}
          encType='multipart/form-data'
          noValidate
          onSubmit={handleSubmit}
        >
          <div className={classes.profileImageContainer}>
            <Avatar
              aria-label='user'
              className={classes.image}
              alt={data.data.name}
              src={
                preview
                  ? preview
                  : data.data.photo
                  ? `${process.env.NEXT_PUBLIC_CLOUDINARY_URI}/${data.data.photo}`
                  : null
              }
            ></Avatar>
            <input
              accept='image/*'
              className={classes.imgInput}
              id='profile-upload'
              type='file'
              onChange={(e) => setPhoto(e.target.files[0])}
            />
            <label htmlFor='profile-upload' className={classes.uploadLabel}>
              <Button
                variant='contained'
                color='primary'
                component='span'
                startIcon={<PhotoCamera />}
              >
                Upload Photo
              </Button>
            </label>
          </div>

          <div className={classes.detailContainer}>
            <TextField
              id='outlined-basic'
              label='Name'
              variant='outlined'
              className={classes.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className={classes.infoLine}>Email - {data.data.email}</div>
            <div className={classes.infoLine}>
              Total blogs - {data.data.blogCount}
            </div>

            <Button
              type='submit'
              variant='contained'
              color='secondary'
              className={classes.saveBtn}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default MyProfile;
