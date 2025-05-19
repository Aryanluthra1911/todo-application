let login = document.getElementById('login');
let signup = document.getElementById('signup');
let logo_button = document.getElementById('logo');
let cname = document.getElementById('cname');
let url = window.location.href
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
    axios.get('/')
        .then(()=>{
            window.location.href = '/';
        }).catch((error)=>{
            console.error('Request failed:', error);
        })
}
axios.get('/')
    .then((res)=>{
        if (res.data.message === 'token exists'){
            window.location.href='/dashboard'
        }
    })
login.addEventListener('click',(ev)=>{
    move_to_login()
})
signup.addEventListener('click',(ev)=>{
    move_to_signup();
})
logo_button.addEventListener('click',()=>{
    move_to_home();
})
cname.addEventListener('click',()=>{
    move_to_home();
})
start.addEventListener('click',(ev)=>{
    move_to_signup();
})