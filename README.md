# Video Comment API

## About

Video Comment API is a complete RESTful API for videos and comments. Users may create, update, delete, and view video and comment data. Users must register and enter a password which will allow them to update or delete their data.

## Setup

Coming Soon

## Routes

### GET

#### /api/users/current

Return profile data on current authenticated user

#### /api/users/video/all

Returns all video for authenticated user

#### /api/users/video/:videoID

Returns specific video for authenticated user by videoID

#### /api/users/comment/:videoID/:commentID

Returns specific comment data for authenticated user by videoID and commentID

#### /api/users/comment/:videoID/

Returns all comment data for video by authenticated user via videoID

### POST

#### /api/users/register

Creates a new user

Requires email, password, and password2

#### /api/users/login

User login

Requires email and password

#### /api/users/video

Creates video data for a user

Requires videoTag

#### /api/users/comment/:videoID

Creates a new comment on a particular video

Requires message and timestamp in body, videoID in URL

### PUT

#### /api/users/comment/:videoID/:commentID

Allows user to modify comment on video by videoID and commentID

Requires message property in body

### DELETE

#### /api/users/comment/:videoID/:commentID

Allows user to delete specific comment by videoID and commentID

#### /api/users/video/:videoID/

Allows user to delete specific video by videoID

#### /api/users/:userID

Allows user to delete their own profile - all data erased
