# OPS - 베이커리 쇼핑몰

상품 탐색부터 장바구니, 찜, 리뷰와 테스트 결제까지 연결한 4인 팀 쇼핑몰 프로젝트입니다. React 화면과 Express API를 연동하고, MySQL로 회원·상품·장바구니·찜·리뷰 데이터를 관리합니다.

## 프로젝트 정보

- 기간: 2026.05.11 - 2026.05.26
- 형태: 4인 팀 프로젝트
- 담당: 백엔드 개발, 회원·상품·장바구니·찜·리뷰 중심의 DB 테이블 생성

## 시연영상

[▶ OPS 주요 기능 시연영상 보기 (3분 46초)](https://www.youtube.com/watch?v=85hDe1atBrk)

회원가입·로그인, 상품 탐색, 장바구니, 찜, 리뷰와 KakaoPay 테스트 결제 흐름을 확인할 수 있습니다.

## 주요 기능

- 회원가입, bcrypt 비밀번호 해시와 JWT 기반 로그인
- 상품 목록·상세 정보 조회
- 장바구니 상품 추가·삭제와 수량 변경
- 회원별 찜 목록 조회와 상품 추가·삭제
- 상품 리뷰 작성·조회와 평점 표시
- KakaoPay 테스트 결제 준비·승인과 결과 화면 이동

## 서비스 흐름

```text
React 화면
  → Axios / API 요청
  → Vite 개발 프록시
  → Express 라우터·컨트롤러
  → Repository의 SQL 실행 / MySQL
  → 회원·상품·장바구니·찜·리뷰 응답

결제 요청
  → Express 결제 준비 API
  → KakaoPay 테스트 결제 화면
  → 서버 승인 콜백
  → 프론트엔드 결제 결과 화면
```

## 데이터베이스 설계

- `user.id`에 UNIQUE 제약조건을 적용해 로그인 ID 중복 방지
- `wishlist (uid, pid)`에 UNIQUE 제약조건을 적용해 같은 상품의 중복 찜 방지
- 장바구니·찜·리뷰에서 회원과 상품을 외래키로 연결
- 장바구니와 상품 테이블을 JOIN해 상품명·가격·수량을 함께 조회

```text
user 1 ── N cart N ── 1 product
user 1 ── N wishlist N ── 1 product
user 1 ── N review N ── 1 product
```

## 기술 스택

| 구분 | 기술 |
|---|---|
| Front | React 18, Vite, React Router, Redux Toolkit, Axios |
| Back | Node.js, Express, JWT, bcryptjs |
| DB | MySQL, mysql2 |
| Payment | KakaoPay API (테스트 결제) |
| Tool | Git, GitHub, VS Code, MySQL Workbench |

## 프로젝트 구조

```text
front/src/pages/       페이지 화면
front/src/components/  공통 UI 컴포넌트
front/src/utils/       API 호출 등 공통 유틸리티
front/src/store.js     Redux 상태 관리
server/routes/        API 경로
server/controller/    요청 처리와 인증·결제 연동
server/repository/    SQL 조회와 데이터 접근
server/db/            MySQL 연결
server/ops_dump.sql   테이블 정의와 개발용 데이터·쿼리
```

## 실행 방법

Node.js와 MySQL이 설치된 로컬 환경을 기준으로 합니다. 아래 명령은 저장소 루트에서 시작하며, 서버와 프론트엔드는 각각 별도 터미널에서 실행합니다.

### Database

MySQL Workbench에서 `server/ops_dump.sql`의 DB·테이블 생성 구문을 먼저 실행합니다. 서버 시작 시 테이블을 자동으로 생성하지 않습니다.

이 파일에는 개발 중 사용한 회원 삭제문과 초기 데이터 INSERT가 함께 포함되어 있으므로 전체를 일괄 실행하지 않습니다. 필요한 구문을 선택해 실행하고 다음을 확인합니다.

- 상품 초기 데이터는 중복 INSERT하지 않습니다.
- 리뷰 데이터의 `uid`, `pid`는 실제 존재하는 회원·상품 ID에 맞춥니다.
- 시연 계정은 화면의 회원가입 기능으로 생성할 수 있습니다.

### Backend

`server/.env` 파일을 생성하고 로컬 환경에 맞게 설정합니다.

```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ops
DB_PORT=3306
SERVER_PORT=9000
CLIENT_ORIGIN=http://localhost:3000
SERVER_URL=http://localhost:9000
ACCESS_SECRET=replace_with_a_random_access_secret
REFRESH_SECRET=replace_with_a_different_random_refresh_secret
ACCESS_EXPIRES=15m
REFRESH_EXPIRES=7d
KAKAO_SECRET_KEY=your_kakaopay_test_secret_key
```

```powershell
cd server
npm install
npm start
```

KakaoPay 테스트 결제에는 테스트용 Secret Key와 개발자 콘솔의 도메인·리디렉션 설정이 필요합니다. 서버는 테스트 CID `TC0ONETIME`을 사용합니다. 환경변수를 수정한 뒤에는 서버를 재시작합니다.

### Frontend

```powershell
cd front
npm install
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:9000`
- 프론트엔드의 `/api` 요청은 Vite 개발 프록시를 통해 백엔드로 전달됩니다.

## 구현 범위

시연은 회원·상품·장바구니·찜·리뷰와 테스트 결제 흐름을 중심으로 구성했습니다. 관리자·커뮤니티·상품 문의는 추가 보완 대상입니다. 현재 결제 정보는 서버 메모리에서 임시 관리하며, 주문 내역의 DB 저장과 결제 후 장바구니 자동 정리는 구현하지 않았습니다.

> 실제 데이터베이스 비밀번호, JWT Secret, 결제 API 키와 `.env` 파일은 Git에 커밋하지 않습니다.
