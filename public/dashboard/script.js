let logo_button = document.getElementById('logo');
let cname = document.getElementById('cname');
let logout =  document.getElementById('logout')

function move_to_home(){
    axios.get('/dashboard')
        .then(()=>{
            window.location.href = '/dashboard';
        }).catch((error)=>{
            console.error('Request failed:', error);
        })
}

logo_button.addEventListener('click',()=>{
    move_to_home();
})
cname.addEventListener('click',()=>{
    move_to_home();
})
logout.addEventListener('click',()=>{
    axios.post('/logout', {}, {withCredentials: true })
        .then(()=>{
            window.location.href = '/login'; 
        })
});


