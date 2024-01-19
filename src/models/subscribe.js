 import {API_URL, LOGIN_TOKEN} from "src/utils/setting"
import axios from "axios";
import { createSearchParams } from 'react-router-dom';
import { saveCookie, loadCookie } from "src/utils/cookies";
import {  toast } from 'react-toastify';
import { returnResult, returnDataError, isSuccessResult,  } from 'src/utils/formatResponse';
import { ERROR } from 'src/utils/errorCode';

const subscribe = {
    state: {
      listSubscribe: [],
      totalSubscribe: 0,
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
      async getList(payload, rootState) {
        try {
          let response = await axios.get(`${API_URL}subscribe/list?${createSearchParams(payload)}`, {
            headers: {
              Authorization: `Bearer ${loadCookie(LOGIN_TOKEN)}`
            }
          }); 
          let result = response.data;
          if(isSuccessResult(response)) {
            this.setState({
              listSubscribe: result?.data?.list,
              totalSubscribe: result?.data?.total,
            })
          }
          return returnResult(response);
        } catch(error) {
          toast.error(error.message);
          return returnDataError(ERROR.ERROR_UNKNOWN, error.message)
        }
      },

      async create(payload, rootState) {
        try {
          let response = await axios.post(`${API_URL}subscribe/create`, {
            ...payload
          },{
            headers: {
              Authorization: `Bearer ${loadCookie(LOGIN_TOKEN)}`
            }
          });  
          return returnResult(response);
        } catch(error) {
          return returnDataError(ERROR.ERROR_UNKNOWN, error.message)
        }
         
      },

      async getDetail(payload, rootState) {
        try {
          let response = await axios.get(`${API_URL}subscribe/detail/${payload.id}`, {
            headers: {
              Authorization: `Bearer ${loadCookie(LOGIN_TOKEN)}`
            }
          });  
          return returnResult(response);
        } catch(error) {
          return returnDataError(ERROR.ERROR_UNKNOWN, error.message)
        }
         
      },

      async update(payload, rootState) {
        try {
          let response = await axios.put(`${API_URL}subscribe/update/${payload?.uuid}`, {
            ...payload
          },{
            headers: {
              Authorization: `Bearer ${loadCookie(LOGIN_TOKEN)}`
            }
          });  
          return returnResult(response);
        } catch(error) {
          return returnDataError(ERROR.ERROR_UNKNOWN, error.message) 
        }
         
      },

      async delete(payload, rootState) {
        try {
          let response = await axios.delete(`${API_URL}subscribe/delete/${payload.id}`   ,{
            headers: {
              Authorization: `Bearer ${loadCookie(LOGIN_TOKEN)}`
            }
          });  
          return returnResult(response);
        } catch(error) {
          return returnDataError(ERROR.ERROR_UNKNOWN, error.message)  
        }
         
      },

    }),
  };
  export  default subscribe;