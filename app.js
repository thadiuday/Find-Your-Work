import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Firebase Config
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
const searchInput = document.getElementById("search");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const role = document.getElementById("role").value;
  const work = document.getElementById("work").value;
  const phone = document.getElementById("phone").value;
  const timestamp = Date.now();

  push(postsRef, {
    name,
    role,
    work,
    phone,
    timestamp
  }).then(() => {
    alert("✅ Post submitted!");
    form.reset();
  }).catch((err) => console.error("Error:", err));
});

// Display Posts
onValue(postsRef, (snapshot) => {
  postsContainer.innerHTML = "";
  const data = snapshot.val();
  if (data) {
    const posts = Object.entries(data).map(([id, value]) => ({ id, ...value }));

    // Sort by newest
    posts.sort((a, b) => b.timestamp - a.timestamp);

    // Filter by search
    const keyword = searchInput.value.toLowerCase();
    const filtered = posts.filter(post => post.work.toLowerCase().includes(keyword));

    filtered.forEach(post => {
      const div = document.createElement("div");
      div.className = "post card mb-2";
      div.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${post.name} (${post.role})</h5>
          <p class="card-text">
            Work: ${post.work}<br/>
            Phone: ${post.phone}<br/>
            <small class="text-muted">${new Date(post.timestamp).toLocaleString()}</small>
          </p>
          <button class="btn btn-sm btn-warning me-2" onclick="editPost('${post.id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deletePost('${post.id}')">Delete</button>
        </div>
      `;
      postsContainer.appendChild(div);
    });
  } else {
    postsContainer.innerHTML = "<p class='text-muted'>No posts found.</p>";
  }
});

// Real-time search
searchInput.addEventListener("input", () => {
  onValue(postsRef, () => {}); // Triggers re-render
});

// Delete function
window.deletePost = (id) => {
  if (confirm("Are you sure you want to delete this post?")) {
    remove(ref(db, `posts/${id}`));
  }
};

// Edit function
window.editPost = (id) => {
  const postRef = ref(db, `posts/${id}`);
  onValue(postRef, (snapshot) => {
    const post = snapshot.val();
    if (post) {
      document.getElementById("name").value = post.name;
      document.getElementById("role").value = post.role;
      document.getElementById("work").value = post.work;
      document.getElementById("phone").value = post.phone;
      form.removeEventListener("submit", addPostHandler);
      form.onsubmit = (e) => {
        e.preventDefault();
        update(postRef, {
          name: document.getElementById("name").value,
          role: document.getElementById("role").value,
          work: document.getElementById("work").value,
          phone: document.getElementById("phone").value
        }).then(() => {
          alert("✅ Post updated.");
          form.reset();
          form.onsubmit = addPostHandler;
        });
      };
    }
  }, { onlyOnce: true });
};

// Default add handler
const addPostHandler = (e) => {
  e.preventDefault();
  form.dispatchEvent(new Event("submit"));
};
form.addEventListener("submit", addPostHandler);
