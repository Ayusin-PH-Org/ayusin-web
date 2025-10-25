# MongoDB Schema
Notes:

Types with `?` indicates nullable data type.

Types with CAPS_LOCK indicates string with enum validation

"version" is in a form of string following the convention "major.minor" (We dont need to check this rn but might be handy in the future).

## Collections
### Reports
```json
// reports
{
  "_id": "Object ID",
  "version": "string",
  "created_at": "Timestamp",
  "updated_at": "Timestamp",
  "reported_by": "ref citizens._id[]", // pretty sure this is still needed even with webauthn
  "title": "string",
  "description": "string?",
  "internal": "ref comments._id[]",
  "labels": "string[]",    // Is this still needed?
  "severity": "SEVERITY",
  "status": "STATUS",
  "location": "Point", // GeoJSON: https://www.mongodb.com/docs/manual/reference/geojson/
  "history": "reports_history[]",
  "metadata": {
    "media_links": "string[]",
    "scope": "SCOPE",
    "categories": "string[]", // Debatable if this should be a string or enum
    "date_closed": "Timestamp?", // We dont need "date_opened" since its implicit from "created_at"
    "assigned_department_ids": "ref departments._id[]",
    "assigned_personnel_ids": "ref lgu_members._id[]"
  }
}
```

### Departments
```json
// departments
{
  "_id": "Object ID",
  "version": "string",
  "created_at": "Timestamp",
  "updated_at": "Timestamp",
  "name": "string",
  "shortname": "string?",
  "contact": "string?",
  "email": "string?",
  "headquarter_address": "string?",
  "headquarter_location": "Point", // required
  "members": "ref lgu_members._id[]",
  "roles": "ref roles._id[]"
}
```

### Reports log
```json
// reports_log
{
  "_id": "Object ID",
  "version": "string",
  "timestamp": "Timestamp",
  "action": "string",     // The frontend will handle which type of icon to render
  "actionee": "ref lgu_members._id | ref citizens._id",
  "metadata": "Object?",  // Debatable if this should be here. Keep it
  // if we want the "linear" history where both comments and actions are on
  // on the same timeline like ["action1", "comment1", "action2", ...].

  /* For action="comment", metadata is the following:
   "metadata": {
      "id": "ref comments._id",
   }
  */

  // For action≠"comment", metadata is null.
}
```

### Comments
```json
// comments
{
  "_id": "Object ID",
  "version": "string",
  "created_at": "Timestamp",
  "updated_at": "Timestamp",
  "text": "string",
  "user_id": "ref citizens._id",
  "report_id": "ref reports._id",
  "is_internal": "bool",
}
```

### Votes
```json
// votes
// This is modelled in a way where the device will
// remember if you upvote/downvote on a report.
{
  "_id": "Object ID",
  "version": "string",
  "created_at": "Timestamp",
  "user_id": "ref citizens._id",
  "report_id": "ref reports._id?",
  "kind": "'upvote' | 'downvote'"
}
```

### Users
```json
// users
{
  "_id": "Object ID",
  "version": "string",
  "created_at": "Timestamp",
  "updated_at": "Timestamp",
  "user_id": "string",       // only for LGUs
  "type": "'lgu_member' | 'citizen'",
  "name": "string?",
  "email": "string?",
  "phone": "string?",
  "department": "ref departments._id?",
  "role": "ref roles._id?",
  "relationships": "ref users.id[]",
  "avatar": "string?",

  "credential_id": "string",
  "public_key": "string",
  "counter": "integer"
}
```

```json
// roles
{
  "_id": "ObjectId",
  "version": "string",
  "created_at": "Timestamp",
  "updated_at": "Timestamp",
  "name": "string",
  "description": "string?",
  "importance": "integer",
  "parent_role": "ref roles_.id",
  "clearance_level": "string",
  "access_scope": "string[]"
}
```

### Enums
```
SCOPE
- Brgy
- City
- Province
- Regional
- National

STATUS
- Todo
- Ready
- In Progress
- Done
- Rejected

SEVERITY
- High
- Medium
- Low
```

