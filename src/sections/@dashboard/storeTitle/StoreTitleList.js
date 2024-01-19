import { connect } from "react-redux";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import React, { useState, useEffect } from 'react';
import { DataGrid, getGridNumericOperators } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';
import { formatDateTime } from "src/utils/formatTime"
import queryString from 'query-string';
import {ROW_PER_PAGE, INIT_PAGE} from 'src/utils/setting'

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




function StoreTitleList(props) {
    const navigate = useNavigate();
    let location = useLocation();
    const parsed = queryString.parse(location.search);
    const [itemSelected, setItemSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sort, setSort] = useState();
    const [sortBy, setSortBy] = useState();
    const [page, setPage] = useState(INIT_PAGE);
    const [rowsPerPage, setRowsPerPage] = useState(ROW_PER_PAGE);
    const [filterOptions, setFilterOptions] = React.useState();
   
    useEffect(() => {
        getListStoreTitle()
    }, [location?.search]);

    const onFilterChange = React.useCallback((filterModel) => {
        // navigate(`/dashboard/store-title?page=${event.page}&limit=${event.pageSize}`)
        setFilterOptions({ filterModel: { ...filterModel } });
    }, []);

    const onSortModelChange = React.useCallback((sortModel) => {
        setSort(sortModel[0] ? sortModel[0].field : "");
        setSortBy(sortModel[0] ? sortModel[0].sort : "");
    }, []);

    const handleChangeRowsPerPage = (event) => {
        navigate(`/dashboard/store-title?page=${event.page}&limit=${event.pageSize}`)
        setPage(event.page);
        setRowsPerPage(event.pageSize);
    };


    const handleEditStoreTitle = (itemSelected) => {
        setItemSelected(itemSelected)
        navigate(`/dashboard/store-title/${itemSelected.id}`)
    }
    const getListStoreTitle = async() => {
      setLoading(true)
      let query = {
            page: parsed?.page || page,
            limit: parsed?.limit || rowsPerPage
        }
        setPage(query.page);
        setRowsPerPage(query.limit);
        if (filterOptions?.filterModel?.items?.length) query.filter = JSON.stringify(filterOptions?.filterModel?.items)
        if (sort) query.sort = sortBy.toUpperCase()
        if (sortBy) query.sort_by = sort
        props.getListStoreTitle(query);
        setLoading(false)
    }
    useEffect(() => {
        if(filterOptions  || sortBy  || sort)
        getListStoreTitle();
    }, [filterOptions, sort, sortBy]); 
    const TABLE_HEAD = [
        { id: 'title', label: 'Title', alignRight: false, width: 200 },
        { id: 'description', label: 'Description', alignRight: false, width: 200 },
        { id: 'active', label: 'Status', alignRight: false, width: 200 },
        { id: 'updated', label: 'Updated At', alignRight: false, width: 200 },
    ];
    const columns = React.useMemo(
        () =>
            TABLE_HEAD.map((col) => {
                if (col.id === "image_card")
                    return {
                        field: col.id,
                        headerName: col.label,
                        width: col.width,
                        editable: false,
                        renderCell: (params) => {
                            if (params?.row?.image_card) return (
                                <strong>
                                    <img  className="img_on_column" src={params?.row?.image_card && (Array.isArray(params?.row?.image_card) ? params?.row?.image_card[0]?.url : params?.row?.image_card?.url)} />
                                </strong>
                            )
                        },
                    }; 
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
                if (col.id === "active") return {
                    field: col.id,
                    headerName: col.label,
                    width: col.width,
                    editable: false,
                    renderCell: (params) => {
                        return (
                            <div>
                                {params?.row?.active ? "Active" : ""}
                            </div>
                        )
                    },
                };
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
      <Card>
      <DataGrid
          {...data}
          columns={columns}
          rows={props.listStoreTitle || []}
          initialState={{
            columns: {
                columnVisibilityModel: { 
                    updated: false
                  } 
            },
          }}
          //    autoPageSize={true}
          //    rowCount={props.totalStoreTitle}
          pageSizeOptions={[5,10,50,100]}
          paginationMode="server"
          paginationModel={{
              page: Number(page),
              pageSize: Number(rowsPerPage)
          }}
          //    rowBuffer={props.totalStoreTitle}
          rowCount={props.totalStoreTitle}
            filterMode="server"
          onFilterModelChange={onFilterChange}
          onSortModelChange={onSortModelChange}
          onPaginationModelChange={handleChangeRowsPerPage}
          onRowClick={(e) => {
              handleEditStoreTitle(e)
          }}
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
    listStoreTitle: state.storeTitle.listStoreTitle,
    totalStoreTitle: state.storeTitle.totalStoreTitle,
});
const mapDispatch = (dispatch) => ({
    getListStoreTitle: dispatch.storeTitle.getList
});
export default connect(mapState, mapDispatch)(StoreTitleList)

