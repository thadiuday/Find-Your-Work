<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBf_rZvgtxviFjdvQgkS8T2IP41xpBppos",
    authDomain: "find-your-work-5193f.firebaseapp.com",
    projectId: "find-your-work-5193f",
    storageBucket: "find-your-work-5193f.firebasestorage.app",
    messagingSenderId: "519830450009",
    appId: "1:519830450009:web:37bc8d0e2f5870fcdc6648",
    measurementId: "G-6HFHWMG083"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const postsRef = ref(db, 'posts/');

  document.getElementById("submitForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const work = document.getElementById("work").value;
    const phone = document.getElementById("phone").value;

    push(postsRef, {
      name,
      work,
      phone
    }).then(() => {
      alert("✅ Post submitted!");
      e.target.reset();
    }).catch((error) => {
      console.error(error);
      alert("❌ Failed to submit. Check console.");
    });
  });

  // ✅ Listen for new posts and display them
  onValue(postsRef, (snapshot) => {
    const postList = document.getElementById("postList");
    postList.innerHTML = ""; // Clear previous

    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      const postDiv = document.createElement("div");
      postDiv.style.marginBottom = "12px";
      postDiv.style.padding = "10px";
      postDiv.style.border = "1px solid #ccc";
      postDiv.style.borderRadius = "8px";
      postDiv.innerHTML = `
        <strong>${data.name}</strong><br/>
        Work: ${data.work}<br/>
        Phone: ${data.phone}
      `;
      postList.appendChild(postDiv);
    });
  });
</script>
