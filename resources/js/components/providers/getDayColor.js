export default function getDayColor(days) {
    if (days <= 7) {
        return "#4bd080";
    }
    if (days > 7 && days <= 14) {
        return "#25dbd2";
    }
    if (days > 14 && days <= 21) {
        return "orange";
    }
    if (days > 21) {
        return "red";
    }
}
