let login = document.getElementById('login');
let signup = document.getElementById('signup');
let logo_button = document.getElementById('logo');
let name = document.getElementById('name');
let start = document.getElementById('start')

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

login.addEventListener('click',(ev)=>{
    move_to_login()
})
signup.addEventListener('click',(ev)=>{
    move_to_signup();
})
logo_button.addEventListener('click',()=>{
    move_to_home();
})
name.addEventListener('click',()=>{
    move_to_home();
})
start.addEventListener('click',(ev)=>{
    move_to_signup();
})