ARAMBO BACKEND API - ALL URLS AND ENDPOINTS
============================================

BASE URL: http://localhost:4000

PROPERTIES API (/properties)
============================

Health & Statistics:
-------------------
GET /properties/health        - API health check
GET /properties/stats          - Property statistics

CRUD Operations:
---------------
GET /properties                - List all properties (with filters & pagination)
POST /properties               - Create new property
GET /properties/:id            - Get specific property by ID
PUT /properties/:id            - Update specific property
DELETE /properties/:id         - Delete specific property

Query Parameters for GET /properties:
- page (number): Page number (default: 1)
- limit (number): Items per page (default: 10, max: 100)
- category (string|array): Furnished, Semi-Furnished, Non-Furnished
- listingType (string|array): For Rent, For Sale
- propertyType (string|array): Apartment, House, Villa
- bedrooms (string): Exact number or minimum (e.g., '3' or '3+')
- bathroom (string): Exact number or minimum (e.g., '2' or '2+')
- minSize, maxSize (number): Size range filter
- location (string): Location search
- area (string|array): Specific area filter
- firstOwner (boolean): First owner properties
- onLoan (boolean): Loan status
- isConfirmed (boolean): Confirmation status
- inventoryStatus (string|array): Looking for Rent, Found Tenant, Owner Unreachable
- tenantType (string|array): Family, Bachelor, Women
- propertyCategory (string|array): Residential, Commercial
- furnishingStatus (string|array): Non-Furnished, Semi-Furnished, Furnished
- minRent, maxRent (number): Rent range filter
- floor (number): Specific floor
- houseId, listingId (string): ID filters
- apartmentType (string): Apartment type filter
- isVerified (boolean): Verification status
- Facility filters (boolean): cctv, communityHall, gym, masjid, parking, petsAllowed, swimmingPool, trainedGuard

FURNITURE API (/furniture)
==========================

Health & Statistics:
-------------------
GET /furniture/health          - API health check
GET /furniture/stats           - Furniture statistics

CRUD Operations:
---------------
GET /furniture                 - List all furniture items
POST /furniture                - Create new furniture item
GET /furniture/:id             - Get specific furniture item
PUT /furniture/:id             - Update specific furniture item
DELETE /furniture/:id          - Delete specific furniture item

TRIPS API (/trips)
==================

CRUD Operations:
---------------
GET /trips                     - List all trips
POST /trips                    - Create new trip
GET /trips/:id                 - Get specific trip by ID
PUT /trips/:id                 - Update specific trip
DELETE /trips/:id              - Delete specific trip

Special Queries:
---------------
GET /trips/date?date=YYYY-MM-DD    - Get trips by date
GET /trips/truck/:truckId          - Get trips by truck ID
GET /trips/timeslot/:timeSlot      - Get trips by time slot

TRUCKS API (/trucks)
====================

CRUD Operations:
---------------
GET /trucks                    - List all trucks
POST /trucks                   - Create new truck
GET /trucks/:id                - Get specific truck by ID
PUT /trucks/:id                - Update specific truck
DELETE /trucks/:id             - Delete specific truck

Special Operations:
------------------
POST /trucks/get-by-id         - Get truck by ID from request body

COMPLETE API URL LIST
=====================

Properties:
- GET    http://localhost:4000/properties/health
- GET    http://localhost:4000/properties/stats
- GET    http://localhost:4000/properties
- POST   http://localhost:4000/properties
- GET    http://localhost:4000/properties/:id
- PUT    http://localhost:4000/properties/:id
- DELETE http://localhost:4000/properties/:id

Furniture:
- GET    http://localhost:4000/furniture/health
- GET    http://localhost:4000/furniture/stats
- GET    http://localhost:4000/furniture
- POST   http://localhost:4000/furniture
- GET    http://localhost:4000/furniture/:id
- PUT    http://localhost:4000/furniture/:id
- DELETE http://localhost:4000/furniture/:id

Trips:
- GET    http://localhost:4000/trips
- POST   http://localhost:4000/trips
- GET    http://localhost:4000/trips/:id
- PUT    http://localhost:4000/trips/:id
- DELETE http://localhost:4000/trips/:id
- GET    http://localhost:4000/trips/date?date=YYYY-MM-DD
- GET    http://localhost:4000/trips/truck/:truckId
- GET    http://localhost:4000/trips/timeslot/:timeSlot

Trucks:
- GET    http://localhost:4000/trucks
- POST   http://localhost:4000/trucks
- GET    http://localhost:4000/trucks/:id
- PUT    http://localhost:4000/trucks/:id
- DELETE http://localhost:4000/trucks/:id
- POST   http://localhost:4000/trucks/get-by-id

HTTP METHODS SUMMARY:
=====================
- GET: Retrieve data
- POST: Create new data
- PUT: Update existing data
- DELETE: Remove data

RESPONSE FORMAT:
================
All APIs return JSON format with:
- Success: Data + pagination info (for lists)
- Error: Error message + details

AUTHENTICATION:
===============
Currently: No authentication required (public API)
For CMS: Add JWT authentication middleware

CORS ENABLED:
=============
All origins allowed in development
Credentials supported
