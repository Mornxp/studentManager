
const template = {
  "stuId|+1": 1,
  stuName: "@cname",
  stuGender: /[男女]/,
  stuEmail: "@email",
  "stuAge|20-30": 1,
  stuTel: /^1[385][1-9]\d{8}/,
  stuAddr: "@city",
}

Mock.mock('/getStuData/', function () {
  return Mock.mock({
    "status": "success",
    "msg": "返回学生数据",
    "code": 200,
    "data|6": [template]
  })
});

