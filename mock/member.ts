import { Request, Response } from 'express';
import moment from 'moment';

// mock memberListDataSource
const genList = (current: number, pageSize: number) => {
  const memberListDataSource: TYPE.Member[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    memberListDataSource.push({
      id: index,
      realName: `张三李四${index}`,
      identityNumber: '11010520080808' + Math.floor(Math.random() * 1000).toString().padStart(4,'0'),
      gender: Math.floor(Math.random() * 10) % 2 + 1,
      birthday: moment(new Date(+(new Date()) - Math.floor(Math.random()*10000000000))).format('YYYY-MM-DD'),
      party: i % 9,
      mobile: '1' + (Math.floor(Math.random() * 10) % 7 + 3).toString() + Math.floor(Math.random() * 10).toString() + '0137' + Math.floor(Math.random() * 10000).toString().padStart(4,'0'),
      email: 'user@abc.com',
      degree: Math.floor(Math.random() * 10) % 4,
      education: Math.floor(Math.random() * 10) % 9,
      nationality: Math.floor(Math.random() * 1000) % 56,
    });
  }
  memberListDataSource.reverse();
  return memberListDataSource;
};

let memberListDataSource = genList(1, 100);

  //const filterRules = JSON.parse(req.query.filter || ('{}' as any));

function queryAll(req: Request, res: Response, u: string) {  
  const { current = 1, pageSize = 10, sorter='', filter='', ...rest} = req.query;  
  const queryKeys = Object.keys(rest)
  let quertResult =  memberListDataSource
  
  console.log(req.query)
  if(queryKeys.length > 0) {
    quertResult = memberListDataSource.filter( (data) => {
      for (let key of queryKeys) {
        if(rest[key] != '') {
          switch(key) {
            case 'realName':
              if(!data[key]?.includes(rest[key] as string))
                return false
              break;
            default:
              if(data[key] != rest[key])
                return false
              break;
          }
        }       
      }
      
      return true
    })
  }

  let dataSource = quertResult.slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );

  const result = {
    data: dataSource,
    total: quertResult.length,
    success: true,
    pageSize,
    current,
  };

  return res.json(result);
}

//让异步函数暂停指定时间的函数，参数为毫秒
function sleep(microsecond: number) {
  return new Promise(resolve => setTimeout(resolve, microsecond));
}

async function deleteRow(req: Request, res: Response, u: string) {
  const { id } = req.query;

  memberListDataSource = memberListDataSource.filter( data => data.id != id);

  const result = {
    success: true,
    errorCode: 2,
  }

  return res.json(result);
}

function deleteList(req: Request, res: Response, u: string) {
  const { list } = req.query;

  const idList = (list as string[]).map( id => parseInt(id))

  //console.log("** LIST **", list);
  //console.log("** ID LIST **", idList);

  memberListDataSource = memberListDataSource.filter( data => !idList.includes(data.id as number));

  const result = {
    success: true,
  }

  return res.json(result);
}

function update(req: Request, res: Response, u: string) {
  const index = memberListDataSource.findIndex((member) => {return member.id === req.body.id} )
  const result = {
    success: true,
    errorCode: -1,
  }

  if(index >= 0) {
    Object.assign(memberListDataSource[index],req.body)
  } else {
    result.success = false
    result.errorCode = 2
  }
  
  return res.json(result);
}

function add(req: Request, res: Response, u: string) {
  const record = {...req.body}
  let max = 0
  
  for( let member of memberListDataSource){
    const { id=0 } = member;
    max = (max < id)? id : max
  }
  record.id = max + 99

  memberListDataSource.reverse()
  memberListDataSource.push(record)
  memberListDataSource.reverse()

  const result = {
    success: true,
  }
  
  return res.json(result);
}

let workExperience: TYPE.WorkExperience[] = [] ;

function queryExperience(req: Request, res: Response, u: string) {  
  const { memberId = 0 } = req.query;
  const dataSource = workExperience.filter( data => data.memberId == memberId);
  const result = {
    data: dataSource,
    total: dataSource.length,
    success: true,
  };

  return res.json(result);
}

function deleteExperience(req: Request, res: Response, u: string) {
  const { id } = req.query;
  const result = {
    success: true,
  }

  workExperience = workExperience.filter( data => data.id != id);

  return res.json(result);
}

function saveExperience(req: Request, res: Response, u: string) {
  const { id } = req.body
  const result = {
    success: true,
    errorCode: -1,
  }
  const index = id > 0
    ? workExperience.findIndex(experience => experience.id == id )
    : -1

  if(index >= 0) {
    Object.assign(workExperience[index],req.body)
  } else {
    const record = {...req.body}
    let max = 0

    for( let experience of workExperience){
      const { id=0 } = experience;
      max = (max < id)? id : max
    }
    record.id = max + 99
  
    workExperience.push(record)
  }
  
  return res.json(result);
}

export default {
  'GET /api/member/queryAll': queryAll,
  'GET /api/member/delete': deleteRow,
  'GET /api/member/deleteList': deleteList,
  'POST /api/member/update': update,
  'POST /api/member/add': add,

  'GET /api/member/experience/queryAll': queryExperience,
  'GET /api/member/experience/delete': deleteExperience,
  'POST /api/member/experience/save': saveExperience,
};


/*
  const sorter = JSON.parse(req.query.sorter || ('{}' as any));
  const sortKeys = Object.keys(sorter)
  console.log(sorter)

  let dataSource = [...memberListDataSource].slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );

  if(sortKeys.length > 0) {
    dataSource = dataSource.sort((prev, next) => {
      let sortNumber = 0;

      for(let key of sortKeys) {
        const prevValue = moment(prev[key]).toDate()
        const nextValue = moment(next[key]).toDate()

        if (sorter[key] == 'descend') {
          if (prevValue > nextValue) {
            sortNumber += -1;
          } else {
            sortNumber += 1;
          }
        } else {
          if (prevValue > nextValue) {
            sortNumber += 1;
          } else {
            sortNumber += -1;
          }
        }
      };

      return sortNumber;
    })
  }
  */