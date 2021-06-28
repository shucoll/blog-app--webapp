import { useState } from 'react';
import axios from '../../helpers/axios-orders';

import Spinner from '../../components/UI/Spinner';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
    marginTop: '3rem',
  },
}));

const ForgetPassword = (props) => {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`/api/v1/users//resendSignupToken`, {
        email,
      });
      setLoading(false);
      setEmail('');
      setMessageSent(true);
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
          Resend Verification Email
        </Typography>
        {messageSent ? (
          <Alert severity='success' className={classes.alert}>
            Email sent to your email account for resetting password.
          </Alert>
        ) : loading ? (
          <Spinner />
        ) : (
          <ValidatorForm
            className={classes.form}
            onSubmit={submitHandler}
          >
            <Grid container spacing={2}>
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
              Send Email
            </Button>
          </ValidatorForm>
        )}
      </div>
    </Container>
  );
};

export default ForgetPassword;
