import { useState, useEffect, useContext } from 'react';
import { useSnackbar } from 'notistack';

import Spinner from '../../components/UI/Spinner';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
import Link from 'next/link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AuthContext from '../../store/auth-context';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

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
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
  },
  alert: {
    marginTop: theme.spacing(3),
  },
}));

export default function SignUp() {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const authCtx = useContext(AuthContext);
  const { loading, error, signup, signupSuccess, clearError } = authCtx;

  useEffect(() => {
    if (error) {
      enqueueSnackbar(
        error.message,
        { variant: 'error' },
        { options: { onClose: clearError() } }
      );
    }
  }, [error, clearError, enqueueSnackbar]);

  useEffect(() => {
    ValidatorForm.addValidationRule('passwordLength', (value) => {
      if (value.length < 8) {
        return false;
      }
      return true;
    });
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      enqueueSnackbar(`Passwords don't match`, { variant: 'error' });
    } else signup(name, email, password, passwordConfirm);
  };

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        {signupSuccess ? (
          <Alert severity='success' className={classes.alert}>
            Signup Successful. Verification Email sent to you email address.
            Please verify email to login
          </Alert>
        ) : loading ? (
          <Spinner />
        ) : (
          <ValidatorForm className={classes.form} onSubmit={submitHandler}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextValidator
                  autoComplete='name'
                  name='name'
                  variant='outlined'
                  required
                  fullWidth
                  id='name'
                  label='Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  validators={['required']}
                  errorMessages={['This field is required']}
                />
              </Grid>
              <Grid item xs={12}>
                <TextValidator
                  variant='outlined'
                  required
                  fullWidth
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  validators={['required', 'isEmail']}
                  errorMessages={['This field is required']}
                />
              </Grid>
              <Grid item xs={12}>
                <TextValidator
                  variant='outlined'
                  required
                  fullWidth
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='current-password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  validators={['passwordLength', 'required']}
                  errorMessages={[
                    'Password must be at least 8 characters',
                    'This field is required',
                  ]}
                />
              </Grid>
              <Grid item xs={12}>
                <TextValidator
                  variant='outlined'
                  required
                  fullWidth
                  name='passwordConfirm'
                  label='Password Confirm'
                  type='password'
                  id='passwordConfirm'
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  validators={['required']}
                  errorMessages={['this field is required']}
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
              Sign Up
            </Button>
            <Grid container justify='flex-end'>
              <Grid item>
                <Link href='/auth/login' passHref>
                  <a className={classes.link}>
                    {'Already have an account? Log In'}
                  </a>
                </Link>
              </Grid>
            </Grid>
          </ValidatorForm>
        )}
      </div>
    </Container>
  );
}
