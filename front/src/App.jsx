import { useRef, useState, useEffect } from 'react';
import { Button, Container, Grid, Typography, Select, MenuItem, CircularProgress, Backdrop, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import DrawingCanvas from './components/DrawingCanvas';
import Header from './components/Header';
import Footer from './components/Footer';
import { spacing, styled } from '@mui/system';
import Captcha from './components/Captcha';
import StatsModal from './components/StatsModal';
import RetrainModelModal from './components/RetrainModelModal';
import { API_BASE_URL } from '../config';

const RootContainer = styled(Container)({
  maxWidth: '100% !important',
  padding: 0 + ' !important',
});

const Title = styled(Typography)({
  marginBottom: spacing(4),
});

const CanvasContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 20,
});

const ButtonStyled = styled(Button)({
  width: 200,
});

const FullwidthContainer = styled(Container)({
  maxWidth: '100% !important',
  padding: 0 + ' !important',
});

const VerticalBar = styled('div')({
  backgroundColor: 'white',
  width: '2px',
  height: '100%',
  margin: '0 auto',
});

const SelectStyled = styled(Select)({
  width: 300,
  margin: '20px auto',
  display: 'block',
  backgroundColor: 'white',
  color: 'black',
});

const AnswerStyled = styled(TextField)({
  width: '33%',
  marginTop: 20,
  boxSizing: 'border-box',
  backgroundColor: 'white',
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
});

const PredictionContainer = styled('div')({
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
});

const PredictionText = styled(Typography)({
  fontSize: '100px !important',
});

const BackdropStyled = styled(Backdrop)({
  zIndex: 9999,
  color: '#fff',
});

