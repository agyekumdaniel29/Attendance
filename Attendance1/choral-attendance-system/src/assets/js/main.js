document.addEventListener('DOMContentLoaded', () => {
    // Initialize the page based on current hash
    handleNavigation();

    // Listen for hash changes
    window.addEventListener('hashchange', handleNavigation);
});

function handleNavigation() {
    const hash = window.location.hash;
    
    // Parse the hash to get state and parameters
    const [page, ...params] = hash.slice(1).split('/');
    
    switch(page) {
        case 'roles':
            showRoleSelection();
            break;
        case 'login':
            // Decode the role parameter before passing to showLoginForm
            const decodedRole = decodeURIComponent(params[0]);
            showLoginForm(decodedRole);
            break;
        case 'dashboard':
            // Retrieve stored user data
            const userData = JSON.parse(sessionStorage.getItem('userData'));
            if (userData) {
                // Ensure role is properly decoded for dashboard
                userData.role = decodeURIComponent(userData.role);
                showDashboard(userData.username, userData.role);
            } else {
                navigateToHome();
            }
            break;
        default:
            navigateToHome();
    }
}

function navigateToHome() {
    window.location.hash = '';
    showWelcome();
}

function showRoleSelection() {
    const mainContent = document.querySelector('.header-content');
    if (!mainContent) {
        console.error('Header content not found');
        return;
    }

    mainContent.innerHTML = `
        <div class="back-section">
            <button class="back-button" onclick="showWelcome()">←</button>
        </div>
        <h2>Select Your Role</h2>
        <div class="roles-grid">
            <div class="role-card" data-role="Choir Master">
                <div class="role-image">
                    <img src="assets/images/choirmaster.jpg" alt="Choir Master">
                </div>
                <h3>Login as Choir Master</h3>
            </div>
            <div class="role-card" data-role="Soprano">
                <div class="role-image">
                    <img src="assets/images/soprano.jpg" alt="Soprano">
                </div>
                <h3>Login as Soprano</h3>
            </div>
            <div class="role-card" data-role="Alto">
                <div class="role-image">
                    <img src="assets/images/alto.jpg" alt="Alto">
                </div>
                <h3>Login as Alto</h3>
            </div>
            <div class="role-card" data-role="Tenor">
                <div class="role-image">
                    <img src="assets/images/tenor.jpg" alt="Tenor">
                </div>
                <h3>Login as Tenor</h3>
            </div>
            <div class="role-card" data-role="Bass">
                <div class="role-image">
                    <img src="assets/images/bass.jpg" alt="Bass">
                </div>
                <h3>Login as Bass</h3>
            </div>
        </div>
    `;

    // Add click event listeners to role cards
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const role = e.currentTarget.dataset.role;
            showLoginForm(role);
        });
    });

    window.location.hash = 'roles';
}

// Add this new function to handle going back to welcome screen
function showWelcome() {
    const mainContent = document.querySelector('.header-content');
    mainContent.innerHTML = `
        <h1>Wesley Methodist Church Choir</h1>
        <p class="welcome-text">Service: To God</p>
        <div class="musical-notes">♪ ♫ ♪</div>
        <button id="beginButton">Begin</button>
    `;

    // Reattach the begin button event listener
    document.getElementById('beginButton').addEventListener('click', showRoleSelection);
}

