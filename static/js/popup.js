var arr = [];
var name = $('#getget').text();
$(document).ready(function () {
    list()
});

function list() {
    let name = $('#getget').text();
    $.ajax({
        type: "GET",
        url: '/showsolution?name=' + name,
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

function select_solution(obj) {
    let sul = $('#mylist option:selected').text();
    if (sul == "직접입력하기") {
        $('#direct_input').show();
    } else {
        $('#direct_input').hide();
    }
}

function deletesolution() {
    arr.pop()
    $('#solution_list').empty()
    for (let i = 0; i < arr.length; i++) {
        let temp_html = `<div class="sol_list">${arr[i]}</div>`
        $('#solution_list').append(temp_html)
    }
}

function myenroll() {
    let sul = $('#mylist option:selected').text();
    if (sul == "직접입력하기") {
        sul = $('#direct_input').val()
        if (sul == '') {
            alert("솔루션을 입력하세요")
            return
        }
    }
    $('#direct_input').val('')
    arr.push(sul)
    $('#solution_list').empty()
    for (let i = 0; i < arr.length; i++) {
        let temp_html = `<div class="sol_list">${arr[i]}</div>`
        $('#solution_list').append(temp_html)
    }
}

function savesolution() {
    alert("실행");
    let name = $('#getget').text();
    $.ajax({
        type: "POST",
        url: "/savedb",
        data: JSON.stringify({
            name_give: name,
            arr
        }),
        contentType: "application/json; charset=utf-8",
        success: function () { }
    })
}