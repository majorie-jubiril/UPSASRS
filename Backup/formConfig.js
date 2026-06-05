const FORM_CONFIG = {
  transcript: {
    type: "transcript",
    title: "Transcript Request",
    sections: [
      {
        title: "STUDENT INFORMATION",
        rows: [[
          { name:  "fullName", placeholder: "Full Name" },
          { name: "studentId", placeholder: "Student ID" }
        ]]
      },
      {
        title: "REQUEST DETAILS",
        rows: [
          [
            { name: "institution", placeholder: "Receiving Institution" },
            { name: "purpose", placeholder: "Purpose" }
          ],
          [
            { name: "copies", placeholder: "Number of Copies", type: "number" },
            { name: "service", placeholder: "Service type", type: "select", options: ["Regular", "Express"] }
          ]
        ]
      },
      {
        title: "DELIVERY INSTRUCTIONS",
            type: "delivery",
            fields: [
                {
                name: "sendDirect",
                type: "checkbox",
                label: "Send to institution"
                },
                {
                name: "email",
                type: "email",
                placeholder: "Institution Email Address",
                condition: "sendDirect"
                }
            ]
        }
    ]
  },

  idCard: {
    type: "idCard",
    title: "ID Card Replacement",
    sections: [
      {
        title: "STUDENT INFORMATION",
        rows: [[
          { name:  "fullName", placeholder: "Full Name" },
          { name: "studentId", placeholder: "Student ID" }
        ]]
      },
      {
        title: "REQUEST DETAILS",
        rows: [[
          { name: "reason", placeholder: "Reason for replacement (lost, damaged, etc.)" }
        ]]
      }
    ]
  },

  refund: {
    type: "refund",
    title: "Request for Refund",
    sections: [
      {
        title: "STUDENT INFORMATION",
        rows: [[
          { name: "fullName", placeholder: "Full Name" },
          { name: "studentId", placeholder: "Student ID" }
        ]]
      },
      {
        title: "REQUEST DETAILS",
        rows: [
          [
            { name: "date", type: "date" },
            { name: "currency", type: "select", options: ["GHS", "USD"] }
          ],
          [
            { name: "amount", placeholder: "Amount Paid", type: "number" }
          ],
          [
            { name: "reason", placeholder: "Reason for refund" }
          ]
        ]
      }
    ]
  },

  introLetter: {
    type: "introLetter",
    title: "Introductory Letter",
    sections: [
      {
        title: "STUDENT INFORMATION",
        rows: [[
          { name: "fullName", placeholder: "Full Name" },
          { name: "studentId", placeholder: "Student ID" }
        ]]
      },
      {
        title: "REQUEST DETAILS",
        rows: [
          [
            { name: "institution", placeholder: "Receiving Institution" },
            { name: "purpose", placeholder: "Purpose" }
          ],
          [
            { name: "copies", placeholder: "Number of Copies", type: "number" },
            { name: "service", placeholder: "Service type", type: "select", options: ["Regular", "Express"] }
          ]
        ]
      },
      {
        title: "DELIVERY INSTRUCTIONS",
            type: "delivery",
            fields: [
                {
                name: "sendDirect",
                type: "checkbox",
                label: "Send to institution"
                },
                {
                name: "email",
                type: "email",
                placeholder: "Institution Email Address",
                condition: "sendDirect"
                }
            ]
        }
    ]
  },

  attestation: {
    type: "attestation",
    title: "Attestation Letter",
    sections: [
      {
        title: "STUDENT INFORMATION",
        rows: [[
          { name: "fullName", placeholder: "Full Name" },
          { name: "studentId", placeholder: "Student ID" }
        ]]
      },
      {
        title: "REQUEST DETAILS",
        rows: [
          [
            { name: "institution", placeholder: "Receiving Institution" },
            { name: "purpose", placeholder: "Purpose" }
          ],
          [
            { name: "copies", placeholder: "Number of Copies", type: "number" },
            { name: "service", placeholder: "Service type", type: "select", options: ["Regular", "Express"] }
          ]
        ]
      },
      {
        title: "DELIVERY INSTRUCTIONS",
            type: "delivery",
            fields: [
                {
                name: "sendDirect",
                type: "checkbox",
                label: "Send to institution"
                },
                {
                name: "email",
                type: "email",
                placeholder: "Institution Email Address",
                condition: "sendDirect"
                }
            ]
        }
    ]
  },

  englishProficiency: {
    type: "englishProficiency",
    title: "English Proficiency Letter",
    sections: [
      {
        title: "STUDENT INFORMATION",
        rows: [[
          { name: "fullName", placeholder: "Full Name" },
          { name: "studentId", placeholder: "Student ID" }
        ]]
      },
      {
        title: "REQUEST DETAILS",
        rows: [
          [
            { name: "institution", placeholder: "Receiving Institution" },
            { name: "purpose", placeholder: "Purpose" }
          ],
          [
            { name: "copies", placeholder: "Number of Copies", type: "number" },
            { name: "service", placeholder: "Service type", type: "select", options: ["Regular", "Express"] }
          ]
        ]
      },
      {
        title: "DELIVERY INSTRUCTIONS",
            type: "delivery",
            fields: [
                {
                name: "sendDirect",
                type: "checkbox",
                label: "Send to institution"
                },
                {
                name: "email",
                type: "email",
                placeholder: "Institution Email Address",
                condition: "sendDirect"
                }
            ]
        }
    ]
  },

  remarking: {
    type: "remarking",
    title: "Remarking of Scripts",
    sections: [
        {
        title: "STUDENT INFORMATION",
        rows: [[
            { name: "fullName", placeholder: "Full Name" },
            { name: "studentId", placeholder: "Student ID" }
        ]]
        },
        {
        title: "REQUEST DETAILS",
        rows: [
            [
            { name: "courseCode", placeholder: "Course Code" },
            { name: "courseTitle", placeholder: "Course Title" }
            ],
            [
            { name: "year", placeholder: "Academic Year (e.g. 2023/2024)" },
            { name: "semester", placeholder: "Semester (e.g. First / Second)" }
            ],
            [
            { name: "reason", placeholder: "Reason for remarking" }
            ]
        ]
        }
    ]
    }
};

export default FORM_CONFIG;