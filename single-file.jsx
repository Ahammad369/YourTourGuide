import { useState, useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const INDIA_CITIES = [
  // TIER 1 METROS
  { name:"Mumbai", state:"Maharashtra", tier:1, lat:19.076, lng:72.877 },
  { name:"Delhi", state:"Delhi", tier:1, lat:28.704, lng:77.102 },
  { name:"New Delhi", state:"Delhi", tier:1, lat:28.613, lng:77.209 },
  { name:"Bengaluru", state:"Karnataka", tier:1, lat:12.971, lng:77.594 },
  { name:"Bangalore", state:"Karnataka", tier:1, lat:12.971, lng:77.594 },
  { name:"Chennai", state:"Tamil Nadu", tier:1, lat:13.083, lng:80.270 },
  { name:"Kolkata", state:"West Bengal", tier:1, lat:22.572, lng:88.363 },
  { name:"Hyderabad", state:"Telangana", tier:1, lat:17.385, lng:78.487 },
  { name:"Pune", state:"Maharashtra", tier:1, lat:18.520, lng:73.856 },
  { name:"Ahmedabad", state:"Gujarat", tier:1, lat:23.022, lng:72.572 },
  // ANDHRA PRADESH
  { name:"Tirupati", state:"Andhra Pradesh", tier:2, lat:13.629, lng:79.419 },
  { name:"Visakhapatnam", state:"Andhra Pradesh", tier:2, lat:17.686, lng:83.218 },
  { name:"Vijayawada", state:"Andhra Pradesh", tier:2, lat:16.506, lng:80.648 },
  // TELANGANA
  { name:"Warangal", state:"Telangana", tier:2, lat:17.977, lng:79.599 },
  // TAMIL NADU
  { name:"Madurai", state:"Tamil Nadu", tier:2, lat:9.919, lng:78.120 },
  { name:"Coimbatore", state:"Tamil Nadu", tier:2, lat:11.017, lng:76.955 },
  { name:"Ooty", state:"Tamil Nadu", tier:2, lat:11.413, lng:76.695 },
  { name:"Kodaikanal", state:"Tamil Nadu", tier:3, lat:10.234, lng:77.489 },
  { name:"Kanyakumari", state:"Tamil Nadu", tier:2, lat:8.088, lng:77.552 },
  { name:"Rameswaram", state:"Tamil Nadu", tier:2, lat:9.288, lng:79.313 },
  { name:"Mahabalipuram", state:"Tamil Nadu", tier:3, lat:12.620, lng:80.193 },
  { name:"Pondicherry", state:"Puducherry", tier:2, lat:11.934, lng:79.830 },
  { name:"Thanjavur", state:"Tamil Nadu", tier:2, lat:10.787, lng:79.139 },
  // KERALA
  { name:"Kochi", state:"Kerala", tier:1, lat:9.931, lng:76.267 },
  { name:"Thiruvananthapuram", state:"Kerala", tier:1, lat:8.524, lng:76.936 },
  { name:"Munnar", state:"Kerala", tier:3, lat:10.089, lng:77.059 },
  { name:"Alleppey", state:"Kerala", tier:3, lat:9.498, lng:76.339 },
  { name:"Thekkady", state:"Kerala", tier:3, lat:9.600, lng:77.170 },
  { name:"Wayanad", state:"Kerala", tier:3, lat:11.618, lng:76.082 },
  { name:"Kozhikode", state:"Kerala", tier:2, lat:11.258, lng:75.780 },
  // KARNATAKA
  { name:"Mysuru", state:"Karnataka", tier:2, lat:12.296, lng:76.639 },
  { name:"Mysore", state:"Karnataka", tier:2, lat:12.296, lng:76.639 },
  { name:"Hampi", state:"Karnataka", tier:3, lat:15.335, lng:76.462 },
  { name:"Coorg", state:"Karnataka", tier:3, lat:12.329, lng:75.814 },
  { name:"Gokarna", state:"Karnataka", tier:3, lat:14.549, lng:74.316 },
  { name:"Mangaluru", state:"Karnataka", tier:2, lat:12.914, lng:74.856 },
  // MAHARASHTRA
  { name:"Nashik", state:"Maharashtra", tier:2, lat:19.997, lng:73.791 },
  { name:"Aurangabad", state:"Maharashtra", tier:2, lat:19.877, lng:75.343 },
  { name:"Shirdi", state:"Maharashtra", tier:2, lat:19.766, lng:74.477 },
  { name:"Lonavala", state:"Maharashtra", tier:3, lat:18.746, lng:73.404 },
  { name:"Mahabaleshwar", state:"Maharashtra", tier:3, lat:17.924, lng:73.658 },
  // GOA
  { name:"Goa", state:"Goa", tier:1, lat:15.299, lng:74.124 },
  { name:"Panaji", state:"Goa", tier:2, lat:15.499, lng:73.824 },
  // GUJARAT
  { name:"Surat", state:"Gujarat", tier:1, lat:21.170, lng:72.831 },
  { name:"Vadodara", state:"Gujarat", tier:2, lat:22.307, lng:73.181 },
  { name:"Dwarka", state:"Gujarat", tier:2, lat:22.237, lng:68.968 },
  { name:"Somnath", state:"Gujarat", tier:2, lat:20.888, lng:70.401 },
  { name:"Rann of Kutch", state:"Gujarat", tier:3, lat:23.733, lng:69.859 },
  // RAJASTHAN
  { name:"Jaipur", state:"Rajasthan", tier:1, lat:26.912, lng:75.787 },
  { name:"Jodhpur", state:"Rajasthan", tier:2, lat:26.292, lng:73.017 },
  { name:"Udaipur", state:"Rajasthan", tier:2, lat:24.585, lng:73.712 },
  { name:"Jaisalmer", state:"Rajasthan", tier:2, lat:26.914, lng:70.916 },
  { name:"Pushkar", state:"Rajasthan", tier:3, lat:26.491, lng:74.552 },
  { name:"Ajmer", state:"Rajasthan", tier:2, lat:26.449, lng:74.638 },
  { name:"Bikaner", state:"Rajasthan", tier:2, lat:28.022, lng:73.312 },
  { name:"Chittorgarh", state:"Rajasthan", tier:3, lat:24.889, lng:74.624 },
  // UTTAR PRADESH
  { name:"Agra", state:"Uttar Pradesh", tier:2, lat:27.176, lng:78.008 },
  { name:"Varanasi", state:"Uttar Pradesh", tier:2, lat:25.317, lng:83.013 },
  { name:"Ayodhya", state:"Uttar Pradesh", tier:2, lat:26.795, lng:82.194 },
  { name:"Mathura", state:"Uttar Pradesh", tier:2, lat:27.492, lng:77.673 },
  { name:"Vrindavan", state:"Uttar Pradesh", tier:3, lat:27.576, lng:77.697 },
  { name:"Lucknow", state:"Uttar Pradesh", tier:1, lat:26.847, lng:80.947 },
  { name:"Prayagraj", state:"Uttar Pradesh", tier:2, lat:25.435, lng:81.846 },
  { name:"Allahabad", state:"Uttar Pradesh", tier:2, lat:25.435, lng:81.846 },
  // MADHYA PRADESH
  { name:"Bhopal", state:"Madhya Pradesh", tier:1, lat:23.259, lng:77.413 },
  { name:"Khajuraho", state:"Madhya Pradesh", tier:3, lat:24.851, lng:79.920 },
  { name:"Ujjain", state:"Madhya Pradesh", tier:2, lat:23.182, lng:75.784 },
  { name:"Orchha", state:"Madhya Pradesh", tier:3, lat:25.351, lng:78.641 },
  { name:"Gwalior", state:"Madhya Pradesh", tier:2, lat:26.218, lng:78.182 },
  // PUNJAB & HARYANA
  { name:"Amritsar", state:"Punjab", tier:2, lat:31.634, lng:74.872 },
  { name:"Chandigarh", state:"Chandigarh", tier:1, lat:30.733, lng:76.779 },
  { name:"Ludhiana", state:"Punjab", tier:2, lat:30.900, lng:75.857 },
  // HIMACHAL PRADESH
  { name:"Shimla", state:"Himachal Pradesh", tier:2, lat:31.104, lng:77.167 },
  { name:"Manali", state:"Himachal Pradesh", tier:2, lat:32.239, lng:77.189 },
  { name:"Dharamsala", state:"Himachal Pradesh", tier:2, lat:32.219, lng:76.324 },
  { name:"McLeod Ganj", state:"Himachal Pradesh", tier:3, lat:32.242, lng:76.321 },
  { name:"Kullu", state:"Himachal Pradesh", tier:3, lat:31.958, lng:77.109 },
  { name:"Spiti Valley", state:"Himachal Pradesh", tier:3, lat:32.244, lng:78.036 },
  // UTTARAKHAND
  { name:"Rishikesh", state:"Uttarakhand", tier:2, lat:30.087, lng:78.268 },
  { name:"Haridwar", state:"Uttarakhand", tier:2, lat:29.945, lng:78.163 },
  { name:"Mussoorie", state:"Uttarakhand", tier:3, lat:30.459, lng:78.066 },
  { name:"Nainital", state:"Uttarakhand", tier:2, lat:29.381, lng:79.459 },
  { name:"Badrinath", state:"Uttarakhand", tier:3, lat:30.744, lng:79.493 },
  { name:"Kedarnath", state:"Uttarakhand", tier:3, lat:30.735, lng:79.066 },
  // WEST BENGAL
  { name:"Darjeeling", state:"West Bengal", tier:2, lat:27.041, lng:88.263 },
  { name:"Siliguri", state:"West Bengal", tier:2, lat:26.710, lng:88.430 },
  // ODISHA
  { name:"Bhubaneswar", state:"Odisha", tier:2, lat:20.296, lng:85.825 },
  { name:"Puri", state:"Odisha", tier:2, lat:19.810, lng:85.832 },
  { name:"Konark", state:"Odisha", tier:3, lat:19.887, lng:86.094 },
  // BIHAR
  { name:"Patna", state:"Bihar", tier:2, lat:25.594, lng:85.137 },
  { name:"Bodhgaya", state:"Bihar", tier:2, lat:24.695, lng:84.991 },
  { name:"Nalanda", state:"Bihar", tier:3, lat:25.136, lng:85.444 },
  // JHARKHAND
  { name:"Ranchi", state:"Jharkhand", tier:2, lat:23.344, lng:85.310 },
  // ASSAM & NORTHEAST
  { name:"Guwahati", state:"Assam", tier:2, lat:26.145, lng:91.736 },
  { name:"Kaziranga", state:"Assam", tier:3, lat:26.576, lng:93.171 },
  { name:"Shillong", state:"Meghalaya", tier:2, lat:25.574, lng:91.882 },
  { name:"Cherrapunji", state:"Meghalaya", tier:3, lat:25.285, lng:91.716 },
  { name:"Gangtok", state:"Sikkim", tier:2, lat:27.329, lng:88.612 },
  { name:"Aizawl", state:"Mizoram", tier:2, lat:23.727, lng:92.718 },
  // J&K / KASHMIR
  { name:"Srinagar", state:"Jammu & Kashmir", tier:2, lat:34.083, lng:74.797 },
  { name:"Gulmarg", state:"Jammu & Kashmir", tier:3, lat:34.057, lng:74.380 },
  { name:"Pahalgam", state:"Jammu & Kashmir", tier:3, lat:34.012, lng:75.315 },
  { name:"Jammu", state:"Jammu & Kashmir", tier:2, lat:32.726, lng:74.857 },
  { name:"Leh", state:"Ladakh", tier:2, lat:34.166, lng:77.584 },
  { name:"Kargil", state:"Ladakh", tier:3, lat:34.557, lng:76.124 },
  // ANDAMAN
  { name:"Port Blair", state:"Andaman & Nicobar", tier:2, lat:11.662, lng:92.746 },
];

const TOURIST_SPOTS_DB = {
  "Hyderabad": [
    { id:"hyd1",  name:"Charminar",                  rating:5, type:"Heritage",  distance:8,   visitTime:2, withinCity:true  },
    { id:"hyd2",  name:"Golconda Fort",               rating:5, type:"Heritage",  distance:11,  visitTime:3, withinCity:true  },
    { id:"hyd3",  name:"Hussain Sagar Lake",          rating:4, type:"Scenic",    distance:5,   visitTime:2, withinCity:true  },
    { id:"hyd4",  name:"Durgam Cheruvu Cable Bridge", rating:5, type:"Scenic",    distance:18,  visitTime:2, withinCity:true  },
    { id:"hyd5",  name:"Birla Mandir",                rating:5, type:"Spiritual", distance:6,   visitTime:2, withinCity:true  },
    { id:"hyd6",  name:"Salar Jung Museum",           rating:5, type:"Culture",   distance:8,   visitTime:3, withinCity:true  },
    { id:"hyd7",  name:"Chowmahalla Palace",          rating:5, type:"Heritage",  distance:8,   visitTime:2, withinCity:true  },
    { id:"hyd8",  name:"Ramoji Film City",            rating:4, type:"Culture",   distance:28,  visitTime:6, withinCity:true  },
    { id:"hyd9",  name:"Qutb Shahi Tombs",            rating:4, type:"Heritage",  distance:10,  visitTime:2, withinCity:true  },
    { id:"hyd10", name:"Laad Bazaar",                 rating:4, type:"Shopping",  distance:8,   visitTime:2, withinCity:true  },
    { id:"hyd11", name:"KBR National Park",           rating:4, type:"Nature",    distance:18,  visitTime:2, withinCity:true  },
    { id:"hyd12", name:"Ananthagiri Hills",           rating:5, type:"Nature",    distance:90,  visitTime:4, withinCity:false },
    { id:"hyd13", name:"Nagarjunasagar Dam",          rating:5, type:"Scenic",    distance:165, visitTime:5, withinCity:false },
  ],
  "Mumbai": [
    { id:"mum1",  name:"Gateway of India",            rating:5, type:"Heritage",  distance:3,   visitTime:2, withinCity:true  },
    { id:"mum2",  name:"Marine Drive",                rating:5, type:"Scenic",    distance:3,   visitTime:2, withinCity:true  },
    { id:"mum3",  name:"Elephanta Caves",             rating:5, type:"Heritage",  distance:11,  visitTime:3, withinCity:true  },
    { id:"mum4",  name:"Siddhivinayak Temple",        rating:5, type:"Spiritual", distance:5,   visitTime:2, withinCity:true  },
    { id:"mum5",  name:"Haji Ali Dargah",             rating:5, type:"Spiritual", distance:5,   visitTime:2, withinCity:true  },
    { id:"mum6",  name:"Chhatrapati Shivaji Terminus",rating:5, type:"Heritage",  distance:3,   visitTime:1, withinCity:true  },
    { id:"mum7",  name:"Juhu Beach",                  rating:4, type:"Beach",     distance:22,  visitTime:2, withinCity:true  },
    { id:"mum8",  name:"Colaba Causeway Market",      rating:4, type:"Shopping",  distance:2,   visitTime:2, withinCity:true  },
    { id:"mum9",  name:"Lonavala",                    rating:4, type:"Nature",    distance:85,  visitTime:5, withinCity:false },
    { id:"mum10", name:"Alibaug Beach",               rating:4, type:"Beach",     distance:95,  visitTime:4, withinCity:false },
  ],
  "Delhi": [
    { id:"del1",  name:"Red Fort",                    rating:5, type:"Heritage",  distance:5,   visitTime:3, withinCity:true  },
    { id:"del2",  name:"Qutub Minar",                 rating:5, type:"Heritage",  distance:14,  visitTime:2, withinCity:true  },
    { id:"del3",  name:"India Gate",                  rating:5, type:"Heritage",  distance:6,   visitTime:2, withinCity:true  },
    { id:"del4",  name:"Humayun's Tomb",              rating:5, type:"Heritage",  distance:9,   visitTime:2, withinCity:true  },
    { id:"del5",  name:"Akshardham Temple",           rating:5, type:"Spiritual", distance:10,  visitTime:3, withinCity:true  },
    { id:"del6",  name:"Lotus Temple",                rating:4, type:"Spiritual", distance:15,  visitTime:2, withinCity:true  },
    { id:"del7",  name:"Jama Masjid",                 rating:5, type:"Heritage",  distance:5,   visitTime:2, withinCity:true  },
    { id:"del8",  name:"Chandni Chowk",               rating:4, type:"Shopping",  distance:5,   visitTime:2, withinCity:true  },
    { id:"del9",  name:"National Museum",             rating:4, type:"Culture",   distance:6,   visitTime:3, withinCity:true  },
    { id:"del10", name:"Agra Day Trip",               rating:5, type:"Heritage",  distance:210, visitTime:8, withinCity:false },
  ],
  "New Delhi": [
    { id:"ndl1",  name:"Red Fort",                    rating:5, type:"Heritage",  distance:5,   visitTime:3, withinCity:true  },
    { id:"ndl2",  name:"Qutub Minar",                 rating:5, type:"Heritage",  distance:14,  visitTime:2, withinCity:true  },
    { id:"ndl3",  name:"India Gate",                  rating:5, type:"Heritage",  distance:4,   visitTime:2, withinCity:true  },
    { id:"ndl4",  name:"Humayun's Tomb",              rating:5, type:"Heritage",  distance:7,   visitTime:2, withinCity:true  },
    { id:"ndl5",  name:"Akshardham Temple",           rating:5, type:"Spiritual", distance:10,  visitTime:3, withinCity:true  },
    { id:"ndl6",  name:"Chandni Chowk",               rating:4, type:"Shopping",  distance:5,   visitTime:2, withinCity:true  },
    { id:"ndl7",  name:"Lotus Temple",                rating:4, type:"Spiritual", distance:15,  visitTime:2, withinCity:true  },
    { id:"ndl8",  name:"National Museum",             rating:4, type:"Culture",   distance:3,   visitTime:3, withinCity:true  },
  ],
  "Agra": [
    { id:"ag1",   name:"Taj Mahal",                   rating:5, type:"Heritage",  distance:2,   visitTime:4, withinCity:true  },
    { id:"ag2",   name:"Agra Fort",                   rating:5, type:"Heritage",  distance:3,   visitTime:3, withinCity:true  },
    { id:"ag3",   name:"Fatehpur Sikri",              rating:5, type:"Heritage",  distance:40,  visitTime:3, withinCity:false },
    { id:"ag4",   name:"Itmad-ud-Daulah Tomb",        rating:4, type:"Heritage",  distance:5,   visitTime:2, withinCity:true  },
    { id:"ag5",   name:"Mehtab Bagh",                 rating:4, type:"Nature",    distance:4,   visitTime:2, withinCity:true  },
    { id:"ag6",   name:"Kinari Bazaar",               rating:3, type:"Shopping",  distance:3,   visitTime:1, withinCity:true  },
  ],
  "Jaipur": [
    { id:"j1",    name:"Amber Palace",                rating:5, type:"Heritage",  distance:12,  visitTime:3, withinCity:true  },
    { id:"j2",    name:"Hawa Mahal",                  rating:5, type:"Heritage",  distance:5,   visitTime:2, withinCity:true  },
    { id:"j3",    name:"City Palace",                 rating:5, type:"Heritage",  distance:4,   visitTime:3, withinCity:true  },
    { id:"j4",    name:"Jantar Mantar",               rating:4, type:"Science",   distance:4,   visitTime:2, withinCity:true  },
    { id:"j5",    name:"Nahargarh Fort",              rating:4, type:"Heritage",  distance:8,   visitTime:2, withinCity:true  },
    { id:"j6",    name:"Albert Hall Museum",          rating:4, type:"Culture",   distance:4,   visitTime:2, withinCity:true  },
    { id:"j7",    name:"Chokhi Dhani Village",        rating:4, type:"Culture",   distance:22,  visitTime:3, withinCity:true  },
    { id:"j8",    name:"Ranthambore National Park",   rating:5, type:"Adventure", distance:160, visitTime:6, withinCity:false },
  ],
  "Goa": [
    { id:"g1",    name:"Baga Beach",                  rating:4, type:"Beach",     distance:15,  visitTime:3, withinCity:true  },
    { id:"g2",    name:"Dudhsagar Falls",             rating:5, type:"Nature",    distance:60,  visitTime:4, withinCity:false },
    { id:"g3",    name:"Fort Aguada",                 rating:4, type:"Heritage",  distance:20,  visitTime:2, withinCity:true  },
    { id:"g4",    name:"Basilica of Bom Jesus",       rating:5, type:"Spiritual", distance:10,  visitTime:2, withinCity:true  },
    { id:"g5",    name:"Calangute Beach",             rating:4, type:"Beach",     distance:16,  visitTime:3, withinCity:true  },
    { id:"g6",    name:"Anjuna Beach & Market",       rating:4, type:"Shopping",  distance:18,  visitTime:3, withinCity:true  },
    { id:"g7",    name:"Palolem Beach",               rating:5, type:"Beach",     distance:55,  visitTime:3, withinCity:false },
    { id:"g8",    name:"Chapora Fort",                rating:4, type:"Heritage",  distance:22,  visitTime:2, withinCity:true  },
  ],
  "Varanasi": [
    { id:"v1",    name:"Kashi Vishwanath Temple",     rating:5, type:"Spiritual", distance:2,   visitTime:3, withinCity:true  },
    { id:"v2",    name:"Dashashwamedh Ghat",          rating:5, type:"Spiritual", distance:1,   visitTime:3, withinCity:true  },
    { id:"v3",    name:"Ganga Aarti Ceremony",        rating:5, type:"Spiritual", distance:1,   visitTime:2, withinCity:true  },
    { id:"v4",    name:"Sarnath",                     rating:5, type:"Heritage",  distance:10,  visitTime:3, withinCity:true  },
    { id:"v5",    name:"Manikarnika Ghat",            rating:4, type:"Spiritual", distance:2,   visitTime:2, withinCity:true  },
    { id:"v6",    name:"Ramnagar Fort",               rating:4, type:"Heritage",  distance:14,  visitTime:2, withinCity:true  },
    { id:"v7",    name:"Assi Ghat",                   rating:4, type:"Spiritual", distance:3,   visitTime:2, withinCity:true  },
  ],
  "Mysuru": [
    { id:"mys1",  name:"Mysore Palace",               rating:5, type:"Heritage",  distance:2,   visitTime:3, withinCity:true  },
    { id:"mys2",  name:"Chamundi Hills",              rating:5, type:"Spiritual", distance:13,  visitTime:2, withinCity:true  },
    { id:"mys3",  name:"Brindavan Gardens",           rating:5, type:"Nature",    distance:19,  visitTime:3, withinCity:true  },
    { id:"mys4",  name:"Mysore Zoo",                  rating:4, type:"Nature",    distance:3,   visitTime:3, withinCity:true  },
    { id:"mys5",  name:"Srirangapatna",               rating:4, type:"Heritage",  distance:16,  visitTime:3, withinCity:false },
    { id:"mys6",  name:"Nagarhole National Park",     rating:5, type:"Nature",    distance:93,  visitTime:5, withinCity:false },
  ],
  "Bengaluru": [
    { id:"blr1",  name:"Lalbagh Botanical Garden",    rating:5, type:"Nature",    distance:5,   visitTime:3, withinCity:true  },
    { id:"blr2",  name:"Cubbon Park",                 rating:4, type:"Nature",    distance:3,   visitTime:2, withinCity:true  },
    { id:"blr3",  name:"Bangalore Palace",            rating:4, type:"Heritage",  distance:4,   visitTime:2, withinCity:true  },
    { id:"blr4",  name:"ISKCON Temple",               rating:5, type:"Spiritual", distance:10,  visitTime:2, withinCity:true  },
    { id:"blr5",  name:"Bannerghatta National Park",  rating:4, type:"Nature",    distance:22,  visitTime:3, withinCity:true  },
    { id:"blr6",  name:"Nandi Hills",                 rating:5, type:"Nature",    distance:60,  visitTime:3, withinCity:false },
    { id:"blr7",  name:"Mysuru Day Trip",             rating:5, type:"Heritage",  distance:145, visitTime:6, withinCity:false },
  ],
  "Chennai": [
    { id:"chn1",  name:"Marina Beach",                rating:5, type:"Beach",     distance:5,   visitTime:2, withinCity:true  },
    { id:"chn2",  name:"Kapaleeshwarar Temple",       rating:5, type:"Spiritual", distance:7,   visitTime:2, withinCity:true  },
    { id:"chn3",  name:"Fort St. George",             rating:4, type:"Heritage",  distance:4,   visitTime:2, withinCity:true  },
    { id:"chn4",  name:"Government Museum",           rating:4, type:"Culture",   distance:5,   visitTime:3, withinCity:true  },
    { id:"chn5",  name:"Elliot's Beach",              rating:4, type:"Beach",     distance:12,  visitTime:2, withinCity:true  },
    { id:"chn6",  name:"Mahabalipuram",               rating:5, type:"Heritage",  distance:55,  visitTime:4, withinCity:false },
    { id:"chn7",  name:"Pondicherry",                 rating:5, type:"Culture",   distance:160, visitTime:6, withinCity:false },
  ],
  "Kolkata": [
    { id:"kol1",  name:"Victoria Memorial",           rating:5, type:"Heritage",  distance:3,   visitTime:3, withinCity:true  },
    { id:"kol2",  name:"Howrah Bridge",               rating:5, type:"Scenic",    distance:3,   visitTime:1, withinCity:true  },
    { id:"kol3",  name:"Dakshineswar Kali Temple",    rating:5, type:"Spiritual", distance:20,  visitTime:2, withinCity:true  },
    { id:"kol4",  name:"Belur Math",                  rating:5, type:"Spiritual", distance:20,  visitTime:2, withinCity:true  },
    { id:"kol5",  name:"Indian Museum",               rating:4, type:"Culture",   distance:3,   visitTime:3, withinCity:true  },
    { id:"kol6",  name:"Kalighat Temple",             rating:5, type:"Spiritual", distance:5,   visitTime:2, withinCity:true  },
    { id:"kol7",  name:"Sundarbans Day Trip",         rating:5, type:"Nature",    distance:100, visitTime:8, withinCity:false },
  ],
  "Kochi": [
    { id:"koc1",  name:"Fort Kochi & Chinese Nets",   rating:5, type:"Heritage",  distance:10,  visitTime:3, withinCity:true  },
    { id:"koc2",  name:"Mattancherry Palace",         rating:4, type:"Heritage",  distance:11,  visitTime:2, withinCity:true  },
    { id:"koc3",  name:"Marine Drive",                rating:4, type:"Scenic",    distance:4,   visitTime:1, withinCity:true  },
    { id:"koc4",  name:"Alleppey Backwaters",         rating:5, type:"Scenic",    distance:55,  visitTime:5, withinCity:false },
    { id:"koc5",  name:"Munnar",                      rating:5, type:"Nature",    distance:130, visitTime:6, withinCity:false },
    { id:"koc6",  name:"Cherai Beach",                rating:4, type:"Beach",     distance:30,  visitTime:3, withinCity:false },
  ],
  "Amritsar": [
    { id:"am1",   name:"Golden Temple",               rating:5, type:"Spiritual", distance:1,   visitTime:4, withinCity:true  },
    { id:"am2",   name:"Jallianwala Bagh",            rating:5, type:"Heritage",  distance:1,   visitTime:2, withinCity:true  },
    { id:"am3",   name:"Wagah Border Ceremony",       rating:5, type:"Culture",   distance:30,  visitTime:3, withinCity:false },
    { id:"am4",   name:"Partition Museum",            rating:4, type:"Culture",   distance:2,   visitTime:2, withinCity:true  },
    { id:"am5",   name:"Durgiana Temple",             rating:4, type:"Spiritual", distance:2,   visitTime:2, withinCity:true  },
  ],
  "Manali": [
    { id:"m1",    name:"Solang Valley",               rating:5, type:"Adventure", distance:15,  visitTime:4, withinCity:false },
    { id:"m2",    name:"Rohtang Pass",                rating:5, type:"Adventure", distance:50,  visitTime:6, withinCity:false },
    { id:"m3",    name:"Hadimba Temple",              rating:4, type:"Spiritual", distance:2,   visitTime:1, withinCity:true  },
    { id:"m4",    name:"Beas River Rafting",          rating:4, type:"Adventure", distance:5,   visitTime:3, withinCity:true  },
    { id:"m5",    name:"Jogini Waterfall",            rating:4, type:"Nature",    distance:4,   visitTime:3, withinCity:true  },
    { id:"m6",    name:"Vashisht Hot Springs",        rating:4, type:"Nature",    distance:6,   visitTime:2, withinCity:true  },
  ],
  "Leh": [
    { id:"le1",   name:"Pangong Tso Lake",            rating:5, type:"Nature",    distance:160, visitTime:6, withinCity:false },
    { id:"le2",   name:"Nubra Valley",                rating:5, type:"Nature",    distance:120, visitTime:6, withinCity:false },
    { id:"le3",   name:"Thiksey Monastery",           rating:5, type:"Spiritual", distance:19,  visitTime:2, withinCity:true  },
    { id:"le4",   name:"Leh Palace",                  rating:4, type:"Heritage",  distance:2,   visitTime:2, withinCity:true  },
    { id:"le5",   name:"Shanti Stupa",                rating:4, type:"Spiritual", distance:5,   visitTime:1, withinCity:true  },
    { id:"le6",   name:"Hemis Monastery",             rating:5, type:"Spiritual", distance:45,  visitTime:3, withinCity:false },
    { id:"le7",   name:"Khardung La Pass",            rating:5, type:"Adventure", distance:39,  visitTime:3, withinCity:false },
  ],
  "Srinagar": [
    { id:"srn1",  name:"Dal Lake & Shikara Ride",     rating:5, type:"Scenic",    distance:2,   visitTime:3, withinCity:true  },
    { id:"srn2",  name:"Mughal Gardens",              rating:5, type:"Nature",    distance:12,  visitTime:3, withinCity:true  },
    { id:"srn3",  name:"Shankaracharya Temple",       rating:4, type:"Spiritual", distance:5,   visitTime:2, withinCity:true  },
    { id:"srn4",  name:"Gulmarg",                     rating:5, type:"Adventure", distance:56,  visitTime:5, withinCity:false },
    { id:"srn5",  name:"Pahalgam",                    rating:5, type:"Nature",    distance:95,  visitTime:5, withinCity:false },
    { id:"srn6",  name:"Sonamarg",                    rating:5, type:"Nature",    distance:80,  visitTime:4, withinCity:false },
  ],
  "Udaipur": [
    { id:"udp1",  name:"City Palace",                 rating:5, type:"Heritage",  distance:2,   visitTime:3, withinCity:true  },
    { id:"udp2",  name:"Lake Pichola",                rating:5, type:"Scenic",    distance:2,   visitTime:3, withinCity:true  },
    { id:"udp3",  name:"Jag Mandir Island Palace",    rating:5, type:"Heritage",  distance:3,   visitTime:2, withinCity:true  },
    { id:"udp4",  name:"Saheliyon Ki Bari",           rating:4, type:"Nature",    distance:3,   visitTime:2, withinCity:true  },
    { id:"udp5",  name:"Fateh Sagar Lake",            rating:4, type:"Scenic",    distance:4,   visitTime:2, withinCity:true  },
    { id:"udp6",  name:"Kumbhalgarh Fort",            rating:5, type:"Heritage",  distance:85,  visitTime:4, withinCity:false },
  ],
  "Jodhpur": [
    { id:"jod1",  name:"Mehrangarh Fort",             rating:5, type:"Heritage",  distance:3,   visitTime:3, withinCity:true  },
    { id:"jod2",  name:"Jaswant Thada",               rating:4, type:"Heritage",  distance:4,   visitTime:2, withinCity:true  },
    { id:"jod3",  name:"Umaid Bhawan Palace",         rating:5, type:"Heritage",  distance:5,   visitTime:2, withinCity:true  },
    { id:"jod4",  name:"Sardar Market",               rating:4, type:"Shopping",  distance:2,   visitTime:2, withinCity:true  },
    { id:"jod5",  name:"Sam Sand Dunes (Jaisalmer)",  rating:5, type:"Adventure", distance:290, visitTime:5, withinCity:false },
  ],
  "Tirupati": [
    { id:"tp1",   name:"Tirumala Venkateswara Temple",rating:5, type:"Spiritual", distance:20,  visitTime:5, withinCity:true  },
    { id:"tp2",   name:"Padmavathi Temple",           rating:5, type:"Spiritual", distance:5,   visitTime:2, withinCity:true  },
    { id:"tp3",   name:"Chandragiri Fort",            rating:4, type:"Heritage",  distance:14,  visitTime:2, withinCity:true  },
    { id:"tp4",   name:"Srikalahasti Temple",         rating:5, type:"Spiritual", distance:38,  visitTime:3, withinCity:false },
    { id:"tp5",   name:"Talakona Waterfall",          rating:4, type:"Nature",    distance:50,  visitTime:3, withinCity:false },
  ],
  "Rishikesh": [
    { id:"rsh1",  name:"Triveni Ghat & Aarti",        rating:5, type:"Spiritual", distance:2,   visitTime:2, withinCity:true  },
    { id:"rsh2",  name:"Laxman Jhula",                rating:5, type:"Scenic",    distance:4,   visitTime:2, withinCity:true  },
    { id:"rsh3",  name:"Ganges White Water Rafting",  rating:5, type:"Adventure", distance:10,  visitTime:4, withinCity:true  },
    { id:"rsh4",  name:"Beatles Ashram",              rating:4, type:"Heritage",  distance:3,   visitTime:2, withinCity:true  },
    { id:"rsh5",  name:"Bungee Jumping",              rating:5, type:"Adventure", distance:16,  visitTime:3, withinCity:false },
    { id:"rsh6",  name:"Neelkanth Mahadev Temple",    rating:5, type:"Spiritual", distance:32,  visitTime:3, withinCity:false },
  ],
  "Ooty": [
    { id:"oty1",  name:"Botanical Gardens",           rating:5, type:"Nature",    distance:2,   visitTime:2, withinCity:true  },
    { id:"oty2",  name:"Doddabetta Peak",             rating:5, type:"Nature",    distance:9,   visitTime:3, withinCity:true  },
    { id:"oty3",  name:"Ooty Lake",                   rating:4, type:"Scenic",    distance:2,   visitTime:2, withinCity:true  },
    { id:"oty4",  name:"Nilgiri Mountain Railway",    rating:5, type:"Adventure", distance:1,   visitTime:3, withinCity:true  },
    { id:"oty5",  name:"Pykara Waterfall",            rating:4, type:"Nature",    distance:21,  visitTime:2, withinCity:false },
    { id:"oty6",  name:"Mudumalai Wildlife Sanctuary",rating:5, type:"Nature",    distance:64,  visitTime:4, withinCity:false },
  ],
  "Hampi": [
    { id:"hmp1",  name:"Virupaksha Temple",           rating:5, type:"Spiritual", distance:1,   visitTime:2, withinCity:true  },
    { id:"hmp2",  name:"Vittala Temple & Stone Chariot",rating:5,type:"Heritage", distance:3,   visitTime:3, withinCity:true  },
    { id:"hmp3",  name:"Lotus Mahal",                 rating:5, type:"Heritage",  distance:4,   visitTime:2, withinCity:true  },
    { id:"hmp4",  name:"Matanga Hill Sunrise",        rating:5, type:"Scenic",    distance:2,   visitTime:2, withinCity:true  },
    { id:"hmp5",  name:"Tungabhadra Coracle Ride",    rating:4, type:"Adventure", distance:2,   visitTime:2, withinCity:true  },
  ],
  "Puri": [
    { id:"pu1",   name:"Jagannath Temple",            rating:5, type:"Spiritual", distance:1,   visitTime:3, withinCity:true  },
    { id:"pu2",   name:"Puri Beach",                  rating:4, type:"Beach",     distance:2,   visitTime:3, withinCity:true  },
    { id:"pu3",   name:"Konark Sun Temple",           rating:5, type:"Heritage",  distance:35,  visitTime:3, withinCity:false },
    { id:"pu4",   name:"Chilika Lake",                rating:4, type:"Nature",    distance:50,  visitTime:4, withinCity:false },
  ],
  "Ayodhya": [
    { id:"ay1",   name:"Ram Janmabhoomi Temple",      rating:5, type:"Spiritual", distance:2,   visitTime:3, withinCity:true  },
    { id:"ay2",   name:"Hanuman Garhi",               rating:5, type:"Spiritual", distance:1,   visitTime:2, withinCity:true  },
    { id:"ay3",   name:"Kanak Bhavan",                rating:4, type:"Spiritual", distance:2,   visitTime:2, withinCity:true  },
    { id:"ay4",   name:"Saryu River Ghat",            rating:4, type:"Spiritual", distance:3,   visitTime:2, withinCity:true  },
    { id:"ay5",   name:"Dashrath Mahal",              rating:4, type:"Heritage",  distance:2,   visitTime:1, withinCity:true  },
  ],
  "Shirdi": [
    { id:"sh1",   name:"Sai Baba Samadhi Mandir",     rating:5, type:"Spiritual", distance:1,   visitTime:4, withinCity:true  },
    { id:"sh2",   name:"Dwarkamai Mosque",            rating:5, type:"Spiritual", distance:1,   visitTime:2, withinCity:true  },
    { id:"sh3",   name:"Shani Shingnapur",            rating:4, type:"Spiritual", distance:70,  visitTime:2, withinCity:false },
    { id:"sh4",   name:"Nashik Trimbakeshwar",        rating:5, type:"Spiritual", distance:90,  visitTime:3, withinCity:false },
  ],
  "Aurangabad": [
    { id:"aur1",  name:"Ajanta Caves",                rating:5, type:"Heritage",  distance:105, visitTime:5, withinCity:false },
    { id:"aur2",  name:"Ellora Caves",                rating:5, type:"Heritage",  distance:29,  visitTime:5, withinCity:false },
    { id:"aur3",  name:"Bibi Ka Maqbara",             rating:5, type:"Heritage",  distance:3,   visitTime:2, withinCity:true  },
    { id:"aur4",  name:"Daulatabad Fort",             rating:5, type:"Heritage",  distance:13,  visitTime:3, withinCity:true  },
  ],
  "Darjeeling": [
    { id:"drj1",  name:"Tiger Hill Sunrise",          rating:5, type:"Scenic",    distance:11,  visitTime:4, withinCity:true  },
    { id:"drj2",  name:"Darjeeling Himalayan Railway",rating:5, type:"Adventure", distance:1,   visitTime:4, withinCity:true  },
    { id:"drj3",  name:"Happy Valley Tea Estate",     rating:4, type:"Nature",    distance:3,   visitTime:2, withinCity:true  },
    { id:"drj4",  name:"Batasia Loop",                rating:4, type:"Scenic",    distance:5,   visitTime:2, withinCity:true  },
    { id:"drj5",  name:"Sandakphu Trek",              rating:5, type:"Adventure", distance:57,  visitTime:6, withinCity:false },
  ],
  "Shimla": [
    { id:"sml1",  name:"The Ridge",                   rating:5, type:"Scenic",    distance:2,   visitTime:2, withinCity:true  },
    { id:"sml2",  name:"Jakhu Temple",                rating:5, type:"Spiritual", distance:3,   visitTime:2, withinCity:true  },
    { id:"sml3",  name:"Mall Road",                   rating:4, type:"Shopping",  distance:2,   visitTime:2, withinCity:true  },
    { id:"sml4",  name:"Kufri",                       rating:4, type:"Adventure", distance:16,  visitTime:3, withinCity:true  },
    { id:"sml5",  name:"Chail",                       rating:4, type:"Nature",    distance:45,  visitTime:3, withinCity:false },
  ],
  "default": [
    { id:"d1",    name:"City Heritage Fort / Palace", rating:4, type:"Heritage",  distance:8,   visitTime:2, withinCity:true  },
    { id:"d2",    name:"Main Temple / Shrine",        rating:5, type:"Spiritual", distance:5,   visitTime:2, withinCity:true  },
    { id:"d3",    name:"Local Bazaar / Market",       rating:4, type:"Shopping",  distance:3,   visitTime:2, withinCity:true  },
    { id:"d4",    name:"Botanical Garden / Park",     rating:3, type:"Nature",    distance:4,   visitTime:2, withinCity:true  },
    { id:"d5",    name:"Scenic Viewpoint",            rating:4, type:"Scenic",    distance:10,  visitTime:2, withinCity:true  },
    { id:"d6",    name:"Local Food Street",           rating:4, type:"Food",      distance:2,   visitTime:2, withinCity:true  },
    { id:"d7",    name:"Museum / Cultural Centre",    rating:4, type:"Culture",   distance:5,   visitTime:2, withinCity:true  },
    { id:"d8",    name:"Riverside / Lakefront",       rating:3, type:"Scenic",    distance:6,   visitTime:2, withinCity:true  },
  ]
};

const TIER_RATES = {
  1: { food: 400, stay: 2500 },
  2: { food: 280, stay: 1200 },
  3: { food: 180, stay: 700 },
};

const TRANSPORT_PRESETS = {
  bus:   { label:"State Bus",    icon:"🚌", basePrice: 0.7  },
  train: { label:"Train",        icon:"🚂", basePrice: 0.5  },
  flight:{ label:"Flight",       icon:"✈️", basePrice: 4.5  },
  cab:   { label:"Cab/Taxi",     icon:"🚕", basePrice: 14   },
};

const SPOT_TYPE_ICONS = {
  Heritage:"🏛️", Scenic:"🌄", Spiritual:"🙏", Culture:"🎭",
  Nature:"🌿", Beach:"🏖️", Shopping:"🛍️", Adventure:"⛰️",
  Food:"🍛", Science:"🔭",
};

function haversine(lat1,lon1,lat2,lon2) {
  const R=6371, dLat=(lat2-lat1)*Math.PI/180, dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return Math.round(R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))*1.25);
}

