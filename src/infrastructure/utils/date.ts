/**
 * Checks if a certain number of hours have passed since the given datetime.
 * @param dateTime - The initial datetime to check against.
 * @param hours - The number of hours to check if they have passed.
 * @returns boolean - True if the specified number of hours have passed since the given datetime, otherwise false.
 */
function hasHoursPassed(dateTime: Date, hours: number): boolean {
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - dateTime.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours
    return hoursDifference >= hours;
}

export const getDateTimeMinutesFromNow = (minutes: number): Date => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + minutes * 60000);
    return futureDate;
};

export const isDateTimePassed = (dateTime: Date): boolean => {
    const currentDateTime = new Date();
    return dateTime < currentDateTime;
};

export default hasHoursPassed;