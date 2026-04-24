// ===========================
// REQUEST FLOW CONFIG
// ===========================
const REQUEST_FLOW_CONFIG = {
  refund: { requiresPayment: false },
  id_card: { requiresPayment: true },
  transcript: { requiresPayment: true },
  attestation: { requiresPayment: true },
  introductory_letter: { requiresPayment: true }
};

// ===========================
// FORMAT UTILITIES
// ===========================
function loadHeader() {
  fetch("header.html")
    .then(res => res.text())
    .then(data => {
      const header = document.getElementById("header-placeholder");
      if (header) header.innerHTML = data;
    });
}

// ===========================
// FORMAT UTILITIES
// ===========================
function formatLabel(value) {
  if (!value) return "—";

  return value
    .toString()
    .replaceAll("_", " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

document.addEventListener("DOMContentLoaded", () => {
  loadHeader();

  // ✅ ADD IT RIGHT HERE (THIS IS "VERY TOP")
  const backArrow = document.querySelector(".back-arrow");

  if (backArrow) {
    backArrow.onclick = () => {
      const page = window.location.href;

      if (page.includes("new-request")) {
        window.location.href = "index.html";
      } else if (page.includes("request")) {
        window.location.href = "new-request.html";
      } else if (page.includes("upload")) {
        window.location.href = "request.html";
      } else if (page.includes("review")) {
        window.location.href = "upload.html";
      } else {
        window.history.back();
      }
    };
  }

  // ===========================
  // GLOBAL PAGE DETECTION
  // ===========================
  const currentPage = window.location.href;

  // ===========================
  // ADMIN DASHBOARD
  // ===========================
  if (currentPage.includes("admin.html")) {
    renderAdminRequests();
  }

  // ===========================
  // ADMIN DASHBOARD
  // ===========================
  if (currentPage.includes("admin.html")) {
    renderAdminRequests();
  }

  // ===========================
  // ADMIN FILTER BUTTONS
  // ===========================
  if (currentPage.includes("admin.html")) {

    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach(btn => {

      btn.addEventListener("click", () => {

        // Remove active state
        filterButtons.forEach(b => b.classList.remove("active"));

        // Set active
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        // Re-render with filter
        renderAdminRequests(filter);

      });

    });

  }

  // ===========================
  // ADMIN DETAILS PAGE
  // ===========================
  if (currentPage.includes("admin-details.html")) {
    setupAdminDetailsPage();
  }

  // ===========================
  // STATE
  // ===========================
  let requestState = JSON.parse(localStorage.getItem("requestState")) || {
    requestType: null,
    currentStep: 1,
    details: {},
    isSubmitted: false,
    status: null,
    payment: {
      proofUploaded: false,
      validated: false
    },
    delivery: {
      method: null,
      emailSent: false,
      pickedUp: false
    }
  };

  // ===========================
  // SAVE STATE
  // ===========================
  function saveState() {
    localStorage.setItem("requestState", JSON.stringify(requestState));
  }

  // ===========================
  // DASHBOARD (INDEX PAGE)
  // ===========================
  if (currentPage.includes("index.html") || currentPage === "/") {
    renderRequests();
  }

  // ===========================
  // DETAILS PAGE
  // ===========================
  if (currentPage.includes("details.html")) {
    setupDetailsPage();
  }

  function renderRequests() {
    const container = document.getElementById("requestsContainer");
    if (!container) return;

    const requests = JSON.parse(localStorage.getItem("requests")) || [];

    if (requests.length === 0) {
      container.innerHTML = "<p>No requests yet.</p>";
      return;
    }

    // ===========================
    // REQUEST LABEL MAP
    // ===========================
    const REQUEST_LABELS = {
      id_card: "Student ID Card Replacement",
      transcript: "Academic Transcript",
      introductory_letter: "Introductory Letter",
      attestation: "Attestation Letter",
      english_proficiency: "English Proficiency Letter",
      remarking: "Remarking Request",
      refund: "Refund Request"
    };

    // ========================================
    // RENDER REQUEST CARDS / DASHBOARD (INDEX PAGE)
    // ========================================
    container.innerHTML = requests.map(req => {

      const formattedType =
        REQUEST_LABELS[req.type] ||
        req.type.replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase());

      const status = req.status || "Submitted";
      const completionMessage = status === "Completed"
        ? getCompletionMessage(req)
        : "";
      const showPaymentWarning =
        status !== "Completed" && !req.payment?.proofUploaded;

      const progressMap = {
        "Submitted": 25,
        "Pending": 40,
        "In Progress": 70,
        "Completed": 100
      };

      const progress = progressMap[status] || 25;

      return `
        <div class="request-card">

          <div class="card-header">
            <h3>${formattedType}</h3>
            <span class="status-badge ${status.toLowerCase()}">${status}</span>
          </div>

          ${showPaymentWarning ? `
            <div class="warning-message">
              ⚠️ Payment proof not uploaded
            </div>
          ` : ""}

          ${completionMessage ? `
            <div class="notification-message">
              🔔 ${completionMessage}
            </div>
          ` : ""}

          <div class="card-body">

          <div class="card-body">

            <!-- PROGRESS -->
            <div class="progress-line">
              <div class="progress-fill" style="width: ${progress}%;"></div>
            </div>

            <!-- META -->
            <div class="card-meta">
              <p>📄 ${(req.details.requestSpeed || "regular").replace(/^./, c => c.toUpperCase())}</p>
              <p>📦 ${(req.details.deliveryMethod || "Not specified").replace(/^./, c => c.toUpperCase())}</p>
              <p>📅 ${req.date || "—"}</p>
            </div>

          </div>

          </div>

          <!-- CTA -->
          <button onclick="viewRequest('${req.id}')" class="secondary-btn">
            View Details
          </button>

        </div>
      `;
    }).join("");
  }

    // ===========================
    // NAVIGATION (NEW REQUEST)
    // ===========================

    const newRequestBtn = document.getElementById("newRequestBtn");

    if (newRequestBtn) {
      newRequestBtn.addEventListener("click", () => {
        // Clear any previous draft state
        localStorage.removeItem("requestState");

        // Go to Step 1 page
        window.location.href = "new-request.html";
      });
    }

  // ===========================
  // REQUEST TYPE SELECTION
  // ===========================
  const requestCards = document.querySelectorAll(".request-card");
  const continueBtn = document.getElementById("continueBtn");

  // BACK ARROW — NEW REQUEST PAGE
  if (currentPage.includes("new-request")) {
    const backArrow = document.querySelector(".back-arrow");

    requestCards.forEach(card => {
      card.addEventListener("click", () => {

        requestCards.forEach(c => c.classList.remove("selected"));

        card.classList.add("selected");

        const selectedType = card.dataset.type;
        requestState.requestType = selectedType;

        saveState();

        if (continueBtn) {
          continueBtn.disabled = false;
        }

      });
    });
  }
  // ===========================
// CONTINUE BUTTON
// ===========================
if (continueBtn) {
  continueBtn.disabled = true;
}

  if (currentPage.includes("new-request")) {
    console.log("Button found:", continueBtn);
  }

  if (continueBtn && currentPage.includes("new-request.html")) {

    continueBtn.addEventListener("click", () => {

      console.log("BUTTON CLICKED");

      if (!requestState.requestType) {
        alert("Please select a request type first.");
        return;
      }

      window.location.href = "request.html";
    });

  }

  // ===========================
  // STEP 2: DYNAMIC FORM RENDERING
  // ===========================

if (currentPage.includes("request.html")) {
  renderDynamicForm();
}

function renderDynamicForm() {
  const formContainer = document.getElementById("formContainer");

  if (!formContainer) return;

  if (!requestState.requestType) {
    formContainer.innerHTML = "<p>No request type selected.</p>";
    return;
  }

  let formHTML = "";
  console.log("Request Type:", requestState.requestType);

  switch (requestState.requestType?.toLowerCase()) {

    case "introductory_letter":
      formHTML = `

        <!-- ===================== -->
        <!-- STUDENT INFORMATION -->
        <!-- ===================== -->
        <div class="form-section">
          <h4 class="section-title">Student Information</h4>

          <div class="form-row">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="fullName" />
            </div>

            <div class="form-group">
              <label>Student ID</label>
              <input type="text" id="studentId" />
            </div>
          </div>
        </div>

        <!-- ===================== -->
        <!-- REQUEST DETAILS -->
        <!-- ===================== -->
        <div class="form-section">
          <h4 class="section-title">Request Details</h4>

          <div class="form-row">
            <div class="form-group">
              <label>Receiving Institution</label>
              <input type="text" id="receivingInstitution" placeholder="e.g. US Embassy" />
            </div>

            <div class="form-group">
              <label>Purpose</label>
              <input type="text" id="purpose" placeholder="e.g. Vacation with mum" />
            </div>
          </div>
        </div>

        <!-- ===================== -->
        <!-- DELIVERY INSTRUCTIONS -->
        <!-- ===================== -->
        <div class="form-section">
          <h4 class="section-title">Delivery Instructions</h4>

          <div class="delivery-option">
            <label class="checkbox-row">
              <input type="checkbox" id="sendToInstitution">
              <span>Send an official copy directly to the receiving institution</span>
            </label>
          </div>

          <div id="emailFieldWrapper" style="display:none;">
            <label>Recipient Institution Email</label>
            <input type="email" id="email" placeholder="e.g. admissions@uni.edu" />

            <p class="info-text">
            This document will be sent directly to the receiving institution.
            </p>
          </div>
          
        </div>
      `;
      break;

    case "transcript":
      formHTML = `
        <div class="form-section">
          <h4 class="section-title">Student Information</h4>
          <div class="form-row">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="fullName" />
            </div>
            <div class="form-group">
              <label>Student ID</label>
              <input type="text" id="studentId" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h4 class="section-title">Request Details</h4>
          <div class="form-row">
            <div class="form-group">
              <label>Number of Copies</label>
              <input type="number" id="quantity" min="1" />
            </div>
            <div class="form-group">
              <label>Service Type</label>
              <select id="requestSpeed">
                <option value="" disabled selected>Select service type</option>
                <option value="regular">Regular</option>
                <option value="express">Express</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h4 class="section-title">Delivery Instructions</h4>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" id="sendToInstitution" />
              <span>Send an official copy directly to the receiving institution</span>
            </label>
          </div>

          <div id="emailFieldWrapper" style="display:none;">
            <label>Recipient Institution Email</label>
            <input type="email" id="email" />
          </div>
        </div>
      `;
    break;
      

    case "id_card":
      formHTML = `
        <div class="form-section">
          <h4 class="section-title">Student Information</h4>
          <div class="form-row">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="fullName" />
            </div>
            <div class="form-group">
              <label>Student ID</label>
              <input type="text" id="studentId" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h4 class="section-title">Request Details</h4>
          <div class="form-group">
            <label>Reason for Replacement</label>
            <input type="text" id="reason" placeholder="e.g. Lost, Damaged" />
          </div>
        </div>
      `;
    break;

    case "attestation":
      formHTML = `

        <div class="form-section">
          <h4 class="section-title">Student Information</h4>

          <div class="form-row">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="fullName" />
            </div>

            <div class="form-group">
              <label>Student ID</label>
              <input type="text" id="studentId" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h4 class="section-title">Request Details</h4>

          <div class="form-row">
            <div class="form-group">
              <label>Receiving Institution</label>
              <input type="text" id="receivingInstitution" />
            </div>

            <div class="form-group">
              <label>Purpose</label>
              <input type="text" id="purpose" />
            </div>
          </div>

          <div class="form-group">
            <label>Service Type</label>
            <select id="requestSpeed">
              <option value="" disabled selected>Select service type</option>
              <option value="regular">Regular</option>
              <option value="express">Express</option>
            </select>
          </div>
        </div>

        <div class="form-section">
          <h4 class="section-title">Delivery & Dispatch</h4>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" id="sendToInstitution" />
              <span>Send an official copy directly to the receiving institution</span>
            </label>
          </div>

          <div id="emailFieldWrapper" style="display:none;">
            <label>Recipient Institution Email</label>
            <input type="email" id="email" />
          </div>

        </div>

      `;
      break;
      
    case "english_proficiency":
      formHTML = `

        <div class="form-section">
          <h4 class="section-title">Student Information</h4>

          <div class="form-row">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="fullName" />
            </div>

            <div class="form-group">
              <label>Student ID</label>
              <input type="text" id="studentId" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h4 class="section-title">Request Details</h4>

          <div class="form-row">
            <div class="form-group">
              <label>Receiving Institution</label>
              <input type="text" id="receivingInstitution" />
            </div>

            <div class="form-group">
              <label>Purpose</label>
              <input type="text" id="purpose" />
            </div>
          </div>

          <div class="form-group">
            <label>Service Type</label>
            <select id="requestSpeed">
              <option value="" disabled selected>Select service type</option>
              <option value="regular">Regular</option>
              <option value="express">Express</option>
            </select>
          </div>
        </div>

        <div class="form-section">
          <h4 class="section-title">Delivery & Dispatch</h4>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" id="sendToInstitution" />
              <span>Send an official copy directly to the receiving institution</span>
            </label>
          </div>

          <div id="emailFieldWrapper" style="display:none;">
            <label>Recipient Institution Email</label>
            <input type="email" id="email" />
          </div>

        </div>
      `;
      break;

      case "remarking":
        formHTML = `

          <div class="form-section">
            <h4 class="section-title">Student Information</h4>

            <div class="form-row">
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="fullName" />
              </div>

              <div class="form-group">
                <label>Student ID</label>
                <input type="text" id="studentId" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4 class="section-title">Request Details</h4>

            <div class="form-row">
              <div class="form-group">
                <label>Course Code</label>
                <input type="text" id="courseCode" />
              </div>

              <div class="form-group">
                <label>Course Title</label>
                <input type="text" id="courseTitle" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Date of Exam</label>
                <input type="date" id="examDate" />
              </div>

              <div class="form-group">
                <label>Venue</label>
                <input type="text" id="venue" />
              </div>
            </div>

            <div class="form-group">
              <label>Reason for Request</label>
              <input type="text" id="reason" placeholder="e.g. Suspected grading error" />
            </div>
          </div>
        `;
      break;

    case "refund":
    formHTML = `

      <div class="form-section">
        <h4 class="section-title">Student Information</h4>

        <div class="form-row">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="fullName" />
          </div>

          <div class="form-group">
            <label>Student ID</label>
            <input type="text" id="studentId" />
          </div>
        </div>
      </div>

      <div class="form-section">
        <h4 class="section-title">Request Details</h4>

          <div class="form-row">
            <div class="form-group">
              <label>Date of Payment</label>
              <input type="date" id="paymentDate" />
            </div>

            <div class="form-group">
              <label>Currency</label>
              <select id="currency">
                <option value="" disabled selected>Select currency</option>
                <option value="GHS">GHS (₵)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Amount Paid</label>
            <input type="number" id="amountPaid" min="0" />
          </div>
        </div>

        <div class="form-group">
          <label>Reason for Refund</label>
          <input type="text" id="reason" placeholder="e.g. Duplicate payment" />
        </div>
      </div>

    `;
  break;

    default:
      formHTML = "<p>Form not configured for this request.</p>";
  }

  formContainer.innerHTML = formHTML;

  // ===========================
  // DELIVERY METHOD → DYNAMIC EMAIL FIELD
  // ===========================
  const sendCheckbox = document.getElementById("sendToInstitution");
  const emailWrapper = document.getElementById("emailFieldWrapper");

  if (sendCheckbox && emailWrapper) {
    sendCheckbox.addEventListener("change", () => {
      emailWrapper.style.display = sendCheckbox.checked ? "block" : "none";

      if (!sendCheckbox.checked) {
        delete requestState.details.email;
        saveState();
      }
    });

    // restore state
    if (requestState.details.email) {
      sendCheckbox.checked = true;
      emailWrapper.style.display = "block";
    }
  }

  // Restore previously entered values (if user navigates back)
  restoreFormData();
}

// ===========================
// RESTORE FORM DATA
// ===========================

function restoreFormData() {
  Object.keys(requestState.details).forEach(key => {
    const field = document.getElementById(key);
    if (field) {
      field.value = requestState.details[key];
    }
  });
}

  // ===========================
  // STEP 2: BUTTON LOGIC
  // ===========================

  if (currentPage.includes("request.html")) {

    const nextBtn = document.getElementById("nextBtn");
    const backBtn = document.getElementById("backBtn");

    const backArrow = document.querySelector(".back-arrow");

    // NEXT BUTTON
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        console.log("STEP 2 → NEXT CLICKED");

        const type = requestState.requestType;

        const requiresPayment =
          REQUEST_FLOW_CONFIG[type]?.requiresPayment ?? true;

        if (requiresPayment) {
          window.location.href = "upload.html";
        } else {
          window.location.href = "review.html";
        }
      });
    }
  }

  // ===========================
  // STEP 2: VALIDATION + STATE CAPTURE
  // ===========================

  if (currentPage.includes("request.html")) {

    const formContainer = document.getElementById("formContainer");
    const nextBtn = document.getElementById("nextBtn");

    if (formContainer && nextBtn) {

      formContainer.addEventListener("input", () => {

        const fields = formContainer.querySelectorAll("input, select");

        let isValid = true;

        fields.forEach(field => {
          const value = field.value.trim();

          // Save immediately
          requestState.details[field.id] = value;

          // Skip hidden email field
          if (field.id === "email" && field.offsetParent === null) {
            return;
          }

          if (value === "") {
            isValid = false;
          }
        });

        // Enable / Disable button
        nextBtn.disabled = !isValid;

        // Persist to localStorage
        saveState();
      });

    }
  }

  // ===========================
  // UPLOAD PAGE LOGIC
  // ===========================

  if (currentPage.includes("upload.html")) {

    // BACK ARROW FIX (UPLOAD PAGE)
    const backArrow = document.querySelector(".back-arrow");

    if (backArrow) {
      backArrow.addEventListener("click", () => {
        window.location.href = "request.html";
      });
    }

    const uploadBox = document.getElementById("uploadBox");
    const fileInput = document.getElementById("disbursementSlip");
    const nextBtn = document.getElementById("toReviewBtn");

    // Click anywhere on box → open file picker
    if (uploadBox && fileInput) {
      uploadBox.addEventListener("click", () => {
        fileInput.click();
      });
    }

    // When file is selected
    if (fileInput && nextBtn) {
      fileInput.addEventListener("change", () => {

      const file = fileInput.files[0];

      if (file) {
        console.log("File selected:", file.name);

        requestState.payment.proofUploaded = true;
        requestState.payment.fileName = file.name;

        saveState();

        nextBtn.disabled = false;

        const uploadText = document.getElementById("uploadText");
        const uploadSubtext = document.getElementById("uploadSubtext");
        const uploadIcon = document.getElementById("uploadIcon");
        const uploadStatus = document.getElementById("uploadStatus");

        if (uploadText && uploadSubtext && uploadIcon) {
          uploadIcon.textContent = "✔️";
          uploadText.innerHTML = "<strong>File Uploaded Successfully</strong>";
          uploadSubtext.textContent = file.name;
        }

        if (uploadStatus) {
          uploadStatus.textContent = "Uploaded";
          uploadStatus.classList.remove("pending");
          uploadStatus.classList.add("success");
        }

        uploadBox.classList.add("active");
      }

    });
    }

    // Navigate to review page
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        window.location.href = "review.html";
      });
    }

    // Render request info
    const titleEl = document.getElementById("requestTitle");
    const serviceEl = document.getElementById("serviceType");

    if (titleEl && requestState.requestType) {
      const formattedTitle = requestState.requestType
        .replaceAll("_", " ")
        .replace(/\b\w/g, c => c.toUpperCase());

      titleEl.textContent = `Pay for: ${formattedTitle}`;
    }

    if (serviceEl && requestState.details.requestSpeed) {
      if (requestState.details.requestSpeed) {
        const formattedService = requestState.details.requestSpeed
          .replace(/\b\w/g, c => c.toUpperCase());

        serviceEl.textContent = `${formattedService} Processing`;
      }
    }

    // Restore uploaded state on reload
  if (requestState.payment.proofUploaded) {
    const uploadStatus = document.getElementById("uploadStatus");
    const uploadText = document.getElementById("uploadText");
    const uploadSubtext = document.getElementById("uploadSubtext");
    const uploadIcon = document.getElementById("uploadIcon");

    if (uploadStatus) {
      uploadStatus.textContent = "Uploaded";
      uploadStatus.classList.add("success");
    }

    if (uploadText) {
      uploadText.innerHTML = "<strong>File Uploaded</strong>";
    }

    if (uploadSubtext) {
      uploadSubtext.textContent = requestState.payment.fileName || "";
    }

    if (uploadIcon) {
      uploadIcon.textContent = "✔️";
    }

    nextBtn.disabled = false;
    uploadBox.classList.add("active");
  }
}

