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

function TopStoreTitleForm(props) {
  const navigate = useNavigate();

  let { id } = useParams();

  const [fileUpload, setFileUpload] = useState(null);

  const [topStoreTitle, setTopStoreTitle] = useState(null);

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
    getDetailTopStoreTitle(id);
  }, [id]);
  const getDetailTopStoreTitle = async (id) => {
    if (id) {
      let resDetailUser = await props.getDetailTopStoreTitle({ id: id });
      if (resDetailUser?.code) {
        let {categories} = resDetailUser.data
        setTopStoreTitle({...resDetailUser.data, category_uuid: categories})
      }
    }
  }
  const onChangeValue = (e) => { 
    let name = e.target.name
    let value = e.target.value
    if(name === "active" ) value = e.target.checked
    setTopStoreTitle({
      ...topStoreTitle,
      [name]: value
    })
  }


  const handleCreateTopStoreTitle = async () => {
    if (Array.isArray(topStoreTitle?.image_card) && topStoreTitle?.image_card[0]?.data) {
      let image = await getUploadFile(topStoreTitle?.image_card[0])
      if (!image) return;
      topStoreTitle.image_card = [image]
    }
    topStoreTitle.cashback_website_uuid = topStoreTitle.cashback_website?.uuid
    topStoreTitle.topStoreTitle_uuid = topStoreTitle.topStoreTitle?.uuid
    let resultCreate = await props.createTopStoreTitle(topStoreTitle);
    if (resultCreate?.code) {
      navigate("/dashboard/top-store-title")
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
  const handleUpdateTopStoreTitle = async () => {
    if (Array.isArray(topStoreTitle?.image_card) && topStoreTitle?.image_card[0]?.data) {
      let image = await getUploadFile(topStoreTitle?.image_card[0])
      if (!image) return;
      topStoreTitle.image_card = [image]
    }
    console.log(topStoreTitle)
    topStoreTitle.cashback_website_uuid = topStoreTitle.cashback_website?.uuid
    topStoreTitle.topStoreTitle_uuid = topStoreTitle.topStoreTitle?.uuid
    let resultUpdate = await props.updateTopStoreTitle(topStoreTitle);
    if (resultUpdate?.code) {
      navigate("/dashboard/top-store-title")
      toast("Update success")
    }
    else toast(resultUpdate.message || resultUpdate.error);
  }

  const handleDeleteTopStoreTitle = async () => {
    let resultDelete = await props.deleteTopStoreTitle({ id: topStoreTitle?.uuid });
    if (resultDelete?.code) {
      navigate("/dashboard/top-store-title")
      toast("Delete success")
    }
    else toast(resultDelete.message || resultDelete.error);
  }
  const handleBack = () => {
    navigate("/dashboard/top-store-title")
  }
  const renderCategoryList = (listCategories) => {
    return [
      ...topStoreTitle?.categories || [],
      ...listCategories,
      // ...topStoreTitle?.categories || [],
    ]
  }
  const renderCashbackWebsiteList = (list= []) => {
    return [
      ...topStoreTitle?.cashback_website ? [topStoreTitle?.cashback_website] : [],
      ...list,
      // ...topStoreTitle?.categories || [],
    ]
  }
  const renderStoreList = (list= []) => {
    return [
      ...topStoreTitle?.topStoreTitle ? [topStoreTitle?.topStoreTitle] : [],
      ...list,
      // ...topStoreTitle?.categories || [],
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
        handleActionSecond={handleDeleteTopStoreTitle}
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
            value={topStoreTitle?.title}
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
            value={topStoreTitle?.description}
            type="text"
            name="description"
            // required={e.required}
            onChange={onChangeValue}
          />
           <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={topStoreTitle?.active ? true : false} onChange={onChangeValue} name="active" />
              }
              label="Active"
            />
          </FormGroup>
            
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="right" style={{ marginTop: '24px' }}>
          {id ? <Button variant="contained" onClick={handleUpdateTopStoreTitle} >
            Update
          </Button>
            : <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateTopStoreTitle} >
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
  listStore: state.topStoreTitle.listStore,
  listCashbackWebsite: state.cashbackWebsite.listWebsiteCashback,
  listtopStoreTitle: state.topStoreTitle.listtopStoreTitle,
  listCategories: state.category.listCategories,
  listTopStoreTitle: state.topStoreTitle.listTopStoreTitle,
});
const mapDispatch = (dispatch) => ({
  getListStore: dispatch.topStoreTitle.getList,
    getListCashbackWebsite: dispatch.cashbackWebsite.getList,
  getListCategory: dispatch.category.getList,
  getDetailTopStoreTitle: dispatch.topStoreTitle.getDetail,
  createTopStoreTitle: dispatch.topStoreTitle.create,
  updateTopStoreTitle: dispatch.topStoreTitle.update,
  deleteTopStoreTitle: dispatch.topStoreTitle.delete,
  uploadFile: dispatch.upload.uploadFile,
});
export default connect(mapState, mapDispatch)(TopStoreTitleForm)

