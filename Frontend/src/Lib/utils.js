export function formatTime(date){
    return new Date(date).toLocaleTimeString ("en-IN",{
        hour:"2-digit",
        minute:"2-digit",
        hour12:false,
        timeZone:"Asia/Kolkata",
    })
}