// ===========================
// REVIEW PAGE RENDER
// ===========================

  if (currentPage.includes("review.html")) {
    renderReviewPage();
    setupSubmitHandler();
  }

// ===========================
// SUBMIT REQUEST
// ===========================

function setupSubmitHandler() {

  const submitBtn = document.getElementById("submitBtn");

  if (!submitBtn) return;

  submitBtn.addEventListener("click", () => {

    // ===========================
    // FINAL VALIDATION
    // ===========================
    if (!requestState.payment.proofUploaded) {
      alert("Please upload proof of payment.");
      return;
    }

    // ===========================
    // BUILD REQUEST OBJECT
    // ===========================
    const newRequest = {
      id: "REQ-" + Date.now(),
      type: requestState.requestType,
      details: requestState.details,
      delivery: requestState.delivery,
      payment: requestState.payment,
      status: "Submitted",
      date: new Date().toLocaleString(),

      // ✅ SIMPLE AUDIT
      audit: [
        {
          action: "Request submitted",
          timestamp: new Date().toLocaleString()
        }
      ]
    };

    // ===========================
    // SAVE TO REQUESTS ARRAY
    // ===========================
    const existingRequests = JSON.parse(localStorage.getItem("requests")) || [];

    existingRequests.push(newRequest);

    localStorage.setItem("requests", JSON.stringify(existingRequests));

    // ===========================
    // CLEAR ACTIVE STATE
    // ===========================
    localStorage.removeItem("requestState");

    // ===========================
    // SUCCESS FEEDBACK + REDIRECT
    // ===========================
    alert("Request submitted successfully!");

    window.location.href = "index.html";
  });
}

