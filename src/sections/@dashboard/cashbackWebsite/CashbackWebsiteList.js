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




function CashbackWebsiteList(props) {
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
        getListCashbackWebsite()
    }, [location?.search]);

    const onFilterChange = React.useCallback((filterModel) => {
        // navigate(`/dashboard/cashback-website?page=${event.page}&limit=${event.pageSize}`)
        setFilterOptions({ filterModel: { ...filterModel } });
    }, []);

    const onSortModelChange = React.useCallback((sortModel) => {
        setSort(sortModel[0] ? sortModel[0].field : "");
        setSortBy(sortModel[0] ? sortModel[0].sort : "");
    }, []);

    const handleChangeRowsPerPage = (event) => {
        navigate(`/dashboard/cashback-website?page=${event.page}&limit=${event.pageSize}`)
        setPage(event.page);
        setRowsPerPage(event.pageSize);
    };


    const handleEditcashbackWebsite = (itemSelected) => {
        setItemSelected(itemSelected)
        navigate(`/dashboard/cashback-website/${itemSelected.id}`)
    }
    const getListCashbackWebsite = async() => {
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
        props.getListCashbackWebsite(query);
        setLoading(false)
    }
    useEffect(() => {
        if(filterOptions  || sortBy  || sort)
        getListCashbackWebsite();
    }, [filterOptions, sort, sortBy]); 
    const TABLE_HEAD = [
        { id: 'name', label: 'Name', alignRight: false, width: 200 },
        { id: 'website', label: 'Website', alignRight: false, width: 200 },
        { id: 'referral_link', label: 'Referral Link', alignRight: false, width: 200 },
      
        { id: 'image', label: 'Image', alignRight: false, width: 200 },
        { id: 'updated', label: 'Updated At', alignRight: false, width: 200 },
    ];
    const columns = React.useMemo(
        () =>
            TABLE_HEAD.map((col) => {
                if (col.id === "image")
                    return {
                        field: col.id,
                        headerName: col.label,
                        width: col.width,
                        editable: false,
                        sortable: false,
                        renderCell: (params) => {
                            if (params?.row?.image) return (
                                <strong>
                                    <img src={params?.row?.image && (Array.isArray(params?.row?.image) ? params?.row?.image[0]?.url : params?.row?.image?.url)} />
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
          rows={props.listCashbackWebsite || []}
          initialState={{
            columns: {
                columnVisibilityModel: { 
                    updated: false
                  } 
            },
          }}
          //    autoPageSize={true}
          //    rowCount={props.totalCashbackWebsite}
          pageSizeOptions={[5,10,50,100]}
          paginationMode="server"
          paginationModel={{
              page: Number(page),
              pageSize: Number(rowsPerPage)
          }}
          //    rowBuffer={props.totalCashbackWebsite}
          rowCount={props.totalCashbackWebsite}
           filterMode="server"
          onFilterModelChange={onFilterChange}
          onSortModelChange={onSortModelChange}
          onPaginationModelChange={handleChangeRowsPerPage}
          onRowClick={(e) => {
              handleEditcashbackWebsite(e)
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
    listCashbackWebsite: state.cashbackWebsite.listWebsiteCashback,
    totalCashbackWebsite: state.cashbackWebsite.totalWebsiteCashback,
});
const mapDispatch = (dispatch) => ({
    getListCashbackWebsite: dispatch.cashbackWebsite.getList
});
export default connect(mapState, mapDispatch)(CashbackWebsiteList)

