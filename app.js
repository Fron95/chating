require('dotenv').config()

const express = require("express");
const app = express();
const routers = require('./routers/router')

const path = require('path')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const nunjucks = require('nunjucks')
const fs = require('fs')





// process.env.NODE_ENV = 'production'
// app.use(morgan('dev'))
app.set("view engine", "ejs");
app.set('port', process.env.PORT || 3000)
app.use(express.static(path.join(__dirname,'/public')))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
  resave : false,
  saveUninitialized : false,
  secret : process.env.COOKIE_SECRET,
  cookie : {
    httpOnly : true,
    secure : false,
    maxAge: 6 * 60 * 60 * 1000    
  }
}))



// 라우터들
app.use(routers)


// 이까지 request가 넘어오면은 라우터가 없는 것으로 인식
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
  error.status = 404
  next(error)
})

// 노드 환경설정을 확인하는 미드웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = process.err.NODE_ENV !== 'production' ? err : {}
  res.status(err.status || 500);
  res.render('error')
})







WebSocket = require('ws')

const server = app.listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);
});
// 서버를 사용하면 같은 포트를 사용하는 것도 가능하다.
const socketServer = new WebSocket.Server({server})
socketServer.on('connection', (ws, req) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log("새로운 클라이언트 접속", ip);

  ws.on("message", (message) => {
    console.log(message.toString());
  });
})


