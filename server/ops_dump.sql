-- OPS Bakery Database
-- DROP DATABASE ops; -- ops 삭제 명령어
CREATE DATABASE IF NOT EXISTS ops DEFAULT CHARACTER SET utf8mb4;
USE ops;
show tables;

-- ── 상품 테이블
CREATE TABLE IF NOT EXISTS product (
    pid      INT          PRIMARY KEY AUTO_INCREMENT,
    name     VARCHAR(100) NOT NULL,
    price    INT          NOT NULL,
    category VARCHAR(50),
    edate    VARCHAR(100),
    smethod  VARCHAR(200),
    imgurl   VARCHAR(200),
    icon     VARCHAR(200)
);

-- ── 상품 QnA 테이블
CREATE TABLE IF NOT EXISTS product_qna (
    qid         INT          PRIMARY KEY AUTO_INCREMENT,
    pid         INT          NOT NULL,
    uid         INT,
    title       VARCHAR(200),
    content     TEXT,
    is_complete TINYINT(1)   DEFAULT 0,
    is_lock     TINYINT(1)   DEFAULT 0,
    cdate       DATETIME     DEFAULT NOW(),
    FOREIGN KEY (pid) REFERENCES product(pid)
);

-- ── 회원 테이블
CREATE TABLE IF NOT EXISTS user (
    uid        INT          PRIMARY KEY AUTO_INCREMENT,
    id         VARCHAR(50)  NOT NULL UNIQUE,
    pwd        VARCHAR(200) NOT NULL,
    name       VARCHAR(50)  NOT NULL,
    phone      VARCHAR(20),
    email      VARCHAR(100),
    created_at DATETIME     DEFAULT NOW()
);
-- ── 장바구니 테이블
CREATE TABLE IF NOT EXISTS cart (
    cid   INT PRIMARY KEY AUTO_INCREMENT,
    uid   INT NOT NULL,
    pid   INT NOT NULL,
    count INT NOT NULL DEFAULT 1,
    FOREIGN KEY (uid) REFERENCES user(uid) ON DELETE CASCADE,
    FOREIGN KEY (pid) REFERENCES product(pid)
);

CREATE TABLE IF NOT EXISTS wishlist (
    wid   INT PRIMARY KEY AUTO_INCREMENT,
    uid   INT NOT NULL,
    pid   INT NOT NULL,
    cdate DATETIME DEFAULT NOW(),
    UNIQUE KEY unique_wish (uid, pid),   -- 중복 방지
    FOREIGN KEY (uid) REFERENCES user(uid) ON DELETE CASCADE,
    FOREIGN KEY (pid) REFERENCES product(pid)
);
-- ── 리뷰 테이블
CREATE TABLE IF NOT EXISTS review (
    rid      INT          PRIMARY KEY AUTO_INCREMENT,
    pid      INT          NOT NULL,
    uid      INT          NOT NULL,
    content  TEXT         NOT NULL,
    rating   TINYINT      NOT NULL DEFAULT 5 COMMENT '1~5점',
    cdate    DATETIME     DEFAULT NOW(),
    FOREIGN KEY (pid) REFERENCES product(pid),
    FOREIGN KEY (uid) REFERENCES user(uid) ON DELETE CASCADE
);

