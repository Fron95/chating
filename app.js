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




console.log(process.env)
// process.env.NODE_ENV = 'production'
// app.use(morgan('dev'))
app.set("view engine", "ejs");
app.get('')
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

app.listen(3000)
// app.set('port', process.env.PORT || 8005)
