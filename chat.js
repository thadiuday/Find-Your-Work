import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Firebase config (same as your app.js)
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
const chatRef = ref(db, "chat");

const chatForm = document.getElementById("chatForm");
const chatBox = document.getElementById("chatBox");

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("chatName").value;
  const message = document.getElementById("chatMessage").value;

  push(chatRef, {
    name,
    message,
    timestamp: Date.now()
  });

  chatForm.reset();
});

onChildAdded(chatRef, (snapshot) => {
  const msg = snapshot.val();
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `
    <strong>${msg.name}</strong>: ${msg.message}<br/>
    <span class="timestamp">${new Date(msg.timestamp).toLocaleString()}</span>
  `;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight; // auto scroll
});
