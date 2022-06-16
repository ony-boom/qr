ALTER TABLE member RENAME members;

-- @block
SELECT * FROM members;

-- @BLOCK

TRUNCATE members;