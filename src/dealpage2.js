const router = require('express').Router()
const phantom = require('phantom')
const fs = require('fs')
const path = require('path')
const pageDir = 'cache'

phantom.outputEncoding = 'utf-8'
phantom.scriptEncoding = 'utf-8'

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
            (async function() {
                const instance = await phantom.create()
                const page = await instance.createPage()
                const status = await page.open(req.protocol + '://' + req.headers.host + req.path)
                if (status === 'success') {
                    const content = await page.property('content')
                    res.send(content)
                    fs.writeFile(path.join(__dirname,pageDir,fileName), content,  function(err) {
                        if (err) {
                            return console.error(err)
                        }
                    })
                }
                await instance.exit()
            })();
        }
    })
})

module.exports = router
