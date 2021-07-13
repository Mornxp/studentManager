let stuData = [];

$(function () {
  // 1.先把左侧菜单栏切换效果搞定
  changeItem();

  // 2.开始渲染数据
  // 先从本地获取数据，如果本地有，就不用mock随机生成
  // 如果本地没有，就用mock随机生成
  if (localStorage.stuData) {
    
    stuData = JSON.parse(localStorage.stuData);
    console.log('localStorage.stuData了');
    renderTable(stuData);
  }else{
    console.log('执行了initData');
    initData();
  }
});

function goToStuList() {
  $('.rightContent>div').eq(0).removeClass('notShow');
  $('.rightContent>div').eq(1).addClass('notShow');
  $('.leftMenuItem').eq(0).addClass('itemActive');
  $('.leftMenuItem').eq(1).removeClass('itemActive');
};
function goToAddStu() {
  $('.rightContent>div').eq(0).addClass('notShow');
  $('.rightContent>div').eq(1).removeClass('notShow');
  $('.leftMenuItem').eq(0).removeClass('itemActive');
  $('.leftMenuItem').eq(1).addClass('itemActive');
}

function changeItem() {
  $('.leftMenu').on('click', '.leftMenuItem', function (e) {
    if ($(e.target).html() == '学生列表') {
      goToStuList();
    }else{
      goToAddStu();
    }
  })
};

function renderTable(arr) {
  let tHead = `
    <thead>
      <tr>
        <th>学号</th>
        <th>姓名</th>
        <th>性别</th>
        <th>邮箱</th>
        <th>年龄</th>
        <th>手机号</th>
        <th>住址</th>
        <th>操作</th>
      </tr>
    </thead>
  `;
  let tBody = arr.map(function (item) {
    return `
      <tbody>
        <tr>
          <td>${item.stuId}</td>
          <td>${item.stuName}</td>
          <td>${item.stuGender}</td>
          <td>${item.stuEmail}</td>
          <td>${item.stuAge}</td>
          <td>${item.stuTel}</td>
          <td>${item.stuAddr}</td>
          <td>
            <button type="button" class="btns editBtn">编辑</button>
            <button type="button" class="btns delBtn">删除</button>
          </td>
        </tr>
      </tbody>
    `
  });
  $('#stuTable').html(tHead + tBody);

}

function initData() {
  $.ajax({
    url: '/getStuData/',
    type: 'GET',
    dataType: 'json',
    success: function ({data}) {
      // 注意这里的参数，用到了解构

      // 拿到数据，存储到本地
      localStorage.stuData = JSON.stringify(data);
      stuData = JSON.parse(localStorage.stuData);
      renderTable(data);
    }
  })
};


