XStudio Backend Service for Video Platform
===================

This is a backend service mainly for **auth**, **payment** and **video streaming**. Currently, just set up the restful api part, will set up mongo part later.


Index
-------------

You can insert a table of contents using the marker `[TOC]`:

[TOC]


Setup
-------------

Before setup the repo, you need to make sure that you meet the following requirements:

1. Node v5.2.0
2. A Mongodb (you will need it in the future)

> **Steps to setup:**
> 
> - Download the repo
> - npm install

Start the server
-------------

> **Steps to setup:**
> 
> - npm start
> - Get a `postman` which is an app for sending HTTP request
> - Send a HTTP request to `localhost:3000/api/v1/sample`, and you should get a message back


Dependencies Intro & Tutorial
-------------
You may want to get more familiar with these frameworks:
> **Node.js : https://nodejs.org/en/**
> 
> - Concept of Asynchronous
> - Concept of Generator
> - Koa.js: http://koajs.com/
> - Co.js: https://github.com/tj/co
> 
> **MongoDB : https://docs.mongodb.com/**
> 
> - Simple CRUD queries
> - Simple Aggregation queries
> - Node.js version of driver for MongoDB: https://mongodb.github.io/node-mongodb-native/
> - Mongoose.js: http://mongoosejs.com/
