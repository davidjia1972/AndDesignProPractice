import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';

import { Upload, message, UploadProps } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { request } from 'umi';

import { Modal } from 'antd'

const uploadPage: React.FC = () => {
  const [objectId, setObjectId] = useState(8)
  const [isLoading, setIsLoading] = useState(true)
  const [defaultFileList,setDefaultFileList] = useState([])
  const [isSuccessful, setIsSuccessful] = useState(false)

  const uploadProps: UploadProps<any> = {
    accept: 'image/*,.pdf',
    action: '/api/upload',
    name: 'myFile',
    
    listType: 'picture-card',   //DJ

    data: {
      oid: objectId,
    },

    onChange(info: any) {
      const { file } = info

      if(file.status != 'uploading')
        console.log(info);

      if (file.status === 'done') {
        if(file.response.success) {
          message.success('文件上传成功');
        }
        else {
          message.error('文件接收失败');
          file.status = 'error'
        }
      } else if (file.status === 'error' ) {
        message.error('文件上传失败');
      }
    },
    onRemove(file: any): boolean | Promise<boolean> {
      async function removeFromServer(oid:any, uid:any) {
        try {
          const result = await request('/api/deleteAttachement', {
            method: 'GET',
            params: {
              oid,
              uid,
            }
          })
          if(result.success)
            setIsSuccessful(true)
        } catch(e) {
        }
      }

      if(file.status == 'done') {
        setIsSuccessful(false)

        return new Promise((resolve, reject) => {
          Modal.confirm({
            title: '删除提示',
            icon: <ExclamationCircleOutlined />,
            content: `你确实要删除 ${file.name} ？`,
            okText: '是的',
            okType: 'danger',
            cancelText: '不了',
            onOk: async () => {
              removeFromServer(file.oid, file.uid)
              resolve(true)
            },
            onCancel: () => reject(),
          });
        })

        return isSuccessful
      } else {
        return true
      }      
    },
    beforeUpload: (file: any, fileList: any[]) => {
      const sizeLimit = 10 * 1024 * 1024
      if(file.size > sizeLimit) {
        Modal.warning({
          title: '文件太大,',
          content: '文件大小不能超过10M',
          });

        return Upload.LIST_IGNORE
      } else {
        return true
      }
    },
  };

  useEffect( ()=> {
    const fetchData = async (oid: number) => {
      console.log("objectId = ", objectId)
      try {
        const result = await request('/api/getAttachements', {
          method: 'GET',
          params: {
            oid: objectId,
          }
        })

        const fileList = result.data.map( (value:any) =>  ({...value, status:'done'}) )
        setDefaultFileList(fileList)
        setIsLoading(false)
      } catch (e) {
        setDefaultFileList([])
        setIsLoading(false)
      }
    }
 
    setIsLoading(true)
    fetchData(8)
  },[objectId])

  return (
    <PageContainer header={{breadcrumb: {},}}>
      <ProCard style={{width: '60%'}} loading={isLoading}>
        <Upload {...uploadProps} defaultFileList={defaultFileList} >
        </Upload>
      </ProCard>
      <br />
      <ProCard>

      </ProCard>
    </PageContainer>
  )
}

export default uploadPage
