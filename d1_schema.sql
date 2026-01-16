-- D1 데이터베이스 테이블 생성

CREATE TABLE IF NOT EXISTS characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  lv INTEGER NOT NULL,
  skill TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 초기 샘플 데이터 삽입
INSERT INTO characters (name, lv, skill) VALUES 
  ('전사', 50, '검술'),
  ('마법사', 45, '파이어볼'),
  ('궁수', 48, '정밀사격'),
  ('힐러', 42, '회복마법'),
  ('도적', 47, '은신');