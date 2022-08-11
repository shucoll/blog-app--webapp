import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import Spinner from '../../components/UI/Spinner';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Link from 'next/link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import AuthContext from '../../store/auth-context';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
  },
}));

const SignIn = (props) => {
  const classes = useStyles();
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const authCtx = useContext(AuthContext);
  const { loading, error, user, token, login, clearError } = authCtx;

  useEffect(() => {
    if (!loading && user && token) {
      router.push('/user/myBlogs');
    }
  }, [user, token, loading, router]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(
        error.message,
        { variant: 'error' },
        { options: { onClose: clearError() } }
      );
    }
  }, [error, clearError, enqueueSnackbar]);

  const submitHandler = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Log in
        </Typography>
        {loading ? (
          <Spinner />
        ) : (
          <ValidatorForm className={classes.form} onSubmit={submitHandler}>
            <TextValidator
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              validators={['required', 'isEmail']}
              errorMessages={['this field is required']}
            />
            <TextValidator
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='current-password'
              validators={['required']}
              errorMessages={['this field is required']}
            />
            {/* <FormControlLabel
            control={<Checkbox value='remember' color='primary' />}
            label='Remember me'
          /> */}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href='/auth/forgotPassword' passHref>
                  <a className={classes.link}>Forgot password?</a>
                </Link>
              </Grid>
              <Grid item>
                <Link href='/auth/signup' passHref>
                  <a className={classes.link}>
                    {"Don't have an account? Sign Up"}
                  </a>
                </Link>
              </Grid>
              <Link href='/auth/resendSignupEmail' passHref>
                <a className={classes.link} style={{ marginTop: '3rem' }}>
                  {'Resend Confirmation Email'}
                </a>
              </Link>
            </Grid>
          </ValidatorForm>
        )}
      </div>
    </Container>
  );
};

export default SignIn;
