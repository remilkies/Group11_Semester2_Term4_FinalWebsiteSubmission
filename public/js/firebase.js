// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB22gXJXl4MBtvvoMo9pVEYoHHA_jWrQm0",
  authDomain: "dream-stream-37644.firebaseapp.com",
  projectId: "dream-stream-37644",
  storageBucket: "dream-stream-37644.firebasestorage.app",
  messagingSenderId: "603396861613",
  appId: "1:603396861613:web:714786336e0e24e3e8e024"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const auth = getAuth(app);

// document.getElementById('LoginForm').addEventListener("submit", async(e)=>{
//     e.preventDefault();
//     let email = document.getElementById('logInEmail').value;
//     let password = document.getElementById('logInPass').value;
//     let username = document.getElementById('logInUse').value;

//     try{
//         await signInWithEmailAndPassword(auth, email, password, username);
//         alert("Log in is successful");
//         window.location.href = ".../pages/log-in.html"; //redirect
//     }catch (error){
//         alert(error.message);
//     }

// });

document.getElementById('signupForm').addEventListener("submit", async(e)=>{
    e.preventDefault();
    let username = document.getElementById('signUpUse').value;
    let email = document.getElementById('signUpEmail').value;
    let password = document.getElementById('signUpPass').value;

    try{
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account has been created successfully");
        window.location.href = "../pages/sign-up.html";
    }catch (error){
        alert(error.message);
    }

});

document.getElementById('loginForm').addEventListener("submit", async(e)=>{
    e.preventDefault();
    let email = document.getElementById('signInEmail').value;
    let username = document.getElementById('signInUse').value;
    let password = document.getElementById('signInPass').value;
    

    try{
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login is successful");
        window.location.href = "../index.html"; //redirect
    }catch (error){
        alert(error.message);
    }

});