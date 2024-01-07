module.exports.interpreter = function(req, res){

    const brands = ['samsung','webos','philips','sony','hisense','panasonic','xiaomi','toshiba']

    req.body.date = new Date()
    req.body.ua = req.headers['user-agent']
    req.body.ip = req.socket.remoteAddress.replace('::ffff:','')

    brands.forEach(element => {
        if (req.body.ua.toLowerCase().includes(element))
        req.body.brand=element
    });
    if (!req.body.brand) req.body.brand = 'unknown'

    return true
}
