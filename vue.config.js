// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
module.exports = {
    pages: {
        index:{
            entry: "./src/views/index/index.js",
            template: "./src/views/index/index.html",
            filename: "index.html"
        },
        hall:{
            entry: "./src/views/hall/hall.js",
            template: "./src/views/hall/hall.html",
            filename: "hall.html"
        }
    }
}