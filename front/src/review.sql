USE ops;

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

-- ── 더미 리뷰 데이터
INSERT INTO review (pid, uid, content, rating) VALUES
(1, 1, '정말 맛있어요! 초콜렛 향이 진하고 식감이 부드럽습니다. 재구매 의사 있어요.', 5),
(1, 1, '선물용으로 샀는데 포장도 예쁘고 맛도 좋았어요. 친구가 너무 좋아했습니다.', 4),
(2, 1, '쉭쎄 처음 먹어봤는데 생각보다 훨씬 맛있어요. 달지 않고 깔끔한 맛이에요.', 5),
(3, 1, '구운과자 묶음인데 가성비가 좋아요. 아이들이 너무 좋아합니다.', 4),
(4, 1, '통팥앙금빵 최고예요! 팥이 가득 들어있고 달달해서 커피랑 잘 어울려요.', 5),
(5, 1, '당근케익 처음 먹어봤는데 당근 특유의 향이 없고 촉촉해서 맛있어요.', 4),
(9, 1, '파인치즈 케익 정말 고급스러운 맛이에요. 치즈향이 진해서 좋아요.', 5),
(9, 1, '생일 케이크로 주문했는데 배송도 빠르고 맛도 훌륭했습니다.', 5);
