# **FiteMeal API Documentation**

## **Base URL**
```
http://localhost:3000/api
```

## **Authentication**
Most endpoints require JWT authentication. Include the following headers:
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

The middleware automatically extracts user information and adds these headers:
- `x-user-email`: User's email
- `x-user-id`: User's ID

---

## **1. Authentication Endpoints**

### **POST /register**
Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "gender": "male",
  "dateOfBirth": "1990-01-01",
  "height": 175,
  "weight": 70,
  "activityLevel": "active"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "userId123",
    "email": "john@example.com",
    "username": "johndoe"
  }
}
```

### **POST /login**
Login user and get JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "userId123",
    "email": "john@example.com",
    "username": "johndoe"
  }
}
```

---

## **2. User Profile Management**

### **GET /profiles/{id}**
Get user profile by ID

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id`: User ID

**Response (200):**
```json
{
  "id": "userId123",
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "gender": "male",
  "age": 35,
  "height": 175,
  "weight": 70,
  "activityLevel": "active",
  "isPremium": false
}
```

### **PATCH /profiles/{id}**
Update user profile

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id`: User ID

**Request Body:**
```json
{
  "name": "John Updated",
  "height": 180,
  "weight": 75,
  "activityLevel": "very active"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully!"
}
```

---

## **3. Meal Planning**

### **POST /add-prepmeal**
Generate meal preparation plan

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "My Meal Prep Plan",
  "age": 25,
  "weight": 70,
  "height": 175,
  "gender": "pria",
  "activity_level": "Active",
  "goals": "weight loss",
  "preferences": "vegetarian, low carb",
  "duration": 7,
  "startDate": "2025-06-30"
}
```

**Response (201):**
```json
{
  "resp": {
    "name": "My Meal Prep Plan",
    "userId": "ObjectId",
    "startDate": "2025-06-30",
    "dailyCalories": 1800,
    "todoList": [
      {
        "day": 1,
        "date": "2025-06-30",
        "dailyCalories": 1800,
        "breakfast": {
          "name": "Nasi Gudeg Yogya",
          "imageUrl": "",
          "calories": 450,
          "ingredients": ["nasi", "gudeg", "ayam"],
          "recipes": ["masak nasi", "hangatkan gudeg"],
          "isDone": false,
          "notes": ""
        },
        "lunch": {
          "name": "Soto Ayam",
          "imageUrl": "",
          "calories": 630,
          "ingredients": ["ayam", "kunyit", "serai"],
          "recipes": ["rebus ayam", "buat kuah soto"],
          "isDone": false,
          "notes": ""
        },
        "dinner": {
          "name": "Gado-gado",
          "imageUrl": "",
          "calories": 720,
          "ingredients": ["tahu", "tempe", "kangkung"],
          "recipes": ["rebus sayuran", "buat bumbu kacang"],
          "isDone": false,
          "notes": ""
        }
      }
    ]
  }
}
```

### **GET /add-prepmeal**
Get user's meal prep plans

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "data": [
    {
      "_id": "ObjectId",
      "name": "My Meal Prep Plan",
      "userId": "ObjectId",
      "startDate": "2025-06-30",
      "todoList": [/* meal plan array */]
    }
  ]
}
```

### **GET /add-prepmeal/{id}**
Get specific meal prep plan by ID

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id`: Plan ID

**Response (200):**
```json
{
  "_id": "planId123",
  "name": "My Meal Prep Plan",
  "userId": "userId123",
  "startDate": "2025-06-30",
  "todoList": [/* meal plan array */]
}
```

---

## **4. Exercise Management**

### **POST /excercise**
Generate exercise plan

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "My Exercise Plan",
  "age": 25,
  "height": 175,
  "weight": 70,
  "gender": "pria",
  "goals": "weight loss",
  "equipment": "dumbbells, resistance bands",
  "duration": 7,
  "startDate": "2025-06-30"
}
```

**Response (201):**
```json
{
  "data": {
    "name": "My Exercise Plan",
    "userId": "ObjectId",
    "startDate": "2025-06-30",
    "todoList": [
      {
        "day": 1,
        "date": "2025-06-30",
        "exerciseName": "Full Body Workout",
        "totalSession": "45 menit",
        "caloriesBurned": 300,
        "sets": 3,
        "reps": "12-15",
        "targetMuscle": "full body"
      }
    ]
  }
}
```

### **GET /excercise/{id}**
Get exercise plan by ID

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id`: Exercise plan ID

**Response (200):**
```json
{
  "_id": "exerciseId123",
  "name": "My Exercise Plan",
  "userId": "userId123",
  "startDate": "2025-06-30",
  "todoList": [/* exercise plan array */]
}
```

---

## **5. Combined Meal & Exercise Plan**

### **POST /add-meal-exercise**
Generate combined meal and exercise plan

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Complete Health Plan",
  "age": 25,
  "weight": 70,
  "height": 175,
  "gender": "pria",
  "activity_level": "active",
  "goals": "weight loss",
  "preferences": "low carb, high protein",
  "equipment": "dumbbells, resistance bands, yoga mat",
  "duration": 7,
  "startDate": "2025-06-30"
}
```

