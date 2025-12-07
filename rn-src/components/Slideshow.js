import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Image,
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  PanResponder, // Import PanResponder
  Dimensions
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const reactNativePackage = require("react-native/package.json");
const splitVersion = reactNativePackage.version.split(".");
const majorVersion = +splitVersion[0];
const minorVersion = +splitVersion[1];

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#222"
  },
  layoutIndicator: {
    height: 15,
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "transparent"
  },
  indicator: {
    margin: 3,
    opacity: 0.9
  },
  indicatorSelected: {
    opacity: 1
  },
  containerImage: {
    flex: 1,
    width: Dimensions.get("window").width
  },
  overlay: {
    opacity: 0.5,
    backgroundColor: "black"
  },
  layoutText: {
    position: "absolute",
    paddingHorizontal: 15,
    bottom: 30,
    left: 0,
    right: 0,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column",
    backgroundColor: "transparent"
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: "white"
  },
  textCaption: {
    fontWeight: "400",
    fontSize: 12,
    color: "white"
  },
  arrowContainer: {
    position: "absolute",
    backgroundColor: "transparent",
    justifyContent: "center", // Center content vertically
    alignItems: "center",
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,.15)",
    top: 0,
    bottom: 0,
    marginVertical: 'auto', // Distribute remaining vertical space equally
  }
});

const setIndicatorSize = (size) => ({
  width: size,
  height: size,
  borderRadius: size / 2
});

const setIndicatorColor = (color) => ({
  backgroundColor: color
});

