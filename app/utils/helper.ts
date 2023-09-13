
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

// return example: "2023-08-25"
export function dateFormat(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
}

export function humanizedDistance(distanceInMeters: number): string {
    if (distanceInMeters < 1000) {
        return `${distanceInMeters} m`;
    } else {
        return `${(distanceInMeters / 1000).toFixed(1)} km`;
    }
}
export function humanizedDistancePartials(distanceInMeters: number) {
    return {
        km: Math.floor(distanceInMeters / 1000),
        m: Math.round(distanceInMeters % 1000),
    };
}
export function humanizedDuration(durationInSeconds: number): string {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds - (hours * 3600)) / 60);
    const seconds = durationInSeconds - (hours * 3600) - (minutes * 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
}
export function humanizedDurationPartials(durationInSeconds: number) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds - (hours * 3600)) / 60);
    const seconds = durationInSeconds - (hours * 3600) - (minutes * 60);

    return {
        h: hours,
        m: minutes,
        s: seconds,
    };
}
export function humanizedAvgSpeed(avgSpeedMetersPerSeconds: number): string {
    return `${(avgSpeedMetersPerSeconds * 3.6).toFixed(1)} km/h`;
}
