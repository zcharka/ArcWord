const innosetupCompiler = require('innosetup-compiler')
const path = require('path')

const issPath = path.resolve(__dirname, '../installer.iss')

console.log('Compiling Inno Setup script:', issPath)

innosetupCompiler(issPath, { gui: false, verbose: true }, function (error) {
  if (error) {
    console.error('Inno Setup compilation error:', error)
    process.exit(1)
  }
  console.log('Successfully created Windows installer ArcWord-Setup.exe!')
})
