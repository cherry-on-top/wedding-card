// js calendar by jaewon
// last_modified : 2009/08/06
// Usage : <script type="text/javascript" src="calendar.js"></script>
//         <input type="text" id="start_date" name="start_date" value="20081027|null">
//         <input type="button" name="달력" onClick="calendar(event, 'start_date')">
var calendar_div;
var calendar_object;
var object_number;
var calendar_tt;

// ex) calendar(event, 'object_name', 'YYYYMMDD')
// fmt option이 없으면 기본으로 설정.
// YYYY : 년
// MM : 월
// DD : 일
var calendar_fmt = "YYYY-MM-DD";

// 숨겨야 되는 select element 저장변수(Array)
var hidden_select;
// element의 x, y, width, height를 가져옴. (select외에 object를 인수로 사용해도 됨 ex:div)
function get_pos(selectObject) {
  var pos = [];

  var pos_x = 0,
    pos_y = 0;

  // while에서 offsetParent를 찾아가는 방식이라
  // 다른 지정자에 인수로 넘어온 object를 넘겨줌.
  obj = selectObject;

  // 좌표계산
  while (obj.offsetParent) {
    pos_y += Number.parseInt(obj.offsetTop);
    pos_x += Number.parseInt(obj.offsetLeft);

    obj = obj.offsetParent;
  }
  pos_x += Number.parseInt(obj.offsetLeft);
  pos_y += Number.parseInt(obj.offsetTop);

  // 좌표저장
  pos.x = pos_x;
  pos.y = pos_y;
  pos.x2 = pos_x + selectObject.offsetWidth;
  pos.y2 = pos_y + selectObject.offsetHeight;

  return pos;
}

// IE와 Maxton에서 select elements를 숨김
// 달력 레이어의 좌표를 인수로 넘겨서 해당 좌표내에 select element가 있는지 체크하는 방식
function hide_select(x, y, x2, y2) {
  var selects = document.querySelectorAll("select");
  var hidden_count = 0;

  x = Number.parseInt(x);
  y = Number.parseInt(y);
  x2 = Number.parseInt(x2);
  y2 = Number.parseInt(y2);

  // X축이 겹치는지 체크하기 위한 변수
  var x_cross = false;
  // Y축이 겹치는지 체크하기 위한 변수
  var y_cross = false;

  // 숨겨야 할 select elements를 배열로 등록함.
  hidden_select = [];

  for (const [index, select] of selects.entries()) {
    // select element의 좌표를 가져옴.
    select.pos = [];
    select.pos = get_pos(select);

    // X축이 달력 영역에 포함 되어 있는지 체크
    x_cross =
      (x <= select.pos.x && x2 >= select.pos.x) ||
      (x <= select.pos.x2 && x2 >= select.pos.x2)
        ? true
        : false;

    // Y축이 달력 영역에 포함되어 있는지 체크
    y_cross =
      (y <= select.pos.y && y2 >= select.pos.y) ||
      (y <= select.pos.y2 && y2 >= select.pos.y2)
        ? true
        : false;

    // X축이나 Y축이 달력 레이어와 겹쳐지면 해당 select element를 숨김
    if (x_cross == true && y_cross == true) {
      select.style.visibility = "hidden";
      hidden_select[hidden_count++] = index;
    }
  }
}

// IE와 Maxton에서 숨겨진 select elements를 다시 표시해줌.
function show_select() {
  var selects = document.querySelectorAll("select");

  // hide_select function에서 숨긴 select elements를 다시 보여줌.
  for (const element of hidden_select) {
    selects[element].style.visibility = "visible";
  }
  hidden_select = null;
}

// 달력 레이어 초기화
// 달력 레이어를 만들고 클릭한 object의 위치를 계산해서 달력을 표시할 위치를 계산함
function calendar_set(e) {
  if (!e) var e = window.event;
  //var click_obj = e.target || e.srcElement;
  var click_object = document.querySelector("#div_calendar");

  // 화면의 최대크기를 구함.
  try {
    var s_width =
      Number.parseInt(window.scrollMaxX) +
      Number.parseInt(docElement.clientWidth);
  } catch {
    var s_width =
      document.body.scrollWidth > document.body.clientWidth
        ? document.body.scrollWidth
        : document.body.clientWidth;
  }

  // 클릭한 object의 좌표를 가져옴
  var pos_x = 0;
  var pos_y = 0;
  var object = click_object;

  while (object.offsetParent) {
    pos_y += Number.parseInt(object.offsetTop);
    pos_x += Number.parseInt(object.offsetLeft);

    object = object.offsetParent;
  }
  pos_x += Number.parseInt(object.offsetLeft);
  pos_y += Number.parseInt(object.offsetTop);

  pos_y += click_object.offsetHeight;

  if (s_width < pos_x + 160) {
    pos_x -= 160;
    pos_x += Number.parseInt(click_object.offsetWidth);
  }

  // 기존에 만든 달력 레이어가 있으면 재사용(좌표는 다시 계산함)하고 없으면 생성
  calendar_div = document.querySelector("#calendar_div");

  if (!calendar_div) {
    calendar_div = document.createElement("DIV");
    document.body.append(calendar_div);
  }
  calendar_div.id = "calendar_div";
  calendar_div.style.cssText = "width:90%;margin:0 auto;z-index:99999;";
  calendar_div.style.position = "absolute";
  calendar_div.style.top = pos_y + "px";
  calendar_div.style.left = pos_x + "px";

  calendar_div.style.visibility = "visible";

  // mouseover 상태에서는 창닫기 타이머를 제거함.
  calendar_div.addEventListener("mouseover", function (e) {
    if (calendar_tt) window.clearTimeout(calendar_tt);
  });

  // mouseout이 되면 창닫기 타이머를 설정함
  // 설정된 시간 후에 창이 닫힘
  calendar_div.addEventListener("mouseout", function () {
    if (calendar_tt) window.clearTimeout(calendar_tt);
    calendar_tt = window.setTimeout("calendar_hide()", 300);
  });

  calendar_div.focus();

  // 더블클릭해도 창이 닫히도록..
  //calendar_div.ondblclick = calendar_close;
}

// 달력 레이어를 닫음
function calendar_close() {
  return;
  document.querySelector("#calendar_div").style.visibility = "hidden";
  document.querySelector("#calendar_months").style.visibility = "hidden";
  document.querySelector("#calendar_years").style.visibility = "hidden";

  if (hidden_select) show_select();

  return false;
}

function calendar_years_change(calendar_y, calendar_m) {
  var calendar_years = document.querySelector("#calendar_years");
  var html = calendar_years_html(calendar_y, calendar_m);
  calendar_years.innerHTML = html;
}

// 년도 레이어
function calendar_years_html(calendar_y, calendar_m) {
  var html = "";
  var margin_top = 0;
  var margin_left = 0;
  var previous_year, next_year;

  var year = Number(Number.parseInt((Number(calendar_y) - 1) / 10) * 10 + 1);
  // 년도선택 레이어 설정
  for (var index = 0; index < 10; index++) {
    margin_top = index >= 4 ? 2 : 0;
    margin_left = index % 4 == 0 ? 0 : 2;
    html +=
      '<div style="margin-top:' +
      margin_top +
      "px; margin-left:" +
      margin_left +
      'px; float:left; width:35px; height:20px; text-align:center; padding-top:2px; border:1px solid #c2c2c2; background-color:#e5e5e5; font-size:11px; cursor:pointer;" onClick="calendar_draw(\'' +
      String(year + index) +
      String(calendar_m) +
      "01')\" onMouseOver=\"this.style.backgroundColor='#c2c2c2';\" onMouseOut=\"this.style.backgroundColor='#e5e5e5';\">" +
      String(year + index) +
      "</div>";
  }

  previous_year = year - index;
  next_year = year + index;
  html +=
    '<div style="margin-top:' +
    margin_top +
    "px; margin-left:" +
    margin_left +
    'px; float:left; width:35px; height:20px; text-align:center; padding-top:2px; border:1px solid #c2c2c2; background-color:#e5e5e5; font-size:11px; cursor:pointer;" onClick="calendar_years_change(\'' +
    String(previous_year) +
    "', '" +
    String(calendar_m) +
    "')\" onMouseOver=\"this.style.backgroundColor='#c2c2c2';\" onMouseOut=\"this.style.backgroundColor='#e5e5e5';\">이전</div>";
  html +=
    '<div style="margin-top:' +
    margin_top +
    "px; margin-left:" +
    margin_left +
    'px; float:left; width:35px; height:20px; text-align:center; padding-top:2px; border:1px solid #c2c2c2; background-color:#e5e5e5; font-size:11px; cursor:pointer;" onClick="calendar_years_change(\'' +
    String(next_year) +
    "', '" +
    String(calendar_m) +
    "')\" onMouseOver=\"this.style.backgroundColor='#c2c2c2';\" onMouseOut=\"this.style.backgroundColor='#e5e5e5';\">다음</div>";

  return html;
}