function renderReviewPage() {

  // Guard: ensure state exists
  if (!requestState || !requestState.requestType) {
    alert("No request data found.");
    window.location.href = "new-request.html";
    return;
  }

  // ===========================
  // FLOW CHECK (PAYMENT REQUIRED?)
  // ===========================
  const type = requestState.requestType;

  const requiresPayment =
    REQUEST_FLOW_CONFIG[type]?.requiresPayment ?? true;

  // ===========================
  // REQUEST INFO
  // ===========================
  const requestInfo = document.getElementById("requestInfo");

  if (requestInfo) {
    const formattedType = requestState.requestType
      .replaceAll("_", " ")
      .replace(/\b\w/g, c => c.toUpperCase());

    requestInfo.innerHTML = `<p><strong>Type:</strong> ${formattedType}</p>`;
  }

  // ===========================
  // STUDENT DETAILS
  // ===========================
  const studentDetails = document.getElementById("studentDetails");

  if (studentDetails) {
    const details = requestState.details;

    studentDetails.innerHTML = Object.keys(details)
    .filter(key => key !== "deliveryMethod") // 🔥 EXCLUDE DELIVERY
    .map(key => {
      const label = key
        .replace(/([A-Z])/g, " $1") // split camelCase
        .replace(/^./, str => str.toUpperCase());
      return `<p><strong>${label}:</strong> ${details[key]}</p>`;
    })
    .join("");
  }

  // ===========================
  // DELIVERY INFO
  // ===========================
  const deliveryInfo = document.getElementById("deliveryInfo");

  if (deliveryInfo) {
    let method = requestState.details.deliveryMethod;

    if (!method || method === ">" || method.trim() === "") {
      method = "Not specified";
    }

    deliveryInfo.innerHTML = `<p><strong>Method:</strong> ${method}</p>`;
  }

  // ===========================
  // PAYMENT INFO
  // ===========================
  const paymentInfo = document.getElementById("paymentInfo");

  if (paymentInfo && requiresPayment) {
      const status = requestState.payment.proofUploaded
        ? "Document Uploaded"
        : "Pending";

      paymentInfo.innerHTML = `<p><strong>Status:</strong> ${status}</p>`;
    }

  if (!requiresPayment && paymentInfo) {
    paymentInfo.innerHTML = "";
  }

  // ===========================
  // UPLOAD INFO
  // ===========================
  const uploadInfo = document.getElementById("uploadInfo");

  if (uploadInfo && requiresPayment) {
    const fileName = requestState.payment.fileName || "No file uploaded";

    uploadInfo.innerHTML = `<p><strong>File:</strong> ${fileName}</p>`;
  }

  if (!requiresPayment && uploadInfo) {
    uploadInfo.innerHTML = "";
  }
}

  window.viewRequest = function(id) {
    window.location.href = `details.html?id=${id}`;
  };


  window.viewRequest = function(id) {
    window.location.href = `details.html?id=${id}`;
  };

  // 👇 ADD THIS RIGHT HERE (immediately below)
  window.viewAdminRequest = function(id) {
    window.location.href = `admin-details.html?id=${id}`;
  };

  function setupDetailsPage() {

    // ===========================
    // GET ID FROM URL
    // ===========================
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get("id");

    console.log("Request ID from URL:", requestId);

    // ===========================
    // GET STORED REQUESTS
    // ===========================
    const requests = JSON.parse(localStorage.getItem("requests")) || [];

    console.log("All requests:", requests);

    // ===========================
    // FIND MATCHING REQUEST
    // ===========================
    const request = requests.find(r => r.id === requestId);

    console.log("Matched request:", request);

    // ===========================
    // GUARD
    // ===========================
    if (!request) {
      alert("Request not found.");
      window.location.href = "index.html";
      return;
    }

    // ===========================
    // RENDER
    // ===========================
    renderRequestDetails(request);
  }

  // ===========================
  //  RENDER REQUEST DETAILS
  // ===========================
