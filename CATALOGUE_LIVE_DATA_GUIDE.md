# Catalogue Management System - Live Data Implementation Guide

## Overview
The catalogue management system has been successfully integrated with live database storage. Catalogues are now created and stored in the MySQL database instead of being mock data only.

## What Was Implemented

### 1. Backend API (`backend/controllers/catalogueController.js`)
- **GET /api/admin/catalogues** - Fetch all catalogues filtered by type (TEXTBOOK, LIBRARY, KIT)
- **GET /api/admin/catalogues/:id** - Get a specific catalogue with all details
- **POST /api/admin/catalogues** - Create a new catalogue
- **PATCH /api/admin/catalogues/:id** - Update existing catalogue
- **DELETE /api/admin/catalogues/:id** - Delete a catalogue
- **GET /api/admin/publishers** - Get list of all publishers

### 2. Backend Routes (`backend/routes/adminRoutes.js`)
All catalogue endpoints are registered and protected with authentication middleware.

### 3. Frontend API Service (`frontend/src/services/api.ts`)
Added `catalogueAPI` object with methods:
```typescript
catalogueAPI.getCatalogues(type)
catalogueAPI.getCatalogueById(id)
catalogueAPI.createCatalogue(payload)
catalogueAPI.updateCatalogue(id, payload)
catalogueAPI.deleteCatalogue(id)
catalogueAPI.getPublishers()
```

### 4. Enhanced TextbookProductModal Component
- Fetches publishers dynamically from the API
- Submits form data directly to the backend
- Maps API responses back to frontend data structures
- Includes loading states and error handling
- Disables form inputs during submission

### 5. Updated AdminCatalogueSegmentPage
- Fetches catalogues from API on component mount
- Automatically updates when tab changes
- Converts API responses to UI-compatible format
- Maintains fallback to mock data for demonstration
- Shows loading state while fetching

## Database Schema
Catalogues are stored in the `products` table with the following key fields:
- `id` - Unique identifier
- `sku` - Stock keeping unit
- `name` - Catalogue name
- `series_name` - For textbook series
- `type` - TEXTBOOK, LIBRARY, or KIT
- `grade_min`, `grade_max` - Grade range
- `subject` - Subject area
- `curriculum` - Curriculum type
- `format` - Print, Digital, Blended
- `publisher_id` - Foreign key to publishers table
- `metadata` - JSON field for extra attributes (badges, descriptions, TOC, etc.)

## How to Use

### Creating a Catalogue
1. Navigate to the admin CMS section (Textbooks, Library, or Kits)
2. Click the "Add" button
3. Fill in the form:
   - **Publisher** - Selected from database
   - **Series Name** - Name of the series
   - **Full Title** - Complete product name
   - **Edition** - Edition information
   - **Format** - Print/Digital/Blended
   - **Curriculum Type** - Target curriculum
   - **Subject** - Subject area
   - **Grade Range** - From/To grades
   - **Badges** - Check applicable badges (New Edition, NCC Approved, Kodeit Brand, Maarif Agreement)
   - **Description** - Detailed description
   - **Table of Contents** - Optional detailed outline
   - **Territory** - Applicable regions (UAE/KSA)
   - **Status** - Published or Draft

4. Click "Publish Textbook" or "Save as Draft"
5. The catalogue is immediately saved to the database and appears in the list

### Adding Books to Catalogues
After creating a catalogue folder, click on it to open the detail view. Use the "Add Book" button to add individual books/SKUs to the catalogue. These will be stored as line items associated with the catalogue.

### Viewing Live Catalogues
All catalogues from the database automatically appear in the admin interface, organized by type (Textbooks/Library/Kits) and filterable by:
- Publisher
- Grade level
- Curriculum type
- Format
- Status (Published/Draft)

## Next Steps

### To Enable Book/Line Item Creation
Create a similar API pattern for line items:
1. Create `lineItemController.js` with CRUD operations
2. Add routes for POST/PATCH/DELETE line items
3. Update `CatalogueBookItemModal` to use the API
4. Fetch line items when viewing catalogue details

### To Enable Image Uploads
1. Create an upload endpoint in the backend
2. Store cover images in the uploads directory
3. Update catalogue_modal components to handle file uploads
4. Store image URLs in the API response

### To Remove Mock Data Completely
Once all features are working with live data:
1. Remove `catalogueByTab` references when API always has data
2. Clean up mock data from `frontend/src/data/admin/catalogue.ts`
3. Update filter configurations to read from API if needed

## Error Handling
- All API calls include proper error handling
- Failed requests display user-friendly error messages in toast notifications
- Form validation prevents invalid submissions
- Loading states prevent duplicate submissions

## Authentication
All catalogue endpoints require:
- Bearer token in Authorization header
- PANWORLD_ADMIN role (enforced in middleware)
- Valid JWT access token

## Testing the Implementation
1. Start the backend server: `npm run dev` from root
2. Open the admin catalogue section
3. Try creating a new catalogue
4. Verify it appears in the list
5. Check the database for the new entry in the `products` table
6. Try editing/deleting to test other operations

## Files Modified
- ✅ `backend/controllers/catalogueController.js` - Created
- ✅ `backend/routes/adminRoutes.js` - Updated
- ✅ `frontend/src/services/api.ts` - Updated
- ✅ `frontend/src/ui/admin/components/catalogue/CatalogueModals.tsx` - Updated
- ✅ `frontend/src/ui/pages/admin/AdminCatalogueSegmentPage.tsx` - Updated
