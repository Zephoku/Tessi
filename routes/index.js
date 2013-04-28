
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { 
        title: 'Tessi'
    });
};


exports.user = function(req, res){
    res.render('user', { 
        title: 'Hey You'
    });
};