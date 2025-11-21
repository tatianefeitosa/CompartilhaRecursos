document.addEventListener("DOMContentLoaded", () => {
    const progressBar = document.getElementById("progress-bar");
    const progressValue = 68; // 

    const circleLength = 377;
    const offset = circleLength - (circleLength * progressValue) / 100;

    progressBar.style.strokeDashoffset = offset;
});
