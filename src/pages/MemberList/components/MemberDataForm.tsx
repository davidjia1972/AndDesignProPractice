import { message, Form, Button, FormInstance } from "antd";
import { useEffect } from "react";
import ProForm, { ModalForm, ProFormText, ProFormSelect, ProFormDatePicker,
} from '@ant-design/pro-form';
import { genderEnum, degreeEnum, partyEnum, educationEnum, 
  nationalityEnum } from '@/services/member.enum';

import { getOptionsFormValueEnum, getBirthdayFromId } from '@/utils/utils'
import { fieldRuls, fidleNormalizes } from '@/utils/form-validator'
import { addMember, updateMember } from "@/services/api/member";
import { useState } from "react";

import { useRef }  from 'react';
import { ProColumns, EditableProTable, ActionType  } from "@ant-design/pro-table";
import { 
  queryMemberExperience,
  deleteExperience,
  saveExperience,
} from '@/services/api/member'
import { 
  DeleteOutlined, 
  EditOutlined, 
  CheckOutlined, 
  CloseOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import set from 'rc-util/lib/utils/set';

import moment from "moment";
import { Alert } from 'antd';

import { ProFormRadio } from '@ant-design/pro-form';
import getDivisionOptions, { getDivisionArray } from '@/utils/division-code';

import { Cascader } from 'antd';
import { useLocalStorageState } from '@umijs/hooks';

import styles from './MemberDataForm.less';
/*
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};*/

const DataForm = (props:{ [key: string]: any }) => {
  const { visible, operation, doClose, record } = props;
  const [form] = Form.useForm();
  const [dataChanged,setDataChanged] = useState<boolean>(false)

  const [divisionCodeValue, saveDivisionCodeValue] = useLocalStorageState('memberData-lastDivision');

  const resetFormDate = (theForm: FormInstance | undefined) => {
    if(operation == 'edit') {
      const {divisionCode, ...rest} = record
      const forData = {
        divisionCode: getDivisionArray(divisionCode),
        ...rest,
      }

      theForm?.setFieldsValue(forData);
    }
    else {
      theForm?.resetFields();
      theForm?.setFieldsValue({
        divisionCode: divisionCodeValue
      });
    }
  }

  useEffect(() => {
    if (form && visible)
      resetFormDate(form)
  }, [visible]);
  
  
  const handleResponse = (sucess:boolean) => {
    doClose(sucess);
  };

  const handleCancel = () => {
    doClose();
  };

  const onFinish = async (value:any) => {   
    //await waitTime(2000)
    const {divisionCode, ...rest} = value 
    const currentDivisionCodeValue = divisionCode[divisionCode.length - 1]

    if(dataChanged) {
      let result = {
        id: record.id,
        divisionCode: currentDivisionCodeValue,
        ...rest,
      }

      try {
        if(operation === 'edit')
          await updateMember(result);
        else {
          await addMember(result);
          saveDivisionCodeValue(divisionCode)
        }
        message.success('???????????????????????????',1);
        handleResponse(true);
      } catch (error) {
        handleResponse(false);
      }
    } else {
      message.success('??????????????????????????????',1);
      handleResponse(false);
    }
  };

  const getTitle = () => {
    switch (operation) {
      case "create":
        return "????????????";
      case "edit":
        return "????????????";
      default:
        return "????????????";
    }
  };

  //=======================
  const experienceRef = useRef<ActionType>();
  const [lineSaving, setLineSaving] = useState<boolean>(false);
  const [addEditLine, setAddEditLine] = useState<boolean>(false);
  //const { TabPane } = Tabs;
  
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const disabledDate = (current: any) => current > moment().endOf('day')

  const columns: ProColumns<TYPE.WorkExperience>[] = [
    {
      title: '????????????',
      dataIndex: 'dateStart',
      valueType: 'date',
      width: '20%',
      fieldProps: {
        allowClear: false,
        disabledDate: disabledDate,
      },
      formItemProps: {
        rules: fieldRuls['requiredDate'],
      },
    },
    {
      title: '????????????',
      dataIndex: 'dateEnd',
      valueType: 'date',
      width: '20%',
      fieldProps: {
        disabledDate: disabledDate,
      },
    },
    {
      title: '?????????????????????',
      dataIndex: 'company',
      width: '35%',
      formItemProps: {
        rules: fieldRuls['required'],
      }
    },
    {
      title: '????????????',
      dataIndex: 'title',
      width: '15%',
    },
    {
      title: '??????',
      valueType: 'option',
      width: '10%',
      render: (text, experience, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(experience.id? experience.id: 0);
          }}
        >
          <EditOutlined />
        </a>,
        <a
          key="deleteItem"
          onClick={() => {
            try {
              deleteExperience(experience.id as number);
              experienceRef.current?.reload();
            } catch(e) {

            }
          }}
        >
          <DeleteOutlined />
        </a>,
      ],
    },
  ];

  const onSaveExperience = async (key:any, row:any) => {
    const data = {
      memberId: record.id,
      ... row,
    }
    try {
      saveExperience(data)
      experienceRef.current?.reload();
    } catch (error) {
      
    }
  }
  //=======================
  
  return (
    <ModalForm
      form={form}
      title={getTitle()}
      visible={visible}
      className={styles.customSelect}
      layout="horizontal"
      omitNil={false}
      initialValues={record}
      onVisibleChange={(visible) => {
        if (!visible) handleCancel();
      }}
      onFinish={onFinish}
      onValuesChange={(changedValus) => {
        if(!dataChanged) 
          setDataChanged(true)

        if(operation == 'create' && changedValus['identityNumber'] != undefined) {
          const identityNumber = changedValus['identityNumber']

          form.setFieldsValue({
            birthday: getBirthdayFromId(identityNumber),
            gender: ((identityNumber as string)?.length > 16)
              ? (2 - parseInt((identityNumber as string)[16]) % 2) 
              : 0,
          })
        }
      }}
      submitter={{
        searchConfig: {
          submitText: '??????',
          resetText: '??????',
        },
        render: (props, defaultDoms) => {
          return [
            ...defaultDoms,
            <Button
              key="extra-reset"
              onClick={() => {
                const { form } = props

                resetFormDate(form)
                setDataChanged(false)
              }}
            >
              ??????
            </Button>,
          ];
        },
      }}
    >

      <ProForm.Group>
        <ProFormText name="realName" label="????????????" placeholder="???????????????????????????"  width="sm"
          rules={fieldRuls['required']} />
        <ProFormDatePicker name="birthday" label="????????????"  width="sm" 
          disabled={operation === 'create'}
          rules={fieldRuls['requiredDate']}
          fieldProps ={{ autoComplete:"off" }}
          allowClear={false}/>  
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText name="identityNumber" label="????????????" placeholder="????????????????????????" width="sm"
          rules={[...fieldRuls['required'], ...fieldRuls['identity']]} 
          normalize={fidleNormalizes['identity']}
          fieldProps ={{ autoComplete:"off" }}
        />
        <ProFormRadio.Group name="gender" label="??????"
          radioType="button"
          options={getOptionsFormValueEnum(genderEnum)}
          disabled={operation === 'create'}
        />

      <ProFormSelect name="nationality" label="??????" placeholder="????????????" width="xs"
          options={getOptionsFormValueEnum(nationalityEnum)} 
          allowClear={false} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText name="mobile" label="????????????" placeholder="?????????????????????" width="sm" 
          rules={[...fieldRuls['required'], ...fieldRuls['mobile']]} 
          normalize={fidleNormalizes['mobile']}
          fieldProps ={{ autoComplete:"off" }}
        />
      <ProFormSelect name="party" label="????????????" placeholder="????????????" width="sm" 
          options={getOptionsFormValueEnum(partyEnum)} 
          allowClear={false} />      
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect name="education" label="&nbsp;&nbsp;&nbsp;????????????" placeholder="????????????" width="sm"
          options={getOptionsFormValueEnum(educationEnum)}
          allowClear={false} />
        <ProFormSelect name="degree" label="????????????" placeholder="????????????"  width="sm"
          options={getOptionsFormValueEnum(degreeEnum)} 
          allowClear={false} />          
      </ProForm.Group>

      <ProForm.Group>
        <ProForm.Item name="divisionCode" label="&nbsp;&nbsp;&nbsp;???&nbsp;&nbsp;???&nbsp;&nbsp;???">
          <Cascader
            options={getDivisionOptions()}
            expandTrigger="hover"
            placeholder="????????????????????????"
            displayRender={(label) => label.length > 2
                                ? label[label.length - 2] + '-' + label[label.length - 1]
                                : label[label.length - 1]
                          }
          />
        </ProForm.Item>
        <ProFormText name="email" label="&nbsp;&nbsp;&nbsp;????????????" placeholder="?????????e-maill??????"  width="md" 
          rules={fieldRuls['email']} 
          fieldProps ={{ autoComplete:"off" }}
        />
      </ProForm.Group>
      
      <EditableProTable<TYPE.WorkExperience>
        rowKey="id"
        headerTitle="????????????"
        actionRef={experienceRef}
        maxLength={5}
        columns={columns}  
        request={async () => queryMemberExperience({
          memberId: record.id
        })}
        recordCreatorProps={{
          creatorButtonText: '??????????????????',
          record: {
            id: -1,
          },
          onClick: () => setAddEditLine(true)
        }}
        toolBarRender={() => [
          showWarning && <Alert 
              message={alertMessage} 
              type="error" 
            />
        ]}
        editable={{
          type: 'multiple',
          onlyAddOneLineAlertMessage: '????????????????????????',
          onSave: onSaveExperience,
          actionRender: (row, config,defaultDoms) => {
            const { editorType, recordKey, form, onSave, newLineConfig } = config
            return [
              <a
                key="save"
                onClick={async () => {
                  try {
                    const isMapEditor = editorType === 'Map';
                    const namePath = Array.isArray(recordKey) ? recordKey : [recordKey];

                    setLineSaving(true)
                    // @ts-expect-error
                    await form.validateFields(namePath, {
                      recursive: true,
                    });

                    const fields = form.getFieldValue(namePath);
                    const experience = isMapEditor ? set(row, namePath, fields) : { ...row, ...fields };

                    if(moment(experience.dateEnd).diff(moment(experience.dateStart),'days') < 0) {
                      setAlertMessage('????????????????????????????????????')
                      setShowWarning(true)
                      setLineSaving(false)
                    } else {
                      setShowWarning(false)
                      const res = await  onSave?.(recordKey, experience, newLineConfig);
                      setAddEditLine(false)
                      setLineSaving(false)
                      return res;
                    }
                    return null;
                  } catch (e) {
                    // eslint-disable-next-line no-console
                    console.log(e);
                    setLineSaving(false)
                    return null;
                  }
                }}
              >
                
                {lineSaving?  <LoadingOutlined /> : <CheckOutlined /> }
              </a>,
              <a 
                key="cancel" 
                onClick={() => {
                  setShowWarning(false)
                  setAddEditLine(false)
                  config.cancelEditable(config.recordKey)
                }
              }
              ><CloseOutlined /></a>,
              !addEditLine &&
              <a
                key="deleteNow"
                onClick={() => {
                  setShowWarning(false)
                  setAddEditLine(false)
                  config.cancelEditable(config.recordKey)
                  try {
                    deleteExperience(row.id as number);
                    experienceRef.current?.reload();
                  } catch(e) {

                  }
                }}
              >
                <DeleteOutlined />
              </a>,
            ]
          }
        }}
      />
  </ModalForm>
  );
};

export default DataForm;
