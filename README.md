🛒 14All (Local Grocery Ordering Platform)
An AI-powered hyperlocal marketplace connecting customers with nearby kirana stores using real-time order intelligence and WhatsApp-powered communication "Vocal for Local" marketplace boosting neighborhood commerce through predictive business analytics, real-time service tracking, civic reporting, and hyper-local community engagement.

Python HTML CSS JavaScript Status
🚀 Live Demo
🌐 Customer Flow: customer.html
🌐 Shopkeeper Dashboard: shopkeeper.html

📌 Overview
Local Grocery Ordering Platform is a lightweight hyperlocal commerce demo that combines:
🛍 Nearby shop discovery
📦 Real-time cart & ordering
📲 WhatsApp integration (click-to-chat)
🧪 Shopkeeper order simulation
📍 Location-based shop listing

Users can:
Browse shops near their area
View products with prices & quantity controls
Add items to cart
Checkout with UPI ID display
Receive order confirmation with success animation

Shopkeepers can:
See incoming orders slide in automatically
Accept or reject orders
Hear sound alerts on new orders
View all order history

✨ Features
🛍 Nearby Shop Discovery
The platform displays 3 mock kirana stores with:
Shop name & address
Distance from user (in km)
Star rating
“View Store” button
📦 Product Browsing & Cart
Each shop detail page shows product cards with:
Product name & price
Emoji / colored placeholder image
Add (+), quantity counter, and minus (-) buttons
Cart badge updates in real time with bounce animation
🧾 Checkout with UPI Display
The checkout screen shows:
Pre-filled delivery address (editable)
UPI ID of the shopkeeper (e.g. ramesh@paytm)
Green “Place Order” button
On success:
✅ Checkmark animation
🎉 “Order Placed!” with order ID & delivery time
📞 “Call Shop” button (mock)
📲 WhatsApp Click-to-Chat
Every shop detail page includes a “Chat on WhatsApp” button that opens:
https://wa.me/91XXXXXXXXXX?text=Hi...
No API needed – works immediately on any device.
🧪 Shopkeeper Dashboard (Demo)
The dashboard simulates real-time order inflow:
Orders arrive every 5 seconds with a slide-in animation
Each card shows customer name, items, total, and address
Accept (✅) and Reject (❌) buttons
Sound notification using Web Audio API
Empty state when no orders remain

🖥 Frontend
Built using:
HTML5
CSS3
Vanilla JavaScript
Frontend features:
Mobile-first responsive design (360px base)
Soft green/white glassmorphism theme
Rounded corners, subtle shadows, smooth transitions
Floating cart icon with badge
Bottom navigation bar (Home, Cart, Orders, Profile)
Loading spinners & empty state messages

⚙ Backend
Currently a mock frontend-only demo.
Planned future backend:
Python (Flask) or Node.js
Real-time order push via WebSockets
Twilio WhatsApp Business API for automated notifications
User authentication via phone OTP

🧠 Tech Stack
Technology Purpose
HTML5 / CSS3 Frontend structure & styling
Vanilla JavaScript App logic & navigation
Web Audio API New order notification beep
OpenStreetMap (planned) Live shop location mapping
Twilio API (planned) WhatsApp order notifications
Render / Vercel (future) Deployment

📂 Project Structure
local-grocery-platform/
│
├── customer.html # Customer ordering flow (single file)
├── shopkeeper.html # Shopkeeper order dashboard (single file)
│
└── README.md # This file

🛠 Installation Guide (Demo)
1️⃣ Clone Repository
git clone https://github.com/your-username/local-grocery-platform.git
cd local-grocery-platform
2️⃣ Open Demo
Simply open the HTML files in any browser:
customer.html → Customer ordering app
shopkeeper.html → Shopkeeper dashboard
No server, no dependencies required.
For WhatsApp click-to-chat to work, replace the placeholder numbers in wa.me links with real numbers (works on mobile WhatsApp app).

🌐 Planned API Endpoints (Future)
Customer / Order APIs
POST /api/orders
Request
{
"shopid": "rameshkirana",
"items": [
{ "name": "Milk", "qty": 2, "price": 50 },
{ "name": "Bread", "qty": 1, "price": 35 }
],
"address": "123, Green Apartments, Sector 62",
"customerphone": "9876543210"
}
Response
{
"success": true,
"orderid": "ORD-20241005-001",
"shopkeeperwhatsapp": "ramesh@paytm"
}
Shopkeeper APIs
GET /api/shop/orders?shopid=ramesh_kirana
Response
{
"orders": [
{
"id": "ORD-20241005-001",
"customer": "Amit",
"items": ["Milk x2", "Bread x1"],
"total": 135,
"status": "pending"
}
]
}
POST /api/orders/accept
POST /api/orders/reject
🚀 Deployment (Future)
Frontend: Vercel / Netlify (static)
Backend: Render / Railway (Flask/Node)
Database: MongoDB / PostgreSQL
Notifications: Twilio WhatsApp API
📈 Future Improvements
📲 Real WhatsApp notification using Twilio
🔐 Phone OTP authentication
📍 Live location-based shop discovery (map view)
📊 Order status tracking (Accepted → Packing → Out for delivery)
💳 Online payment (Razorpay / PhonePe)
🛒 Shop inventory management with stock counters
🌟 Rating & review system for shops
📦 Delivery partner assignment
🧠 Business Logic – Shopkeeper Conflict
The platform uses an open marketplace model:
All shops within delivery range appear to the customer.
Each shop sets their delivery radius (default 2 km).
No exclusivity – if two shops serve the same area, both are shown.
Customer chooses based on price, rating, or distance.
Future: “Preferred Vendor” badge for high-rated shops.

This avoids direct conflict by giving every shop equal visibility while letting customers decide.
🤝 Contributing
Contributions are welcome.
Please open an issue or pull request for any improvements.
🛡 License
This project is licensed under the MIT License.
👨‍💻 Authors
Developed by [Ayan , Jay, Zion, Sarvesh / 14ALL ]
📞 Support & Community
💬 For questions, open a GitHub Discussion or Issue.
⭐ Show Your Support
If this project helped you, please consider:
⭐ Starring this repository
🍴 Forking it to contribute
📢 Sharing it with local shopkeepers
💖 Following for more updates
🛠 Contribute improvements – backend integration, WhatsApp API, live location, and more.
