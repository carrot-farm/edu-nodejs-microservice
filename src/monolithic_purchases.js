/************************************
 * 구매 관리
 ************************************/

// ===== db 설정
const mysql = require("mysql");
const conn = {
  host: "localhost",
  user: "micro",
  password: "service",
  database: "monolithic"
};

// ===== 요청 처리
exports.onRequest = (res, method, pathname, params, cb) => {
  switch (method) {
    case "POST":
      return register(res, method, pathname, params, Response => {
        process.nextTick(cb, res, response);
      });
    case "GET":
      return inquiry(res, method, pathname, params, response => {
        process.nextTick(cb, res, response);
      });
    default:
      return process.nextTick(cb, res, null);
  }
};

// ===== 구매
function register(method, pathname, params, cb) {
  var response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success"
  };

  // 유효성 검사
  if (params.userid === null || params.goodsid === null) {
    response.errorcode = 1;
    response.errormessage = "Invalid Parameters";
    cb(response);
  } else {
    var connection = mysql.createConnection(conn);
    connection.connect();
    connection.query(
      `
        INSERT INTO purchases(userid, goodsid)
        VALUES(?, ?);
      `,
      [params.userid, params.goodsid],
      (error, results, fields) => {
        if (error) {
          response.errorcode = 1;
          response.errormessage = error;
        }
        cb(response);
      }
    );
    connection.end();
  }
}

// ===== 구매 내역 조회
function inquiry(method, pathname, params, cb) {
  var response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success"
  };

  if (params.username === null || params.password === null) {
    response.errorcode = 1;
    response.errormessage = "Invalid Parameters";
    cb(response);
  } else {
    var connection = mysql.createConnection(conn);
    connection.connect();
    connection.query(
      `
        SELECT id, goodsid, date FROM purchases
        WHERE userid=?
      `,
      [params.userid],
      (error, results, fields) => {
        if (error) {
          response.errorcode = 1;
          response.errormessage = error;
        } else {
          response.results = results;
        }
        cb(response);
      }
    );
    connection.end();
  }
}
