
import { handleErrorApi } from 'common';
import { CODE_SUCCESS, CODE_TIME_OUT, ERROR_NETWORK_CODE, RESULT_CODE_PUSH_OUT, STATUS_TIME_OUT } from 'services/config';

const responseDefault = {
  code: CODE_SUCCESS,
  status: true,
};

export const handleResponseAxios = (res) => {
  if (res?.data) {
    if (!res?.data?.status) {
      return { ...responseDefault, ...res.data };
    } else {
      return { ...responseDefault, ...res.data, data: res.data?.data };
    }
  }
  return { ...responseDefault, ...res };
};

export const handleErrorAxios = (error) => {
  if (error.code === STATUS_TIME_OUT) {
    // timeout
    return handleErrorApi(CODE_TIME_OUT);
  }
  if (error.response) {
    if (error.response.status === RESULT_CODE_PUSH_OUT) {
      return handleErrorApi(RESULT_CODE_PUSH_OUT, error.response?.data?.errorCode, error.response?.data?.message, error.response?.data);
    } else {
      return handleErrorApi(
        error.response.status,
        error.response?.data?.errorCode,
        error.response?.data?.message,
        error.response?.data
      );
    }
  }
  return handleErrorApi(ERROR_NETWORK_CODE);
}
