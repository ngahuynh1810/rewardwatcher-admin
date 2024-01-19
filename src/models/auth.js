 import {API_URL} from "src/utils/setting"
import axios from "axios";
import {  toast } from 'react-toastify';
import { returnResult, returnDataError, isSuccessResult, returnDataSuccess } from 'src/utils/formatResponse';
import { ERROR } from 'src/utils/errorCode';

const auth = {
    state: 2, // initial state
    reducers: {
      setState(state, payload) {
        state = { ...state, ...payload };
        return { ...state };
      },
    },
    effects: (dispatch) => ({
      // handle state changes with impure functions.
      // use async/await for async actions
      async login(payload, rootState) {
        try {
          let response = await axios.post(`${API_URL}auth/login`, {
            username: payload.username,
            password: payload.password,
          }); 
          return returnDataSuccess(response?.data?.access_token);
        } catch(error) {
          toast.error(error.message);
          return returnDataError(ERROR.ERROR_UNKNOWN, error.message)
        }
         
      },
    }),
  };
  export  default auth;