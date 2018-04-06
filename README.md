# Trivial

## Endpoints

### REST

- `GET /questions`: retrieves the list of all the Questions with their Answers
- `GET /questions/:questionId`: retrieves a single question
- `DELETE /questions/:questionId`: deletes a question
- `POST /questions/import`: imports (from a CSV) some questions (with their answers)
- `GET /rooms/active`: retrieves the active Room, along with some info (?)

### Socket

- `/rooms-{roomId}`: everything concernig the particular `{roomId}` room
  - FE -> BE `start quiz`: starts the quiz
  - BE -> FE `question`: prompts the next question + answers
  - FE -> BE `answer { questionId, answerId }`: answers to a question
  - BE -> FE `score`: sends the results of the quiz
  - BE -> FE `invalid room id`: ERROR, the room id provided isn't valid
  - BE -> FE `invalid question id`: ERROR, the question id provided isn't valid
  - BE -> FE `invalid answer id`: ERROR, the answer id provided isn't valid

## Models

### Answer

- `id`: UUID
- `text`: String
- `correct`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

#### Associations

- belongs to `Question`

### Question

- `id`: UUID
- `text`: String
- `createdAt`: Date
- `updatedAt`: Date

#### Associations

- has many `Answer`
- belongs to many `Room` through `RoomQuestion`

### Room

- `id`: UUID
- `startedAt`: Date
- `createdAt`: Date
- `updatedAt`: Date

#### Associations

- belongs to many `Question` through `RoomQuestion`
- belongs to many `User` through `RoomUser`

### RoomQuestion

- `id`: UUID
- `order`: Number
- `createdAt`: Date
- `updatedAt`: Date

### RoomUser

- `id`: UUID
- `createdAt`: Date
- `updatedAt`: Date

### User

- `id`: UUID
- `name`: String
- `email`: String
- `admin`: Boolean
- `createdAt`: Date
- `updatedAt`: Date
