# Alumni
Iar-cell

6-7-25{ 
    removed the club members section. 
    updated the new leads
    removed the iit logo in the navbar and added the profile icon 
    used the zustand to make signin token globally
}

7-7-25{
    otp_signin component added(working fully)
    otp_signin has the email otpcheckiar@gmail.com
}

8-7{
    https://qmpwq7dv-5173.inc1.devtunnels.ms/LifeAtIITPKD
}

17-7{

    sign up is done .
    alumni dash board is done.
    alumni directory is done.
}

18{
    Backend is deployed in the render with email databaseIAR
    new github was created and the alumni repo was fork into it
}

20{
    admin page is added 
    alumni directory is updated 
    otp page is finalized 
}

21{
    reach us section is modified
    alumni directory sign in page is updated
}

## Registration identity verification

Before an alumnus can register, an institute administrator must add a document
to Firestore collection `campus_id_allowlist`. Use the 9-digit Campus ID as the
document ID and include the approved email and `active: true`, for example:

```json
{
  "email": "alumnus@example.com",
  "active": true
}
```

Registration matches both the Campus ID and email and consumes the allowlist
entry. The resulting student record remains `verified: false` until an
administrator verifies it. Only verified student records are authorized for
portal access. This allowlist must be populated from an institute-approved
source; do not accept user-submitted IDs as entries.

The admin dashboard and alumni directory require an administrator record in
the backend `admin` collection. Dashboard reads and writes use admin-only API
routes. Deploy `Backend/firestore.rules` to the Firebase project as well; it
blocks direct browser reads and writes while the backend Admin SDK continues
to operate.