function renderRequestDetails(req) {

  const formattedType = req.type
    .replaceAll("_", " ")
    .replace(/\b\w/g, c => c.toUpperCase());

  const status = req.status || "Submitted";

  // ===========================
  // HEADER
  // ===========================
  document.getElementById("detailTitle").textContent = `${formattedType} Request`;
  document.getElementById("detailId").textContent = req.id;

  // ===========================
  // STATUS TRACKER (NEW SYSTEM)
  // ===========================
  const steps = ["Submitted", "Pending", "In Progress", "Completed"];
  const currentIndex = Math.max(steps.indexOf(status), 0);

  let trackerHTML = `
    <div class="tracker-line"></div>
    <div class="tracker-progress" style="width: ${(currentIndex / (steps.length - 1)) * 100}%"></div>
  `;

  trackerHTML += steps.map((step, index) => {

    const isCompleted = index < currentIndex;
    const isActive = index === currentIndex;

    return `
      <div class="tracker-step">
        
        <div class="node ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}">
          ${isCompleted ? "✔" : ""}
        </div>

        <p>${step}</p>
      </div>
    `;
  }).join("");

  document.getElementById("statusTracker").innerHTML = trackerHTML;

    // ===========================
    // PAYMENT
    // ===========================
    const paymentHTML = `
      <div class="info-row">
        <div class="info-icon">📤</div>
        <div>
          <p><strong>Proof of Payment:</strong> ${req.payment?.proofUploaded ? "Uploaded" : "Pending"}</p>
        </div>
      </div>

      <div class="status-pill ${req.payment?.validated ? "success" : "pending"}">
        ${req.payment?.validated ? "Validated ✓" : "Not Validated"}
      </div>
    `;

    document.getElementById("detailPayment").innerHTML = paymentHTML;

  // ===========================
  // PROCESSING
  // ===========================
    const processingHTML = `
      <div class="info-row">
        <div class="info-icon">⏳</div>
        <div>
          <p><strong>Status:</strong> ${status}</p>
          <p><strong>Service Type:</strong> ${formatLabel(req.details.requestSpeed)}</p>
          <p><strong>Submitted:</strong> ${req.date}</p>
        </div>
      </div>
    `;

    document.getElementById("detailProcessing").innerHTML = processingHTML;

  // ============================
  // DELIVERY (STUDENT VIEW - CLEAN)
  // ============================
  const method = req.details?.deliveryMethod || "pickup";
  const email = req.details?.email;

  let deliveryContent = "";

  // 📦 PICKUP
  if (method === "pickup" || method === "both") {
    deliveryContent += `
      <p><strong>📦 Pickup</strong></p>
    `;
  }

  // 📧 EMAIL
  if (method === "email" || method === "both") {
    deliveryContent += `
      <p><strong>📧 Email:</strong> ${email || "Not provided"}</p>
    `;
  }

  const deliveryHTML = `
    <div class="info-row">
      <div class="info-icon"></div>
      <div>
        <p><strong>Delivery Method</strong></p>
        ${deliveryContent}
      </div>
    </div>
  `;

  document.getElementById("detailDelivery").innerHTML = deliveryHTML;

  // ===========================
  // PROGRESS BAR WIDTH
  // ===========================
    const progressPercent = (currentIndex / (steps.length - 1)) * 100;

    const progressEl = document.getElementById("progressFill");

    if (progressEl) {
      progressEl.style.width = progressPercent + "%";
    }
  }

});

