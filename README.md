> [!CAUTION]
> This code is **NOT** production-ready. Use for personal, low-traffic projects.

# EduWebAPI
A simple link between loumadev's EdupageAPI package and the web. \
This is meant to be a proof of concept that EduPage can have a web API.

## Setup
Configuration is stored in the env file
```
git clone https://github.com/DvidPiDev/eduwebapi // clone the repo
cd eduwebapi
npm install // install dependencies
cp .env.example .env // copy the env example, then configure it
npm start // start the server
```
By default, the server runs on port 3001, which can be configured in the .env file

## Keep in mind
This code is not suited for large-scale projects (with over 100 requests per hour) due to the fact that all user logins happen from 1 IP address, increasing the likelyhood for EduPage to block your IP. \
EduPage probably doesn't care about who logs in from where, but it's important to keep this in mind.

> [!IMPORTANT]  
> **I do not take any accountability if your IP gets blocked or if your EduPage account gets suspended.**
> Simply, if this API hurts your family, pees on your carpet or crashes a car into your house, it's not my fault.

## API Documentation:
All endpoints here use the POST method and all of them must contain this request body:
```json
{
  "username": "EduPage Username / E-mail",
  "password": "EduPage Password"
}
```
- `/api/all` - Gets timetable for today and tomorrow, last 25 timeline items, grades and assignments for today and tomorrow.
- `/api/timetable` - Get timetable for today and tomorrow.
- `/api/timeline/:amount` - Get last :amount timeline items, defaults to 25 if no amount is provided.
- `/api/assignments` - Get assignments for today and tomorrow.
- `/api/grades` - Get all grades with their respective weights.
<hr>
Big thanks to loumadev (https://github.com/loumadev) for writing an EduPage API in JS.
