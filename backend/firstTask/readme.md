
# A Simple Project Management Web Application. 
# Before You Start This Project, Note The Following
1. Create A .env file in the root folder of the project
2. Create a Variable FIRST_TASK_JWT_SECRET
3. Assign The variable just created to a hash, you can generate the hash with the code below
`const hash = crypto.createHash('sha256').update(crypto.randomBytes(256)).digest('hex')`
4. Create Another Variable FIRST_TASK_MONGODB_URL
5. Asssign This New Variable To The MongoDB connection string you have on your local device
6. Lastly Create A New Variable FIRST_TASK_PORT, and assign the value of this variable to any port number you wish such as port 3000, or port 5000.
7. Go To The Root Folder and run the command npm start to start the application
8. Also you can run npm run dev to ensure that on every change of the codebase the app gets restarted
# Here I Am Obeying The Rules Of CRUD
- BASE_URL = https://gdgoc-core-team-application-task.onrender.com
# Admin Functionality

# CREATE
## Register Administrator
- URL: /api/admin/register-admin
- Method: POST
- Body Parameters
{"name" : "Gideon Babalola", "title" : "Administrator", "email" : "gideonbabalola69@gmail.com",  "password" : "notyet11#@"}

## Create A Project
- URL: /api/project/create-a-project
- Method: POST
- Body Parameters
{"title" : "Tracking Users Realtime Location With Google Maps", "description" : "taxi app", "year" : "2024", "month" : "11", "date" : "22", "hours" : "20", "minutes" : "30", "seconds" : "30"}

# READ
## Login Administrator
- URL: /api/admin/login-admin
- Method: POST
- Body Parameters
{ "email" : "gideonbabalola69@gmail.com",  "password" : "notyet11#@"}

## Logout Administrator
- URL: /api/admin/login-admin
- Method: GET
- No Body Parameters

## View Administrator Profile
- URL: /api/admin/view-admin-profile
- Method: GET
- No Body Parameters, Just Login With Admin

## View A Project
- URL: /api/project/view-a-project/:projectId, > Remember a project ID is revealed when a project is created
- Method: GET
- No Body Parameters, Just Login With Admin

## View All Projects
- URL: /api/project/view-all-projects?page=1&limit=7,
- Method: GET
- We Have Two Query Parameters Here For Pagination, which are page and limit

## View Project Status
- URL: /api/project/view-project-status/:projectId,
- Method: GET
- No Body Parameters, Just Login With Admin

## View Project Deadline
- URL: /api/project/view-project-deadline/:projectId,
- Method: GET
- No Body Parameters, Just Login With Admin

 ## View Members Of A Project
- URL: /api/project/view-project-members/:projectId,
- Method: GET
- Body Parameters
{ "role" : "designer"} or { "role" : "developer"} 

# UPDATE
## Add Project Member
- URL: /api/project/add-project-member/:projectId,
- Method: PUT
- Body Parameters
{"email" : "gideonbabalola69@gmail.com", "role" : "designer"} or {"email" : "gideonbabalola69@gmail.com", "role" : "developer"} 

## Remove Project Member
- URL: /api/project/remove-project-member/:projectId,
- Method: PUT
- Body Parameters
{"email" : "gideonbabalola69@gmail.com", "role" : "designer"} or {"email" : "gideonbabalola69@gmail.com", "role" : "developer"} 


# DELETE
## Delete A Project
- URL: /api/project/delete-a-project/:projectId,
- Method: DELETE
- No Body Parameters


# Developer Functionality
# CREATE
## Register Developer
- URL: /api/developer/register-developer
- Method: POST
- Body Parameters
{"name" : "Gideon Babalola", "title" : "Backend Developer", "email" : "babalolagideon22@gmail.com",  "password" : "notyet11#@"}

# READ
## login Developer
- URL: /api/developer/login-developer
- Method: POST
- Body Parameters
{"email" : "babalolagideon22@gmail.com",  "password" : "notyet11#@"}

## logout Developer
- URL: /api/developer/logout-developer
- Method: GET
- No Body Parameters

## View Developer Profile
- URL: /api/developer/view-developer-profile
- Method: GET
- No Body Parameters, Just Login With A Developer Account.

## View Developer Projects
- URL: /api/developer/view-developer-projects
- Method: GET
- No Body Parameters, Just Login With A Developer Account.


# Designer Functionality
# CREATE
## Register Designer
- URL: /api/designer/register-designer
- Method: POST
- Body Parameters
{"name" : "Gideon Babalola", "title" : "Backend Developer", "email" : "babalolagideon22@gmail.com",  "password" : "notyet11#@"}

# READ
## login Designer
- URL: /api/designer/login-designer
- Method: POST
- Body Parameters
{"email" : "babalolagideon22@gmail.com",  "password" : "notyet11#@"}

## logout Designer
- URL: /api/designer/logout-designer
- Method: GET
- No Body Parameters

## View Designer Profile
- URL: /api/designer/view-designer-profile
- Method: GET
- No Body Parameters, Just Login With A Developer Account.

## View Designer Projects
- URL: /api/designer/view-designer-projects
- Method: GET
- No Body Parameters, Just Login With A Developer Account.
This Project Has Been Deployed on Render with the live link https://gdgoc-core-team-application-task.onrender.com, and the database has been deployed on mongoDB cloud