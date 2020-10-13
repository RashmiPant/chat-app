// let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let session = require('express-session')

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let app = express();
const chatServer = require('http').createServer(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'sessi0nS3cr3t',
  saveUninitialized: true,
  resave: false
}))

global.users = [{name: "Group"}];
global.messages = [];
const io = require('socket.io')(chatServer);

io.use((socket, next) => {
  let token = socket.handshake.query.username;
  if (token) {
    return next();
  }
  return next(new Error('authentication error'));
});

io.on('connection', (client) => {
  let token = client.handshake.query.username;
  
  client.on('disconnect', () => {
    let clientid = client.id;
    for (let i = 0; i < users.length; i++)
      if (users[i].id && users[i].id == clientid) {
        users.splice(i, 1);
        break;
      }
  });
  users.push({
    id: client.id,
    name: token
  });
  
  client.on('message', (data) => {
    messages.push(data)
    // console.log(messages)
    io.emit("message", data)
  });

  client.on("msgRead", (data) =>{
    messages.forEach(msg => {
      if(msg.to == data.name) msg.readStatus = true;
    });
  })
  io.emit("newuser", {
    id: client.id,
    name: token
  })
});
chatServer.listen(3000);

app.use('/', indexRouter);
app.use('/users', usersRouter);