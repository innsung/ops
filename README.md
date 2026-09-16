# ops
팀 프로젝트


## 2026-05-20
# server 폴더 생성, 각종 모듈 다운, 초기 환경 설정, 회원가입(users) 테이블 생성
1) app.js 추가
    -> 포트 변수명 : PORT
    -> .env 파일 포트 설정시 변수명 PORT로 설정

2) .gitignore추가
    -> git clone 할 때 마다 .env 파일 추가, npm install 하기

3) routes, controller, repository 폴더 생성

4) db 폴더 생성 -> connection.js 파일 생성
    -> db 명 ops

5) 회원가입(users) 테이블 생성
    -> front에서 겹치는 부분 일부 삭제 예정(회원가입 페이지 하단 지역 삭제 예정)


DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ops
DB_PORT=3306

SERVER_PORT=9000
JWT_SECRET=your_jwt_secret

# JWT 토큰 설정 (Shoppy 패턴)
ACCESS_SECRET=your_access_secret
REFRESH_SECRET=your_refresh_secret
ACCESS_EXPIRES=15m
REFRESH_EXPIRES=7d

# 프론트 주소 (CORS)
# CLIENT_ORIGIN=http://localhost:3000

# 카카오페이
KAKAO_SECRET_KEY=your_kakao_secret_key
# SERVER_URL=http://localhost:9000

SERVER_URL=http://192.168.자기IP:9000
CLIENT_ORIGIN=http://192.168.자기IP:3000

## 2026-05-28 env 파일 수정 내용

DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ops
DB_PORT=3306

SERVER_PORT=9000
JWT_SECRET=ops_jwt_secret_key_change_this

# JWT 토큰 설정 (Shoppy 패턴)
ACCESS_SECRET=ops_access_secret_key_change_this
REFRESH_SECRET=ops_refresh_secret_key_change_this
ACCESS_EXPIRES=15m
REFRESH_EXPIRES=7d

# 프론트 주소 (CORS)
# CLIENT_ORIGIN=http://localhost:3000

# 카카오페이
KAKAO_SECRET_KEY=your_kakao_secret_key
# SERVER_URL=http://localhost:9000

SERVER_URL=http://localhost:9000
CLIENT_ORIGIN=http://localhost:3000