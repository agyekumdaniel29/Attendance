class ChoirMasterDashboard {
    constructor() {
        this.leaders = [];
        this.members = [];
    }

    addPartLeader(leaderName) {
        if (leaderName) {
            this.leaders.push(leaderName);
            this.renderLeaders();
        }
    }

    addChoirMember(memberName) {
        if (memberName) {
            this.members.push(memberName);
            this.renderMembers();
        }
    }

    renderLeaders() {
        const leadersList = document.getElementById('leaders');
        leadersList.innerHTML = '';
        this.leaders.forEach(leader => {
            const listItem = document.createElement('li');
            listItem.textContent = leader;
            leadersList.appendChild(listItem);
        });
    }

    renderMembers() {
        const membersList = document.getElementById('members');
        membersList.innerHTML = '';
        this.members.forEach(member => {
            const listItem = document.createElement('li');
            listItem.textContent = member;
            membersList.appendChild(listItem);
        });
    }

    viewAttendance() {
        // Logic to view attendance statistics can be added here
    }
}

export default ChoirMasterDashboard;