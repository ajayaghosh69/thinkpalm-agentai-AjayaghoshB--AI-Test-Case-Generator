### **USER STORY**



**TITLE**       : Online User Registration Form for ParaBank Account



**DESCRIPTION** :



As a new ParaBank visitor, https://parabank.parasoft.com/  when I want to register for an account using my personal and security details, I want to access the online banking dashboard and manage my finances.



**CONTEXT :**



The registration process is the first step for a user to interact with the ParaBank system. It is essential to capture all required identity information (PII) and login credentials accurately and securely to create a valid customer profile.



**ACCEPTANCE CRITERIA :**

The registration form must contain the following fields:



**First Name :Text,Required**

**Last Name  :Text,Required**

**Address    :Text/Numeric,Required**

**City       :Text,Required**

**State      :Text,Required**

**Zip        :Code:Numeric,Required**

**Phone      : Numeric,Required**

**SSN        :Numeric,Required**

**Username   :Text,Unique \& Required**

**Password   :Masked,Required**

**C.Password :Masked,Required (Must match Password)**



**Mandatory Field Validation**:
The system must validate that no fields are left empty. If the "Register" button is clicked with missing data, an error message must appear for each missing field.



**Password Confirmation:**
The "Confirm" password field must match the "Password" field. If they do not match, the system must display an error: "Passwords did not match."



**Unique Username Check:**

The system must prevent registration if the chosen Username already exists in the database.



**Successful Redirection:**

Upon clicking "Register" with valid data, the user should be redirected to the "Welcome" page and see a success message: "Your account was created successfully. You are now logged iN.





## **Given Prompt for Creating Test Case :**

#### 



**Be a** Senior QA Automation \& Security Lead 

**Task:** Conduct a 360-degree test analysis and list all possible test case for the User Story: **"\[INSERT USER STORY]".**



**Output Structure:**

Detailed Markdown table for test case with columns: ID, Summary, Pre-conditions, Test Steps, Test Data, Expected Result, Severity, Priority, <Optional \[Automation Candidate (Yes/No, Automation Test Steps (Implementation Logic)]>



**Testing Mandate:**

**Happy Path:** E2E flow and successful DB state persistence.

**Negative:** Boundary Value Analysis (BVA) and Equivalence Partitioning (EP) for all input fields.

**Edge Cases:** Null payloads, session timeouts, and extreme character limits.

**UI/UX:** Element states (hover/focus), responsiveness, and CSS consistency.

**Security:** Input sanitization (XSS/SQLi), sensitive data masking, and AuthZ/AuthC validation.



**Constraint:**

Use technical, precise language (e.g., "DOM Locators," "HTTP 400," "POST Payload"). Avoid generic descriptions. Format for direct Jira import.

