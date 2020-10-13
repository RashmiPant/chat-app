let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.locals.user = req.session.user;
  res.render('index', { title: 'Chat App' });
});

router.post('/', function (req, res) {
  res.locals.user = req.session.user = req.body.username;
  res.redirect("/")
});

router.get("/status", function (req, res) {
  unreadCount = 0;
  let lastReceivedMsg = {};
  let name = "";
  users.forEach(user => {
    if (user.id == req.cookies.io) name =user.name;
  })
  messages.forEach(msg => {
      if(msg.to == name){
        if(msg.readStatus == false) unreadCount++;
        lastReceivedMsg[msg.from] = msg.msg;
      }
      else if(msg.to=="Group") {
        if(msg.readStatus == false) unreadCount++;
        lastReceivedMsg[`${msg.to}:${msg.from}`] = msg.msg;
      }
  });
  res.json({ lastReceivedMsg, unreadCount })
})
module.exports = router;