// ===========================
// ADMIN: RENDER REQUESTS
// ===========================
function renderAdminRequests(filter = "all") {

  const container = document.getElementById("adminRequestsContainer");
  if (!container) return;

  const requests = JSON.parse(localStorage.getItem("requests")) || [];

  // ✅ FILTER LOGIC
  let filteredRequests = requests;

  if (filter !== "all") {
    filteredRequests = requests.filter(req => req.status === filter);
  }

  if (requests.length === 0) {
    container.innerHTML = "<p>No requests found.</p>";
    return;
  }

  container.innerHTML = filteredRequests.map(req => {

    const formattedType = req.type
      .replaceAll("_", " ")
      .replace(/\b\w/g, c => c.toUpperCase());

    const status = req.status || "Submitted";

    return `
      <div class="admin-card">

        <div class="admin-card-header">
          <h3>${formattedType}</h3>
          <span class="status-badge ${status.toLowerCase()}">${status}</span>
        </div>

        <div class="admin-card-body">
          <p><strong>ID:</strong> ${req.id}</p>
          <p><strong>Date:</strong> ${req.date}</p>
        </div>

        <div class="admin-card-actions">
          <button onclick="viewAdminRequest('${req.id}')" class="primary-btn">
            Manage Request
          </button>
        </div>

      </div>
    `;
  }).join("");
}

  window.viewAdminRequest = function(id) {
    window.location.href = `admin-details.html?id=${id}`;
  };

