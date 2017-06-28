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
    if (filePath != "" && getApi() != false) {
        document.getElementById("scanbtn").value = "Please Wait ..."
        var options = {
            url: 'https://www.virustotal.com/vtapi/v2/file/scan',
            method: 'POST',
            formData: {
                'apikey': getApi(),
                'file': fs.createReadStream(filePath)
            }
        }

        request(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                setResource(JSON.parse(body).resource)
                openResultWindow()
            } else {
                alert("the status code is :" + response.statusCode + " " + error + " " + body)
            }

        })

    } else {
        alert("you must choose file and add your api key !")
    }
}

document.getElementById('setting').onclick = () => {
    const {BrowserWindow} = electron
    let win = new BrowserWindow({
        width: 800,
        height: 300,
        resizable: false,
        autoHideMenuBar: true,
        center: true
    })
    win.on('closed', () => {
        win = null
    })

    win.loadURL(__dirname + '/../setting.html')
}

document.getElementById('exit').onclick = () => {
    app.quit()
}

document.getElementById('mysite').onclick = () => {
    electron.shell.openExternal("http://alshahen.me")
}

function openResultWindow() {
    const {BrowserWindow} = electron
    let win = new BrowserWindow({
        width: 500,
        height: 600,
        resizable: false,
        autoHideMenuBar: true,
        center: true
    })
    win.on('closed', () => {
        win = null
    })

    win.loadURL(__dirname + '/../result.html')

}

function getApi() {
	var env = JSON.parse(fs.readFileSync('.env', 'utf8'))
    if (env.api === '') {
        return false
    } else {
        return env.api
    }
}

function setResource(id) {
	var env = JSON.parse(fs.readFileSync('.env', 'utf8'))
	env.resource = id;
    var file = fs.createWriteStream(".env")
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
