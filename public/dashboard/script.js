let logo_button = document.getElementById('logo');
let cname = document.getElementById('cname');
let logout =  document.getElementById('logout');
let filters = document.getElementById('filters');
let heading = document.getElementById('heading');
heading.innerText="All Tasks";
let add_form= document.getElementById('add_block');
let info = document.getElementById('info');
let task_name = document.getElementById('task_name');
let tasks = [];
let current_tasks=[]
let task_area = document.getElementById('task_area');

function move_to_home(){
    axios.get('/dashboard')
        .then(()=>{
            window.location.href = '/dashboard';
        }).catch((error)=>{
            console.error('Request failed:', error);
        })
}


function show_data(arr){
    let block = document.getElementById('task_area');
    block.innerHTML = '';
    for(let i = 0;i<arr.length;i++){
        let div = document.createElement('div')
        div.classList.add('task_block');
        const taskhtml= `<div class="task">${arr[i].title}</div>
                        <div id="button_area">
                            <button class="done">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 13L9 17L19 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <button class="delete">
                                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6H5H21" stroke="white" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M8 6V4C8 3.5 8.5 3 9 3H15C15.5 3 16 3.5 16 4V6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M19 6L18 20H6L5 6" stroke="white" stroke-width="2"/>
                                    <path d="M10 11L14 15M14 11L10 15" stroke="white" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </button>
                            <button class="more">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 5L16 12L8 19" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        `
        div.innerHTML = taskhtml;
        block.appendChild(div);
    }
}

async function fetch_data() {
    try {
        const res = await axios.get('/task');
        return res.data.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
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

filters.addEventListener('click',async(ev)=>{
    let element= ev.target;
    let id = element.getAttribute('id');

    let allButtons= element.parentElement.children;
    for(let i =0;i<allButtons.length;i++){
        allButtons[i].classList.remove('active')
    }
    tasks = await fetch_data();
    if(id=="all"){
        allButtons[0].classList.add('active');
        heading.innerText="All Tasks"
        current_tasks = tasks
        
    }
    if(id=="upcoming"){
        allButtons[1].classList.add('active');
        heading.innerText="Upcoming Tasks"
        current_tasks = tasks.filter(item=> item.status=== 'pending');

    }
    if(id=="completed"){
        allButtons[2].classList.add('active');
        heading.innerText="Completed Tasks";
        current_tasks = tasks.filter(item => item.status === 'completed');
    }
    show_data(current_tasks)
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
    setTimeout(()=>{
        info.innerHTML='';
    },20000)

})
add_form.addEventListener('submit',(ev)=>{
    ev.preventDefault();
    let title = (document.getElementById('task_name')).value;
    let due_date = (document.getElementById('due_date')).value;
    let priority = (document.getElementById('input_priority')).value;

    if (title && due_date && priority){
        axios.post('/dashboard',{
            title,
            due_date,
            priority
        }).then(async()=>{
            filtered_data()
            setTimeout(()=>{
                info.innerHTML='';
            },2000)
        }).catch((err)=>{
            console.error('Error:', err);
        })
        
    }
})
async function filtered_data(){
    let active_button =  document.querySelector(".active");
    tasks = await fetch_data();
    if(active_button && active_button.id==="all"){
        heading.innerText="All Tasks"
        current_tasks = tasks
    }
    else if(active_button &&active_button.id==="upcoming"){
        heading.innerText="Upcoming Tasks"
        current_tasks = tasks.filter(item=> item.status=== 'pending');
    }
    else if(active_button && active_button.id==="completed"){
        heading.innerText="Completed Tasks";
        current_tasks = tasks.filter(item => item.status === 'completed');
    }
    show_data(current_tasks)
    console.log(current_tasks);
}
task_area.addEventListener('click',async(ev)=>{
    let element =  ev.target;

    let taskBlock = element.closest('.task_block');
    let title = taskBlock.querySelector('.task').innerText

    let title_name = document.getElementById('title_name')
    let date  =  document.getElementById('date')
    const new_date = new Date(date);
    let priority  =  document.getElementById('priority')
    let status  =  document.getElementById('status')

    title_name.innerText=""
    date.innerText=""
    priority.innerText=""
    status.innerText=""

    if(element.closest('button.done')){
        try {
            await axios.patch('/completed', {
                title
            }).then(async()=>{
                await filtered_data()
            })
        } catch (error) {
            console.error(error);
        }
    }
    if(element.closest('button.delete')){
        try {
            await axios.delete('/delete', {
                data: { title }
            })
            await filtered_data()

        }catch (error) {
            console.error(error);
        }
    }
    if(element.closest('button.more')){
        try{
            await axios.post('/details', { title })
            .then((res)=>{
                
                title_name.innerText=res.data.title
                date.innerText=new Date(res.data.due_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'})
                priority.innerText=res.data.priority
                status.innerText=res.data.status
            })
        }
        catch (error) {
            console.error(error);
        }
    }
    

})

window.addEventListener('DOMContentLoaded', async () => {
    const tasks = await fetch_data();
    show_data(tasks);
})
