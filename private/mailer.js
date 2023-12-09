import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "kingtony3825@gmail.com",
    pass: "wlyp bejf yyoa acpr",
  },
});

export async function deliverMail(user) {
  const mail = {
    from: "Coinsage <kingtony3825@gmail.com>",
    to: `${user.email}`,
    subject: "Welcome to Coinsage",
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
    <style>
      * {
        padding: 0;
        margin: 0;
        border: 0;
        outline: 0;
        text-decoration: none;
        box-sizing: border-box;
        font-family: "Montserrat", sans-serif;
        line-height: 1.7;
      }
      :root {
        --color-primary: #6c63ff;
        --color-success: #00bf8e;
        --color-white: #fff;
        --color-black: #000;
        --color-bg: #1f2641;
        --color-bg1: #2e3267;
        --color-bg2: #424890;
      }

      header {
        padding: 10px;
        text-align: center;
        color: var(--color-white);
        background: linear-gradient(
          135deg,
          var(--color-primary),
          var(--color-bg2)
        );
      }
      .hero {
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-bottom: 20px;
        background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
          url(https://plus.unsplash.com/premium_photo-1661763720453-038215ddc44f?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y3J5cHRvY3VycmVuY3l8ZW58MHx8MHx8fDA%3D);
        background-size: cover;
        background-position: center;
        color: var(--color-white);
      }

      .wrapper {
        padding: 10px;
      }

      .wrapper strong {
        display: block;
        margin: 5px 0;
      }

      footer {
        color: var(--color-white);
        padding: 10px;
        margin-top: 20px;
        background: var(--color-bg);
      }

      footer span {
        color: var(--color-success);
      }
    </style>
  </head>
  <body>
    <header>
      <b>Coinsage</b>
    </header>
    <div class="hero">
      <h3>Welcome to Coinsage</h3>
      <p>We are the BEST in INVESTMENT.</p>
    </div>
    <div class="wrapper">
      <p>
        We appreciate you for creating an account with us. Below is your account
        details
      </p>
      <strong>Username: ${user.username}</strong>
      <strong>Full name: ${user.fullname}</strong>
      <strong>Password: ${user.password}</strong>
      <strong>Email: ${user.email}</strong>
      <strong>Phone: ${user.phone}</strong>
      <p>
        Once again, thank you for embarking on this financial journey with us.
      </p>
      <b>The Coinsage Team.</b>
    </div>
    <footer>
      <small
        >This email is intended for ${user.email}. This email is auto generated, do
        not borther replying to this email.</small
      >
      <small
        >The Coinsage logo is a trademark of
        <span>Coinsage Investment inc.</span> All rights reserved.</small
      >
    </footer>
  </body>
</html>
`,
  };
  await new Promise((resolve, reject) => {
    try {
      transporter.sendMail(mail, (err, info) => {
        if (err) {
          reject({ message: `There is problem sending email: ${err}` });
          console.log(`There is problem sending email: ${err}`);
        } else {
          resolve({ message: `Email sent succesfully: ${info.response}` });
          console.log(`Email sent succesfully: ${info.response}`);
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
}
