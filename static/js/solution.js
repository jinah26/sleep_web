// 로딩 후 바로 실행

if ($.cookie('mytoken') == undefined) {
    // mytoken이라는 값으로 쿠키가 없으면, 로그인 창으로 이동시킵니다.
    alert('먼저 로그인을 해주세요')
    window.location.href = '/login'
} else {
    // 쿠기가 있으면, 유저 정보를 불러옵니다.
    load_user_info()
}


// 쿠키에 가지고 있는 token을 헤더에 담아서 보냅니다.
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
                // 올바른 결과값을 받으면 nickname을 입력해줍니다.
                $('#nickname').text(response['nickname'])
            } else {
                // 에러가 나면 메시지를 띄우고 로그인 창으로 이동합니다.
                alert(response['msg'])
                window.location.href = '/login'
            }
        }
    })
}

// 로그아웃은 내가 가지고 있는 토큰만 쿠키에서 없애면 됩니다.
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