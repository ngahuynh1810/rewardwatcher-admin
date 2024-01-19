 import {API_URL, LOGIN_TOKEN} from "src/utils/setting"
import axios from "axios";
import { useNavigate, createSearchParams } from 'react-router-dom';
import { saveCookie, loadCookie } from "src/utils/cookies";
import { returnResult, returnDataError, isSuccessResult } from 'src/utils/formatResponse';
import { ERROR } from 'src/utils/errorCode';

const users = {
    state: {
      listAdmin: [],
      total: 0,
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
      async getListAdmin(payload, rootState) {
        try {
          let response = await axios.get(`${API_URL}super-admin/list?${createSearchParams(payload)}`, {
            headers: {
              Authorization: `Bearer ${loadCookie(LOGIN_TOKEN)}`
            }
          }); 
          this.setState({listAdmin: response?.data?.items})
          this.setState({total: response?.data?.meta?.totalItems})
          return returnResult(response);
          
        } catch(error) {
          return returnDataError(ERROR.ERROR_UNKNOWN, error.message)
        }
         
      },
      async createUser(payload, rootState) {
        try {
          let response = await axios.post(`${API_URL}super-admin`, {
            ...payload
          },{
            headers: {
              Authorization: `Bearer ${loadCookie(LOGIN_TOKEN)}`
            }
          });  
          returnResult(response);
        } catch(error) {
          returnDataError(ERROR.ERROR_UNKNOWN, error.message)
         
        }
         
      },
      async getDetailUser(payload, rootState) {
        try {
          let result = await axios.get(`${API_URL}super-admin/${payload.id}`, {
            headers: {
              Authorization: `Bearer ${loadCookie(LOGIN_TOKEN)}`
            }
          });  
          return result.data;
        } catch(error) {
          return {
            code: 0,
            data: null,
            error: error.message
          }
        }
         
      },
      async updateUser(payload, rootState) {
        try {
          let result = await axios.put(`${API_URL}super-admin/${payload?.id}`, {
            ...payload
          },{
            headers: {
              Authorization: `Bearer ${loadCookie(LOGIN_TOKEN)}`
            }
          });  
          return result.data;
        } catch(error) {
          return {
            code: 0,
            data: null,
            error: error.message
          }
        }
         
      },
      async deleteUser(payload, rootState) {
        try {
          let result = await axios.delete(`${API_URL}super-admin/${payload.id}`   ,{
            headers: {
              Authorization: `Bearer ${loadCookie(LOGIN_TOKEN)}`
            }
          });  
          return result.data;
        } catch(error) {
          return {
            code: 0,
            data: null,
            error: error.message
          }
        }
         
      },
    }),
  };
  export  default users;