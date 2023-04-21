import React, { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Button, Grid, TextField, ButtonGroup,
} from '@mui/material';
import axios from '../axiosConfig';
import { IFarmer, LanguageCodesToNames } from '../interfaces';

const perPage = 10;

export default function FarmersList() {
  const [language, setLanguage] = useState<string>('en');
  const [farmers, setFarmers] = useState<IFarmer[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageNumberInput, setPageNumberInput] = useState<string>('1');

  useEffect(() => {
    axios.get('/farmers/count')
      .then((response) => {
        setTotalCount(response.data.count);
      });
  }, []);

  useEffect(() => {
    setLoading(true);

    axios.get(`/farmers?offset=${(page - 1) * perPage}&limit=${perPage}`)
      .then((response) => {
        setFarmers(response.data);
      })
      .finally(() => {
        setLoading(false);
        setPageNumberInput(page.toString());
      });
  }, [page]);

  let content = null;

  if (farmers.length > 0) {
    content = farmers.map((farmer, index) => (
      <TableRow key={farmer.phone_number}>
        <TableCell>{ (page - 1) * perPage + (index + 1) }</TableCell>
        <TableCell>{farmer.phone_number}</TableCell>
        <TableCell>{(farmer.translations[language] ?? farmer).farmer_name}</TableCell>
        <TableCell>{(farmer.translations[language] ?? farmer).state_name}</TableCell>
        <TableCell>{(farmer.translations[language] ?? farmer).district_name}</TableCell>
        <TableCell>{(farmer.translations[language] ?? farmer).village_name}</TableCell>
      </TableRow>
    ));
  } else {
    content = <TableRow><TableCell colSpan={5}>No farmers found.</TableCell></TableRow>;
  }

  return (
    <Box className="farmers-list" sx={{ maxWidth: '70%' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="body1" mr={1}>Select language:</Typography>

        <ButtonGroup variant="outlined">
          {Object.entries(LanguageCodesToNames).map(([code, name]) => (
            <Button variant="contained" disabled={language === code} onClick={() => setLanguage(code)}>{name}</Button>
          ))}
        </ButtonGroup>
      </Box>

      <Box sx={{ minHeight: '20rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No.</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Farmer Name</TableCell>
              <TableCell>State Name</TableCell>
              <TableCell>District Name</TableCell>
              <TableCell>Village Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {content}
          </TableBody>
        </Table>
      </Box>

      <Typography variant="body1" mr={1} mt={2}>
        Total Count:
        {' '}
        {totalCount}

        {isLoading && ' (Loading...)'}
      </Typography>

      <Grid container spacing={2} mt={1}>
        <Grid item>
          <Button variant="contained" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous Page
          </Button>
        </Grid>

        <Grid item>
          <Button variant="contained" disabled={farmers.length < perPage} onClick={() => setPage(page + 1)}>
            Next Page
          </Button>
        </Grid>

        <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
          <ButtonGroup variant="outlined">
            <Button variant="contained" disabled={isLoading || page === Number(pageNumberInput)} onClick={() => setPage(Number(pageNumberInput))}>
              Jump To Page
            </Button>

            <TextField
              type="number"
              size="small"
              value={pageNumberInput}
              onChange={(e) => (Number(e.target.value) < 1
                ? setPageNumberInput('1')
                : setPageNumberInput(e.target.value)
              )}
              style={{ width: '4rem' }}
              InputProps={{ inputProps: { min: 1, max: Math.ceil(totalCount / perPage) } }}
            />

            <Typography variant="body1" ml={1} sx={{ alignSelf: 'center' }}>
              of
              {' '}
              {Math.ceil(totalCount / perPage)}
            </Typography>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Box>
  );
}
