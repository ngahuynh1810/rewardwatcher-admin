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
// @mui
import EditIcon from '@mui/icons-material/Edit';
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




function TopStoreList(props) {
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
        getListTopStore()
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
        navigate(`/dashboard/top-store?page=${event.page}&limit=${event.pageSize}`)
        setPage(event.page);
        setRowsPerPage(event.pageSize);
    };


    const handleEditTopStore = (id) => {
        setItemSelected(id)
        navigate(`/dashboard/top-store/${id}`)
    }
    const getListTopStore = async() => {
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
        props.getListTopStore(query);
        setLoading(false)
    }
    const handleUpdateTopStore = async (updatedRow) => {
        let resultUpdate = await props.updateTopStore(updatedRow);
        if (resultUpdate?.code) {
           getListTopStore()
          toast("Update success")
        }
        else toast(resultUpdate.message || resultUpdate.error);
      }
    useEffect(() => {
        if(filterOptions  || sortBy  || sort)
        getListTopStore();
    }, [filterOptions, sort, sortBy]); 
    const TABLE_HEAD = [
        { id: 'order_by', label: 'Order By', align: "left", headerAlign: 'left',width: 200,  editable: true, type: 'number' },
        { id: 'store', label: 'Store', align: "left", width: 500 },
        { id: 'updated', label: 'Updated At', align: "left", width: 200 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
            //   const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
      
            //   if (isInEditMode) {
            //     return [
            //       <GridActionsCellItem
            //         icon={<SaveIcon />}
            //         label="Save"
            //         sx={{
            //           color: 'primary.main',
            //         }}
            //         onClick={handleSaveClick(id)}
            //       />,
            //       <GridActionsCellItem
            //         icon={<CancelIcon />}
            //         label="Cancel"
            //         className="textPrimary"
            //         onClick={handleCancelClick(id)}
            //         color="inherit"
            //       />,
            //     ];
            //   }
      
              return [
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  className="textPrimary"
                  onClick={() => handleEditTopStore(id)}
                  color="inherit"
                />,
              ];
            },
        },
    ]    
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
                    editable: col.editable,
                    // type: col.type || "text",
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
          rows={props.listTopStore || []}
          initialState={{
            columns: {
                columnVisibilityModel: { 
                    updated: false
                  } 
            },
          }}
          //    autoPageSize={true}
          //    rowCount={props.totalTopStore}
          pageSizeOptions={[5,10,50,100]}
          paginationMode="server"
          paginationModel={{
              page: Number(page),
              pageSize: Number(rowsPerPage)
          }}
          processRowUpdate={(updatedRow, originalRow) => {
            if(updatedRow?.order_by !== originalRow?.order_by)
            handleUpdateTopStore(updatedRow)
          }}
          //    rowBuffer={props.totalTopStore}
          rowCount={props.totalTopStore}
           filterMode="server"
          onFilterModelChange={onFilterChange}
          onSortModelChange={onSortModelChange}
          onPaginationModelChange={handleChangeRowsPerPage}
        //   onRowClick={(e) => {
        //       handleEditTopStore(e)
        //   }}
          hideFooterPagination={true}
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
    listTopStore: state.topStore.listTopStore,
    totalTopStore: state.topStore.totalTopStore,
});
const mapDispatch = (dispatch) => ({
  updateTopStore: dispatch.topStore.update,
  getListTopStore: dispatch.topStore.getList
});
export default connect(mapState, mapDispatch)(TopStoreList)

