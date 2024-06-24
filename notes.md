# Summary of changes

## Basic Tasks

1. Finish implementing the /user route in the backend

	•	Objective: Return user information to the frontend.
	•	Implemented logic to fetch user information from the database and return it as JSON.

2. Implement token storage for /login and /register endpoints

	•	Objective: Store the authentication token for access by the rest of the application.
	•	Stored the token in the session storage in the backend and in localStorage in the frontend.

3. Create a /logout functionality in the frontend

	•	Objective: Allow users to log out and clear the authentication token.
	•	Added a Logout component that clears the token from localStorage and redirects the user to the login page.

4. Create a user profile component

	•	Objective: Fetch and display user data after login, as per the wireframe.
	•	Added motto and profile_picture fields to the User model in the backend.
	•	Updated /register endpoint to accept and store these additional fields.
	•	Created a Profile component in the frontend to display user information, including the profile picture and motto.
	•	Updated the Register component to collect additional user profile data (motto and profile picture).

## Version Management

1. Implement app-version header in all network requests

	•	Objective: Ensure the app-version header is sent with every request.
	•	Updated APIService.ts to include the app-version header in all requests.

2. Backend check for app-version header

	•	Objective: Prevent the server from processing requests if the app-version header is below 1.2.0.
	•	Added middleware in the Flask backend to check the app-version header.
	•	If the version is below 1.2.0, the server returns a 426 status code with a message prompting the user to update their client application.

3. Handle update message in the frontend

	•	Objective: Display a message in the UI if the client application needs to be updated.
	•	Updated APIService.ts to throw an error with the update message if the server responds with a 426 status code.
	•	Updated the Login and Register components to catch this error and display the update message to the user.

4. Mock version transition

	•	Objective: Simulate the transition from an old version of the application to a new one.
	•	Initially set the appVersion in APIService to 1.0.0 in useEffect hooks of Login and Register components.
	•	After the initial interaction (successful login or registration), update the appVersion to 1.2.1 for subsequent requests.

