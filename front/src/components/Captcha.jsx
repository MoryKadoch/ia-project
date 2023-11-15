import { useRef, useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import { spacing } from '@mui/system';
import DrawingCanvas from './DrawingCanvas';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  title: {
    marginBottom: spacing(4),
  },
  canvasContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    width: 200,
  },
  predictionContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    width: 300,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
    margin: '0 auto',
    color: 'black',
  },
  predictionText: {
    fontSize: '100px !important',
  },
  backdrop: {
    zIndex: 9999,
    color: '#fff',
  },
}));

const Captcha = ({ onSuccess }) => {
  const classes = useStyles();
  const dispatcher = useRef(null);
  const [prediction, setPrediction] = useState('...');
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [digit, setDigit] = useState(Math.floor(Math.random() * 10));

  useEffect(() => {
    setDigit(Math.floor(Math.random() * 10));
  }, [prediction]);

  const sendDrawing = () => {
    const canvas = document.querySelector('canvas');
    const dataURL = canvas.toDataURL().replace('data:image/png;base64,', '');

    console.log(dataURL);
    const data = {
      drawing: dataURL,
      model: 'LSTM-1_MNIST'
    };
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setPrediction(data.prediction);
        setConfidence(data.confidence);
        setLoading(false);
        if (parseInt(data.prediction) === digit) {
            alert('You are not a robot! You can now use the app.');
          onSuccess();
        } else {
            alert('The system detected ' + data.prediction + ' instead of ' + digit + '. I think you are a robot!');
          setDigit(Math.floor(Math.random() * 10));
        }
      });
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" component="div">
        Please draw the digit {digit} to prove you are not a robot
      </Typography>
      <div className={classes.canvasContainer}>
        <DrawingCanvas dispatcher={dispatcher} />
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={sendDrawing}
        className={classes.button}
      >
        Validate
      </Button>
    </div>
  );
};

export default Captcha;
