let logo_button = document.getElementById('logo');
let cname = document.getElementById('cname');
let logout =  document.getElementById('logout');
let filters = document.getElementById('filters');
let heading = document.getElementById('heading');
heading.innerText="All Tasks";
let add_form= document.getElementById('add_block');
let info = document.getElementById('info');
let task_name = document.getElementById('task_name');



function move_to_home(){
    axios.get('/dashboard')
        .then(()=>{
            window.location.href = '/dashboard';
        }).catch((error)=>{
            console.error('Request failed:', error);
        })
}
function add_task(t){
    let block = document.getElementById('task_area');
    block.innerHTML= `<div id="task_block">
                        <div id="task"></div>
                        <div id="button_area">
                            <button id="done">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 13L9 17L19 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <button id="delete">
                                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6H5H21" stroke="white" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M8 6V4C8 3.5 8.5 3 9 3H15C15.5 3 16 3.5 16 4V6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M19 6L18 20H6L5 6" stroke="white" stroke-width="2"/>
                                    <path d="M10 11L14 15M14 11L10 15" stroke="white" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </button>
                            <button id="more">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 5L16 12L8 19" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>`
    let task = document.getElementById('task');
    task.innerText=t;
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

filters.addEventListener('click',(ev)=>{
    let element= ev.target;
    let id = element.getAttribute('id');

    let allButtons= element.parentElement.children;
    for(let i =0;i<allButtons.length;i++){
        allButtons[i].classList.remove('active')
    }
    if(id=="all"){
        allButtons[0].classList.add('active');
        heading.innerText="All Tasks"
    }
    if(id=="upcoming"){
        allButtons[1].classList.add('active');
        heading.innerText="Upcoming Tasks"
    }
    if(id=="completed"){
        allButtons[2].classList.add('active');
        heading.innerText="Completed Tasks"
    }
})
task_name.addEventListener('input',(ev)=>{
    info.innerHTML=`<div class="box3">
                        due date : 
                        <input type="date" id="due_date"></input>
                    </div>
                    <div class="box3">
                        priority :
                        <select id="input_priority" name="priority">
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                    </div>
                    
                    `
})
add_form.addEventListener('submit',(ev)=>{
    ev.preventDefault();
    let t = (document.getElementById('task_name')).value;
    if (t){
        add_task(t);
    }
    
})