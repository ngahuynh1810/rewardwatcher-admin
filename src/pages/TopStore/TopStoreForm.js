import {  connect } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import {ROLES} from "src/utils/setting"
import {  toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import {
  Card,
  Stack,
  Container,
  Typography,
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
// sections
import {TopStoreForm} from 'src/sections/@dashboard/topStore'
// import {TopStoreForm} from 'src/sections/@dashboard/cashback';
 
function TopStoreFormPage() {
  const navigate = useNavigate();

  let { id } = useParams(); 
 const handleBack = () => {
  navigate("/dashboard/top-store")
 } 
  return (
    <>
    
      <Helmet>
        <title> User | Admin UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Stack direction="row" alignItems="center"  >
          <Iconify onClick={handleBack}  icon="openmoji:return" style={{width: "36px", cursor: "pointer"}} />
           <Typography variant="h4">{id ? "Edit Featured Store" : "Create New Featured Store"}
          </Typography></Stack> 
        </Stack> 
       <TopStoreForm/>
      </Container>
     

    </>
  );
} 
export default TopStoreFormPage

