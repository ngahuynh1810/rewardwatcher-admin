import { connect } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { ROLES } from "src/utils/setting"
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { UploadFiles } from "src/components/upload";
import { isSuccessResult, } from 'src/utils/formatResponse';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'
import { useTimezoneSelect, allTimezones } from 'react-timezone-select'
// @mui
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  TextField,
  FormGroup,
  FormControlLabel
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import AlertDialog from 'src/components/dialog';

// sections 


dayjs.extend(utc)
dayjs.extend(tz)

// ----------------------------------------------------------------------
const StyledContent = styled('div')(({ theme }) => ({
  // maxWidth: 480,
  margin: 'auto',
  // minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(4, 4),
}));

function CouponForm(props) {
  const navigate = useNavigate();

  let { id } = useParams();

  const [fileUpload, setFileUpload] = useState(null);

  const [coupon, setCoupon] = useState({});

  const [inputValue, setInputValue] = useState('');

  const [openDialog, setOpenDialog] = useState(false);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timezone
  )
  const labelStyle = 'original'
  const timezones = {
    ...allTimezones,
  }
  const { options, parseTimezone } = useTimezoneSelect({ labelStyle, timezones })
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getUploadFile = async (files) => {
    let result = await props.uploadFile({ files: [files] });
    if (result.code === 1) {
      return result.data;
    }
    return null;
  };

  useEffect(() => {
    getDetailCoupon(id);
  }, [id]);
  const getDetailCoupon = async (id) => {
    if (id) {
      let resDetailUser = await props.getDetailCoupon({ id: id });
      if (resDetailUser?.code) {
        let { categories, timezone } = resDetailUser.data
        setCoupon({ ...resDetailUser.data, category_uuid: categories, timezone: timezone ? timezone : options.find((e) => e.value === dayjs.tz.guess())})
      }
    }
  }
  const onChangeValue = (e) => {
    let name = e.target.name
    let value = e.target.value
    console.log(name)
    console.log(value)
    setCoupon({
      ...coupon,
      [name]: value
    })
  }

  const validateField = (coupon) => {
    if (!coupon?.store_uuid || !coupon?.code) {
      toast("Please fill out all required fields.", { type: "error" });
      return false;
    }
    return true;
  }
  const handleCreateCoupon = async () => {
    if (coupon?.image?.data) {
      let image = await getUploadFile(coupon?.image)
      if (!image) return;
      coupon.image = image
    }
    coupon.cashback_website_uuid = coupon.cashback_website?.uuid
    coupon.store_uuid = coupon.store?.uuid
    if (validateField(coupon)) {
      if (coupon.image?.length === 0) coupon.image = null;
      let resultCreate = await props.createCoupon(coupon);
      if (resultCreate?.code) {
        navigate("/dashboard/coupon")
        toast("Create success")
      }
      else toast(resultCreate.message || resultCreate.error);
    }
  }
  // const checkUploadServer = async (images) => {
  //   let isUploadService = false;
  //   images.forEach(element => {
  //     if(element.data) {
  //       isUploadService = true;
  //       return;
  //     }
  //     return isUploadService
  //   });
  // }
  const handleUpdateCoupon = async () => {
    if (coupon?.image?.data) {
      let image = await getUploadFile(coupon?.image)
      if (!image) return;
      coupon.image = image
    }
    if (coupon.image?.length === 0) coupon.image = null;
    coupon.cashback_website_uuid = coupon.cashback_website?.uuid
    coupon.store_uuid = coupon.store?.uuid
    if (validateField(coupon)) {
      let resultUpdate = await props.updateCoupon(coupon);
      if (resultUpdate?.code) {
        navigate("/dashboard/coupon")
        toast("Update success")
      }
      else toast(resultUpdate.message || resultUpdate.error);
    }
  }

  const handleDeleteCoupon = async () => {
    let resultDelete = await props.deleteCoupon({ id: coupon?.uuid });
    if (resultDelete?.code) {
      navigate("/dashboard/coupon")
      toast("Delete success")
    }
    else toast(resultDelete.message || resultDelete.error);
  }
  const handleBack = () => {
    navigate("/dashboard/coupon")
  }
  const renderCategoryList = (listCategories) => {
    return [
      ...coupon?.categories || [],
      ...listCategories,
      // ...coupon?.categories || [],
    ]
  }
  const renderCashbackWebsiteList = (list = []) => {
    return [
      ...coupon?.cashback_website ? [coupon?.cashback_website] : [],
      ...list,
      // ...store?.categories || [],
    ]
  }
  const renderStoreList = (list = []) => {
    return [
      ...coupon?.store ? [coupon?.store] : [],
      ...list,
      // ...store?.categories || [],
    ]
  }
  return (
    <Card>
      <AlertDialog
        open={openDialog}
        handleClose={() => {
          setOpenDialog(false);
        }}
        title={"Delete"}
        content={"Are you sure want to delete?"}
        handleActionFirst={() => {
          setOpenDialog(false);
        }}
        handleActionSecond={handleDeleteCoupon}
      />
      <StyledContent>
        <Stack spacing={3}>
          <TextField
            id="outlined-basic"
            label="Code"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={coupon?.code}
            type="text"
            name="code"
            // disabled={id ? true : false}
            required={true}
            onChange={onChangeValue}
          />
          <TextField
            id="outlined-basic"
            label="Description"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={coupon?.description}
            type="text"
            name="description"
            // required={e.required}
            onChange={onChangeValue}
          />
            <TextField
            id="outlined-basic"
            label="Order By"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={coupon?.order_by}
            type="text"
            name="order_by"
            // required={e.required}
            onChange={onChangeValue}
          />
          <TextField
            id="outlined-basic"
            label="Cashback Value(%)"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={coupon?.cashback_value}
            type="number"
            name="cashback_value"
            // required={e.required}
            onChange={onChangeValue}
          />
          <TextField
            id="outlined-basic"
            label="Cashback"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={coupon?.cashback}
            type="text"
            name="cashback"
            // required={e.required}
            onChange={onChangeValue}
          />
          <TextField
            id="outlined-basic"
            label="Website"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={coupon?.website}
            type="text"
            name="website"
            // required={e.required}
            onChange={onChangeValue}
          />
          {/* <Autocomplete
            id="tags-standard"
            options={renderCashbackWebsiteList(props.listCashbackWebsite)}
            renderOption={(props, option) => { return <li {...props}>{option.name}</li> }}
            getOptionLabel={(option) => option.name}
            value={coupon?.cashback_website || null}
            onChange={(event, newValue) => {
              onChangeValue({
                target: {
                  name: "cashback_website",
                  value: newValue,
                }
              });
            }}
            // getOptionSelected={(option, value) => {
            //   return option.uuid === value.uuid}
            // }
            onInputChange={(event, newInputValue) => {
              props.getListCashbackWebsite({
                page: 0,
                limit: 100,
                keyword: newInputValue,
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Cashback website"
                placeholder="Shopback"
                required={true}
              />
            )}
          /> */}
          <Autocomplete
            id="tags-standard"
            options={renderStoreList(props.listStore)}
            renderOption={(props, option) => { return <li {...props}>{option.name}</li> }}
            getOptionLabel={(option) => option.name}
            value={coupon?.store || null}
            onChange={(event, newValue) => {
              onChangeValue({
                target: {
                  name: "store",
                  value: newValue,
                }
              });
            }}
            // getOptionSelected={(option, value) => {
            //   return option.uuid === value.uuid}
            // }
            onInputChange={(event, newInputValue) => {
              props.getListStore({
                page: 0,
                limit: 100,
                keyword: newInputValue,
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Store"
                placeholder="Adidas"
                required={true}
              />
            )}
          />
          {/* <TextField
            id="outlined-basic"
            label="Start time"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={coupon?.start_date}
            type="datetime-local"
            name="start_date"
            // required={e.required}
            onChange={onChangeValue}
          />
          <TextField
            id="outlined-basic"
            label="Expired time"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={new Date(coupon?.expiration_date)}
            type="datetime-local"
            name="expiration_date"
            // required={e.required}
            onChange={onChangeValue}
          /> */}
          {/* <Autocomplete
            id="tags-standard"
            options={options}
            renderOption={(props, option) => { return <li {...props}>{option.label}</li> }}
            getOptionLabel={(option) => option.label}
            value={coupon?.timezone || null}
            onChange={(event, newValue) => {
              onChangeValue({
                target: {
                  name: "timezone",
                  value: newValue,
                }
              });
            }}
            // getOptionSelected={(option, value) => {
            //   return option.uuid === value.uuid}
            // } 
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Time Zone"
                // placeholder="Shopback"
              />
            )}
          /> */}
          <DesktopDateTimePicker
            label={`Start date (Timezone: ${dayjs.tz.guess()})`}
            defaultValue={null}
            value={coupon?.start_date ? dayjs(coupon?.start_date) : null}
            name="start_date"
            onChange={(newValue) => onChangeValue({
              target: {
                name: "start_date",
                value: dayjs.utc(newValue).tz(dayjs.tz.guess()),
              }
            })}
          />
          <DesktopDateTimePicker
            label={`Expired time (Timezone: ${dayjs.tz.guess()})`}
            defaultValue={null}
            value={coupon?.expiration_date ? dayjs(coupon?.expiration_date) : null}
            name="expiration_date"
            onChange={(newValue) => onChangeValue({
              target: {
                name: "expiration_date",
                value: dayjs.utc(newValue).tz(dayjs.tz.guess()),
              }
            })}
          />
          <UploadFiles
           uploadOnlyOneFile={true}
           label={"Image"}
            previewImgs={coupon?.image ? (Array.isArray(coupon?.image) ? coupon?.image : [coupon?.image]) : []}
            uploadFile={(files) => onChangeValue({
              target: {
                name: "image",
                value: files,
              }
            })}
            deleteFile={(files) => onChangeValue({
              target: {
                name: "image",
                value: files,
              }
            })}
          />
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="right" style={{ marginTop: '24px' }}>
          {id ? <Button variant="contained" onClick={handleUpdateCoupon} >
            Update
          </Button>
            : <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateCoupon} >
              Create
            </Button>}
          {id ? <Button variant="contained" color="error" startIcon={<Iconify icon="material-symbols:delete" />} onClick={() => setOpenDialog(true)}  >
            Delete
          </Button> : null}
        </Stack>
      </StyledContent>
    </Card>
  );
}

const mapState = (state) => ({
  listStore: state.store.listStore,
  listCashbackWebsite: state.cashbackWebsite.listWebsiteCashback,
  listcoupon: state.coupon.listcoupon,
  listCategories: state.category.listCategories,
  listCoupon: state.coupon.listCoupon,
});
const mapDispatch = (dispatch) => ({
  getListStore: dispatch.store.getList,
  getListCashbackWebsite: dispatch.cashbackWebsite.getList,
  getListCategory: dispatch.category.getList,
  getDetailCoupon: dispatch.coupon.getDetail,
  createCoupon: dispatch.coupon.create,
  updateCoupon: dispatch.coupon.update,
  deleteCoupon: dispatch.coupon.delete,
  uploadFile: dispatch.upload.uploadFile,
});
export default connect(mapState, mapDispatch)(CouponForm)