// 달력 레이어에 달력을 출력함.
function calendar_draw(set_date) {
  var days_array = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  var html = '<table class="cal">';
  var calendar_date, calendar_t;

  // 달력을 입력할 input box의 숫자만 검출한 값의 자릿수가 6자리 YYYYMM 이거나 8자리 YYYYMMDD라면 해당 년월에 맞게 달력을 표시함
  if (set_date && (set_date.length == 6 || set_date.length == 8)) {
    calendar_date = set_date;
    var y = calendar_date.slice(0, 4);
    var m = calendar_date.slice(4, 6);
    var s_t = new Date(y, m - 1, 1);
    calendar_t = s_t.getMonth() + 1 != Number(m) ? null : new Date(y, m - 1, 1);
  }

  // 오늘 날짜를 구함. (오늘날짜는 font-weight:bold; 스타일 지정)
  var t = new Date();
  var today = t.getFullYear();

  today +=
    t.getMonth() + 1 < 10
      ? "0" + String(t.getMonth() + 1)
      : String(t.getMonth() + 1);

  today += t.getDate() < 10 ? "0" + String(t.getDate()) : String(t.getDate());

  // 달력을 입력할 input box의 값으로 기본값이 설정되지 않았다면 오늘을 기준으로 달력을 표시함
  if (!calendar_t) {
    var y = t.getFullYear();
    var m = t.getMonth();

    calendar_t = new Date(y, m, 1);
  }

  // 표시할 달력의 년월
  var calendar_yymm = calendar_t.getFullYear();
  calendar_yymm +=
    calendar_t.getMonth() + 1 < 10
      ? String("0" + (calendar_t.getMonth() + 1))
      : String(calendar_t.getMonth() + 1);

  // 표시할 달력의 연도
  var calendar_y = Number(calendar_yymm.slice(0, 4));
  // 표시할 달력의 월
  var calendar_m = Number(calendar_yymm.slice(4, 6));

  // 이전달 링크 값 (◀클릭)
  var previous_m;
  if (Number(calendar_m) == 1) {
    previous_m = String(calendar_y - 1);
    previous_m += "12";
  } else {
    previous_m = String(calendar_y);
    previous_m += calendar_m - 1 < 10 ? "0" + (calendar_m - 1) : calendar_m - 1;
  }

  // 다음달 링크값 (▶클릭)
  var next_m;
  if (Number(calendar_m) == 12) {
    next_m = String(calendar_y + 1);
    next_m += "01";
  } else {
    next_m = String(calendar_y);
    next_m += calendar_m + 1 < 10 ? "0" + (calendar_m + 1) : calendar_m + 1;
  }

  // 이전 다음달 값을 계산하기 위해 달력표시 월의 값을 아래에서 스트링으로 변경
  calendar_m = calendar_m < 10 ? String("0" + calendar_m) : String(calendar_m);
  // 전년도
  var previous_y = String(calendar_y - 1) + calendar_m;
  // 후년도
  var next_y = String(calendar_y + 1) + calendar_m;

  // 년, 월, 닫기 버튼 html
  /*
    html += "<tr>";
    html += "<th colspan=\"7\" class=\"year\">";
    html += "<span onClick=\"calendar_draw('"+prev_y+"')\">◀</span> ";
    html += "<span onClick=\"calendar_years_toggle()\">↕"+calendar_y+"</span> ";
    html += "<span onClick=\"calendar_draw('"+next_y+"')\">▶</span> ";
    html += "<span onClick=\"calendar_draw('"+prev_m+"')\">◀</span> ";
    html += "<span onClick=\"calendar_months_toggle()\">↕"+calendar_m+"</span> ";
    html += "<span onClick=\"calendar_draw('"+next_m+"')\">▶</span> ";
    html += "<span class=\"close\" onClick=\"calendar_close()\">X</span>";
	html += "</th>";
    html += "</tr>";
    // 요일표시 html
 */
  html += "<tr style='height:30px'>";
  html +=
    "<th style='color:#e97265;width:14.28%;	font-family:SMSEMyungJoStd-Regular-FD1;'>일</th>";
  html +=
    "<th style='width:14.28%;font-family:SMSEMyungJoStd-Regular-FD1;'>월</th>";
  html +=
    "<th style='width:14.28%;font-family:SMSEMyungJoStd-Regular-FD1;'>화</th>";
  html +=
    "<th style='width:14.28%;font-family:SMSEMyungJoStd-Regular-FD1;'>수</th>";
  html +=
    "<th style='width:14.28%;font-family:SMSEMyungJoStd-Regular-FD1;'>목</th>";
  html +=
    "<th style='width:14.28%;font-family:SMSEMyungJoStd-Regular-FD1;'>금</th>";
  html +=
    "<th style='width:14.28%;font-family:SMSEMyungJoStd-Regular-FD1;'>토</th>";
  html += "</tr><tr style='height:15px'><td colspan='10'></td></tr>";

  // 달력 시작일의 요일을 구함
  var week = calendar_t.getDay();
  // 시작일이 일요일이 아니면 빈 TD 출력
  for (var index = 0; index < week; index++) {
    html += "<td> </td>\n";
  }

  // 해당월의 마지막 날을 가져옴.
  if (String(calendar_t.getMonth() + 1) == "2")
    max_days =
      (calendar_y % 4 == 0 && calendar_y % 100 != 0) || calendar_y % 400 == 0
        ? 29
        : 28;
  else max_days = days_array[calendar_t.getMonth()];

  // 달력 출력
  var this_date = "";
  var style = "";
  for (var index = 1; index <= max_days; index++) {
    if (week > 6) {
      html += "</tr>";
      week = 0;
    }
    if (week == 0) {
      html += "<tr >";
    }

    var Holiday_object = [
      "20200815",
      "20200930",
      "20201001",
      "20201002",
      "20201003",
      "20201009",
      "20201225",
      "20210101",
      "20210211",
      "20210212",
      "20210213",
      "20210301",
      "20210505",
      "20210519",
      "20210816",
      "20211004",
      "20211011",
      "20210920",
      "20210921",
      "20210922",
      "20211009",
      "20211225",
      "20220101",
      "20220131",
      "20220201",
      "20220202",
      "20220301",
      "20220505",
      "20220601",
      "20220606",
      "20220815",
      "20220909",
      "20220910",
      "20221003",
      "20220912",
      "20221010",
      "20230121",
      "20230123",
      "20230124",
      "20230301",
      "20230505",
      "20230527",
      "20230606",
      "20230815",
      "20230928",
      "20230929",
      "20230930",
      "20231003",
      "20231009",
      "20231225",
      "20251225",
      "20241225",
    ];
    // 달력의 년월
    this_date = calendar_yymm;
    // 표시일
    this_date += index <= 9 ? String("0" + index) : String(index);

    style = " text-align:center; font-family: OptimaLTStd;";
    // input box의 값과 동일한 날은 underline 표시
    if (set_date == this_date && today == this_date)
      //style += " padding-top:0;";

      // 오늘날짜는 진하게 표시
      style += " ";
    // 일요일은 빨간색
    if (week == 0) style += " color:#e97265;";
    // 토요일은 파란색
    if (week == 6) style += " ";

    //console.log(this_date);
    if (set_date == this_date) {
      html +=
        '<td class="content_img" style="' +
        style +
        '" onClick="calendar_set_date(\'' +
        this_date +
        "');\"><div class='content_imgBox'>" +
        index +
        '</div><div class="content_imgBoxFont"></div></td>';
    } else if (Holiday_object.includes(this_date)) {
      html +=
        '<td class="content_holiday" style="' +
        style +
        '" onClick="calendar_set_date(\'' +
        this_date +
        "');\">" +
        index +
        "</td>";
    } else {
      html +=
        '<td style="' +
        style +
        '" onClick="calendar_set_date(\'' +
        this_date +
        "');\">" +
        index +
        "</td>";
    }

    week++;
  }

  // 토요일로 끝나지 않았으면 빈 TD 출력
  if (week < 6) {
    for (var index = week; index <= 6; index++) {
      html += "<td> </td>\n";
    }
  }
  html += "</tr>";
  html += "</table>";

  html +=
    '<div id="calendar_years" style="position:absolute; margin-left:3px; width:154px; visibility:hidden; background-color:#ffffff;">';
  html += calendar_years_html(calendar_y, calendar_m);
  html += "</div>";

  // 월선택 레이어 설정
  html +=
    '<div id="calendar_months" style="position:absolute; margin-left:3px; width:154px; visibility:hidden; background-color:#ffffff;">';
  html +=
    '<div style="float:left; width:22px; height:20px; text-align:center; padding-top:2px; border:1px solid #c2c2c2; background-color:#e5e5e5; font-size:11px; cursor:pointer;" onClick="calendar_draw(\'' +
    calendar_y +
    "01')\" onMouseOver=\"this.style.backgroundColor='#c2c2c2';\" onMouseOut=\"this.style.backgroundColor='#e5e5e5';\">1</div>";
  html +=
    '<div style="float:left; margin-left:2px; width:22px; height:20px; text-align:center; padding-top:2px; border:1px solid #c2c2c2; background-color:#e5e5e5; font-size:11px; cursor:pointer;" onClick="calendar_draw(\'' +
    calendar_y +
    "02')\" onMouseOver=\"this.style.backgroundColor='#c2c2c2';\" onMouseOut=\"this.style.backgroundColor='#e5e5e5';\">2</div>";
  html +=
    '<div style="float:left; margin-left:2px; width:22px; height:20px; text-align:center; padding-top:2px; border:1px solid #c2c2c2; background-color:#e5e5e5; font-size:11px; cursor:pointer;" onClick="calendar_draw(\'' +
    calendar_y +
    "03')\" onMouseOver=\"this.style.backgroundColor='#c2c2c2';\" onMouseOut=\"this.style.backgroundColor='#e5e5e5';\">3</div>";
  html +=
    '<div style="float:left; margin-left:2px; width:22px; height:20px; text-align:center; padding-top:2px; border:1px solid #c2c2c2; background-color:#e5e5e5; font-size:11px; cursor:pointer;" onClick="calendar_draw(\'' +
    calendar_y +
    "04')\" onMouseOver=\"this.style.backgroundColor='#c2c2c2';\" onMouseOut=\"this.style.backgroundColor='#e5e5e5';\">4</div>";
  html +=
    '<div style="float:left; margin-left:2px; width:22px; height:20px; text-align:center; padding-top:2px; border:1px solid #c2c2c2; background-color:#e5e5e5; font-size:11px; cursor:pointer;" onClick="calendar_draw(\'' +
    calendar_y +
    "05')\" onMouseOver=\"this.style.backgroundColor='#c2c2c2';\" onMouseOut=\"this.style.backgroundColor='#e5e5e5';\">5</div>";
  html +=
    '<div style="float:left; margin-left:2px; width:22px; height:20px; text-align:center; padding-top:2px; border:1px solid #c2c2c2; background-color:#e5e5e5; font-size:11px; cursor:pointer;" onClick="calendar_draw(\'' +
    calendar_y +
    "06')\" onMouseOver=\"this.style.backgroundColor='#c2c2c2';\" onMouseOut=\"this.style.backgroundColor='#e5e5e5';\">6</div>";
  html +=
    '<div style="float:left; margin-top:1px; width:22px; height:20px; text-align:center; padding-top:2px; border:1px solid #c2c2c2; background-color:#e5e5e5; font-size:11px; cursor:pointer;" onClick="calendar_draw(\'' +
    calendar_y +
    "07')\" onMouseOver=\"this.style.backgroundColor='#c2c2c2';\" onMouseOut=\"this.style.backgroundColor='#e5e5e5';\">7</div>";
  html +=
    '<div style="float:left; margin-left:2px; margin-top:1px; width:22px; height:20px; text-align:center; padding-top:2px; border:1px solid #c2c2c2; background-color:#e5e5e5; font-size:11px; cursor:pointer;" onClick="calendar_draw(\'' +
    calendar_y +
    "08')\" onMouseOver=\"this.style.backgroundColor='#c2c2c2';\" onMouseOut=\"this.style.backgroundColor='#e5e5e5';\">8</div>";
  html +=
    '<div style="float:left; margin-left:2px; margin-top:1px; width:22px; height:20px; text-align:center; padding-top:2px; border:1px solid #c2c2c2; background-color:#e5e5e5; font-size:11px; cursor:pointer;" onClick="calendar_draw(\'' +
    calendar_y +
    "09')\" onMouseOver=\"this.style.backgroundColor='#c2c2c2';\" onMouseOut=\"this.style.backgroundColor='#e5e5e5';\">9</div>";
  html +=
    '<div style="float:left; margin-left:2px; margin-top:1px; width:22px; height:20px; text-align:center; padding-top:2px; border:1px solid #c2c2c2; background-color:#e5e5e5; font-size:11px; cursor:pointer;" onClick="calendar_draw(\'' +
    calendar_y +
    "10')\" onMouseOver=\"this.style.backgroundColor='#c2c2c2';\" onMouseOut=\"this.style.backgroundColor='#e5e5e5';\">10</div>";
  html +=
    '<div style="float:left; margin-left:2px; margin-top:1px; width:22px; height:20px; text-align:center; padding-top:2px; border:1px solid #c2c2c2; background-color:#e5e5e5; font-size:11px; cursor:pointer;" onClick="calendar_draw(\'' +
    calendar_y +
    "11')\" onMouseOver=\"this.style.backgroundColor='#c2c2c2';\" onMouseOut=\"this.style.backgroundColor='#e5e5e5';\">11</div>";
  html +=
    '<div style="float:left; margin-left:2px; margin-top:1px; width:22px; height:20px; text-align:center; padding-top:2px; border:1px solid #c2c2c2; background-color:#e5e5e5; font-size:11px; cursor:pointer;" onClick="calendar_draw(\'' +
    calendar_y +
    "12')\" onMouseOver=\"this.style.backgroundColor='#c2c2c2';\" onMouseOut=\"this.style.backgroundColor='#e5e5e5';\">12</div>";
  html += "</div>";

  // 달력 표시
  calendar_object.innerHTML = html;

  // IE/Maxton일때 숨겨진 select elements 표시
  if (hidden_select) show_select();

  // Crome, Firefox, Safari가 아니면 달력 영역과 겹치는 select elements 숨김
  if (
    !navigator.userAgent.includes("Chrome") &&
    !navigator.userAgent.includes("Firefox") &&
    !navigator.userAgent.includes("Safari")
  ) {
    hide_select(
      Number.parseInt(calendar_div.style.left),
      Number.parseInt(calendar_div.style.top),
      Number.parseInt(calendar_div.style.left) +
        Number.parseInt(calendar_div.offsetWidth),
      Number.parseInt(calendar_div.style.top) +
        Number.parseInt(calendar_div.offsetHeight),
    );
  }
}

