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
import { Editor } from '@tinymce/tinymce-react';

// @mui
import { styled } from '@mui/material/styles';
import {
    Card,
    Table,
    Stack,
    Paper,
    Avatar,
    Button,
    Popover,
    Checkbox,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    Box,
    Grid,
    TextField,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import AlertDialog from 'src/components/dialog'; 

// ----------------------------------------------------------------------

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

function CompanyForm(props) {
    const navigate = useNavigate();

    let { id } = useParams();

    const [fileUpload, setFileUpload] = useState(null);

    const [detailCompany, setDetailCompany] = useState(null);

    const [openDialog, setOpenDialog] = useState(false);


    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name'); 
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }; 
    const getUploadFile = async (files) => {
        let result = await props.uploadFile({ files: [files] });
        if (result.code === 1) {
            return result.data;
        }
        return null;
    }; 
    useEffect(() => {
        getDetailCompany();
    }, []);
    const getDetailCompany = async () => {
        let resCompany = await props.getDetailCompany();
        console.log(resCompany)
        if(resCompany?.code === 1 && resCompany.data) setDetailCompany(resCompany.data) 
    }
    const onChangeValue = (e) => {
        setDetailCompany({
            ...detailCompany,
            [e.target.name]: e.target.value
        })
    } 
    const handleUpdateCompany = async () => {
        if (detailCompany?.image?.data) {
            let image = await getUploadFile(detailCompany?.image)
            if (!image) return;
            detailCompany.image = image
        }
        if (detailCompany?.avatar?.data) {
            let image = await getUploadFile(detailCompany?.avatar)
            if (!image) return;
            detailCompany.avatar = image
        }
        let resultUpdate = await props.updateCompany(detailCompany);
        if (resultUpdate?.code) {
            toast("Update success")
        }
        else toast(resultUpdate.message || resultUpdate.error);
    }

    const handleDeleteCompany = async () => {
        let resultDelete = await props.deleteCompany({ id: detailCompany?.uuid });
        if (resultDelete?.code) {
            navigate("/dashboard/company")
            toast("Delete success")
        }
        else toast(resultDelete.message || resultDelete.error);
    }

    const introduceSection = [
        {
            type: "upload",
            label: "Avatar Header",
            name: "avatar",
            value: detailCompany?.avatar,
        },
        {
            type: "upload",
            label: "Avatar Footer",
            name: "image",
            value: detailCompany?.image,
            showIconTransparent: true
        },

        {
            type: "text",
            label: "Email",
            name: "email",
            value: detailCompany?.email,
        },

        {
            type: "text",
            label: "introduce",
            name: "introduce",
            value: detailCompany?.introduce,
        },
        {
            type: "text",
            label: "Copyright",
            name: "copyright",
            value: detailCompany?.copyright,
        },
        {
            type: "text",
            label: "Name",
            name: "name",
            value: detailCompany?.name,
        },
        {
            type: "text",
            label: "Phone",
            name: "phone",
            value: detailCompany?.phone,
        },

    ]
    const resourceSection = [

        {
            type: "text",
            label: "General_help_support",
            name: "general_help_support",
            value: detailCompany?.general_help_support,
        },

        {
            type: "editor",
            label: "Privacy policy",
            name: "privacy_policy",
            value: detailCompany?.privacy_policy,
        },
        {
            type: "editor",
            label: "Terms of service",
            name: "terms_of_service",
            value: detailCompany?.terms_of_service,
        },

    ]
    const aboutUsSection = [
        {
            type: "editor",
            label: "Contact us",
            name: "contact_us",
            value: detailCompany?.contact_us,
        },
        {
            type: "editor",
            label: "News",
            name: "the_news",
            value: detailCompany?.the_news,
        },
        {
            type: "editor",
            label: "what is rewardswatchers",
            name: "what_is_rewardswatchers",
            value: detailCompany?.what_is_rewardswatchers,
        },
    ]
    const renderTab = (sections) => {
        return <Card>
            <StyledContent>
                <Stack spacing={3}>
                    {sections.map((e) => {
                        if (e.type === "editor")
                            return <div>
                                <Typography className="label_text_field" variant="caption" gutterBottom>{e.label}</Typography>
                                <Editor
                                    // apiKey='no-api-key'
                                    onEditorChange={(newValue, editor) => onChangeValue({
                                        target: {
                                            name: e.name,
                                            value: newValue
                                        }
                                    })}
                                    value={e.value}
                                    init={{
                                        menubar: false,
                                        height: '500px',
                                        plugins: [
                                            'link image code'
                                        ],
                                        toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                                        fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
                                        content_style: 'body { font-size:14px }'
                                    }}
                                />
                            </div>

                        if (e.type === "upload") return <div>
                        {/* <Typography className="label_text_field" variant="caption" gutterBottom>{e.label}</Typography> */}
                        <UploadFiles
                            showIconTransparent={e.showIconTransparent}
                            label={e.label}
                            contentUploadButton="Upload Avatar"
                            previewImgs={detailCompany && detailCompany[e.name] ? (Array.isArray(detailCompany[e.name]) ? detailCompany[e.name] : [detailCompany[e.name]]) : []}
                            uploadFile={(files) => onChangeValue({
                                target: {
                                    name: e.name,
                                    value: files && files[0],
                                }
                            })}
                            deleteFile={(files) => onChangeValue({
                                target: {
                                    name: e.name,
                                    value: null,
                                }
                            })}
                        />
                        </div>
                        return <TextField
                            id="outlined-basic"
                            label={e.label}
                            InputProps={{
                                readOnly: e.disable ? true : false,
                            }}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            value={e.value}
                            type={e.type}
                            name={e.name}
                            required={e.required}
                            onChange={onChangeValue}
                        />
                    })}

                </Stack>
                <Stack direction="row" spacing={3} alignItems="center" justifyContent="right" style={{ marginTop: '24px' }}>
                    <Button variant="contained" onClick={handleUpdateCompany} >
                        Update
                    </Button>
                </Stack>
            </StyledContent>

        </Card>
    }
    return (
        <div>
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
                handleActionSecond={handleDeleteCompany}
            /> 
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Information" value="1" />
                            <Tab label="Resource" value="2" />
                            <Tab label="About us" value="3" />
                        </TabList>
                    </Box>
                    <TabPanel value="1" style={{ padding: "2rem 0" }}>
                        {renderTab(introduceSection)}
                    </TabPanel>
                    <TabPanel value="2" style={{ padding: "2rem 0" }}>{renderTab(resourceSection)}</TabPanel>
                    <TabPanel value="3" style={{ padding: "2rem 0" }}>{renderTab(aboutUsSection)}</TabPanel>
                </TabContext> 
        </div>
    );
}

const mapState = (state) => ({
    detailCompany: state.company.detailCompany,
});
const mapDispatch = (dispatch) => ({
    getDetailCompany: dispatch.company.getDetail,
    updateCompany: dispatch.company.update,
    uploadFile: dispatch.upload.uploadFile,
});
export default connect(mapState, mapDispatch)(CompanyForm)

