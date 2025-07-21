import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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
const editingIdInput = document.getElementById("editingId");
const submitBtn = document.getElementById("submitBtn");

let allPosts = [];

onValue(postsRef, (snapshot) => {
  const data = snapshot.val();
  allPosts = data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : [];
  renderPosts();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const role = document.getElementById("role").value;
  const work = document.getElementById("work").value;
  const phone = document.getElementById("phone").value;
  const editingId = editingIdInput.value;

  if (editingId) {
    const postRef = ref(db, `posts/${editingId}`);
    update(postRef, { name, role, work, phone }).then(() => {
      alert("✅ Post updated.");
      resetForm();
    });
  } else {
    const timestamp = Date.now();
    push(postsRef, { name, role, work, phone, timestamp }).then(() => {
      alert("✅ Post submitted!");
      resetForm();
    });
  }
});

searchInput.addEventListener("input", renderPosts);

function renderPosts() {
  const keyword = searchInput.value.toLowerCase();
  postsContainer.innerHTML = "";

  const filtered = allPosts
    .filter(post => post.work.toLowerCase().includes(keyword))
    .sort((a, b) => b.timestamp - a.timestamp);

  if (filtered.length === 0) {
    postsContainer.innerHTML = "<p class='text-muted'>No posts found.</p>";
    return;
  }

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
}

window.deletePost = (id) => {
  if (confirm("Are you sure you want to delete this post?")) {
    remove(ref(db, `posts/${id}`));
  }
};

window.editPost = (id) => {
  const post = allPosts.find(p => p.id === id);
  if (post) {
    document.getElementById("name").value = post.name;
    document.getElementById("role").value = post.role;
    document.getElementById("work").value = post.work;
    document.getElementById("phone").value = post.phone;
    editingIdInput.value = post.id;
    submitBtn.textContent = "Update Post";
  }
};

function resetForm() {
  form.reset();
  editingIdInput.value = "";
  submitBtn.textContent = "Submit Post";
}
