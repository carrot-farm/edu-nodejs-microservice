/*************************
 * 테스트
*************************/
const http = require('http');

// ===== 요청 설정
const options = {
  host: "127.0.0.1",
  port: 8000,
  headers: {
    "Content-Type": "application/json"
  }
};

/**
 * 리퀘스트 함수 정의
 * .param {func} cb
 * .param {object} params
 */
function request(cb, params) {
  // 리퀘스트
  const req = http.request(options, res => {
    let data = "";
    res.on("data", chunk => {
      data += chunk;
      console.log("> res data : ", data);
    });

    // 통신 완료
    res.on("end", () => {
      console.log("> res.end : ", options, data);
      cb();
    });
  });

  // 요청이 POST이거나 PUT 형식이면 스트링 형식으로 전송.
  if (params) {
    req.write(JSON.stringify(params));
  }

  req.end();
}

/**
 * 상품관리 테스트 실행 함수
 * .param {func} callback
 */
function goods(callback) {
  goods_post(() => {
    goods_get(() => {
      goods_delete(callback);
    });
  });

  function goods_post(cb) {
    options.method = "POST";
    options.path = "/goods";
    request(cb, {
      name: "test goods",
      category: "tests",
      price: 1000,
      description: "test"
    });
  }

  function goods_get(cb) {
    options.method = "GET";
    options.path = "/goods";
    request(cb);
  }

  function goods_delete(cb) {
    options.method = "DELETE";
    options.path = "/goods?id=1";
    request(cb);
  }
}

/**
 * 회원 관리 API 테스트 함수
 * @param {func} callback
 */
function members(callback) {
  // members_delete(() => {
  //   members_post(() => {
  //     members_get(callback);
  //   });
  // });
  members_get(callback);

  // 멤버 생성
  function members_post(cb) {
    options.method = "POST";
    options.path = "/members";
    request(cb, {
      username: "test_account",
      password: "1234",
      passwordConfirm: "1234"
    });
  }

  // 맴버 목록
  function members_get(cb) {
    options.method = "GET";
    options.path = "/members?username=test_account&password=1234";
    request(cb);
  }

  // 멤버 삭제
  function members_delete(cb) {
    options.method = "DELETE";
    options.path = "/members?username=test_account";
    request(cb);
  }
}

/**
 * 구매 관리 API 테스트 함수
 * @param {func} callback
 */
function purchases(callback) {
  purchases_post(() => {
    purchases_get(callback);
  });

  function purchases_post(cb) {
    options.method = "POST";
    options.path = "/purchases";
    request(cb, {
      userid: 1,
      goodsid: 1
    });
  }

  function purchases_get(cb) {
    options.method = "GET";
    options.path = "/purchases?userid=1";
    request(cb);
  }
}

// ===== 테스트 코드 실행
console.log("> members ============ ");
members(() => {
  // console.log("> goods ============ ");
  // goods(() => {
  //   console.log("> purcharses ============ ");
  //   purchases(() => {
  //     console.log("> done");
  //   });
  // });
});