function showLoginForm(role) {
    const mainContent = document.querySelector('.header-content');
    mainContent.innerHTML = `
        <div class="form-container">
            <button class="back-button" onclick="showRoleSelection()">←</button>
            <h2>${role} Login</h2>
            <form class="login-form" id="loginForm">
                <div class="form-group">
                    <input type="text" id="username" placeholder="Username" required>
                </div>
                <div class="form-group">
                    <input type="password" id="password" placeholder="Password" required>
                </div>
                <button type="submit" class="login-button">LOGIN</button>
            </form>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const roleElement = document.querySelector('h2');
    const role = roleElement.textContent.replace(' Login', '');
    
    // Properly format the role for Part Leaders
    const userData = { 
        username, 
        role: role.includes('Leader') ? role : role + ' Leader'
    };
    sessionStorage.setItem('userData', JSON.stringify(userData));
    
    window.location.hash = 'dashboard';
    showDashboard(username, userData.role);
}

function showDashboard(username, role) {
    const mainContent = document.querySelector('.header-content');
    // Get the dashboard content first
    const dashboardContent = getDashboardContent(role);
    
    mainContent.innerHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <h2>Have a nice rehearsals</h2>
                <p class="role-label">${role}</p>
            </div>
            <div class="dashboard-content">
                ${dashboardContent}
            </div>
            <button onclick="logout()" class="logout-button">Logout</button>
        </div>
    `;
}

// Update the getDashboardContent function
function getDashboardContent(role) {
    if (role === 'Choir Master') {
        return `
            <div class="dashboard-grid">
                <div class="dashboard-card" onclick="handleAttendance()">
                    <h3>Take Attendance</h3>
                    <p>Mark attendance for all parts</p>
                </div>
                <div class="dashboard-card" onclick="viewAttendanceReports()">
                    <h3>Attendance Reports</h3>
                    <p>View attendance statistics</p>
                </div>
                <div class="dashboard-card" onclick="manageParts()">
                    <h3>Manage Parts</h3>
                    <p>View and manage all choir parts</p>
                </div>
                <div class="dashboard-card" onclick="addPartLeader()">
                    <h3>Add Part Leader</h3>
                    <p>Register new part leader</p>
                </div>
                <div class="dashboard-card" onclick="addChoirMember()">
                    <h3>Add Member</h3>
                    <p>Register new choir member</p>
                </div>
                <div class="dashboard-card" onclick="manageMembers()">
                    <h3>Manage Members</h3>
                    <p>Edit or remove members</p>
                </div>
            </div>`;
    } else if (role.includes('Leader')) {
        const part = role.replace(' Leader', '');
        return `
            <div class="dashboard-grid">
                <div class="dashboard-card" onclick="handlePartAttendance('${part}')">
                    <h3>Take Attendance</h3>
                    <p>Mark attendance for ${part}</p>
                </div>
                <div class="dashboard-card" onclick="viewPartAttendanceReports('${part}')">
                    <h3>View Reports</h3>
                    <p>View ${part} attendance reports</p>
                </div>
                <div class="dashboard-card" onclick="addPartMember('${part}')">
                    <h3>Add Member</h3>
                    <p>Add new ${part} member</p>
                </div>
                <div class="dashboard-card" onclick="managePartMembers('${part}')">
                    <h3>Manage Members</h3>
                    <p>Edit or remove ${part} members</p>
                </div>
            </div>`;
    } else {
        // Regular member dashboard
        return `<div class="dashboard-grid"></div>`;
        
    }
}

// Function to add new member for specific part
function addPartMember(part) {
    const mainContent = document.querySelector('.header-content');
    mainContent.innerHTML = `
        <div class="form-container">
            <button class="back-button" onclick="showDashboard('${sessionStorage.getItem('username')}', '${part} Leader')">←</button>
            <h2>Add New ${part} Member</h2>
            <form id="partMemberForm" class="data-form">
                <div class="form-group">
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" required>
                </div>
                <div class="form-group">
                    <label for="gender">Gender</label>
                    <select id="gender" required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="contact">Contact Number</label>
                    <input type="tel" id="contact" required>
                </div>
                <div class="form-group">
                    <label for="residence">Place of Residence</label>
                    <input type="text" id="residence" required>
                </div>
                <input type="hidden" id="part" value="${part}">
                <button type="submit" class="submit-button">Add Member</button>
            </form>
        </div>
    `;

    document.getElementById('partMemberForm').addEventListener('submit', handlePartMemberSubmission);
}

