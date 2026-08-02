// ================================
// 30Days - auth.js
// ================================

const auth = firebase.auth();
const db = firebase.firestore();

// Enskripsyon
function registerUser() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Tanpri ranpli tout chan yo.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {

        const uid = userCredential.user.uid;

        return db.collection("users").doc(uid).set({
            email: email,
            balance: 0,
            totalDeposit: 0,
            totalWithdraw: 0,
            totalProfit: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

    })
    .then(() => {

        alert("Kont kreye avèk siksè.");

        window.location.href = "index.html";

    })
    .catch((error) => {

        alert(error.message);

    });
}

// Koneksyon
function loginUser() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    auth.signInWithEmailAndPassword(email, password)

    .then(() => {

        window.location.href = "index.html";

    })

    .catch((error) => {

        alert(error.message);

    });

}

// Dekoneksyon
function logoutUser() {

    auth.signOut()

    .then(() => {

        window.location.href = "login.html";

    });

}

// Verifye si itilizatè konekte
auth.onAuthStateChanged((user) => {

    if (user) {

        console.log("User connecté :", user.uid);

    } else {

        console.log("Aucun utilisateur connecté.");

    }

});
