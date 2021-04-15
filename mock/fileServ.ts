import { Request, Response } from 'express';

interface fileInfo {
  fieldname: string,
  originalname: string,
  encoding: string,
  mimetype: string
  size: number,
  buffer: any,
}

interface RequestEx extends  Request {
  files: fileInfo[]
}

interface attachement {
  uid: string,
  oid: number | undefined,
  name: string,
  url?: string,
  size?: number,
}

let attachments: attachement[] = [
  {
    uid: '1',
    oid: 8,
    name: 'file001.png',
    url: 'http://www.51gh.com.cn',
    size: 123,
  },
  {
    uid: '4',
    oid: 8,
    name: 'file002.png',
    url: 'http://www.51gh.com.cn',
    size: 456,
  },
  {
    uid: '3',
    oid: 9,
    name: 'file999.png',
    url: 'http://www.51gh.com.cn',
    size: 123456,
  },
]

function getAttachements(req: RequestEx, res: Response) {
  let data:attachement[] = []
  const { oid } = req.query;
  const fieldList = attachments.filter((data) => data.oid == oid )

  //console.log(oid, fieldList)
  
  if(fieldList != undefined)
    data = Array.of( ...fieldList )

  return res.json({
    success: true,
    data,
  })
}

function uploadHandler(req: RequestEx, res: Response) {
  const { oid } = req.body
  const files = req.files.map((value) => {
    const { buffer, ...rest } = value
    return { ...rest }
  })

  for( let value of files) {
    attachments.push({
      oid,
      uid: '',
      name: value.originalname,
      url: 'http://www.51gh.com.cn',
      size: value.size,
    })
  }
  
  const result = {
    success: (Math.floor(Math.random() * 10) % 3 != 0) ,
    data: { files },
  }
  console.log(result)

  return res.json(result);
}

function deleteAttachement(req: RequestEx, res: Response) {
  const { oid, uid } = req.query;

  attachments = attachments.filter( (file) => !(file.oid == oid && file.uid == uid))
  //console.log(attachments)

  return res.json({
    success: true,
  });
}

let AvatarList: any[] = [
  {
    userId: 8,
    url: '/images/d1.jpg',
  },
  {
    userId: 9,
    url: '/images/d2.jpg',
  },
]

function getAvatar(req: RequestEx, res: Response) {
  const { userId } = req.query;
  const avatar = AvatarList.find((data) => data.userId == userId )

  if(avatar != undefined)
    return res.json({
      success: true,
      data: avatar,
    })
  else 
    return res.json({
      success: false,
    })
}

function uploadAvatar(req: RequestEx, res: Response) {
  const { userId } = req.body
  const files = req.files.map((value) => {
    const { buffer, ...rest } = value
    return { ...rest }
  })

  const result = {
    success: true ,
    data: { files },
  }

  return res.json(result);
}

export default {
  'GET /api/deleteAttachement': deleteAttachement,
  'GET /api/getAttachements': getAttachements,
  'POST /api/upload': uploadHandler,

  'GET /api/user/getAvatar' : getAvatar,
  'POST /api/user/uploadAvatar' : uploadAvatar,
}