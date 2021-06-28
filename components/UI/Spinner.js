import React from 'react';
import { CircularProgress } from '@material-ui/core';

const Spinner = (props) => {
  let style;
  if (props.center)
    style = {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    };
  return (
    <div style={style}>
      <CircularProgress />
    </div>
  );
};

export default Spinner;
