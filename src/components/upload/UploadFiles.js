import { ImageLightBox } from "src/components/upload";
import React, { useEffect, useState } from "react";

// @mui
import { styled } from '@mui/material/styles';
import {
    Card,
    Stack,
    Container,
    Button,
    CardActions, CardContent, CardMedia,
    TextField
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
// sections
import { CategoryForm } from 'src/sections/@dashboard/categories';

function UploadFiles(props) {
    let { hideUploadBtn, hideDeleteBtn , contentUploadButton, label, uploadOnlyOneFile, showIconTransparent} = props;
    const [selectedImage, setSelectedImage] = React.useState();
    const [previewImgs, setpreviewImgs] = React.useState();
    const [url, setUrl] = useState(null);

    useEffect(() => {
        setpreviewImgs(props.previewImgs || [])
        // if(!tokenLogin) navigate("/login");
    }, [props.previewImgs]);
    const onChange = (e) => {
        if (e.target.files && e.target.files.length) {
            getBase64(e.target.files[0], (imageUrl) => {
                let files = e.target.files[0];
                files.data = imageUrl;
                (previewImgs || []).push(files)
                setpreviewImgs(previewImgs)
                if (props.uploadFile) props.uploadFile(uploadOnlyOneFile ? previewImgs[0] : previewImgs);
            });
        }
    };
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    const deleteFile = (index) => {
        (previewImgs || []).splice(index, 1)
        setpreviewImgs(previewImgs)
        if (props.deleteFile) props.deleteFile(uploadOnlyOneFile ? null : previewImgs);
    };
    const selectImage = (image) => {
    }
    const acceptFile = ".jpg,   .jpeg, .png, .svg"
    return (
        <>
            <div  >
                {/* {selectedImage && (
                    <ImageLightBox
                        image={selectedImage}
                        handleClose={() => {
                        }}
                    />
                )} */}
                <div className="label_text_field">{label}</div>
                <div className="mb-3 d-flex justify-content-between flex-column">
                    {!(previewImgs || []).length ?
                    <>
                        <Button
                                variant="outlined" color="info"
                                className="button_upload_file"
                            >
                                {contentUploadButton || "Upload Image"}
                                <input
                                    className="input_upload_file"
                                    type="file"
                                    name="file"
                                    accept={acceptFile}
                                    onChange={onChange}
                                //   disabled={disabled}
                                />
                        </Button>
                        <span style={{
                            margin: "0px 8px"
                        }}>or upload via URL </span>  <TextField
                        size="small"
                                id="outlined-basic"
                                label="Url"
                                InputProps={{
                                readOnly: false,
                                }}
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                // value={cashbackCard?.order_by}
                                type="text"
                                name="order_by"
                                // required={e.required}
                                onChange={(e) => {
                                    let files = {};
                                    files.url = e.target.value;
                                    (previewImgs || []).push(files)
                                    setpreviewImgs(previewImgs)
                                    if (props.uploadFile) props.uploadFile(uploadOnlyOneFile ? previewImgs[0] : previewImgs);
                                }}
                            />
                    </>
                    : ""}
                </div>
                {previewImgs && previewImgs.length ? previewImgs.map((previewImg, index) =>
                    <Card sx={{ maxWidth: 345, marginBottom: "16px" }}>
                        <CardMedia
                        style={{
                            backgroundSize: "contain",
                            backgroundColor: showIconTransparent ? "#182670" : "#fff"
                        }}
                            sx={{ height: 140 }}
                            image={previewImg.url || previewImg.data}
                            title="previewImg"
                        />
                        <CardActions>
                            {/* <Button size="small">Share</Button> */}
                            {/* <Button color="info" size="small">Preview</Button> */}
                            <Button color="error" size="small" onClick={() => deleteFile(index)}>Delete Image</Button>
                        </CardActions>
                    </Card>
                ) : (
                    <>
                    </>
                )}
            </div>

        </>
    );
}
export default UploadFiles

