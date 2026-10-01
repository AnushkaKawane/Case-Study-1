```javascript
const form = document.getElementById("predictionForm");

const button = document.getElementById("predictButton");

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


form.addEventListener("submit", async function(event) {

    event.preventDefault();


    /* =========================
       LOADING
    ========================== */

    button.disabled = true;

    buttonText.textContent = "Analyzing...";


    /* =========================
       GET FORM DATA
    ========================== */

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


    /* =========================
       SEND TO FLASK
    ========================== */

    try {

        const response = await fetch(
            "/api/predict",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );


        const result = await response.json();


        /* =========================
           ERROR
        ========================== */

        if (!response.ok) {

            throw new Error(
                result.error ||
                "Prediction failed"
            );

        }


        /* =========================
           PROBABILITY
        ========================== */

        const probability =
            Number(result.probability);


        probabilityValue.textContent =
            probability.toFixed(1) + "%";


        progressBar.style.width =
            probability + "%";


        /* =========================
           RESULT
        ========================== */

        if (Number(result.prediction) === 1) {

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


        /* =========================
           MOBILE SCROLL
        ========================== */

        if (window.innerWidth < 1000) {

            document
                .querySelector(".result-card")
                .scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

        }


    } catch (error) {

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


    /* =========================
       RESET BUTTON
    ========================== */

    button.disabled = false;

    buttonText.textContent =
        "Analyze Heart Risk";

});
```