// Function to mark attendance for specific part
function handlePartAttendance(part) {
    const mainContent = document.querySelector('.header-content');
    mainContent.innerHTML = `
        <div class="attendance-container">
            <button class="back-button" onclick="showDashboard('${sessionStorage.getItem('username')}', '${part} Leader')">←</button>
            <h2>${part} Attendance</h2>
            <div class="date-selector">
                <input type="date" id="attendanceDate" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="attendance-list" id="attendanceList"></div>
            <button onclick="savePartAttendance('${part}')" class="submit-button">Save Attendance</button>
        </div>
    `;

    loadPartMembersList(part);
}

// Function to manage members of specific part
function managePartMembers(part) {
    const mainContent = document.querySelector('.header-content');
    mainContent.innerHTML = `
        <div class="members-container">
            <button class="back-button" onclick="showDashboard('${sessionStorage.getItem('username')}', '${part} Leader')">←</button>
            <h2>Manage ${part} Members</h2>
            <div class="members-list" id="membersList"></div>
        </div>
    `;

    loadMembersForManagement(part);
}

// Function to view attendance reports for specific part
function viewPartAttendanceReports(part) {
    const mainContent = document.querySelector('.header-content');
    mainContent.innerHTML = `
        <div class="reports-container">
            <button class="back-button" onclick="showDashboard('${sessionStorage.getItem('username')}', '${part} Leader')">←</button>
            <h2>${part} Attendance Reports</h2>
            <div class="report-filters">
                <div class="date-range">
                    <div class="form-group">
                        <label for="fromDate">From Date</label>
                        <input type="date" id="fromDate" required>
                    </div>
                    <div class="form-group">
                        <label for="toDate">To Date</label>
                        <input type="date" id="toDate" required>
                    </div>
                </div>
                <button onclick="generatePartReport('${part}')" class="submit-button">Generate Report</button>
            </div>
            <div id="reportContent" class="report-content"></div>
        </div>
    `;
}

// Add Part Member function for Part Leaders
function addPartMember(part) {
    const mainContent = document.querySelector('.header-content');
    mainContent.innerHTML = `
        <div class="form-container">
            <button class="back-button" onclick="showDashboard('${sessionStorage.getItem('username')}', '${part} Leader')">←</button>
            <h2>Add New ${part} Member</h2>
            <form id="partMemberForm" class="data-form">
                <div class="form-group">
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" required>
                </div>
                <div class="form-group">
                    <label for="gender">Gender</label>
                    <select id="gender" required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="contact">Contact Number</label>
                    <input type="tel" id="contact" required>
                </div>
                <div class="form-group">
                    <label for="residence">Place of Residence</label>
                    <input type="text" id="residence" required>
                </div>
                <input type="hidden" id="part" value="${part}">
                <button type="submit" class="submit-button">Add Member</button>
            </form>
        </div>
    `;

    document.getElementById('partMemberForm').addEventListener('submit', handlePartMemberSubmission);
}

// Handle Part Attendance
function handlePartAttendance(part) {
    const mainContent = document.querySelector('.header-content');
    mainContent.innerHTML = `
        <div class="attendance-container">
            <button class="back-button" onclick="showDashboard('${sessionStorage.getItem('username')}', '${part} Leader')">←</button>
            <h2>${part} Attendance</h2>
            <div class="date-selector">
                <input type="date" id="attendanceDate" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="attendance-list" id="attendanceList">
                <!-- Members list will be populated here -->
            </div>
            <button onclick="savePartAttendance('${part}')" class="submit-button">Save Attendance</button>
        </div>
    `;

    loadPartMembersList(part);
}

// View Part Attendance Reports
function viewPartAttendanceReports(part) {
    const mainContent = document.querySelector('.header-content');
    mainContent.innerHTML = `
        <div class="reports-container">
            <button class="back-button" onclick="showDashboard('${sessionStorage.getItem('username')}', '${part} Leader')">←</button>
            <h2>${part} Attendance Reports</h2>
            <div class="report-filters">
                <div class="date-range">
                    <div class="form-group">
                        <label for="fromDate">From Date</label>
                        <input type="date" id="fromDate" required>
                    </div>
                    <div class="form-group">
                        <label for="toDate">To Date</label>
                        <input type="date" id="toDate" required>
                    </div>
                </div>
                <button onclick="generatePartReport('${part}')" class="submit-button">Generate Report</button>
            </div>
            <div id="reportContent" class="report-content"></div>
        </div>
    `;
}

