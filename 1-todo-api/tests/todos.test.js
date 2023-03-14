const request = require('supertest');
const app = require('../app');
const {connect, disconnect} = require("../utils/db");
const User = require('../models/user_schema');
const jwt = require('jsonwebtoken');

let token;
let todoId;

beforeAll(async () => {
  await connect();

  let user = await User.findOne({
    email: "mo@testing.com"
  });

  token = jwt.sign({
    email: user.email,
    name: user.name,
    _id: user._id
  }, process.env.APP_KEY);
  
});

afterAll(async () => {
  await disconnect();
});

describe('Get all todos', () => {
  it('should retrieve an array of todos', async () => {
    const res = await request(app).get('/api/todos');
    todoId = res.body[1]._id;
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(5);
  });
});

describe('Get a single todo', () => {
  it('should retrieve a single todo', async () => {
    const res = await request(app).get(`/api/todos/${todoId}`)
                                  .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.text).toEqual("Buy new keyboard");
  });
});

describe('Create and retrieve a new todo', () => {
  let newTodoId;
  it('should create a new todo', async () => {
    const todo = {text: "This is a todo from jest"};
    const res = await request(app).post(`/api/todos`)
                                  .send(todo)
                                  .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(201);
    newTodoId = res.body._id;
  });

  it('should retrieve the new todo', async () => {
    const res = await request(app).get(`/api/todos/${newTodoId}`)
                                  .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.text).toEqual("This is a todo from jest");
  });
});