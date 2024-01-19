import React from "react";

import { Lightbox } from "react-modal-image";

// import _get from "lodash.get";

class ImageLightBox extends React.Component {
  render() {
    const { handleClose, image } = this.props;
    return (
      <div>
        {/* <Lightbox
          medium={_get(image, "url", "") || _get(image, "data", "")}
          small={_get(image, "thumbnail", "")}
          large={_get(image, "large", "")}
          alt={""}
          onClose={handleClose}
          imageBackgroundColor="#E6E6E6"
        /> */}
      </div>
    );
  }
}
export default ImageLightBox;
