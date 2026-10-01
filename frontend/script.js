const form = document.getElementById("predictionForm");

const button = document.getElementById("predictButton");
const buttonText = document.getElementById("buttonText");

const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");

const probabilityValue =
    document.getElementById("probabilityValue");

const progressBar =
    document.getElementById("progressBar");

const resultStatus =
    document.getElementById("resultStatus");


/* =====================================================
   CHECK ELEMENTS
===================================================== */

if (!form) {
    console.error("predictionForm not found");
}

if (!button) {
    console.error("predictButton not found");
}


/* =====================================================
   FORM SUBMIT
===================================================== */

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    console.log("Analyze button clicked");


    /* =================================================
       LOADING
    ================================================= */

    button.disabled = true;

    buttonText.textContent = "Analyzing...";


    /* =================================================
       COLLECT FORM DATA
    ================================================= */

    const data = {

        age: Number(document.getElementById("age").value),

        sex: Number(document.getElementById("sex").value),

        cp: Number(document.getElementById("cp").value),

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


    console.log("Data being sent:");
    console.log(data);


    /* =================================================
       SEND DATA TO FLASK
    ================================================= */

    try {

        const response = await fetch("/api/predict", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });


        console.log(
            "API response status:",
            response.status
        );


        /* =============================================
           READ RESPONSE
        ============================================= */

        const result = await response.json();


        console.log("API response:");
        console.log(result);


        /* =============================================
           CHECK API ERROR
        ============================================= */

        if (!response.ok) {

            throw new Error(
                result.error ||
                "Prediction request failed."
            );

        }


        /* =============================================
           GET RESULT
        ============================================= */

        const prediction =
            Number(result.prediction);

        const probability =
            Number(result.probability);


        if (isNaN(prediction)) {

            throw new Error(
                "Invalid prediction received from server."
            );

        }


        if (isNaN(probability)) {

            throw new Error(
                "Invalid probability received from server."
            );

        }


        /* =============================================
           SHOW PROBABILITY
        ============================================= */

        probabilityValue.textContent =
            probability.toFixed(1) + "%";


        progressBar.style.width =
            probability + "%";


        /* =============================================
           SHOW PREDICTION
        ============================================= */

        if (prediction === 1) {

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


        /* =============================================
           STATUS
        ============================================= */

        resultStatus.innerHTML =
            "<span>●</span> Model result generated";


        /* =============================================
           SCROLL TO RESULT
        ============================================= */

        const resultCard =
            document.querySelector(".result-card");

        if (resultCard && window.innerWidth < 1000) {

            resultCard.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }


    } catch (error) {

        console.error(
            "Prediction error:",
            error
        );


        /* =============================================
           SHOW ERROR
        ============================================= */

        resultTitle.textContent =
            "Prediction Error";

        resultMessage.textContent =
            error.message;

        probabilityValue.textContent =
            "--%";

        progressBar.style.width =
            "0%";

        resultStatus.innerHTML =
            "<span>●</span> Prediction failed";

    }


    /* =================================================
       RESET BUTTON
    ================================================= */

    button.disabled = false;

    buttonText.textContent =
        "Analyze Heart Risk";

});
