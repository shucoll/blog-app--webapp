import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../../../helpers/axios-orders';

import Spinner from '../../../components/UI/Spinner';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
  },
}));

const ResetPassword = (props) => {
  const classes = useStyles();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (props.error) {
      enqueueSnackbar(props.error, { variant: 'error' });
      router.push('/auth/login');
    } else if (props.token) {
      setLoading(false);
    }
  }, [enqueueSnackbar, props.error, props.token, router]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if(password!==passwordConfirm) throw new Error(`Passwords don't match`)
      await axios.patch(`/api/v1/users/resetPassword/${props.token}`, {
        password,
        passwordConfirm,
      });
      enqueueSnackbar('Password reset successful. Please login to continue', {
        variant: 'success',
      });
      router.push('/auth/login');
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

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Typography component='h1' variant='h5'>
          Reset Password
        </Typography>
        {loading ? (
          <Spinner />
        ) : (
          <form className={classes.form} noValidate onSubmit={submitHandler}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  required
                  fullWidth
                  name='password'
                  label='New Password'
                  type='password'
                  id='password'
                  autoComplete='current-password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  required
                  fullWidth
                  name='passwordConfirm'
                  label='Password Confirm'
                  type='password'
                  id='passwordConfirm'
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
            >
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </Container>
  );
};

export async function getServerSideProps({ query }) {
  const { token } = query;
  if (!token) {
    return {
      props: { error: 'Invalid token, please try again with a valid token' },
    };
  }

  return { props: { token } };
}

export default ResetPassword;
