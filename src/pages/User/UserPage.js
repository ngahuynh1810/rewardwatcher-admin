import {  connect } from "react-redux";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import React , { useState, useEffect } from 'react';
import { DataGrid, getGridNumericOperators } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';

// @mui
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import { useNavigate } from 'react-router-dom';
import {ROW_PER_PAGE, INIT_PAGE} from 'src/utils/setting'
// ----------------------------------------------------------------------
const { useQuery, ...data } = createFakeServer();

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false, width: 200},
  { id: 'email', label: 'Email', alignRight: false, width: 200 },
  { id: 'role_code', label: 'Role', alignRight: false, width: 200 },
  { id: 'username', label: 'Username', alignRight: false , width: 200},
  { id: 'type_account', label: 'Type account', alignRight: false, width: 200 },
];


function UserPage(props) {
  const navigate = useNavigate();

  const [itemSelected, setItemSelected] = useState(null);

  const [page, setPage] = useState(INIT_PAGE);

  const [sort, setSort] = useState();
  const [sortBy, setSortBy] = useState();

  // const [selected, setSelected] = useState([]);



  const [rowsPerPage, setRowsPerPage] = useState(ROW_PER_PAGE);
  const [queryOptions, setQueryOptions] = React.useState({});

  const onFilterChange = React.useCallback((filterModel) => {
    setQueryOptions({ filterModel: { ...filterModel } });
  }, []);

  const onSortModelChange = React.useCallback((sortModel) => {
    setSort(sortModel[0] ? sortModel[0].field : "");
    setSortBy(sortModel[0] ? sortModel[0].sort: "");
  }, []);    

  const handleChangeRowsPerPage = (event) => {
    setPage(event.page);
    setRowsPerPage(event.pageSize);
  }; 

  const handleEditUser = () => {
    navigate(`/dashboard/user/${itemSelected}`)
  }
  useEffect(() => {
    props.getListAdmin({
      page: page + 1,
      limit: rowsPerPage,
      filter: JSON.stringify(queryOptions),
      sort: sort,
      sortBy: sortBy,
    });
  }, [rowsPerPage, page, queryOptions, sort, sortBy]);
  const handleRedirectUserForm = () => {
    navigate("/dashboard/user/create")
  } 
  const columns = React.useMemo(
    () =>
    TABLE_HEAD.map((col) => {
        return {
          field: col.id,
          headerName: col.label,
          width: col.width,
          editable: false,
          // filterOperators: getGridNumericOperators().filter(
          //   (operator) => operator.value === '>' || operator.value === '<',
          // ),
        };
      }),
    [data.columns],
  );
  return (
    <>
      <Helmet>
        <title> User | Admin UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill"/>} onClick={handleRedirectUserForm}>
            New User
          </Button>
        </Stack>

        <Card>
        <DataGrid
           {...data}
           columns = {columns}
           rows={props.listAdmin || []}
          //  filterMode="server"
           onFilterModelChange={onFilterChange}
           onSortModelChange={onSortModelChange}
           onPaginationModelChange={handleChangeRowsPerPage}
           onRowDoubleClick={(e) => {
            // handleEditUser()
           }}
           loading={false}
           density="comfortable"
          //  checkboxSelection={false} 
          //  autoHeight={false}
          //  autoPageSize={false}
          />
        </Card>
      </Container> 
    </>
  );
}

const mapState = (state) => ({
  listAdmin: state.users.listAdmin,
  total: state.users.total,
});
const mapDispatch = (dispatch) => ({
  getListAdmin: dispatch.users.getListAdmin
});
export default connect(mapState, mapDispatch)(UserPage)

