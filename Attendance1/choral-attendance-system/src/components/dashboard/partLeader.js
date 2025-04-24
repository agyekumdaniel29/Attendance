class PartLeaderDashboard {
    constructor() {
        this.singers = [];
    }

    addSinger(singerName) {
        if (singerName) {
            this.singers.push(singerName);
            this.renderSingers();
        }
    }

    markAttendance(singerName) {
        const index = this.singers.indexOf(singerName);
        if (index > -1) {
            this.singers[index] += ' (Present)';
            this.renderSingers();
        }
    }

    renderSingers() {
        const singerList = document.getElementById('singers');
        singerList.innerHTML = '';
        this.singers.forEach(singer => {
            const listItem = document.createElement('li');
            listItem.textContent = singer;
            const markButton = document.createElement('button');
            markButton.textContent = 'Mark Present';
            markButton.onclick = () => this.markAttendance(singer);
            listItem.appendChild(markButton);
            singerList.appendChild(listItem);
        });
    }
}

export default PartLeaderDashboard;