
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
        return `${(distanceInMeters / 1000).toFixed(2)} km`;
    }
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
export function humanizedAvgSpeed(avgSpeedMetersPerSeconds: number): string {
    return `${(avgSpeedMetersPerSeconds * 3.6).toFixed(2)} km/h`;
}

const humanizedDistancePartials = (distanceInMeters: number) => {
    const m = Math.round(distanceInMeters % 1000);
    const hundreds = Math.floor(m / 100);

    return {
        km: Math.floor(distanceInMeters / 1000),
        hundreds: Math.floor(m / 100),
        ddm: m - hundreds * 100,
    };
}
const humanizedDurationPartials = (durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds - (hours * 3600)) / 60);
    const seconds = durationInSeconds - (hours * 3600) - (minutes * 60);

    return {
        h: hours,
        m: minutes,
        s: seconds,
    };
}

export function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}

export function collectVoices(
    result: { distance: number, duration: number, avg_speed: number},
    voices: string[] = []
): string[] {
    const silenceAudio = "silence-1";
    voices.push(silenceAudio);

    // distance
    const distancePartials = humanizedDistancePartials(result.distance);
    voices.push("distance");
    if (distancePartials.km === 0 && distancePartials.hundreds === 0 && distancePartials.ddm === 0) {
        voices.push("0");
    }
    if (distancePartials.km > 0) {
        voices.push(distancePartials.km.toString());
        if (distancePartials.km === 1) {
            voices.push("kilometer");
        } else {
            voices.push("kilometers");
        }
    }
    if (distancePartials.hundreds > 0) {
        voices.push(distancePartials.hundreds.toString());
        voices.push("hundred");
    }
    if (distancePartials.ddm > 0) {
        voices.push(distancePartials.ddm.toString());
    }
    voices.push("meters");

    if (voices[voices.length - 1] !== silenceAudio) {voices.push(silenceAudio);}

    // duration
    const durationPartials = humanizedDurationPartials(result.duration);
    voices.push("time");
    if (durationPartials.h === 0 && durationPartials.m === 0 && durationPartials.s === 0) {
        voices.push("0");
        voices.push("seconds");
    }
    if (durationPartials.h > 0) {
        voices.push(durationPartials.h.toString());
        if (durationPartials.h === 1) {
            voices.push("hour");
        } else {
            voices.push("hours");
        }
    }
    if (durationPartials.m > 0) {
        voices.push(durationPartials.m.toString());
        if (durationPartials.m === 1) {
            voices.push("minute");
        } else {
            voices.push("minutes");
        }
    }
    if (durationPartials.s > 0) {
        voices.push(durationPartials.s.toString());
        if (durationPartials.s === 1) {
            voices.push("second");
        } else {
            voices.push("seconds");
        }
    }

    if (voices[voices.length - 1] !== silenceAudio) {voices.push(silenceAudio);}

    // avg_speed
    if (result.avg_speed > 0) {
        voices.push("average-speed");

        // TODO: remove this block (just another implementation of the same logic)
        // if (result.avg_speed % 1 !== 0) { // if result.avg_speed is float
        //     const avgSpeedPartials = result.avg_speed.toString().split('.');
        //
        //     const avgSpeedPartialsBeforeDot = avgSpeedPartials[0];
        //     voices.push(avgSpeedPartialsBeforeDot.toString());
        //
        //     voices.push("point");
        //
        //     // two digits after the dot will be rounded
        //     const avgSpeedPartialsAfterDot = avgSpeedPartials[1].slice(0, 3);
        //     const roundedAfterDot = Math.round(parseInt(avgSpeedPartialsAfterDot) / 10);
        //
        //     voices.push(roundedAfterDot.toString());
        // } else {
        //     voices.push(result.avg_speed.toString());
        // }

        const avgSpeed = Math.round(result.avg_speed * 100) / 100;
        const avgSpeedPartials = avgSpeed.toString().split('.');
        const avgSpeedPartialsBeforeDot = avgSpeedPartials[0];
        voices.push(avgSpeedPartialsBeforeDot.toString());
        if (avgSpeedPartials.length > 1 && avgSpeedPartials[1] !== "00") {
            voices.push("point");
            voices.push(avgSpeedPartials[1].toString());
        }

        voices.push("kilometers-per-hour");
    }

    if (voices[voices.length - 1] !== silenceAudio) {voices.push(silenceAudio);}

    return voices;
};
