import React, { useState, useEffect }  from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { request } from 'umi';

import { Button, Upload, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

import 'antd/es/modal/style';
import 'antd/es/slider/style';
import './style.less'

const uploadPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState(8)
  const [avatarUrl, setAvatarUrl] = useState<string>()
  const uploadButton = (
    <div>
      {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  );
  const avatarImage = (
    <div className="avatar-box">
      <img src={avatarUrl} alt="头像" />
    </div>
  )

  useEffect(() => {
    const getAvatar = async (id: number) => {
      setIsLoading(true)
      try {
        const result = await request('/api/user/getAvatar', {
          method: 'GET',
          params: {
            userId: id
          }
        })
  
        const image = await fetch (result.data.url, { 
          method: 'GET',
          headers: {
            "Content-Type": "image/png;image/jpeg"
          },
        })
        const blob = await image.blob()
  
        setAvatarUrl(URL.createObjectURL(blob))
        setIsLoading(false)
      } catch (e) {
        //没有头像的时候，后端设置success为false，这里自动做异常处理
        setIsLoading(false)
      }
    }

    //setIsLoading(true)
    getAvatar(userId)
  },[userId])


  const uploadProps: UploadProps<any> = {
    accept: '.jpg,.jpeg,.png',
    action: '/api/user/uploadAvatar',
    name: 'avatar',
    
    listType: 'picture-card',   //DJ
    showUploadList: false,

    onChange: info => {
      if (info.file.status === 'uploading') {
        setIsLoading(true);
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        setIsLoading(false)
        setAvatarUrl(URL.createObjectURL(info.file.originFileObj))
      }
    }

  }

  return (
    <PageContainer header={{breadcrumb: {},}}>
      <ProCard style={{width: '60%'}} >
        <ImgCrop rotate shape={"round"}>
          <Upload {...uploadProps}  >
            { avatarUrl?  avatarImage : uploadButton }
          </Upload>
        </ImgCrop>
        <Button onClick={ () => setAvatarUrl(undefined) }>清除头像</Button>
      </ProCard>

    </PageContainer>
  )
}

export default uploadPage
