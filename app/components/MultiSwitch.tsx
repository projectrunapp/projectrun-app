
import React, { FC, useEffect, useRef, useState } from 'react';
import {
    Animated, Easing, StyleProp, Text, TextStyle,
    TouchableOpacity, useWindowDimensions, View, ViewStyle,
} from 'react-native';
import { StyleSheet } from 'react-native';
import {appPrimaryColor, appSecondaryColor} from "../utils/app-constants";

const backgroundColor = '#BBBBBB';
const selectedColor = appPrimaryColor; // '#EEEEEE';
const backgroundColorDisabled = '#636363';
const selectedColorDisabled = '#787878';
const colorText = '#333333';

interface Props {
    items: Array<string>
    value: string
    onChange: (value: any) => void
    disabled?: boolean

    // Sizes
    mediumHeight?: boolean
    bigHeight?: boolean

    // Style
    containerStyle?: StyleProp<ViewStyle>
    sliderStyle?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    activeTextStyle?: StyleProp<TextStyle>
}

const MultiSwitch: FC<Props> = (props) => {
    const { width } = useWindowDimensions()
    const [items, setItems] = useState(props.items)
    const [elements, setElements] = useState<{ id: string; value: number }[]>([])
    const [active, setActive] = useState(props.value)
    const animatedValue = useRef(new Animated.Value(0)).current
    const opacityValue = useRef(new Animated.Value(0)).current

    useEffect(() => {
        setItems(props.items)
        setElements([])
    }, [width])

    useEffect(() => {
        if (elements.length === props.items.length) {
            const position = elements.find((el) => el.id === props.value)
            Animated.timing(animatedValue, {
                toValue: position ? position.value : -width, // set position out of bounds if !position
                duration: 0,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => {
                // keep transparent if out of bounds
                if(!position) return

                Animated.timing(opacityValue, {
                    toValue: 1,
                    duration: 100,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }).start()
            })
        }
    }, [elements])

    const getContainerStyle = () => {
        return [
            styles.container,
            props.containerStyle,
            props.mediumHeight ? styles.mediumHeight : {},
            props.bigHeight ? styles.bigHeight : {},
            props.disabled ? styles.containerDisabled : {},
        ]
    }

    const getSliderStyle = () => {
        return [
            styles.slider,
            { width: getSliderWidth() },
            { transform: [{ translateX: animatedValue }] },
            { opacity: opacityValue },
            props.sliderStyle ? props.sliderStyle : {},
            props.disabled ? styles.sliderDisabled : {},
        ]
    }

    const getSliderWidth = () => {
        return 100 / props.items.length + '%'
    }

    const startAnimation = (newVal: string) => {
        const position = elements.find((el) => el.id === newVal)
        if (!position) {
            return
        }
        Animated.timing(animatedValue, {
            toValue: position.value,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start(() => {
            setActive(newVal)

            const oldPosition = elements.find(function (el) { return el.id === props.value; })

            // keep transparent if out of bounds
            if(oldPosition) return

            Animated.timing(opacityValue, {
                toValue: 1,
                duration: 100,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start()
        })
        props.onChange(newVal)
    }

    return (
        <View style={getContainerStyle()}>
            <Animated.View style={[getSliderStyle()]} />
            {items.map((item: string) => (
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                        styles.item,
                        { width: `${100 / props.items.length}%` },
                    ] as StyleProp<ViewStyle>}
                    onPress={() => {
                        startAnimation(item)
                    }}
                    key={item}
                    onLayout={(e) =>
                        setElements([
                            ...elements,
                            { id: item, value: e.nativeEvent.layout.x },
                        ])
                    }
                    disabled={props.disabled}
                >
                    <Text style={[
                        styles.itemText,
                        props.textStyle,
                        active === item && props.activeTextStyle,
                    ]} numberOfLines={1}>
                        {item}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 1.5,
        borderRadius: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 30,
        backgroundColor: backgroundColor,
        overflow: 'hidden'
    },
    slider: {
        position: 'absolute',
        height: '100%',
        borderRadius: 7,
        backgroundColor: selectedColor,
    },
    item: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        textAlign: 'center',
        color: colorText,
    },

    // Disabled
    containerDisabled: {
        backgroundColor: backgroundColorDisabled,
    },
    sliderDisabled: {
        backgroundColor: selectedColorDisabled,
    },

    // Height
    mediumHeight: {
        height: 40,
    },
    bigHeight: {
        height: 50,
    },
});

export default MultiSwitch;
