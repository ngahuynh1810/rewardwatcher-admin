import { connect } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { ROLES } from "src/utils/setting"
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { UploadFiles } from "src/components/upload";
import { isSuccessResult, } from 'src/utils/formatResponse';
// @mui
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  TextField,
  FormGroup,
  FormControlLabel
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import AlertDialog from 'src/components/dialog';
// sections 

// ----------------------------------------------------------------------
const StyledContent = styled('div')(({ theme }) => ({
  // maxWidth: 480,
  margin: 'auto',
  // minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(4, 4),
})); 

function CouponTitleForm(props) {
  const navigate = useNavigate();

  let { id } = useParams();

  const [fileUpload, setFileUpload] = useState(null);

  const [couponTitle, setCouponTitle] = useState(null);

  const [inputValue, setInputValue] = useState('');

  const [openDialog, setOpenDialog] = useState(false);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getUploadFile = async (files) => {
    let result = await props.uploadFile({ files: [files] });
    if (result.code === 1) {
      return result.data;
    }
    return null;
  };  
 
  useEffect(() => {
    getDetailCouponTitle(id);
  }, [id]);
  const getDetailCouponTitle = async (id) => {
    if (id) {
      let resDetailUser = await props.getDetailCouponTitle({ id: id });
      if (resDetailUser?.code) {
        let {categories} = resDetailUser.data
        setCouponTitle({...resDetailUser.data, category_uuid: categories})
      }
    }
  }
  const onChangeValue = (e) => { 
    let name = e.target.name
    let value = e.target.value
    if(name === "active" ) value = e.target.checked
    setCouponTitle({
      ...couponTitle,
      [name]: value
    })
  }


  const handleCreateCouponTitle = async () => {
    if (Array.isArray(couponTitle?.image_card) && couponTitle?.image_card[0]?.data) {
      let image = await getUploadFile(couponTitle?.image_card[0])
      if (!image) return;
      couponTitle.image_card = [image]
    }
    couponTitle.cashback_website_uuid = couponTitle.cashback_website?.uuid
    couponTitle.couponTitle_uuid = couponTitle.couponTitle?.uuid
    let resultCreate = await props.createCouponTitle(couponTitle);
    if (resultCreate?.code) {
      navigate("/dashboard/coupon-title")
      toast("Create success")
    }
    else toast(resultCreate.message || resultCreate.error);
  }
  // const checkUploadServer = async (images) => {
  //   let isUploadService = false;
  //   images.forEach(element => {
  //     if(element.data) {
  //       isUploadService = true;
  //       return;
  //     }
  //     return isUploadService
  //   });
  // }
  const handleUpdateCouponTitle = async () => {
    if (Array.isArray(couponTitle?.image_card) && couponTitle?.image_card[0]?.data) {
      let image = await getUploadFile(couponTitle?.image_card[0])
      if (!image) return;
      couponTitle.image_card = [image]
    }
    console.log(couponTitle)
    couponTitle.cashback_website_uuid = couponTitle.cashback_website?.uuid
    couponTitle.couponTitle_uuid = couponTitle.couponTitle?.uuid
    let resultUpdate = await props.updateCouponTitle(couponTitle);
    if (resultUpdate?.code) {
      navigate("/dashboard/coupon-title")
      toast("Update success")
    }
    else toast(resultUpdate.message || resultUpdate.error);
  }

  const handleDeleteCouponTitle = async () => {
    let resultDelete = await props.deleteCouponTitle({ id: couponTitle?.uuid });
    if (resultDelete?.code) {
      navigate("/dashboard/coupon-title")
      toast("Delete success")
    }
    else toast(resultDelete.message || resultDelete.error);
  }
  const handleBack = () => {
    navigate("/dashboard/coupon-title")
  }
  const renderCategoryList = (listCategories) => {
    return [
      ...couponTitle?.categories || [],
      ...listCategories,
      // ...couponTitle?.categories || [],
    ]
  }
  const renderCashbackWebsiteList = (list= []) => {
    return [
      ...couponTitle?.cashback_website ? [couponTitle?.cashback_website] : [],
      ...list,
      // ...couponTitle?.categories || [],
    ]
  }
  const renderStoreList = (list= []) => {
    return [
      ...couponTitle?.couponTitle ? [couponTitle?.couponTitle] : [],
      ...list,
      // ...couponTitle?.categories || [],
    ]
  }
  return (
    <Card>
      <AlertDialog
        open={openDialog}
        handleClose={() => {
          setOpenDialog(false);
        }}
        title={"Delete"}
        content={"Are you sure want to delete?"}
        handleActionFirst={() => {
          setOpenDialog(false);
        }}
        handleActionSecond={handleDeleteCouponTitle}
      />
      <StyledContent>
        <Stack spacing={3}>
          <TextField
            id="outlined-basic"
            label="Title"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={couponTitle?.title}
            type="text"
            name="title"
            // required={e.required}
            onChange={onChangeValue}
          />
             <TextField
            id="outlined-basic"
            label="Description"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={couponTitle?.description}
            type="text"
            name="description"
            // required={e.required}
            onChange={onChangeValue}
          />
           <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={couponTitle?.active ? true : false} onChange={onChangeValue} name="active" />
              }
              label="Active"
            />
          </FormGroup>
            
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="right" style={{ marginTop: '24px' }}>
          {id ? <Button variant="contained" onClick={handleUpdateCouponTitle} >
            Update
          </Button>
            : <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateCouponTitle} >
              Create
            </Button>}
          {id ? <Button variant="contained" color="error" startIcon={<Iconify icon="material-symbols:delete" />} onClick={() => setOpenDialog(true)}  >
            Delete
          </Button> : null}
        </Stack>
      </StyledContent>
    </Card>
  );
}

const mapState = (state) => ({
  listStore: state.couponTitle.listStore,
  listCashbackWebsite: state.cashbackWebsite.listWebsiteCashback,
  listcouponTitle: state.couponTitle.listcouponTitle,
  listCategories: state.category.listCategories,
  listCouponTitle: state.couponTitle.listCouponTitle,
});
const mapDispatch = (dispatch) => ({
  getListStore: dispatch.couponTitle.getList,
    getListCashbackWebsite: dispatch.cashbackWebsite.getList,
  getListCategory: dispatch.category.getList,
  getDetailCouponTitle: dispatch.couponTitle.getDetail,
  createCouponTitle: dispatch.couponTitle.create,
  updateCouponTitle: dispatch.couponTitle.update,
  deleteCouponTitle: dispatch.couponTitle.delete,
  uploadFile: dispatch.upload.uploadFile,
});
export default connect(mapState, mapDispatch)(CouponTitleForm)

