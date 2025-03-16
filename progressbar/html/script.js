document.addEventListener("DOMContentLoaded", (event) => {
    var ProgressBar = {
        init: function () {
            this.progressLabel = document.getElementById("progress-label");
            this.progressPercentage = document.getElementById("progress-percentage");
            this.progressStepsContainer = document.querySelector(".progress-steps-container");
            this.progressContainer = document.querySelector(".progress-container");
            this.historyIcon = document.querySelector(".history-icon i"); // Target the icon directly
            this.animationFrameRequest = null;
            this.setupListeners();
        },

        setupListeners: function () {
            window.addEventListener("message", function (event) {
                if (event.data.action === "progress") {
                    ProgressBar.update(event.data);
                } else if (event.data.action === "cancel") {
                    ProgressBar.cancel();
                }
            });
        },

        update: function (data) {
            if (this.animationFrameRequest) {
                cancelAnimationFrame(this.animationFrameRequest);
            }
            clearTimeout(this.cancelledTimer);

            this.progressLabel.textContent = data.label;
            this.progressPercentage.textContent = "0%";
            this.progressContainer.style.display = "block";

            // Clear existing steps
            this.progressStepsContainer.innerHTML = '';

            // Create steps based on duration (assuming 1 step per second)
            const steps = Math.ceil(data.duration / 1000);
            for (let i = 0; i < steps; i++) {
                const step = document.createElement("div");
                step.classList.add("progress-step");
                this.progressStepsContainer.appendChild(step);
            }

            let startTime = Date.now();
            let duration = parseInt(data.duration, 10);

            const animateProgress = () => {
                let timeElapsed = Date.now() - startTime;
                let progress = timeElapsed / duration;
                if (progress > 1) progress = 1;

                // Update percentage text
                const percentage = Math.round(progress * 100);
                this.progressPercentage.textContent = `${percentage}%`;

                // Calculate active steps
                const activeSteps = Math.floor(progress * steps);
                const stepElements = document.querySelectorAll(".progress-step");
                stepElements.forEach((step, index) => {
                    if (index < activeSteps) {
                        step.classList.add("active");
                    } else {
                        step.classList.remove("active");
                    }
                });

                // Sync icon rotation with progress
                const rotation = progress * 360; // 360 degrees based on progress
                this.historyIcon.style.transform = `rotate(${rotation}deg)`;

                if (progress < 1) {
                    this.animationFrameRequest = requestAnimationFrame(animateProgress);
                } else {
                    this.onComplete();
                }
            };
            this.animationFrameRequest = requestAnimationFrame(animateProgress);
        },

        cancel: function () {
            if (this.animationFrameRequest) {
                cancelAnimationFrame(this.animationFrameRequest);
                this.animationFrameRequest = null;
            }
            this.progressLabel.textContent = "CANCELLED";
            this.progressPercentage.textContent = "";
            this.historyIcon.style.transform = "rotate(0deg)"; // Reset rotation
            this.cancelledTimer = setTimeout(this.onCancel.bind(this), 1000);
        },

        onComplete: function () {
            this.progressContainer.style.display = "none";
            this.historyIcon.style.transform = "rotate(0deg)"; // Reset rotation
            this.postAction("FinishAction");
        },

        onCancel: function () {
            this.progressContainer.style.display = "none";
            this.historyIcon.style.transform = "rotate(0deg)"; // Reset rotation
        },

        postAction: function (action) {
            fetch(`https://progressbar/${action}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });
        },
    };

    ProgressBar.init();
});