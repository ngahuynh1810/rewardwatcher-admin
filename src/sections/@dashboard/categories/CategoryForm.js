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
// sections
// mock
import USERLIST from 'src/_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'username', label: 'Username', alignRight: false },
  { id: '' },
];

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
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

function CategoryForm(props) {
  const navigate = useNavigate();

  let { id } = useParams();

  const [fileUpload, setFileUpload] = useState(null);

  const [user, setUser] = useState(null);

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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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


  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  useEffect(() => {
    getDetailCategory(id);
  }, [id]);
  const getDetailCategory = async (id) => {
    if (id) {
      let resDetailUser = await props.getDetailCategory({ id: id });
      if (resDetailUser?.code) setUser(resDetailUser.data)
    }
  }
  const onChangeValue = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }


  const handleCreateCategory = async () => {
    if (user?.image?.data) {
      let image = await getUploadFile(user?.image)
      if (!image) return;
      user.image = image
    }
    if (user?.image_hover?.data) {
      let image = await getUploadFile(user?.image_hover)
      if (!image) return;
      user.image_hover = image
    }
    let resultCreate = await props.createCategory(user);
    if (resultCreate?.code) {
      navigate("/dashboard/category")
      toast("Create success")
    }
    else toast(resultCreate.message || resultCreate.error);
  }
  const handleUpdateCategory = async () => {
    if (user?.image?.data) {
      let image = await getUploadFile(user?.image)
      if (!image) return;
      user.image = image
    }
    if (user?.image_hover?.data) {
      let image = await getUploadFile(user?.image_hover)
      if (!image) return;
      user.image_hover = image
    }
    let resultUpdate = await props.updateCategory(user);
    if (resultUpdate?.code) {
      navigate("/dashboard/category")
      toast("Update success")
    }
    else toast(resultUpdate.message || resultUpdate.error);
  }

  const handleDeleteCategory = async () => {
    let resultDelete = await props.deleteCategory({ id: user?.uuid });
    if (resultDelete?.code) {
      navigate("/dashboard/category")
      toast("Delete success")
    }
    else toast(resultDelete.message || resultDelete.error);
  }
  const handleBack = () => {
    navigate("/dashboard/category")
  }
  const formUser = [
    {
      type: "text",
      label: "Name",
      name: "name",
      value: user?.name,
    },
    {
      type: "number",
      label: "Order",
      name: "order",
      value: user?.order,
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
        handleActionSecond={handleDeleteCategory}
      />
      <StyledContent>
        <Stack spacing={3}>
          {formUser.map((e) => {
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
          <UploadFiles
           label="Image"
           previewImgs={user?.image ? (Array.isArray(user?.image) ? user?.image : [user?.image]) : []}
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
           {/* <UploadFiles
           label="Image Hover"
           previewImgs={user?.image_hover ? (Array.isArray(user?.image_hover) ? user?.image_hover : [user?.image_hover]) : []}
            uploadFile={(files) => onChangeValue({
              target: {
                name: "image_hover",
                value: files && files[0],
              }
            })}
            deleteFile={(files) => onChangeValue({
              target: {
                name: "image_hover",
                value: null,
              }
            })}
          /> */}
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="right" style={{ marginTop: '24px' }}>
          {id ? <Button variant="contained" onClick={handleUpdateCategory} >
            Update
          </Button>
            : <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateCategory} >
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
});
const mapDispatch = (dispatch) => ({
  getDetailCategory: dispatch.category.getDetail,
  createCategory: dispatch.category.create,
  updateCategory: dispatch.category.update,
  deleteCategory: dispatch.category.delete,
  uploadFile: dispatch.upload.uploadFile,
});
export default connect(mapState, mapDispatch)(CategoryForm)

