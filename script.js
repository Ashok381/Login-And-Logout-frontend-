
// Grab DOM elements
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');

const signupView = document.getElementById('signup-view') ; 
const info = document.getElementById('info') ; 
const details = document.getElementById("details");
const allButtonTypes = document.querySelectorAll('button[type="button"], input[type="button"] , button[type="submit"]');
/**
 * STEP 1: The Automatic Check on App Load
 * This is how the front-end "knows" the user logged in previously.
 */
function showInfo(message, color = "white") {
    info.style.display = "block";
    info.style.backgroundColor = color;
    info.innerHTML = `<h3>${message}</h3>`;

    setTimeout(() => {
        info.style.display = "none";
    }, 1000);
}
function setButtonsDisabled(state) {
     console.log("inside buttonDisabled") ;  
    allButtonTypes.forEach(button => {
        console.log(button) ; 
        button.disabled = state;
    });
}
async function checkAuth() {
    try {
        const response = await fetch(
            "https://login-and-logout-backend.onrender.com/user/getCurrentUser",
            {
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error("Unauthorized");
        }
       console.log('reached there') ; 
        const User = await response.json();
console.log('reached there') ; 
        const user = User.data.user;
console.log('reached there') ; 
        dashboardView.classList.remove('hidden');
        loginView.classList.add('hidden');
        signupView.classList.add('hidden');
        details.innerHTML = `
 <div class="cover-container">
    <img src="${user.coverImage}" style="height:140px;width:100%; border-radius:5px; border-style: solid; border-color: whitesmoke; border-width : 5px">
    </div>
    <div class="profile-card">
    <img src="${user.Avatar}" style="height:80px;width: 80px; border-radius: 100%; border-style: solid; border-color: whitesmoke; border-width : 5px">

    <div class="user-info">
        <h2>${user.fullName}</h2>
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Created:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
        <p><strong>Updated:</strong> ${new Date(user.updatedAt).toLocaleDateString()}</p>
    </div>

   
</div>
`;

    } catch (error) {
        console.log(error.message);

        loginView.classList.remove('hidden');
        signupView.classList.add('hidden');
        dashboardView.classList.add('hidden');
    }
}

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setButtonsDisabled(true);
    try {
        const formData = {
            username: document.getElementById("username").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value
        };

        const response = await fetch(
            "https://login-and-logout-backend.onrender.com/user/login",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        showInfo(data.message);

        await checkAuth();

    } catch (error) {
        showInfo(error.message, "red");
    }
     finally{
      setButtonsDisabled(false);
    }
});

logoutBtn.addEventListener("click", async () => {
    setButtonsDisabled(true);
    try {
        const response = await fetch(
            "https://login-and-logout-backend.onrender.com/user/logOut",
            {
                method: "POST",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        showInfo(data.message);

        showLoginform();

    } catch (error) {
        showInfo(error.message, "red");
    }
     finally{
      setButtonsDisabled(false);
    }
}); 

function showSignupform(){
       dashboardView.classList.add('hidden');
        loginView.classList.add('hidden');
        signupView.classList.remove('hidden') ; 
}
function showLoginform(){
       dashboardView.classList.add('hidden');
        loginView.classList.remove('hidden');
        signupView.classList.add('hidden') ; 
}
 
async function signupform() {
    setButtonsDisabled(true);
    try {

        const avatarFile =
            document.getElementById("avatar").files?.[0];

        if (!avatarFile) {
            throw new Error("Please select an avatar");
        }

        const formData = new FormData();

        formData.append(
            "username",
            document.getElementById("Username").value.trim()
        );

        formData.append(
            "email",
            document.getElementById("Email").value.trim()
        );

        formData.append(
            "fullName",
            document.getElementById("fullName").value.trim()
        );

        formData.append(
            "password",
            document.getElementById("Password").value
        );

        formData.append("avatar", avatarFile);

        const coverFile =
            document.getElementById("coverImage").files?.[0];

        if (coverFile) {
            formData.append("coverimage", coverFile);
        }

        const response = await fetch(
            "https://login-and-logout-backend.onrender.com/user/register",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        showInfo(data.message);

        showLoginform();

    } catch (error) {
        showInfo(error.message, "red");
    }
    finally{
      setButtonsDisabled(false);
    }
}

  
(async ()=>{
    console.log("this checkAuth run first")
await checkAuth() ;
 console.log("run")
})() ; 
 
