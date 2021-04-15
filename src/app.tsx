import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import type { ResponseError } from 'umi-request';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const currentUser = await queryCurrentUser();
      return currentUser;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// https://umijs.org/zh-CN/plugins/plugin-layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>openAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '请求了不存在的资源，如果反复出现此现象，请联系软件服务商。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器遇到了一些麻烦，请稍后尝试或联系软件服务商。',
  502: '中间服务器和远端服务器之间遇到了一些麻烦，请稍后尝试或联系软件服务商。',
  503: '服务器临时有点儿忙，请稍后尝试或联系软件服务商。',
  504: '中间服务器和没有联系到远端服务器，请稍后尝试或联系软件服务商。',
};

const appExceptionMessage = {
  0: '未知的错误。',
  1: '服务器一直没有反应，可能是比较忙，请等一会儿再试。',
  2: '哎呀，没有找到你要处理的数据，刷新一下页面再试试看吧。',
};

/** 异常处理程序
 * @see https://beta-pro.ant.design/docs/request-cn
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const { status, url } = response;
    const errorText = codeMessage[status] || response.statusText;
    
    if(status != 401) {
      notification.error({
        message: `请求错误 ${status} ${isDev? url: ''}`,
        description: errorText,
        duration: 8,
      });
    }
  }

  if (!response) {
    let option = {
      description : '您的网络发生异常，无法连接服务器',
      message : '网络异常',
      duration: 8,
    }

    //处于开发状态的时候，将error的内容解析后输出在控制台上
    if(isDev)
      console.log('error', JSON.stringify(error,null,2));

    switch(error.name) {
      case 'RequestError':
        //请求的时候发生了错误，目前只针对超时进行单独的处理
        if(error.type === "Timeout") {
          option.description = appExceptionMessage[1];
          option.message = '系统忙';
        }
        break;
      case 'BizError':
        //error.name是'BizError'意味着错误是由于返回的数据里面success为false而被抛出了异常
        //这是umi-request的定义的机制
        const {errorCode = 0, errorMessage = undefined} = error.data;
        option.description = (errorMessage != undefined)? errorMessage : (appExceptionMessage[errorCode] || appExceptionMessage[0]);
        option.message = '操作失败';
        break;
    }

    notification.error(option)
  }

  throw error;
};

// https://umijs.org/zh-CN/plugins/plugin-request
export const request: RequestConfig = {
  errorHandler,
};
