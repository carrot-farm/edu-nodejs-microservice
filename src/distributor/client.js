"use strict";
/** ========================================
 * 접속, 데이터 수신, 데이터 발송 기능 구성
 * . 자식 클래스는 접속, 데이터 발송 함수에만 접근 가능.
 ======================================== */
const net = requrie("net");

class tcpClient {
  // ===== 생성자
  constructor(host, port, onCreate, onRead, onEnd, onError) {
    // 접속 정보
    this.options = {
      host,
      port
    };
    this.onCreate = onCreate; // 접속 완료 콜백 함수
    this.onRead = onRead; // 데이터 수신 콜백 함수
    this.onEnd = onEnd; // 접속 종료 콜백 함수
    this.onError = onError; // 에러 발생 시 콜백함수
  }

  // ===== 메소드 : 연결
  connect() {
    //  접속
    this.client = net.connect(this.options, () => {
      // 접속 완료 시 콜백
      if (this.onCreate) {
        this.onCreate(this.options);
      }
    });

    // 데이터 수신
    // '||'문자를 패킷의 끝에 붙여서 여러 패킷을 한번에 받은뒤 구분한다.
    this.client.on("data", data => {
      const sz = this.merge ? this.merge + data.toString() : data.toString();
      const arr = sz.split("||");
      for (const n in arr) {
        if (sz.charAt(sz.length - 1) != "||" && n === arr.length - 1) {
          this.merge = arr[n];
          break;
        } else if (arr[n] === "") {
          break;
        } else {
          this.onRead(this.options, JSON.parse(arr[n]));
        }
      }
    });

    // 접속 종료 처리.
    this.client.on("close", () => {
      if (this.onEnd) {
        this.onEnd(this.options);
      }
    });

    // 에러 발생 처리
    this.client.on("error", err => {
      if (this.onError) {
        this.onError(this.options, err);
      }
    });
  }

  // ===== 메소드 : 데이터 발송
  write(packet) {
    this.client.write(JSON.stringify(packet) + "||");
  }
}

export default tcpClient;
