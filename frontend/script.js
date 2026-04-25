// This will automatically use the current domain for API calls
const API_URL = window.location.origin + '/api';
let token = localStorage.getItem('token');

// Utility: Fetch with Auth
async function authFetch(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    const data = await response.json();
    if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error('Unauthorized');
    }
    return data;
}

// Auth Logic
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
            token = data.token;
            localStorage.setItem('token', token);
            showMain();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert('Login failed. Ensure backend is running.');
    }
});

function logout() {
    localStorage.removeItem('token');
    token = null;
    document.getElementById('main-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'flex';
}

document.getElementById('logout-btn').addEventListener('click', logout);

// Navigation
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const target = item.getAttribute('data-target');
        if (!target) return;

        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        views.forEach(v => v.classList.remove('active'));
        document.getElementById(`${target}-view`).classList.add('active');
        document.getElementById('page-title').innerText = target.charAt(0).toUpperCase() + target.slice(1);

        loadViewData(target);
    });
});

function showMain() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('main-section').style.display = 'flex';
    loadViewData('dashboard');
}

// Data Loading
async function loadViewData(view) {
    switch (view) {
        case 'dashboard': loadDashboard(); break;
        case 'students': loadStudents(); break;
        case 'courses': loadCourses(); break;
        case 'attendance': loadAttendance(); break;
        case 'grades': loadGrades(); break;
        case 'fees': loadFees(); break;
        case 'notifications': loadNotifications(); break;
    }
}

// Dashboard
async function loadDashboard() {
    const res = await authFetch('/stats');
    if (res.success) {
        document.getElementById('stat-students').innerText = res.data.totalStudents;
        document.getElementById('stat-courses').innerText = res.data.totalCourses;
        document.getElementById('stat-attendance').innerText = res.data.totalAttendance;
        document.getElementById('stat-fees').innerText = `₹${res.data.totalFees}`;
    }
}

