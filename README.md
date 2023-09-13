
## ProjectRun App

<div style="text-align: center">
    <img src="https://drive.google.com/uc?id=11GOe2SHmc2LsGw81MDGvzoFrFPXoV48C" alt="Logo">
</div>



#### About:

This is ProjectRun mobile app built with React Native (Expo).



#### Work on Linux:

- Make sure to have installed and setup all the necessary things written [here](https://reactnative.dev/docs/environment-setup).

- Connect your android (v12+) device with USB debugging enabled or run an emulator (make sure to have installed and setup all the necessary things written [here](https://developer.android.com/studio/run/emulator)).

- Run the following commands:
```bash
git clone git@gitlab.com:projectrun/projectrun-app.git projectrun-app && cd projectrun-app/
# Node.js version >= 18.*
npm install
```

- Get a Google Maps [API key](https://console.cloud.google.com/google/maps-apis/overview) and include it in the `.env` file (see `.env.example` file for reference).

- Run the app:
```bash
# for android
npm run android
```

#### Build the app:

- Make sure to have installed and setup all the necessary things written [here](https://docs.expo.dev/build/setup/)

- Make sure to have installed [eas-cli](https://github.com/expo/eas-cli)
```bash
npm install -g eas-cli
```

- Make sure to have `eas.json` file in the root directory of the project similar to the `eas.example.json` file.

- Make sure to have included all the environment variables written [here](https://docs.expo.dev/build-reference/variables/).

- [Build APKs for Android Emulators and devices](https://docs.expo.dev/build-reference/apk/)

```bash
eas build -p android --profile preview
```

- Optional:
```bash
# generate `eas.json` file
eas build:configure

# build for android
eas build --profile development --platform android

# start dev client
expo start --dev-client
```



#### Info:

- Run this to get audio file duration:
```shell
ffprobe -i <file> -show_entries format=duration -v quiet -of csv="p=0"
```

or make a shell script to get the duration of all the audio files in a directory:
```shell
nano audio-duration.sh
```

```shell
#!/bin/bash

# Specify the directory containing your audio files
directory="audio"

# Loop through all the files in the directory
for file in "$directory"/*; do
  # Check if the file is a regular file (not a directory)
  if [ -f "$file" ]; then
    # Use ffprobe to get the audio duration for the file
    duration=$(ffprobe -i "$file" -show_entries format=duration -v quiet -of csv="p=0")
    
    # Print the filename and its corresponding duration
    echo "File: $file, Duration: $duration seconds"
  fi
done
```

- make it executable:
```shell
chmod +x audio-duration.sh
```

- run it:
```shell
./audio-duration.sh
```



#### Useful Resources:

- Expo [Environment variables and secrets in EAS Build](https://docs.expo.dev/build-reference/variables)
- Expo [Billing](https://expo.dev/accounts/boolfalse/settings/billing)



#### Product Resources:

- Live dev-server [API gateway](https://github.am/api)
- Mobile app wireframe paper screens at [Figma](https://www.figma.com/file/YMm2ALVLry7LMFF2hN5T1T/ProjectRun-%5Bwireframe-screens%5D?type=design&mode=design&t=BTY8nfsxSGpHvoL0-1)
- Mobile app wireframe animation video on [YouTube](https://www.youtube.com/watch?v=ho1Nbal3z6s)
- GitLab [group](https://gitlab.com/projectrun)
- Trello [board](https://trello.com/b/oiUvRWb1/projectrun-mobile)
- Postman [workspace](https://go.postman.co/workspace/4c1f641c-e02c-4aa5-b636-565308855c75)



#### Author:

- [BoolFalse](https://boolfalse.com/)
