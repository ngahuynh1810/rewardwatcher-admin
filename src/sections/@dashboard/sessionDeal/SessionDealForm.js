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

function SessionDealForm(props) {
  const navigate = useNavigate();

  let { id } = useParams();

  const [fileUpload, setFileUpload] = useState(null);

  const [sessionDeal, setSessionDeal] = useState(null);

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
    getDetailSessionDeal(id);
  }, [id]);
  const getDetailSessionDeal = async (id) => {
    if (id) {
      let resDetailUser = await props.getDetailSessionDeal({ id: id });
      if (resDetailUser?.code) {
        let {categories} = resDetailUser.data
        setSessionDeal({...resDetailUser.data, category_uuid: categories})
      }
    }
  }
  const onChangeValue = (e) => { 
    let name = e.target.name
    let value = e.target.value
    if(name === "active" ) value = e.target.checked
    setSessionDeal({
      ...sessionDeal,
      [name]: value
    })
  }


  const handleCreateSessionDeal = async () => {
    if (Array.isArray(sessionDeal?.image_card) && sessionDeal?.image_card[0]?.data) {
      let image = await getUploadFile(sessionDeal?.image_card[0])
      if (!image) return;
      sessionDeal.image_card = [image]
    }
    sessionDeal.cashback_website_uuid = sessionDeal.cashback_website?.uuid
    sessionDeal.sessionDeal_uuid = sessionDeal.sessionDeal?.uuid
    let resultCreate = await props.createSessionDeal(sessionDeal);
    if (resultCreate?.code) {
      navigate("/dashboard/season-deal")
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
  const handleUpdateSessionDeal = async () => {
    if (Array.isArray(sessionDeal?.image_card) && sessionDeal?.image_card[0]?.data) {
      let image = await getUploadFile(sessionDeal?.image_card[0])
      if (!image) return;
      sessionDeal.image_card = [image]
    }
    console.log(sessionDeal)
    sessionDeal.cashback_website_uuid = sessionDeal.cashback_website?.uuid
    sessionDeal.sessionDeal_uuid = sessionDeal.sessionDeal?.uuid
    let resultUpdate = await props.updateSessionDeal(sessionDeal);
    if (resultUpdate?.code) {
      navigate("/dashboard/season-deal")
      toast("Update success")
    }
    else toast(resultUpdate.message || resultUpdate.error);
  }

  const handleDeleteSessionDeal = async () => {
    let resultDelete = await props.deleteSessionDeal({ id: sessionDeal?.uuid });
    if (resultDelete?.code) {
      navigate("/dashboard/season-deal")
      toast("Delete success")
    }
    else toast(resultDelete.message || resultDelete.error);
  }
  const handleBack = () => {
    navigate("/dashboard/season-deal")
  }
  const renderCategoryList = (listCategories) => {
    return [
      ...sessionDeal?.categories || [],
      ...listCategories,
      // ...sessionDeal?.categories || [],
    ]
  }
  const renderCashbackWebsiteList = (list= []) => {
    return [
      ...sessionDeal?.cashback_website ? [sessionDeal?.cashback_website] : [],
      ...list,
      // ...sessionDeal?.categories || [],
    ]
  }
  const renderStoreList = (list= []) => {
    return [
      ...sessionDeal?.sessionDeal ? [sessionDeal?.sessionDeal] : [],
      ...list,
      // ...sessionDeal?.categories || [],
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
        handleActionSecond={handleDeleteSessionDeal}
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
            value={sessionDeal?.title}
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
            value={sessionDeal?.description}
            type="text"
            name="description"
            // required={e.required}
            onChange={onChangeValue}
          />
           <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={sessionDeal?.active ? true : false} onChange={onChangeValue} name="active" />
              }
              label="Active"
            />
          </FormGroup>
            
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="right" style={{ marginTop: '24px' }}>
          {id ? <Button variant="contained" onClick={handleUpdateSessionDeal} >
            Update
          </Button>
            : <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateSessionDeal} >
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
  listStore: state.sessionDeal.listStore,
  listCashbackWebsite: state.cashbackWebsite.listWebsiteCashback,
  listsessionDeal: state.sessionDeal.listsessionDeal,
  listCategories: state.category.listCategories,
  listSessionDeal: state.sessionDeal.listSessionDeal,
});
const mapDispatch = (dispatch) => ({
  getListStore: dispatch.sessionDeal.getList,
    getListCashbackWebsite: dispatch.cashbackWebsite.getList,
  getListCategory: dispatch.category.getList,
  getDetailSessionDeal: dispatch.sessionDeal.getDetail,
  createSessionDeal: dispatch.sessionDeal.create,
  updateSessionDeal: dispatch.sessionDeal.update,
  deleteSessionDeal: dispatch.sessionDeal.delete,
  uploadFile: dispatch.upload.uploadFile,
});
export default connect(mapState, mapDispatch)(SessionDealForm)

