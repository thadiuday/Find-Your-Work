// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBf_rZvgxtviFjdvQgkS8TZIP41xpBppos",
  authDomain: "find-your-work-5193f.firebaseapp.com",
  projectId: "find-your-work-5193f",
  storageBucket: "find-your-work-5193f.appspot.com",
  messagingSenderId: "519803450809",
  appId: "1:519803450809:web:3463873c23057865dc6648",
  measurementId: "G-LJLEJ1FXWE",
  databaseURL: "https://find-your-work-5193f-default-rtdb.firebaseio.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Handle form submit
document.getElementById("postForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const skill = document.getElementById("skill").value;
  const location = document.getElementById("location").value;
  const phone = document.getElementById("phone").value;

  const newRef = database.ref("posts").push();
  newRef.set({
    name,
    skill,
    location,
    phone
  });

  document.getElementById("message").innerText = "✅ Post submitted!";
  document.getElementById("postForm").reset();
});
