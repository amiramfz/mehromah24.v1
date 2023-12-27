import Lottie from "lottie-web";
// import animationData from "../../assets/lottie/progress-loading.json";
import React from "react";
import { useEffect } from "react";

export default function ProgressLoading() {
    // useEffect(() => {
    //     Lottie.loadAnimation({
    //         container: document.getElementById("lottie-container"), // This should be a div in your component where you want to render the animation
    //         renderer: "svg", // You can choose 'svg', 'canvas', or 'html' as the renderer
    //         loop: true,
    //         autoplay: true,
    //         animationData: animationData, // Your animation JSON data
    //     });
    // }, []);

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                position: "fixed",
                zIndex: "9999",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgb(243, 188, 83)"
            }}
        >
            {/* <div
                id="lottie-container"
                style={{
                    display: "inline",
                    width: "300px",
                    height: "300px",
                }}
            ></div> */}
            <div class="sliderText">
                <div class="slide1">مهروماه پیشرو فن آوری</div>
                <div class="slide2">سفری آسان با ساوش</div>
                <div class="slide3">بلیط/هتل/خدمات</div>
                <div class="slide4">خرید آسان</div>
            </div>
        </div>
    );
}
