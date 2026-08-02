
// ===============================
// 30Days - app.js
// ===============================

const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let currentBalance = 0;

// Verifye itilizatè
auth.onAuthStateChanged((user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    loadUser();
    loadHistory();

});

// Chaje done itilizatè
function loadUser() {

    db.collection("users")
    .doc(currentUser.uid)
    .onSnapshot((doc) => {

        if (!doc.exists) return;

        const data = doc.data();

        currentBalance = data.balance || 0;

        const balance = document.getElementById("balance");

        if(balance){
            balance.innerHTML = currentBalance.toFixed(2) + " USDT";
        }

    });

}

// ===============================
// DEPOT
// ===============================

function submitDeposit(){

    const amount = parseFloat(document.getElementById("depositAmount").value);

    if(isNaN(amount) || amount<=0){
        alert("Antre yon montan.");
        return;
    }

    db.collection("transactions").add({

        uid: currentUser.uid,
        type:"Deposit",
        amount:amount,
        status:"Pending",
        createdAt:firebase.firestore.FieldValue.serverTimestamp()

    }).then(()=>{

        alert("Demann dépôt voye.");

        document.getElementById("depositAmount").value="";

    });

}

// ===============================
// RETRAIT
// ===============================

function submitWithdraw(){

    const address=document.getElementById("wallet").value.trim();

    const amount=parseFloat(document.getElementById("withdrawAmount").value);

    if(address==""){
        alert("Antre adrès wallet.");
        return;
    }

    if(isNaN(amount) || amount<1.5){
        alert("Minimum retrait = 1.5 USDT");
        return;
    }

    if(amount>currentBalance){
        alert("Balans pa sifi.");
        return;
    }

    db.collection("transactions").add({

        uid:currentUser.uid,
        type:"Withdraw",
        amount:amount,
        wallet:address,
        status:"Pending",
        createdAt:firebase.firestore.FieldValue.serverTimestamp()

    }).then(()=>{

        alert("Retrait an anrejistre.");

        document.getElementById("wallet").value="";
        document.getElementById("withdrawAmount").value="";

    });

}

// ===============================
// HISTORIQUE
// ===============================

function loadHistory(){

    const history=document.getElementById("history");

    if(!history) return;

    db.collection("transactions")

    .where("uid","==",currentUser.uid)

    .orderBy("createdAt","desc")

    .onSnapshot((snapshot)=>{

        history.innerHTML="";

        snapshot.forEach((doc)=>{

            const d=doc.data();

            history.innerHTML+=`

            <div class="history-card">

                <h4>${d.type}</h4>

                <p>${d.amount} USDT</p>

                <small>${d.status}</small>

            </div>

            `;

        });

    });

}

// ===============================
// PROFIT 24H
// ===============================

function claimProfit(){

    db.collection("users")

    .doc(currentUser.uid)

    .update({

        balance:firebase.firestore.FieldValue.increment(0.50),
        totalProfit:firebase.firestore.FieldValue.increment(0.50)

    })

    .then(()=>{

        alert("0.50 USDT ajoute.");

    });

}

// ===============================
// COPY REFERRAL
// ===============================

function copyReferral(){

    const text=document.getElementById("referralLink").value;

    navigator.clipboard.writeText(text);

    alert("Lien copié.");

}

// ===============================
// LOGOUT
// ===============================

function logout(){

    auth.signOut();

}
