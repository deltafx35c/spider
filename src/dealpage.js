const router = require('express').Router()
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const pageDir = 'cache'

// 处理爬虫页面请求
router.get('*', (req, res, next) => {
    // 根据url地址生成缓存文件名
    let fileName = (req.headers.host + req.path).replace(/\/|\:/g,'_')
    // 判断是否已存在缓存文件
    fs.exists(path.join(__dirname,pageDir,fileName), function(exists) {
        if(exists){
            // 已存在缓存时直接读取缓存文件内容返回给爬虫
            fs.readFile(path.join(__dirname,pageDir,fileName), function(err,data) {
                if (err) {
                    return console.error(err)
                }
                res.send(data.toString())
            })
        } else {
            // 无缓存文件时，启动headless chrome，请求获取实时页面内容，返回给爬虫，并写入缓存文件
            (async () => {
                const browser = await puppeteer.launch({args: ['--no-sandbox', '--headless']})
                const page = await browser.newPage()
                await page.goto(req.protocol + '://' + req.headers.host + req.path)
                const content = await page.content()
                fs.writeFile(path.join(__dirname,pageDir,fileName), content,  function(err) {
                    if (err) {
                        return console.error(err)
                    }
                })
                res.send(content)
                await browser.close()
            })()
        }
    })
})

module.exports = router
