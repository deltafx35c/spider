const express = require('express')
const app = express()
const router = express.Router()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3030

app.set('port', port)

// 过滤静态资源请求
app.use('*',function (req, res, next) {
    if (req.xhr || req.baseUrl.match(/(.js|.css|.ico|.png|.jpg|.jpeg|.gif|.xml|.svg)$/g)) {
        res.status(404).send('Sorry cant find that') 
    } else {
        next()
    }
});

// 处理页面请求
app.use('/', require('./src/dealpage'))

// 设置本地上传文件的静态资源服务
if (process.env.NODE_ENV === "development"){
    app.use(express.static(__dirname + '/dist'))
    console.log('server static resource at '+ __dirname + '/dist')
}

app.listen(port, host)
console.log('app listening at http://%s:%s',host,port)