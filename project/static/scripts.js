// A method for navigating between pages on click in the nav bar.
document.addEventListener("DOMContentLoaded", function () {
        const buttons = document.querySelectorAll(".button");
        const urls = ["bi.html", "fa.html", "fi.html", "ne.html"];

        buttons.forEach((button, index) => {
            button.addEventListener("click", () => {
                window.location.href = urls[index];
            });
        });
    });

    // A method for navigating between pages on click.
    document.querySelectorAll(".extra-button").forEach(button => {
        button.addEventListener("click", function () {
            let page = this.getAttribute("data-page");
            window.location.href = page;
        });
    });

    // reset button 
    function resetFields() {
        document.getElementById("xl").value = "";
        document.getElementById("xu").value = "";
        document.getElementById("error").value = 5;
        document.getElementById("decimalDigits").value = 3;
        document.getElementById("decimalValue").textContent = "3";
        document.getElementById("table-body").innerHTML = "";
    }
    
    // decimal point change
    function updateDecimalValue(value) {
        document.getElementById("decimalValue").textContent = value;
    }
    


// Array of form IDs to handle
["method-form-bisection", "method-form-false-position", "method-form-fixed-point", "method-form-newton"].forEach(formId => {
    let form = document.getElementById(formId);
    if (form) { // Only add listener if form exists
        form.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent page reload

            let data = {};
            let url = "";

            // Determine which form is being submitted and prepare data
            if (["method-form-bisection", "method-form-false-position"].includes(formId)) {
                data = {
                    function: document.getElementById("function").value,
                    xl: parseFloat(document.getElementById("xl").value),
                    xu: parseFloat(document.getElementById("xu").value),
                    error: parseFloat(document.getElementById("error").value),
                    decimal_digits: parseInt(document.getElementById("decimalDigits").value),
                };
                url = "/api/calculate/";
            } else if (["method-form-fixed-point", "method-form-newton"].includes(formId)) {
                data = {
                    function: document.getElementById("function").value,
                    xo: parseFloat(document.getElementById("xo").value),
                    iteration: parseInt(document.getElementById("Iteration").value),
                    error_tolerance: parseFloat(document.getElementById("error").value),
                };
                url = "http://127.0.0.1:8000/solve-equation/";
            }

            // Log collected data for debugging
            // console.log(`🚀 البيانات اللي اتجمعت من ${formId}:`, data);

            // Validate data before sending (basic check)
            if (!data.function || Object.values(data).some(val => isNaN(val) && val !== data.function)) {
                document.getElementById("result").innerText = "Error: Please fill all fields correctly.";
                console.error("Invalid input data:", data);
                return;
            }

            // Send request to the appropriate endpoint
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log("Response:", data);
                // Display result based on form type
                if (formId === "method-form-bisection" || formId === "method-form-false-position") {
                    document.getElementById("result").innerText = `Root: ${data.root}`;
                } else {
                    document.getElementById("result").innerText = JSON.stringify(data, null, 2);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                document.getElementById("result").innerText = `Error: ${error.message}`;
            });
        });
    } else {
        console.warn(`Form with ID "${formId}" not found.`);
    }
});

// Function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        document.cookie.split(";").forEach(cookie => {
            let [key, value] = cookie.trim().split("=");
            if (key === name) {
                cookieValue = decodeURIComponent(value);
            }
        });
    }
    return cookieValue;
}

