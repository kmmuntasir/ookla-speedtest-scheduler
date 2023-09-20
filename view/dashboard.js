/* globals Chart:false, feather:false */

let ignoreErrorsInChart = true
let speedtestModal
let history = []

$(document).on('click', '#testButton', () => {
    speedtestModal.show()
});

$(document).on('click', '#testRunButton', () => {
    speedtestModal.hide()
    notify(
        '<h4>Test is running, please wait</h4><p>You will be notified when the test is finished</p>',
        'info'
    )
    const serverId = $('#selectServer').val()
    $.ajax({
        type: 'get',
        url: `http://localhost:4000/speedtest?serverId=${serverId}`,
        success: function (response) {
            if ('success' === response.status) {
                notify(
                    `<h4>Test #${response.testId} is finished</h4>
                        <p>The chart and history table has been updated</p>`,
                    'success'
                )
                history.push(response.testResult)
                addHistoryRow(response.testResult)
                renderHistory()
                drawChart()
            } else {
                console.log('Failed to run')
            }
        },
        error: function (data) {
            console.log('Failed')
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
            history = response
            renderHistory()
            drawChart()
        },
        error: function (data) {
            console.log(data)
        }
    });
}

const renderHistory = () => {
    $('#history').html('')
    for(let i=0; i<history.length; ++i) {
        addHistoryRow(history[i])
    }
}

const addHistoryRow = (speedtest) => {
    if ('' !== speedtest.ping || !ignoreErrorsInChart) {
        const result = isUrl(speedtest.result)
            ? `<a target="_blank" href="${speedtest.result}">${speedtest.result}</a>`
            : speedtest.result
        $('#history').append(`<tr>
        <td>${speedtest.id}</td>
        <td>${speedtest.timestamp}</td>
        <td>${speedtest.ping}</td>
        <td>${speedtest.download}</td>
        <td>${speedtest.upload}</td>
        <td>${result}</td>
    </tr>`)
    }
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

const drawChart = () => {
    'use strict'

    feather.replace({ 'aria-hidden': 'true' })

    // Graphs
    var ctx = document.getElementById('myChart')
    // eslint-disable-next-line no-unused-vars

    const filteredHistory = ignoreErrorsInChart ? history.filter(speedtest => speedtest.ping !== "") : history

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: filteredHistory.map(speedtest => speedtest.timestamp),
            datasets: [
                {
                    label: 'Download Speed (mbps)',
                    data: filteredHistory.map(speedtest => speedtest.download),
                    lineTension: 0,
                    backgroundColor: 'transparent',
                    borderColor: '#007bff',
                    borderWidth: 3,
                    pointBackgroundColor: '#ff0000',
                    pointRadius: 5,
                    pointHoverRadius: 10,
                },
                {
                    label: 'Upload Speed (mbps)',
                    data: filteredHistory.map(speedtest => speedtest.upload),
                    lineTension: 0,
                    backgroundColor: 'transparent',
                    borderColor: '#00ff99',
                    borderWidth: 3,
                    pointBackgroundColor: '#9900ff',
                    pointRadius: 5,
                    pointHoverRadius: 10,
                }
            ],
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            },
            legend: {
                display: true
            },
        }
    })
}

const isUrl = (str) => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

$(document).on('click', '#errorToggle', () => {
    ignoreErrorsInChart = !ignoreErrorsInChart
    if (ignoreErrorsInChart) {
        $('#errorToggle')
            .removeClass('btn-danger')
            .addClass('btn-success')
        $('#errorToggle > span').html('Hidden')
    } else {
        $('#errorToggle')
            .removeClass('btn-success')
            .addClass('btn-danger')
        $('#errorToggle > span').html('Displayed')
    }
    renderHistory()
    drawChart()
})

const notify = (message, status = 'success') => {
    $("#notification")
        .removeClass('alert-success')
        .removeClass('alert-error')
        .addClass(`alert-${status}`)
        .html(message)
        .fadeIn();
    setTimeout(function () {
        $("#notification").fadeOut();
    }, 5000);
}