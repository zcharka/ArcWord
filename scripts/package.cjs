const packager = require('@electron/packager')
const path = require('path')
const fs = require('fs')

async function run() {
  const rootDir = path.resolve(__dirname, '..')
  const buildExeDir = path.join(rootDir, 'build-exe')

  // Clean build-exe directory before packaging so it does not get copied into app.asar
  if (fs.existsSync(buildExeDir)) {
    console.log('Cleaning build-exe directory...')
    fs.rmSync(buildExeDir, { recursive: true, force: true })
  }

  console.log('Packaging Electron application with @electron/packager...')
  const appPaths = await packager.packager({
    dir: rootDir,
    name: 'ArcWord',
    platform: 'win32',
    arch: 'x64',
    out: 'build-exe',
    overwrite: true,
    asar: true,
    prune: true,
    ignore: [
      /^[/\\]build-exe/,
      /^[/\\]installer/,
      /^[/\\]\.git/,
      /^[/\\]dist-electron/,
      /^[/\\]scripts/,
    ],
  })

  console.log('Packager completed successfully:', appPaths)
}

run().catch(err => {
  console.error('Packaging failed:', err)
  process.exit(1)
})
