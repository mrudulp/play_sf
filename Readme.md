# Introduction

This repo demonstrates playwright used to test Salesforce Chatter functionality

We test two functionality over here --

a. Validate  uploaded files name

b. Validate redirect url of the message containing url.

Mocha is used a test runner and playwright as automation framework

# Getting started

1. Clone the repo

2. Go to root of folder. Install all npm packages using command `npm install`

3. Set following environment variables

* SFUSERNAME  -- Salesforce Username
* SFPASSWORD -- Salesforce Username's password
* SFURL -- Salesforce org Login page url
* UPLOADFILENAME -- Local file Path that needs to be uploaded

4. Now run test using command `npm test`

# Known Issues

 * AutoIt is sometimes too eager to type and as a result; it keys in text even before dialog is ready for the keyboard input.This causes partial path field being entered in the input box
 *  ~~There is bug with Clear Chat. It Assumes atleast one chat message is present in the chatter. If cannot find the chat message the code gets stuck.~~
 *  Tests can fail due to clear chat bug. Known solution at the moment is to create atleast one chat message.

# Improvements

* Dockerise solution
* Clear Chat to be expanded to clear all existing chat messages.