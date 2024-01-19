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

function TopStoreForm(props) {
  const navigate = useNavigate();

  let { id } = useParams();

  const [fileUpload, setFileUpload] = useState(null);

  const [topStore, setTopStore] = useState(null);

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
    getDetailTopStore(id);
  }, [id]);
  const getDetailTopStore = async (id) => {
    if (id) {
      let resDetailUser = await props.getDetailTopStore({ id: id });
      if (resDetailUser?.code) {
        let {categories} = resDetailUser.data
        setTopStore({...resDetailUser.data, category_uuid: categories})
      }
    }
  }
  const onChangeValue = (e) => { 
    let name = e.target.name
    let value = e.target.value
    setTopStore({
      ...topStore,
      [name]: value
    })
  }


  const handleCreateTopStore = async () => {
    if (Array.isArray(topStore?.image_card) && topStore?.image_card[0]?.data) {
      let image = await getUploadFile(topStore?.image_card[0])
      if (!image) return;
      topStore.image_card = [image]
    }
    topStore.cashback_website_uuid = topStore.cashback_website?.uuid
    topStore.store_uuid = topStore.store?.uuid
    let resultCreate = await props.createTopStore(topStore);
    if (resultCreate?.code) {
      navigate("/dashboard/top-store")
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
  const handleUpdateTopStore = async () => {
    if (Array.isArray(topStore?.image_card) && topStore?.image_card[0]?.data) {
      let image = await getUploadFile(topStore?.image_card[0])
      if (!image) return;
      topStore.image_card = [image]
    }
    console.log(topStore)
    topStore.cashback_website_uuid = topStore.cashback_website?.uuid
    topStore.store_uuid = topStore.store?.uuid
    let resultUpdate = await props.updateTopStore(topStore);
    if (resultUpdate?.code) {
      navigate("/dashboard/top-store")
      toast("Update success")
    }
    else toast(resultUpdate.message || resultUpdate.error);
  }

  const handleDeleteTopStore = async () => {
    let resultDelete = await props.deleteTopStore({ id: topStore?.uuid });
    if (resultDelete?.code) {
      navigate("/dashboard/top-store")
      toast("Delete success")
    }
    else toast(resultDelete.message || resultDelete.error);
  }
  const handleBack = () => {
    navigate("/dashboard/top-store")
  }
  const renderCategoryList = (listCategories) => {
    return [
      ...topStore?.categories || [],
      ...listCategories,
      // ...topStore?.categories || [],
    ]
  }
  const renderCashbackWebsiteList = (list= []) => {
    return [
      ...topStore?.cashback_website ? [topStore?.cashback_website] : [],
      ...list,
      // ...store?.categories || [],
    ]
  }
  const renderStoreList = (list= []) => {
    return [
      ...topStore?.store ? [topStore?.store] : [],
      ...list,
      // ...store?.categories || [],
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
        handleActionSecond={handleDeleteTopStore}
      />
      <StyledContent>
        <Stack spacing={3}>
          <TextField
            id="outlined-basic"
            label="Order By"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={topStore?.order_by}
            type="text"
            name="order_by"
            // required={e.required}
            onChange={onChangeValue}
          />
        <Autocomplete
            id="tags-standard"
            options={renderStoreList(props.listStore)}
            renderOption={(props, option) => {return <li {...props}>{option.name}</li>}}
            getOptionLabel={(option) => option.name} 
            value={topStore?.store || null}
            onChange={(event, newValue) => {
              onChangeValue({
                target: {
                  name: "store",
                  value: newValue,
                }
              });
            }}
            // getOptionSelected={(option, value) => {
            //   return option.uuid === value.uuid}
            // }
            onInputChange={(event, newInputValue) => {
              props.getListStore({
                page:   0,
                limit: 100,
                keyword: newInputValue,
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Store"
                placeholder="Adidas"
                />
            )}
          />
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="right" style={{ marginTop: '24px' }}>
          {id ? <Button variant="contained" onClick={handleUpdateTopStore} >
            Update
          </Button>
            : <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateTopStore} >
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
  listStore: state.store.listStore,
  listCashbackWebsite: state.cashbackWebsite.listWebsiteCashback,
  listTopStore: state.topStore.listTopStore,
  listCategories: state.category.listCategories,
  listTopStore: state.topStore.listTopStore,
});
const mapDispatch = (dispatch) => ({
  getListStore: dispatch.store.getList,
    getListCashbackWebsite: dispatch.cashbackWebsite.getList,
  getListCategory: dispatch.category.getList,
  getDetailTopStore: dispatch.topStore.getDetail,
  createTopStore: dispatch.topStore.create,
  updateTopStore: dispatch.topStore.update,
  deleteTopStore: dispatch.topStore.delete,
  uploadFile: dispatch.upload.uploadFile,
});
export default connect(mapState, mapDispatch)(TopStoreForm)

