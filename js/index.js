let stuData = [];

$(function () {
  // 1.先把左侧菜单栏切换效果搞定
  changeItem();

  // 2.开始渲染数据
  // 先从本地获取数据，如果本地有，就不用mock随机生成
  // 如果本地没有，就用mock随机生成
  if (localStorage.stuData) {
    stuData = JSON.parse(localStorage.stuData);
    console.log("localStorage.stuData了");
    renderTable(stuData);
  } else {
    console.log("执行了initData");
    initData();
  }
});

function goToStuList() {
  $(".rightContent>div").eq(0).removeClass("notShow");
  $(".rightContent>div").eq(1).addClass("notShow");
  $(".leftMenuItem").eq(0).addClass("itemActive");
  $(".leftMenuItem").eq(1).removeClass("itemActive");
}
function goToAddStu(id) {

  if(id){
    // 说明有 id 传递过来，说明是修改学生
    // 发送 ajax 请求，请求服务器，让服务器把该 id 的学生信息传递过来
    // 传递过来回填到表单
    $.ajax({
        url : '/getOneStuInfo/',
        type : 'POST',
        dataType : 'json',
        data : {id},
        success : function(res){
            // 返回的是该学生的数据，回填到表单
            $('#stuName').val(res.stuName);
            $('#stuEmail').val(res.stuEmail);
            $('#stuAge').val(res.stuAge);
            $('#stuTel').val(res.stuTel);
            $('#stuAddr').val(res.stuAddr);
            if(res.stuGender == '男'){
                $('#male').prop('checked', true);
                $('#female').prop('checked', false);
            } else {
                $('#male').prop('checked', false);
                $('#female').prop('checked', true);
            }
            editId = res.stuId;
            $('#addStuBtn').val('确认修改')
        }
    })
}

  $(".rightContent>div").eq(0).addClass("notShow");
  $(".rightContent>div").eq(1).removeClass("notShow");
  $(".leftMenuItem").eq(0).removeClass("itemActive");
  $(".leftMenuItem").eq(1).addClass("itemActive");
}

function changeItem() {
  $(".leftMenu").on("click", ".leftMenuItem", function (e) {
    if ($(e.target).html() == "学生列表") {
      goToStuList();
    } else {
      goToAddStu();
    }
  });
}

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
            <button type="button" data-id="${item.stuId}" class="btns editBtn">编辑</button>
            <button type="button" data-id="${item.stuId}" class="btns delBtn">删除</button>
          </td>
        </tr>
      </tbody>
    `;
  });
  $("#stuTable").html(tHead + tBody);
}

function initData() {
  $.ajax({
    url: "/getStuData/",
    type: "GET",
    dataType: "json",
    success: function ({ data }) {
      // 注意这里的参数，用到了解构

      // 拿到数据，存储到本地
      localStorage.stuData = JSON.stringify(data);
      stuData = JSON.parse(localStorage.stuData);
      renderTable(data);
    },
  });
}

$("#addStuRandom").click(function () {
  $.ajax({
    url: "/addStuRandom/",
    type: "GET",
    dataType: "json",
    success: function (res) {
      stuData.push(res);
      console.log(stuData);
      localStorage.stuData = JSON.stringify(stuData);
      renderTable(stuData);
    },
  });
});

$("#addStuBtnByForm").click(function () {
  goToAddStu();
});

// 姓名的验证
$("#stuName").blur(function () {
  if ($(this).val().trim()) {
    $("#validateName").html("");
  } else {
    $("#validateName").html("请填写姓名");
  }
});

// 邮箱的验证
$("#stuEmail").blur(function () {
  if ($(this).val()) {
    if (/^[\w\.-_]+@[\w-_]+\.com$/.test($(this).val())) {
      $("#validateEmail").html("");
    } else {
      $("#validateEmail").html("邮箱格式不正确");
    }
  } else {
    $("#validateEmail").html("请填写邮箱");
  }
});

// 年龄的验证
$("#stuAge").blur(function () {
  if ($(this).val()) {
    if (isNaN($(this).val())) {
      // 如果进入到这个 if，说明用户填写的不是数字
      $("#validateAge").html("请填写数字");
    } else {
      if ($(this).val() < 0 || $(this).val() > 100) {
        $("#validateAge").html("数字范围有误");
      } else {
        $("#validateAge").html("");
      }
    }
  } else {
    $("#validateAge").html("请填写年龄");
  }
});

// 手机号
$("#stuTel").blur(function () {
  if ($(this).val()) {
    if (/^1[3456789][0-9]{9}$/.test($(this).val())) {
      $("#validateTel").html("");
    } else {
      $("#validateTel").html("手机号格式不正确");
    }
  } else {
    $("#validateTel").html("请填写手机号");
  }
});

// 地址验证
$("#stuAddr").blur(function () {
  if ($(this).val().trim()) {
    $("#validateAddr").html("");
  } else {
    $("#validateAddr").html("地址不能为空");
  }
});

// 自定义新增学生列表
$("#addStuBtn").click(function () {
  let arr = $("#addStuForm").serializeArray(); //表单序列化。还有个serialize方法
  console.log(arr);

  if (
    arr.every(function (item) {
      return item.value != "";
    })
  ) {
    // 说明没有空项目
    // 接下来还要看正则满足要求
    if (
      $(".regValidate")
        .toArray()
        .some(function (item) {
          return $(item).html() != "";
        })
    ) {
      // 说明验证没有通过
      window.alert("请按照要求填写所有项目");
    } else {
      // 说明验证通过
      // 组装了新的学生对象
      const newStu = {
        stuName: arr[0].value,
        stuGender: arr[1].value,
        stuEmail: arr[2].value,
        stuAge: arr[3].value,
        stuTel: arr[4].value,
        stuAddr: arr[5].value,
      };
      // 下一步就应该新增
      if ($("#addStuBtn").val() === "提交") {
        // 说明用户是做提交操作
        $.ajax({
          url: /addStuByForm/,
          type: "POST",
          dataType: "json",
          data: newStu,
          success: function (res) {
            stuData.push(res);
            localStorage.stuData = JSON.stringify(stuData);
            $("#addStuForm")[0].reset();
            
            renderTable(stuData);
            goToStuList();
          },
        });
      } else {
        // 说明用户是做修改操作
        newStu.stuId = editId;
        $.ajax({
          url: "/editStuByForm/",
          type: "POST",
          dataType: "json",
          data: newStu,
          success: function (res) {
            stuData = res;
            $("#addStuBtn").val("提交");
            localStorage.stuData = JSON.stringify(stuData);
            $("#addStuForm")[0].reset();
            renderTable(stuData);

            goToStuList();
          },
        });
      }
    }
  } else {
    window.alert("请填写所有项目");
  }
});

$("#backStuList").click(function () {
  goToStuList();
});

// 编辑学生
$('#stuTable').on('click','.editBtn',function(e){
  // console.log(e.target.dataset.id); // 原生的方式。获取data-id的值
  goToAddStu($(this).data('id'))  
})