**Response (201):**
```json
{
  "data": {
    "name": "Complete Health Plan",
    "userId": "ObjectId",
    "startDate": "2025-06-30",
    "dailyCalories": 1800,
    "duration": 7,
    "goal": "weight loss",
    "todoList": [
      {
        "day": 1,
        "date": "2025-06-30",
        "dailyCalories": 1800,
        "breakfast": {
          "name": "Pecel Sayur",
          "imageUrl": "",
          "calories": 450,
          "ingredients": ["tauge", "kacang panjang", "bayam"],
          "recipes": ["rebus sayuran", "buat sambal kacang"],
          "isDone": false,
          "notes": ""
        },
        "lunch": {
          "name": "Sup Ayam Bening",
          "imageUrl": "",
          "calories": 630,
          "ingredients": ["dada ayam", "wortel", "kentang"],
          "recipes": ["rebus ayam", "masukkan sayuran"],
          "isDone": false,
          "notes": ""
        },
        "dinner": {
          "name": "Tumis Tahu Brokoli",
          "imageUrl": "",
          "calories": 720,
          "ingredients": ["tahu", "brokoli", "wortel"],
          "recipes": ["goreng tahu", "tumis dengan sayuran"],
          "isDone": false,
          "notes": ""
        },
        "exercise": {
          "exerciseName": "Full Body Strength Training",
          "totalSession": "45 menit",
          "exercises": [
            {
              "name": "Push-ups",
              "sets": 3,
              "reps": "10-15",
              "restTime": "60 detik",
              "targetMuscle": "chest, shoulders, triceps",
              "equipment": "bodyweight"
            },
            {
              "name": "Squat dengan Dumbbells",
              "sets": 3,
              "reps": "15",
              "restTime": "90 detik",
              "targetMuscle": "kaki, glute",
              "equipment": "dumbbells"
            }
          ],
          "caloriesBurned": 300,
          "difficulty": "intermediate",
          "notes": "Fokus pada form yang benar"
        }
      }
    ]
  }
}
```

---

## **6. Smart Meal Generation**

### **POST /upload**
Generate meal plan from available ingredients (via photo upload)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
file: <image_file> (required)
plansId: "planId123" (required)
```

**Response (201):**
```json
{
  "notes": "Terlihat bahan-bahan untuk masakan Indonesia: beras sebagai karbohidrat utama, ayam sebagai protein, wortel sebagai vitamin",
  "userId": "userId123",
  "plansId": "planId123",
  "photoUrl": "https://example.com/ingredients.jpg",
  "todoList": [
    {
      "day": 1,
      "date": "2025-06-30",
      "dailyCalories": 1800,
      "breakfast": {
        "name": "Nasi Ayam Sederhana",
        "imageUrl": "",
        "calories": 450,
        "ingredients": ["beras", "ayam", "bawang putih"],
        "recipes": ["masak nasi", "tumis ayam dengan bawang putih"],
        "isDone": false,
        "notes": ""
      },
      "lunch": {
        "name": "Sup Wortel Ayam",
        "imageUrl": "",
        "calories": 630,
        "ingredients": ["wortel", "ayam", "bawang putih"],
        "recipes": ["potong wortel", "rebus dengan ayam"],
        "isDone": false,
        "notes": ""
      },
      "dinner": {
        "name": "Ayam Cabai",
        "imageUrl": "",
        "calories": 720,
        "ingredients": ["ayam", "cabai", "bawang putih"],
        "recipes": ["potong ayam", "tumis dengan cabai"],
        "isDone": false,
        "notes": ""
      }
    }
  ]
}
```

---

## **7. Grocery List Management**

### **POST /grocerylist**
Generate grocery list based on meal plan

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "id": "planId123"
}
```

**Response (201):**
```json
{
  "result": {
    "_id": "groceryListId123",
    "planId": "planId123",
    "userId": "userId123",
    "groceryList": [
      {
        "category": "Protein",
        "items": [
          {
            "name": "Ayam",
            "quantity": "1 kg",
            "estimated_price": "Rp 35.000"
          },
          {
            "name": "Telur",
            "quantity": "1 pak",
            "estimated_price": "Rp 25.000"
          }
        ]
      },
      {
        "category": "Sayuran",
        "items": [
          {
            "name": "Wortel",
            "quantity": "500 gr",
            "estimated_price": "Rp 8.000"
          },
          {
            "name": "Bayam",
            "quantity": "2 ikat",
            "estimated_price": "Rp 6.000"
          }
        ]
      }
    ],
    "totalEstimatedPrice": "Rp 74.000"
  }
}
```

