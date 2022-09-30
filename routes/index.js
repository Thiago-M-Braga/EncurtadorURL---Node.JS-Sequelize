var express = require('express');
const Link = require('../models/link');
var router = express.Router();

const link = require('../models/link');

//Status
router.get('/:code/stats',async (req, res, next) => {
  const code = req.params.code;
  const resultado = await Link.findOne({code});
  if(!resultado) {
    return res.status(404);
  }
  res.render('stats', resultado.dataValues);
});

router.get('/:code', async (req, res, next) => {
  const code = req.params.code;
  
  const resultado = await Link.findOne({where: {code}});
  if(!resultado) {
    return res.sendStatus(404);
  };
  resultado.hits++;
  await resultado.save();
  res.redirect(resultado.url);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Encurtador' });
});

function generateCode() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(let i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

router.post('/new', async(req,res,next) => { 
  const url = req.body.url;
  const code = generateCode();

  const resultado = await link.create({
    url,
    code
  });

  res.render('stats',resultado.dataValues);
})

module.exports = router;
