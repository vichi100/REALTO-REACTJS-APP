import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

class PhotoGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: props.width || 0, // Will be set by container
            height: 300
        };
        this.containerRef = React.createRef();
    }

    componentDidMount() {
        if (this.containerRef.current) {
            this.setState({ width: this.containerRef.current.offsetWidth });
        }
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        if (this.containerRef.current) {
            this.setState({ width: this.containerRef.current.offsetWidth });
        }
    }

    render() {
        const { imageProps } = this.props;
        const source = _.take(this.props.source, 5);
        const firstViewImages = [];
        const secondViewImages = [];
        const firstItemCount = source.length === 5 ? 2 : 1;
        let index = 0;
        _.each(source, (img) => {
            if (index === 0) {
                firstViewImages.push(img);
            } else if (index === 1 && firstItemCount === 2) {
                firstViewImages.push(img);
            } else {
                secondViewImages.push(img);
            }
            index++;
        });

        const { height } = this.props;
        const width = this.state.width || this.props.width || 0; // Use state width or prop width

        let ratio = 0;
        if (secondViewImages.length === 0) {
            ratio = 0;
        } else if (secondViewImages.length === 1) {
            ratio = 1 / 2;
        } else {
            ratio = this.props.ratio;
        }
        const direction = source.length === 5 ? "row" : "column";

        const firstImageWidth =
            direction === "column"
                ? width / firstViewImages.length
                : width * (1 - ratio);
        const firstImageHeight =
            direction === "column"
                ? height * (1 - ratio)
                : height / firstViewImages.length;

        const secondImageWidth =
            direction === "column" ? width / secondViewImages.length : width * ratio;
        const secondImageHeight =
            direction === "column"
                ? height / secondViewImages.length
                : height * ratio;

        const secondViewWidth = direction === "column" ? width : width * ratio;
        const secondViewHeight = direction === "column" ? height * ratio : height;

        return source.length ? (
            <div
                ref={this.containerRef}
                style={{ display: 'flex', flexDirection: direction, width: '100%', height, ...this.props.styles }}
            >
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: direction === "row" ? "column" : "row"
                    }}
                >
                    {firstViewImages.map((image, index) => (
                        <div
                            key={index}
                            style={{ flex: 1, cursor: 'pointer', position: 'relative' }}
                            onClick={() =>
                                this.props.onPressImage && this.props.onPressImage(image)
                            }
                        >
                            <img
                                src={image}
                                alt=""
                                style={{
                                    width: firstImageWidth,
                                    height: firstImageHeight,
                                    objectFit: 'cover',
                                    border: '1px solid #fff',
                                    display: 'block',
                                    ...this.props.imageStyle
                                }}
                            />
                        </div>
                    ))}
                </div>
                {secondViewImages.length ? (
                    <div
                        style={{
                            width: secondViewWidth,
                            height: secondViewHeight,
                            display: 'flex',
                            flexDirection: direction === "row" ? "column" : "row"
                        }}
                    >
                        {secondViewImages.map((image, index) => (
                            <div
                                key={index}
                                style={{ flex: 1, cursor: 'pointer', position: 'relative' }}
                                onClick={() =>
                                    this.props.onPressImage && this.props.onPressImage(image)
                                }
                            >
                                {this.props.source.length > 5 &&
                                    index === secondViewImages.length - 1 ? (
                                    <div
                                        style={{
                                            width: secondImageWidth,
                                            height: secondImageHeight,
                                            backgroundImage: `url(${typeof image === "string" ? image : image.uri})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            border: '1px solid #fff',
                                            position: 'relative',
                                            ...this.props.imageStyle
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: "rgba(200, 200, 200, .5)",
                                            display: 'flex',
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            <span style={{ color: "#fff", fontSize: 60, ...this.props.textStyles }}>
                                                +{this.props.source.length - 5}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        src={image}
                                        alt=""
                                        style={{
                                            width: secondImageWidth,
                                            height: secondImageHeight,
                                            objectFit: 'cover',
                                            border: '1px solid #fff',
                                            display: 'block',
                                            ...this.props.imageStyle
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        ) : null;
    }
}

PhotoGrid.propTypes = {
    source: PropTypes.array.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    style: PropTypes.object,
    imageStyle: PropTypes.object,
    onPressImage: PropTypes.func,
    ratio: PropTypes.number,
    imageProps: PropTypes.object
};

PhotoGrid.defaultProps = {
    style: {},
    imageStyle: {},
    imageProps: {},
    // width: width, // Removed default width as it relies on window or container
    height: 300,
    ratio: 1 / 2
};

export default PhotoGrid;
