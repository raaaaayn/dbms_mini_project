CREATE TYPE account_type AS ENUM ('private','public');
CREATE TYPE chat_type AS ENUM ('dm','gp');

CREATE TABLE "user"(
    "username" VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    email VARCHAR(255) NOT NULL,
		profile_pic VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1670353096925-21aef09741fc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDU2fHRvd0paRnNrcEdnfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    account_type account_type,
		PRIMARY KEY("username")
);
ALTER TABLE
    "user" ADD CONSTRAINT user_email_unique UNIQUE(email);

CREATE TABLE posts(
    id BIGSERIAL,
    date DATE NOT NULL,
    number_likes BIGINT NOT NULL,
    number_comments BIGINT NOT NULL,
    poster VARCHAR(255) NOT NULL,
    content VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
		liked_by_post BOOLEAN DEFAULT FALSE,
		PRIMARY KEY(id)
);

CREATE TABLE comments(
    post_id BIGSERIAL,
    commenter VARCHAR(255) NOT NULL,
    comment VARCHAR(255) NOT NULL
);

CREATE TABLE likes(
    post_id BIGINT NOT NULL,
    liked_by VARCHAR(255) NOT NULL,
		PRIMARY KEY(post_id,liked_by)
);

CREATE TABLE chat(
    chat_id BIGINT NOT NULL,
    chat_type chat_type,
		PRIMARY KEY(chat_id)
);

CREATE TABLE message(
    chat_id BIGINT NOT NULL,
    message jsonb NOT NULL
);

CREATE TABLE login_deets(
    "username" VARCHAR(255) NOT NULL,
    hash VARCHAR(255) NOT NULL,
		PRIMARY KEY("username")
);

CREATE TABLE chat_participants(
    chat_id BIGINT NOT NULL,
    participant VARCHAR(255) NOT NULL

);
CREATE TABLE follower_tracker(
    "username" VARCHAR(255) NOT NULL,
    folower VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);

CREATE TABLE following_tracker(
    "username" VARCHAR(255) NOT NULL,
    following VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);

ALTER TABLE
    comments ADD CONSTRAINT comments_commenter_foreign FOREIGN KEY(commenter) REFERENCES "user"("username");
ALTER TABLE
    posts ADD CONSTRAINT posts_poster_foreign FOREIGN KEY(poster) REFERENCES "user"("username");
ALTER TABLE
    comments ADD CONSTRAINT comments_post_id_foreign FOREIGN KEY(post_id) REFERENCES posts(id);
ALTER TABLE
    message ADD CONSTRAINT message_chat_id_foreign FOREIGN KEY(chat_id) REFERENCES chat(chat_id);
ALTER TABLE
    likes ADD CONSTRAINT likes_post_id_foreign FOREIGN KEY(post_id) REFERENCES posts(id);
ALTER TABLE
    likes ADD CONSTRAINT likes_liked_by_foreign FOREIGN KEY(liked_by) REFERENCES "user"("username");
ALTER TABLE
    chat_participants ADD CONSTRAINT chat_participants_chat_id_foreign FOREIGN KEY(chat_id) REFERENCES chat(chat_id);
ALTER TABLE
    chat_participants ADD CONSTRAINT chat_participants_participant_foreign FOREIGN KEY(participant) REFERENCES "user"("username");
ALTER TABLE
    following_tracker ADD CONSTRAINT following_tracker_username_foreign FOREIGN KEY("username") REFERENCES "user"("username");
ALTER TABLE
    following_tracker ADD CONSTRAINT following_tracker_following_foreign FOREIGN KEY(following) REFERENCES "user"("username");
ALTER TABLE
    follower_tracker ADD CONSTRAINT follower_tracker_username_foreign FOREIGN KEY("username") REFERENCES "user"("username");
ALTER TABLE
    follower_tracker ADD CONSTRAINT follower_tracker_folower_foreign FOREIGN KEY(folower) REFERENCES "user"("username");

CREATE PUBLICATION alltables FOR ALL TABLES;
