// ============================================
// THIRTY DAYS - AUTHENTICATION
// ============================================

// Firebase dwe deja initialize nan firebase.js
const auth = firebase.auth();
const db = firebase.firestore();


// ============================================
// REGISTER
// ============================================

async function registerUser() {

  const emailInput = document.getElementById("register-email");
  const passwordInput = document.getElementById("register-password");
  const confirmInput = document.getElementById("register-confirm-password");

  if (!emailInput || !passwordInput) {
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmInput
    ? confirmInput.value
    : password;


  if (!email) {
    showAuthMessage("Veuillez entrer votre email.", "error");
    return;
  }

  if (password.length < 6) {
    showAuthMessage(
      "Le mot de passe doit contenir au moins 6 caractères.",
      "error"
    );
    return;
  }

  if (password !== confirmPassword) {
    showAuthMessage(
      "Les mots de passe ne correspondent pas.",
      "error"
    );
    return;
  }


  try {

    const result =
      await auth.createUserWithEmailAndPassword(
        email,
        password
      );

    const user = result.user;


    // Récupérer le code de parrainage
    const urlParams =
      new URLSearchParams(window.location.search);

    const referralCode =
      urlParams.get("ref");


    // Créer le compte utilisateur
    await db.collection("users")
      .doc(user.uid)
      .set({

        uid: user.uid,

        email: email,

        balance: 0,

        lastClaim: 0,

        daysClaimed: 0,

        referralCode:
          user.uid.substring(0, 8).toUpperCase(),

        referredBy:
          referralCode || null,

        referralCount: 0,

        referralEarnings: 0,

        createdAt:
          firebase.firestore.FieldValue.serverTimestamp()

      });


    // Si l'utilisateur vient d'un parrain
    if (referralCode) {

      const usersSnapshot =
        await db.collection("users")
          .where(
            "referralCode",
            "==",
            referralCode
          )
          .limit(1)
          .get();


      if (!usersSnapshot.empty) {

        const sponsor =
          usersSnapshot.docs[0];

        await db.collection("users")
          .doc(sponsor.id)
          .update({

            referralCount:
              firebase.firestore.FieldValue.increment(1)

          });

      }
    }


    showAuthMessage(
      "Compte créé avec succès !",
      "success"
    );


    setTimeout(() => {

      window.location.href =
        "index.html";

    }, 1000);


  } catch (error) {

    console.error(error);

    let message =
      "Une erreur est survenue.";

    if (error.code === "auth/email-already-in-use") {
      message =
        "Cette adresse email est déjà utilisée.";
    }

    if (error.code === "auth/invalid-email") {
      message =
        "Adresse email invalide.";
    }

    if (error.code === "auth/weak-password") {
      message =
        "Mot de passe trop faible.";
    }

    showAuthMessage(message, "error");
  }
}



// ============================================
// LOGIN
// ============================================

async function loginUser() {

  const emailInput =
    document.getElementById("login-email");

  const passwordInput =
    document.getElementById("login-password");


  if (!emailInput || !passwordInput) {
    return;
  }


  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value;


  if (!email || !password) {

    showAuthMessage(
      "Veuillez remplir tous les champs.",
      "error"
    );

    return;
  }


  try {

    await auth.signInWithEmailAndPassword(
      email,
      password
    );


    showAuthMessage(
      "Connexion réussie !",
      "success"
    );


    setTimeout(() => {

      window.location.href =
        "index.html";

    }, 700);


  } catch (error) {

    console.error(error);

    let message =
      "Email ou mot de passe incorrect.";

    if (error.code === "auth/user-not-found") {
      message =
        "Aucun compte trouvé avec cet email.";
    }

    if (error.code === "auth/wrong-password") {
      message =
        "Mot de passe incorrect.";
    }

    if (error.code === "auth/invalid-credential") {
      message =
        "Email ou mot de passe incorrect.";
    }

    showAuthMessage(message, "error");
  }
}



// ============================================
// LOGOUT
// ============================================

async function logoutUser() {

  try {

    await auth.signOut();

    window.location.href =
      "login.html";

  } catch (error) {

    console.error(error);

  }
}



// ============================================
// MOT DE PASSE OUBLIÉ
// ============================================

async function resetPassword() {

  const emailInput =
    document.getElementById("login-email");

  if (!emailInput) {
    return;
  }


  const email =
    emailInput.value.trim();


  if (!email) {

    showAuthMessage(
      "Entrez votre email pour réinitialiser votre mot de passe.",
      "error"
    );

    return;
  }


  try {

    await auth.sendPasswordResetEmail(
      email
    );


    showAuthMessage(
      "Un lien de réinitialisation a été envoyé à votre email.",
      "success"
    );


  } catch (error) {

    console.error(error);

    showAuthMessage(
      "Impossible d'envoyer le lien de réinitialisation.",
      "error"
    );
  }
}



// ============================================
// MESSAGE AUTHENTIFICATION
// ============================================

function showAuthMessage(text, type) {

  let message =
    document.getElementById("auth-message");


  if (!message) {

    message =
      document.createElement("div");

    message.id =
      "auth-message";

    document.body.appendChild(message);
  }


  message.innerText =
    text;

  message.className =
    "auth-message " + type;
}



// ============================================
// SI L'UTILISATEUR EST DÉJÀ CONNECTÉ
// ============================================

auth.onAuthStateChanged((user) => {

  const currentPage =
    window.location.pathname;


  const isLoginPage =
    currentPage.includes("login.html");

  const isRegisterPage =
    currentPage.includes("register.html");


  if (
    user &&
    (isLoginPage || isRegisterPage)
  ) {

    window.location.href =
      "index.html";
  }

});
