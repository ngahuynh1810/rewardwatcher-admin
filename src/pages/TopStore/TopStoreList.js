import { connect } from "react-redux";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import React, { useState, useEffect } from 'react';
import { DataGrid, getGridNumericOperators } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';
import { formatDateTime } from "src/utils/formatTime"
import queryString from 'query-string';
// @mui
import {
    Card,
    Stack,
    Button,
    Container,
    Typography,
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import { useNavigate, useLocation } from 'react-router-dom';
import {TopStoreList} from 'src/sections/@dashboard/topStore'

// ----------------------------------------------------------------------
const { useQuery, ...data } = createFakeServer();




function TopStoreListPage(props) {
    const navigate = useNavigate();
   

    const handleRedirectTopStoreForm = () => {
        navigate("/dashboard/top-store/create")
    }
    return (
        <>
            <Helmet>
                <title> User | Admin UI </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Featured Stores
                    </Typography>
                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleRedirectTopStoreForm}>
                        New Featured Stores
                    </Button>
                </Stack>
                 <TopStoreList/>
            </Container>
        </>
    );
}
 
export default TopStoreListPage

