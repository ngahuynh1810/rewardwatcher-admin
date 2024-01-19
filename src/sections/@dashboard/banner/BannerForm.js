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

function BannerForm(props) {
  const navigate = useNavigate();

  let { id } = useParams();

  const [fileUpload, setFileUpload] = useState(null);

  const [banner, setBanner] = useState(null);

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
    getDetailBanner(id);
  }, [id]);
  const getDetailBanner = async (id) => {
    if (id) {
      let resDetailUser = await props.getDetailBanner({ id: id });
      if (resDetailUser?.code) {
        let {categories} = resDetailUser.data
        setBanner({...resDetailUser.data, category_uuid: categories})
      }
    }
  }
  const onChangeValue = (e) => { 
    let name = e.target.name
    let value = e.target.value
    if(name === "top_deal" || name === "is_popular" || name === "active" || name === "active_button") value = e.target.checked
    setBanner({
      ...banner,
      [name]: value
    })
  }


  const handleCreateBanner = async () => {
    if (banner?.image_banner?.data) {
      let image = await getUploadFile(banner?.image_banner)
      if (!image) return;
      banner.image_banner = image
    }

    if (banner?.image_mobile_banner?.data) {
      let image = await getUploadFile(banner?.image_mobile_banner)
      if (!image) return;
      banner.image_mobile_banner = image
    }

    let resultCreate = await props.createBanner(banner);
    if (resultCreate?.code) {
      navigate("/dashboard/banner")
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
  const handleUpdateBanner = async () => {
    console.log(banner)
    if (banner?.image_banner?.data) {
      let image = await getUploadFile(banner?.image_banner)
      if (!image) return;
      banner.image_banner = image
    }

    if (banner?.image_mobile_banner?.data) {
      let image = await getUploadFile(banner?.image_mobile_banner)
      if (!image) return;
      banner.image_mobile_banner = image
    }

    let resultUpdate = await props.updateBanner(banner);
    if (resultUpdate?.code) {
      navigate("/dashboard/banner")
      toast("Update success")
    }
    else toast(resultUpdate.message || resultUpdate.error);
  }

  const handleDeleteBanner = async () => {
    let resultDelete = await props.deleteBanner({ id: banner?.uuid });
    if (resultDelete?.code) {
      navigate("/dashboard/banner")
      toast("Delete success")
    }
    else toast(resultDelete.message || resultDelete.error);
  }
  const handleBack = () => {
    navigate("/dashboard/banner")
  }
  const renderCategoryList = (listCategories) => {
    return [
      ...banner?.categories || [],
      ...listCategories,
      // ...banner?.categories || [],
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
        handleActionSecond={handleDeleteBanner}
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
            value={banner?.title}
            type="text"
            name="title"
            // required={e.required}
            onChange={onChangeValue}
          /> 
             <TextField
            id="outlined-basic"
            label="Content"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={banner?.content}
            type="text"
            name="content"
            // required={e.required}
            onChange={onChangeValue}
            maxRows={5}
            multiline
          /> 
             <TextField
            id="outlined-basic"
            label="Description"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={banner?.description}
            type="text"
            name="description"
            // required={e.required}
            onChange={onChangeValue}
          /> 
             <TextField
            id="outlined-basic"
            label="Link"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={banner?.link}
            type="text"
            name="link"
            // required={e.required}
            onChange={onChangeValue}
          /> 
          <UploadFiles
           uploadOnlyOneFile={true}
           contentUploadButton="Upload Image"
           label="Image Banner (Source files should be at least 1536 x 415 pixels for best results)"
           previewImgs={banner?.image_banner ? (Array.isArray(banner?.image_banner) ? banner?.image_banner : [banner?.image_banner]) : []}
            uploadFile={(files) => onChangeValue({
              target: {
                name: "image_banner",
                value: files,
              }
            })}
            deleteFile={(files) => onChangeValue({
              target: {
                name: "image_banner",
                value: files,
              }
            })}
          />
           <UploadFiles
           uploadOnlyOneFile={true}
           label="Image Mobile Banner (Source files should be at least 393 x 481 pixels for best results)"
           contentUploadButton="Upload Mobile Image"
            previewImgs={banner?.image_mobile_banner ? (Array.isArray(banner?.image_mobile_banner) ? banner?.image_mobile_banner : [banner?.image_mobile_banner]) : []}
            uploadFile={(files) => onChangeValue({
              target: {
                name: "image_mobile_banner",
                value: files,
              }
            })}
            deleteFile={(files) => onChangeValue({
              target: {
                name: "image_mobile_banner",
                value: files,
              }
            })}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={banner?.active ? true : false} onChange={onChangeValue} name="active" />
              }
              label="Active Banner"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={banner?.active_button ? true : false} onChange={onChangeValue} name="active_button" />
              }
              label="Active Button"
            />
          </FormGroup>
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="right" style={{ marginTop: '24px' }}>
          {id ? <Button variant="contained" onClick={handleUpdateBanner} >
            Update
          </Button>
            : <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateBanner} >
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
    listBanner: state.banner.listBanner,
});
const mapDispatch = (dispatch) => ({
  getListCategory: dispatch.category.getList,
  getDetailBanner: dispatch.banner.getDetail,
  createBanner: dispatch.banner.create,
  updateBanner: dispatch.banner.update,
  deleteBanner: dispatch.banner.delete,
  uploadFile: dispatch.upload.uploadFile,
});
export default connect(mapState, mapDispatch)(BannerForm)

