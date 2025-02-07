import moment from "moment-timezone";

export default function messageTimeLogic(e) {
    let [date, time] = moment(e.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss").split(" ")
    // const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    time = time.slice(0, 5);
    const hour = Number(time.slice(0, 2));
    const minute = Number(time.slice(3));
    if (hour > 12) {
        time = hour - 12 + ":" + (minute >= 10 ? minute : "0" + minute) + " PM";
    }
    else if (hour === 12) {
        time = hour + ":" + (minute >= 10 ? minute : "0" + minute) + " PM";
    }
    else {
        time = hour + ":" + (minute >= 10 ? minute : "0" + minute) + " AM";
    }
    return time;
}

export function messageDateGroupLogic(messageList) {

    const today = new Date();
    const fullDate = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    // console.log("today: dfhdfhdh ", fullDate)

    const newArr = messageList.map((e, i) => {
        let [date, time] = moment(e.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss").split(" ")
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let [month, day] = date.slice(5).split("-");
        let year = date.slice(0, 4);
        month = months[Number(month) - 1];
        day = Number(day)
        let newDate;
        // const yesterday = day - 1
        // console.log("`${month} ${day}, ${year}` === fullDate: ", `${month} ${day}, ${year}` === fullDate)
        if (`${month} ${day}, ${year}` === fullDate) {
            newDate = "Today";
        }
        else if (`${month} ${day + 1}, ${year}` === fullDate) {
            newDate = "Yesterday";
        }
        else {
            newDate = `${month} ${day}, ${year}`;
        }
        e.date = newDate;
        return e;
    })

    const group = []
    newArr.forEach((e, i) => {
        const found = group.find((item, i) => item.date === e.date)
        if (!found) {
            group.push({ date: e.date, data: [] })
        }
    })
    // console.log("group: ", group)
    newArr.forEach((e, i) => {
        group.forEach((item, i) => {
            if (item.date === e.date) {
                item.data.push(e);
            }
        });
    })
    return group;
}
export function lastSeenTimeLogic(e) {
    let [date, time] = moment(e).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss").split(" ")
    const months = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const today = new Date().getDate();
    const shortDate = date.slice(5);
    const day = Number(shortDate.slice(3));
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

    if (day === today) {
        return "today at " + time;
    }
    else if (day === today - 1) {
        return "yesterday at " + time;
    }
    else {
        return shortDate.slice(3) + " " + months[Number(shortDate.slice(0, 2)) - 1] + " at " + time;
    }
}

export function lastMessageTimeLogic(e) {
    let [date, time] = moment(e).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss").split(" ")
    const today = new Date().getDate();
    const shortDate = date.slice(5);
    const year = Number(date.slice(2, 4))
    const day = Number(shortDate.slice(3));
    time = time.slice(0, 5);

    const hour = Number(time.slice(0, 2));
    const minute = Number(time.slice(3));
    if (hour > 12) {
        time = ((hour - 12) >= 10 ? hour - 12 : (hour - 12)) + ":" + (minute >= 10 ? minute : "0" + minute) + " PM";
    }
    else if (hour === 12) {
        time = hour + ":" + (minute >= 10 ? minute : "0" + minute) + " PM";
    }
    else {
        time = hour + ":" + (minute >= 10 ? minute : "0" + minute) + " AM";
    }

    if (day === today) {
        return time;
    }
    else if (day === today - 1) {
        return "Yesterday";
    }
    else {
        return shortDate.slice(3) + "/" + shortDate.slice(0, 2) + "/" + year;
    }
}