const App = () => {
  const [captchaSuccess, setCaptchaSuccess] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState([
    'model1',
    'model2',
    'model3',
  ]);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerGiven, setAnswerGiven] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [prediction, setPrediction] = useState('...');
  const [confidence, setConfidence] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [retrainModalOpen, setRetrainModalOpen] = useState(false);

  useEffect(() => {
    getModels();
  }, []);

  useEffect(() => {
    const storedResponses = localStorage.getItem('responses');
    if (storedResponses) {
      setResponses(JSON.parse(storedResponses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('responses', JSON.stringify(responses));
  }, [responses]);

  const handleCaptchaSuccess = () => {
    setCaptchaSuccess(true);
  };

  const getModels = () => {
    fetch(`${API_BASE_URL}/models/`)
      .then((response) => response.json())
      .then((data) => {
        setModels(data.models);
        //console.log(data.models);
      });
  }

  const handleYes = () => {
    setResponses([...responses, { model: selectedModel, correct: true }]);
    setShowAnswer(false);
    setAnswerGiven(true);

    const canvas = document.querySelector('canvas');
    const dataURL = canvas.toDataURL().replace('data:image/png;base64,', '');

    const data = {
      drawing: dataURL,
      label: prediction,
    };

    fetch(`${API_BASE_URL}/api/stat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: selectedModel, prediction: prediction, truth: prediction, valid: true }),
    })

    fetch(`${API_BASE_URL}/api/extend/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

  };

  const handleNo = () => {
    setResponses([...responses, { model: selectedModel, correct: false }]);
    setShowAnswer(false);
    setShowCorrect(true);
    //setAnswerGiven(true);
  };

  const handleCorrect = () => {
    setShowCorrect(false);
    setAnswerGiven(true);

    const canvas = document.querySelector('canvas');
    const dataURL = canvas.toDataURL().replace('data:image/png;base64,', '');

    const data = {
      drawing: dataURL,
      label: correctAnswer,
    };

    fetch(`${API_BASE_URL}/api/stat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: selectedModel, prediction: prediction, truth: correctAnswer, valid: false }),
    })

    fetch(`${API_BASE_URL}/api/extend/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleResetStats = () => {
    localStorage.removeItem('responses');
    setResponses([]);
  };

  const sendDrawing = () => {
    if (!selectedModel) {
      alert('Please select a model');
      return;
    }

    const canvas = document.querySelector('canvas');
    const dataURL = canvas.toDataURL().replace('data:image/png;base64,', '');

    const data = {
      drawing: dataURL,
      model: selectedModel
    };
    setLoading(true);
    fetch(`${API_BASE_URL}/api/`, {
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
        setShowAnswer(true);
        setAnswerGiven(false);
      });
  };

  const handleRetrainModalOpen = () => {
    setRetrainModalOpen(true);
  };

  const handleRetrainModalClose = () => {
    setRetrainModalOpen(false);
  };

  return (
    <RootContainer className={`${FullwidthContainer}`}>
      {!captchaSuccess && <Captcha onSuccess={handleCaptchaSuccess} />}
      {captchaSuccess && (
        <>
          <Header />
          <Grid container spacing={2} marginTop={4}>
            <Grid item xs={12} md={5}>
              <Title variant="h4" component="div">
                Draw a digit
              </Title>
              <CanvasContainer>
                <DrawingCanvas />
              </CanvasContainer>
              <Grid container justify="center" spacing={2}>
                <SelectStyled
                  value={selectedModel}
                  onChange={(event) => setSelectedModel(event.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Choose a model
                  </MenuItem>
                  {models.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </SelectStyled>
              </Grid>
              <ButtonStyled
                variant="contained"
                color="primary"
                onClick={sendDrawing}
              >
                Send
              </ButtonStyled>
            </Grid>
            <Grid item xs={12} md={2} style={{ alignSelf: 'stretch' }}>
              <VerticalBar></VerticalBar>
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography variant="h4" component="div">
                Prediction
              </Typography>
              <PredictionContainer>
                {loading ? (
                  <CircularProgress color="inherit" />
                ) : (
                  prediction && (
                    <PredictionText variant="h4">
                      {prediction}
                    </PredictionText>
                  )
                )}
              </PredictionContainer>
              {showAnswer && !answerGiven && (
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                  <Typography variant="h6">
                    Confidence: {confidence}
                  </Typography>
                  <Typography variant="h4" style={{ marginTop: 20 }}>
                    Is this correct?
                  </Typography>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                    <Button variant="contained" color="primary" style={{ marginRight: 20 }} onClick={handleYes}>
                      Yes
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleNo}>
                      No
                    </Button>
                  </div>
                </div>
              )}
              {showCorrect && (
                <div>
                  <Typography variant="h4" style={{ textAlign: 'center', marginTop: 20 }}>
                    What was the correct answer?
                  </Typography>
                  <AnswerStyled variant="outlined" value={correctAnswer} onChange={(event) => setCorrectAnswer(event.target.value)}></AnswerStyled>
                  <Button variant="contained" color="primary" style={{ marginTop: 20, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} onClick={handleCorrect}>
                    Submit
                  </Button>
                </div>
              )}
              {answerGiven && (
                <Typography variant="h4" style={{ textAlign: 'center', marginTop: 20 }}>
                  Thank you for your answer!
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <ButtonStyled variant="contained" color="primary" onClick={handleModalOpen} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 10, display: 'block' }}>
                Show statistics
              </ButtonStyled>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <ButtonStyled variant="contained" color="primary" onClick={handleRetrainModalOpen} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 10, display: 'block', backgroundColor: 'red' }}>
                Retrain model
              </ButtonStyled>
            </Grid>
            <RetrainModelModal open={retrainModalOpen} handleClose={handleRetrainModalClose} models={models} />
            <StatsModal
              open={modalOpen}
              setOpen={setModalOpen}
            />
          </Grid>
          <Footer />
        </>
      )}
      <BackdropStyled open={loading}>
        <CircularProgress color="inherit" />
      </BackdropStyled>
    </RootContainer>
  );
};

export default App;
