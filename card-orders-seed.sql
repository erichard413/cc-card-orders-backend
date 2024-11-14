-- all users have the password "password"

INSERT INTO users (username, password, first_name, last_name, email, join_date, is_admin, is_cc_admin)
VALUES ('user1@user.com',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Erik',
        'Richard',
        'user1@user.com',
        CURRENT_TIMESTAMP,
        FALSE,
        FALSE),
       ('userbankadmin@user.com',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Erik',
        'Richard',
        'userbankadmin@user.com',
        CURRENT_TIMESTAMP,
        TRUE,
        FALSE
        ),
       ('userccadmin@user.com',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Erik',
        'Richard',
        'userccadmin@user.com',
        CURRENT_TIMESTAMP,
        TRUE,
        TRUE
        )