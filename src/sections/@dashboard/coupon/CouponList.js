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




function CouponList(props) {
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
        getListCoupon()
    }, [location?.search]);

    const onFilterChange = React.useCallback((filterModel) => {
        // navigate(`/dashboard/coupon?page=${event.page}&limit=${event.pageSize}`)
        setFilterOptions({ filterModel: { ...filterModel } });
    }, []);

    const onSortModelChange = React.useCallback((sortModel) => {
        setSort(sortModel[0] ? sortModel[0].field : "");
        setSortBy(sortModel[0] ? sortModel[0].sort : "");
    }, []);

    const handleChangeRowsPerPage = (event) => {
        navigate(`/dashboard/coupon?page=${event.page}&limit=${event.pageSize}`)
        setPage(event.page);
        setRowsPerPage(event.pageSize);
    };


    const handleEditCoupon = (itemSelected) => {
        setItemSelected(itemSelected)
        navigate(`/dashboard/coupon/${itemSelected.id}`)
    }
    const getListCoupon = async() => {
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
        props.getListCoupon(query);
        setLoading(false)
    }
    useEffect(() => {
        if(filterOptions  || sortBy  || sort)
        getListCoupon();
    }, [filterOptions, sort, sortBy]); 
    const TABLE_HEAD = [
        { id: 'code', label: 'Code', alignRight: false, width: 200 },
        { id: 'order_by', label: 'Order By', alignRight: false, width: 200 },
        { id: 'cashback', label: 'Cashback', alignRight: false, width: 200 },
        { id: 'cashback_value', label: 'Cashback value (%)', alignRight: false, width: 200 },
        { id: 'description', label: 'Description', alignRight: false, width: 200 },
        { id: 'website', label: 'Website', alignRight: false, width: 200 },
        { id: 'expiration_date', label: 'Expiration date', alignRight: false, width: 200 },
        // { id: 'image_card', label: 'Image', alignRight: false, width: 200 },
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
                if (col.id === "expiration_date") return {
                    field: col.id,
                    headerName: col.label,
                    width: col.width,
                    editable: false,
                    renderCell: (params) => {
                        // console.log(new Date(params?.row?.expiration_date).getTime())
                        // console.log(new Date().getTime())
                        // console.log(new Date(params?.row?.expiration_date).getTime() - new Date().getTime())
                        return (
                            <div className={params?.row?.expiration_date && new Date(params?.row?.expiration_date).getTime() <= new Date(new Date().toISOString()).getTime() ? "expired_coupon" : ""}>
                                {formatDateTime(params?.row?.expiration_date)}
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
          rows={props.listCoupon || []}
          initialState={{
            columns: {
                columnVisibilityModel: { 
                    updated: false
                  } 
            },
          }}
          //    autoPageSize={true}
          //    rowCount={props.totalCoupon}
          pageSizeOptions={[5,10,50,100]}
          paginationMode="server"
          paginationModel={{
              page: Number(page),
              pageSize: Number(rowsPerPage)
          }}
          //    rowBuffer={props.totalCoupon}
          rowCount={props.totalCoupon}
           filterMode="server"
          onFilterModelChange={onFilterChange}
          onSortModelChange={onSortModelChange}
          onPaginationModelChange={handleChangeRowsPerPage}
          onRowClick={(e) => {
              handleEditCoupon(e)
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
    listCoupon: state.coupon.listCoupon,
    totalCoupon: state.coupon.totalCoupon,
});
const mapDispatch = (dispatch) => ({
    getListCoupon: dispatch.coupon.getList
});
export default connect(mapState, mapDispatch)(CouponList)

