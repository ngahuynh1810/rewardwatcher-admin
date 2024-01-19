import { connect } from "react-redux";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import React, { useState, useEffect } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';
import { formatDateTime } from "src/utils/formatTime"
import queryString from 'query-string';
import {MAX_ROW_PER_PAGE, INIT_PAGE} from 'src/utils/setting'
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
// @mui
import {
    Card,
    Stack,
    Button,
    Container,
    Chip,
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import { useNavigate, useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------
const { useQuery, ...data } = createFakeServer();




function SessionStoreList(props) {
    const navigate = useNavigate();
    let location = useLocation();
    const parsed = queryString.parse(location.search);
    const [itemSelected, setItemSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sort, setSort] = useState();
    const [sortBy, setSortBy] = useState();
    const [page, setPage] = useState(INIT_PAGE);
    const [rowsPerPage, setRowsPerPage] = useState(MAX_ROW_PER_PAGE);
    const [filterOptions, setFilterOptions] = React.useState();

    useEffect(() => {
        getListSessionStore()
    }, [location?.search]);

    const onFilterChange = React.useCallback((filterModel) => {
        // navigate(`/dashboard/season-store?page=${event.page}&limit=${event.pageSize}`)
        setFilterOptions({ filterModel: { ...filterModel } });
    }, []);

    const onSortModelChange = React.useCallback((sortModel) => {
        setSort(sortModel[0] ? sortModel[0].field : "");
        setSortBy(sortModel[0] ? sortModel[0].sort : "");
    }, []);

    const handleChangeRowsPerPage = (event) => {
        navigate(`/dashboard/season-store?page=${event.page}&limit=${event.pageSize}`)
        setPage(event.page);
        setRowsPerPage(event.pageSize);
    };


    const handleEditSessionStore = (id) => {
        setItemSelected(id)
        navigate(`/dashboard/season-store/${id}`)
    }
    const getListSessionStore = async() => {
      setLoading(true)
      let query = {
            page: parsed?.page || page,
            limit: parsed?.limit || rowsPerPage
        }
        setPage(query.page);
        setRowsPerPage(query.limit);
        if (filterOptions?.filterModel?.items?.length) query.filter = JSON.stringify(filterOptions?.filterModel?.items)
        if (sort) query.sort = sortBy.toUpperCase()
        if (sortBy) {
            let new_sort = sort;
            if(sort === "store") query.sort_by_name_store = sortBy && sortBy.toUpperCase()
            else query.sort_by = new_sort
        }
        props.getListSessionStore(query);
        setLoading(false)
    }
    const handleUpdateSessionStore = async (updatedRow) => {
        let resultUpdate = await props.updateSessionStore(updatedRow);
        if (resultUpdate?.code) {
        getListSessionStore()
          toast("Update success")
        }
        else toast(resultUpdate.message || resultUpdate.error);
      }
    useEffect(() => {
        if(filterOptions  || sortBy  || sort)
        getListSessionStore();
    }, [filterOptions, sort, sortBy]); 
    const TABLE_HEAD = [
        { id: 'order_by', label: 'Order By', align: "left", headerAlign: 'left', width: 200,  editable: true, type: 'number' },
        { id: 'store', label: 'Store', alignRight: false, width: 500 },
        { id: 'updated', label: 'Updated At', alignRight: false, width: 200 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => { 
              return [
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  className="textPrimary"
                  onClick={() => handleEditSessionStore(id)}
                  color="inherit"
                />,
              ];
            },
        },
    ];
    const columns = React.useMemo(
        () =>
            TABLE_HEAD.map((col) => {
                if (col.id === "updated") return {
                    field: col.id,
                    headerName: col.label,
                    width: col.width,
                    editable: false,
                    renderCell: (params) => {
                        return (
                            <div>
                                {formatDateTime(params?.row?.updated)}
                            </div>
                        )
                    },
                };
                if (col.id === "store") return {
                    field: col.id,
                    headerName: col.label,
                    width: col.width,
                    editable: false,
                    sortable: false,
                    renderCell: (params) => {
                        if (params?.row?.store) return (
                            <div className="row_item_with_image">
                                <h4>{params?.row?.store?.name}</h4>
                                <img src={params?.row?.store && (Array.isArray(params?.row?.store?.image) ? params?.row?.store.image[0]?.url : params?.row?.store.image?.url)} />
                            </div>
                        )
                    }
                }
                return {
                    field: col.id,
                    headerName: col.label,
                    width: col.width,
                    editable: false,
                   ...col,
                   // filterOperators: getGridNumericOperators().filter(
                    //   (operator) => operator.value === '>' || operator.value === '<',
                    // ),
                };
            }),
        [data.columns],
    );
    return (
      <Card>
      <DataGrid
          {...data}
          columns={columns}
          rows={props.listSessionStore || []}
          initialState={{
            columns: {
                columnVisibilityModel: { 
                    updated: false
                  } 
            },
          }}
          //    autoPageSize={true}
          //    rowCount={props.totalSessionStore}
          pageSizeOptions={[5,10,50,100]}
          hideFooterPagination={true}
          paginationMode="server"
          paginationModel={{
              page: Number(page),
              pageSize: Number(rowsPerPage)
          }}
          //    rowBuffer={props.totalSessionStore}
          rowCount={props.totalSessionStore}
            filterMode="server"
          onFilterModelChange={onFilterChange}
          onSortModelChange={onSortModelChange}
          onPaginationModelChange={handleChangeRowsPerPage}
          processRowUpdate={(updatedRow, originalRow) => {
            if(updatedRow?.order_by !== originalRow?.order_by)
            handleUpdateSessionStore(updatedRow)
          }}
        //   onRowClick={(e) => {
        //       handleEditSessionStore(e)
        //   }}
          loading={false}
          density="comfortable"
          getRowId={(e) => e.uuid}
      //  checkboxSelection={false} 
      //  autoHeight={false}
      //  autoPageSize={false}
      />
  </Card>
    );
}

const mapState = (state) => ({
    listSessionStore: state.sessionStore.listSessionStore,
    totalSessionStore: state.sessionStore.totalSessionStore,
});
const mapDispatch = (dispatch) => ({
  updateSessionStore: dispatch.sessionStore.update,
  getListSessionStore: dispatch.sessionStore.getList
});
export default connect(mapState, mapDispatch)(SessionStoreList)

