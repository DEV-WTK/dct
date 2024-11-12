require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const nunjucks = require('nunjucks');
const path = require('path');

const app = express();

// Nunjucks 설정
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true,
});
app.set('view engine', 'html');

// 데이터베이스 연결
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 미들웨어 설정
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'qwer1234!',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24시간
    },
  })
);
// Flash 미들웨어 설정
app.use(flash());

// Passport 설정
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// 전역 변수 설정
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// 라우트
app.get('/', (req, res) => {
  //res.render('login.html');
  res.render('index.html');
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error_msg', info.message);
      return res.redirect('/');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});

app.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      console.error('로그아웃 에러:', err);
      return next(err);
    }
    req.flash('success_msg', '로그아웃 되었습니다.');
    res.redirect('/');
  });
});

app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error_msg', '로그인이 필요합니다.');
    return res.redirect('/');
  }
  res.render('dashboard.html', { user: req.user });
});

// 테스트용 사용자 생성 라우트
app.post('/register', async (req, res) => {
  try {
    const { GB1, GB2, GB3, GB4 } = req.body;
    const newUser = new User({
      GB1, // 학교
      GB2: Number(GB2), // 학년
      GB3: Number(GB3), // 반
      GB4, // 이름
    });
    await newUser.save();
    req.flash('success_msg', '사용자가 등록되었습니다.');
    res.redirect('/');
  } catch (err) {
    req.flash('error_msg', '등록 중 오류가 발생했습니다.');
    res.redirect('/');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
