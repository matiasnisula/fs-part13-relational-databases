CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INT DEFAULT 0
);

INSERT INTO blogs (author, url, title)
values ('Dan Abramov', 'www.danabramov.com', 'On let vs const');

INSERT INTO blogs (author, url, title)
values ('Laurenz Albe', 'www.laurenzalbe.com', 'Gaps in sequences in PostgreSQL');