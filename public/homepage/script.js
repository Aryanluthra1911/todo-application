let login = document.getElementById('login');
let signup = document.getElementById('signup');

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

login.addEventListener('click',(ev)=>{
    move_to_login()
})
signup.addEventListener('click',(ev)=>{
    move_to_signup();
})