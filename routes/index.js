
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { 
        title: 'CodeOn', 
        search1: 'Show',
        search2: 'Learn'
    });
};

