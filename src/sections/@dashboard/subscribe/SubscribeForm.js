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

function SubscribeForm(props) {
  const navigate = useNavigate();

  let { id } = useParams();

  const [fileUpload, setFileUpload] = useState(null);

  const [subscribe, setSubscribe] = useState(null);

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
    getDetailSubscribe(id);
  }, [id]);
  const getDetailSubscribe = async (id) => {
    if (id) {
      let resDetailUser = await props.getDetailSubscribe({ id: id });
      if (resDetailUser?.code) {
        let {categories} = resDetailUser.data
        setSubscribe({...resDetailUser.data, category_uuid: categories})
      }
    }
  }
  const onChangeValue = (e) => { 
    let name = e.target.name
    let value = e.target.value
    if(name === "active" ) value = e.target.checked
    setSubscribe({
      ...subscribe,
      [name]: value
    })
  }


  const handleCreateSubscribe = async () => {
    if (Array.isArray(subscribe?.image_card) && subscribe?.image_card[0]?.data) {
      let image = await getUploadFile(subscribe?.image_card[0])
      if (!image) return;
      subscribe.image_card = [image]
    }
    subscribe.cashback_website_uuid = subscribe.cashback_website?.uuid
    subscribe.subscribe_uuid = subscribe.subscribe?.uuid
    let resultCreate = await props.createSubscribe(subscribe);
    if (resultCreate?.code) {
      navigate("/dashboard/subscribe")
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
  const handleUpdateSubscribe = async () => {
    if (Array.isArray(subscribe?.image_card) && subscribe?.image_card[0]?.data) {
      let image = await getUploadFile(subscribe?.image_card[0])
      if (!image) return;
      subscribe.image_card = [image]
    }
    console.log(subscribe)
    subscribe.cashback_website_uuid = subscribe.cashback_website?.uuid
    subscribe.subscribe_uuid = subscribe.subscribe?.uuid
    let resultUpdate = await props.updateSubscribe(subscribe);
    if (resultUpdate?.code) {
      navigate("/dashboard/subscribe")
      toast("Update success")
    }
    else toast(resultUpdate.message || resultUpdate.error);
  }

  const handleDeleteSubscribe = async () => {
    let resultDelete = await props.deleteSubscribe({ id: subscribe?.uuid });
    if (resultDelete?.code) {
      navigate("/dashboard/subscribe")
      toast("Delete success")
    }
    else toast(resultDelete.message || resultDelete.error);
  }
  const handleBack = () => {
    navigate("/dashboard/subscribe")
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
        handleActionSecond={handleDeleteSubscribe}
      />
      <StyledContent>
        <Stack spacing={3}>
          <TextField
            id="outlined-basic"
            label="Email"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={subscribe?.email}
            type="text"
            name="email"
            disabled={true}
            // required={e.required}
            onChange={onChangeValue}
          />
            
            
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="right" style={{ marginTop: '24px' }}>
          {id ? null
          // <Button variant="contained" onClick={handleUpdateSubscribe} >
          //   Update
          // </Button>
            : <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateSubscribe} >
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
  listSubscribe: state.subscribe.listSubscribe,
});
const mapDispatch = (dispatch) => ({
  getDetailSubscribe: dispatch.subscribe.getDetail,
  createSubscribe: dispatch.subscribe.create,
  updateSubscribe: dispatch.subscribe.update,
  deleteSubscribe: dispatch.subscribe.delete,
});
export default connect(mapState, mapDispatch)(SubscribeForm)