// 선택한 날짜를 input box에 넣어줌.
function calendar_set_date(set_date) {
  var week_array_han = ["일", "월", "화", "수", "목", "금", "토"];
  var week_array_eng = ["Sun", "Mon", "Tue", "Wed", "The", "Fri", "Sat"];

  // FMT 변경 (YYYY-MM-DD)

  if (calendar_object) {
    var year = set_date.slice(0, 4);
    var month = set_date.slice(4, 6);
    var day = set_date.slice(6, 8);
    var sel_date = new Date(year, month - 1, day);
    var week = sel_date.getDay();

    var calendar_value = calendar_fmt;
    calendar_value = calendar_value.replace(/yyyy/i, year);
    calendar_value = calendar_value.replace(/mm/i, month);
    calendar_value = calendar_value.replace(/dd/i, day);
    calendar_value = calendar_value.replace(/wh/i, week_array_han[week]);
    calendar_value = calendar_value.replace(/we/i, week_array_eng[week]);

    if ("12" == object_number) {
      var startDt = calendar_value;
      var endDt = "2013-09-11";
      if (new Date(startDt).getTime() <= new Date(endDt).getTime()) {
        //calendar_obj.value='';
        //alert('선주문 고객님들의 원활한 제작 및 배송을 위하여 9월11일 행사까지\n일시적으로 성장동영상 주문이 제한 되었습니다. ');
        //return;
      }
    }

    calendar_object.value = calendar_value;

    //settle_price();
  }
  calendar_close();

  // input object에 날짜를 셋팅하고 추가적으로 작업해야할 경우가 있어서
  // document에 calendar_set_date_after function이 있으면 실행하게 함.
  // calendar_set_date_after() 예제
  // if(document.getElementById('sdate').value < '2009-09-14')
  // {
  //     alert('9월 14일 보다 이전을 선택할 수 없습니다');
  // }
  if (typeof calendar_set_date_after == "function") {
    calendar_set_date_after();
  }
}