// Manage Part Members
function managePartMembers(part) {
    const mainContent = document.querySelector('.header-content');
    mainContent.innerHTML = `
        <div class="members-container">
            <button class="back-button" onclick="showDashboard('${sessionStorage.getItem('username')}', '${part} Leader')">←</button>
            <h2>Manage ${part} Members</h2>
            <div class="members-list" id="membersList">
                <!-- Members list will be populated here -->
            </div>
        </div>
    `;

    loadMembersForManagement(part);
}

// Add these new functions for Choir Master features
function addPartLeader() {
    const mainContent = document.querySelector('.header-content');
    mainContent.innerHTML = `
        <div class="form-container">
            <button class="back-button" onclick="showDashboard('${sessionStorage.getItem('username')}', 'Choir Master')">←</button>
            <h2>Add New Part Leader</h2>
            <form id="partLeaderForm" class="data-form">
                <div class="form-group">
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" required>
                </div>
                <div class="form-group">
                    <label for="part">Part</label>
                    <select id="part" required>
                        <option value="">Select Part</option>
                        <option value="Soprano">Soprano</option>
                        <option value="Alto">Alto</option>
                        <option value="Tenor">Tenor</option>
                        <option value="Bass">Bass</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="gender">Gender</label>
                    <select id="gender" required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="contact">Contact Number</label>
                    <input type="tel" id="contact" required>
                </div>
                <button type="submit" class="submit-button">Add Part Leader</button>
            </form>
        </div>
    `;

    document.getElementById('partLeaderForm').addEventListener('submit', handlePartLeaderSubmission);
}

function addChoirMember() {
    const mainContent = document.querySelector('.header-content');
    mainContent.innerHTML = `
        <div class="form-container">
            <button class="back-button" onclick="showDashboard('${sessionStorage.getItem('username')}', 'Choir Master')">←</button>
            <h2>Add New Choir Member</h2>
            <form id="memberForm" class="data-form">
                <div class="form-group">
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" required>
                </div>
                <div class="form-group">
                    <label for="part">Part</label>
                    <select id="part" required>
                        <option value="">Select Part</option>
                        <option value="Soprano">Soprano</option>
                        <option value="Alto">Alto</option>
                        <option value="Tenor">Tenor</option>
                        <option value="Bass">Bass</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="gender">Gender</label>
                    <select id="gender" required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="contact">Contact Number</label>
                    <input type="tel" id="contact" required>
                </div>
                <div class="form-group">
                    <label for="residence">Place of Residence</label>
                    <input type="text" id="residence" required>
                </div>
                <button type="submit" class="submit-button">Add Member</button>
            </form>
        </div>
    `;

    document.getElementById('memberForm').addEventListener('submit', handleMemberSubmission);
}

function handleAttendance() {
    const mainContent = document.querySelector('.header-content');
    mainContent.innerHTML = `
        <div class="attendance-container">
            <button class="back-button" onclick="showDashboard('${sessionStorage.getItem('username')}', 'Choir Master')">←</button>
            <h2>Take Attendance</h2>
            <div class="date-selector">
                <input type="date" id="attendanceDate" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="part-tabs">
                <button class="part-tab active" data-part="Soprano">Soprano</button>
                <button class="part-tab" data-part="Alto">Alto</button>
                <button class="part-tab" data-part="Tenor">Tenor</button>
                <button class="part-tab" data-part="Bass">Bass</button>
            </div>
            <div class="attendance-list" id="attendanceList">
                <!-- Members list will be populated here -->
            </div>
            <button onclick="saveAttendance()" class="submit-button">Save Attendance</button>
        </div>
    `;

    // Add tab switching functionality
    const tabs = document.querySelectorAll('.part-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            loadMembersList(e.target.dataset.part);
        });
    });

    // Load initial members list
    loadMembersList('Soprano');
}

