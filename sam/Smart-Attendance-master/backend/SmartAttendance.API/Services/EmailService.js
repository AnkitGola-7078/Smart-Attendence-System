const nodemailer = require("nodemailer");
const User = require("../models/User");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});

const updateEmailStatus = async (userId, status) => {
  try {
    const update = {
      emailDeliveryStatus: status,
      lastEmailAttempt: new Date(),
    };

    if (status === "Sent") {
      update.emailSent = true;
      update.emailSentAt = new Date();
    }

    await User.findByIdAndUpdate(userId, update);
  } catch (err) {
    console.log(err.message);
  }
};

const executeWithRetry = async (email, subject, html, userId) => {
  const delays = [2000, 5000, 10000];

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      console.log(`SMTP Attempt ${attempt + 1}`);

      await transporter.sendMail({
        from: `"Smart Attendance System" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject,
        html,
      });

      console.log("Email Sent Successfully");

      await updateEmailStatus(userId, "Sent");

      return;
    } catch (err) {
      console.log(err.message);

      if (attempt < 2) {
        await new Promise((resolve) =>
          setTimeout(resolve, delays[attempt])
        );
      } else {
        await updateEmailStatus(userId, "Failed");
      }
    }
  }
};

const sendWelcomeEmail = async (user, password) => {
  const subject = "Welcome to Smart Attendance";

  const html = `
    <h2>Hello ${user.name}</h2>

    <p>Your account has been created successfully.</p>

    <table border="1" cellpadding="10">
        <tr>
            <td>Name</td>
            <td>${user.name}</td>
        </tr>

        <tr>
            <td>Email</td>
            <td>${user.email}</td>
        </tr>

        <tr>
            <td>Role</td>
            <td>${user.role}</td>
        </tr>

        <tr>
            <td>Password</td>
            <td>${password}</td>
        </tr>
    </table>

    <br>

    <a href="https://smart-attendance-2-jimq.onrender.com/login">
      Login Now
    </a>

    <br><br>

    Please change your password after first login.
  `;

  await executeWithRetry(user.email, subject, html, user._id);
};

const sendResetOtp = async (user, otp) => {
  const subject = "Password Reset OTP";

  const html = `
        <h2>Hello ${user.name}</h2>

        <p>Your OTP is</p>

        <h1>${otp}</h1>

        <p>This OTP is valid for 10 minutes.</p>
    `;

  await executeWithRetry(user.email, subject, html, user._id);
};

const sendAccessApprovedEmail = async (user, password) => {
  const subject = "Access Request Approved";

  const html = `
        <h2>Hello ${user.name}</h2>

        <p>Your request has been approved.</p>

        <p>Email : ${user.email}</p>

        <p>Password : ${password}</p>

        <a href="https://smart-attendance-2-jimq.onrender.com">
            Login
        </a>

        <br><br>

        Please change your password after first login.
    `;

  await executeWithRetry(user.email, subject, html, user._id);
};

module.exports = {
  sendWelcomeEmail,
  sendResetOtp,
  sendAccessApprovedEmail,
};