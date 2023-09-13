
module.exports = ({ config }) => {
    return {
        ...config,
        android: {
            ...config.android,
            config: {
                googleMaps: {
                    apiKey: process.env.GOOGLE_MAPS_API_KEY
                }
            }
        },
        extra: {
            eas: {
                projectId: process.env.EXPO_PROJECT_ID
            }
        }
    };
};
