
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "ProjectRun",
    slug: "ProjectRunApp",
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/app-adaptive-icon.png",
            backgroundColor: "#ffffff"
        },
        package: "com.boolfalse.ProjectRunApp",
        config: {
            googleMaps: {
                apiKey: process.env.GOOGLE_MAPS_API_KEY
            }
        }
    },
});
