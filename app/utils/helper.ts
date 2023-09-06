
// Function to calculate distance between two coordinates using Haversine formula in meters
export function calculateDistanceInMeters(lat1, lng1, lat2, lon2) {
    const R = 6371 * 1000; // Radius of the Earth in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lng1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters

    return distance;
}

// generate run title based on current time of day
export function generateRunTitle(hour?: number): string {
    // check if "hour" is provided
    if (!hour) {
        hour = (new Date()).getHours();
    }

    let title = "Run!";
    if (hour >= 5 && hour < 12) {
        title = `Morning ${title}`;
    } else if (hour >= 12 && hour < 18) {
        title = `Afternoon ${title}`;
    } else if (hour >= 18 && hour < 22) {
        title = `Evening ${title}`;
    } else {
        title = `Night ${title}`;
    }

    return title;
}

// example: convert "2023-08-25T07:07:26.240Z" to "Aug 25, 2023; 7:07 AM"
export function dateStringFormat(dateString: number): string {
    const date = new Date(dateString);

    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleString('default', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    })

    return `${month} ${day}, ${year}; ${time}`;
}
