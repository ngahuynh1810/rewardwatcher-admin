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

function CashbackCardTitleForm(props) {
  const navigate = useNavigate();

  let { id } = useParams();

  const [fileUpload, setFileUpload] = useState(null);

  const [cashbackCardTitle, setCashbackCardTitle] = useState(null);

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
    getDetailCashbackCardTitle(id);
  }, [id]);
  const getDetailCashbackCardTitle = async (id) => {
    if (id) {
      let resDetailUser = await props.getDetailCashbackCardTitle({ id: id });
      if (resDetailUser?.code) {
        let {categories} = resDetailUser.data
        setCashbackCardTitle({...resDetailUser.data, category_uuid: categories})
      }
    }
  }
  const onChangeValue = (e) => { 
    let name = e.target.name
    let value = e.target.value
    if(name === "active" ) value = e.target.checked
    setCashbackCardTitle({
      ...cashbackCardTitle,
      [name]: value
    })
  }


  const handleCreateCashbackCardTitle = async () => {
    if (Array.isArray(cashbackCardTitle?.image_card) && cashbackCardTitle?.image_card[0]?.data) {
      let image = await getUploadFile(cashbackCardTitle?.image_card[0])
      if (!image) return;
      cashbackCardTitle.image_card = [image]
    }
    cashbackCardTitle.cashback_website_uuid = cashbackCardTitle.cashback_website?.uuid
    cashbackCardTitle.cashbackCardTitle_uuid = cashbackCardTitle.cashbackCardTitle?.uuid
    let resultCreate = await props.createCashbackCardTitle(cashbackCardTitle);
    if (resultCreate?.code) {
      navigate("/dashboard/cashback-card-title")
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
  const handleUpdateCashbackCardTitle = async () => {
    if (Array.isArray(cashbackCardTitle?.image_card) && cashbackCardTitle?.image_card[0]?.data) {
      let image = await getUploadFile(cashbackCardTitle?.image_card[0])
      if (!image) return;
      cashbackCardTitle.image_card = [image]
    }
    console.log(cashbackCardTitle)
    cashbackCardTitle.cashback_website_uuid = cashbackCardTitle.cashback_website?.uuid
    cashbackCardTitle.cashbackCardTitle_uuid = cashbackCardTitle.cashbackCardTitle?.uuid
    let resultUpdate = await props.updateCashbackCardTitle(cashbackCardTitle);
    if (resultUpdate?.code) {
      navigate("/dashboard/cashback-card-title")
      toast("Update success")
    }
    else toast(resultUpdate.message || resultUpdate.error);
  }

  const handleDeleteCashbackCardTitle = async () => {
    let resultDelete = await props.deleteCashbackCardTitle({ id: cashbackCardTitle?.uuid });
    if (resultDelete?.code) {
      navigate("/dashboard/cashback-card-title")
      toast("Delete success")
    }
    else toast(resultDelete.message || resultDelete.error);
  }
  const handleBack = () => {
    navigate("/dashboard/cashback-card-title")
  }
  const renderCategoryList = (listCategories) => {
    return [
      ...cashbackCardTitle?.categories || [],
      ...listCategories,
      // ...cashbackCardTitle?.categories || [],
    ]
  }
  const renderCashbackWebsiteList = (list= []) => {
    return [
      ...cashbackCardTitle?.cashback_website ? [cashbackCardTitle?.cashback_website] : [],
      ...list,
      // ...cashbackCardTitle?.categories || [],
    ]
  }
  const renderStoreList = (list= []) => {
    return [
      ...cashbackCardTitle?.cashbackCardTitle ? [cashbackCardTitle?.cashbackCardTitle] : [],
      ...list,
      // ...cashbackCardTitle?.categories || [],
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
        handleActionSecond={handleDeleteCashbackCardTitle}
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
            value={cashbackCardTitle?.title}
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
            value={cashbackCardTitle?.description}
            type="text"
            name="description"
            // required={e.required}
            onChange={onChangeValue}
          />
           <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={cashbackCardTitle?.active ? true : false} onChange={onChangeValue} name="active" />
              }
              label="Active"
            />
          </FormGroup>
            
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="right" style={{ marginTop: '24px' }}>
          {id ? <Button variant="contained" onClick={handleUpdateCashbackCardTitle} >
            Update
          </Button>
            : <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateCashbackCardTitle} >
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
  listStore: state.cashbackCardTitle.listStore,
  listCashbackWebsite: state.cashbackWebsite.listWebsiteCashback,
  listcashbackCardTitle: state.cashbackCardTitle.listcashbackCardTitle,
  listCategories: state.category.listCategories,
  listCashbackCardTitle: state.cashbackCardTitle.listCashbackCardTitle,
});
const mapDispatch = (dispatch) => ({
  getListStore: dispatch.cashbackCardTitle.getList,
    getListCashbackWebsite: dispatch.cashbackWebsite.getList,
  getListCategory: dispatch.category.getList,
  getDetailCashbackCardTitle: dispatch.cashbackCardTitle.getDetail,
  createCashbackCardTitle: dispatch.cashbackCardTitle.create,
  updateCashbackCardTitle: dispatch.cashbackCardTitle.update,
  deleteCashbackCardTitle: dispatch.cashbackCardTitle.delete,
  uploadFile: dispatch.upload.uploadFile,
});
export default connect(mapState, mapDispatch)(CashbackCardTitleForm)

