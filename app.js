import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ✅ Your Firebase config with correct DB URL
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const postsRef = ref(db, "posts");

const form = document.getElementById("postForm");
const postsContainer = document.getElementById("posts");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const work = document.getElementById("work").value;
  const phone = document.getElementById("phone").value;

  if (name && work && phone) {
    push(postsRef, {
      name,
      work,
      phone
    }).then(() => {
      alert("✅ Post submitted!");
      form.reset();
    }).catch((error) => {
      console.error("❌ Error submitting post:", error);
    });
  }
});

// Show existing posts
onValue(postsRef, (snapshot) => {
  postsContainer.innerHTML = "";
  const data = snapshot.val();
  if (data) {
    Object.values(data).reverse().forEach(post => {
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `<strong>${post.name}</strong><br>Work: ${post.work}<br>Phone: ${post.phone}`;
      postsContainer.appendChild(div);
    });
  } else {
    postsContainer.innerHTML = "<p>No posts yet.</p>";
  }
});
