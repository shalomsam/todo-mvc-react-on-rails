# Todo MVC using ReactOnRails

This is a simple Todo MVC app that is built using Shakacode's ReactOnRails Framework. The hosted version of the app can be see [here](https://afternoon-anchorage-49678.herokuapp.com/#)

## Info
--------
* **Ruby Version**: 2.6.1p33
* **Rails Version**: 5.2.2
* **React Version**: 16.8.1
* **ReactOnRails Version**: 11.1.4

## Install and Run locally
---------------------------
First clone this repository by running the following command:
```git
git clone git@github.com:shalomsam/todo-mvc-react-on-rails.git
```
**Note**: This instructions assume you have PostgreSql Databases already installed and setup for Rails. If not you might wanna install and setup PostgreSql before following the below steps.

Navigate to the app root directory:
```bash
cd todo-mvc-react-on-rails
```

Then install node dependencies:
```bash
yarn install
```
Or
```bash
npm install
```

Then install gem dependencies:
```bash
bundle install
```

Then run DB migration to create the required tables in the PostgreSql database:
```bash
rake db:migrate
```

Then Build the React bundle files using the below command:
```bash
bin/webpack
```
 And finally to server the application locally we can run a rails server with the following command:
 ```bash
 rails s -p 3001
 ```
 `-p 3001` being the port number of choice.