// 달력을 숨김
function calendar_hide() {
  if (calendar_tt) window.clearTimeout(calendar_tt);
  calendar_close();
}

// 300ms 후에 달력을 숨김
// mouseout때 바로 닫히지 않고 약간의 텀을 두어 다시 마우스가 갔을때 달력 레이어를 유지하기 위함
function calendar_afterHide() {
  if (calendar_tt) window.clearTimeout(calendar_tt);
  calendar_tt = window.setTimeout("calendar_hide()", 300);
}

// 달력 숨김 타이머를 삭제함.
function calendar_clearT() {
  if (calendar_tt) window.clearTimeout(calendar_tt);
}

// 년도 클릭시 월선택 레이어를 표시/감춤
// on -> off
// off -> on
function calendar_years_toggle() {
  var calendar_div = document.querySelector("#calendar_div");
  var calendar_years = document.querySelector("#calendar_years");
  var calendar_months = document.querySelector("#calendar_months");

  calendar_months.style.visibility = "hidden";

  // 달력의 년,월,닫기 부분은 표시되도록 상단에서 20px 내려서 표시함.
  var top = Number.parseInt(calendar_div.style.top) + 20;
  var left = Number.parseInt(calendar_div.style.left);

  // position:absolute; 이지만 달력 레이어의 상대성 절대좌표로 인식함.
  calendar_years.style.top = "20px";
  calendar_years.style.left = "0px";

  // 월선택 레이어 토글
  calendar_years.style.visibility =
    calendar_years.style.visibility == "hidden" ? "visible" : "hidden";
}

