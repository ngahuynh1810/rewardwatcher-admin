import { connect } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { ROLES } from "src/utils/setting"
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
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

function CashbackShopForm(props) {
  const navigate = useNavigate();

  let { id } = useParams();

  const [fileUpload, setFileUpload] = useState(null);

  const [cashbackShop, setcashbackShop] = useState(null);

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
    getDetailcashbackShop(id);
  }, [id]);
  const getDetailcashbackShop = async (id) => {
    if (id) {
      let resDetailUser = await props.getDetailcashbackShop({ id: id });
      if (resDetailUser?.code) {
        let {categories} = resDetailUser.data
        setcashbackShop({...resDetailUser.data, category_uuid: categories})
      }
    }
  }
  const onChangeValue = (e) => { 
    let name = e.target.name
    let value = e.target.value
    if(name === "top_deal" || name === "is_popular") value = e.target.checked
    setcashbackShop({
      ...cashbackShop,
      [name]: value
    })
  }


  const handleCreatecashbackShop = async () => {
    // if (Array.isArray(cashbackShop?.image_card) && cashbackShop?.image_card[0]?.data) {
    //   let image = await getUploadFile(cashbackShop?.image_card[0])
    //   if (!image) return;
    //   cashbackShop.image_card = [image]
    // }
    cashbackShop.cashback_website_uuid = cashbackShop.cashback_website?.uuid
    cashbackShop.store_uuid = cashbackShop.store?.uuid
    let resultCreate = await props.createcashbackShop(cashbackShop);
    if (resultCreate?.code) {
      navigate("/dashboard/cashback-shop")
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
  const handleUpdatecashbackShop = async () => {
    // if (Array.isArray(cashbackShop?.image_card) && cashbackShop?.image_card[0]?.data) {
    //   let image = await getUploadFile(cashbackShop?.image_card[0])
    //   if (!image) return;
    //   cashbackShop.image_card = [image]
    // }
    cashbackShop.cashback_website_uuid = cashbackShop.cashback_website?.uuid
    cashbackShop.store_uuid = cashbackShop.store?.uuid
    let resultUpdate = await props.updatecashbackShop(cashbackShop);
    if (resultUpdate?.code) {
      navigate("/dashboard/cashback-shop")
      toast("Update success")
    }
    else toast(resultUpdate.message || resultUpdate.error);
  }

  const handleDeletecashbackShop = async () => {
    let resultDelete = await props.deletecashbackShop({ id: cashbackShop?.uuid });
    if (resultDelete?.code) {
      navigate("/dashboard/cashback-shop")
      toast("Delete success")
    }
    else toast(resultDelete.message || resultDelete.error);
  }
  const handleBack = () => {
    navigate("/dashboard/cashback-shop")
  }
  const renderCategoryList = (listCategories) => {
    return [
      ...cashbackShop?.categories || [],
      ...listCategories,
      // ...cashbackShop?.categories || [],
    ]
  }
  const renderCashbackWebsiteList = (list= []) => {
    return [
      ...cashbackShop?.cashback_website ? [cashbackShop?.cashback_website] : [],
      ...list,
      // ...store?.categories || [],
    ]
  }
  const renderStoreList = (list= []) => {
    return [
      ...cashbackShop?.store ? [cashbackShop?.store] : [],
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
        handleActionSecond={handleDeletecashbackShop}
      />
      <StyledContent>
        <Stack spacing={3}>
          <TextField
            id="outlined-basic"
            label="Cashback"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={cashbackShop?.cashback}
            type="text"
            name="cashback"
            // required={e.required}
            onChange={onChangeValue}
          />
             <TextField
            id="outlined-basic"
            label="Cashback value"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={cashbackShop?.cashback_value}
            type="text"
            name="cashback_value"
            // required={e.required}
            onChange={onChangeValue}
          />
        <Autocomplete
            id="tags-standard"
            options={renderCashbackWebsiteList(props.listCashbackWebsite)}
            renderOption={(props, option) => {return <li {...props}>{option.name}</li>}}
            getOptionLabel={(option) => option.name} 
            value={cashbackShop?.cashback_website || null}
            onChange={(event, newValue) => {
              onChangeValue({
                target: {
                  name: "cashback_website",
                  value: newValue,
                }
              });
            }}
            // getOptionSelected={(option, value) => {
            //   return option.uuid === value.uuid}
            // }
            onInputChange={(event, newInputValue) => {
              props.getListCashbackWebsite({
                page:   0,
                limit: 100,
                keyword: newInputValue,
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Cashback website"
                placeholder="Shopback"
                />
            )}
          />
           <Autocomplete
            id="tags-standard"
            options={renderStoreList(props.listStore)}
            renderOption={(props, option) => {return <li {...props}>{option.name}</li>}}
            getOptionLabel={(option) => option.name} 
            value={cashbackShop?.store || null}
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
          {id ? <Button variant="contained" onClick={handleUpdatecashbackShop} >
            Update
          </Button>
            : <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreatecashbackShop} >
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
    listCategories: state.category.listCategories,
    listcashbackShop: state.cashbackShop.listcashbackShop,
});
const mapDispatch = (dispatch) => ({
    getListStore: dispatch.store.getList,
    getListCashbackWebsite: dispatch.cashbackWebsite.getList,
  getListCategory: dispatch.category.getList,
  getDetailcashbackShop: dispatch.cashbackShop.getDetail,
  createcashbackShop: dispatch.cashbackShop.create,
  updatecashbackShop: dispatch.cashbackShop.update,
  deletecashbackShop: dispatch.cashbackShop.delete,
  uploadFile: dispatch.upload.uploadFile,
});
export default connect(mapState, mapDispatch)(CashbackShopForm)

