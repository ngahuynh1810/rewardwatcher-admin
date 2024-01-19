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
  Chip,
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

function StoreForm(props) {
  const navigate = useNavigate();

  let { id } = useParams();

  const [fileUpload, setFileUpload] = useState(null);

  const [store, setStore] = useState(null);

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
    getDetailStore(id);
  }, [id]);
  const getDetailStore = async (id) => {
    if (id) {
      let resDetailUser = await props.getDetailStore({ id: id });
      if (resDetailUser?.code) {
        let {categories} = resDetailUser.data
        setStore({...resDetailUser.data, category_uuid: categories})
      }
    }
  }
  const onChangeValue = (e) => { 
    let name = e.target.name
    let value = e.target.value
    if(name === "top_deal" || name === "is_popular") value = e.target.checked
    setStore({
      ...store,
      [name]: value
    })
  }


  const handleCreateStore = async () => {
    if (Array.isArray(store?.image) && store?.image[0]?.data) {
      let image = await getUploadFile(store?.image[0])
      if (!image) return;
      store.image = image
    }
    if(Array.isArray(store?.image)) store.image = store.image[0]
    store.category_uuid = store.category_uuid?.map((e) => e.uuid)
    let resultCreate = await props.createStore(store);
    if (resultCreate?.code) {
      navigate("/dashboard/store")
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
  const handleUpdateStore = async () => {
    if (Array.isArray(store?.image) && store?.image[0]?.data) {
      let image = await getUploadFile(store?.image[0])
      if (!image) return;
      store.image = image
    }
    if(Array.isArray(store?.image)) store.image = store.image[0]
    store.category_uuid = store.category_uuid?.map((e) => e.uuid)
    let resultUpdate = await props.updateStore(store);
    if (resultUpdate?.code) {
      navigate("/dashboard/store")
      toast("Update success")
    }
    else toast(resultUpdate.message || resultUpdate.error);
  }

  const handleDeleteStore = async () => {
    let resultDelete = await props.deleteStore({ id: store?.uuid });
    if (resultDelete?.code) {
      navigate("/dashboard/store")
      toast("Delete success")
    }
    else toast(resultDelete.message || resultDelete.error);
  }
  const handleBack = () => {
    navigate("/dashboard/store")
  }
  const renderCategoryList = (listCategories) => {
    return [
      ...store?.categories || [],
      ...listCategories,
      // ...store?.categories || [],
    ]
  }
  console.log(store?.is_popular)
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
        handleActionSecond={handleDeleteStore}
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
            value={store?.name}
            type="text"
            name="name"
            // required={e.required}
            onChange={onChangeValue}
          />
          <TextField
            id="outlined-basic"
            label="Order by"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={store?.order_by}
            type="number"
            name="order_by"
            // required={e.required}
            onChange={onChangeValue}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={store?.is_popular ? true : false} onChange={onChangeValue} name="is_popular" />
              }
              label="Popular"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={store?.top_deal ? true : false} onChange={onChangeValue} name="top_deal" />
              }
              label="Top deal"
            />
          </FormGroup>
          <Autocomplete
        multiple
        id="tags-filled"
        options={["sg", "vn"]}
        defaultValue={[]}
        value={store?.country_code || []}
        onChange={(event, newValue) => {
          onChangeValue({
            target: {
              name: "country_code",
              value: newValue,
            }
          });
        }}
        freeSolo
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip variant="fill" label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Country code"
            placeholder="Favorites"
          />
        )}
      />
          {/* <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Country code</InputLabel>
            <Select
            multiple
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={store?.country_code || []}
              // label="Country code"
              name="country_code"
              onChange={onChangeValue}
            >
             {["sg", "vn"].map((e) => <MenuItem value={e}>{e}</MenuItem>)}
            </Select>
          </FormControl> */}
          <Autocomplete
          // freeSolo
            multiple
            id="tags-standard"
            options={renderCategoryList(props.listCategories)}
            renderOption={(props, option) => {return <li {...props}>{option.name}</li>}}
            getOptionLabel={(option) => option.name} 
            value={store?.category_uuid || []}
            onChange={(event, newValue) => {
              onChangeValue({
                target: {
                  name: "category_uuid",
                  value: newValue,
                }
              });
            }}
            // getOptionSelected={(option, value) => {
            //   return option.uuid === value.uuid}
            // }
            onInputChange={(event, newInputValue) => {
              props.getListCategory({
                page:   0,
                limit: 100,
                keyword: newInputValue,
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Categories"
                placeholder="Favorites"
                />
            )}
          />
          <UploadFiles
            label={"Image"}
            previewImgs={store?.image ? (Array.isArray(store?.image) ? store?.image : [store?.image]) : []}
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
          {id ? <Button variant="contained" onClick={handleUpdateStore} >
            Update
          </Button>
            : <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateStore} >
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
    listStore: state.store.listStore,
});
const mapDispatch = (dispatch) => ({
  getListCategory: dispatch.category.getList,
  getDetailStore: dispatch.store.getDetail,
  createStore: dispatch.store.create,
  updateStore: dispatch.store.update,
  deleteStore: dispatch.store.delete,
  uploadFile: dispatch.upload.uploadFile,
});
export default connect(mapState, mapDispatch)(StoreForm)

