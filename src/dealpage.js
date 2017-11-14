const router = require('express').Router()
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const pageDir = 'cache'

/* GET home page. */
router.get('*', (req, res, next) => {
    let fileName = (req.headers.host + req.path).replace(/\/|\:/g,'_')
    fs.exists(path.join(__dirname,pageDir,fileName), function(exists) {
        if(exists){
            fs.readFile(path.join(__dirname,pageDir,fileName), function(err,data) {
                if (err) {
                    return console.error(err)
                }
                res.send(data.toString())
            })
        } else {
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
