import { useRef, useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import DrawingCanvas from './DrawingCanvas';
import { styled } from "@mui/system";

const Root = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
});

const Title = styled(Typography)({
    marginBottom: 4,
});

const CanvasContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
});

const StyledButton = styled(Button)({
    width: 200,
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

const Captcha = ({ onSuccess }) => {
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
        <Root>
            <Title variant="h4" component="div">
                Please draw the digit {digit} to prove you are not a robot
            </Title>
            <CanvasContainer>
                <DrawingCanvas dispatcher={dispatcher} />
            </CanvasContainer>
            <StyledButton
                variant="contained"
                color="primary"
                onClick={sendDrawing}
            >
                Validate
            </StyledButton>
        </Root>
    );
};

export default Captcha;
