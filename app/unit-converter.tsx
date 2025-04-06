export default function convert(unit: string, num: number) {
    const units = ["km", "miles", "meters", "feet"];
    if(unit == "km") {
        return Number;
    }
    else if(unit == "miles") {
        return 0.62 * num;
    }
    else if(unit == "meters") {
        return 1000 * num;
    }
    return -1;
}