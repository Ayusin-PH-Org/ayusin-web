# Utilities

Upload media content

This is assuming the input is not base64, but rather, just file location on the device from where the media is located.
Have to configure to change yung max payload size to be like 30mb?

```json
POST /media
Requires Bearer Token: YES
Path Params: type="image | video"
Query Params: N/A
Request Body (not json, rather multiform/data)

// Responses
200 OK
{
  "type": "image",
  "url": "string"
}
```

# Reports

## Create new report

```json
POST /reportsq
Requires Bearer Token: YES
Path Params: N/A
Query Params: N/A
Request Body:
{
  "reported_by": "string"     // citizen_user_id
  "title": "string",
  "description": "string | null",
  "category": "string",
  "scope": "string",
  "location": {
    "x": "float",
    "y": "float"
  }
}

// Responses
200 OK
{
  "status": "success",
  "id": "string",
  "reported_by": "string",
  "title": "string",
  "description": "string",    // Empty string for null
  "internal_notes": "string", // Empty string for null
  "category": "string",
  "severity": "string",     // Defaults to low (im not sure if this is good)
  "labels": ["string"],
  "report_status": "string", // Defaults to Todo
  "media_links": ["string"], // blob storage links
  "votes": {
    "up": "integer",         // Defaults to 0
    "down": "integer"        // Defaults to 0
  },
  "location": {
    "x": "float",
    "y": "float"
  }
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}

422 UNPROCESSABLE_ENTITY
{
  "status": "error",
  "description": "x-coordinate in 'location' field must be of float type"
}
```

## Get a report

```json
GET /reports/{id}
Requires Bearer Token: YES
Path Params: id (references reports._id)

// Responses
200 OK
{
  "status": "success",
  "id": "string",
  "title": "string",
  "description": "string", // Empty string for null
  "category": "string",
  "labels": ["string"],
  "media_links": ["string"], // blob storage links
  "report_status": "string",
  "severity": "string",
  "votes": {
    "up": "integer",
    "down": "integer"
  },
  "location": {
    "x": "float",
    "y": "float"
  }
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}

404 NOT FOUND
{
  "status": "error",
  "description": "Report not found."
}
```

## Get all reports

Use the duration in the query parameter to filter in the past nth day.

```json
GET /reports
Requires Bearer Token: NO [if yes use /reports/lgu] (If yes, only location, radius, duration are allowed)
Path Params: id (references reports._id)
Query Params:
- duration=30 // Filters in the last 30 days
- department="DPWH" // Filters reports depending on which department its assigned
- label="open" // Filter by label. can be used multiple times.
- categories="City Health" // Filter by categories. can be used multiple times.
- sort_by="upvotes"   // Sort by a variable.
- location="23,13.4"  // (x, y)
- radius="1000"    // how meters from location. Note that location query param is required.

// Responses
200 OK
{
  "status": "success",
  "reports": [
    {
      "id": "string",
      "title": "string",
      "description": "string", // Empty string for null
      "category": "string",
      "labels": ["string"],
      "media_links": ["string"], // blob storage links
      "upvotes": "integer",
      "location": {
        "x": "float",
        "y": "float"
    },
    ...
  ]
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}

404 NOT FOUND
{
  "status": "error",
  "description": "Report not found."
}

```

## Update the properties of a report

Note that you must pass an entire array for the label as there can be instances of multiple updates in the labels (mix of add/label).

Set to null for the fields that you don't want to update.
Remove fields you don't want to update.

This is so that we can leverage `ZodSchema.partial()` instead of hard-coding everything to be | null
This does not include assigning/re-assigning to departments/LGUs.

```json
PATCH /reports/{id}
Requires Bearer Token: YES
Path Params: id (references reports._id)
Query Params: N/A
Request Body:
{
  "title": "string | undefined",
  "description": "string | undefined",
  "labels": "string[] | undefined",
  "scope": "SCOPE | undefined",
  "categories": "string[] | undefined",
  "location": "Point | undefined",
  "severity": "SEVERITY | undefined",
  "internal_notes": "string | undefined",
  "status": "STATUS | undefined",
}

// Responses
200 OK
{
  "status": "success",
  "description": "string",
  "labels": ["string"],
  "scope": "string",
  "categories": ["string"],
  "location": {
    "x": "float",
    "y": "float"
  },
  "report_status": "string",
  "severity": "string",
  "votes": {
    "up": "integer",
    "down": "integer"
  }
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}

422 UNPROCESSABLE_ENTITY
{
  "status": "error",
  "description": "'labels' must be of type string array."
}
```

