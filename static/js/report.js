am4core.ready(function () {
    // Themes begin
    am4core.useTheme(am4themes_dark);
    am4core.useTheme(am4themes_animated);
    // Themes end
    // want_list 배열 생성
    var want_list = []
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.colors.step = 2;

    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";
    chart.legend.paddingBottom = 20;
    chart.legend.labels.template.maxWidth = 95;

    var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = "category";
    xAxis.renderer.cellStartLocation = 0.1;
    xAxis.renderer.cellEndLocation = 0.9;
    xAxis.renderer.grid.template.location = 0;

    var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;

    function createSeries(value, name) {
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = value;
        series.dataFields.categoryX = "category";
        series.name = name;

        series.events.on("hidden", arrangeColumns);
        series.events.on("shown", arrangeColumns);

        var bullet = series.bullets.push(new am4charts.LabelBullet());
        bullet.interactionsEnabled = false;
        bullet.dy = 30;
        bullet.label.text = "{valueY}";
        bullet.label.fill = am4core.color("#ffffff");

        return series;
    }



    var name = $("#getget").text();
    $(document).ready(function () {
        list();
    });

    function list() {
        let name = $("#getget").text();
        $.ajax({
            type: "GET",
            url: "/showscore?name=" + name,
            data: {},
            success: function (response) {
                if (response["result"] == "success") {
                    let score1 = response["score1"];
                    let score2 = response["score2"];
                    let score3 = response["score3"];
                    let score4 = response["score4"];
                    let score5 = response["score5"];

                    for (let i = 0; i < score1.length; i++) {
                        let no1 = score1[i];
                        let no2 = score2[i];
                        let no3 = score3[i];
                        let no4 = score4[i];
                        let no5 = score5[i];
                        var thing = new Object();
                        thing.id = `${i + 1}`
                        thing.category = `${i + 1}일차`;
                        thing.no1 = no1;
                        thing.no2 = no2;
                        thing.no3 = no3;
                        thing.no4 = no4;
                        thing.no5 = no5;
                        want_list.push(thing);
                    }
                    // 차트 데이터를 넣는 곳을 push 스코프 안으로 옮김
                    chart.data = want_list;
                }
            },
        });
    }

    createSeries("no1", "수면시간");
    createSeries("no2", "일어난 횟수");
    createSeries("no3", "눈뜬시간");
    createSeries("no4", "기상시간");
    createSeries("no5", "수면의 질");

    function arrangeColumns() {
        var series = chart.series.getIndex(0);

        var w =
            1 -
            xAxis.renderer.cellStartLocation -
            (1 - xAxis.renderer.cellEndLocation);
        if (series.dataItems.length > 1) {
            var x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
            var x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
            var delta = ((x1 - x0) / chart.series.length) * w;
            if (am4core.isNumber(delta)) {
                var middle = chart.series.length / 2;

                var newIndex = 0;
                chart.series.each(function (series) {
                    if (!series.isHidden && !series.isHiding) {
                        series.dummyData = newIndex;
                        newIndex++;
                    } else {
                        series.dummyData = chart.series.indexOf(series);
                    }
                });
                var visibleCount = newIndex;
                var newMiddle = visibleCount / 2;

                chart.series.each(function (series) {
                    var trueIndex = chart.series.indexOf(series);
                    var newIndex = series.dummyData;

                    var dx = (newIndex - trueIndex + middle - newMiddle) * delta;

                    series.animate({
                        property: "dx",
                        to: dx
                    },
                        series.interpolationDuration,
                        series.interpolationEasing
                    );
                    series.bulletsContainer.animate({
                        property: "dx",
                        to: dx
                    },
                        series.interpolationDuration,
                        series.interpolationEasing
                    );
                });
            }
        }
    }
}); // end am4core.ready()

var arr = [];
var name = $('#getget').text();


function list1() {
    let name = $('#getget').text();
    $.ajax({
        type: "GET",
        url: '/showsol?name=' + name,
        data: {},
        success: function (response) {
            if (response['result'] == 'success') {
                let orders = response['all_orders']
                for (let i = 0; i < orders.length; i++) {
                    let solution = orders[i]
                    let temp_html = `<tr>
                                <td>${solution}</td>
                             </tr>`
                    $('#solution_list').append(temp_html)
                    arr[i] = solution;
                }
            }
        }
    })

}

function deletesolution() {
    arr.pop()
    $('#solution_list').empty()
    for (let i = 0; i < arr.length; i++) {
        let temp_html = `<div class="sol_list">${arr[i]}</div>`
        $('#solution_list').append(temp_html)
    }
}

function savesolution() {
    alert("실행");
    let name = $('#getget').text();
    let score1 = $('#score1').val();
    let score2 = $('#score2').val();
    let score3 = $('#score3').val();
    let score4 = $('#score4').val();
    let score5 = $('#score5').val();


    if (score1 == '') {
        alert('1번 점수를 입력해주세요');
    } else if (score2 == '') {
        alert('2번 점수를 입력해주세요');
    } else if (score3 == '') {
        alert('3번 점수를 입력해주세요');
    } else if (score4 == '') {
        alert('4번 점수를 입력해주세요');
    } else if (score5 == '') {
        alert('5번 점수를 입력해주세요');
    } else {
        $.ajax({
            type: "POST",
            url: "/savescore",
            data: JSON.stringify({
                name_give: name,
                number1: score1,
                number2: score2,
                number3: score3,
                number4: score4,
                number5: score5,

                //숫사 '24 14'
            }),
            contentType: "application/json; charset=utf-8",
            success: function () { }
        })
        window.location.reload();
    }
}