### **GET /grocerylist/{id}**
Get grocery list by ID

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id`: Grocery list ID

**Response (200):**
```json
{
  "_id": "groceryListId123",
  "planId": "planId123",
  "userId": "userId123",
  "groceryList": [/* grocery items array */],
  "totalEstimatedPrice": "Rp 74.000"
}
```

---

## **8. Payment Integration**

### **POST /midtrans-token**
Get Midtrans payment token

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "gross_amount": 99000,
  "order_id": "order-123456789"
}
```

**Response (200):**
```json
{
  "token": "midtrans_token_here",
  "redirect_url": "https://app.sandbox.midtrans.com/snap/v2/vtweb/..."
}
```

### **POST /handle-payment**
Handle payment notification from Midtrans

**Request Body:**
```json
{
  "order_id": "order-123456789",
  "status_code": "200",
  "gross_amount": "99000.00",
  "signature_key": "signature_here",
  "transaction_status": "settlement"
}
```

**Response (200):**
```json
{
  "message": "Payment processed successfully"
}
```

---

## **Error Responses**

### **401 Unauthorized**
```json
{
  "message": "Unauthorized! Please login first!"
}
```

### **400 Bad Request**
```json
{
  "message": "Missing required fields: age, weight, height"
}
```

### **404 Not Found**
```json
{
  "message": "User not found"
}
```

### **500 Internal Server Error**
```json
{
  "message": "Internal server error occurred"
}
```

---

## **Data Models**

### **User Model**
```typescript
interface User {
  _id: ObjectId
  name: string
  username: string
  email: string
  password: string (hashed)
  gender: string
  dateOfBirth: string
  height: number
  weight: number
  activityLevel: string
  isPremium: boolean
}
```

### **Meal Plan Model**
```typescript
interface MealPlan {
  _id: ObjectId
  name: string
  userId: ObjectId
  startDate: string
  dailyCalories: number
  duration: number
  todoList: Array<{
    day: number
    date: string
    dailyCalories: number
    breakfast: MealItem
    lunch: MealItem
    dinner: MealItem
  }>
}

interface MealItem {
  name: string
  imageUrl: string
  calories: number
  ingredients: string[]
  recipes: string[]
  isDone: boolean
  notes: string
}
```

### **Exercise Plan Model**
```typescript
interface ExercisePlan {
  _id: ObjectId
  name: string
  userId: ObjectId
  startDate: string
  duration: number
  todoList: Array<{
    day: number
    date: string
    exerciseName: string
    totalSession: string
    exercises: Array<{
      name: string
      sets: number
      reps: string
      restTime?: string
      targetMuscle: string
      equipment: string
    }>
    caloriesBurned: number
    difficulty?: string
    notes: string
  }>
}
```

### **Combined Meal & Exercise Model**
```typescript
interface MealExercisePlan {
  _id: ObjectId
  name: string
  userId: ObjectId
  startDate: string
  dailyCalories: number
  duration: number
  goal: string
  todoList: Array<{
    day: number
    date: string
    dailyCalories: number
    breakfast: MealItem
    lunch: MealItem
    dinner: MealItem
    exercise: ExerciseItem
  }>
}

interface ExerciseItem {
  exerciseName: string
  totalSession: string
  exercises: Array<{
    name: string
    sets: number
    reps: string
    restTime?: string
    targetMuscle: string
    equipment: string
  }>
  caloriesBurned: number
  difficulty?: string
  notes: string
}
```

---

## **Additional Notes**

### **Authentication Flow**
1. Register with `/register` to create account
2. Login with `/login` to get JWT token
3. Include token in Authorization header for protected endpoints
4. Middleware extracts user info and adds to request headers

### **Date Formats**
- Use ISO 8601 format: `YYYY-MM-DD` for dates
- Use `YYYY-MM-DDTHH:MM:SSZ` for timestamps

### **Activity Levels**
- `"inactive"`: Little to no exercise
- `"somewhat active"`: Light exercise 1-3 days/week
- `"active"`: Moderate exercise 3-5 days/week  
- `"very active"`: Hard exercise 6-7 days/week

### **Gender Options**
- `"pria"` or `"male"` for male
- `"wanita"` or `"female"` for female

### **Calorie Calculation**
- Uses BMR (Basal Metabolic Rate) formula
- **Male**: `10 * weight + 6.25 * height - 5 * age + 5`
- **Female**: `10 * weight + 6.25 * height - 5 * age - 161`
- Multiplied by activity factor (1.2 - 1.9)

### **File Upload**
- Supported formats: JPG, PNG, GIF
- Maximum file size: 5MB
- Images are analyzed using AI for ingredient recognition

### **Database Collections**
- `users`: User accounts and profiles
- `mealPlans`: Meal preparation plans
- `dataExercise`: Exercise plans
- `mealExercisePlans`: Combined meal and exercise plans
- `alternativeMeal`: Grocery lists
- `transactions`: Payment records

### **Rate Limiting**
- API requests are limited per user
- OpenAI requests have token limits
- Consider implementing caching for better performance

### **Security**
- All passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Sensitive endpoints require authentication
- Input validation using Zod schemas
