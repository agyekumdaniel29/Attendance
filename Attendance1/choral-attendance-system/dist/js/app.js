function showRoleSelection() {
    const mainContent = document.querySelector('.ornamental-border');
    const roles = ['Choir Master', 'Soprano', 'Alto', 'Tenor', 'Bass'];
    
    const roleButtons = roles.map(role => `
        <button onclick="selectRole('${role}')" class="role-button">
            ${role}
        </button>
    `).join('');

    mainContent.innerHTML = `
        <button aria-label="Go back" class="back-button"></button>
        <h2>Select Your Role</h2>
        <div class="role-container">
            ${roleButtons}
        </div>
    `;
}

function goBack() {
    const mainContent = document.querySelector('.ornamental-border');
    mainContent.innerHTML = `
        <h1>WESLEY METHODIST CHURCH CHOIR</h1>
        <p>Enter to praise the Lord with song</p>
        <button onclick="showRoleSelection()">Begin</button>
    `;
}

function selectRole(role) {
    localStorage.setItem('choirRole', role);
    const attendance = new Attendance();
    // Initialize attendance view based on role
    console.log(`Selected role: ${role}`);
}