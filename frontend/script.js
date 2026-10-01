/* =========================
   ELEMENTS
========================= */

const form =
    document.getElementById("predictionForm");

const button =
    document.getElementById("predictButton");

const buttonText =
    document.getElementById("buttonText");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const probabilityValue =
    document.getElementById("probabilityValue");

const progressBar =
    document.getElementById("progressBar");

const resultStatus =
    document.getElementById("resultStatus");


/* =========================
   DROPDOWN INFORMATION CARDS
========================= */

/*
    These are the dropdowns that need
    the explanation card.

    Sex, FBS and Exercise-Induced Angina
    are intentionally NOT included.
*/

const explainedDropdowns = [
    {
        dropdown: "cp",
        card: "cpInfo"
    },
    {
        dropdown: "restecg",
        card: "restecgInfo"
    },
    {
        dropdown: "slope",
        card: "slopeInfo"
    },
    {
        dropdown: "ca",
        card: "caInfo"
    },
    {
        dropdown: "thal",
        card: "thalInfo"
    }
];


function hideAllInfoCards() {

    explainedDropdowns.forEach(
        function(item) {

            const card =
                document.getElementById(item.card);

            if (card) {
                card.classList.remove("show");
            }

        }
    );

}


explainedDropdowns.forEach(
    function(item) {

        const dropdown =
            document.getElementById(item.dropdown);

        const card =
            document.getElementById(item.card);


        if (!dropdown || !card) {
            return;
        }


        /*
            When the user clicks/focuses
            on the dropdown, show the
            explanation card.
        */

        dropdown.addEventListener(
            "focus",
            function() {

                hideAllInfoCards();

                card.classList.add("show");

            }
        );


        /*
            Also handle mouse click.
        */

        dropdown.addEventListener(
            "click",
            function() {

                hideAllInfoCards();

                card.classList.add("show");

            }
        );


        /*
            Hide when user leaves the
            dropdown.
        */

        dropdown.addEventListener(
            "blur",
            function() {

                setTimeout(
                    function() {
                        card.classList.remove("show");
                    },
                    150
                );

            }
        );

    }
);



/* =========================
   VISUAL GUIDE
========================= */

const bpInput =
    document.getElementById("trestbps");

const cholInput =
    document.getElementById("chol");

const heartRateInput =
    document.getElementById("thalach");


const bpGauge =
    document.getElementById("bpGauge");

const cholFill =
    document.getElementById("cholFill");

const bpVisual =
    document.getElementById("bpVisual");

const cholVisual =
    document.getElementById("cholVisual");

const hrVisual =
    document.getElementById("hrVisual");



/* BLOOD PRESSURE */

function updateBloodPressure() {

    const value =
        Number(bpInput.value);


    if (!value) {

        bpGauge.style.width = "0%";

        bpVisual.textContent =
            "-- mmHg";

        return;
    }


    const percentage =
        Math.min(
            Math.max(
                ((value - 80) / 100) * 100,
                0
            ),
            100
        );


    bpGauge.style.width =
        percentage + "%";


    bpVisual.textContent =
        value + " mmHg";
}



bpInput.addEventListener(
    "input",
    updateBloodPressure
);



/* CHOLESTEROL */

function updateCholesterol() {

    const value =
        Number(cholInput.value);


    if (!value) {

        cholFill.style.width =
            "0%";

        cholVisual.textContent =
            "-- mg/dL";

        return;
    }


    const percentage =
        Math.min(
            Math.max(
                ((value - 100) / 300) * 100,
                0
            ),
            100
        );


    cholFill.style.width =
        percentage + "%";


    cholVisual.textContent =
        value + " mg/dL";
}



cholInput.addEventListener(
    "input",
    updateCholesterol
);



/* HEART RATE */

function updateHeartRate() {

    const value =
        Number(heartRateInput.value);


    if (!value) {

        hrVisual.textContent =
            "-- bpm";

        return;
    }


    hrVisual.textContent =
        value + " bpm";
}



heartRateInput.addEventListener(
    "input",
    updateHeartRate
);



/* =========================
   PREDICTION
========================= */

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        button.disabled = true;

        buttonText.textContent =
            "Analyzing...";


        const data = {

            age: Number(
                document.getElementById("age").value
            ),

            sex: Number(
                document.getElementById("sex").value
            ),

            cp: Number(
                document.getElementById("cp").value
            ),

            trestbps: Number(
                document.getElementById("trestbps").value
            ),

            chol: Number(
                document.getElementById("chol").value
            ),

            fbs: Number(
                document.getElementById("fbs").value
            ),

            restecg: Number(
                document.getElementById("restecg").value
            ),

            thalach: Number(
                document.getElementById("thalach").value
            ),

            exang: Number(
                document.getElementById("exang").value
            ),

            oldpeak: Number(
                document.getElementById("oldpeak").value
            ),

            slope: Number(
                document.getElementById("slope").value
            ),

            ca: Number(
                document.getElementById("ca").value
            ),

            thal: Number(
                document.getElementById("thal").value
            )

        };


        try {

            const response =
                await fetch(
                    "/api/predict",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error ||
                    "Prediction failed"
                );

            }


            const probability =
                Number(
                    result.probability
                );


            probabilityValue.textContent =
                probability.toFixed(1) + "%";


            progressBar.style.width =
                probability + "%";


            if (
                Number(result.prediction) === 1
            ) {

                resultTitle.textContent =
                    "Higher Risk Indicated";


                resultMessage.textContent =
                    "The machine learning model indicates a higher estimated probability based on the information provided.";

            } else {

                resultTitle.textContent =
                    "Lower Risk Indicated";


                resultMessage.textContent =
                    "The machine learning model indicates a lower estimated probability based on the information provided.";

            }


            resultStatus.innerHTML =
                "<span>●</span> Model result generated";


            document
                .querySelector(".result-section")
                .scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

        }


        catch (error) {

            console.error(error);


            resultTitle.textContent =
                "Something went wrong";


            resultMessage.textContent =
                error.message;


            probabilityValue.textContent =
                "--%";


            progressBar.style.width =
                "0%";


            resultStatus.innerHTML =
                "<span>●</span> Prediction error";

        }


        button.disabled = false;

        buttonText.textContent =
            "Analyze Heart Risk";

    }
);