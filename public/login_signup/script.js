let login = document.getElementById('login');
let signup = document.getElementById('signup')
let loginform = document.getElementById('loginform');
let signupform = document.getElementById('signupform');
let messagebox = document.getElementById('message')
let url = window.location.href
let logo_button = document.getElementById('logo');
let cname = document.getElementById('cname');

function move_to_signup(){
    axios.get('/signup')
        .then(()=>{
            window.location.href = '/signup';
        }).catch(()=>{
            console.error('Request failed:', error);
        })
}
var move_to_login = ()=>{
    axios.get('/login')
        .then(()=>{
            window.location.href = '/login';
        }).catch((error)=>{
            console.error('Request failed:', error);
        })
}
function move_to_home(){
    axios.get('/homepage')
        .then(()=>{
            window.location.href = '/homepage';
        }).catch((error)=>{
            console.error('Request failed:', error);
        })
}

if (url === "http://localhost:4444/login") {
    loginform.addEventListener('submit',(event)=>{
        event.preventDefault();
        let email = (document.getElementById('email')).value;
        let password = (document.getElementById('password')).value;
        
        if(email.trim() =='' || password.trim() ==''){
            messagebox.innerText = "No Data Added"
            loginform.disabled= true;
        }
        else{
            axios.post('/login',{
                email:email,
                password:password
            }).then((res)=>{
                if(!res.data.success){
                    if(res.data.message === 'User Not Found'){
                        setTimeout(()=>{
                            window.location.href = '/signup';
                        },3000)
                        messagebox.innerText= res.data.message+' Redirecting to Signup...';
                    }
                    else{
                        messagebox.innerText= res.data.message;
                    }
                    
                }
                else{
                    window.location.href = '/dashboard';
                }
            }).catch((error)=>{
                console.error('Request failed:', error);
            })
        }
    })
}

if (url === "http://localhost:4444/signup") {
    signupform.addEventListener('submit',(event)=>{
        console.log("button clicked");
        event.preventDefault();
        let name = (document.getElementById('name')).value;
        let email = (document.getElementById('email')).value;
        let password = (document.getElementById('password')).value;
        if(email.trim() ==='' || password.trim() ===''|| name.trim() ===''){
            messagebox.innerText = "No Data Added"
            signupform.disabled= true;
        }
        else{
            axios.post('/signup',{
                name:name,
                email:email,
                password:password
            }).then((res)=>{
                if(res.data.success){
                    window.location.href = '/dashboard';
                }
                else {
                    messagebox.innerText= 'Account already exists, Redirecting to Login...';
                    setTimeout(()=>{
                        window.location.href = '/login';
                    },3000)
                }
            }).catch((error)=>{
                console.error('Request failed:', error);
            })
        }
    })

}

if(url === "http://localhost:4444/signup" || url ==="http://localhost:4444/login"){
    login.addEventListener('click',(ev)=>{
        move_to_login()
    })
    signup.addEventListener('click',(ev)=>{
        console.log("clicked");
        move_to_signup();
    })
    logo_button.addEventListener('click',()=>{
        move_to_home();
    })
    cname.addEventListener('click',()=>{
        move_to_home();
    })
}


