const mysql = require("mysql");
const conn = {
  // mysql 설정
  host: "localhost",
  user: "micro",
  password: "service",
  database: "monolithic"
};

/**
 * 상품 등록 기능
 * @param {string} method 메서드
 * @param {string} pathname URI
 * @param {object} params 입력 파라미터
 * @param {function} cb 콜백
 */
const register = (method, pathname, params, cb) => {
  let response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success"
  };

  // 유효성 검사
  if (
    params.name === null ||
    params.category === null ||
    params.price === null ||
    params.description === null
  ) {
    response.errorcode = 1;
    response.errormessage = "Invalid Parameters";
  } else {
    // 커넥션 생성
    const connection = mysql.createConnection(conn);
    // 커넥트
    connection.connect();
    // 쿼리
    connection.query(
      "INSERT INTO goods(name, category, price, description) values(?, ?, ?, ?)",
      [params.name, params.category, params.price, params.description],
      (error, results, fields) => {
        // 에러 처리
        if (error) {
          response.errorcode = 1;
          response.errormessage = error;
        }
        // 콜백 함수 실행
        cb(response);
      }
    );
    // 연결 종료
    connection.end();
  }
};

/**
 * 상품 조회 기능
 * @param {string} method 메서드
 * @param {string} pathname URI
 * @param {object} params 입력 파라미터
 * @param {function} cb 콜백
 */
const inquiry = (method, pathname, params, cb) => {
  let response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success"
  };

  // 커넥션 생성
  const connection = mysql.createConnection(conn);
  // 커넥트
  connection.connect();
  // 쿼리
  connection.query("SELECT * FROM goods", (error, results, fields) => {
    // 에러 처리
    if (error || results.length === 0) {
      response.errorcode = 1;
      response.errormessage = error ? error : "no data";
    } else {
      // 데이터 담기
      response.results = results;
    }
    // 콜백 함수 실행
    cb(response);
  });
  // 연결 종료
  connection.end();
};

/**
 * 상품 삭제 기능
 * @param {string} method 메서드
 * @param {string} pathname URI
 * @param {object} params 입력 파라미터
 * @param {function} cb 콜백
 */
const unregister = (method, pathname, params, cb) => {
  let response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success"
  };

  if (params.id === null) {
    response.error = 1;
    response.errormessage = "Invalid Parameters";
    cb(response);
  } else {
    // 커넥션 생성
    const connection = mysql.createConnection(conn);
    // 커넥트
    connection.connect();
    // 쿼리
    connection.query("DELETE FROM goods WHERE id=?", [params.id], (error, results, fields) => {
      // 에러 처리
      if (error) {
        response.errorcode = 1;
        response.errormessage = error;
      }
      // 콜백 함수 실행
      cb(response);
    });
    // 연결 종료
    connection.end();
  }
};

// ===== 리퀘스트 처리.
exports.onRequest = function(res, method, pathname, params, cb) {
  switch (method) {
    case "POST":
      return register(method, pathname, params, response => {
        process.nextTick(cb, res, response);
      });
    case "GET":
      return inquiry(method, pathname, params, response => {
        process.nextTick(cb, res, response);
      });
    case "DELETE":
      return unregister(method, pathname, params, response => {
        process.nextTick(cb, res, response);
      });
    // 정의 되지 않은 메서드면 null 리턴
    default:
      return process.nextTick(cb, res, null);
  }
};
