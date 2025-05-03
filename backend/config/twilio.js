// import twilio from 'twilio';

// const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMS = async (to, body) => {
  console.log(`SMS sending is disabled. Message to ${to}: ${body}`);
};
