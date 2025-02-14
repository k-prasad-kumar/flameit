import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const sendVerificationEmail = async (email: string, token: string) => {
  sgMail
    .send({
      from: "prasadkumar1431234@gmail.com",
      to: email,
      subject: "Confirmation Email",
      text: "One-time verification code",
      html: `<div>
        <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>
          One-time verification code
        </h1>
        <p style={{ padding: "20px 0" }}>
          Here is your one-time verification code to verify your email address to reset ypur password for
          your <span style={{ fontWeight: "bold" }}>FlameIt.</span> account. This is
          valid for <span style={{ fontWeight: "bold" }}>5 minitues</span> only.
        </p>
  
        <h2
          style={{
            width: "fit-content",
            fontSize: "20px",
            fontWeight: "bold",
            margin: "40px 0",
            padding: "8px 20px",
            backgroundColor: "#f5f5f5",
            letterSpacing: "2px",
          }}
        >
          ${token}
        </h2>
  
        <p>Use this one-time code to continue to register your account.</p>
      </div>`,
    })
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch((error) => {
      console.error(error.response.body.errors);
    });
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  sgMail
    .send({
      from: "prasadkumar1431234@gmail.com",
      to: email,
      subject: "Password Reset Email",
      text: "",
      html: `<div>
        <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>
          One-time verification code
        </h1>
        <p style={{ padding: "20px 0" }}>
          Here is your one-time verification code to verify your email address to reset ypur password for
          your <span style={{ fontWeight: "bold" }}>FlameIt.</span> account. This is
          valid for <span style={{ fontWeight: "bold" }}>5 minitues</span> only.
        </p>
  
        <h2
          style={{
            width: "fit-content",
            fontSize: "20px",
            fontWeight: "bold",
            margin: "40px 0",
            padding: "8px 20px",
            backgroundColor: "#f5f5f5",
            letterSpacing: "2px",
          }}
        >
          ${token}
        </h2>
  
        <p>Use this one-time code to continue to register your account.</p>
      </div>`,
    })
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch((error) => {
      console.error(error.response.body.errors);
    });
};
