var electron = require('electron').remote
var app = electron.app
var fs = require('fs')

document.getElementById('apikey').value = getApi()

document.getElementById('save').onclick = () => {
    var api = document.getElementById('apikey').value
    setApi(api)
    alert("Done :)")
}

function getApi() {
    var env = JSON.parse(fs.readFileSync('.env', 'utf8'))
    return env.api
}

function setApi(api) {
    var env = JSON.parse(fs.readFileSync('.env', 'utf8'))
    env.api = api
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
