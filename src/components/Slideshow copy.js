import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

// This is a copy of Slideshow.js, converting it similarly.

const Slideshow = (props) => {
    const [position, setPosition] = useState(props.position || 0);
    const [width, setWidth] = useState(0);
    const containerRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const _move = useCallback(
        (index) => {
            if (scrollRef.current) {
                scrollRef.current.scrollTo({
                    left: width * index,
                    behavior: 'smooth'
                });
            }
            setPosition(index);
            if (props.onPositionChanged) {
                props.onPositionChanged(index);
            }
        },
        [props, width]
    );

    const _next = useCallback(() => {
        const newPosition =
            position === props.dataSource.length - 1 ? 0 : position + 1;
        _move(newPosition);
    }, [position, props.dataSource.length, _move]);

    const _prev = useCallback(() => {
        const newPosition = position === 0 ? props.dataSource.length - 1 : position - 1;
        _move(newPosition);
    }, [position, props.dataSource.length, _move]);

    useEffect(() => {
        if (props.position !== undefined && props.position !== position) {
            _move(props.position);
        }
    }, [props.position, position, _move]);

    const calculatedHeight = props.height || 200;

    return (
        <div
            ref={containerRef}
            className="relative flex flex-col bg-[#222] overflow-hidden"
            style={{ ...props.containerStyle, height: calculatedHeight }}
        >
            {/* SECTION IMAGE */}
            <div
                ref={scrollRef}
                className="flex flex-row overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                style={{
                    height: calculatedHeight,
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                {props.dataSource.map((image, index) => {
                    const imageUrl = typeof image.url === "string" ? image.url : image.url?.uri;

                    const textComponent = (
                        <div className="absolute bottom-[30px] left-0 right-0 flex flex-col items-start px-[15px] bg-transparent pointer-events-none">
                            {image.title && (
                                <span className="font-bold text-[15px] text-white" style={props.titleStyle}>{image.title}</span>
                            )}
                            {image.caption && (
                                <span className="font-normal text-xs text-white" style={props.captionStyle}>{image.caption}</span>
                            )}
                        </div>
                    );

                    const imageComponent = (
                        <div key={index} className="relative flex-shrink-0 snap-center" style={{ width: width || '100%', height: calculatedHeight }}>
                            <img
                                src={imageUrl}
                                alt={image.title || ""}
                                style={{ height: calculatedHeight, width: '100%', objectFit: 'cover' }}
                                draggable={false}
                            />
                            {textComponent}
                        </div>
                    );

                    const imageComponentWithOverlay = (
                        <div key={index} className="relative flex-shrink-0 snap-center flex-1" style={{ width: width || '100%', height: calculatedHeight }}>
                            <div className="opacity-50 bg-black w-full h-full absolute top-0 left-0"></div>
                            <img
                                src={imageUrl}
                                alt={image.title || ""}
                                style={{ height: calculatedHeight, width: '100%', objectFit: 'cover' }}
                                draggable={false}
                            />
                            {textComponent}
                        </div>
                    );

                    if (props.onPress) {
                        return (
                            <div
                                key={index}
                                className="cursor-pointer flex-shrink-0 snap-center"
                                style={{ width: width || '100%', height: calculatedHeight }}
                                onClick={() => props.onPress({ image, index })}
                            >
                                {props.overlay ? imageComponentWithOverlay : imageComponent}
                            </div>
                        );
                    } else {
                        return props.overlay ? imageComponentWithOverlay : imageComponent;
                    }
                })}
            </div>

            {/* SECTION INDICATOR */}
            <div className="absolute bottom-[5px] left-0 right-0 flex flex-row justify-center items-center h-[15px] bg-transparent pointer-events-none">
                {props.dataSource.map((_, index) => (
                    <div
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            _move(index);
                        }}
                        className="pointer-events-auto cursor-pointer m-[3px] rounded-full transition-opacity duration-200"
                        style={{
                            width: props.indicatorSize,
                            height: props.indicatorSize,
                            backgroundColor: position === index ? props.indicatorSelectedColor : props.indicatorColor,
                            opacity: position === index ? 1 : 0.9
                        }}
                    />
                ))}
            </div>

            {/* SECTION ARROW LEFT */}
            <div
                className="absolute left-[10px] w-[30px] h-[30px] rounded-full bg-[rgba(0,0,0,0.15)] flex justify-center items-center cursor-pointer hover:bg-[rgba(0,0,0,0.3)] transition-colors z-10"
                style={{ top: (calculatedHeight - 30) / 2 }}
                onClick={_prev}
            >
                {props.arrowLeft === undefined ? (
                    <MdChevronLeft color="#ffffff" size={30} />
                ) : (
                    props.arrowLeft
                )}
            </div>

            {/* SECTION ARROW RIGHT */}
            <div
                className="absolute right-[10px] w-[30px] h-[30px] rounded-full bg-[rgba(0,0,0,0.15)] flex justify-center items-center cursor-pointer hover:bg-[rgba(0,0,0,0.3)] transition-colors z-10"
                style={{ top: (calculatedHeight - 30) / 2 }}
                onClick={_next}
            >
                {props.arrowRight === undefined ? (
                    <MdChevronRight color="#ffffff" size={30} />
                ) : (
                    props.arrowRight
                )}
            </div>
        </div>
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
            url: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
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
