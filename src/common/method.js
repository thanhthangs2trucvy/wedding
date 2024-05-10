import msg from 'assets/locales/msg.json';

/** TYPE BASE
 * | 'bigint'
 * | 'boolean'
 * | 'function'
 * | 'number'
 * | 'object'
 * | 'string'
 * | 'symbol'
 * | 'undefined'
 */

export function getLocaleMessage(key, message) {
  return msg[key][message];
}

export const onCheckType = (
  source,
  type,
) => {
  return typeof source === type;
};

/**
 * return true when success and false when error
 */
export const validResponse = (
  response,
) => {
  if (!response.status) {
    // TODO: handle error
    return false;
  }
  return true;
};


export const execFunc = (...args) => (
  func,
  ...args
) => {
  if (onCheckType(func, 'function')) {
    func(...args);
  }
};

export const handleErrorApi = (status, errorCode, message, ...props) => {
  const result = { status: 0, code: status, errorCode: errorCode, message: message };
  if (status > 505) {
    result.message = getLocaleMessage('error', 'server_error');
    // Notification.error({
    //   title: 'Thông báo',
    //   content: result.message,
    // })
    return result;
  }
  if (status < 500 && status >= 418) {
    result.message = getLocaleMessage('error', 'error_on_request');
    // Notification.error({
    //   title: 'Thông báo',
    //   content: result.message,
    // })
    return result;
  }
  result.message = getLocaleMessage('error', status);
  // Notification.error({
  //   title: 'Thông báo',
  //   content: result.message,
  // })
  return result;
}
