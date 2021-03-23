if ($.cookie('mytoken') == undefined) {
    alert('먼저 로그인을 해주세요')
    window.location.href = '/login'
} else {
    load_user_info()
}

function load_user_info() {
    $.ajax({
        type: "GET",
        url: "/api/nick",
        headers: {
            'token_give': $.cookie('mytoken')
        },
        data: {},
        success: function (response) {
            if (response['result'] == 'success') {
                // 올바른 결과값을 받으면 nickname을 입력
                $('#nickname').text(response['nickname'])
            } else {
                alert(response['msg'])
                window.location.href = '/login'
            }
        }
    })
}

function logout() {
    $.removeCookie('mytoken');
    alert('로그아웃!')
    window.location.href = '/login'
}



$(document).ready(function () {

    listing()

});


function listing() {
    $.ajax({
        type: "GET",
        url: '/show',
        data: {},
        success: function (response) {
            if (response['result'] == 'success') {
                let orders = response['all_orders']

                for (let i = 0; i < orders.length; i++) {

                    let name = orders[i]['name']
                    let age = orders[i]['age']
                    let phone = orders[i]['phone']
                    let image = orders[i]['image']
                    make_card(i, image, name, age, phone)
                }
            }
        }
    })
}

function make_card(i, image, name, age, phone) {
    let temp_html = `<div class="card">
                        <img class="card-img-top" src="${image}"
                            alt="Card image cap">
                        <div class="card-body">
                            <h2 style="color:black;">${name}</h2>
                            <p style="color:black;">${age}세</p>
                            <p style="color:black;">${phone}</p>
                            <a class="btn btn-secondary" id="cardbtn" onclick="popup('${name}')" role="button">솔루션</a>
                            <a class="btn btn-secondary" id="cardbtn" href="/result?name=${name}" target="_blank" role="button">그래프</a>
                        </div>
                    </div>`;
    $('#cards-box').append(temp_html);
}

function popup(name) {
    let want_name = name;
    var win = window.open('/popup?name=' + want_name, 'win', 'width=1000, height=600');
}