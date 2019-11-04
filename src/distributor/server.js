"use strict";

import net from "net";
import tcpClient from "./client";

class tcpServer {
  // ===== 생성자
  constructor(name, port, urls) {
    // 서버 정보
    this.context = {
      port,
      name,
      urls
    };
    this.merge = {};

    // 서버 생성
    this.server = net.createServer(socket => {
      // 클라이언트 접속 이벤트 처리
      this.onCreate(socket);

      // 에러 이벤트 처리.
      socket.on("error", exception => {
        this.onClose(socket);
      });

      // 클라이언트 접속 종료 이벤트 처리
      socket.on("close", () => {
        this.onClose(socket);
      });

      // 데이터 수신 처리
      socket.on("data", data => {
        const key = `${socket.remoteAddress}:${socket.remotePort}`;
      });
    });
  }
}

export default tcpServer;