// 월 클릭시 년도선택 레이어를 표시/감춤
// on -> off
// off -> on
function calendar_months_toggle() {
  var calendar_div = document.querySelector("#calendar_div");
  var calendar_months = document.querySelector("#calendar_months");
  var calendar_years = document.querySelector("#calendar_years");

  calendar_years.style.visibility = "hidden";

  // 달력의 년,월,닫기 부분은 표시되도록 상단에서 20px 내려서 표시함.
  var top = Number.parseInt(calendar_div.style.top) + 20;
  var left = Number.parseInt(calendar_div.style.left);

  // position:absolute; 이지만 달력 레이어의 상대성 절대좌표로 인식함.
  calendar_months.style.top = "20px";
  calendar_months.style.left = "0px";

  // 월선택 레이어 토글
  calendar_months.style.visibility =
    calendar_months.style.visibility == "hidden" ? "visible" : "hidden";
}

// 달력표시 호출함수 onClick="calendar(event, 'ID')"로 호출
function calendar(e, object_name, fmt, number_) {
  if (!e) var e = window.event;
  object_number = number_;

  calendar_object = document.getElementById(object_name);
  // input object의 값에서 숫자만 추출함.
  var default_date = document
    .querySelector("#calendar_div_date")
    .value.replace(/\D/g, "");

  // YYYYMM 혹은 YYYYMMDD 형식이 아니면 무시함.
  if (default_date.length != 6 && default_date.length != 8) default_date = "";

  // onClick="calendar(event, 'ID')"의 ID Object가 없으면 달력을 표시해도 넣을곳이 없으므로 오류처리
  if (!calendar_object) {
    alert(object_name + " object undefined");
    return;
  }

  calendar_fmt = fmt ? fmt : "YYYY-MM-DD";

  // 달력 레이어 초기화
  calendar_set(e);
  // 달력 표시
  //console.log(default_date);
  calendar_draw(default_date);
}
