// 로딩 후 바로 실행
$(document).ready(function () {
    if ($.cookie('mytoken') == undefined) {
        // mytoken이라는 값으로 쿠키가 없으면, 로그인 창으로 이동시킵니다.
        alert('먼저 로그인을 해주세요')
        window.location.href = '/login'
    } else {
        // 쿠기가 있으면, 유저 정보를 불러옵니다.

        listing()
    }
});



// 로그아웃은 내가 가지고 있는 토큰만 쿠키에서 없애면 됩니다.
function logout() {
    $.removeCookie('mytoken');
    alert('로그아웃!')
    window.location.href = '/login'
}

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

                    let temp_html = `<tr>
                                        <th>${name}</th>
                                        <td>${age}</td>
                                        <td>${phone}</td>
                                    </tr>`
                    $('#order-box').append(temp_html)
                }
            }
        }
    })
}

function cusadd() {
    var win = window.open('/cusadd', 'win', 'width=1000, height=600');
}