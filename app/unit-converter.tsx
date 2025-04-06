export default function convert(unit: string, num: number) {
    const units = ["km", "miles", "meters", "feet"];
    if(unit == "km") {
        return num * 1000;
    }
    else if(unit == "miles") {
        return 0.62 * num;
    }
    else if(unit == "meters") {
        return num;
    }
    return -1;
}