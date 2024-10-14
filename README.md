### Deployed Sites:

Front-end: https://e-commerce-185fdc.netlify.app/ Back-end: https://ecommerce-api-k4pz.onrender.com

The backend of the e-commerce application follows an MVC (Model-View-Controller) pattern using Node.js, MongoDB, and Mongoose. It supports essential functionalities for managing users, products, categories, and orders, all of which reference each other to maintain consistency across the application.

#### Controllers: The backend includes various controllers that handle different entities in the application:

- category_controllers.js: Manages category creation, deletion, and updates. Categories are connected to products, and deletion is blocked (with a 409 error) if a category still has products associated with it.
- product_controllers.js: Handles the creation, editing, and deletion of products. It manages the assignment of products to up to three categories and ensures the product information is kept consistent.
- order_controllers.js: Manages orders, allowing users to view all their orders through a getAllOrdersByUserId function.
- user_controllers.js: Provides user-related functionalities such as editing user profiles.
- Database Models: The MongoDB database, with Mongoose as the ORM, defines schemas for each entity:

#### Products: Contains attributes such as name, price, description, and the categories they belong to.
- Categories: Stores category names and tracks relationships with products.
- Orders: Stores user orders with details on purchased products.
- Users: Manages user data, including their orders and associated information.


#### API Endpoints: The backend provides a comprehensive set of endpoints to interact with products, categories, orders, and users such as:
POST /api/categories for creating categories.
DELETE /api/categories/:id for deleting categories.
POST /api/products for adding new products.
PUT /api/products/:id for editing products.
DELETE /api/orders/:id for removing orders.
This setup provides a flexible, scalable API structure for managing all aspects of the e-commerce shop, ensuring smooth operation and interaction with the frontend React application. Althou nmot all of these functionalities could be implemented in the fron end, due to the time limit of 1 week, we invested a lot of time in covering a variety of controllers for our application.
