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




function BannerList(props) {
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
        getListBanner()
    }, [location?.search]);

    const onFilterChange = React.useCallback((filterModel) => {
        // navigate(`/dashboard/banner?page=${event.page}&limit=${event.pageSize}`)
        setFilterOptions({ filterModel: { ...filterModel } });
    }, []);

    const onSortModelChange = React.useCallback((sortModel) => {
        setSort(sortModel[0] ? sortModel[0].field : "");
        setSortBy(sortModel[0] ? sortModel[0].sort : "");
    }, []);

    const handleChangeRowsPerPage = (event) => {
        navigate(`/dashboard/banner?page=${event.page}&limit=${event.pageSize}`)
        setPage(event.page);
        setRowsPerPage(event.pageSize);
    };


    const handleEditUser = (itemSelected) => {
        setItemSelected(itemSelected)
        navigate(`/dashboard/banner/${itemSelected.id}`)
    }
    const getListBanner = async() => {
        setLoading(true)
        let query = {
            page: parsed?.page || page,
            limit: parsed?.limit || rowsPerPage,
        }
        setPage(query.page);
        setRowsPerPage(query.limit);
        if (filterOptions?.filterModel?.items?.length) query.filter = JSON.stringify(filterOptions?.filterModel?.items)
        if (sort) query.sort = sortBy.toUpperCase()
        if (sortBy) query.sort_by = sort
        await props.getListBanner(query);
        setLoading(false)
    }
    useEffect(() => {
        if(filterOptions  || sortBy  || sort)
        getListBanner();
    }, [filterOptions, sort, sortBy]);
    const handleRedirectUserForm = () => {
        navigate("/dashboard/banner/create")
    }
    const TABLE_HEAD = [
        { id: 'title', label: 'Title', alignRight: false, width: 200 },
        { id: 'content', label: 'Content', alignRight: false, width: 200 },
        { id: 'description', label: 'Description', alignRight: false, width: 200 },
        { id: 'image', label: 'Image', alignRight: false, width: 140 },
        { id: 'active', label: 'Active', alignRight: false, width: 140 },
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
                            if (params?.row?.image_banner) return (
                                <strong>
                                    <img className="img_on_column" src={params?.row?.image_banner && (Array.isArray(params?.row?.image_banner) ? params?.row?.image_banner[0]?.url : params?.row?.image_banner?.url)} />
                                </strong>
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
          loading={loading}
          columns={columns}
          rows={props.listBanner || []}
          initialState={{
            columns: {
                columnVisibilityModel: { 
                    updated: false
                  } 
            },
          }}
          //    autoPageSize={true}
          //    rowCount={props.totalBanner}
          pageSizeOptions={[5,10,50,100]}
          paginationMode="server"
          paginationModel={{
              page: Number(page),
              pageSize: Number(rowsPerPage)
          }}
          //    rowBuffer={props.totalBanner}
          rowCount={props.totalBanner}
           filterMode="server"
          onFilterModelChange={onFilterChange}
          onSortModelChange={onSortModelChange}
          onPaginationModelChange={handleChangeRowsPerPage}
          onRowClick={(e) => {
              handleEditUser(e)
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
    listBanner: state.banner.listBanner,
    totalBanner: state.banner.totalBanner,
});
const mapDispatch = (dispatch) => ({
    getListBanner: dispatch.banner.getList
});
export default connect(mapState, mapDispatch)(BannerList)

