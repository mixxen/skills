# Login flow

1. The user enters email and password and submits.
2. Wrong credentials show an error; editing either field clears it.
3. If the account needs MFA, the user enters a 6-digit code. They can ask for a new code.
   Codes expire after 5 minutes; an expired code shows a message and offers a new code.
4. After 5 failed attempts (password or code) the account is locked. The locked screen
   explains why and links to reset password.
5. Success goes to the dashboard.
