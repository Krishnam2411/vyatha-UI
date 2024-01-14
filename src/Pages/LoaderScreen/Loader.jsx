import React, { useEffect, useState } from "react";
import styles from "./Loader.module.scss";

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isFinishedLoading = () => {
      if (document.readyState === "complete") {
        setLoading(false);
      }
    };
    isFinishedLoading();
    document.addEventListener("readystatechange", isFinishedLoading);
    return () => {
      document.removeEventListener("readystatechange", isFinishedLoading);
    };
  }, []);

  useEffect(() => {
    if (loading) {
      const bodyStyling = document.body.style;
      bodyStyling.height = "100vh";
      bodyStyling.overflow = "hidden";
    } else {
      const bodyStyling = document.body.style;
      bodyStyling.height = "auto";
      bodyStyling.overflow = "auto";
    }
  }, [loading]);

  return (
    <div className={`${styles.loader} ${loading ? styles.active : ""}`}>
      <div className={styles.img_loader_wrapper}>
        <img
          src="https://res.cloudinary.com/dp92qug2f/image/upload/v1705218545/vyathaa_oasanp.png"
          alt=""
        />
        <h2 className={styles.loading_text}>loading...</h2>
      </div>
    </div>
  );
};

export default Loader;
