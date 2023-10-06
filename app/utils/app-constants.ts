
export const appPrimaryColor = '#F5F411';
export const appSecondaryColor = '#42F44B';
export const splashLogoUrl = "https://drive.google.com/uc?id=11GOe2SHmc2LsGw81MDGvzoFrFPXoV48C";
export const paginationPerPages = [5, 10, 25, 50];

export const activeBtnTextColor = '#fff';
export const inactiveBtnTextColor = '#000';

export const popupOptions = {
    close_timeout_seconds: 2,
    success_color: '#96C291',
    error_color: '#E25E3E',
};

export const genderDefault = 'unknown';
export const genders = {
    'unknown': "Unknown",
    'male': "Male",
    'female': "Female",
    'other': "Other",
};

export const updateLocationTimeoutSeconds = 5; // 3-20
export const startRunBtnPressSeconds = 3;
export const stopRunBtnPressSeconds = 3;
export const guaranteeSecondsAfterStartBtnPress = 3;
export const runStates = {NOT_STARTED: 0, RUNNING: 1, PAUSED: 2, FINISHED: 3};
export const runStateTitles = {0: "Not Started", 1: "Running", 2: "Paused", 3: "Finished"};

// TODO: change to default values for production
export const voiceNotification = {
    enabled: true, // true (default) | false

    by: 'time', // distance (default) | time

    each_distance: 100,
    distance_options: [
        {label: '100 m', value: '100'},
        {label: '0.5 km', value: '500'},
        {label: '1 km', value: '1000'}, // default
    ],

    each_time: 60,
    time_options: [
        {label: '1 min', value: '60'},
        {label: '10 min', value: '600'}, // default
        {label: '30 min', value: '1800'},
        {label: '1 hr', value: '3600'}
    ],
};

export const trackingTask = {
    name: 'location_tracking',
    title: "Location Tracking",
    body: "Location tracking in background",
    color: "#fff",
};

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
