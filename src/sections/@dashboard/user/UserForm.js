import {  connect } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import {ROLES} from "src/utils/setting"
import {  toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

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
import { UserListHead, UserListToolbar } from 'src/sections/@dashboard/user';
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

function UserForm(props) {
  const navigate = useNavigate();

  let { id } = useParams();

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
 
  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  useEffect(() => {
    getDetailUser(id);
  }, [id]);
  const getDetailUser = async(id) => {
    if(id) {
      let resDetailUser = await props.getDetailUser({id: id});
      if(resDetailUser?.code) setUser(resDetailUser.data)
    }  
  }
  const onChangeValue = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }
  const handleCreateUser = async() => {
     let resultCreate = await props.createUser(user);
     if(resultCreate?.code) {
      navigate("/dashboard/user")
      toast("Create success")
    }
     else toast(resultCreate.message || resultCreate.error);
  }
  const handleUpdateUser = async() => {
    let resultUpdate = await props.updateUser(user);
    if(resultUpdate?.code) {
      navigate("/dashboard/user")
      toast("Update success")
    }
    else toast(resultUpdate.message || resultUpdate.error);
 }
   
  const handleDeleteUser = async() => {
    let resultDelete = await props.deleteUser({id: user?.id});
    if(resultDelete?.code) {
      navigate("/dashboard/user")
      toast("Delete success")
    }
    else toast(resultDelete.message || resultDelete.error);
 }
 const handleBack = () => {
  navigate("/dashboard/user")
 }
    
  const formUser = [
    {
      type: "text",
      label: "Role",
      name: "Role",
      value: user?.role_code || ROLES.USER_ROLE,
      disable: true
    }, 
  {
    type: "text",
    label: "Email",
    name: "email",
    value: user?.email,
    required: true,
  },{
    type: "password",
    label: "Password",
    name: "password",
    value: user?.password,
    required: true,
    hidden: id ? true : false
  },{
    type: "text",
    label: "User name",
    name: "username",
    value: user?.username,
    required: true,
  },{
    type: "text",
    label: "Name",
    name: "name",
    value: user?.name
  },{
    type: "text",
    label: "Mobile",
    name: "mobile",
    value: user?.mobile
  }]
  return (
    <Card>
         <AlertDialog
      open = {openDialog}
      handleClose = {() => {
        setOpenDialog(false);
      }} 
      title = {"Delete"} 
      content = {"Are you sure want to delete?"} 
      handleActionFirst = {() => {
        setOpenDialog(false);
      }} 
      handleActionSecond = {handleDeleteUser} 
    />
    <StyledContent> 
      <Stack spacing={3}>
        {formUser.map((e) => { 
          if(!e.hidden)
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
          />})}
      </Stack> 
      <Stack direction="row" spacing={3} alignItems="center" justifyContent="right"  style={{ marginTop: '24px' }}>
        {id ? <Button variant="contained"  onClick={handleUpdateUser} >
         Update
        </Button>
        : <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill"/>} onClick={handleCreateUser} >
         Create
        </Button>}
        {id ? <Button variant="contained" color="error" startIcon={<Iconify icon="material-symbols:delete"/>} onClick={() => setOpenDialog(true)}  >
         Delete
        </Button> : null}
      </Stack>
    </StyledContent>
  </Card>
  );
}

const mapState = (state) => ({
  listAdmin: state.users.listAdmin,
});
const mapDispatch = (dispatch) => ({
  getListAdmin: dispatch.users.getListAdmin,
  getDetailUser:  dispatch.users.getDetailUser,
  createUser:  dispatch.users.createUser,
  updateUser:  dispatch.users.updateUser,
  deleteUser:  dispatch.users.deleteUser,
});
export default connect(mapState, mapDispatch)(UserForm)

