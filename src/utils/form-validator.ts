import {Rule} from 'rc-field-form/es/interface'

export const fieldRuls:{[key: string]: Rule[]}={
  required: [
    {
      required: true,
      whitespace: true,
      message: '此项为必填项',
    },
  ],
  requiredDate: [
    {
      required: true,
      whitespace: true,
      type: 'date',
      message: '此项为必填项',
    },
  ],
  mobile: [
    {
      required: false,
      pattern: new RegExp(/^1[3-9]\d{9}$/, "g"),
      message: '请输入正确的手机号码'
    },
  ],
  identity: [
    {
      required: false,
      pattern: new RegExp(/^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, "g"),
      message: '请输入正确的身份证号码'
    },
  ],
  email: [
    {
      required: false,
      pattern: new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, "g"),
      message: '请输入正确的电子邮件地址'
    },
  ],  
}

export const fidleNormalizes={
  mobile: (value:string, prevValue:string) => {
    let nextValue = value.replace(/[^\d]+/g, '')
    if(value.length > 11)
      nextValue =  prevValue

    return nextValue
  },
  identity: (value:string, prevValue:string) => {
    let nextValue = value.replace(/[^(\d|x|X)]+/g, '')
    if(value.length > 18)
      nextValue =  prevValue
    
    return nextValue?.toUpperCase()
  },
  phone: (value:string, prevValue:string) => {
    let nextValue = value.replace(/[^(\d|\-)]+/g, '')

    return nextValue
  },
  digit: (value:string, prevValue:string) => {
    let nextValue = value.replace(/[^\d]+/g, '')

    return nextValue
  },
}

    /*
  邮箱：
  /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/
  
  强密码正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
  /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/

银行卡号（16或19位）
/^([1-9]{1})(\d{15}|\d{18})$/

URL链接(网址)
/^((https?|ftp|file):\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/\w\.-]*)*\/?/

.座机
/^[0][1-9]{2,3}-[0-9]{5,10}$/
/\d{3}-\d{8}|\d{4}-\d{7}/

1. 数字：\\d+
2. 字母：[a-z-]+
3. 数字或字母：[0-9a-z]+

帐号是否合法(字母开头，允许5-16字节，允许字母数字下划线组合
/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
  */