let speedtestModal;

// /* globals Chart:false, feather:false */
//
// (function () {
//     'use strict'
//
//     feather.replace({ 'aria-hidden': 'true' })
//
//     // Graphs
//     var ctx = document.getElementById('myChart')
//     // eslint-disable-next-line no-unused-vars
//     var myChart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: [
//                 'Sunday',
//                 'Monday',
//                 'Tuesday',
//                 'Wednesday',
//                 'Thursday',
//                 'Friday',
//                 'Saturday'
//             ],
//             datasets: [{
//                 data: [
//                     15339,
//                     21345,
//                     18483,
//                     24003,
//                     23489,
//                     24092,
//                     12034
//                 ],
//                 lineTension: 0,
//                 backgroundColor: 'transparent',
//                 borderColor: '#007bff',
//                 borderWidth: 4,
//                 pointBackgroundColor: '#007bff'
//             }]
//         },
//         options: {
//             scales: {
//                 yAxes: [{
//                     ticks: {
//                         beginAtZero: false
//                     }
//                 }]
//             },
//             legend: {
//                 display: false
//             }
//         }
//     })
// })()

$(document).on('click', '#testButton', () => {
    speedtestModal.show()
});

$(document).on('click', '#scheduleButton', () => {
    speedtestModal.hide()
    const serverId = $('#selectServer').val()
    $.ajax({
        type: 'get',
        url: `http://localhost:4000/speedtest?serverId=${serverId}`,
        success: function (response) {
            if ('success' === response.status) {
                console.log(`New Test Scheduled: ${response.testId}`)
            } else {
                alert('Failed to schedule')
            }
        },
        error: function (data) {
            alert('Failed')
            console.log(data)
        }
    });
});

$(document).ready(() => {
    loadHistory()
    loadServers()
    speedtestModal = new bootstrap.Modal($('#speedtestModal'));
});

const loadHistory = () => {
    $.ajax({
        type: 'get',
        url: 'http://localhost:4000/data',
        success: function (response) {
            let rows = ''
            for(let i=0; i<response.length; ++i) {
                rows += `<tr>
                        <td>${response[i].id}</td>
                        <td>${response[i].timestamp}</td>
                        <td>${response[i].ping}</td>
                        <td>${response[i].download}</td>
                        <td>${response[i].upload}</td>
                        <td>${response[i].result}</td>
                    </tr>`
            }
            $('#history').html(rows)
        },
        error: function (data) {
            console.log(data)
        }
    });
}

const loadServers = () => {
    $.ajax({
        type: 'get',
        url: 'http://localhost:4000/servers',
        success: function (servers) {
            let serverOptions = ''
            for(let i=0; i<servers.length; ++i) {
                serverOptions += `
                    <option value="${servers[i].id}">${servers[i].name}</option>
                    <option disabled>&nbsp;&nbsp;&nbsp;${servers[i].location}, ${servers[i].country}</option>
                `
            }
            $('#selectServer').html(serverOptions)
        },
        error: function (data) {
            console.log(data)
        }
    });
}