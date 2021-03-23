$(document).ready(function () {
    if ($.cookie('mytoken') == undefined) {
        alert('먼저 로그인을 해주세요')
        window.location.href = '/login'
    } else {

        listing()
    }
});


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