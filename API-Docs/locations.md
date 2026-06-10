# Location API Documentation

The Location API manages states and cities for location-based portfolios and user configurations.

---

## Public Endpoints

### 1. Get States

Retrieve all active states.

**Endpoint:** `GET /api/public/locations/states`

**Query Parameters:**
- `countryId` (optional) - Filter by country ID
- `countrySlug` (optional) - Filter by country slug
- `slug` (optional) - Filter by state slug
- `stateCode` (optional) - Filter by state code

**Response:**
```json
{
  "success": true,
  "message": "States retrieved successfully",
  "data": [
    {
      "id": 5,
      "name": "Delhi",
      "slug": "delhi",
      "stateCode": "DL",
      "countryId": 1,
      "countrySlug": "india"
    }
  ]
}
```

---

### 2. Get Cities

Retrieve all active cities.

**Endpoint:** `GET /api/public/locations/cities`

**Query Parameters:**
- `stateId` (optional) - Filter by state ID
- `stateSlug` (optional) - Filter by state slug
- `slug` (optional) - Filter by city slug
- `cityTier` (optional) - Filter by city tier (`tier_1`, `tier_2`, `tier_3`, `tier_4`, `tier_5`)
- `stateCode` (optional) - Filter by state code

**Response:**
```json
{
  "success": true,
  "message": "Cities retrieved successfully",
  "data": [
    {
      "id": 10,
      "name": "Delhi",
      "slug": "delhi",
      "stateId": 5,
      "stateSlug": "delhi",
      "stateCode": "DL",
      "districtCode": "DL-01",
      "latitude": "28.61390000",
      "longitude": "77.20900000",
      "cityTier": "tier_1",
      "state": {
        "id": 5,
        "name": "Delhi",
        "slug": "delhi"
      }
    }
  ]
}
```

---

### 3. Get Cities by City Tier

Retrieve all active cities belonging to a specific city tier.

**Endpoint:** `GET /api/public/locations/cities/tier/:cityTier`

**Example:** `GET /api/public/locations/cities/tier/tier_1`

**Response:**
```json
{
  "success": true,
  "message": "Cities retrieved successfully",
  "data": [
    {
      "id": 10,
      "name": "Delhi",
      "slug": "delhi",
      "stateId": 5,
      "stateSlug": "delhi",
      "stateCode": "DL",
      "districtCode": "DL-01",
      "latitude": "28.61390000",
      "longitude": "77.20900000",
      "cityTier": "tier_1",
      "state": {
        "id": 5,
        "name": "Delhi",
        "slug": "delhi"
      }
    }
  ]
}
```
