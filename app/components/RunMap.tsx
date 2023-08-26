
import React from 'react';
import { View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import {MAPBOX_PUBLIC_TOKEN} from "@env"

Mapbox.setAccessToken(MAPBOX_PUBLIC_TOKEN);

const RunMap = ({ runId }: any) => {
    return (
        <View style={{height: 300, width: 300}}>
            <Mapbox.MapView style={{flex: 1}} />
        </View>
    );
}

export default RunMap;