function getSeasonMult(d) {
  if (!d) return 1;
  const m = new Date(d).getMonth()+1;
  if (m===12||m===7) return 1.5;
  if ([2,3,8,9].includes(m)) return 0.8;
  return 1.0;
}

function formatINR(n) {
  return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
}

function useCountUp(target) {
  const [val, setVal] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const diff = target - prev.current;
    if (!diff) return;
    const steps=40, inc=diff/steps;
    let s=0;
    const t = setInterval(()=>{ s++; if(s>=steps){setVal(target);prev.current=target;clearInterval(t);}else setVal(Math.round(prev.current+inc*s)); }, 15);
    return ()=>clearInterval(t);
  }, [target]);
  return val;
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Lato:wght@300;400;700;900&family=Roboto+Mono:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --saffron:#E8590C; --saffron-lt:#FF7B35; --saffron-dim:rgba(232,89,12,0.10); --saffron-glow:rgba(232,89,12,0.22);
  --teal:#0B6E6E; --teal-lt:#18A899; --teal-dim:rgba(11,110,110,0.10); --teal-glow:rgba(11,110,110,0.22);
  --gold:#D97706; --gold-dim:rgba(217,119,6,0.12);
  --bg:#FFFAF4; --bg2:#FFF4E8; --surface:#FFFFFF;
  --text:#1C1007; --text-mid:#5C4027; --text-dim:#9C7E60;
  --danger:#DC2626; --success:#15803D;
  --shadow-sm:0 2px 8px rgba(92,64,39,0.08);
  --shadow-md:0 6px 24px rgba(92,64,39,0.12);
  --shadow-lg:0 16px 48px rgba(92,64,39,0.16);
  --shadow-lift:0 20px 60px rgba(92,64,39,0.20);
  --card-border:rgba(232,89,12,0.12);
  --card-bg:rgba(255,255,255,0.92);
}
body{background:var(--bg);color:var(--text);font-family:'Lato',sans-serif;min-height:100vh;overflow-x:hidden}

