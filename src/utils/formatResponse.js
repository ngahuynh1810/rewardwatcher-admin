import { ERROR } from 'src/utils/errorCode';
export const returnDataSuccess = (data, message = null) => {
    return {
        code: 1,
        message,
        data,
        error: null,
      };
}
export const returnDataError = (error_code, message = null, data = null) => {
    return {
        code: 0,
        message: message,
        data,
        error: error_code,
      };
}
export const isSuccessResult = (response) => {
    if(response.data && response.data.code === 1) return true;
    return false;
}
export const returnResult = (response) => {
    let result = response.data;
    if(isSuccessResult(response)) {
        return returnDataSuccess(result?.data, result?.message) 
    } else {
        return returnDataError(result?.error || ERROR.ERROR_UNKNOWN, result.message, result.data)
    } 
}