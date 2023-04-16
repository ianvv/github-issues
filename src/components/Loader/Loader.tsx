import React from "react";
import loader from "../../assets/img/loader.svg";
import s from "./loader.module.scss";

const Loader = () => {
  return (
    <div className={s.loaderWrapper}>
      <img src={loader} alt="loader" />
    </div>
  );
};

export default Loader;
