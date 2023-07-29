# Todo List App

This is a simple Todo List app that allows users to manage their tasks efficiently. The app is built using JavaScript for the frontend

## Tech used

- Frontend: JavaScript (Native)
- Icon Management: [FontAwesome](https://fontawesome.com/)
- Backend: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
- Database: [MongoDB](https://www.mongodb.com/)
  
## Demo

Live demo of the app [here](https://todolist-jstest.netlify.app/). Feel free to explore its functionality and try adding, editing, and completing tasks.

## Setup and Usage

To run this app locally, follow these steps:

1. Clone the repository: `git clone https://github.com/yourusername/todolist-app.git`
2. Navigate to the project directory: `cd todolist-app/backend`
3. Install dependencies: `npm install`
4. Set up MongoDB: [Install MongoDB](link-to-mongodb-installation-guide) and create a new database for the app.
5. Configure environment variables: Create a `.env` file in the root directory and add the following:
   DB_USER=`your-mongodb-username`, DB_PASSWORD=`your-mongodb-password`, DB_NAME=`your-mongodb-database-name` with your MongoDB connection string details.
6. Start the app with `nodemon`: Open a terminal and run `npx nodemon`.

## Running the App

After setting up the backend with `nodemon`, you can run the frontend using `Live Server` in VSCode. Here's how:

1. Open the project directory in [Visual Studio Code](https://code.visualstudio.com/).
2. In the file explorer, navigate to the `frontend` folder.
3. Locate the `index.html` file and right-click on it.
4. From the context menu, select `Open with Live Server`.
5. This will open the app in your default web browser at `http://localhost:5500`.

Now, the frontend of the Todo List app is up and running! You can start adding, editing, and completing your tasks.
