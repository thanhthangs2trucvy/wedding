import React from "react";
import { Image } from "./Image";
import { Icon } from "./Icon";

export const LoadingSuspense = () => {
  return (
    <div className="loading-suspense">
      <div className="loading-inner">
        <Image src={require('assets/images/pictures/loading.png')} />
      </div>
    </div>
  );
};
export const LoadingPayment = () => {
  return (
    <div className="loading-suspense loading-payment">
      <div className="loading-inner">
        <Icon name="secure-payment" />
        <h5>Đang tiến hành thanh toán</h5>
        <div className="loading-base">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export const LoadingBase = () => {
  return (
    <div className="loading-base">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

// export const LoadingCircleBounce = () => {
//   return (
//     <div className="sk-circle-bounce"></div>
//   )
// }