.grid-bg{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.grid-bg::before{content:'';position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(232,89,12,0.07) 0%,transparent 70%);top:-200px;right:-100px;animation:orb1 18s ease-in-out infinite}
.grid-bg::after{content:'';position:absolute;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(11,110,110,0.06) 0%,transparent 70%);bottom:-150px;left:-100px;animation:orb2 22s ease-in-out infinite}
@keyframes orb1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-60px,80px) scale(1.1)}66%{transform:translate(40px,-50px) scale(0.9)}}
@keyframes orb2{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(80px,-60px) scale(1.15)}70%{transform:translate(-40px,40px) scale(0.92)}}

.app{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:24px 20px 200px}

.header{text-align:center;padding:48px 0 36px;animation:hDrop 0.8s cubic-bezier(0.22,1,0.36,1) both}
@keyframes hDrop{from{opacity:0;transform:translateY(-32px)}to{opacity:1;transform:none}}
.header::before{content:'✦  ✦  ✦';display:block;font-size:12px;color:var(--saffron);letter-spacing:10px;margin-bottom:14px;opacity:0.5;animation:twinkle 3s ease-in-out infinite}
@keyframes twinkle{0%,100%{opacity:0.5}50%{opacity:1}}
.eyebrow{font-family:'Roboto Mono',monospace;font-size:11px;letter-spacing:4px;color:var(--teal-lt);text-transform:uppercase;margin-bottom:12px;opacity:0.8}
.title{font-family:'Abril Fatface',cursive;font-size:clamp(40px,8vw,80px);color:var(--text);line-height:1;letter-spacing:2px;background:linear-gradient(135deg,var(--saffron) 0%,var(--gold) 45%,var(--saffron-lt) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 2px 12px var(--saffron-glow))}
.subtitle{font-size:16px;color:var(--text-dim);margin-top:12px}

