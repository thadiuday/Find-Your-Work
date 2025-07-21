// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ✅ Correct Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBf_rZvgtxviFjdvQgkS8T2IP41xpBppos",
  authDomain: "find-your-work-5193f.firebaseapp.com",
  databaseURL: "https://find-your-work-5193f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "find-your-work-5193f",
  storageBucket: "find-your-work-5193f.appspot.com",
  messagingSenderId: "519830450009",
  appId: "1:519830450009:web:37bc8d0e2f5870fcdc6648",
  measurementId: "G-6HFHWMG083"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const postsRef = ref(db, "posts");

// Handle form submission
const form = document.getElementById("submitForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const work = document.getElementById("work").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !work || !phone) {
    alert("Please fill in all fields.");
    return;
  }

  const postData = { name, work, phone };

  // ✅ Write to Firebase
  push(postsRef, postData)
    .then(() => {
      alert("Post submitted successfully!");
      form.reset();
    })
    .catch((error) => {
      console.error("Firebase Write Error:", error);
      alert("Error submitting post: " + error.message);
    });
});

// ✅ Read & display posts
onValue(postsRef, (snapshot) => {
  const postList = document.getElementById("postList");
  postList.innerHTML = ""; // Clear previous posts

  if (!snapshot.exists()) {
    postList.innerHTML = "<p>No posts yet.</p>";
    return;
  }

  snapshot.forEach((child) => {
    const post = child.val();
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${post.name}</strong><br>
      Work: ${post.work}<br>
      Phone: ${post.phone}<br><br>
    `;
    postList.appendChild(div);
  });
});
