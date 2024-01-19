 import {API_URL, LOGIN_TOKEN} from "src/utils/setting"
import axios from "axios";
import {  toast } from 'react-toastify';
import { returnResult, returnDataError, isSuccessResult } from 'src/utils/formatResponse';
import { ERROR } from 'src/utils/errorCode';
import { saveCookie, loadCookie } from "src/utils/cookies";

const upload = {
    state: {

    }, // initial state
    reducers: {
      setState(state, payload) {
        state = { ...state, ...payload };
        return { ...state };
      },
    },
    effects: (dispatch) => ({
      // handle state changes with impure functions.
      // use async/await for async actions
      async uploadFile(payload, rootState) {
        try {
          if (payload.files && payload.files.length) {
            const formData = new FormData();
            payload.files.forEach((file) => {
              formData.append("image", file);
            });
            let response = await axios.post(`${API_URL}upload-aws/image`, formData, {
              headers: {
                Authorization: `Bearer ${loadCookie(LOGIN_TOKEN)}`,
                "Content-type": "multipart/form-data",
              }
            }); 
            return returnResult(response); 
          }
        } catch(error) {
          toast.error(error.message);
          return returnDataError(ERROR.ERROR_UNKNOWN, error.message)
        }
         
      },
    }),
  };
  export  default upload;