.steps{display:flex;justify-content:center;margin-bottom:36px;animation:sUp 0.6s 0.3s cubic-bezier(0.22,1,0.36,1) both}
@keyframes sUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.step-item{display:flex;align-items:center}
.step-dot{width:36px;height:36px;border-radius:50%;border:2px solid rgba(92,64,39,0.15);background:var(--surface);font-family:'Lato',sans-serif;font-size:13px;font-weight:700;color:var(--text-dim);display:flex;align-items:center;justify-content:center;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer;box-shadow:var(--shadow-sm)}
.step-dot.active{border-color:var(--saffron);background:var(--saffron);color:#fff;box-shadow:0 4px 20px var(--saffron-glow);transform:scale(1.15)}
.step-dot.done{border-color:var(--teal);background:var(--teal);color:#fff;box-shadow:0 4px 16px var(--teal-glow)}
.step-dot.done:hover{transform:scale(1.1)}
.step-line{width:44px;height:2px;border-radius:2px;background:rgba(92,64,39,0.12);transition:background 0.5s}
.step-line.done{background:linear-gradient(90deg,var(--teal),var(--saffron))}

.card{background:var(--card-bg);border:1px solid var(--card-border);border-radius:20px;backdrop-filter:blur(20px);box-shadow:var(--shadow-md);padding:28px 32px;margin-bottom:20px;transition:box-shadow 0.35s,transform 0.35s,border-color 0.3s}
.card:hover{box-shadow:var(--shadow-lift);transform:translateY(-2px);border-color:rgba(232,89,12,0.2)}
.card-title{font-family:'Abril Fatface',cursive;font-size:19px;color:var(--text);margin-bottom:20px;display:flex;align-items:center;gap:10px;padding-bottom:14px;border-bottom:2px solid var(--saffron-dim);flex-wrap:wrap}

.input-row{display:grid;grid-template-columns:1fr 1fr;gap:18px}
@media(max-width:600px){.input-row{grid-template-columns:1fr}}
.input-group{position:relative}
.input-label{font-size:12px;font-weight:700;letter-spacing:0.8px;color:var(--text-mid);text-transform:uppercase;margin-bottom:7px;display:block}
.inp{width:100%;background:#FFFBF7;border:1.5px solid rgba(92,64,39,0.15);color:var(--text);font-family:'Lato',sans-serif;font-size:15px;font-weight:500;padding:11px 16px;border-radius:12px;outline:none;transition:border-color 0.3s,box-shadow 0.3s}
.inp:focus{border-color:var(--saffron);background:#fff;box-shadow:0 0 0 3px var(--saffron-dim)}
.inp::placeholder{color:rgba(156,126,96,0.5)}
.inp option{background:#FFFBF7;color:var(--text)}
input[type="date"]{color-scheme:light}
input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(40%) sepia(60%) saturate(600%) hue-rotate(350deg) brightness(0.9);cursor:pointer;opacity:0.8;width:18px;height:18px}
input[type="date"]::-webkit-inner-spin-button{display:none}

.ac-wrap{position:relative}
.ac-list{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:999;background:var(--surface);border:1.5px solid var(--saffron-dim);border-radius:14px;max-height:220px;overflow-y:auto;box-shadow:var(--shadow-lg);animation:dropIn 0.2s cubic-bezier(0.34,1.56,0.64,1)}
@keyframes dropIn{from{opacity:0;transform:translateY(-8px) scale(0.97)}to{opacity:1;transform:none}}
.ac-item{padding:11px 16px;cursor:pointer;font-size:14px;border-bottom:1px solid rgba(92,64,39,0.06);transition:background 0.15s;display:flex;align-items:center;gap:8px}
.ac-item:last-child{border-bottom:none}
.ac-item:hover{background:var(--saffron-dim);color:var(--saffron)}
.ac-badge{margin-left:auto;font-size:10px;color:var(--text-dim);font-family:'Roboto Mono',monospace;background:rgba(92,64,39,0.07);padding:2px 7px;border-radius:6px}

.tabs{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap}
.tab{padding:9px 20px;border-radius:30px;border:1.5px solid rgba(92,64,39,0.15);background:var(--surface);color:var(--text-dim);font-family:'Lato',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.25s}
.tab.active{border-color:var(--saffron);background:var(--saffron);color:#fff;box-shadow:0 4px 16px var(--saffron-glow)}
.tab:hover:not(.active){border-color:var(--saffron);color:var(--saffron)}

.pub-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
@media(max-width:500px){.pub-grid{grid-template-columns:repeat(2,1fr)}}
.t-card{border:1.5px solid rgba(92,64,39,0.12);border-radius:14px;padding:16px 12px;text-align:center;cursor:pointer;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);background:var(--surface);box-shadow:var(--shadow-sm)}
.t-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-md)}
.t-card.sel{border-color:var(--teal);background:var(--teal-dim);box-shadow:0 8px 24px var(--teal-glow);transform:translateY(-3px)}
.t-icon{font-size:28px;margin-bottom:8px;display:block}
.t-name{font-size:12px;color:var(--text-dim);font-weight:700;letter-spacing:0.5px}
.t-card.sel .t-name{color:var(--teal)}

.spots-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(188px,1fr));gap:14px}
.spot-card{border:1.5px solid rgba(92,64,39,0.10);border-radius:16px;padding:16px;background:var(--surface);cursor:pointer;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);position:relative;box-shadow:var(--shadow-sm);animation:spotPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;opacity:0}
@keyframes spotPop{from{opacity:0;transform:scale(0.88) translateY(16px)}to{opacity:1;transform:none}}
.spot-card:nth-child(1){animation-delay:0.04s}.spot-card:nth-child(2){animation-delay:0.08s}.spot-card:nth-child(3){animation-delay:0.12s}.spot-card:nth-child(4){animation-delay:0.16s}.spot-card:nth-child(5){animation-delay:0.20s}.spot-card:nth-child(6){animation-delay:0.24s}.spot-card:nth-child(n+7){animation-delay:0.28s}
.spot-card:hover{box-shadow:var(--shadow-md);transform:translateY(-4px);border-color:rgba(232,89,12,0.25)}
.spot-card.sel{border-color:var(--saffron);background:linear-gradient(135deg,#FFF5EE,#FFFAF4);box-shadow:0 8px 28px var(--saffron-glow);transform:translateY(-4px)}
.s-icon{font-size:28px;margin-bottom:8px;display:block}
.s-name{font-size:13px;font-weight:700;margin-bottom:4px;color:var(--text);line-height:1.3}
.s-meta{font-size:11px;color:var(--text-dim);font-family:'Roboto Mono',monospace}
.s-stars{color:var(--gold);font-size:11px;margin-bottom:5px}
.s-remove{position:absolute;top:10px;right:10px;background:rgba(220,38,38,0.08);border:1px solid rgba(220,38,38,0.25);color:var(--danger);border-radius:50%;width:22px;height:22px;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;opacity:0;transform:scale(0.7)}
.spot-card:hover .s-remove,.spot-card.sel:hover .s-remove{opacity:1;transform:scale(1)}
.s-remove:hover{background:rgba(220,38,38,0.18)}

.itin-list{display:flex;flex-direction:column;gap:10px}
.itin-item{display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--surface);border:1.5px solid rgba(92,64,39,0.10);border-radius:14px;box-shadow:var(--shadow-sm);transition:all 0.3s;user-select:none;animation:itinSlide 0.4s cubic-bezier(0.22,1,0.36,1) both}
@keyframes itinSlide{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:none}}
.itin-item:hover{box-shadow:var(--shadow-md);transform:translateX(4px);border-color:rgba(232,89,12,0.2)}
.drag-handle{color:var(--text-dim);font-size:18px;cursor:grab;touch-action:none}
.itin-info{flex:1}
.itin-name{font-size:14px;font-weight:700;color:var(--text)}
.itin-sub{font-size:11px;color:var(--text-dim);font-family:'Roboto Mono',monospace;margin-top:2px}
.itin-rm{background:none;border:1.5px solid rgba(220,38,38,0.3);color:var(--danger);border-radius:8px;padding:5px 12px;font-size:11px;font-weight:700;cursor:pointer;font-family:'Lato',sans-serif;transition:all 0.2s}
.itin-rm:hover{background:rgba(220,38,38,0.08);border-color:var(--danger)}

