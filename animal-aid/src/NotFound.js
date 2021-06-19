import React from 'react';
import {Typography, Box, Button} from '@material-ui/core';

const NotFound = () => (
  <Box mt={4} textAlign="center">
    <Typography variant="h3">404 - Страницата не е намерена!</Typography>
    <Box mt={4}>
        <Button variant="contained" color="primary" href="/" align="center">
        Начална страница
        </Button>
    </Box>
  </Box>
);

export default NotFound;