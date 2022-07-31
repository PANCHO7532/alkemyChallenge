# Alkemy Node.JS Challenge
## Requirements
- Node.JS >= 8.0 or >= 10.0.x
- MySQL/MariaDB database
- Mail service with SMTP access

## Setup instructions
- Download Node.JS [Download Here](https://nodejs.org/en/download/ "Node.JS Download")
- Once installed Node.JS, open an terminal and execute `npm update --save` for fetch all dependencies for the project
- Modify the `config.inc.json` file located under the config folder for this project.
- Modify the variables as it follows:
```json
{
    /* NOTE: Do not put comments inside the JSON file, these are for reference only. */
    "httpHost": "0.0.0.0", // Hostname to bind, specifying 0.0.0.0 would bind to all IPv4 interfaces
    "httpPort": 3000, // Port where the app should bind, and where the app should be accesible
    "mysqlHost": "mysql.example.com", // MySQL hostname
    "mysqlPort": 3306, // Port where MySQL is running
    "mysqlUsername": "mysqluser", // Username for authenticate at the MySQL server
    "mysqlPassword": "mysqlPassword", // Password for authenticate at the MySQL server
    "mysqlDatabaseName": "appDatabase", // Name of the database that the app is going to use
    "smtpHost": "smtp.example.com", // SMTP Hostname from your Mail service
    "smtpPort": 587, // SMTP Port provided by your Mail service
    "smtpUsername": "smtpuser", // Username for authenticate with the SMTP server
    "smtpPassword": "smtpPassword", // Password for authenticate with the SMTP server
    "emailAddress": "root@example.com", // Email Address that the mail service is going to use while sending emails
    "enableEmailServices": true // If set to false, the app will not send an welcome mail to the newly registered user
}
```
- Run `npm run start` for start in production mode
- Run `npm run start-dev` for start in development mode (nodemon), requires installing additional dependencies by executing `npm update --save-dev` at the root folder of this project.
- If you have installed Postman we recommend you import the workspace file `Disney-API.postman.json` for pre-defined requests, in-depth API structure could be found inside `index.js` file at the `routes` folder.