.btn{font-family:'Lato',sans-serif;font-size:15px;font-weight:700;padding:13px 30px;border-radius:12px;cursor:pointer;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);border:none;letter-spacing:0.3px}
.btn-primary{background:linear-gradient(135deg,var(--saffron) 0%,var(--saffron-lt) 100%);color:#fff;box-shadow:0 4px 18px var(--saffron-glow)}
.btn-primary:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 8px 28px var(--saffron-glow)}
.btn-primary:active{transform:scale(0.97)}
.btn-primary:disabled{background:rgba(92,64,39,0.12);color:var(--text-dim);box-shadow:none;cursor:not-allowed;transform:none}
.btn-secondary{background:var(--surface);border:1.5px solid rgba(92,64,39,0.18);color:var(--text-mid);box-shadow:var(--shadow-sm)}
.btn-secondary:hover{border-color:var(--saffron);color:var(--saffron);transform:translateY(-1px);box-shadow:var(--shadow-md)}
.btn-teal{background:linear-gradient(135deg,var(--teal) 0%,var(--teal-lt) 100%);color:#fff;box-shadow:0 4px 18px var(--teal-glow)}
.btn-teal:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 8px 28px var(--teal-glow)}
.btn-danger{background:rgba(220,38,38,0.06);border:1.5px solid rgba(220,38,38,0.25);color:var(--danger)}
.btn-danger:hover{background:rgba(220,38,38,0.12);border-color:var(--danger);transform:translateY(-1px)}
.nav-row{display:flex;justify-content:space-between;align-items:center;margin-top:28px;padding-top:20px;border-top:1px solid rgba(92,64,39,0.08)}

