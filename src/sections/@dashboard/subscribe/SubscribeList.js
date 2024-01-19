import { connect } from "react-redux";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import React, { useState, useEffect } from 'react';
import { DataGrid, getGridNumericOperators } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';
import { formatDateTime } from "src/utils/formatTime"
import queryString from 'query-string';
import {ROW_PER_PAGE, INIT_PAGE} from 'src/utils/setting'
import { CSVLink, CSVDownload } from "react-csv";
import DownloadIcon from '@mui/icons-material/Download';

 
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
// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
// ----------------------------------------------------------------------
const { useQuery, ...data } = createFakeServer();




function SubscribeList(props) {
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
        getListSubscribe()
    }, [location?.search]);

    const onFilterChange = React.useCallback((filterModel) => {
        // navigate(`/dashboard/subscribe?page=${event.page}&limit=${event.pageSize}`)
        setFilterOptions({ filterModel: { ...filterModel } });
    }, []);

    const onSortModelChange = React.useCallback((sortModel) => {
        setSort(sortModel[0] ? sortModel[0].field : "");
        setSortBy(sortModel[0] ? sortModel[0].sort : "");
    }, []);

    // const handleChangeRowsPerPage = (event) => {
    //     navigate(`/dashboard/subscribe?page=${event.page}&limit=${event.pageSize}`)
    //     setPage(event.page);
    //     setRowsPerPage(event.pageSize);
    // };


    const handleEditSubscribe = (itemSelected) => {
        setItemSelected(itemSelected)
        navigate(`/dashboard/subscribe/${itemSelected.id}`)
    }
    const getListSubscribe = async() => {
      setLoading(true)
      let query = {
            // page: parsed?.page || page,
            // limit: parsed?.limit || rowsPerPage
        }
        setPage(query.page);
        setRowsPerPage(query.limit);
        if (filterOptions?.filterModel?.items?.length) query.filter = JSON.stringify(filterOptions?.filterModel?.items)
        if (sort) query.sort = sortBy.toUpperCase()
        if (sortBy) query.sort_by = sort
        props.getListSubscribe(query);
        setLoading(false)
    }
    useEffect(() => {
        if(filterOptions  || sortBy  || sort)
        getListSubscribe();
    }, [filterOptions, sort, sortBy]); 
    const TABLE_HEAD = [
        { id: 'email', label: 'Email', alignRight: false, width: 200 },
        // { id: 'created', label: 'Created At', alignRight: false, width: 200 },
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
    const csvData = [
        ["Email"],
        ...props.listSubscribe.map(e => [e.email])
      ];
    return (
        <>
        <div style={{textAlign: "end" ,marginBottom: "16px"}}>  <CSVLink data={csvData}>
            <Button><DownloadIcon/> Download</Button>
        </CSVLink></div>
        

         <Card>
           {/* <ExcelFile element={<button>Download Data</button>}>
                <ExcelSheet data={dataSet1} name="Employees">
                    <ExcelColumn label="Name" value="name"/>
                    <ExcelColumn label="Wallet Money" value="amount"/>
                    <ExcelColumn label="Gender" value="sex"/>
                    <ExcelColumn label="Marital Status"
                                 value={(col) => col.is_married ? "Married" : "Single"}/>
                </ExcelSheet> 
            </ExcelFile> */}
      <DataGrid
          {...data}
          columns={columns}
          rows={props.listSubscribe || []}
          hideFooterPagination={true}
          initialState={{
            columns: {
                columnVisibilityModel: { 
                    updated: false
                  } 
            },
          }}
          //    autoPageSize={true}
          //    rowCount={props.totalSubscribe}
          pageSizeOptions={[5,10,50,100]}
          paginationMode="server"
          paginationModel={{
              page: Number(page),
              pageSize: Number(rowsPerPage)
          }}
          //    rowBuffer={props.totalSubscribe}
          rowCount={props.totalSubscribe}
            filterMode="server"
          onFilterModelChange={onFilterChange}
          onSortModelChange={onSortModelChange}
        //   onPaginationModelChange={handleChangeRowsPerPage}
          onRowClick={(e) => {
              handleEditSubscribe(e)
          }}
          loading={false}
          density="comfortable"
          getRowId={(e) => e.uuid}
      //  checkboxSelection={false} 
      //  autoHeight={false}
      //  autoPageSize={false}
      />
  </Card>
        </>
    );
}

const mapState = (state) => ({
    listSubscribe: state.subscribe.listSubscribe,
    totalSubscribe: state.subscribe.totalSubscribe,
});
const mapDispatch = (dispatch) => ({
    getListSubscribe: dispatch.subscribe.getList
});
export default connect(mapState, mapDispatch)(SubscribeList)

