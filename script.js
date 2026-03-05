let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(){
    const list = document.getElementById("taskList");
    const search = document.getElementById("searchInput").value.toLowerCase();
    list.innerHTML="";

    let filtered = tasks.filter(task => {
        if(filter==="active" && task.completed) return false;
        if(filter==="completed" && !task.completed) return false;
        if(!task.text.toLowerCase().includes(search)) return false;
        return true;
    });

    filtered.forEach((task,index)=>{
        const li = document.createElement("li");
        li.draggable = true;

        li.innerHTML=`
        <div class="task-info">
            <span class="task-text ${task.completed?"completed":""}" onclick="toggleTask(${index})">
                ${task.text}
            </span>
            <span class="category ${task.category}">${task.category}</span>
            <span class="${task.priority==="important"?"important":""}">${task.priority==="important"?"⭐ Важливе":""}</span>
            <span class="date">${task.date ? "📅 "+task.date : ""}</span>
        </div>
        <button class="delete-btn" onclick="deleteTask(${index})">✕</button>
        `;

        addDrag(li,index);
        list.appendChild(li);
    });

    updateCounter();
    updateProgress();
    drawChart();
}

function addTask(){
    const text = document.getElementById("taskInput").value.trim();
    const date = document.getElementById("taskDate").value;
    const priority = document.getElementById("taskPriority").value;
    const category = document.getElementById("taskCategory").value;

    if(text==="") return;

    tasks.push({text,date,priority,category,completed:false});
    document.getElementById("taskInput").value="";
    saveTasks();
    renderTasks();
    checkDeadlines();
}

function deleteTask(index){
    tasks.splice(index,1);
    saveTasks();
    renderTasks();
}

function toggleTask(index){
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function setFilter(type,btn){
    filter = type;
    if(btn){
        document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
    }
    renderTasks();
}

let dragIndex = null;
function addDrag(el,index){
    el.addEventListener("dragstart",()=>{dragIndex=index});
    el.addEventListener("dragover", e=>{e.preventDefault()});
    el.addEventListener("drop", ()=>{
        let temp = tasks[dragIndex];
        tasks.splice(dragIndex,1);
        tasks.splice(index,0,temp);
        saveTasks();
        renderTasks();
    });
}

function updateCounter(){
    let active = tasks.filter(t=>!t.completed).length;
    document.getElementById("taskCount").innerText="Активних задач: "+active;
}

function updateProgress(){
    let done = tasks.filter(t=>t.completed).length;
    let percent = tasks.length ? (done/tasks.length)*100 : 0;
    document.getElementById("progressBar").style.width = percent+"%";
}

function checkDeadlines(){
    const today = new Date().toISOString().split("T")[0];
    tasks.forEach(task=>{
        if(task.date===today && !task.completed){
            setTimeout(()=>{alert("🔔 Сьогодні дедлайн задачі: "+task.text)},1000);
        }
    });
}

function exportTasks(){
    const data = JSON.stringify(tasks,null,2);
    const blob = new Blob([data],{type:"application/json"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tasks.json";
    link.click();
}

function toggleTheme(){
    document.body.classList.toggle("dark");
}

// Генерація частинок (залишається як раніше)
const numParticles = 35;
const colors = [
  "rgba(255,255,255,0.25)",
  "rgba(200,255,255,0.2)",
  "rgba(180,240,255,0.2)",
  "rgba(150,255,200,0.2)",
  "rgba(255,230,180,0.2)"
];

for(let i=0;i<numParticles;i++){
    const p = document.createElement("div");
    p.classList.add("particle");

    const size = Math.random()*20 + 5;
    p.style.width = size + "px";
    p.style.height = size + "px";

    // випадкова позиція
    const startTop = Math.random() * window.innerHeight;
    p.style.top = startTop + "px";
    p.style.left = Math.random() * window.innerWidth + "px";

    // випадкове зміщення для руху
    const moveY = (Math.random()*200 - 100) + "px"; // +/- 100px від старту
    p.style.setProperty("--moveY", moveY);

    // випадковий колір
    p.style.background = colors[Math.floor(Math.random()*colors.length)];

    // швидкість і затримка
    p.style.animationDuration = (Math.random()*25 + 15)+"s";
    p.style.animationDelay = Math.random()*10 + "s";

    // форма
    if(Math.random() > 0.7){
        p.style.borderRadius = "50% 30% 50% 30%";
    }

    document.body.appendChild(p);
}

renderTasks();
checkDeadlines();