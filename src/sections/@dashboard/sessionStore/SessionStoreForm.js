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

function SessionStoreForm(props) {
  const navigate = useNavigate();

  let { id } = useParams();

  const [fileUpload, setFileUpload] = useState(null);

  const [sessionStore, setSessionStore] = useState(null);

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
    getDetailSessionStore(id);
  }, [id]);
  const getDetailSessionStore = async (id) => {
    if (id) {
      let resDetailUser = await props.getDetailSessionStore({ id: id });
      if (resDetailUser?.code) {
        let {categories} = resDetailUser.data
        setSessionStore({...resDetailUser.data, category_uuid: categories})
      }
    }
  }
  const onChangeValue = (e) => { 
    let name = e.target.name
    let value = e.target.value
    setSessionStore({
      ...sessionStore,
      [name]: value
    })
  }


  const handleCreateSessionStore = async () => {
    if (Array.isArray(sessionStore?.image_card) && sessionStore?.image_card[0]?.data) {
      let image = await getUploadFile(sessionStore?.image_card[0])
      if (!image) return;
      sessionStore.image_card = [image]
    }
    sessionStore.cashback_website_uuid = sessionStore.cashback_website?.uuid
    sessionStore.store_uuid = sessionStore.store?.uuid
    let resultCreate = await props.createSessionStore(sessionStore);
    if (resultCreate?.code) {
      navigate("/dashboard/season-store")
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
  const handleUpdateSessionStore = async () => {
    if (Array.isArray(sessionStore?.image_card) && sessionStore?.image_card[0]?.data) {
      let image = await getUploadFile(sessionStore?.image_card[0])
      if (!image) return;
      sessionStore.image_card = [image]
    }
    console.log(sessionStore)
    sessionStore.cashback_website_uuid = sessionStore.cashback_website?.uuid
    sessionStore.store_uuid = sessionStore.store?.uuid
    let resultUpdate = await props.updateSessionStore(sessionStore);
    if (resultUpdate?.code) {
      navigate("/dashboard/season-store")
      toast("Update success")
    }
    else toast(resultUpdate.message || resultUpdate.error);
  }

  const handleDeleteSessionStore = async () => {
    let resultDelete = await props.deleteSessionStore({ id: sessionStore?.uuid });
    if (resultDelete?.code) {
      navigate("/dashboard/season-store")
      toast("Delete success")
    }
    else toast(resultDelete.message || resultDelete.error);
  }
  const handleBack = () => {
    navigate("/dashboard/season-store")
  }
  const renderCategoryList = (listCategories) => {
    return [
      ...sessionStore?.categories || [],
      ...listCategories,
      // ...sessionStore?.categories || [],
    ]
  }
  const renderCashbackWebsiteList = (list= []) => {
    return [
      ...sessionStore?.cashback_website ? [sessionStore?.cashback_website] : [],
      ...list,
      // ...store?.categories || [],
    ]
  }
  const renderStoreList = (list= []) => {
    return [
      ...sessionStore?.store ? [sessionStore?.store] : [],
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
        handleActionSecond={handleDeleteSessionStore}
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
            value={sessionStore?.order_by}
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
            value={sessionStore?.store || null}
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
          {id ? <Button variant="contained" onClick={handleUpdateSessionStore} >
            Update
          </Button>
            : <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateSessionStore} >
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
  listsessionStore: state.sessionStore.listsessionStore,
  listCategories: state.category.listCategories,
  listSessionStore: state.sessionStore.listSessionStore,
});
const mapDispatch = (dispatch) => ({
  getListStore: dispatch.store.getList,
    getListCashbackWebsite: dispatch.cashbackWebsite.getList,
  getListCategory: dispatch.category.getList,
  getDetailSessionStore: dispatch.sessionStore.getDetail,
  createSessionStore: dispatch.sessionStore.create,
  updateSessionStore: dispatch.sessionStore.update,
  deleteSessionStore: dispatch.sessionStore.delete,
  uploadFile: dispatch.upload.uploadFile,
});
export default connect(mapState, mapDispatch)(SessionStoreForm)