// Students
async function loadStudents() {
    const res = await authFetch('/students');
    const tbody = document.getElementById('student-table-body');
    tbody.innerHTML = '';
    res.data.forEach(s => {
        tbody.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td>${s.branch}</td>
                <td>${s.year}</td>
                <td>
                    <button class="btn-success" onclick="editStudent(${s.id}, '${s.name}', '${s.email}', '${s.branch}', ${s.year})">Edit</button>
                    <button class="btn-danger" onclick="deleteStudent(${s.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

document.getElementById('student-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('student-id').value;
    const body = {
        name: document.getElementById('student-name').value,
        email: document.getElementById('student-email').value,
        branch: document.getElementById('student-branch').value,
        year: document.getElementById('student-year').value
    };

    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `/students/${id}` : '/students';

    const res = await authFetch(endpoint, {
        method,
        body: JSON.stringify(body)
    });

    if (res.success) {
        closeModals();
        loadStudents();
    }
});

async function deleteStudent(id) {
    if (confirm('Are you sure?')) {
        const res = await authFetch(`/students/${id}`, { method: 'DELETE' });
        if (res.success) loadStudents();
    }
}

function editStudent(id, name, email, branch, year) {
    document.getElementById('student-id').value = id;
    document.getElementById('student-name').value = name;
    document.getElementById('student-email').value = email;
    document.getElementById('student-branch').value = branch;
    document.getElementById('student-year').value = year;
    document.getElementById('student-modal-title').innerText = 'Edit Student';
    document.getElementById('student-modal').style.display = 'block';
}

// Courses
async function loadCourses() {
    const res = await authFetch('/courses');
    const tbody = document.getElementById('course-table-body');
    tbody.innerHTML = '';
    res.data.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.code}</td>
                <td>${c.credits}</td>
                <td><button class="btn-danger" onclick="deleteCourse(${c.id})">Delete</button></td>
            </tr>
        `;
    });
    updateSelects();
}

document.getElementById('course-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        name: document.getElementById('course-name').value,
        code: document.getElementById('course-code').value,
        credits: document.getElementById('course-credits').value
    };
    const res = await authFetch('/courses', { method: 'POST', body: JSON.stringify(body) });
    if (res.success) {
        closeModals();
        loadCourses();
    }
});

async function deleteCourse(id) {
    if (confirm('Are you sure?')) {
        const res = await authFetch(`/courses/${id}`, { method: 'DELETE' });
        if (res.success) loadCourses();
    }
}

// Helper to update dropdowns
async function updateSelects() {
    const sRes = await authFetch('/students');
    const cRes = await authFetch('/courses');

    const sSelects = ['attn-student-select', 'marks-student-select', 'fee-student-select'];
    const cSelects = ['attn-course-select', 'marks-course-select'];

    sSelects.forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;
        select.innerHTML = '<option value="">Select Student</option>';
        sRes.data.forEach(s => select.innerHTML += `<option value="${s.id}">${s.name}</option>`);
    });

    cSelects.forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;
        select.innerHTML = '<option value="">Select Course</option>';
        cRes.data.forEach(c => select.innerHTML += `<option value="${c.id}">${c.name}</option>`);
    });
}

// Attendance
document.getElementById('attendance-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        student_id: document.getElementById('attn-student-select').value,
        course_id: document.getElementById('attn-course-select').value,
        date: document.getElementById('attn-date').value,
        status: document.getElementById('attn-status').value
    };
    const res = await authFetch('/attendance', { method: 'POST', body: JSON.stringify(body) });
    if (res.success) loadAttendance();
});

async function loadAttendance() {
    const res = await authFetch('/attendance');
    const tbody = document.getElementById('attendance-table-body');
    tbody.innerHTML = '';
    res.data.forEach(a => {
        tbody.innerHTML += `
            <tr>
                <td>${a.student_name}</td>
                <td>${a.course_name}</td>
                <td>${new Date(a.date).toLocaleDateString()}</td>
                <td>${a.status}</td>
            </tr>
        `;
    });
}

// Grades
document.getElementById('marks-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        student_id: document.getElementById('marks-student-select').value,
        course_id: document.getElementById('marks-course-select').value,
        marks: document.getElementById('marks-input').value
    };
    const res = await authFetch('/grades', { method: 'POST', body: JSON.stringify(body) });
    if (res.success) loadGrades();
});

async function loadGrades() {
    const res = await authFetch('/results');
    const tbody = document.getElementById('results-table-body');
    tbody.innerHTML = '';
    res.data.forEach(r => {
        tbody.innerHTML += `
            <tr>
                <td>${r.student_name}</td>
                <td>${r.total_marks}</td>
                <td>${r.percentage}%</td>
                <td>${r.grade}</td>
            </tr>
        `;
    });
}

// Fees
document.getElementById('fees-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        student_id: document.getElementById('fee-student-select').value,
        amount: document.getElementById('fee-amount').value,
        date: document.getElementById('fee-date').value,
        status: document.getElementById('fee-status').value
    };
    const res = await authFetch('/fees', { method: 'POST', body: JSON.stringify(body) });
    if (res.success) loadFees();
});

async function loadFees() {
    const res = await authFetch('/fees');
    const tbody = document.getElementById('fees-table-body');
    tbody.innerHTML = '';
    res.data.forEach(f => {
        tbody.innerHTML += `
            <tr>
                <td>${f.student_name}</td>
                <td>₹${f.amount}</td>
                <td>${new Date(f.date).toLocaleDateString()}</td>
                <td>${f.status}</td>
            </tr>
        `;
    });
}

// Notifications
document.getElementById('notification-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        title: document.getElementById('notif-title').value,
        message: document.getElementById('notif-message').value
    };
    const res = await authFetch('/notifications', { method: 'POST', body: JSON.stringify(body) });
    if (res.success) {
        document.getElementById('notification-form').reset();
        loadNotifications();
    }
});

async function loadNotifications() {
    const res = await authFetch('/notifications');
    const list = document.getElementById('notifications-list');
    list.innerHTML = '';
    res.data.forEach(n => {
        list.innerHTML += `
            <div class="notif-item">
                <h4>${n.title}</h4>
                <p>${n.message}</p>
                <small>${new Date(n.date).toLocaleString()}</small>
            </div>
        `;
    });
}

// Modal Handlers
document.getElementById('open-student-modal').onclick = () => {
    document.getElementById('student-form').reset();
    document.getElementById('student-id').value = '';
    document.getElementById('student-modal-title').innerText = 'Add Student';
    document.getElementById('student-modal').style.display = 'block';
};

document.getElementById('open-course-modal').onclick = () => {
    document.getElementById('course-form').reset();
    document.getElementById('course-modal').style.display = 'block';
};

document.querySelectorAll('.closeModal').forEach(btn => {
    btn.onclick = closeModals;
});

function closeModals() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

// Initialize
if (token) showMain();
else logout();
