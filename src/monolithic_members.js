/************************************
 * 회원 관리 기능
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
      return register(method, pathname, params, response => {
        process.nextTick(cb, res, response);
      });
      case "GET":
        console.log('node> request GET member')
        return inquiry(method, pathname, params, response => {
          process.nextTick(cb, res, response);
        });
    case "DELETE":
      return unregister(method, pathname, params, response => {
        process.nextTick(cb, res, response);
      });
    default:
      return process.nextTick(cb, res, null);
  }
};

// ===== 회원 등록
function register(method, pathname, params, cb) {
  var response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success"
  };

  console.log('node> register : ', params);

  // 유효성 검사
  if (params.username === null || params.password === null) {
    response.errorcode = 1;
    response.errormessage = "Invalid Parameters";
    cb(response);
  } else {
    var connection = mysql.createConnection(conn);
    connection.connect();
    connection.query(
      `
      INSERT INTO members(username, password)
      values("${params.username}", password("${params.password}"));
    `,
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

// ===== 회원 인증
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
      SELECT id FROM members
      WHERE username="${params.username}"
      AND password=password("${params.password}");
    `,
      (error, results, fields) => {
        if (error) {
          response.errorcode = 1;
          response.errormessage = error ? error : "invalid password";
        } else {
          response.userid = results[0].id;
        }
        cb(response);
      }
    );
    connection.end();
  }
}

// ===== 회원 탈퇴
function unregister(method, pathname, params, cb) {
  var response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success"
  };
  // console.log('> members unregister : ', params)
  if (params.username === null || params.password === null) {
    response.errorcode = 1;
    response.errormessage = "Invalid Parameters";
    cb(response);
  } else {
    var connection = mysql.createConnection(conn);
    connection.connect();
    connection.query(
      `
      DELETE FROM members WHERE username="${params.username}";
    `,
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
