import { prisma } from "@/lib/prisma";

function otpGenerator() {
  const generateOTP = (length: number) => {
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes); // Fills array with cryptographically secure random numbers
    let otp = "";
    for (let i = 0; i < length; i++) {
      otp += randomBytes[i] % 10; // Convert byte to a digit (0-9)
    }
    return otp;
  };

  const otp = generateOTP(6); // Generate a 6-digit OTP

  return otp;
}

export const generateEmailVerificationPin = async (email: string) => {
  const pin = otpGenerator().toString();
  console.log("generated otp is  ------------", pin);
  const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingPin = await prisma.emailVerification.findFirst({
    where: {
      email,
    },
  });

  if (existingPin) {
    await prisma.emailVerification.delete({ where: { id: existingPin.id } });
  }

  const verificationPin = await prisma.emailVerification.create({
    data: {
      email,
      pin,
      expiresAt,
    },
  });

  return verificationPin;
};

export const generateResetPasswordPin = async (email: string) => {
  const pin = otpGenerator().toString();

  const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingPin = await prisma.passwordReset.findFirst({
    where: {
      email,
    },
  });

  if (existingPin) {
    await prisma.passwordReset.delete({ where: { id: existingPin.id } });
  }

  const verificationPin = await prisma.passwordReset.create({
    data: {
      email,
      pin,
      expiresAt,
    },
  });

  return verificationPin;
};
