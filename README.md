# PatchBoard

PatchBoard is a basic applicaiton to keep track of software projects and their known bugs and problems waiting to be patched. Each issue has a status indicator indicating whether it is waiting for a patch, in progress, or patched.

PatchBoard was built to learn TypeScript and to get more experience with working with and building and API.

## Instructions for Build and Use

Install and run the backend:

```bash
cd backend
npm install
npm run build
npm start
```

Install and run the frontend in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The backend runs on `http://localhost:3000` and the frontend runs on the Vite
development URL, usually `http://localhost:5173`.

## Development Environment

To recreate the development environment, you need the following software and/or libraries with the specified versions:

* Node.js 22 LTS or later
* npm
* TypeScript
* Express
* SQLite3
* Vite

## Useful Websites to Learn More

I found these websites useful in developing this software:

* [YouTube](https://youtu.be/BRbgxKDzzzU?si=TCfaz-pIqAITydyt)
* [YouTube](https://youtu.be/S-aprSnsGnQ?si=mkSHdjf4DS_x7J4n)
* [YouTube](https://youtu.be/JUORwadOU7s?si=h2d4nNectIGav60R)

## Future Work

The following items I plan to fix, improve, and/or add to this project in the future:

* [x] Add bug search by title.
* [x] Add filters for bug status, priority, and open versus completed bugs.
* [x] Add frontend controls for editing bug titles, descriptions, priorities, and statuses.
* [x] Add frontend controls for deleting bugs.
* [x] Add frontend and backend controls for editing project names.
* [x] Add project deletion with a confirmation warning that associated bugs will also be deleted.
* [ ] Configure Jest and add tests for project creation, validation, bug creation, and status updates.
* [ ] Add ESLint configuration for the backend and frontend.
* [ ] Improve frontend error messages for unavailable servers, missing projects, and failed saves.
* [ ] Perform final end-to-end QA and document the results.
* [ ] Add user authentication and authorization.
* [ ] Add comments or activity history to bugs.
* [ ] Add file attachments to bugs.
* [ ] Add notifications for bug updates.
* [ ] Add deployment configuration for hosting the application.
