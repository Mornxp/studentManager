
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

Mock.mock("/addStuRandom/", function () {
  // 首先我们要生成一条随机数据
  const newStu = Mock.mock({
    list: template,
  });
  // 这里正常逻辑是连接数据库进行存储，存储后返回新增的数据 id
  let stuData = JSON.parse(localStorage.stuData);
  newStu.list.stuId = parseInt(stuData[stuData.length - 1].stuId) + 1;
  return newStu.list;
});

// 分割参数信息形成对象
function queryToObj(queryStr) {
  var result = {};
  var queryArr = queryStr.split("&");
  for (var i of queryArr) {
    var key = i.split("=")[0];
    var val = i.split("=")[1];
    result[key] = val;
  }
  return result;
}
// 手动新增一位学生
Mock.mock("/addStuByForm/", "post", function (options) {
  var newStu = queryToObj(decodeURIComponent(options.body));

  // 正常的逻辑是连接数据库存储
  // 这里因为我们没有数据库，就存储到本地
  let stuData = JSON.parse(localStorage.stuData);
  newStu.stuId = parseInt(stuData[stuData.length - 1].stuId) + 1;
  return newStu;
});

// 获取一条学生数据
Mock.mock("/getOneStuInfo/", "post", function (option) {
  var id = queryToObj(decodeURIComponent(option.body)).id;
  // 正常情况下，应该是连接数据库进行查询
  var stuData = JSON.parse(localStorage.stuData);
  var result = stuData.filter(function (item) {
    return item.stuId == id;
  });
  return result[0];
});

// 修改学生
Mock.mock("/editStuByForm/", "post", function (option) {
  var newStuInfo = queryToObj(decodeURIComponent(option.body)); // 解码
  var stuData = JSON.parse(localStorage.stuData);
  for (var i = 0; i < stuData.length; i++) {
    if (stuData[i].stuId == newStuInfo.stuId) {
      stuData.splice(i, 1, newStuInfo);
      break;
    }
  }
  return stuData;
});

