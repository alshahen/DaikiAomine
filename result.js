var electron = require('electron').remote
var app = electron.app
var request = require('request')
var fs = require('fs')
var sleep = require('sleep-async')()
getResult()

function getResult() {
    var options = {
        url: 'https://www.virustotal.com/vtapi/v2/file/report',
        method: 'POST',
        formData: {
            'apikey': readApi(),
            'resource': readResource()
        }
    }

    reqapi = request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            data = JSON.parse(body)
            document.getElementById("title").innerHTML = 'Result : <span class="label label-warning">' + data.verbose_msg + '</span>'


            if (data.verbose_msg != "Scan finished, information embedded") {
                sleep.sleep(60000, function() {
                    getResult()
                });

            } else {
                document.getElementById("title").innerHTML = 'Result : <span class="label label-success">' + data.verbose_msg + '</span>'
                var obj = data.scans
                var t = document.getElementById("result_table")
                for (x in obj) {
                    var addRow = t.insertRow(1)
                    var vname = addRow.insertCell(0)
                    var result = addRow.insertCell(1)
                    vname.innerHTML = x
                    if (obj[x].detected) {
                        result.innerHTML = '<span class="label label-danger">' + obj[x].result + '</span>'
                    } else {
                        result.innerHTML = '<span class="label label-success">Clean</span>'
                    }
                }


            }

        } else {
            alert("the status code is :" + response.statusCode + " " + error + " " + body)
        }

    })
}


function readApi() {
    var env = JSON.parse(fs.readFileSync('env.json', 'utf8'))
    if (env.api === '') {
        return false
    } else {
        return env.api
    }
}

function readResource() {
    var env = JSON.parse(fs.readFileSync('env.json', 'utf8'))
    if (env.resource === '') {
        alert("resource id null !")
    } else {
        return env.resource
    }
}


document.ondragover = document.ondrop = (ev) => {
    ev.preventDefault()
}
document.body.ondrop = (ev) => {
    ev.preventDefault()
}
