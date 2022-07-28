CREATE DATABASE personal_library;

CREATE TYPE literary_genre AS ENUM(
    'autobiography', 'fantasy', 'science fiction', 'mystery', 'dystopian',
    'horror', 'romance', 'historical fiction', 'magical realism',
    'contemporary fiction', 'graphic novel', 'young adult',
    'food', 'art', 'self-help', 'history', 'science'
);
CREATE TYPE personal_rating AS ENUM('1', '2', '3', '4', '5');
CREATE TYPE reading_status AS ENUM('unread', 'read');

CREATE TABLE author (
    author_id UUID NOT NULL PRIMARY KEY,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    date_of_birth DATE,
    country_of_birth VARCHAR(150),
    favorite BOOLEAN DEFAULT FALSE
);

CREATE TABLE series (
    series_id UUID NOT NULL PRIMARY KEY,
    series_title VARCHAR(125) NOT NULL,
    number_of_works SMALLINT NOT NULL
);

CREATE TABLE book (
    book_id UUID NOT NULL PRIMARY KEY,
    book_title VARCHAR(255) NOT NULL,
    author_id UUID NOT NULL REFERENCES author (author_id),
    genre literary_genre NOT NULL,
    publication_date DATE NOT NULL,
    publisher VARCHAR(125),
    ISBN VARCHAR(13) NOT NULL UNIQUE,
    series_id UUID REFERENCES series (series_id),
    page_length SMALLINT,
    rating personal_rating,
    reading_status reading_status DEFAULT 'unread',
    start_reading_date DATE,
    end_reading_date DATE
);
