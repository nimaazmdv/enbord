import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OtpVerificationEmailProps {
  otp: string;
}

export function OtpVerificationEmail({ otp }: OtpVerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Tailwind>
        <Body className="font-sans text-center bg-[oklch(0.2178_0_0)] text-[oklch(0.8853_0_0)] mx-4">
          <Container>
            <Section>
              <Heading className="text-2xl font-bold">Enbord</Heading>
              <Heading className="text-xl font-semibold">Verify your enbord signup</Heading>
              <Text>
                We have received a signup attemp with the following code. Enter it in the browser
                window where you started signing up for enbord
              </Text>
            </Section>

            <Section className="border-[oklch(0.329_0_0)] border-solid border p-6 rounded-lg">
              <Text className="text-3xl font-semibold mb-0">{otp}</Text>
              <Text className="mt-0">(Expired after 10 minutes)</Text>
            </Section>

            <Text className="text-[oklch(0.72_0_0)]">
              Ignore this email if you did not attemp to signup
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

OtpVerificationEmail.PreviewProps = {
  otp: "596853",
} satisfies OtpVerificationEmailProps;

export default OtpVerificationEmail;
