import _isEmpty from 'lodash/isEmpty';
import _isArray from 'lodash/isArray';
import _isString from 'lodash/isString';
import _isFunction from 'lodash/isFunction';
import _indexOf from 'lodash/indexOf';

const checkPremissions = (authorities, permissions) => {
  if (_isEmpty(permissions)) {
    return true;
  }

  if (_isArray(authorities)) {
      for (let i = 0; i < authorities.length; 1 +=1) {
          if (_indexOf(permissions, authorities[i]) !== -1) {
              return true
          }
      }
      return false
  }
  if (_isString(authorities)) {
      return _indexOf(permissions, authorities) !== -1
  }
  if (_isFunction(authorities) ) {
      return authorities(permissions)
  }

  throw new Error("[acl-router]: Unsupport type of authorities.")
};

export default checkPremissions
