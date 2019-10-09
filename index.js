require("dotenv").config();
require("babel-register");
require("babel-polyfill");
require("./src/monolithic"); // 비즈니스 로직은 모두 이곳에서 수행
