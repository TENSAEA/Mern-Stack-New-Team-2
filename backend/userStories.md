# Renta System API Checklist

## **Authentication**

- **General**
  - **Username & Password:** Classic method, but requires strong password policies.
  - **Token-based Authentication (JWT):** Popular for APIs, offers stateless authentication.
  - **Forgot Password Endpoint:** Create an API endpoint where users can initiate the forgot password process.
- **Checklist**
  - [ ] Implement a authentication method
  - [ ] Store user credentials securely using a hashing algorithm (e.g., bcrypt, scrypt) - **NEVER store plain text passwords!**
  - [ ] Handle authentication errors gracefully and provide informative messages to users.
  - [ ] Enforce strong password policies (minimum length, character complexity).
  - [ ] Implement secure token generation and validation using a library like jsonwebtoken`.
  - [ ] Set appropriate expiration times for tokens to prevent misuse.
  - [ ] Implement a forgot password endpoint with user input validation.
  - [ ] Set an appropriate expiration time for password reset tokens (e.g., 24 hours) to prevent misuse.

## **Authorization**

- **General**
  - **Login:** Define clear and granular access control rules for different user roles
  - **Role-Based Access Control (RBAC):** Assign roles to users and define permissions for each role.
- **Checklist**
  - [ ] Define clear and granular access control rules for different user roles (renter, landlord,broker,admin and superadmin).
  - [ ] Define user roles for your system
  - [ ] Implement authorization checks on all API endpoints that require specific permissions.
  - [ ] Handle unauthorized access attempts gracefully and return appropriate error codes.
  - [ ] Use a middleware layer or interceptor pattern to centralize authorization logic.
  - [ ] During each API request, check the user's role and the required permission for the requested action.

## **User Management**

- **General**
  - **Super Admin:** Has full control over the system, including creating and managing all other user roles (admins, landlords, brokers, renters). Can block and unblock any user.
  - **Admin:** Can verify landlords, brokers, and renters. May have limited access to super admin functionalities.Cannot create or manage other admins or super admins.
  - **Landlord:** Can list, edit, and delete their own rental properties. Can view and manage rental requests for their properties.
  - **Broker:** Can list their own rentals on behalf of landlords (with landlord's permission) and manage rental requests for those properties. May have some additional functionalities for marketing or managing multiple landlords (optional).
  - **Renter:** Can search for available rentals, view property details, and initiate rental requests. Can manage their profile information and rental history.
  - **Account Creation:**
    - Super Admin and Admin can create accounts for all user roles (landlord, renter, broker).
  - **Account Update:**
    - Users can update their own profile information (e.g., name, email, contact details).
    - Super Admin and Admin can update user information for any role (for admin purposes).
  - **Account Deletion:**
    - Super Admin and Admin can delete accounts for all user roles (except their own).
    - Landlords and Brokers cannot delete their own accounts due to potential data integrity issues with their listings.
    - Consider an option to "deactivate" accounts instead of complete deletion, allowing potential future reactivation.
  - **User Search and Filtering:**
    - Super Admin and Admin can search and filter users based on various criteria (e.g., role, name, email).
    - This helps with managing a large user base.
  - **User Blocking:**
    - Super Admin and Admin can block users of any role (including Landlords and Brokers) for violating terms or suspicious activity.
    - Blocked users cannot access the system or perform any actions.
  - **User Unblocking:**
    - Super Admin and Admin can unblock users they previously blocked.
- **Checklist**
  - [ ] Define clear and distinct user roles with associated permissions (Super Admin, Admin, Landlord, Broker, Renter).
  - [ ] Super Admin has full control over all user management functions (create, update, delete, block/unblock) for all roles.
  - [ ] Admin can verify, block/unblock Landlords, Brokers, and Renters. May have limited access to Super Admin functionalities. Cannot manage other Admins or Super Admin.
  - [ ] Landlord can manage their own rental properties (list, edit, delete) and rental requests.
  - [ ] Broker can list rentals on behalf of Landlords (with permission) and manage rental requests for those properties. May have additional functionalities for marketing or managing multiple landlords (optional).
  - [ ] Renter can search for rentals, view details, initiate rental requests, manage profile information, and view rental history.
  - [ ] Implement secure user registration with Super Admin/Admin creating accounts.
  - [ ] Allow users to update their own profile information (name, email, contact details).
  - [ ] Super Admin/Admin can update user information for any role (for admin purposes).
  - [ ] Define clear guidelines for account deletion (consider deactivating instead of complete deletion). Super Admin/Admin can delete most accounts (except their own).
  - [ ] Implement user search and filtering (by role, name, email) for Super Admin/Admin to manage large user bases.
  - [ ] Allow Super Admin/Admin to block users for policy violations or suspicious activity. Blocked users cannot access the system.
  - [ ] Allow Super Admin/Admin to unblock users they previously blocked.
  - [ ] Store user data securely (hashed passwords, access controls for sensitive information).
  - [ ] The system handles errors gracefully and returns appropriate error codes.

## House Entity

- **General**
  - **File Upload:** For uploading files such as images and agreements, use Multer **ONLY**.
    Multer is a middleware for handling multipart/form-data, which is primarily used for file uploads. It is specifically designed for use with Node.js and Express, making it an ideal choice for handling file uploads in your application.
  - **House Creation and Listing:**
    - Landlord/Broker can create a new house listing.
    - Landlord/Broker can edit their own house listings.
    - Landlord/Broker can delete their own house listings.
    - Landlord/Broker can delete their own house listings. (Consider implementing "deactivation" instead of permanent deletion for potential future use).
    - SuperAdmin and Admin can remove house listings.
  - **House Availability and Status**
    - **System tracks the availability status of each house** (available, rented, unavailable).
      - Update the status automatically when a rental request is approved or rejected.
    - **Landlord/Broker can mark their house as unavailable** for specific periods (e.g. maintenance).
  - **Rental Requests and Management**
    - **Renter can initiate a rental request for a specific house.** This should involve specifying desired start and end dates.
    - **Landlord/Broker receives notifications about new rental requests.**
    - **Landlord/Broker can view details of rental requests for their houses.**
    - **Landlord/Broker can manage rental requests:**
      - Approve the request, setting the house status to "rented" for the specified dates.
      - Reject the request, notifying the renter and keeping the house available.
      - Propose alternative dates to the renter if the requested dates are unavailable.
- **Checklist**
  - [ ] Landlords and Brokers can create, edit, and delete their own house listings.
  - [ ] Renters cannot create or modify house listings.
  - [ ] The system enforces authorization checks on all house management actions.
  - [ ] Landlords and Brokers can create new house listings with required details (location, type, category, price, description, photos).
  - [ ] The system validates user input for house creation (e.g., price format, photo size limits).
  - [ ] Photos are uploaded securely and stored in an appropriate format.
  - [ ] House listings are displayed with all relevant information (location, type, category, price, description, photos) on the user interface (for Renters and potentially Landlords/Brokers).
  - [ ] The system accurately reflects the availability status of each house (available, rented, unavailable).
  - [ ] House status updates automatically when a rental request is approved or rejected.
  - [ ] Landlords/Brokers can mark their houses as unavailable for specific periods.
  - [ ] Renters can initiate rental requests for available houses, specifying desired start and end dates.
  - [ ] The system validates rental request dates to ensure they fall within available periods.
  - [ ] Landlords/Brokers receive notifications about new rental requests for their houses.
  - [ ] Landlords/Brokers can view details of all rental requests for their houses, including requested dates and renter information.
  - [ ] Landlords/Brokers can manage rental requests by:
    - Approving the request, setting the house status to "rented" for the specified dates.
    - Rejecting the request, notifying the renter and keeping the house available.
    - Proposing alternative dates to the renter if the requested dates are unavailable.
  - [ ] Allow house ratings and reviews after a rental period is complete.
  - [ ] Only Renters who have completed a rental period for a house can submit feedback.
  - [ ] Renters can submit feedback for a specific HouseEntity (by ID) after completing their rental period
  - [ ] The system validates user input for feedback (e.g., comment length limitations).
  - [ ] Feedback can include a rating (numerical or star-based) and a text comment.
  - [ ] Landlords/Brokers can view all feedback submitted for their houses.
  - [ ] Feedback displays details like Renter information, rating, comment, and date submitted.
  - [ ] The system can optionally send notifications to Renters regarding the resolution status of their feedback.
  - [ ] House feedback should be reflected in the overall house rating displayed on the user interface (potentially calculated as an average of all ratings).
  - [ ] The system enforces authorization checks on all house feedback actions.
  - [ ] The system handles errors gracefully and returns appropriate error codes.

## Pending Order

- **Checklist**
  - [ ] Only Renters can submit pending orders.
  - [ ] The system enforces authorization checks on all pending order actions.
  - [ ] Renters can submit a pending order for a specific HouseEntity (by ID).
  - [ ] Renters can specify their desired bid price for the rental.
  - [ ] The system validates user input for pending orders (e.g., bid price format).
  - [ ] The system checks if the HouseEntity is available for the desired rental period (based on house availability status).
  - [ ] Upon successful submission, the order is marked as "pending" with the specified bid price, date, HouseEntityID, and associated RenterID.
  - [ ] The system sends notifications to Landlords/Brokers about new pending orders for their houses (including details like bid price and renter information).
  - [ ] Landlords/Brokers can view a list of all pending orders for their houses.
  - [ ] Pending orders display details like Renter information, bid price, date submitted, and HouseEntity information.
  - [ ] Landlords/Brokers can manage pending orders for their houses:
    - **Accept** the order, setting the house status to "rented" for the agreed-upon dates and potentially initiating a contract process (optional).
    - **Reject** the order, notifying the Renter and keeping the house available.
    - **Propose** a counter-offer with an alternative price to the Renter.
  - [ ] The system sends notifications to Renters regarding the status of their pending orders (accepted, rejected, counter-offer).
  - [ ] When a pending order is accepted, the system automatically cancels any conflicting pending orders for the same HouseEntity and rental period.

## Report

- **Checklist**
  - [ ] Both Renters and Landlords/Brokers can submit reports.
  - [ ] The system validates user input for reports (e.g., message content).
  - [ ] Reports can be linked to a specific HouseEntity (by ID) or submitted as general feedback (optional, depending on your needs).
  - [ ] Reports can include different types (e.g., "Maintenance Issue," "Noise Complaint," "Positive Experience").
  - [ ] Landlords/Brokers can view all reports submitted for their houses.
  - [ ] Reports display details like Renter/Landlord information, message content, HouseEntity information (if applicable), and type.
  - [ ] Landlords/Brokers can mark reports as "resolved" or "pending resolution" after addressing the issue.
  - [ ] The system can optionally send notifications to report submitters (Renter or Landlord/Broker) regarding the resolution status.
  - [ ] The system handles errors gracefully and returns appropriate error codes.