// ===========================
// ADMIN DETAILS LOGIC
// ===========================
function setupAdminDetailsPage() {

  const urlParams = new URLSearchParams(window.location.search);
  const requestId = urlParams.get("id");

  const requests = JSON.parse(localStorage.getItem("requests")) || [];

  const request = requests.find(r => r.id === requestId);

  if (!request) {
    alert("Request not found");
    window.location.href = "admin.html";
    return;
  }

  // TITLE
  document.getElementById("adminDetailTitle").textContent =
    request.type.replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase());

  document.getElementById("adminDetailId").textContent = request.id;

  // REQUEST INFO
  document.getElementById("adminRequestInfo").innerHTML = `
    <p><strong>Status:</strong> ${request.status}</p>
    <p><strong>Date:</strong> ${request.date}</p>
  `;

  // STUDENT DETAILS
  const detailsHTML = Object.keys(request.details)
    .map(key => `<p><strong>${key}:</strong> ${request.details[key]}</p>`)
    .join("");

  document.getElementById("adminStudentDetails").innerHTML = detailsHTML;

  // PAYMENT
  document.getElementById("adminPaymentInfo").innerHTML = `
    <p><strong>Proof:</strong> ${request.payment?.proofUploaded ? "Uploaded" : "Missing"}</p>
    <p><strong>Validated:</strong> ${request.payment?.validated ? "Yes" : "No"}</p>
  `;

  // VALIDATE PAYMENT
  document.getElementById("validatePaymentBtn").onclick = () => {

    request.payment.validated = true;

    // ✅ ADD AUDIT ENTRY
    request.audit = request.audit || [];
    request.audit.push({
      action: "Payment validated",
      timestamp: new Date().toLocaleString()
    });

    saveAdminChanges(requests);
    alert("Payment validated");
    location.reload();
  };

  // STATUS UPDATE
  const statusSelect = document.getElementById("statusSelect");
  statusSelect.value = request.status;

  document.getElementById("updateStatusBtn").onclick = () => {

    const newStatus = statusSelect.value;
    const currentStatus = request.status;

    // ===========================
    // WORKFLOW ORDER
    // ===========================
    const statusFlow = ["Submitted", "Pending", "In Progress", "Completed"];

    const currentIndex = statusFlow.indexOf(currentStatus);
    const newIndex = statusFlow.indexOf(newStatus);

    // ===========================
    // RULE 1: NO SKIPPING
    // ===========================
    if (newIndex > currentIndex + 1) {
      alert("Invalid transition: You cannot skip workflow steps.");
      statusSelect.value = currentStatus;
      return;
    }

    // ===========================
    // RULE 2: PAYMENT REQUIRED
    // ===========================
    const paymentValidated = request.payment?.validated;

    if ((newStatus === "In Progress" || newStatus === "Completed") && !paymentValidated) {
      alert("You must validate payment before moving to this stage.");
      statusSelect.value = currentStatus;
      return;
    }

    // ===========================
    // APPLY UPDATE
    // ===========================
    request.status = newStatus;

    // ✅ AUDIT
    request.audit = request.audit || [];
    request.audit.push({
      action: `Status updated to ${newStatus}`,
      timestamp: new Date().toLocaleString()
    });

    saveAdminChanges(requests);
    alert("Status updated");
    location.reload();
  };

  // ===========================
  // AUDIT TRAIL
  // ===========================
  const auditContainer = document.getElementById("auditTrail");

  if (auditContainer) {

    const audit = request.audit || [];

    if (audit.length === 0) {
      auditContainer.innerHTML = "<p>No activity yet.</p>";
    } else {
      auditContainer.innerHTML = audit
        .map(item => `
          <div class="audit-item">
            <p><strong>${item.action}</strong></p>
            <small>${item.timestamp}</small>
          </div>
        `)
        .join("");
    }
  }
}

// ===========================
// SAVE ADMIN CHANGES
// ===========================
function saveAdminChanges(requests) {
  localStorage.setItem("requests", JSON.stringify(requests));
}

// ======================
// COMPLETION MESSAGE
// ======================
function getCompletionMessage(req) {
  const type = req.type;

  if (type === "transcript" || type === "id_card") {
    return "Your request is ready for pickup.";
  }

  if (type === "introductory_letter" || type === "attestation") {
    return "Your request has been sent to your email.";
  }

  return "Your request has been successfully completed.";
}