.footer{position:fixed;bottom:0;left:0;right:0;z-index:200;background:rgba(255,250,244,0.93);backdrop-filter:blur(24px);border-top:1px solid rgba(232,89,12,0.15);padding:14px 24px;box-shadow:0 -8px 40px rgba(92,64,39,0.12);animation:footerRise 0.6s 0.4s cubic-bezier(0.22,1,0.36,1) both}
@keyframes footerRise{from{transform:translateY(100%);opacity:0}to{transform:none;opacity:1}}
.footer-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;flex-wrap:wrap}
.f-item{flex:1;min-width:80px;text-align:center;padding:4px 12px;border-right:1px solid rgba(92,64,39,0.10)}
.f-item:last-child{border-right:none}
.f-label{font-size:9px;letter-spacing:1.5px;color:var(--text-dim);text-transform:uppercase;margin-bottom:3px;font-family:'Roboto Mono',monospace}
.f-val{font-family:'Abril Fatface',cursive;font-size:clamp(13px,2vw,17px);color:var(--saffron)}
.f-total{background:linear-gradient(135deg,var(--saffron-dim),var(--teal-dim));border-radius:12px;padding:10px 20px;border:1.5px solid rgba(232,89,12,0.2);min-width:150px}
.f-total .f-label{color:var(--saffron)}
.f-total .f-val{font-size:clamp(16px,2.5vw,22px)}
.f-total.recalc{animation:pulse 1s ease infinite}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 var(--saffron-glow)}50%{box-shadow:0 0 0 6px rgba(232,89,12,0)}}

.dist-badge{display:inline-flex;align-items:center;gap:8px;background:var(--teal-dim);border:1px solid rgba(11,110,110,0.2);border-radius:24px;padding:6px 16px;font-family:'Roboto Mono',monospace;font-size:12px;color:var(--teal);font-weight:500;transition:all 0.3s}
.range-wrap{display:flex;align-items:center;gap:14px}
.range{-webkit-appearance:none;width:100%;height:5px;border-radius:3px;background:rgba(92,64,39,0.12);outline:none;cursor:pointer}
.range::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:var(--saffron);box-shadow:0 2px 8px var(--saffron-glow);cursor:pointer;transition:transform 0.2s}
.range::-webkit-slider-thumb:hover{transform:scale(1.2)}
.range-val{font-family:'Abril Fatface',cursive;font-size:20px;color:var(--saffron);min-width:56px;text-align:right}

.season-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:24px;font-size:12px;font-family:'Roboto Mono',monospace;margin-top:8px;font-weight:500}
.s-peak{background:rgba(217,119,6,0.12);border:1px solid rgba(217,119,6,0.3);color:var(--gold)}
.s-off{background:var(--teal-dim);border:1px solid rgba(11,110,110,0.25);color:var(--teal)}
.s-normal{background:rgba(92,64,39,0.07);border:1px solid rgba(92,64,39,0.15);color:var(--text-dim)}

.results-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media(max-width:600px){.results-grid{grid-template-columns:1fr}}
.result-row{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid rgba(92,64,39,0.07)}
.result-row:last-child{border:none}
.result-key{font-size:13px;color:var(--text-mid);font-weight:500}
.result-val{font-family:'Abril Fatface',cursive;font-size:16px;color:var(--saffron)}

.api-notice{background:var(--gold-dim);border:1px solid rgba(217,119,6,0.25);border-radius:10px;padding:10px 16px;font-size:12px;color:var(--gold);margin-bottom:18px;font-family:'Roboto Mono',monospace;line-height:1.5}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--surface);border:1.5px solid rgba(92,64,39,0.10);border-radius:14px;margin-bottom:12px;box-shadow:var(--shadow-sm);transition:all 0.25s}
.toggle-row:hover{border-color:rgba(232,89,12,0.2);box-shadow:var(--shadow-md)}
.tgl-label{font-size:14px;font-weight:700;color:var(--text)}
.tgl-sub{font-size:11px;color:var(--text-dim);margin-top:2px;font-family:'Roboto Mono',monospace}
.tgl-switch{position:relative;width:48px;height:26px;flex-shrink:0}
.tgl-switch input{opacity:0;width:0;height:0}
.tgl-slider{position:absolute;cursor:pointer;inset:0;background:rgba(92,64,39,0.15);border-radius:26px;transition:0.3s}
.tgl-slider::before{content:"";position:absolute;width:20px;height:20px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:0.3s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 2px 6px rgba(92,64,39,0.2)}
input:checked + .tgl-slider{background:var(--saffron)}
input:checked + .tgl-slider::before{transform:translateX(22px)}

.spinner-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:48px 20px;text-align:center}
.spinner{width:48px;height:48px;border-radius:50%;border:4px solid var(--saffron-dim);border-top-color:var(--saffron);animation:spin 0.8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.spinner-title{font-family:'Abril Fatface',cursive;font-size:18px;color:var(--saffron);margin-bottom:4px}
.spinner-sub{font-family:'Roboto Mono',monospace;font-size:12px;color:var(--text-dim)}
.dots span{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--saffron);margin:0 3px;animation:bounce 1.2s ease-in-out infinite}
.dots span:nth-child(2){animation-delay:0.2s}
.dots span:nth-child(3){animation-delay:0.4s}
@keyframes bounce{0%,80%,100%{transform:translateY(0);opacity:0.4}40%{transform:translateY(-8px);opacity:1}}
.ai-badge{display:inline-flex;align-items:center;gap:5px;background:linear-gradient(135deg,var(--saffron-dim),var(--teal-dim));border:1px solid rgba(232,89,12,0.2);border-radius:20px;padding:3px 12px;font-size:11px;font-family:'Roboto Mono',monospace;color:var(--saffron);margin-left:8px}
.err-banner{display:flex;align-items:center;gap:10px;background:rgba(220,38,38,0.06);border:1px solid rgba(220,38,38,0.2);border-radius:10px;padding:10px 16px;margin-bottom:14px;font-size:13px;color:var(--danger);font-family:'Roboto Mono',monospace}

.fade-in{animation:fadeIn 0.5s cubic-bezier(0.22,1,0.36,1) both}
@keyframes fadeIn{from{opacity:0;transform:translateX(28px) scale(0.98)}to{opacity:1;transform:none}}

