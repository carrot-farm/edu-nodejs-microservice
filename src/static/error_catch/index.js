// ===== 별도의 스레드에서 동작하는 콜백함수.
function func(callback){
  process.nextTick(callback, 'callback !!');
}

// ===== 에러 발생 시.
try{
  func((param) => {
    // 의도적 에러 발생
    a.a = 0;
  });
}catch(e){
  // nextTick 사용시 에러 캐치가 되지 않는다.
  console.log('> exception!!');
}

// ===== 모든 스레드에서 발생하는 예외 처리
process.on('uncaughtException', (error) => {
  console.log('> uncaughtException ~~');
})
