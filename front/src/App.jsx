import { useRef, useState } from 'react';
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
  appBar: {
    marginBottom: spacing(4),
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
  },
}));

const App = () => {
  const classes = useStyles();
  const dispatcher = useRef(null);
  const [prediction, setPrediction] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [models, setModels] = useState([]);

  const sendDrawing = () => {
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
                <MenuItem key={model} value={model} className={classes.menuItem}>
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
          {prediction && (
            <Typography variant="h4" component="div">
              {prediction}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
