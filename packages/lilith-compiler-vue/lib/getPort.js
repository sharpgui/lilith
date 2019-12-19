const shell = require('shelljs')
const getPort = (port = 8080) => {
  let isPortSelected = false
  while (!isPortSelected) {
    if (shell.exec(`lsof -i:${port}`).stdout) {
      port++
    } else {
      isPortSelected = true
    }
  }
  return port
}
// let port = getPort(3000)
// console.log(selectedPort)
module.exports = getPort
