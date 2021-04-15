// @ts-ignore
/* eslint-disable */
import { request } from 'umi';


/** 获取会员列表 GET /api/member/queryAll */
export async function queryAllMember( 
  params: TYPE.PageParams & {
    pageSize?: number | undefined;
    current?: number | undefined;
    keyword?: string | undefined;
},
  sorter: Record<string, string>, 
  filter: Record<string, React.ReactText[]>,
) {
  return request<TYPE.MemberList>('/api/member/queryAll', {
    method: 'GET',
    params: {
      ...params,
      sorter,
      filter
    },
  });
}

export async function deleteMember(params: any) {
  const { id } = params;

  return request('/api/member/delete', {
    method: 'GET',
    params: {
      id,
    }
  });
}

export async function deleteMemberList(params?: { [list: string]: any }) {
  return request('/api/member/deleteList', {
    method: 'GET',
    params: {
      ...params,
    }
  });
}

export async function updateMember(data: TYPE.Member) {
  return request('/api/member/update', {
    method: 'POST',
    data: {
      ...data
    }
  });
}

export async function addMember(data: TYPE.Member) {
  return request('/api/member/add', {
    method: 'POST',
    data: {
      ...data
    }
  });
}

export async function queryMemberExperience( 
  params: {
  },
  options?: { [key: string]: any },
) {  
  return request<TYPE.MemberList>('/api/member/experience/queryAll', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function deleteExperience(id: number) {
  return request('/api/member/experience/delete', {
    method: 'GET',
    params: {
      id,
    }
  });
}

export async function saveExperience(data: TYPE.WorkExperience) {
  return request('/api/member/experience/save', {
    method: 'POST',
    data: {
      ...data
    }
  });
}