-- ── 상품 초기 데이터 (products.js 기준)
-- 패스워드: 1234 -> bcrypt로 암호화된 값(해시값)
INSERT INTO user (id, pwd, name, phone, email) VALUES
("user1", "$2a$10$HboG0qm.mvIKUoXd7zBNy.5YjNerwdX34knmd093YDFdHGrFdhoom", "kim", "01011112222", "0000@gmail.com");
delete from user where id="user1";
select * from user;
INSERT INTO product (name, price, category, edate, smethod, imgurl, icon) VALUES
('갸또 쇼콜라',                '38000', '케이크', '제조일로부터 5일',          '냉장보관',                                            'product1.jpg',  ''),
('쉭쎄',                      '29000', '케이크', '제조일로부터 8일',          '냉장보관',                                            'product2.jpg',  ''),
('초코 구운과자 묶음 (4+1)',    '9200',  '초콜렛', '별도 표기일까지',           '직사광선을 피하고 서늘한 곳 보관',                    'product3.jpg',  'newicon.gif'),
('통팥앙금빵(6EA)',             '13000', '빵',    '별도 표기일까지',           '직사광선을 피하고 서늘한 곳 보관 (하절기 냉장보관)',   'product4.jpg',  ''),
('당근케익',                   '5500',  '케이크', '제조일로부터 5일까지',      '직사광선을 피하고 서늘한 곳 보관 (개봉 후 냉장보관)', 'product5.jpg',  'newicon.gif'),
('애플파이',                   '18000', '빵',    '제조일로부터 5일까지',      '직사광선을 피하고 서늘한 곳 보관 (개봉 후 냉장보관)', 'product6.jpg',  ''),
('카스텔라',                   '18000', '빵',    '제조일로부터 10일까지',     '직사광선을 피하고 서늘한 곳 보관 (하절기 냉장보관)',   'product7.jpg',  ''),
('밤만주 세트',                '17000', '빵',    '제조일로부터 10일까지',     '직사광선을 피하고 서늘한 곳 보관 (하절기 냉장보관)',   'product8.jpg',  ''),
('파인치즈 케익',              '37000', '케이크', '제조일로부터 7일',          '냉장보관',                                            'product9.jpg',  'newicon.gif'),
('다쿠와즈(6EA)',               '14800', '빵',    '제조일로부터 25일',         '직사광선을 피하고 서늘한 곳 보관 (하절기 냉장보관)',   'product10.jpg', 'newicon.gif'),
('브라우니(8EA)',               '18600', '빵',    '제조일로부터 25일',         '직사광선을 피하고 서늘한 곳 보관 (하절기 냉장보관)',   'product11.jpg', 'newicon.gif'),
('아몬드 쇼꼴라 2종',          '6500',  '초콜렛', '제조일로부터 2개월까지',    '직사광선을 피하고 서늘한 곳 보관 (개봉 후 냉장보관)', 'product12.jpg', 'newicon.gif'),
('후랑보아즈',                 '35000', '케이크', '제조일로부터 5일',          '냉장보관',                                            'product13.jpg', 'newicon.gif'),
('스위스롤 & 말차롤케익 [반피스 2종]', '16000', '빵', '제조일로부터 20일',   '직사광선을 피하고 서늘한 곳 보관 (하절기 냉장보관)',   'product14.jpg', 'newicon.gif'),
('따블렛',                     '12000', '초콜렛', '제조일로부터 6개월까지',    '개봉 후 냉장보관',                                    'product15.jpg', 'newicon.gif'),
('바따르',                     '4200',  '빵',    '제조일로부터 5일',          '직사광선을 피하고 서늘한 곳 보관(개봉 후 냉장보관)',   'product16.jpg', 'newicon.gif'),
('뺑 드 세글',                 '8000',  '빵',    '제조일로부터 5일',          '직사광선을 피하고 서늘한 곳 보관(개봉 후 냉장보관)',   'product17.jpg', 'newicon.gif');

 
INSERT INTO review (pid, uid, content, rating) VALUES
(1, 1, '정말 맛있어요! 초콜렛 향이 진하고 식감이 부드럽습니다. 재구매 의사 있어요.', 5),
(1, 1, '선물용으로 샀는데 포장도 예쁘고 맛도 좋았어요. 친구가 너무 좋아했습니다.', 4),
(2, 1, '쉭쎄 처음 먹어봤는데 생각보다 훨씬 맛있어요. 달지 않고 깔끔한 맛이에요.', 5),
(3, 1, '구운과자 묶음인데 가성비가 좋아요. 아이들이 너무 좋아합니다.', 4),
(4, 1, '통팥앙금빵 최고예요! 팥이 가득 들어있고 달달해서 커피랑 잘 어울려요.', 5),
(5, 1, '당근케익 처음 먹어봤는데 당근 특유의 향이 없고 촉촉해서 맛있어요.', 4),
(9, 1, '파인치즈 케익 정말 고급스러운 맛이에요. 치즈향이 진해서 좋아요.', 5),
(9, 1, '생일 케이크로 주문했는데 배송도 빠르고 맛도 훌륭했습니다.', 5);

select * from review;
select * from product;
select * from user;
select * from wishlist where uid=8;
select * from cart where uid = 5;

