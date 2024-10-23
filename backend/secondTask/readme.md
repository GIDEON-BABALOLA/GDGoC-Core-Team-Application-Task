
# A Simple API that Supports Pagination, Filtering, and Sorting for Products In An E-commerce Store
# Before You Start This Project, Note The Following
1. Create A .env file in the root folder of the project
2. Create A Variable FIRST_TASK_MONGODB_URL
5. Asssign This New Variable To The MongoDB connection string you have on your local device or the one you have on the cloud
6. Lastly Create A New Variable SECOND_TASK_PORT, and assign the value of this variable to any port number you wish such as port 3000, or port 5000.
7. Go To The Root Folder and run the command npm start to start the application
8. Also you can run npm run dev to ensure that on every change of the codebase the app gets restarted
# Here I Am Obeying The Rules Of CRUD
- BASE_URL = https://gdgoc-core-team-application-task.onrender.com

# Here We Have A Products Database
# Obeying The Rules Of CRUD
# CREATE
## Create A Product 
- URL: /api/product/create-a-product
- Method: POST
- Body Parameters
{"title" : "Macbook Pro", "description" : "An Apple Laptop", "price" : "24000", "category" : "Electronics", "brand" : "Apple", "quantity" : "9", "color" : "space grey"}

# READ
## Logout Administrator
- URL: /api/get-a-product/:id
- Method: GET
- No Body Parameters

## Get All Products
### This is where Pagination, Sorting And Filtering Takes Place
# Pagination
- URL: /api/product/get-all-product/?page=1&limit=5
- Method: GET
- No Body Parameters
# Filtering
- URL: /api/product/get-all-product/?category=shoes
- Method: GET
- No Body Parameters
OR
- URL: api/product/get-all-product/?price[lt]=11000
- Method: GET
- No Body Parameters
# Sorting
- URL: /api/product/get-all-product/?sort=price
- Method: GET
- No Body Parameters
OR
- URL: /api/product/get-all-product/?sort=quantity
- Method: GET
- No Body Parameters
# DELETE
## Delete A Product
- URL: /api/delete-a-product/:id
- Method: DELETE
- No Body Parameters


