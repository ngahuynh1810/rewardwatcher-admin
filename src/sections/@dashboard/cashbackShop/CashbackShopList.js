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




function CashbackShopList(props) {
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
    const [listData, setListData] = React.useState(props.listCashbackShop || []);
     
    useEffect(() => {
        setListData(props.listCashbackShop)
    }, [props.listCashbackShop, props.listCashbackShop?.length]);
    useEffect(() => {
        getListCashbackShop()
    }, [location?.search]);

    const onFilterChange = React.useCallback((filterModel) => {
        // navigate(`/dashboard/cashbackShop?page=${event.page}&limit=${event.pageSize}`)
        setFilterOptions({ filterModel: { ...filterModel } });
    }, []);

    const onSortModelChange = React.useCallback((sortModel) => {
        setSort(sortModel[0] ? sortModel[0].field : "");
        setSortBy(sortModel[0] ? sortModel[0].sort : "");
    }, []);

    const handleChangeRowsPerPage = (event) => {
        navigate(`/dashboard/cashback-shop?page=${event.page}&limit=${event.pageSize}`)
        setPage(event.page);
        setRowsPerPage(event.pageSize);
    };


    const handleEditcashbackShop = (itemSelected) => {
        setItemSelected(itemSelected)
        if(window) {
            window.open(`/dashboard/cashback-shop/${itemSelected.id}`,'_blank')
        } else navigate(`/dashboard/cashback-shop/${itemSelected.id}`)
    }
    const getListCashbackShop = async() => {
        setLoading(true)
        let query = {
            page: parsed?.page || page,
            limit: parsed?.limit || rowsPerPage
        }
        setPage(query.page);
        setRowsPerPage(query.limit);
        if (filterOptions?.filterModel?.items?.length) query.filter = JSON.stringify(filterOptions?.filterModel?.items)
        if (sort) {query.sort = sortBy.toUpperCase()}
        if (sortBy) {
            let new_sort = sort;
            if(sort === "cashback") new_sort= "cashback_value"
            if(sort === "store") query.sort_by_name_store = sortBy && sortBy.toUpperCase()
            query.sort_by = new_sort
        }
        await props.getListCashbackShop(query);
        setLoading(false)
    }
    useEffect(() => {
        if(filterOptions  || sortBy  || sort)
        getListCashbackShop();
    }, [filterOptions, sort, sortBy]); 
    const TABLE_HEAD = [
        { id: 'cashback', label: 'Cashback', alignRight: false, width: 200, sortable: false },
        { id: 'cashback_value', label: 'Cashback Value', alignRight: false, width: 200, sortable: true },
        { id: 'cashback_website', label: 'Website', alignRight: false, width: 200 , sortable: true },
        { id: 'store', label: 'Store', alignRight: false, width: 300, sortable: true  },
        { id: 'updated', label: 'Updated At', alignRight: false, width: 200, sortable: true  },
    ];
    const columns = React.useMemo(
        () =>
            TABLE_HEAD.map((col) => {
                if (col.id === "cashback_website")
                return {
                    field: col.id,
                    headerName: col.label,
                    width: col.width,
                    sortable: col.sortable,
                    editable: false,
                    renderCell: (params) => {
                        if (params?.row?.cashback_website) return (
                            <div className="row_item_with_image">
                                {/* <img src={params?.row?.cashback_website && (Array.isArray(params?.row?.cashback_website?.image) ? params?.row?.cashback_website.image[0]?.url : params?.row?.cashback_website.image?.url)} /> */}
                                <h4>{params?.row?.cashback_website?.name}</h4>
                            </div>
                        )
                    },
                }; 
                if (col.id === "store")
                    return {
                        field: col.id,
                        headerName: col.label,
                        width: col.width,
                        editable: false,
                    sortable: col.sortable,
                    renderCell: (params) => {
                            if (params?.row?.store) return (
                                <div className="row_item_with_image">
                                    <h4>{params?.row?.store?.name}</h4>
                                    <img src={params?.row?.store && (Array.isArray(params?.row?.store?.image) ? params?.row?.store.image[0]?.url : params?.row?.store.image?.url)} />
                                </div>
                            )
                        },
                    };  
                  if (col.id === "updated") return {
                    field: col.id,
                    headerName: col.label,
                    width: col.width,
                    editable: false,
                    sortable: col.sortable,
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
                    sortable: col.sortable
                    // filterOperators: getGridNumericOperators().filter(
                    //   (operator) => operator.value === '>' || operator.value === '<',
                    // ),
                };
            }),
        [data.columns],
    );
    console.log(listData)
    return (
      <Card>
      <DataGrid
          {...data}
          loading={loading}
          columns={columns}
          rows={listData}
          initialState={{
            columns: {
                columnVisibilityModel: { 
                    updated: false
                  } 
            },
          }}
          //    autoPageSize={true}
          pageSizeOptions={[5,10,50,100]}
          paginationMode="server"
          paginationModel={{
              page: Number(page),
              pageSize: Number(rowsPerPage)
          }}
          rowCount={props.totalCashbackShop}
          //    rowBuffer={props.totalCashbackShop}
           filterMode="server"
          onFilterModelChange={onFilterChange}
          onSortModelChange={onSortModelChange}
          onPaginationModelChange={handleChangeRowsPerPage}
          onRowClick={(e) => {
              handleEditcashbackShop(e)
          }}
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
    listCashbackShop: state.cashbackShop.listCashbackShop,
    totalCashbackShop: state.cashbackShop.totalCashbackShop,
});
const mapDispatch = (dispatch) => ({
    getListCashbackShop: dispatch.cashbackShop.getList
});
export default connect(mapState, mapDispatch)(CashbackShopList)

