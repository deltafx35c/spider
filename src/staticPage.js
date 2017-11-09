const router = require('express').Router()
const phantom = require('phantom')
const fs = require('fs')
const path = require('path')
const pageDir = 'cache'

phantom.outputEncoding = 'utf-8'
phantom.scriptEncoding = 'utf-8'
/* GET home page. */
router.get('*', (req, res, next) => {
    let sitepage = null
    let phInstance = null
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
            phantom.create()
                .then(instance => {
                    phInstance = instance
                    return instance.createPage()
                })
                .then(page => {
                    sitepage = page
                    return page.property('onLoadStarted')
                })
                .then(status => {
                    return sitepage.injectJs('./node_modules/babel-polyfill/dist/polyfill.js')
                })
                .then(status => {
                    return sitepage.open(req.protocol + '://' + req.headers.host + req.path)
                })
                .then(status => {
                    console.log('status is: ' + status)
                    if (status === 'success') {
                        return sitepage.property('content')
                    }
                })
                .then(content => {
                    //console.log(content)
                    res.send(content)
                    fs.writeFile(path.join(__dirname,pageDir,fileName), content,  function(err) {
                        if (err) {
                            return console.error(err)
                        }
                    })
                    sitepage.close()
                    phInstance.exit()
                })
                .catch(error => {
                    console.log(error)
                    phInstance.exit()
                })
        }
    })
})

module.exports = router
