
export const appPrimaryColor = '#F5F411';
export const appSecondaryColor = '#42F44B';
export const splashLogoUrl = "https://drive.google.com/uc?id=11GOe2SHmc2LsGw81MDGvzoFrFPXoV48C";
export const paginationPerPages = [5, 10, 25, 50];

export const activeBtnTextColor = '#fff';
export const inactiveBtnTextColor = '#000';

export const userDefaultAvatarUrl = "https://avatars.githubusercontent.com/u/22226570?s=96&v=4";

export const popupOptions = {
    close_timeout_seconds: 2,
    success_color: '#96C291',
    error_color: '#E25E3E',
};

export const updateLocationTimeoutSeconds = 10; // 10-30
export const startRunBtnPressSeconds = 3;
export const stopRunBtnPressSeconds = 3;
export const guaranteeSecondsAfterStartBtnPress = 3;
export const runStates = {NOT_STARTED: 0, RUNNING: 1, PAUSED: 2, FINISHED: 3};
export const runStateTitles = {0: "Not Started", 1: "Running", 2: "Paused", 3: "Finished"};

export const voiceNotification = {
    enabled: true, // true (default) | false
    by: 'time', // distance (default) | time
    distance_options: [
        {label: '100 m', value: '100'},
        {label: '0.5 km', value: '500'},
        {label: '1 km', value: '1000'},
    ],
    each_distance: 1000, // meters - 100 | 500 | 1000 (default)
    time_options: [
        {label: '10 min', value: '600'},
        {label: '30 min', value: '1800'},
        {label: '1 hr', value: '3600'}
    ],
    each_time: 60, // seconds - 60 | 600 (default) | 1800 | 3600
};
