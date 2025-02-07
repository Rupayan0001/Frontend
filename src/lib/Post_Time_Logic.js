import moment from 'moment-timezone';
export default function postTimeLogic(e) {
    let showTime;
    const today = new Date();
    const fullDate = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    let [date, time] = moment(e.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss").split(" ")
    if (date.startsWith(new Date().getFullYear())) {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let [month, day] = date.slice(5).split("-");
        let year = date.slice(0, 4);
        month = months[Number(month) - 1];
        day = Number(day)
        time = time.slice(0, 5);
        const hour = Number(time.slice(0, 2));
        const minute = Number(time.slice(3));
        if (hour > 12) {
            time = ((hour - 12) >= 10 ? hour - 12 : "0" + (hour - 12)) + ":" + (minute >= 10 ? minute : "0" + minute) + " PM";
        }
        else if (hour === 12) {
            time = hour + ":" + (minute >= 10 ? minute : "0" + minute) + " PM";
        }
        else {
            time = (hour >= 10 ? hour : "0" + hour) + ":" + (minute >= 10 ? minute : "0" + minute) + " AM";
        }
        if (`${month} ${day}, ${year}` === fullDate) {
            showTime = `Today, ${time}`;
        }
        else if (`${month} ${day + 1}, ${year}` === fullDate) {
            showTime = "Yesterday " + time;
        }
        else {
            showTime = `${month} ${day}`;
        }
        return showTime;
    }
    else {
        const years = new Date().getFullYear() - date.slice(0, 4);
        showTime = `${years} year ago`;
        return showTime;
    }
}