import moment from "moment-timezone";

export default function messageTimeLogic(e) {
    let [date, time] = moment(e.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss").split(" ")
    // const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    time = time.slice(0, 5);
    return time;
}