function viewAttendanceReports() {
    const mainContent = document.querySelector('.header-content');
    mainContent.innerHTML = `
        <div class="reports-container">
            <button class="back-button" onclick="showDashboard('${sessionStorage.getItem('username')}', 'Choir Master')">←</button>
            <h2>Attendance Reports</h2>
            <div class="report-filters">
                <div class="date-range">
                    <div class="form-group">
                        <label for="fromDate">From Date</label>
                        <input type="date" id="fromDate" required>
                    </div>
                    <div class="form-group">
                        <label for="toDate">To Date</label>
                        <input type="date" id="toDate" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="partFilter">Select Part</label>
                    <select id="partFilter">
                        <option value="all">All Parts</option>
                        <option value="Soprano">Soprano</option>
                        <option value="Alto">Alto</option>
                        <option value="Tenor">Tenor</option>
                        <option value="Bass">Bass</option>
                    </select>
                </div>
                <button onclick="generateReport()" class="submit-button">Generate Report</button>
            </div>
            <div id="reportContent" class="report-content"></div>
        </div>
    `;
}

// Placeholder functions for dashboard actions
function handleAttendance() {
    console.log('Take attendance clicked');
}

function viewReports() {
    console.log('View reports clicked');
}

function manageMembers() {
    console.log('Manage members clicked');
}

function viewMyAttendance() {
    const mainContent = document.querySelector('.header-content');
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    
    mainContent.innerHTML = `
        <div class="attendance-container">
            <button class="back-button" onclick="showDashboard('${userData.username}', '${userData.role}')">←</button>
            <h2>My Attendance History</h2>
            <div class="attendance-content">
                <!-- Attendance history will be displayed here -->
            </div>
        </div>
    `;
}

function viewSchedule() {
    const mainContent = document.querySelector('.header-content');
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    
    mainContent.innerHTML = `
        <div class="schedule-container">
            <button class="back-button" onclick="showDashboard('${userData.username}', '${userData.role}')">←</button>
            <h2>Practice Schedule</h2>
            <div class="schedule-content">
                <!-- Schedule will be displayed here -->
            </div>
        </div>
    `;
}

function editProfile() {
    const mainContent = document.querySelector('.header-content');
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    
    mainContent.innerHTML = `
        <div class="form-container">
            <button class="back-button" onclick="showDashboard('${userData.username}', '${userData.role}')">←</button>
            <h2>Update Profile</h2>
            <form id="profileForm" class="data-form">
                <div class="form-group">
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" required>
                </div>
                <div class="form-group">
                    <label for="contact">Contact Number</label>
                    <input type="tel" id="contact" required>
                </div>
                <div class="form-group">
                    <label for="residence">Place of Residence</label>
                    <input type="text" id="residence" required>
                </div>
                <button type="submit" class="submit-button">Update Profile</button>
            </form>
        </div>
    `;

    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
}

// Update logout functionality
function logout() {
    sessionStorage.removeItem('userData');
    navigateToHome();
}

// Make all functions globally available
window.showRoleSelection = showRoleSelection;
window.handleLogin = handleLogin;
window.showDashboard = showDashboard;
window.handleAttendance = handleAttendance;
window.viewReports = viewReports;
window.manageMembers = manageMembers;
window.viewMyAttendance = viewMyAttendance;
window.viewSchedule = viewSchedule;
window.editProfile = editProfile;
window.showWelcome = showWelcome;
window.logout = logout;
window.addPartLeader = addPartLeader;
window.addChoirMember = addChoirMember;
window.handleAttendance = handleAttendance;
window.viewAttendanceReports = viewAttendanceReports;
window.manageParts = manageParts;
window.addPartMember = addPartMember;
window.handlePartAttendance = handlePartAttendance;
window.viewPartAttendanceReports = viewPartAttendanceReports;
window.managePartMembers = managePartMembers;

