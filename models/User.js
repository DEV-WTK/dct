// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // _id
  GB1: { type: String, required: true }, // 학교
  GB2: { type: String, required: true }, // 학년
  GB3: { type: String, required: true }, // 반
  GB4: { type: String, required: true }, // 이름
  Q11_2: { type: String, required: false }, // Q11_2
  Q11_3: { type: String, required: false }, // Q11_3
  Q11_4: { type: String, required: false }, // Q11_4
  Q11_7: { type: String, required: false }, // Q11_7
  Q11_8: { type: String, required: false }, // Q11_8
  Q11_9: { type: String, required: false }, // Q11_9
  Q11_10: { type: String, required: false }, // Q11_10
  TOTAL: { type: String, required: false }, // TOTAL
  TOTA_1: { type: String, required: false }, // TOTA_1
  TOTA_2: { type: String, required: false }, // TOTA_2
  TOTA_3: { type: String, required: false }, // TOTA_3
  TOTA: { type: String, required: false }, // TOTA
  TOTB_1: { type: String, required: false }, // TOTB_1
  TOTB_2: { type: String, required: false }, // TOTB_2
  TOTB_3: { type: String, required: false }, // TOTB_3
  TOTB: { type: String, required: false }, // TOTB
  TOT: { type: String, required: false }, // TOT
  SJ_A: { type: String, required: false }, // SJ_A
  SJ_B: { type: String, required: false }, // SJ_B
  SJ: { type: String, required: false }, // SJ
});

module.exports = mongoose.model('User', userSchema);
