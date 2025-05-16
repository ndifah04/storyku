# Dicoding Story API

API untuk berbagi story seputar Dicoding, mirip seperti post Instagram namun khusus untuk Dicoding.

## Endpoint

```
https://story-api.dicoding.dev/v1
```

## Register

**URL:** `/register`

**Method:** `POST`

**Request Body:**

```json
{
  "name": "string",
  "email": "string (must be unique)",
  "password": "string (min 8 characters)"
}
```

**Response:**

```json
{
  "error": false,
  "message": "User Created"
}
```

---

## Login

**URL:** `/login`

**Method:** `POST`

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "error": false,
  "message": "success",
  "loginResult": {
    "userId": "user-yj5pc_LARC_AgK61",
    "name": "Arif Faizin",
    "token": "<JWT_TOKEN>"
  }
}
```

---

## Add New Story

**URL:** `/stories`

**Method:** `POST`

**Headers:**

```
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Request Body:**

```
description: string
photo: file (max size 1MB, valid image)
lat: float (optional)
lon: float (optional)
```

**Response:**

```json
{
  "error": false,
  "message": "success"
}
```

---

## Add New Story with Guest Account

**URL:** `/stories/guest`

**Method:** `POST`

**Request Body:**

```
description: string
photo: file (max size 1MB, valid image)
lat: float (optional)
lon: float (optional)
```

**Response:**

```json
{
  "error": false,
  "message": "success"
}
```

---

## Get All Stories

**URL:** `/stories`

**Method:** `GET`

**Headers:**

```
Authorization: Bearer <token>
```

**Parameters:**

```
page: int (optional)
size: int (optional)
location: 1 | 0 (optional, default: 0)
  - 1: Get all stories with location
  - 0: Get all stories without considering location
```

**Response:**

```json
{
  "error": false,
  "message": "Stories fetched successfully",
  "listStory": [
    {
      "id": "story-FvU4u0Vp2S3PMsFg",
      "name": "Dimas",
      "description": "Lorem Ipsum",
      "photoUrl": "https://story-api.dicoding.dev/images/stories/photos-1641623658595_dummy-pic.png",
      "createdAt": "2022-01-08T06:34:18.598Z",
      "lat": -10.212,
      "lon": -16.002
    }
  ]
}
```

---

## Get Story Detail

**URL:** `/stories/:id`

**Method:** `GET`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "error": false,
  "message": "Story fetched successfully",
  "story": {
    "id": "story-FvU4u0Vp2S3PMsFg",
    "name": "Dimas",
    "description": "Lorem Ipsum",
    "photoUrl": "https://story-api.dicoding.dev/images/stories/photos-1641623658595_dummy-pic.png",
    "createdAt": "2022-01-08T06:34:18.598Z",
    "lat": -10.212,
    "lon": -16.002
  }
}
```

---

## Push Notification (Web Push)

**VAPID Public Key:**

```
BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk
```

### Story Notification JSON Schema

```json
{
  "title": "Story berhasil dibuat",
  "options": {
    "body": "Anda telah membuat story baru dengan deskripsi: <story description>"
  }
}
```

### Subscribe

**URL:** `/notifications/subscribe`

**Method:** `POST`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "endpoint": "string",
  "keys": {
    "p256dh": "string",
    "auth": "string"
  }
}
```

**Response:**

```json
{
  "error": false,
  "message": "Success to subscribe web push notification.",
  "data": {
    "id": "...",
    "endpoint": "...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    },
    "userId": "...",
    "createdAt": "..."
  }
}
```

---

### Unsubscribe

**URL:** `/notifications/subscribe`

**Method:** `DELETE`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "endpoint": "string"
}
```

**Response:**

```json
{
  "error": false,
  "message": "Success to unsubscribe web push notification."
}
```
