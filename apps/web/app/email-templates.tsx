interface ContactEmailTemplateProps {
  firstName: string;
}

export function ContactEmailTemplate({ firstName }: ContactEmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
        backgroundColor: "#ffffff",
        color: "#111827",
        lineHeight: "1.6",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "16px",
          }}
        >
          Hello {firstName},
        </h1>

        <p style={{ marginBottom: "16px" }}>
          Thank you for reaching out to <strong>PashuCare</strong>. We’ve
          received your message and appreciate you taking the time to contact
          us.
        </p>

        <p style={{ marginBottom: "16px" }}>
          Our team carefully reviews every inquiry related to pet and animal
          care. If your message requires a response, we’ll get back to you as
          soon as possible.
        </p>

        <p style={{ marginBottom: "16px" }}>
          Please note that PashuCare provides AI-assisted guidance to help pet
          parents better understand symptoms and care options. It does not
          replace professional veterinary advice.
        </p>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e7eb",
            margin: "24px 0",
          }}
        />

        <p style={{ marginBottom: "8px" }}>
          If your pet is experiencing an urgent or life-threatening condition,
          please contact a licensed veterinarian or local emergency clinic
          immediately.
        </p>

        <p style={{ marginTop: "24px" }}>
          With care,
          <br />
          <strong>The PashuCare Team</strong>
        </p>

        <p
          style={{
            fontSize: "12px",
            color: "#6b7280",
            marginTop: "32px",
          }}
        >
          This email was sent in response to a message submitted through
          pashucare.com.
        </p>
      </div>
    </div>
  );
}
