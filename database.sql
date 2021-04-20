-- CREATE DATABASE personalblog

CREATE TABLE blogs(
    blog_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description VARCHAR NOT NULL,
    timeCreated DATE NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    image VARCHAR NOT NULL
);

-- \q => to quit from postgresql heroku
-- heroku pg:psql -a namawebapp(personal-blog-rizkyf-api)
-- ALTER TABLE blogs ADD COLUMN image VARCHAR NOT NULL;