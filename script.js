const API_URL = "https://ublwxhck19.execute-api.eu-north-1.amazonaws.com/tasks";

if (!localStorage.getItem("user")) {
  window.location.href = "login.html";
}

async function loadTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const user = localStorage.getItem("user");

  const res = await fetch(`${API_URL}?userId=${user}`);
  const data = await res.json();

  if (data.length === 0) {
    list.innerHTML = "<p>No tasks</p>";
    return;
  }

  data.forEach(item => {
    const li = document.createElement("li");
    li.className = "task";

    li.innerHTML = `
      <span>${item.task}</span>
      <button onclick="deleteTask('${item.taskId}')">Delete</button>
    `;

    list.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById("taskInput");
  const task = input.value.trim();

  if (!task) return;

  const user = localStorage.getItem("user");

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      task: task,
      userId: user
    })
  });

  input.value = "";
  loadTasks();
}

async function deleteTask(id) {
  const user = localStorage.getItem("user");

  await fetch(API_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      taskId: id,
      userId: user
    })
  });

  loadTasks();
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

window.onload = loadTasks;