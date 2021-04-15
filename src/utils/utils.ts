/* eslint no-useless-escape:0 import/prefer-default-export:0 */
import moment from 'moment';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export function getOptionsFormValueEnum (valueEnum: Object) {
  return (Object.entries(valueEnum)).map( ([key, label]) => ({
    value: parseInt(key),
    label,
  }))
}

export function getBirthdayFromId(idNumber: string) {
  let dateString = ''

  if(idNumber != undefined) {
    dateString = idNumber.substr(6,8)          
    switch(dateString.length) {
      case 8:
        break;
      case 7:
        dateString += '1'
        break;
      case 6:
        dateString += '01'
        break;   
      case 5:
        dateString += '101'
        break;
      case 4:
        dateString += '0101'
        break;
      case 0:
        dateString = ''
        break;
      default:
        dateString = dateString.padEnd(4,'0') + '0101'
      }
    }

    return (dateString!='')? moment(dateString) : null;
}

export function wait(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};