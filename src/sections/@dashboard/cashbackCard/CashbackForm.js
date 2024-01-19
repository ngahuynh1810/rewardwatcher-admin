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
// @mui
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import {
  Card, 
  Stack, 
  Button, 
  TextField, 
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import AlertDialog from 'src/components/dialog';
// sections 

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

function CashbackCardForm(props) {
  const navigate = useNavigate();

  let { id } = useParams();

  const [fileUpload, setFileUpload] = useState(null);

  const [cashbackCard, setCashbackCard] = useState(null);

  const [inputValue, setInputValue] = useState('');

  const [openDialog, setOpenDialog] = useState(false);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

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
    getDetailCashbackCard(id);
  }, [id]);
  const getDetailCashbackCard = async (id) => {
    if (id) {
      let resDetailUser = await props.getDetailCashbackCard({ id: id });
      if (resDetailUser?.code) {
        let {categories} = resDetailUser.data
        setCashbackCard({...resDetailUser.data, category_uuid: categories})
      }
    }
  }
  const onChangeValue = (e) => { 
    let name = e.target.name
    let value = e.target.value
    if(name === "top_deal" || name === "is_popular") value = e.target.checked
    setCashbackCard({
      ...cashbackCard,
      [name]: value
    })
  }


  const handleCreateCashbackCard = async () => {
    if (Array.isArray(cashbackCard?.image_card) && cashbackCard?.image_card[0]?.data) {
      let image = await getUploadFile(cashbackCard?.image_card[0])
      if (!image) return;
      cashbackCard.image_card = [image]
    }
    cashbackCard.category_uuid = cashbackCard.category_uuid?.map((e) => e.uuid)
    let resultCreate = await props.createCashbackCard(cashbackCard);
    if (resultCreate?.code) {
      navigate("/dashboard/cashback-card")
      toast("Create success")
    }
    else toast(resultCreate.message || resultCreate.error);
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
  const handleUpdateCashbackCard = async () => {
    if (Array.isArray(cashbackCard?.image_card) && cashbackCard?.image_card[0]?.data) {
      let image = await getUploadFile(cashbackCard?.image_card[0])
      if (!image) return;
      cashbackCard.image_card = [image]
    }
    cashbackCard.category_uuid = cashbackCard.category_uuid?.map((e) => e.uuid)
    let resultUpdate = await props.updateCashbackCard(cashbackCard);
    if (resultUpdate?.code) {
      navigate("/dashboard/cashback-card")
      toast("Update success")
    }
    else toast(resultUpdate.message || resultUpdate.error);
  }

  const handleDeleteCashbackCard = async () => {
    let resultDelete = await props.deleteCashbackCard({ id: cashbackCard?.uuid });
    if (resultDelete?.code) {
      navigate("/dashboard/cashback-card")
      toast("Delete success")
    }
    else toast(resultDelete.message || resultDelete.error);
  }
  const handleBack = () => {
    navigate("/dashboard/cashback-card")
  }
  const renderCategoryList = (listCategories) => {
    return [
      ...cashbackCard?.categories || [],
      ...listCategories,
      // ...cashbackCard?.categories || [],
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
        handleActionSecond={handleDeleteCashbackCard}
      />
      <StyledContent>
        <Stack spacing={3}>
          <TextField
            id="outlined-basic"
            label="Name"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={cashbackCard?.name}
            type="text"
            name="name"
            // required={e.required}
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
            value={cashbackCard?.description}
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
            value={cashbackCard?.order_by}
            type="text"
            name="order_by"
            // required={e.required}
            onChange={onChangeValue}
          />
            <TextField
            id="outlined-basic"
            label="Link"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={cashbackCard?.link}
            type="text"
            name="link"
            // required={e.required}
            onChange={onChangeValue}
          />
           <TextField
            id="outlined-basic"
            label="Cashback (%)"
            InputProps={{
              readOnly: false,
            }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={cashbackCard?.cashback}
            type="number"
            name="cashback"
            // required={e.required}
            onChange={onChangeValue}
          />
          <UploadFiles
           label="Image"
            previewImgs={cashbackCard?.image_card ? (Array.isArray(cashbackCard?.image_card) ? cashbackCard?.image_card : [cashbackCard?.image_card]) : []}
            uploadFile={(files) => onChangeValue({
              target: {
                name: "image_card",
                value: files,
              }
            })}
            deleteFile={(files) => onChangeValue({
              target: {
                name: "image_card",
                value: files,
              }
            })}
          />
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="right" style={{ marginTop: '24px' }}>
          {id ? <Button variant="contained" onClick={handleUpdateCashbackCard} >
            Update
          </Button>
            : <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateCashbackCard} >
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
    listCategories: state.category.listCategories,
    listCashbackCard: state.cashbackCard.listCashbackCard,
});
const mapDispatch = (dispatch) => ({
  getListCategory: dispatch.category.getList,
  getDetailCashbackCard: dispatch.cashbackCard.getDetail,
  createCashbackCard: dispatch.cashbackCard.create,
  updateCashbackCard: dispatch.cashbackCard.update,
  deleteCashbackCard: dispatch.cashbackCard.delete,
  uploadFile: dispatch.upload.uploadFile,
});
export default connect(mapState, mapDispatch)(CashbackCardForm)

