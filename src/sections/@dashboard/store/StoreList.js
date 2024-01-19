import { connect } from "react-redux";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import React, { useState, useEffect } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { createFakeServer } from '@mui/x-data-grid-generator';
import { formatDateTime } from "src/utils/formatTime"
import queryString from 'query-string';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { ROW_PER_PAGE, INIT_PAGE } from 'src/utils/setting'
import { filter_characters } from "src/utils/setting"
import { ScrollingCarousel } from '@trendyol-js/react-carousel';
import { toast } from 'react-toastify';
import Searchbar from 'src/components/Searchbar';
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




function StoreList(props) {
    const navigate = useNavigate();
    let location = useLocation();
    const parsed = queryString.parse(location.search);
    const [filterCharacter, setFilterCharacter] = useState("All");
    const [itemSelected, setItemSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState();
    const [sort, setSort] = useState();
    const [sortBy, setSortBy] = useState();
    const [page, setPage] = useState(INIT_PAGE);
    const [rowsPerPage, setRowsPerPage] = useState(ROW_PER_PAGE);
    const [nameStartWith, setNameStartWith] = React.useState();
    const [filterOptions, setFilterOptions] = React.useState();
    const handleFilterCashback = (filter_characters) => {
        navigate(`/dashboard/store`)
        setPage(INIT_PAGE);
        setFilterCharacter(filter_characters)
        let new_filter_characters = ""
        if (filter_characters === "123") 
            new_filter_characters = "%23"
        else if (filter_characters !== "All")
            new_filter_characters = filter_characters;
        
         
        setNameStartWith(new_filter_characters)
        // setFilterOptions({ filterModel: { ...filterModel } });
    }
    useEffect(() => {
        getListStore()
    }, [location?.search]);

    const handleSearch  = (search) => {
        setKeyword(search)
    }
    const onFilterChange = React.useCallback((filterModel) => {
        // navigate(`/dashboard/store?page=${event.page}&limit=${event.pageSize}`)
        setFilterOptions({ filterModel: { ...filterModel } });
    }, []);

    const onSortModelChange = React.useCallback((sortModel) => {
        setSort(sortModel[0] ? sortModel[0].field : "");
        setSortBy(sortModel[0] ? sortModel[0].sort : "");
    }, []);

    const handleChangeRowsPerPage = (event) => {
        navigate(`/dashboard/store?page=${event.page}&limit=${event.pageSize}`)
        setPage(event.page);
        setRowsPerPage(event.pageSize);
    };


    const handleEdit = (id) => {
        setItemSelected(id)
        // navigate(`/dashboard/store/${itemSelected.id}`)
        if(window) {
            window.open(`/dashboard/store/${id}`,'_blank')
        } else navigate(`/dashboard/store/${id}`)
    }
    const getListStore = async () => {
        setLoading(true)
        let query = {
            page: parsed?.page || page,
            limit: parsed?.limit || rowsPerPage
        }
        setPage(query.page);
        setRowsPerPage(query.limit);
        if (filterOptions?.filterModel?.items?.length) {
            let items = JSON.parse(JSON.stringify(filterOptions?.filterModel?.items));  // deep copy
            let new_filterModel =  {
                items: items.map((item) => {
                    item.value = encodeURIComponent(item.value)
                    return item
                })
            } 
            query.filter = JSON.stringify(new_filterModel?.items)
        }
        if (sort) query.sort = sortBy.toUpperCase()
        if (sortBy) query.sort_by = sort
        if (keyword) query.keyword = keyword
        query.name_start_with =  nameStartWith || ""
        props.getListStore(query);
        setLoading(false)
    }
    const handleUpdateStore = async (updatedRow) => { 
        let resultUpdate = await props.updateStore(updatedRow);
        if (resultUpdate?.code) {
            getListStore()
            toast("Update success")
        }
        else toast(resultUpdate.message || resultUpdate.error);
      }
    useEffect(() => {
        if (filterOptions || sortBy || sort || keyword || filterCharacter)
            getListStore();
    }, [filterOptions, sort, sortBy, keyword, filter_characters, nameStartWith]);
    const handleRedirectUserForm = () => {
        navigate("/dashboard/store/create")
    }
    const TABLE_HEAD = [
        { id: 'name', label: 'Name', alignRight: false, width: 200, sortable: true },
        { id: 'order_by', label: 'Order by', align: "left", headerAlign: 'left', width: 200, sortable: true, type: 'number', editable: true },
        { id: 'category_name', label: 'Categories', alignRight: false, width: 200, sortable: false },
        { id: 'country_code', label: 'Country Code', alignRight: false, width: 200, sortable: false },
        { id: 'image', label: 'Image', alignRight: false, width: 200, sortable: false },
        { id: 'updated', label: 'Updated At', alignRight: false, width: 200, sortable: true },
        { id: 'is_popular', label: 'Popular', alignRight: false, width: 200, sortable: true },
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
                  onClick={() => handleEdit(id)}
                  color="inherit"
                />,
              ];
            },
        },
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
                                <strong className="row_item_with_image">
                                    <img src={params?.row?.image && (Array.isArray(params?.row?.image) ? params?.row?.image[0]?.url : params?.row?.image?.url)} />
                                </strong>
                            )
                        },
                    };
                if (col.id === "is_popular")
                    return {
                        field: col.id,
                        headerName: col.label,
                        width: col.width,
                        editable: false,
                        sortable: col.sortable,
                        renderCell: (params) => {
                            if (params?.row?.is_popular) return <WhatshotIcon color="error" />
                            return null
                        },
                    };
                if (col.id === "category_name")
                    return {
                        field: col.id,
                        headerName: col.label,
                        width: col.width,
                        editable: false,
                        sortable: col.sortable,
                        renderCell: (params) => {
                            if (Array.isArray(params?.row?.categories))
                                return params?.row?.categories.map((e, index) => <Chip key={index} label={e.name} />)
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
                    editable: col.editable,
                    sortable: col.sortable,
                    ...col,
                    // filterOperators: getGridNumericOperators().filter(
                    //   (operator) => operator.value === '>' || operator.value === '<',
                    // ),
                };
            }),
        [data.columns],
    );
    console.log(props)
    return (
        <>
            <Card>
            <Searchbar handleSearch={(search) => handleSearch(search)}/>
            <ScrollingCarousel className="scrolling_carousel_charaters">
                {filter_characters.map((e, index) => <div onClick={() => handleFilterCashback(e)} key={index} role="button" className={filterCharacter === e ? "selected_character" : "character"}>{e}</div>)}
            </ScrollingCarousel>
                <DataGrid
                    {...data}
                    columns={columns}
                    loading={loading}
                    rows={props.listStore || []}
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                updated: false
                            }
                        },
                    }}
                    //    autoPageSize={true}
                    //    rowCount={props.totalStore} 
                    pageSizeOptions={[5, 10, 50, 100]}
                    paginationMode="server"
                    paginationModel={{
                        page: Number(page),
                        pageSize: Number(rowsPerPage)
                    }}
                    //    rowBuffer={props.totalStore}
                    rowCount={props.totalStore}
                    filterMode="server"
                    onFilterModelChange={onFilterChange}
                    onSortModelChange={onSortModelChange}
                    onPaginationModelChange={handleChangeRowsPerPage}
                    processRowUpdate={(updatedRow, originalRow) => {
                        if(updatedRow?.order_by !== originalRow?.order_by)
                            handleUpdateStore(updatedRow)
                      }}
                    // onRowClick={(e) => {
                    //     handleEdit(e)
                    // }}
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
    listStore: state.store.listStore,
    totalStore: state.store.totalStore,
});
const mapDispatch = (dispatch) => ({
  updateStore: dispatch.store.update,
  getListStore: dispatch.store.getList
});
export default connect(mapState, mapDispatch)(StoreList)

