const fs = require('fs')
const path = require('path')
// 更改 import 语句中的后缀
const filePath = path.join(process.cwd(),'src','JSchema.ts')
let content = fs.readFileSync(filePath, 'utf-8')
content = content.replace('./NiceError.js','./NiceError.ts')
fs.writeFileSync(filePath, content)
process.exit()