## Assign/Re-assign report to LGUs
```json
POST /reports/{id}/departments/{department_id}
POST /reports/{id}/users/{user_id}
Requires Bearer Token: YES
Path Params: id (references reports._id)
Query Params: is_reassign=bool
Request Body: N/A

// Responses
200 OK
{
  "status": "success"
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}
```

## Unassign a report from LGU/personnel
```json
DELETE /reports/{id}/departments/{department_id}
DELETE /reports/{id}/users/{user_id}
Requires Bearer Token: YES
Path Params: id (references reports._id)
Query Params: N/A
Request Body: N/A

// Responses
200 OK
{
  "status": "success"
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}
```

```json
Close/Resolve a report

DELETE /reports/{id}
Requires Bearer Token: YES
Path Params: id (references reports._id)
Query Params: N/A
Request Body: N/A

// Responses
200 OK
{
  "status": "success"
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}
```

## Get all the labels of a report
```json
GET /reports/{id}/labels
Requires Bearer Token: YES
Path Params: id (references reports._id)
Query Params: N/A
Request Body: N/A

// Responses
200 OK
{
  "status": "success",
  "labels": ["string"]
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}
```

## Updates the vote count of a report
```json
PATCH /reports/{id}/vote
Requires Bearer Token: YES
Path Params: id (references reports._id)
Query Params:
- type = "upvote" | "downvote"
- action="add" | "sub"
Request Body: N/A

// Responses
200 OK
{
  "status": "success",
  "upvotes": "integer",
  "downvotes": "integer"
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}
```

## Get the history timeline of a report
```json
GET /reports/{report_id}/history
Requires Bearer Token: YES
Path Params: report_id (references reports._id)
Query Params: N/A
Request Body: N/A

// Responses
200 OK
{
  "status": "success",
  "history": [
    {
      "timestamp": "string",
      "action": "string",         // Check ACTION enum
      "actionee": {
        "name": "string",
        ...other data about users
      }
      "metadata": {},
    },
    {
      "timestamp": "string",
      "action": "string",         // Check ACTION enum
      "actionee": {
        "name": "string",
        ...other data about users
      }
      "metadata": {
        "comment": "string",
        "upvote": "integer"
      },
    }
  ]
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}
```

# Departments

## Create a new department
```json
POST /departments
Requires Bearer Token: YES
Path Params: N/A
Query Params: N/A
Request Body:
{
  "name": "string",
  "shortname": "string | null",
  "contact": "string | null",
  "email": "string | null",
  "headquarter_address": "string | null",
  "headquarter_location": {
    "x": "float",
    "y": "float"
  }
}

// Responses
200 OK
{
  "status": "success",
  "id": "string",
  "name": "string",
  "shortname": "string | null",
  "contact": "string | null",
  "email": "string | null",
  "headquarter_address": "string | null",
  "headquarter_location": {
    "x": "float",
    "y": "float"
  }
  "members": [],      // empty for now, use POST /departments/members to add
  "roles": []
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}

422 UNPROCESSABLE_ENTITY
{
  "status": "error",
  "description": "x-coordinate in 'headquarter_location' field must be of float type"
}
```

## Get details about a department
```json
GET /departments/{id}
Requires Bearer Token: YES
Path Params: id (references departments._id)

// Responses
200 OK
{
  "status": "success",
  "id": "string",
  "name": "string",
  "shortname": "string | null",
  "contact": "string | null",
  "email": "string | null",
  "headquarter_address": "string | null",
  "headquarter_location": {
    "x": "float",
    "y": "float"
  }
  "members": [
    {
      "id": "string",
      "type": "string",
      "clerk_id": "string",
      ...other data about user
    }
  ],      // empty for now, use POST /departments/{id}/members{id} to add
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}

404 NOT FOUND
{
  "status": "error",
  "description": "Department not found."
}
```

## Update properties for department

Similar to reports, fields with null will not be updated.

```json
PATCH /departments/{id}
Requires Bearer Token: YES
Path Params: id (references reports._id)
Query Params: N/A
Request Body:
{
  "name": "string | null",
  "shortname": "string | null",
  "contact": "string | null",
  "email": "string | null",
  "headquarter_location": "Point | null",
  "headquarter_address": "string | null"
}

// Responses
200 OK
{
  "status": "success",
  "id": "string",
  "name": "string",
  "shortname": "string | null",
  "contact": "string | null",
  "email": "string | null",
  "headquarter_address": "string | null",
  "headquarter_location": {
    "x": "float",
    "y": "float"
  }
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}

422 UNPROCESSABLE_ENTITY
{
  "status": "error",
  "description": "'labels' must be of type string array."
}
```

