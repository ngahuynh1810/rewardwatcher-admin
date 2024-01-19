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

function CashbackWebsiteForm(props) {
  const navigate = useNavigate();

  let { id } = useParams();

  const [fileUpload, setFileUpload] = useState(null);

  const [cashbackWebsite, setcashbackWebsite] = useState(null);

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
    getDetailCashbackWebsite(id);
  }, [id]);
  const getDetailCashbackWebsite = async (id) => {
    if (id) {
      let resDetailUser = await props.getDetailCashbackWebsite({ id: id });
      if (resDetailUser?.code) {
        let {categories} = resDetailUser.data
        setcashbackWebsite({...resDetailUser.data, category_uuid: categories})
      }
    }
  }
  const onChangeValue = (e) => { 
    let name = e.target.name
    let value = e.target.value
    if(name === "top_deal" || name === "is_popular") value = e.target.checked
    setcashbackWebsite({
      ...cashbackWebsite,
      [name]: value
    })
  }


  const handleCreateCashbackWebsite = async () => {
    if (Array.isArray(cashbackWebsite?.image) && cashbackWebsite?.image[0]?.data) {
      let image = await getUploadFile(cashbackWebsite?.image[0])
      if (!image) return;
      cashbackWebsite.image = image
    }
    let resultCreate = await props.createcashbackWebsite(cashbackWebsite);
    if (resultCreate?.code) {
      navigate("/dashboard/cashback-website")
      toast("Create success")
    }
    else toast(resultCreate.message || resultCreate.error);
  }
  if(Array.isArray(cashbackWebsite?.image)) cashbackWebsite.image = cashbackWebsite.image[0]
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
  const handleUpdateCashbackWebsite = async () => {
    if (Array.isArray(cashbackWebsite?.image) && cashbackWebsite?.image[0]?.data) {
      let image = await getUploadFile(cashbackWebsite?.image[0])
      if (!image) return;
      cashbackWebsite.image = image
    }
     if(Array.isArray(cashbackWebsite?.image)) cashbackWebsite.image = cashbackWebsite.image[0]

    let resultUpdate = await props.updatecashbackWebsite(cashbackWebsite);
    if (resultUpdate?.code) {
      navigate("/dashboard/cashback-website")
      toast("Update success")
    }
    else toast(resultUpdate.message || resultUpdate.error);
  }

  const handleDeleteCashbackWebsite = async () => {
    let resultDelete = await props.deletecashbackWebsite({ id: cashbackWebsite?.uuid });
    if (resultDelete?.code) {
      navigate("/dashboard/cashback-website")
      toast("Delete success")
    }
    else toast(resultDelete.message || resultDelete.error);
  }
  const handleBack = () => {
    navigate("/dashboard/cashback-website")
  }
  const renderCategoryList = (listCategories) => {
    return [
      ...cashbackWebsite?.categories || [],
      ...listCategories,
      // ...cashbackWebsite?.categories || [],
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
        handleActionSecond={handleDeleteCashbackWebsite}
      />
      <StyledContent>
        <Stack spacing={3}>
          <TextField
            id="outlined-basic"
            label="Name"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={cashbackWebsite?.name}
            type="text"
            name="name"
            // required={e.required}
            onChange={onChangeValue}
          />
             <TextField
            id="outlined-basic"
            label="Website"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={cashbackWebsite?.website}
            type="text"
            name="website"
            // required={e.required}
            onChange={onChangeValue}
          />
            <TextField
            id="outlined-basic"
            label="Referral Link"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={cashbackWebsite?.referral_link}
            type="text"
            name="referral_link"
            // required={e.required}
            onChange={onChangeValue}
          />
          <UploadFiles
           label="Image"
           previewImgs={cashbackWebsite?.image ? (Array.isArray(cashbackWebsite?.image) ? cashbackWebsite?.image : [cashbackWebsite?.image]) : []}
            uploadFile={(files) => onChangeValue({
              target: {
                name: "image",
                value: files,
              }
            })}
            deleteFile={(files) => onChangeValue({
              target: {
                name: "image",
                value: files,
              }
            })}
          />
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="right" style={{ marginTop: '24px' }}>
          {id ? <Button variant="contained" onClick={handleUpdateCashbackWebsite} >
            Update
          </Button>
            : <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateCashbackWebsite} >
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
    listCategories: state.category.listCategories,
    listcashbackWebsite: state.cashbackWebsite.listcashbackWebsite,
});
const mapDispatch = (dispatch) => ({
  getListCategory: dispatch.category.getList,
  getDetailCashbackWebsite: dispatch.cashbackWebsite.getDetail,
  createcashbackWebsite: dispatch.cashbackWebsite.create,
  updatecashbackWebsite: dispatch.cashbackWebsite.update,
  deletecashbackWebsite: dispatch.cashbackWebsite.delete,
  uploadFile: dispatch.upload.uploadFile,
});
export default connect(mapState, mapDispatch)(CashbackWebsiteForm)

