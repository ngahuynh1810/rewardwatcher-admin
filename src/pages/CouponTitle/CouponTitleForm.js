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
import {CouponTitleForm} from 'src/sections/@dashboard/couponTitle'
// import {CouponTitleForm} from 'src/sections/@dashboard/cashback';
 
function CouponTitleFormPage() {
  const navigate = useNavigate();

  let { id } = useParams(); 
 const handleBack = () => {
  navigate("/dashboard/coupon-title")
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
           <Typography variant="h4">{id ? "Edit Coupon Title" : "Create New Coupon Title"}
          </Typography></Stack> 
        </Stack> 
       <CouponTitleForm/>
      </Container>
     

    </>
  );
} 
export default CouponTitleFormPage