::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:var(--bg2)}
::-webkit-scrollbar-thumb{background:rgba(232,89,12,0.25);border-radius:3px}
`;

// ─── CITY AUTOCOMPLETE ────────────────────────────────────────────────────────
function CityAC({ label, value, onChange }) {
  const [q, setQ] = useState(value?.name || "");
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    if (q.length < 2) { setList([]); return; }
    setList(INDIA_CITIES.filter(c =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.state.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 8));
  }, [q]);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const TC = { 1: "#0B6E6E", 2: "#E8590C", 3: "#D97706" };
  const TL = { 1: "Metro", 2: "Urban", 3: "Town" };
  const icon = c => ["temple","dham","puri","kashi","gaya","rameswaram","dwarka","badrinath","kedarnath"].some(k => c.name.toLowerCase().includes(k)) ? "🙏" : c.tier===1 ? "🏙️" : c.tier===3 ? "🌿" : "🏘️";

  return (
    <div className="input-group ac-wrap" ref={ref}>
      <label className="input-label">{label}</label>
      <input className="inp" value={q}
        onChange={e => { setQ(e.target.value); setOpen(true); if (!e.target.value) onChange(null); }}
        onFocus={() => setOpen(true)}
        placeholder="Search city, hill station, pilgrimage..." autoComplete="off" />
      {open && list.length > 0 && (
        <div className="ac-list">
          {list.map(c => (
            <div key={c.name+c.state} className="ac-item" onMouseDown={() => { setQ(c.name); onChange(c); setOpen(false); }}>
              <span>{icon(c)}</span>
              {c.name}
              <span className="ac-badge" style={{ color: TC[c.tier] }}>{c.state} · {TL[c.tier]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SPOT CARD ────────────────────────────────────────────────────────────────
function SpotCard({ spot, selected, onToggle, onRemove }) {
  return (
    <div className={`spot-card${selected?" sel":""}`} onClick={onToggle}>
      <div className="s-icon">{SPOT_TYPE_ICONS[spot.type]||"📍"}</div>
      <div className="s-stars">{"★".repeat(spot.rating)}{"☆".repeat(5-spot.rating)}</div>
      <div className="s-name">{spot.name}</div>
      <div className="s-meta">{spot.type} · ~{spot.visitTime}h · {spot.distance}km</div>
      {selected && <button className="s-remove" onClick={e=>{e.stopPropagation();onRemove();}}>✕</button>}
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ budget, recalc }) {
  const total = useCountUp(budget.total);
  return (
    <div className="footer">
      <div className="footer-inner">
        <div className="f-item"><div className="f-label">⛽ Fuel</div><div className="f-val">{formatINR(budget.fuel)}</div></div>
        <div className="f-item"><div className="f-label">🍛 Food</div><div className="f-val">{formatINR(budget.food)}</div></div>
        <div className="f-item"><div className="f-label">🏨 Stay</div><div className="f-val">{formatINR(budget.stay)}</div></div>
        <div className="f-item"><div className="f-label">🛣️ Tolls</div><div className="f-val">{formatINR(budget.tolls)}</div></div>
        <div className={`f-item f-total${recalc?" recalc":""}`}>
          <div className="f-label">{recalc?"⟳ Recalculating...":"💰 Total Budget"}</div>
          <div className="f-val">{formatINR(total)}</div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(1);
  const [recalc, setRecalc] = useState(false);

  const [source, setSource] = useState(null);
  const [dest, setDest] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [persons, setPersons] = useState(2);
  const [roundTrip, setRoundTrip] = useState(false);
  const [includeStay, setIncludeStay] = useState(true);

  const [transMode, setTransMode] = useState("private");
  const [mileage, setMileage] = useState(15);
  const [fuelPrice, setFuelPrice] = useState(100);
  const [tolls, setTolls] = useState(500);
  const [pubType, setPubType] = useState("bus");
  const [pubPrice, setPubPrice] = useState(0);

  const [spots, setSpots] = useState([]);
  const [selSpots, setSelSpots] = useState([]);
  const [spotsLoading, setSpotsLoading] = useState(false);
  const [spotsError, setSpotsError] = useState(null);
  const [spotSearch, setSpotSearch] = useState("");
  const [spotType, setSpotType] = useState("All");
  const spotsCache = useRef({});

  const [dist, setDist] = useState(0);
  const [budget, setBudget] = useState({ fuel:0, food:0, stay:0, tolls:0, total:0 });

  const STEPS = ["Route","Dates","Transport","Itinerary","Summary"];

  const resetAll = () => {
    setStep(1); setSource(null); setDest(null); setStartDate(""); setEndDate("");
    setPersons(2); setRoundTrip(false); setIncludeStay(true);
    setTransMode("private"); setMileage(15); setFuelPrice(100); setTolls(500);
    setPubType("bus"); setPubPrice(0);
    setSpots([]); setSelSpots([]); setSpotSearch(""); setSpotType("All");
    setDist(0); setBudget({fuel:0,food:0,stay:0,tolls:0,total:0});
  };

  const rmSpot = id => setSelSpots(p => p.filter(s => s.id !== id));

  // ── Fetch spots via AI ──
  useEffect(() => {
    if (!dest) return;
    const key = `${dest.name}__${dest.state}`;

    if (spotsCache.current[key]) {
      setSpots(spotsCache.current[key]);
      setSelSpots([]); setSpotSearch(""); setSpotType("All");
      return;
    }

    // Show local fallback immediately
    const ALIASES = {
      "Bangalore":"Bengaluru","Mysore":"Mysuru","Calcutta":"Kolkata",
      "Bombay":"Mumbai","Madras":"Chennai","Trivandrum":"Thiruvananthapuram",
      "Allahabad":"Prayagraj","Benares":"Varanasi","Vizag":"Visakhapatnam",
    };
    const dbKey = ALIASES[dest.name] || dest.name;
    const local = TOURIST_SPOTS_DB[dbKey] ||
      Object.entries(TOURIST_SPOTS_DB).find(([k]) =>
        k !== "default" && (dest.name.toLowerCase().includes(k.toLowerCase()) ||
          k.toLowerCase().includes(dest.name.toLowerCase()))
      )?.[1] || TOURIST_SPOTS_DB["default"];

    setSpots(local);
    setSelSpots([]); setSpotSearch(""); setSpotType("All");

    // Fetch AI-powered spots
    (async () => {
      setSpotsLoading(true); setSpotsError(null);
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "gemini-sonnet-4-20250514",
            max_tokens: 1200,
            messages: [{ role: "user", content:
              `List the 14 best tourist attractions in ${dest.name}, ${dest.state}, India.
