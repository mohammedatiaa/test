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
    


    ["method-form-bisection", "method-form-false-position", "method-form-fixed-point", "method-form-newton"].forEach(formId => {
        let form = document.getElementById(formId);
        if (form) {
            form.addEventListener("submit", function(event) {
                event.preventDefault();
    
                let data = {};
                let url = "";
                let decimalDigits = 4; // Default if not provided
    
                if (["method-form-bisection", "method-form-false-position"].includes(formId)) {
                    decimalDigits = parseInt(document.getElementById("decimalDigits").value);
                    data = {
                        function: document.getElementById("function").value,
                        xl: parseFloat(document.getElementById("xl").value),
                        xu: parseFloat(document.getElementById("xu").value),
                        error: parseFloat(document.getElementById("error").value),
                        decimal_digits: decimalDigits,
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
    
                if (!data.function || Object.values(data).some(val => isNaN(val) && val !== data.function)) {
                    document.getElementById("result").innerText = "Error: Please fill all fields correctly.";
                    console.error("Invalid input data:", data);
                    return;
                }
    
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
                    const tableBody = document.getElementById("tableBody"); // Ensure you have <tbody id="tableBody">
                    tableBody.innerHTML = ""; // Clear existing rows
    
                    if (formId === "method-form-bisection" || formId === "method-form-false-position") {
                        data.iterations.forEach(row => {
                            let tableRow = `<tr>
                                <td>${row.iteration}</td>
                                <td>${row.xl}</td>
                                <td>${row.f_xl}</td>
                                <td>${row.xu}</td>
                                <td>${row.f_xu}</td>
                                <td>${row.xr}</td>
                                <td>${row.f_xr}</td>
                                <td>${row.error === "" ? "" : row.error}</td>
                            </tr>`;
                            tableBody.innerHTML += tableRow;
                        });
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