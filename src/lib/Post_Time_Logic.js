import moment from 'moment-timezone';
export default function postTimeLogic(e) {
    let showTime;
    let [date, time] = moment(e.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss").split(" ")
    // console.log(date, time)
    if (date.startsWith(new Date().getFullYear())) {
        date = date.slice(5)
        time = time.slice(0, 5);
        // console.log(date, `${new Date().getMonth() + 1}-${new Date().getDate().toString().length === 1 ? "0" + new Date().getDate() : new Date().getDate()}`)
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let [month, day] = date.split("-");
        // console.log("month, day", month, day)
        if (date === `${new Date().getMonth() + 1}-${new Date().getDate().toString().length === 1 ? "0" + new Date().getDate() : new Date().getDate()}`) {
            showTime = `Today, ${time}`;
            return showTime;
        }
        else {
            if (month.startsWith(0)) {
                month = month.slice(1) - 1;
                console.log("month", month)
            }
            if(!month.startsWith(0)){
                month -=1;
            }
            if (day.startsWith(0)) {
                day = day.slice(1);
            }

            showTime = `${months[month]} ${day}`;
            // console.log("showTime from else", showTime)
            return showTime;

        }
    }
    else {
        const years = new Date().getFullYear() - date.slice(0, 4);
       showTime = `${years} year ago`;
       return showTime;
    }
}