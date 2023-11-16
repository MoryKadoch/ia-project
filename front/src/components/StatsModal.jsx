import React, { useState, useEffect } from 'react';
import { Modal, Typography, Backdrop, CircularProgress, IconButton, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import CloseIcon from '@mui/icons-material/Close';
import { API_BASE_URL } from '../../config';

ChartJS.register(ArcElement, Tooltip, Legend);

const PaperStyled = styled('div')({
    backgroundColor: 'white',
    border: '2px solid #000',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
    padding: '16px 32px 24px',
    width: '80vw',
    maxHeight: '80vh',
    overflowY: 'auto',
    position: 'relative',
    zIndex: 1000,
});

const ModalStyled = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const CloseButton = styled(IconButton)({
    position: 'absolute', 
    top: 8,
    right: 8,
});

const StatsModal = ({ open, setOpen }) => {
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/stat/`)
            .then((response) => response.json())
            .then((data) => {
                setResponses(data);
            });
    }, [open]);

    const groupResponsesByModel = (responses) => {
        return responses.reduce((acc, curr) => {
            const { model, valid } = curr;
            if (!acc[model]) {
                acc[model] = { valid: 0, invalid: 0 };
            }
            acc[model][valid ? 'valid' : 'invalid']++;
            return acc;
        }, {});
    };

    const convertToPercentage = (data) => {
        const total = data.valid + data.invalid;
        const validPercentage = ((data.valid / total) * 100).toFixed(2);
        const invalidPercentage = ((data.invalid / total) * 100).toFixed(2);
        return {
            valid: validPercentage,
            invalid: invalidPercentage,
        };
    };

    const modelsData = groupResponsesByModel(responses);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <ModalStyled
            open={open}
            onClose={handleClose}
            aria-labelledby="model-statistics"
            aria-describedby="model-statistics"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <PaperStyled>
                <CloseButton onClick={handleClose}>
                    <CloseIcon />
                </CloseButton>
                <Typography variant="h4" component="div" style={{ textAlign: 'center', color: 'black' }}>
                    Statistics by Model
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                {Object.keys(modelsData).map((model) => {
                    const { valid, invalid } = convertToPercentage(modelsData[model]);
                    const data = {
                        labels: ['Valid', 'Invalid'],
                        datasets: [
                            {
                                label: 'Prediction Accuracy',
                                data: [valid, invalid],
                                backgroundColor: ['#36A2EB', '#FF6384'],
                                hoverBackgroundColor: ['#36A2EB', '#FF6384'],
                            },
                        ],
                    };
                    const options = {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'bottom',
                            },
                            title: {
                                display: true,
                                text: `Model: ${model}`,
                            },
                        },
                    };
                    return (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={model}>
                            <Typography variant="h5" component="div" style={{ textAlign: 'center', color: 'black', marginBottom: '10px' }}>
                                {model} {valid}% {valid >= invalid ? '🎉' : '😢'} ({modelsData[model].valid + modelsData[model].invalid})
                            </Typography>
                            <Doughnut data={data} options={options} />
                        </Grid>
                    );
                })}
                </Grid>
                
                {responses.length === 0 && (
                    <CircularProgress color="inherit" />
                )}
            </PaperStyled>
        </ModalStyled>
    );
};

export default StatsModal;