Return ONLY a valid JSON array. No markdown, no backticks, no explanation.
Schema per item: { "id":"ai_N", "name":"string", "rating":1-5, "type":"Heritage|Scenic|Spiritual|Culture|Nature|Beach|Shopping|Adventure|Food|Science", "distance":<km from city centre>, "visitTime":<hours>, "withinCity":<true if distance<=50> }` }]
          })
        });
        const data = await res.json();
        const text = (data?.content?.[0]?.text || "").replace(/```json|```/g,"").trim();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length) {
          const norm = parsed.map((s,i) => ({ ...s, id:`ai_${i}` }));
          spotsCache.current[key] = norm;
          setSpots(norm);
        }
      } catch(e) {
        setSpotsError("Live data unavailable. Showing offline spots.");
      } finally {
        setSpotsLoading(false);
      }
    })();
  }, [dest]);

  // ── Distance ──
  useEffect(() => {
    if (!source || !dest) return;
    const oneWay = haversine(source.lat, source.lng, dest.lat, dest.lng);
    const base = roundTrip ? oneWay * 2 : oneWay;
    const extra = transMode === "private" ? selSpots.reduce((s,x) => s+x.distance, 0) : 0;
    setDist(Math.round(base + extra));
  }, [source, dest, selSpots, transMode, roundTrip]);

  // ── Budget ──
  useEffect(() => {
    setRecalc(true);
    const t = setTimeout(() => {
      const days = startDate && endDate ? Math.max(1, Math.ceil((new Date(endDate)-new Date(startDate))/86400000)) : 3;
      const mult = getSeasonMult(startDate);
      const tier = dest?.tier || 2;
      const rates = TIER_RATES[tier];
      let fuel = 0;
      if (transMode === "private") {
        fuel = Math.round((dist / mileage) * fuelPrice);
      } else {
        const preset = TRANSPORT_PRESETS[pubType];
        const price = pubPrice > 0 ? pubPrice : Math.round(dist * preset.basePrice);
        fuel = price * persons;
      }
      const tollCost = transMode === "private" ? (roundTrip ? tolls*2 : tolls) : 0;
      const food = Math.round(rates.food * persons * 3 * days * mult);
      const stay = includeStay ? Math.round(rates.stay * Math.ceil(persons/2) * days * mult) : 0;
      setBudget({ fuel, food, stay, tolls: tollCost, total: fuel+food+stay+tollCost });
      setRecalc(false);
    }, 500);
    return () => clearTimeout(t);
  }, [dist, mileage, fuelPrice, tolls, transMode, pubType, pubPrice, persons, startDate, endDate, dest, includeStay, roundTrip]);

  const days = startDate && endDate ? Math.max(1, Math.ceil((new Date(endDate)-new Date(startDate))/86400000)) : 3;
  const smult = getSeasonMult(startDate);
  const seasonLabel = smult===1.5?"🔥 Peak Season (+50%)":smult===0.8?"❄️ Off-peak (-20%)":"🌤️ Normal Season";
  const seasonClass = smult===1.5?"s-peak":smult===0.8?"s-off":"s-normal";

  const visSpots = spots.filter(s => {
    if (transMode === "public" && s.withinCity === false) return false;
    if (spotSearch && !s.name.toLowerCase().includes(spotSearch.toLowerCase()) && !s.type.toLowerCase().includes(spotSearch.toLowerCase())) return false;
    if (spotType !== "All" && s.type !== spotType) return false;
    return true;
  });
  const spotTypes = ["All", ...Array.from(new Set(spots.map(s => s.type)))];

  return (
    <>
      <style>{css}</style>
      <div className="grid-bg" />
      <div className="app">

        {/* HEADER */}
        <div className="header">
          <div className="eyebrow">// Bharat Yatra Calc · India Trip Planner</div>
          <div className="title">BHARAT<br/>YATRA CALC</div>
          <div className="subtitle">Precision Budget &amp; Itinerary Calculator for Incredible India</div>
          {(source || dest || startDate) && (
            <div style={{marginTop:16}}>
              <button className="btn btn-danger" onClick={resetAll}>↺ Reset All &amp; Start Over</button>
            </div>
          )}
        </div>

        {/* STEPS */}
        <div className="steps">
          {STEPS.map((s,i) => (
            <div className="step-item" key={i}>
              <div className={`step-dot${step===i+1?" active":step>i+1?" done":""}`} onClick={() => step>i+1 && setStep(i+1)}>
                {step>i+1?"✓":i+1}
              </div>
              {i < STEPS.length-1 && <div className={`step-line${step>i+1?" done":""}`} />}
            </div>
          ))}
        </div>

        {/* STEP 1: ROUTE */}
        {step===1 && (
          <div className="fade-in">
            <div className="card">
              <div className="card-title"><span>🗺️</span> SOURCE &amp; DESTINATION</div>
              <div className="api-notice">⚡ 110+ cities loaded. Type any Indian city, hill station or pilgrimage.</div>
              <div className="input-row">
                <CityAC label="📍 Source City" value={source} onChange={setSource} />
                <CityAC label="🎯 Destination" value={dest} onChange={setDest} />
              </div>
              {source && dest && (
                <div style={{marginTop:16}}>
                  <div className="dist-badge">
                    {roundTrip?"🔄 Round Trip":"🛣️ One Way"}: <strong>{dist} km</strong>
                    {roundTrip && <span style={{opacity:0.6,fontSize:10}}> (×2)</span>}
                  </div>
                  <div style={{fontSize:12,color:"var(--text-dim)",marginTop:6,fontFamily:"'Roboto Mono',monospace"}}>
                    Tier: <span style={{color:dest.tier===1?"var(--teal-lt)":dest.tier===2?"var(--saffron)":"var(--gold)"}}>{["","Tier-1 Metro","Tier-2 Urban","Tier-3 Rural"][dest.tier]}</span>
                  </div>
                  <div className="toggle-row" style={{marginTop:12}}>
                    <div><div className="tgl-label">🔄 Round Trip</div><div className="tgl-sub">Include return journey in cost</div></div>
                    <label className="tgl-switch">
                      <input type="checkbox" checked={roundTrip} onChange={e=>setRoundTrip(e.target.checked)} />
                      <span className="tgl-slider" />
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="nav-row">
              <div />
              <button className="btn btn-primary" onClick={()=>setStep(2)} disabled={!source||!dest}>Next: Dates →</button>
            </div>
          </div>
        )}

        {/* STEP 2: DATES */}
        {step===2 && (
          <div className="fade-in">
            <div className="card">
              <div className="card-title"><span>📅</span> TRAVEL DATES &amp; GROUP</div>
              <div className="input-row" style={{marginBottom:16}}>
                <div className="input-group">
                  <label className="input-label">🗓️ Start Date</label>
                  <input type="date" className="inp" value={startDate} onChange={e=>setStartDate(e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">🗓️ End Date</label>
                  <input type="date" className="inp" value={endDate} onChange={e=>setEndDate(e.target.value)} />
                </div>
              </div>
              <div className="input-group" style={{marginBottom:16}}>
                <label className="input-label">👥 Number of Persons</label>
                <div className="range-wrap">
                  <input type="range" className="range" min={1} max={20} value={persons} onChange={e=>setPersons(+e.target.value)} />
                  <div className="range-val">{persons}</div>
                </div>
              </div>
              {startDate && (
                <div>
                  <span className={`season-badge ${seasonClass}`}>{seasonLabel}</span>
                  <div style={{fontSize:12,color:"var(--text-dim)",marginTop:8,fontFamily:"'Roboto Mono',monospace"}}>
                    Trip: {days} day{days>1?"s":""} · {Math.ceil(persons/2)} room{Math.ceil(persons/2)>1?"s":""}
                  </div>
                </div>
              )}
              <div style={{marginTop:16}}>
                <div className="toggle-row">
                  <div><div className="tgl-label">🏨 Include Stay / Accommodation</div><div className="tgl-sub">Turn off for day trips or own stay</div></div>
                  <label className="tgl-switch">
                    <input type="checkbox" checked={includeStay} onChange={e=>setIncludeStay(e.target.checked)} />
                    <span className="tgl-slider" />
                  </label>
                </div>
              </div>
            </div>
            <div className="nav-row">
              <button className="btn btn-secondary" onClick={()=>setStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={()=>setStep(3)} disabled={!startDate||!endDate}>Next: Transport →</button>
            </div>
          </div>
        )}

        {/* STEP 3: TRANSPORT */}
        {step===3 && (
          <div className="fade-in">
            <div className="card">
              <div className="card-title"><span>🚗</span> TRANSPORT MODE</div>
              <div className="tabs">
                <button className={`tab${transMode==="private"?" active":""}`} onClick={()=>setTransMode("private")}>🚗 Private Vehicle</button>
                <button className={`tab${transMode==="public"?" active":""}`} onClick={()=>setTransMode("public")}>🚌 Public Transport</button>
              </div>
              {transMode==="private" && (
                <div>
                  <div className="input-group" style={{marginBottom:14}}>
                    <label className="input-label">⛽ Mileage (KMPL)</label>
                    <div className="range-wrap">
                      <input type="range" className="range" min={5} max={35} value={mileage} onChange={e=>setMileage(+e.target.value)} />
                      <div className="range-val">{mileage}</div>
                    </div>
                  </div>
                  <div className="input-row" style={{marginBottom:14}}>
                    <div className="input-group">
                      <label className="input-label">💰 Fuel Price (₹/L)</label>
                      <input type="number" className="inp" value={fuelPrice} onChange={e=>setFuelPrice(+e.target.value)} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">🛣️ Toll Charges (₹)</label>
                      <input type="number" className="inp" value={tolls} onChange={e=>setTolls(+e.target.value)} />
                    </div>
                  </div>
                  <div style={{padding:"10px 14px",background:"var(--saffron-dim)",borderRadius:10,fontSize:13,fontFamily:"'Roboto Mono',monospace",color:"var(--saffron)"}}>
                    Fuel: ({dist}km ÷ {mileage}KMPL) × ₹{fuelPrice} = <strong>{formatINR(Math.round(dist/mileage*fuelPrice))}</strong>
                    &nbsp;| Tolls: <strong>{formatINR(roundTrip?tolls*2:tolls)}</strong>{roundTrip?" (×2 round trip)":""}
                  </div>
                </div>
              )}
              {transMode==="public" && (
                <div>
                  <div className="pub-grid">
                    {Object.entries(TRANSPORT_PRESETS).map(([k,v]) => (
                      <div key={k} className={`t-card${pubType===k?" sel":""}`} onClick={()=>setPubType(k)}>
                        <span className="t-icon">{v.icon}</span>
                        <div className="t-name">{v.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:14}}>
                    <label className="input-label">💰 Ticket Price per Person (₹) — 0 = auto estimate</label>
                    <input type="number" className="inp" value={pubPrice} onChange={e=>setPubPrice(+e.target.value)} placeholder={`Auto: ~₹${Math.round(dist*TRANSPORT_PRESETS[pubType].basePrice)}`} />
                  </div>
                </div>
              )}
            </div>
            <div className="nav-row">
              <button className="btn btn-secondary" onClick={()=>setStep(2)}>← Back</button>
              <button className="btn btn-primary" onClick={()=>setStep(4)}>Next: Itinerary →</button>
            </div>
          </div>
        )}

        {/* STEP 4: ITINERARY */}
        {step===4 && (
          <div className="fade-in">
            <div className="card">
              <div className="card-title">
                <span>📍</span>
                {transMode==="private"
                  ? `PLACES NEAR ${dest?.name?.toUpperCase()}`
                  : `PLACES IN ${dest?.name?.toUpperCase()}`}
                {spotsLoading && <span className="ai-badge">⟳ Loading live data...</span>}
                {!spotsLoading && spots.length > 0 && <span className="ai-badge">✦ AI Powered</span>}
              </div>

              {spotsError && <div className="err-banner">⚠️ {spotsError}</div>}

              {spotsLoading && spots.length === 0 ? (
                <div className="spinner-wrap">
                  <div className="spinner" />
                  <div>
                    <div className="spinner-title">Fetching spots for {dest?.name}...</div>
                    <div className="spinner-sub">🤖 Gemini AI is sourcing real places <div className="dots"><span/><span/><span/></div></div>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
                    <input type="text" className="inp" style={{flex:1,minWidth:160}} placeholder="🔍 Search spots..." value={spotSearch} onChange={e=>setSpotSearch(e.target.value)} />
                    <select className="inp" style={{minWidth:130}} value={spotType} onChange={e=>setSpotType(e.target.value)}>
                      {spotTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                    {selSpots.length > 0 && (
                      <button className="btn btn-danger" style={{fontSize:12,padding:"9px 14px"}} onClick={()=>setSelSpots([])}>Clear All ({selSpots.length})</button>
                    )}
                  </div>
                  {spotsLoading && (
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"8px 14px",background:"var(--saffron-dim)",borderRadius:10,fontSize:12,color:"var(--saffron)",fontFamily:"'Roboto Mono',monospace"}}>
                      <div className="spinner" style={{width:14,height:14,borderWidth:2}} />
                      Refreshing with live AI data for {dest?.name}...
                    </div>
                  )}
                  <div className="spots-grid">
                    {visSpots.map(s => (
                      <SpotCard key={s.id} spot={s} selected={!!selSpots.find(x=>x.id===s.id)}
                        onToggle={()=>{ if(selSpots.find(x=>x.id===s.id)) rmSpot(s.id); else setSelSpots(p=>[...p,s]); }}
                        onRemove={()=>rmSpot(s.id)} />
                    ))}
                  </div>
                  {selSpots.length > 0 && (
                    <div style={{marginTop:24}}>
                      <div style={{fontFamily:"'Abril Fatface',cursive",fontSize:17,marginBottom:12,color:"var(--text)"}}>
                        🗓️ Selected Itinerary ({selSpots.length} spots · ~{selSpots.reduce((a,s)=>a+s.visitTime,0)}h total)
                      </div>
                      <div className="itin-list">
                        {selSpots.map(s => (
                          <div key={s.id} className="itin-item">
                            <span className="drag-handle">⠿</span>
                            <span style={{fontSize:20}}>{SPOT_TYPE_ICONS[s.type]||"📍"}</span>
                            <div className="itin-info">
                              <div className="itin-name">{s.name}</div>
                              <div className="itin-sub">{s.type} · {s.distance}km · ⏱ ~{s.visitTime}h</div>
                            </div>
                            <button className="itin-rm" onClick={()=>rmSpot(s.id)}>Remove</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="nav-row">
              <button className="btn btn-secondary" onClick={()=>setStep(3)}>← Back</button>
              <button className="btn btn-primary" onClick={()=>setStep(5)}>Next: Summary →</button>
            </div>
          </div>
        )}

        {/* STEP 5: SUMMARY */}
        {step===5 && (
          <div className="fade-in">
            <div className="card">
              <div className="card-title"><span>💰</span> TRIP SUMMARY</div>
              <div className="results-grid">
                <div>
                  <div className="result-row"><span className="result-key">🗺️ Route</span><span className="result-val" style={{fontSize:13}}>{source?.name} {roundTrip?"⇄":"→"} {dest?.name}</span></div>
                  <div className="result-row"><span className="result-key">🔄 Journey</span><span className="result-val">{roundTrip?"Round Trip":"One Way"}</span></div>
                  <div className="result-row"><span className="result-key">📐 Distance</span><span className="result-val">{dist} km</span></div>
                  <div className="result-row"><span className="result-key">📅 Duration</span><span className="result-val">{days} Day{days>1?"s":""}</span></div>
                  <div className="result-row"><span className="result-key">👥 Persons</span><span className="result-val">{persons}</span></div>
                  <div className="result-row"><span className="result-key">🚗 Transport</span><span className="result-val" style={{fontSize:13}}>{transMode==="private"?"Private Vehicle":TRANSPORT_PRESETS[pubType].label}</span></div>
                </div>
                <div>
                  <div className="result-row"><span className="result-key">⛽ Fuel / Tickets</span><span className="result-val">{formatINR(budget.fuel)}</span></div>
                  <div className="result-row"><span className="result-key">🍛 Food ({days}d)</span><span className="result-val">{formatINR(budget.food)}</span></div>
                  <div className="result-row">
                    <span className="result-key">🏨 Stay {includeStay?`(${days}d × ${Math.ceil(persons/2)} rooms)`:"(excluded)"}</span>
                    <span className="result-val" style={{color:includeStay?"var(--saffron)":"var(--text-dim)"}}>{includeStay?formatINR(budget.stay):"—"}</span>
                  </div>
                  <div className="result-row"><span className="result-key">🛣️ Tolls</span><span className="result-val">{formatINR(budget.tolls)}</span></div>
                  <div className="result-row" style={{borderTop:"2px solid var(--saffron-dim)",marginTop:8,paddingTop:12}}>
                    <span className="result-key" style={{fontWeight:700,fontSize:15}}>💰 Total</span>
                    <span className="result-val" style={{fontSize:22}}>{formatINR(budget.total)}</span>
                  </div>
                </div>
              </div>
              {selSpots.length > 0 && (
                <div style={{marginTop:20}}>
                  <div style={{fontFamily:"'Abril Fatface',cursive",fontSize:17,marginBottom:10,color:"var(--text)"}}>📍 Your Itinerary</div>
                  {selSpots.map((s,i) => (
                    <div key={s.id} className="result-row">
                      <span className="result-key">{i+1}. {SPOT_TYPE_ICONS[s.type]} {s.name}</span>
                      <span className="result-val" style={{color:"var(--teal)",fontSize:12}}>{"★".repeat(s.rating)} · ~{s.visitTime}h</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="nav-row">
              <button className="btn btn-secondary" onClick={()=>setStep(4)}>← Edit Itinerary</button>
              <button className="btn btn-primary" onClick={resetAll}>↺ Plan New Trip</button>
            </div>
          </div>
        )}

      </div>
      <Footer budget={budget} recalc={recalc} />
    </>
  );
}