// Add these helper functions after your existing code

function handlePartMemberSubmission(event) {
    event.preventDefault();
    const formData = {
        fullName: document.getElementById('fullName').value,
        gender: document.getElementById('gender').value,
        contact: document.getElementById('contact').value,
        residence: document.getElementById('residence').value,
        part: document.getElementById('part').value
    };

    // Add to overall choir members
    const members = JSON.parse(localStorage.getItem('choirMembers') || '[]');
    members.push(formData);
    localStorage.setItem('choirMembers', JSON.stringify(members));

    alert('Member added successfully!');
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    showDashboard(userData.username, userData.role);
}

function loadPartMembersList(part) {
    const attendanceList = document.getElementById('attendanceList');
    const members = JSON.parse(localStorage.getItem('choirMembers') || '[]');
    const partMembers = members.filter(member => member.part === part);

    if (partMembers.length === 0) {
        attendanceList.innerHTML = '<p class="no-members">No members found for this part</p>';
        return;
    }

    attendanceList.innerHTML = partMembers.map(member => `
        <div class="attendance-row">
            <span>${member.fullName}</span>
            <select class="attendance-status" data-member-id="${member.fullName}">
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="excused">Excused</option>
            </select>
        </div>
    `).join('');
}

function loadMembersForManagement(part) {
    const membersList = document.getElementById('membersList');
    const members = JSON.parse(localStorage.getItem('choirMembers') || '[]');
    const partMembers = members.filter(member => member.part === part);

    membersList.innerHTML = partMembers.map(member => `
        <div class="member-card">
            <h3>${member.fullName}</h3>
            <p>Contact: ${member.contact}</p>
            <p>Residence: ${member.residence}</p>
            <div class="member-actions">
                <button onclick="editMember('${member.fullName}', '${part}')" class="edit-button">Edit</button>
                <button onclick="deleteMember('${member.fullName}', '${part}')" class="delete-button">Delete</button>
            </div>
        </div>
    `).join('');
}

function editMember(memberName, part) {
    const members = JSON.parse(localStorage.getItem('choirMembers') || '[]');
    const member = members.find(m => m.fullName === memberName && m.part === part);
    if (!member) return;

    const mainContent = document.querySelector('.header-content');
    mainContent.innerHTML = `
        <div class="form-container">
            <button class="back-button" onclick="managePartMembers('${part}')">←</button>
            <h2>Edit Member</h2>
            <form id="editMemberForm" class="data-form">
                <div class="form-group">
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" value="${member.fullName}" required>
                </div>
                <div class="form-group">
                    <label for="contact">Contact Number</label>
                    <input type="tel" id="contact" value="${member.contact}" required>
                </div>
                <div class="form-group">
                    <label for="residence">Place of Residence</label>
                    <input type="text" id="residence" value="${member.residence}" required>
                </div>
                <input type="hidden" id="originalName" value="${member.fullName}">
                <button type="submit" class="submit-button">Update Member</button>
            </form>
        </div>
    `;

    document.getElementById('editMemberForm').addEventListener('submit', (e) => handleMemberUpdate(e, part));
}

function handleMemberUpdate(event, part) {
    event.preventDefault();
    const originalName = document.getElementById('originalName').value;
    const members = JSON.parse(localStorage.getItem('choirMembers') || '[]');
    const index = members.findIndex(m => m.fullName === originalName && m.part === part);

    if (index !== -1) {
        members[index] = {
            ...members[index],
            fullName: document.getElementById('fullName').value,
            contact: document.getElementById('contact').value,
            residence: document.getElementById('residence').value
        };
        localStorage.setItem('choirMembers', JSON.stringify(members));
        alert('Member updated successfully!');
        managePartMembers(part);
    }
}

function deleteMember(memberName, part) {
    if (confirm('Are you sure you want to delete this member?')) {
        const members = JSON.parse(localStorage.getItem('choirMembers') || '[]');
        const updatedMembers = members.filter(m => !(m.fullName === memberName && m.part === part));
        localStorage.setItem('choirMembers', JSON.stringify(updatedMembers));
        alert('Member deleted successfully!');
        managePartMembers(part);
    }
}

