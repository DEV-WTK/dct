const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'GB4', // 이름
        passwordField: 'GB1', // 학교
        passReqToCallback: true,
      },
      async function (req, GB4, GB1, done) {
        try {
          const user = await User.findOne({
            GB1: GB1.replace(/^\s+|\s+$/g, ''), // 학교
            GB2: String(req.body.GB2).replace(/^\s+|\s+$/g, ''), // 학년
            GB3: String(req.body.GB3).replace(/^\s+|\s+$/g, ''), // 반
            GB4: GB4.replace(/^\s+|\s+$/g, ''), // 이름
          }).lean(); // Mongoose 문서를 일반 JavaScript 객체로 변환

          if (!user) {
            return done(null, false, {
              message: '학생 정보를 찾을 수 없습니다.',
            });
          }
          return done(null, user);
        } catch (err) {
          console.error('사용자 찾기 오류:', err);
          return done(err);
        }
      }
    )
  );

  // 세션에 사용자 정보 저장
  passport.serializeUser((user, done) => {
    try {
      done(null, user._id.toString()); // ObjectId를 문자열로 변환
    } catch (err) {
      console.error('세션 저장 오류:', err);
      done(err);
    }
  });

  // 세션에서 사용자 정보 복원
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).lean(); // lean() 추가
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (err) {
      console.error('세션 복원 오류:', err);
      done(err);
    }
  });
};
