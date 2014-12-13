
var viewOptions = {
  root: './public/views',
  dotfiles: 'deny'
};

module.exports = function(app) {

  // add more routes here

  app.get('*', function(req, res) {
    res.sendFile('index.html', viewOptions);
  });
};





