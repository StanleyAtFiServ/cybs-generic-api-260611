# FiServ Merchant Account Onboarding

When FiServ creates a merchant account (Organization ID), a **credential package** is provided.  
This package enables developers to securely connect to **Cybersource services**, configure their coding environment, and begin building and testing payment integrations with confidence.

---

## 📦 Credential Package Components

### 1. Environment File (`.env`)
- `.env-<Organization ID>` serves as a configuration reference.
- Points to relevant security files for authentication and compliance.
- Ensures correct credentials and secure keys are applied during development.
- Used in Node.js projects to establish a secure link with the Cybs security framework.

**Example:**
```env
RESOURCE_DIR=./Resources/852001001/
ORGANIZATION_ID=852001001
ORGANIZATION_NAME=FiServ Hong Kong
CERT_P12_FILE=852001001-1780653739818014789478-cert
MLE_P12_FILE=852001001-1780653902544232551760-mle
HTTP_SIG_PEM_FILE=852001001-http-sign
CERT_P12_PASSWORD=<p12 password>
SECRET_KEY=<secret_key>
ACCESS_KEY=<access key>
HCP_PROFILE_ID=<HCP profile id>
TXN_CURRENCY=HKD

# FiServ Cybersource Integration Setup

## 🔑 Credential Files
As part of the onboarding package, merchants receive a set of credential files required for secure integration with Cybs.  
Typically, this package includes:

- **2 × `.p12` files**  
- **1 × `.pem` file**  
- **1 × text file**

These files are essential for authentication and secure communication with Cybersource services.

---

## ⚙️ Node.js Environment Setup

Follow these steps to configure your Node.js project with the FiServ credentials:

1. **Download the source code** into your desired project directory.
2. **Unzip** the FiServ-provided credential package file (`<organization-id>.zip`) into the `/<project folder>/Resources` directory.
3. **Install dependencies** by navigating to the root directory and running:
   npm install
4. **Generate the environment file** by running the setup script from your root directory:
   node ficmd-select-environ.js
5. **Select your Organization ID from the interactive prompt to automatically build your environment file.
6. **Open the project folder in VS Code to start your development:
