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
    $.ajax({
        type: 'get',
        url: 'http://localhost:4000/speedtest',
        success: function (response) {
            console.log(response)
            if ('success' === response.status) {
                alert(`New Test Scheduled: ${response.testId}`)
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
    $.ajax({
        type: 'get',
        url: 'http://localhost:4000/data',
        success: function (response) {
            console.log(response)
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
});