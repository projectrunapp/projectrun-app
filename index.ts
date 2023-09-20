
import { registerRootComponent } from 'expo';
import TrackPlayer, {Event} from 'react-native-track-player';
import App from './App';

registerRootComponent(App);

// TrackPlayer.registerPlaybackService(() => require('./app/service'));
TrackPlayer.registerPlaybackService(() => async () => {
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
    // TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    // TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
});
