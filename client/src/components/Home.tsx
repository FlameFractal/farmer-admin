import React, { useState } from 'react';
import { Button, ButtonGroup, Grid } from '@mui/material';
import FarmersList from './FarmersList';
import UploadCsv from './UploadCsv';

export default function HomePage({ onLogout }: { onLogout: () => void }) {
  const [selectedOption, setSelectedOption] = useState<'upload' | 'list'>('list');

  const styleForSelectedOption = {
    background: 'black',
    color: 'white',
    '&:hover': {
      background: 'black',
      color: 'white',
    },
  };

  const styleForUnselectedOption = {
    background: 'white',
    color: 'black',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.1)',
      color: 'black',
    },
  };

  return (
    <Grid sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      margin: '1rem 2rem',
    }}
    >
      <ButtonGroup>
        <Button
          onClick={() => setSelectedOption('list')}
          sx={selectedOption === 'list' ? styleForSelectedOption : styleForUnselectedOption}
        >
          Farmers List
        </Button>

        <Button
          onClick={() => setSelectedOption('upload')}
          sx={selectedOption === 'upload' ? styleForSelectedOption : styleForUnselectedOption}
        >
          Upload CSV
        </Button>

        <Button onClick={onLogout} sx={{ color: 'black', marginLeft: '1rem' }}>Logout</Button>
      </ButtonGroup>

      <Grid sx={{ marginTop: '1rem' }}>
        {selectedOption === 'upload' ? <UploadCsv /> : <FarmersList />}
      </Grid>
    </Grid>
  );
}
