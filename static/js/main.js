$(document).ready(function () {
    if ($.cookie('mytoken') == undefined) {
        alert('먼저 로그인을 해주세요')
        window.location.href = '/login'
    } else {
        load_user_info()

    }
});

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