### Categories
  - Public Safety & Crime (PNP, DRRMO)
      - Serious Crime, Physical Assault, Theft/Robbery, Harassment, Missing Person, Illegal Drugs, Vandalism
  - Fire & Rescue (BFP, DRRMO)
      - Fire, Smoke/Hazmat, Vehicle Crash, Building Collapse, Water Rescue
  - Disaster & Hazards (DRRMO, Engineering, CENRO)
      - Flood, Earthquake, Landslide, Storm Surge, Fallen Tree/Debris, Sinkhole
  - Traffic & Transport (Traffic Mgmt, PNP-HPG, Engineering)
      - Illegal Parking, Roadblocks/Obstruction, Sidewalk Encroachment, PUV Violations, Traffic Light/Signal Outage
  - Roads & Infrastructure (City Engineering)
      - Pothole, Road Damage, Open Manhole, Broken Street Lamp, Broken Signs, Drainage Clogged, Bridge Damage
  - Utilities (Concessionaires + LGU liaison)
      - Electricity Outage, Water Outage/Leak, Internet Outage, Telecom Pole Hazard, Gas Leak
  - Health & Sanitation (City Health, Sanitation)
      - Dengue/Vector Control, Communicable Disease, Food Poisoning, Dead Animal, Septic Overflow
  - Environment & Solid Waste (CENRO/Sanitation)
      - Garbage Pile‑up, Illegal Dumping, Burning of Waste, Air/Water/Noise Pollution, Tree Cutting
  - Urban Housing & Zoning (Zoning/Building Official)
      - Illegal Installations, Illegal Construction, Squatting/Informal Settlers, Building Permit Violation, Right‑of‑Way Encroachment
  - Business & Consumer Protection (BPLO/Mayor’s Office)
      - Scam/Fraud, Price Gouging, Fake Goods, Unlicensed Vendor, Noise Permit Violation
  - Governance & Accountability (Mayor’s Office/Legal/Internal Audit)
      - Corruption, Inaction, Bribery Solicitation, Abuse of Authority, Red Tape
  - Social Services & Welfare (CSWDO)
      - Homeless Assistance, Child at Risk, Elderly in Distress, GBV Support, Mental Health Crisis
  - Animal Welfare (Vet Office/DA)
      - Stray Aggressive Dog, Animal Cruelty, Rabies Suspected, Animal Carcass
  - Education & Community Facilities (DepEd/LGU Facilities)
      - School Safety, Broken Facilities, Park/Plaza Issues, Library/Barangay Hall Issues
  - Agriculture & Fisheries (City Agriculturist/DA/BFAR)
      - Livestock Disease, Crop Pest, Fish Kill, Irrigation Issue

  Default Department Mapping (suggested)

  - DRRMO: Disaster & Hazards; assists Fire/Rescue; coordinates emergencies
  - BFP: Fires/rescues; PNP: crime/public safety; Traffic Mgmt: traffic
  - Engineering: roads/infrastructure; Sanitation/CENRO: waste/environment
  - City Health: disease/vector control; BPLO: business compliance
  - Zoning/Building Official: illegal construction/installations
  - Social Welfare: vulnerable persons; Agriculture/Vet: agri/animal welfare
  - Utilities Liaison: coordinates with electric/water/telco providers

### Labels
Pick labels na visible sa report status in front. Baka kasi madami if lahat visible sa report. Alternatively, separate nalang natin sila instead of iisang "Status Labels".

```
STATUS LABELS:
Initial Processing:

SUBMITTED
RECEIVED
PENDING REVIEW
UNDER REVIEW
AWAITING TRIAGE
TRIAGED              <- Regular citizens might not understand this. Maybe make it visible sa LGUs nalang.
PENDING APPROVAL
APPROVED
REJECTED
REQUIRES MORE INFO
INFO REQUESTED
AWAITING CLARIFICATION

Assignment & Scheduling:

ASSIGNED             <- Irrelevant, since "assigned_personnel"/"assigned_department" exists
DEPARTMENT ASSIGNED  <- Irrelevant
CONTRACTOR ASSIGNED  <- Irrelevant
SCHEDULED
AWAITING SCHEDULING
IN QUEUE
PRIORITIZED          <- Move to "ACTION" enum. "Prioritized to Urgent"
ESCALATED            <- Move to "ACTION" enum, tapos "Escalated to severe" something message.
REASSIGNED           <- Move to "ACTION" enum nalang siguro. "Reassigned to DPWH"

Active Work:

WORK IN PROGRESS
UNDER INVESTIGATION
UNDER REPAIR
ON-SITE WORK
MATERIALS ORDERED
AWAITING PARTS
AWAITING PERMITS
CONTRACTOR EN ROUTE
WORK PAUSED
ON HOLD
TEMPORARILY SUSPENDED

Quality Control:

WORK COMPLETED
PENDING INSPECTION
UNDER INSPECTION
INSPECTION PASSED
INSPECTION FAILED
REWORK REQUIRED
AWAITING VERIFICATION
PENDING APPROVAL

Final Resolution:

RESOLVED
COMPLETED
VERIFIED FIXED
CLOSED - RESOLVED
CLOSED - DUPLICATE
CLOSED - NOT ACTIONABLE
CLOSED - OUTSIDE JURISDICTION
CLOSED - INSUFFICIENT INFO
CLOSED - UNABLE TO LOCATE
CLOSED - NO VIOLATION FOUND
CLOSED - RESOLVED BY THIRD PARTY   <- Better siguro if imemention natin. "Resolved by community-effort"
CLOSED - WITHDRAWN BY REQUESTOR
REFERRED TO OTHER AGENCY           <- Similar siya sa REASSIGNED na case.
```

### Goal

Timeline in reports.
[timeline](https://uploads.linear.app/bc92ba7b-fbd2-4f8e-8b58-c795658ce1c2/106248cb-afcc-415a-828b-c06fd56ae4cb/f697c285-de61-4ef8-81f2-8e1167886150)

