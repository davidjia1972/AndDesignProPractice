// @ts-ignore
/* eslint-disable */

declare namespace TYPE {
  type Member = {
      id?: number;
      realName?: string;
      identityNumber?: string;
      gender?: number;
      birthday?: string;
      party?: number;
      mobile?: string;
      email?: string;
      degree?: number;
      education?: number;
      nationality?: number;
      divisionCode?: number;
  }

  type MemberList = {
    data?: Member[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type WorkExperience = {
    id?: number;
    memberId?: number;
    dateStart?: string;
    dateEnd?: string;
    company?: string;
    title?: string;
  }
}