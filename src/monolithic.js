const http = require("http");
const url = require("url");
const querystring = require("querystring");
const members = require("./monolithic_members.js");
const goods = require("./monolithic_goods.js");
const purchases = require("./monolithic_purchases.js");

const server = http
  .createServer((req, res) => {
    const method = req.method; // 메서드를 얻기
    const uri = url.parse(req.url, true); // uri 파싱
    const pathname = uri.pathname; // uri 얻기

    // 파라메터 얻기
    if (method === "POST" || method === "PUT") {
      let body = "";
      // 기본 처리.
      req.on("data", function(data) {
        body += data;
      });

      // json 일 경우 처리
      req.on("end", function() {
        let params;
        if (req.headers["content-type"] === "application/json") {
          params = JSON.parse(body);
        } else {
          params = querystring.parse(body);
        }

        onRequest(res, method, pathname, params);
      });
    } else {
      // GET 과 DELETE 면 query 정보를 읽음.
      onRequest(res, method, pathname, uri.query);
    }
    console.log("> start Server 8000");

  })
  .listen(8000);

/**
 * 요청에 대해 회원 관리, 상품 관리, 구매 관리 모듈별로 분기
 * @param {object} res       response 객체
 * @param {string} method    메서드
 * @param {string} pathname  URI
 * @param {string} params     입력 파라메터
 */
function onRequest(res, method, pathname, params) {
  // uri 별 요청 처리.
  switch (pathname) {
    case "/members":
      members.onRequest(res, method, pathname, params, response);
      break;
    case "/goods":
      goods.onRequest(res, method, pathname, params, response);
      break;
    case "/purchases":
      purchases.onRequest(res, method, pathname, params, response);
      break;
    default:
      res.writeHead(404);
      return res.end();
  }
}

/**
 * HTTP 헤더에 JSON 형식으로 응답
 * @param {*} res    response 객체
 * @param {*} packet 결과 파라메터
 */
function response(res, packet) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(packet));
}
