export const maskPhone = (phone : string)=> {
    if(phone.length <= 4) return "****";
    return `${phone.slice(0,2)}${"*".repeat(phone.length -4)}${phone.slice(-2)}`;
}