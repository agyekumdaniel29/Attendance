// filepath: choral-attendance-system/src/js/attendance.js

class Attendance {
    constructor() {
        this.attendanceList = [];
    }

    markAttendance(singerName) {
        if (!singerName) return;
        const attendanceRecord = {
            name: singerName,
            present: true,
            timestamp: new Date().toISOString()
        };
        this.attendanceList.push(attendanceRecord);
        this.displayAttendance();
    }

    toggleAttendance(singerName) {
        const record = this.attendanceList.find(att => att.name === singerName);
        if (record) {
            record.present = !record.present;
            this.displayAttendance();
        }
    }

    displayAttendance() {
        const attendanceContainer = document.getElementById('attendanceList');
        attendanceContainer.innerHTML = '';
        this.attendanceList.forEach(record => {
            const listItem = document.createElement('li');
            listItem.textContent = `${record.name} - ${record.present ? 'Present' : 'Absent'}`;
            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = record.present ? 'Mark Absent' : 'Mark Present';
            toggleBtn.onclick = () => this.toggleAttendance(record.name);
            listItem.appendChild(toggleBtn);
            attendanceContainer.appendChild(listItem);
        });
    }
}

const attendance = new Attendance();