const Slideshow = (props) => {
  const [position, setPosition] = useState(props.position || 0);
  const [height, setHeight] = useState(Dimensions.get("window").width * (4 / 9));
  const [width, setWidth] = useState(Dimensions.get("window").width);

  const scrollViewRef = useRef(null);
  const intervalRef = useRef(null);
  const panResponder = useRef(
    PanResponder.create({
      onPanResponderRelease: (e, gestureState) => {
        const relativeDistance = gestureState.dx / width;
        const vx = gestureState.vx;
        let change = 0;

        if (relativeDistance < -0.5 || (relativeDistance < 0 && vx <= 0.5)) {
          change = 1;
        } else if (
          relativeDistance > 0.5 ||
          (relativeDistance > 0 && vx >= 0.5)
        ) {
          change = -1;
        }
        const currentPosition = typeof props.position === "number" ? props.position : position;
        let newPosition = currentPosition + change;
        if (newPosition < 0) {
          newPosition = props.dataSource.length - 1;
        } else if (newPosition >= props.dataSource.length) {
          newPosition = 0;
        }
        _move(newPosition);
        setPosition(newPosition);
        return true;
      },
    })
  ).current;

  const _getPosition = useCallback(() => {
    return typeof props.position === "number" ? props.position : position;
  }, [props.position, position]);

  const _move = useCallback(
    (index) => {
      const isUpdating = index !== _getPosition();
      const x = width * index;
      if (majorVersion === 0 && minorVersion <= 19) {
        scrollViewRef.current?.scrollTo(0, x, true);
      } else {
        scrollViewRef.current?.scrollTo({ x: width * index, y: 0, animated: true });
      }
      setPosition(index);
      if (isUpdating && props.onPositionChanged) {
        props.onPositionChanged(index);
      }
    },
    [_getPosition, props.onPositionChanged, width]
  );

  const _next = useCallback(() => {
    const currentPosition = _getPosition();
    const newPosition =
      currentPosition === props.dataSource.length - 1 ? 0 : currentPosition + 1;
    _move(newPosition);
    setPosition(newPosition);
  }, [_getPosition, _move, props.dataSource.length]);

  const _prev = useCallback(() => {
    const currentPosition = _getPosition();
    const newPosition = currentPosition === 0 ? props.dataSource.length - 1 : currentPosition - 1;
    _move(newPosition);
    setPosition(newPosition);
  }, [_getPosition, _move, props.dataSource.length]);

  useEffect(() => {
    if (props.position !== undefined && props.position !== _getPosition()) {
      _move(props.position);
    }
  }, [props.position, _getPosition, _move]);

  useEffect(() => {
    const updateWidth = () => {
      const newWidth = Dimensions.get("window").width;
      if (newWidth !== width) {
        setWidth(newWidth);
      }
    };

    intervalRef.current = setInterval(updateWidth, 16);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [width]);

  const currentPosition = _getPosition();
  const calculatedHeight = props.height || height;

  return (
    <View style={[props.containerStyle, { height: calculatedHeight }]}>
      {/* SECTION IMAGE */}
      <ScrollView
        ref={scrollViewRef}
        decelerationRate={0.99}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={props.scrollEnabled}
        {...panResponder.panHandlers}
        style={[styles.container, { height: calculatedHeight }]}
      >
        {props.dataSource.map((image, index) => {
          const imageObject =
            typeof image.url === "string" ? { uri: image.url } : image.url;
          const textComponent = (
            <View style={styles.layoutText}>
              {image.title === undefined ? null : (
                <Text style={props.titleStyle}>{image.title}</Text>
              )}
              {image.caption === undefined ? null : (
                <Text style={props.captionStyle}>{image.caption}</Text>
              )}
            </View>
          );
          const imageComponent = (
            <View key={index}>
              <View style={{ position: "absolute", top: 5, right: 15, zIndex: 1000, justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 2 }}>
                {/* <TouchableHighlight onPress={() => {
                  console.log("Image liked")
                }}>
                  <SimpleLineIcons name="user-follow" color={"rgb(245, 239, 239)"} size={25} />
                </TouchableHighlight> */}
              </View>
              <Image
                source={imageObject}
                style={{ height: calculatedHeight, width }}
                resizeMode="cover"
              />
              {textComponent}
            </View>
          );
          const imageComponentWithOverlay = (
            <View key={index} style={styles.containerImage}>
              <View style={styles.overlay}>
                <Image
                  source={imageObject}
                  style={{ height: calculatedHeight, width }}
                  resizeMode="cover"
                />
              </View>
              {textComponent}
            </View>
          );
          if (props.onPress) {
            return (
              <TouchableOpacity
                key={index}
                style={{ height: calculatedHeight, width }}
                onPress={() => props.onPress({ image, index })}
                delayPressIn={200}
              >
                {props.overlay ? imageComponentWithOverlay : imageComponent}
              </TouchableOpacity>
            );
          } else {
            return props.overlay ? imageComponentWithOverlay : imageComponent;
          }
        })}
      </ScrollView>
      {/* END SECTION IMAGE */}
      {/* SECTION INDICATOR */}
      <View style={[styles.layoutIndicator]}>
        {props.dataSource.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => _move(index)}
            style={[
              styles.indicator,
              setIndicatorSize(props.indicatorSize),
              setIndicatorColor(props.indicatorColor),
              currentPosition === index && [
                styles.indicatorSelected,
                setIndicatorColor(props.indicatorSelectedColor),
              ],
            ]}
          >
            <View />
          </TouchableOpacity>
        ))}
      </View>
      {/* END SECTION INDICATOR */}
      {/* SECTION ARROW LEFT */}
      <View
        style={[
          styles.arrowContainer,
          { left: 10, top: (calculatedHeight - 30) / 2 } // Calculate top position
        ]}
      >
        <TouchableOpacity onPress={_prev}>
          {props.arrowLeft === undefined ? (
            <MaterialCommunityIcons name="chevron-left" color={"#ffffff"} size={30} />
          ) : (
            props.arrowLeft
          )}
        </TouchableOpacity>
      </View>
      {/* END SECTION ARROW LEFT */}
      {/* SECTION ARROW RIGHT */}
      <View
        style={[
          styles.arrowContainer,
          { right: 10, top: (calculatedHeight - 30) / 2 } // Calculate top position
        ]}
      >
        <TouchableOpacity onPress={_next}>
          {props.arrowRight === undefined ? (
            <MaterialCommunityIcons name="chevron-right" color={"#ffffff"} size={30} />
          ) : (
            props.arrowRight
          )}
        </TouchableOpacity>
      </View>
      {/* END SECTION ARROW RIGHT */}

      <View>
        <Text></Text>
      </View>
    </View>
  );
};

Slideshow.defaultProps = {
  height: 200,
  indicatorSize: 8,
  indicatorColor: "#CCCCCC",
  indicatorSelectedColor: "#FFFFFF",
  scrollEnabled: true,
  arrowSize: 16,
};

Slideshow.propTypes = {
  dataSource: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      caption: PropTypes.string,
      url: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  indicatorSize: PropTypes.number,
  indicatorColor: PropTypes.string,
  indicatorSelectedColor: PropTypes.string,
  height: PropTypes.number,
  position: PropTypes.number,
  scrollEnabled: PropTypes.bool,
  containerStyle: PropTypes.object,
  overlay: PropTypes.bool,
  arrowSize: PropTypes.number,
  arrowLeft: PropTypes.object,
  arrowRight: PropTypes.object,
  onPress: PropTypes.func,
  onPositionChanged: PropTypes.func,
};

export default Slideshow;