function savePartAttendance(part) {
    const date = document.getElementById('attendanceDate').value;
    const attendanceRecords = [];
    
    document.querySelectorAll('.attendance-status').forEach(select => {
        attendanceRecords.push({
            memberId: select.dataset.memberId,
            status: select.value,
            date: date,
            part: part
        });
    });

    // Store attendance in localStorage
    const allAttendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    allAttendance.push({
        date: date,
        part: part,
        records: attendanceRecords
    });
    localStorage.setItem('attendance', JSON.stringify(allAttendance));

    alert('Attendance saved successfully!');
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    showDashboard(userData.username, userData.role);
}

function generatePartReport(part) {
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    const partAttendance = attendance.filter(record => 
        record.part === part && 
        record.date >= fromDate && 
        record.date <= toDate
    );

    const reportContent = document.getElementById('reportContent');
    
    if (partAttendance.length === 0) {
        reportContent.innerHTML = '<p class="no-data">No attendance records found for this period</p>';
        return;
    }

    // Generate report HTML
    let reportHTML = `
        <h3>Attendance Report for ${part}</h3>
        <p>Period: ${fromDate} to ${toDate}</p>
        <div class="report-table">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Excused</th>
                    </tr>
                </thead>
                <tbody>
    `;

    partAttendance.forEach(record => {
        const present = record.records.filter(r => r.status === 'present').length;
        const absent = record.records.filter(r => r.status === 'absent').length;
        const excused = record.records.filter(r => r.status === 'excused').length;

        reportHTML += `
            <tr>
                <td>${record.date}</td>
                <td>${present}</td>
                <td>${absent}</td>
                <td>${excused}</td>
            </tr>
        `;
    });

    reportHTML += `
                </tbody>
            </table>
        </div>
    `;

    reportContent.innerHTML = reportHTML;
}

// Add these to make functions globally available
window.handlePartMemberSubmission = handlePartMemberSubmission;
window.loadPartMembersList = loadPartMembersList;
window.loadMembersForManagement = loadMembersForManagement;
window.savePartAttendance = savePartAttendance;
window.generatePartReport = generatePartReport;
window.editMember = editMember;
window.deleteMember = deleteMember;
window.handleMemberUpdate = handleMemberUpdate;

function manageParts() {
    const mainContent = document.querySelector('.header-content');
    mainContent.innerHTML = `
        <div class="parts-container">
            <button class="back-button" onclick="showDashboard('${sessionStorage.getItem('username')}', 'Choir Master')">←</button>
            <h2>Manage Choir Parts</h2>
            <div class="parts-grid">
                <div class="part-section" id="sopranoSection">
                    <h3>Soprano</h3>
                    <div class="part-stats"></div>
                </div>
                <div class="part-section" id="altoSection">
                    <h3>Alto</h3>
                    <div class="part-stats"></div>
                </div>
                <div class="part-section" id="tenorSection">
                    <h3>Tenor</h3>
                    <div class="part-stats"></div>
                </div>
                <div class="part-section" id="bassSection">
                    <h3>Bass</h3>
                    <div class="part-stats"></div>
                </div>
            </div>
        </div>
    `;

    // Load stats for each part
    loadPartStats();
}

// Helper function to load part statistics
function loadPartStats() {
    const members = JSON.parse(localStorage.getItem('choirMembers') || '[]');
    const parts = ['Soprano', 'Alto', 'Tenor', 'Bass'];

    parts.forEach(part => {
        const partMembers = members.filter(member => member.part === part);
        const statsContainer = document.querySelector(`#${part.toLowerCase()}Section .part-stats`);
        
        statsContainer.innerHTML = `
            <p>Total Members: ${partMembers.length}</p>
            <button onclick="viewPartMembers('${part}')" class="view-members-btn">View Members</button>
        `;
    });
}

// Add to global scope
window.manageParts = manageParts;