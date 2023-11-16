import React, { useState } from 'react';
import { Modal, Typography, Button, Select, MenuItem, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { API_BASE_URL } from '../../config';

const PaperStyled = styled(Paper)({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    border: '2px solid #000',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
    padding: '20px',
});

const SelectStyled = styled(Select)({
    width: '100%',
    margin: '20px 0',
});

const ButtonStyled = styled(Button)({
    width: '100%',
});

const RetrainModelModal = ({ open, handleClose, models }) => {
    const [selectedModel, setSelectedModel] = useState('');

    const handleRetrain = () => {
        const data = { model: selectedModel };
        fetch(`${API_BASE_URL}/api/train/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                handleClose();
            })
            .catch(error => {
                console.error('Error during model retraining:', error);
                alert('Failed to retrain the model.');
            });
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <PaperStyled>
                <Typography variant="h5" style={{ textAlign: 'center' }}>
                    Retrain Model
                </Typography>
                <SelectStyled
                    value={selectedModel}
                    onChange={(event) => setSelectedModel(event.target.value)}
                    displayEmpty
                >
                    <MenuItem value="" disabled>
                        Select a model
                    </MenuItem>
                    {models.map((model) => (
                        <MenuItem key={model} value={model}>
                            {model}
                        </MenuItem>
                    ))}
                </SelectStyled>
                <ButtonStyled
                    variant="contained"
                    color="primary"
                    onClick={handleRetrain}
                    disabled={!selectedModel}
                >
                    Validate
                </ButtonStyled>
            </PaperStyled>
        </Modal>
    );
};

export default RetrainModelModal;