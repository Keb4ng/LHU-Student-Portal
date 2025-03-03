var app = {
  programSearchBox: () => {
    const searchBox = $("#search-box");
    const dropdown = $("#dropdown");

    const programs = [
      "Computer Science",
      "Business Administration",
      "Engineering",
      "Psychology",
      "Artificial Intelligence",
      "Marketing Management",
      "Civil Engineering",
    ];

    searchBox.on("input", function () {
      const searchText = $(this).val().toLowerCase();
      dropdown.empty();
      dropdown.toggle(!!searchText);

      programs
        .filter((p) => p.toLowerCase().includes(searchText))
        .forEach((program) => {
          const div = $("<div>").text(program);
          div.on("click", function () {
            searchBox.val(program);
            dropdown.hide();
          });
          dropdown.append(div);
        });
    });

    $(document).on("click", function (event) {
      if (!$(event.target).is(searchBox) && !dropdown.has(event.target).length) {
        dropdown.hide();
      }
    });
  },

  register: () => {
    $("#registerForm").submit(function (event) {
      event.preventDefault();

      let username = $("#regUsername").val();
      let password = $("#regPassword").val();
      let name = $("#regFirstName").val() + " " + $("#regLastName").val();
      let email = $("#regEmail").val();

      if (localStorage.getItem(username)) {
        $("#regMessage").text("Username already exists!").css("color", "red");
      } else {
        localStorage.setItem(username, password, name, email);
        $("#regMessage").text("Registration successful!").css("color", "green");
      }

      $("#registerForm")[0].reset();
    });
  },

  login: () => {
    $("#loginForm").submit(function (event) {
      event.preventDefault();

      let username = $("#loginUsername").val().trim();
      let password = $("#loginPassword").val().trim();

      if (localStorage.getItem(username) === password) {
        $("#regMessage").text("Login successful! Redirecting...").css("color", "green");

        setTimeout(() => {
          window.location.href = "./portal-index.html";
        }, 1000);
      } else {
        $("#regMessage").text("Invalid username or password!").css("color", "red");
      }

      $("#loginForm")[0].reset();
    });
  },

  selectProgram: () => {
    $("#form-btn-nxt").click(function (event) {
      event.preventDefault();
      let isValid = true;
      function validateField(selector) {
        let value = $(selector).val();
        if (value === "") {
          $(selector).css("border", "2px solid red");
          isValid = false;
        } else {
          $(selector).css("border", "");
        }
        return value;
      }

      let programName = validateField("#search-box");
      let intakePeriod = validateField($("input[type='date']").eq(0));
      let deadlines = validateField($("input[type='date']").eq(1));

      if ($("input[name='degree-type']:checked").length === 0) {
        $(".form-radios").css("border", "1px solid red");
        isValid = false;
      } else {
        $(".form-radios").css("border", "");
      }

      if (isValid) {
        let selectProgramData = {
          programName,
          degreeType: $("input[name='degree-type']:checked").parent().text().trim(),
          intakePeriod,
          deadlines,
        };

        localStorage.setItem("selectProgram", JSON.stringify(selectProgramData));
        window.location.href = "applicant-hub__p2.html";
      } else {
        console.log("error saving");
      }
    });
  },

  personalInfo: () => {
    $("#form-btn-p2").click(function (event) {
      event.preventDefault();
      let isValid = true;

      function validateField(selector) {
        let value = $(selector).val().trim();
        if (value === "") {
          $(selector).css("border", "2px solid red");
          isValid = false;
        } else {
          $(selector).css("border", "");
        }
        return value;
      }

      let nameTitle = validateField("#nameTitle");
      let firstName = validateField("#firstName");
      let lastName = validateField("#lastName");
      let prevName = $("#prevLastName").val().trim();
      let gender = validateField("#gender");
      let countryOfBirth = validateField("#countryOfBirth");
      let nationality = validateField("#nationality");

      if (isValid) {
        let personalInfoData = {
          nameTitle,
          firstName,
          lastName,
          prevName,
          gender,
          countryOfBirth,
          nationality,
        };

        localStorage.setItem("personalInfo", JSON.stringify(personalInfoData));
        window.location.href = "applicant-hub__p3.html";
      } else {
        console.log("error saving");
      }
    });
  },

  paymentMethod: () => {
    $("input[name='payment']").on("change", function () {
      $(".payment-section").hide();
      $("#" + $(this).val()).show();
    });

    $("#savePayment").on("click", function () {
      let paymentData = {};
      let selectedMethod = $("input[name='payment']:checked").val();

      if (!selectedMethod) {
        alert("Please select a payment method.");
        return;
      }

      let isValid = true;

      if (selectedMethod === "credit") {
        paymentData = {
          method: "Credit Card",
          bankName: $("#bankName").val().trim(),
          cardNumber: $("#cardNumber").val().trim(),
          holderName: $("#holderName").val().trim(),
          expiryMM: $("#expiryMM").val().trim(),
          expiryYY: $("#expiryYY").val().trim(),
          cvv: $("#cvv").val().trim(),
        };

        if (
          !paymentData.bankName ||
          !paymentData.cardNumber ||
          !paymentData.holderName ||
          !paymentData.expiryMM ||
          !paymentData.expiryYY ||
          !paymentData.cvv
        ) {
          isValid = false;
        }
      } else if (selectedMethod === "paypal") {
        paymentData = {
          method: "PayPal",
          paypalEmail: $("#paypalEmail").val().trim(),
        };

        if (!paymentData.paypalEmail) {
          isValid = false;
        }
      } else if (selectedMethod === "bank") {
        paymentData = {
          method: "Bank Transfer",
          bankName: $("#transferBankName").val().trim(),
          accountNumber: $("#accountNumber").val().trim(),
          ifscCode: $("#ifscCode").val().trim(),
        };

        if (!paymentData.bankName || !paymentData.accountNumber || !paymentData.ifscCode) {
          isValid = false;
        }
      }

      if (!isValid) {
        alert("Please fill in all required fields.");
        return;
      }

      localStorage.setItem("paymentData", JSON.stringify(paymentData));
      alert("Payment information saved successfully!");

      window.location.href = "./applicant-hub__p6.html";
    });
  },
};

$(document).ready(function () {
  app.programSearchBox();
  app.register();
  app.login();
  app.selectProgram();
  app.personalInfo();
  app.paymentMethod();
});
