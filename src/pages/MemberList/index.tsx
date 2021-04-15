import React, { useState, useRef }  from 'react';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Modal, Popconfirm, Input, Form } from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, {ColumnsState} from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';

import { queryAllMember, deleteMember, deleteMemberList } from '@/services/api/member';

import { 
  genderEnum, degreeEnum,
  partyEnum,
  educationEnum,
  nationalityEnum,
} from '@/services/member.enum';
import DataForm from './components/MemberDataForm';

import { queryMemberExperience } from '@/services/api/member'
import { getDivisionName } from '@/utils/division-code';
import moment from 'moment';

import { fieldRuls } from '@/utils/form-validator'

const handleDeleteCurrent = async (id: number) => {
  const hide = message.loading('正在删除');

  try {
    await deleteMember({id: id});
    hide();
    message.success('删除成功，即将刷新',1);

    return true;
  } catch (error) {
    hide();
    return false;
  }
};

const handleDeleteList = async (selectedRows: TYPE.Member[]) => {
  const hide = message.loading('正在删除');

  if (!selectedRows) return true;
  try {
    await deleteMemberList({
      list: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('删除成功，即将刷新');

    return true;
  } catch (error) {
    hide();
    return false;
  }
};

const novel = [
  '却听得杨过朗声说道：“今番良晤，豪兴不浅，他日江湖相逢，再当杯酒言欢。咱们就此别过。”',
  '说着袍袖一拂，携着小龙女之手，与神雕并肩下山。',  
  '其时明月在天，清风吹叶，树巅乌鸦呀啊而鸣，郭襄再也忍耐不住，泪珠夺眶而出。',
]

const MemberList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<TYPE.Member>();
  const [selectedRows, setSelectedRows] = useState<TYPE.Member[]>([]);

  const actionRef = useRef<ActionType>();

  const [dataFormState, setFormState] = useState({ 
    showModal: false, 
    operation: '', 
    record: {}
  });

  const [columnsStateMap, setColumnsStateMap] = useState<{[key: string]: ColumnsState;}>({
    email: {
      show: false,
    },
  });

  const columns: ProColumns<TYPE.Member>[] = [
    {
      title: '姓名',
      dataIndex: 'realName',
      valueType: 'text',
      hideInSetting: true,
      render: (dom, record) => {
        return (
          <a 
            onClick={() => {
              setCurrentRow(record);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    }, 
    {
      title:'神雕',
      dataIndex: 'id',
      renderText: (val: number) => novel[val % 3],
      ellipsis: true,
      copyable: true,
      search: false,
      tooltip: '飞雪连天射白鹿，笑书神侠倚碧鸳',
    },
    {
      title: '身份证号',
      dataIndex: 'identityNumber',
      sorter: {
        multiple: 2,
      },
      copyable: true,
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }

        return (
          <Form.Item {...rest} rules={[...fieldRuls['identity']]} label="">
              <Input autoComplete="off"/>
          </Form.Item>
        )
      },
      renderText: (val: string) =>
        `${val.substr(0,3)}***${val.substr(val.length-3,3)}`,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      hideInForm: true,
      valueEnum: genderEnum,
      search: false,
      filters: true,
      onFilter: true,
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',
      valueType: 'date',
      search: false,
      sorter: {
        multiple: 1,
        compare: (a,b,sortOrder) => {
          const prev = moment(a.birthday).toDate().valueOf()
          const next = moment(b.birthday).toDate().valueOf()
  
          return prev - next
        },
      },
      defaultSortOrder: 'descend',
      showSorterTooltip: false,
    },
    {
      title: '民族',
      dataIndex: 'nationality',
      hideInTable: true,
      search: false,
      valueEnum: nationalityEnum,
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }

        return (
          <Form.Item rules={[...fieldRuls['mobile']]} label="">
              <Input autoComplete="off"/>
          </Form.Item>
        )
      },
      renderText: (val: string) =>
        `${val.substr(0,3)}***${val.substr(val.length-4,4)}`,
    },
    {
      title: '政党',
      dataIndex: 'party',
      hideInTable: true,
      search: false,
      valueEnum: partyEnum,
    }, 
    {
      title: '邮件地址',
      dataIndex: 'email',
      search: false,
    }, 
    {
      title: '学历',
      dataIndex: 'education',
      hideInTable: true,
      search: false,
      valueEnum: educationEnum,
    }, 
    {
      title: '最高学位',
      dataIndex: 'degree',
      hideInTable: true,
      search: false,
      valueEnum: degreeEnum,
    },
    {
      title: '户籍所在地',
      dataIndex: 'divisionCode',
      hideInTable: true,
      search: false,
      renderText: (val: number) =>
        getDivisionName(val),
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      hideInSetting: true,
      render: (_, record) => [
        <Popconfirm
        placement="rightTop"
        title={'确实要删除这一条么？'}
        onConfirm={async () => {
          await handleDeleteCurrent(record.id as number);
          actionRef.current?.reloadAndRest?.();
          setShowDetail(false);
        }}
        okText="是的"
        cancelText="取消"
      >
        <a 
          key="delete"
        >删除</a>
        </Popconfirm>,
        <a 
          key="update"
          onClick={() => {
            setShowDetail(false);
            setFormState({ showModal: true, operation: 'edit', record: record })
          }}
        >修改</a>,
      ],
    },
  ];

  columns.forEach(col => col.key = col.dataIndex as string);

  const experienceColumns: ProColumns<TYPE.WorkExperience>[] = [
    {
      title: '开始日期',
      dataIndex: 'dateStart',
      valueType: 'date',
      width: '20%',
    },
    {
      title: '结束年月',
      dataIndex: 'dateEnd',
      valueType: 'date',
      width: '20%',
    },
    {
      title: '单位或学校名称',
      dataIndex: 'company',
      width: '40%',
    },
    {
      title: '工作职务',
      dataIndex: 'title',
      width: '20%',
    },
  ];

  return (
    <PageContainer>
      <ProTable<TYPE.Member, TYPE.PageParams>
        headerTitle={'会员列表'}
        actionRef = {actionRef}
        rowKey="id"
        search={{
          filterType: 'light',
          defaultCollapsed: false,
          /*optionRender: ({ searchText, resetText }, { form }) => {
            return [
              <a
                key="searchText"
                type="primary"
                onClick={() => {
                  form?.submit();
                }}
              >
                {searchText}
              </a>,
              <a
                key="resetText"
                onClick={() => {
                  form?.resetFields();
                }}
              >
                {resetText}
              </a>,
            ];
          },*/
        }}
        sortDirections={['ascend', 'descend', 'ascend']}
        bordered
        dateFormatter={'number'}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setFormState({ showModal: true, operation: 'create',record: {
                nationality: 0,
                education: 6,
                degree: 1,
                party: 0,
                email: '',
              }})
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
        // @ts-ignore
        request={queryAllMember}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      /> 
      
      {selectedRows?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRows.length}
              </a>{' '}
              项
            </div>
          }
        >
          <Button
            onClick={async () => {
                Modal.confirm({
                  title: '删除提示',
                  icon: <ExclamationCircleOutlined />,
                  content: '你确实要删除这些选中的数据么？',
                  okText: '是的',
                  okType: 'danger',
                  cancelText: '不了',
                  onOk: async () => {
                    await handleDeleteList(selectedRows);
                    setSelectedRows([]);
                    actionRef.current?.reloadAndRest?.();
                  },
                  onCancel() {},
                });
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}

      <DataForm
        visible={dataFormState.showModal}
        record={dataFormState.record}
        operation={dataFormState.operation}
        doClose={(needReload=false) => {
            setFormState({ showModal: false, operation: '', record: {}})
            if(needReload) {
              actionRef.current?.reloadAndRest?.();
            }
          }
        }
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<TYPE.Member>
            column={2}
            title={currentRow?.realName}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<TYPE.Member>[]}
          />
        )}

        {currentRow?.id && (
          <ProTable
            headerTitle={'个人简历'}
            search={false}
            options={false}
            pagination={false}
            columns={experienceColumns}
            request={async () => queryMemberExperience({
              memberId: currentRow?.id
            })}
          />
        )}

      </Drawer>
    </PageContainer>
  );
};

export default MemberList;    