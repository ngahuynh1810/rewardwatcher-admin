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

function StoreTitleForm(props) {
  const navigate = useNavigate();

  let { id } = useParams();

  const [fileUpload, setFileUpload] = useState(null);

  const [storeTitle, setStoreTitle] = useState(null);

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
    getDetailStoreTitle(id);
  }, [id]);
  const getDetailStoreTitle = async (id) => {
    if (id) {
      let resDetailUser = await props.getDetailStoreTitle({ id: id });
      if (resDetailUser?.code) {
        let {categories} = resDetailUser.data
        setStoreTitle({...resDetailUser.data, category_uuid: categories})
      }
    }
  }
  const onChangeValue = (e) => { 
    let name = e.target.name
    let value = e.target.value
    if(name === "active" ) value = e.target.checked
    setStoreTitle({
      ...storeTitle,
      [name]: value
    })
  }


  const handleCreateStoreTitle = async () => {
    if (Array.isArray(storeTitle?.image_card) && storeTitle?.image_card[0]?.data) {
      let image = await getUploadFile(storeTitle?.image_card[0])
      if (!image) return;
      storeTitle.image_card = [image]
    }
    storeTitle.cashback_website_uuid = storeTitle.cashback_website?.uuid
    storeTitle.storeTitle_uuid = storeTitle.storeTitle?.uuid
    let resultCreate = await props.createStoreTitle(storeTitle);
    if (resultCreate?.code) {
      navigate("/dashboard/store-title")
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
  const handleUpdateStoreTitle = async () => {
    if (Array.isArray(storeTitle?.image_card) && storeTitle?.image_card[0]?.data) {
      let image = await getUploadFile(storeTitle?.image_card[0])
      if (!image) return;
      storeTitle.image_card = [image]
    }
    console.log(storeTitle)
    storeTitle.cashback_website_uuid = storeTitle.cashback_website?.uuid
    storeTitle.storeTitle_uuid = storeTitle.storeTitle?.uuid
    let resultUpdate = await props.updateStoreTitle(storeTitle);
    if (resultUpdate?.code) {
      navigate("/dashboard/store-title")
      toast("Update success")
    }
    else toast(resultUpdate.message || resultUpdate.error);
  }

  const handleDeleteStoreTitle = async () => {
    let resultDelete = await props.deleteStoreTitle({ id: storeTitle?.uuid });
    if (resultDelete?.code) {
      navigate("/dashboard/store-title")
      toast("Delete success")
    }
    else toast(resultDelete.message || resultDelete.error);
  }
  const handleBack = () => {
    navigate("/dashboard/store-title")
  }
  const renderCategoryList = (listCategories) => {
    return [
      ...storeTitle?.categories || [],
      ...listCategories,
      // ...storeTitle?.categories || [],
    ]
  }
  const renderCashbackWebsiteList = (list= []) => {
    return [
      ...storeTitle?.cashback_website ? [storeTitle?.cashback_website] : [],
      ...list,
      // ...storeTitle?.categories || [],
    ]
  }
  const renderStoreList = (list= []) => {
    return [
      ...storeTitle?.storeTitle ? [storeTitle?.storeTitle] : [],
      ...list,
      // ...storeTitle?.categories || [],
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
        handleActionSecond={handleDeleteStoreTitle}
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
            value={storeTitle?.title}
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
            value={storeTitle?.description}
            type="text"
            name="description"
            // required={e.required}
            onChange={onChangeValue}
          />
           <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={storeTitle?.active ? true : false} onChange={onChangeValue} name="active" />
              }
              label="Active"
            />
          </FormGroup>
            
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="right" style={{ marginTop: '24px' }}>
          {id ? <Button variant="contained" onClick={handleUpdateStoreTitle} >
            Update
          </Button>
            : <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateStoreTitle} >
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
  listStore: state.storeTitle.listStore,
  listCashbackWebsite: state.cashbackWebsite.listWebsiteCashback,
  listStoreTitle: state.storeTitle.listStoreTitle,
  listCategories: state.category.listCategories,
  listStoreTitle: state.storeTitle.listStoreTitle,
});
const mapDispatch = (dispatch) => ({
  getListStore: dispatch.storeTitle.getList,
    getListCashbackWebsite: dispatch.cashbackWebsite.getList,
  getListCategory: dispatch.category.getList,
  getDetailStoreTitle: dispatch.storeTitle.getDetail,
  createStoreTitle: dispatch.storeTitle.create,
  updateStoreTitle: dispatch.storeTitle.update,
  deleteStoreTitle: dispatch.storeTitle.delete,
  uploadFile: dispatch.upload.uploadFile,
});
export default connect(mapState, mapDispatch)(StoreTitleForm)

