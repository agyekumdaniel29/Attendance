// src/components/login/roleSelection.js

export function showRoleSelection() {
  const roles = ['Choir Master', 'Soprano', 'Tenor', 'Alto', 'Bass'];
  const roleButtons = roles.map(role => `
    <button onclick="login('${role}')">${role} Leader</button><br>
  `).join('');
  
  document.getElementById('page').innerHTML = `
    <h2>Select Your Role</h2>
    ${roleButtons}
  `;
}

export function login(role) {
  const content = `
    <h2>Login as ${role} Leader</h2>
    <form onsubmit="event.preventDefault(); loadDashboard('${role}')">
      <input type="text" placeholder="Username" required>
      <input type="text" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  `;
  document.getElementById('page').innerHTML = content;
}