## Create a member

```json
POST /members
Requires Bearer Token: YES
Path Params: N/A
Query Params: N/A
Request Body:
{
  "role_id": "string",
  "user_id": "string",   // clerk_id. This will not be inferred from auth header
                         // since admins can create members.
  "department_id": "string",
  "name": "string",
  "email": "string?",
  "phone": "string?",
  "avatar": "string?"    // link to blob storage. Uses default pfp if null
}

// Responses
200 OK
{
  "status": "success"
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}

404 NOT_FOUND
{
  "status": "error",
  "description": "Either the `department_id` or `user_id` is not found."
}

422 UNPROCESSABLE_ENTITY
{
  "status": "error",
  "description": "'role' must be of type string."
}
```

## Connect a member of a department to another member
```json
POST /members/{user_id1}/{user_id2}
Requires Bearer Token: YES
Path Params: id=department_id, user_id1=user_id, user_id2=user_id (lgu_members._id)
Query Params: N/A
Request Body: N/A

// Responses
200 OK
{
  "status": "success"
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}

404 NOT_FOUND
{
  "status": "error",
  "description": "One of `department_id, `user_id1`, `user_id2` is not found."
}
```

# Roles

## Create Role

```json
POST /roles
Requires Bearer Token: YES
Path Params: N/A
Query Params: N/A
Request Body:
{
  "name": "string",
  "description": "string?",
  "importance": "integer",
  "parent_role": "string",   // null if there is no parent role
  "clearance_level": "string",
  "access_scope": ["string"],
}

// Responses
200 OK
{
  "status": "success",
  "id": "string",
  "name": "string",
  "description": "string?",
  "importance": "integer",
  "parent_roles": "string[]",
  "clearance_level": "string",
  "access_scope": ["string"],
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}

422 UNPROCESSABLE_ENTITY
{
  "status": "error",
  "description": "'importance' field must be of integer type"
}
```

## Get Role By ID
```json
GET /roles/{id}
Requires Bearer Token: YES
Path Params: id (ref roles._id)
Query Params: N/A
Request Body: N/A

// Responses
200 OK
{
  "status": "success",
  "id": "string",
  "name": "string",
  "description": "string?",   // null if none
  "importance": "integer",
  "parent_role": "string?",   // null if there is no parent role
  "clearance_level": "string",
  "access_scope": ["string"],
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}
```

# Comments

## Add new comment on a report

```json
POST /reports/{id}/comments
Requires Bearer Token: YES
Path Params: id (references reports._id)
Query Params: N/A
Request Body:
{
  "text": "string"
}

// Responses
200 OK
{
  "status": "success",
  "id": "string",
  "text": "string"
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}

422 UNPROCESSABLE_ENTITY
{
  "status": "error",
  "description": "'text' field must be of string type"
}
```

# Statistics

Get the statistics of reports from a department

```json
GET /departments/{id}/statistics
Requires Bearer Token: YES
Path Params: id (references reports._id)
Query Params:
- days=integer  // last nth day
Request Body: N/A

// Responses
200 OK
{
  "status": "success",
  "total_reports": "integer",
  "new": "integer",
  "triaged": "integer",
  "in_progress": "integer",
  "resolved": "integer",
  "rejected": "integer",
  "avg_resol_time": "string"
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}
```

## Get the statistics of reports

```json
GET /statistics
Requires Bearer Token: YES
Path Params: N/A
Query Params:
- department = department_id
- category = string
- scope = string
- severity = string
- location = unknown
Request Body: N/A
// Responses

200 OK
{
  "status": "success",
  "total": "integer",
  "new": "integer",
  "triaged": "integer",
  "in_progress": "integer",
  "resolved": "integer",
  "rejected": "integer",
  "avg_resol_time": "integer | null"
}

401 UNAUTHORIZED
{
  "status": "error",
  "description": "Unauthorized. Missing 'Authorization' header."
}

422 UNPROCESSABLE_ENTITY
{
  "status": "error",
  "description": "'text' field must be of string type"
}
```

location might need fancy reverse geocode stuff to map point (x,y) to generic City, Province.

category scope severity should probably be enums.

`avg_resol_time` is in milliseconds computed by averaging (`Report.metadata.dateClosed - Report.createdAt`) of resolved reports. null if uncomputable (filter doesnt return any resolved report)

