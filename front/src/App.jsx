import { useRef, useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { AppBar, Button, Container, Grid, Toolbar, Typography, Select, MenuItem } from '@mui/material';
import DrawingCanvas from './components/DrawingCanvas';
import { spacing } from '@mui/system';

const useStyles = makeStyles((theme) => ({
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
  awnserButton: {
    width: 10,
    marginRight: 100,
  },
  appBar: {
    marginBottom: spacing(4),
    backgroundColor: 'black !important',
  },
  fullwidthContainer: {
    maxWidth: '100% !important',
    padding: 0 + ' !important',
  },
  gridContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalBar: {
    backgroundColor: 'white',
    width: '2px',
    height: '100%',
    margin: '0 auto',
  },
  select: {
    width: 300,
    margin: '20px auto',
    display: 'block',
    backgroundColor: 'white',
    color: 'black',
  },
  footer: {
    top: 'auto',
    bottom: 0,
    backgroundColor: 'black !important',
    padding: spacing(2),
    alignItems: 'center',
    marginTop: 100,
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
  footerText: {
    textAlign: 'center',
    color: 'white',
    '& a': {
      color: 'white',
      textDecoration: 'none',
      marginLeft: 5,
      marginRight: 5,
    },
  },
}));

const App = () => {
  const classes = useStyles();
  const dispatcher = useRef(null);
  const [prediction, setPrediction] = useState('...');
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState([
    'model1',
    'model2',
    'model3',
  ]);

  useEffect(() => {
    getModels();
  }
    , []);

  const sendDrawing = () => {
    if (!selectedModel) {
      alert('Please select a model');
      return;
    }
    const canvas = document.querySelector('canvas');
    const dataURL = canvas.toDataURL();
    console.log(dataURL);
    const data = {
      drawing: dataURL,
      model: selectedModel
    };
    fetch('http://localhost:3001/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => setPrediction(data.prediction));
  };

  const getModels = () => {
    fetch('http://localhost:3001/models')
      .then((response) => response.json())
      .then((data) => setModels(data));
  }

  return (
    <Container className={`${classes.root} ${classes.fullwidthContainer}`}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Digit Recognizer
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} marginTop={4}>
        <Grid item xs={12} md={5}>
          <Typography variant="h4" component="div">
            Draw a digit
          </Typography>
          <div className={classes.canvasContainer}>
            <DrawingCanvas dispatcher={dispatcher} />
          </div>
          <Grid container justify="center" spacing={2}>
            <Select
              value={selectedModel}
              onChange={(event) => setSelectedModel(event.target.value)}
              displayEmpty
              className={classes.select}
            >
              <MenuItem value="" disabled>
                Choose a model
              </MenuItem>
              {models.map((model) => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={sendDrawing}
            className={classes.button}
          >
            Send
          </Button>
        </Grid>
        <Grid item xs={12} md={2} style={{ alignSelf: 'stretch' }}>
          <div className={classes.verticalBar}></div>
        </Grid>
        <Grid item xs={12} md={5}>
          <Typography variant="h4" component="div">
            Prediction
          </Typography>
          <div className={classes.predictionContainer}>
            {prediction && (
              <Typography variant="h4" className={classes.predictionText}>
                {prediction}
              </Typography>
            )}
          </div>
          <div style={{ width: '100%', height: 20 }}>
            <Typography variant="h4" style={{ textAlign: 'center', marginTop: 20 }}>
              Is this correct?
            </Typography>
            <Button variant="contained" color="primary" className={classes.awnserButton} style={{ marginRight: 20 }} onClick={() => alert('Thanks for your feedback!')}>
              Yes
            </Button>
            <Button variant="contained" color="secondary" className={classes.awnserButton} onClick={() => alert('Thanks for your feedback!')}>
              No
            </Button>
          </div>
        </Grid>

      </Grid>
      <AppBar position="static" className={classes.footer}>
        <Toolbar>
          <Typography variant="body1" className={classes.footerText}>
            Made with ❤️ by<br></br><a href="https://github.com/MoryKadoch" target='_blank'>Mory</a> & <a href="https://github.com/Dedhal" target='_blank'>Joris</a> & <a href="https://github.com/Rambele" target='_blank'>Rachid</a> & <a href="https://github.com/yakinos" target='_blank'>Yakine</a>
          </Typography>
        </Toolbar>
      </AppBar>
    </Container>
  );
};

export default App;
