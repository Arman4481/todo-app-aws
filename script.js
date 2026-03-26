const API_URL = "https://ublwxhck19.execute-api.eu-north-1.amazonaws.com/tasks";

// Protect route
if (!localStorage.getItem("user")) {
  window.location.href = "login.html";
}

// Load tasks
async function loadTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const user = localStorage.getItem("user"); // 🔥 NEW

  const res = await fetch(`${API_URL}?userId=${user}`);
  const data = await res.json();

  if (data.length === 0) {
    list.innerHTML = "<p class='empty'>No tasks yet</p>";
    return;
  }

  data.forEach(item => {
    const li = document.createElement("li");
    li.className = "task";

    li.innerHTML = `
      <span>${item.task}</span>
      <button class="delete-btn" onclick="deleteTask('${item.taskId}')">Delete</button>
    `;

    list.appendChild(li);
  });
}

// Add task
async function addTask() {
  const input = document.getElementById("taskInput");
  const task = input.value.trim();

  if (!task) return;

  const user = localStorage.getItem("user");  // 🔥 NEW

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      taskId: Date.now().toString(),
      task: task,
      userId: user   // 🔥 NEW
    })
  });

  input.value = "";
  loadTasks();
}

// Delete
async function deleteTask(id) {
  await fetch(API_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskId: id })
  });

  loadTasks();
}

// Logout
function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

window.onload = loadTasks;