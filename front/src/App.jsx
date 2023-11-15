import { useRef, useState, useEffect } from 'react';
import { Button, Container, Grid, Typography, Select, MenuItem, CircularProgress, Backdrop, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DrawingCanvas from './components/DrawingCanvas';
import Header from './components/Header';
import Footer from './components/Footer';
import { spacing, styled } from '@mui/system';
import Captcha from './components/Captcha';

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

const ModalStyled = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const PaperStyled = styled('div')({
  backgroundColor: 'white',
  border: '2px solid #000',
  boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
  padding: spacing(2, 4, 3),
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
  const [responses, setResponses] = useState(localStorage.getItem('responses') ? JSON.parse(localStorage.getItem('responses')) : []);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerGiven, setAnswerGiven] = useState(false);
  const [prediction, setPrediction] = useState('...');
  const [confidence, setConfidence] = useState(0);

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
    fetch('http://127.0.0.1:8000/models')
      .then((response) => response.json())
      .then((data) => {
        setModels(data.models);
        console.log(data.models);
      });
  }

  const handleYes = () => {
    setResponses([...responses, { model: selectedModel, correct: true }]);
    setShowAnswer(false);
    setAnswerGiven(true);
  };

  const handleNo = () => {
    setResponses([...responses, { model: selectedModel, correct: false }]);
    setShowAnswer(false);
    setAnswerGiven(true);
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

    console.log(dataURL);
    const data = {
      drawing: dataURL,
      model: selectedModel
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
        setShowAnswer(true);
        setAnswerGiven(false);
      });
  };

  const getModelStats = (model) => {
    const total = responses.filter((response) => response.model === model).length;
    const correct = responses.filter((response) => response.model === model && response.correct).length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return `${percentage}% (${correct}/${total})`;
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
              {answerGiven && (
                <Typography variant="h4" style={{ textAlign: 'center', marginTop: 20 }}>
                  Thank you for your answer!
                </Typography>
              )}
            </Grid>
            <ButtonStyled variant="contained" color="primary" onClick={handleModalOpen} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 10, display: 'block' }}>
              Show statistics
            </ButtonStyled>
            <ModalStyled
              open={modalOpen}
              onClose={handleModalClose}
              aria-labelledby="model-statistics"
              aria-describedby="model-statistics"
            >
              <PaperStyled>
                <Typography variant="h4" component="div" style={{ margin: 20, textAlign: 'center', color: 'black' }}>
                  Model statistics
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Model</TableCell>
                        <TableCell>Accuracy</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {models.map((model) => (
                        <TableRow key={model}>
                          <TableCell>{model}</TableCell>
                          <TableCell>{getModelStats(model)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <ButtonStyled variant="contained" color="secondary" onClick={handleResetStats} style={{ margin: 20 }}>
                  Reset statistics
                </ButtonStyled>
              </PaperStyled>
            </ModalStyled>
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
