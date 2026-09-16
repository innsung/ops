USE ops;

CREATE TABLE IF NOT EXISTS wishlist (
    wid   INT PRIMARY KEY AUTO_INCREMENT,
    uid   INT NOT NULL,
    pid   INT NOT NULL,
    cdate DATETIME DEFAULT NOW(),
    UNIQUE KEY unique_wish (uid, pid),   -- 중복 방지
    FOREIGN KEY (uid) REFERENCES user(uid) ON DELETE CASCADE,
    FOREIGN KEY (pid) REFERENCES product(pid)
);
