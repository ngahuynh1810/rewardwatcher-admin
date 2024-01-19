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
  TextField
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import AlertDialog from 'src/components/dialog';

 

const StyledContent = styled('div')(({ theme }) => ({
  // maxWidth: 480,
  margin: 'auto',
  // minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(4, 4),
})); 
 
 
function GroupCategoryForm(props) {
  const navigate = useNavigate();

  let { id } = useParams();

  const [fileUpload, setFileUpload] = useState(null);

  const [groupCategory, setGroupCategory] = useState(null);

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
 

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };



  useEffect(() => {
    getDetailGroupCategory(id);
  }, [id]);
  const getDetailGroupCategory = async (id) => {
    if (id) {
      let resDetailGroupCategory = await props.getDetailGroupCategory({ id: id });
      if (resDetailGroupCategory?.code) {
        let {categories} = resDetailGroupCategory.data
        setGroupCategory({...resDetailGroupCategory.data, category_uuid:  categories})
      }
    }
  }
  const onChangeValue = (e) => {
    setGroupCategory({
      ...groupCategory,
      [e.target.name]: e.target.value
    })
  }


  const handleCreateGroupCategory = async () => {
    if (groupCategory?.image?.data) {
      let image = await getUploadFile(groupCategory?.image)
      if (!image) return;
      groupCategory.image = image
    }
    groupCategory.category_uuid = groupCategory.category_uuid.map((e) => e.uuid)

    let resultCreate = await props.createGroupCategory(groupCategory);
    if (resultCreate?.code) {
      navigate("/dashboard/group-categories")
      toast("Create success")
    }
    else toast(resultCreate.message || resultCreate.error);
  }
  const handleUpdateGroupCategory = async () => {
    if (groupCategory?.image?.data) {
      let image = await getUploadFile(groupCategory?.image)
      if (!image) return;
      groupCategory.image = image
    }
    groupCategory.category_uuid = groupCategory.category_uuid.map((e) => e.uuid)
    let resultUpdate = await props.updateGroupCategory(groupCategory);
    if (resultUpdate?.code) {
      navigate("/dashboard/group-categories")
      toast("Update success")
    }
    else toast(resultUpdate.message || resultUpdate.error);
  }

  const handleDeleteGroupCategory = async () => {
    let resultDelete = await props.deleteGroupCategory({ id: groupCategory?.uuid });
    if (resultDelete?.code) {
      navigate("/dashboard/group-categories")
      toast("Delete success")
    }
    else toast(resultDelete.message || resultDelete.error);
  }
  const handleBack = () => {
    navigate("/dashboard/group-categories")
  }
  const renderCategoryList = (listCategories) => {
    return [
      ...groupCategory?.categories || [],
      ...listCategories,
      // ...groupCategory?.categories || [],
    ]
  }
  const formGroupCategory = [
    {
      type: "text",
      label: "Name",
      name: "name",
      value: groupCategory?.name,
    },
    {
      type: "text",
      label: "Code",
      name: "code",
      value: groupCategory?.code,
    },
    {
      type: "number",
      label: "Order",
      name: "order",
      value: groupCategory?.order,
    },
  ]
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
        handleActionSecond={handleDeleteGroupCategory}
      />
      <StyledContent>
        <Stack spacing={3}>
          {formGroupCategory.map((e) => {
            if (!e.hidden)
              return <TextField
                id="outlined-basic"
                label={e.label}
                InputProps={{
                  readOnly: e.disable ? true : false,
                }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={e.value}
                type={e.type}
                name={e.name}
                required={e.required}
                onChange={onChangeValue}
              />
          })}
               <Autocomplete
          // freeSolo
            multiple
            id="tags-standard"
            options={renderCategoryList(props.listCategories)}
            renderOption={(props, option) => {return <li {...props}>{option.name}</li>}}
            getOptionLabel={(option) => option.name} 
            value={groupCategory?.category_uuid || []}
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
            previewImgs={groupCategory?.image ? (Array.isArray(groupCategory?.image) ? groupCategory?.image : [groupCategory?.image]) : []}
            uploadFile={(files) => onChangeValue({
              target: {
                name: "image",
                value: files && files[0],
              }
            })}
            deleteFile={(files) => onChangeValue({
              target: {
                name: "image",
                value: null,
              }
            })}
          />
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="right" style={{ marginTop: '24px' }}>
          {id ? <Button variant="contained" onClick={handleUpdateGroupCategory} >
            Update
          </Button>
            : <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateGroupCategory} >
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
    listGroupCategory: state.groupCategory.listGroupCategory,
});
const mapDispatch = (dispatch) => ({
  getDetailGroupCategory: dispatch.groupCategory.getDetail,
  createGroupCategory: dispatch.groupCategory.create,
  updateGroupCategory: dispatch.groupCategory.update,
  deleteGroupCategory: dispatch.groupCategory.delete,
  uploadFile: dispatch.upload.uploadFile,
  getListCategory: dispatch.category.getList,
});
export default connect(mapState, mapDispatch)(GroupCategoryForm)

