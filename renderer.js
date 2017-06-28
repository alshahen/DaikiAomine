var electron = require('electron').remote
var app = electron.app
var request = require('request')
var fs = require('fs')

document.getElementById('up').onclick = () => {
    const {dialog} = electron
    dialog.showOpenDialog(function(path) {
        document.getElementById("up").value = path
    })
}

document.getElementById('scanbtn').onclick = () => {
    var filePath = document.getElementById("up").value
    if (filePath != "" && readApi() != false) {
        document.getElementById("scanbtn").value = "Please Wait ..."
        var options = {
            url: 'https://www.virustotal.com/vtapi/v2/file/scan',
            method: 'POST',
            formData: {
                'apikey': readApi(),
                'file': fs.createReadStream(filePath)
            }
        }

        request(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                saveResource(JSON.parse(body).resource)
                openResultWindow()
            } else {
                alert("the status code is :" + response.statusCode + " " + error + " " + body)
            }

        })

    } else {
        alert("you must choose file and add your api key !")
    }
}

document.getElementById('exitbtn').onclick = () => {
    app.quit()
}

document.getElementById('mysite').onclick = () => {
    electron.shell.openExternal("http://alshahen.me")
}

function openResultWindow() {
    const {
        BrowserWindow
    } = require('electron').remote;
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        autoHideMenuBar: true,
        center: true
    })
    win.on('closed', () => {
        win = null
    })

    win.loadURL(__dirname + '/result.html')

}

function readApi() {
	var env = JSON.parse(fs.readFileSync('env.json', 'utf8'))
    if (env.api === '') {
        return false
    } else {
        return env.api
    }
}

function saveResource(id) {
	var env = JSON.parse(fs.readFileSync('env.json', 'utf8'))
	env.resource = id;
    var file = fs.createWriteStream("env.json")
    file.once('open', function(ofile) {
        file.write(JSON.stringify(env))
        file.end()
    });
}

document.ondragover = document.ondrop = (ev) => {
    ev.preventDefault()
}
document.body.ondrop = (ev) => {
    ev.preventDefault()
}
