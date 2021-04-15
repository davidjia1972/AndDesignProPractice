import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  title: '管理平台',
  logo: 'http://www.51gh.com.cn/cdn/logo.png',
  
  navTheme: "light",
  primaryColor: "#1890ff",
  layout: "side",
  contentWidth: "Fluid",
  fixedHeader: false,
  fixSiderbar: true,
  //title: "管理平台",
  pwa: false,
  iconfontUrl: "",
  menu: {
    locale: false
  },
  headerHeight: 48,
};

export default Settings;
