const { SMTPServer } = require("smtp-server");

const server = new SMTPServer({
  authOptional: true,
  disabledCommands: ["STARTTLS"],
  onAuth(auth, _session, callback) {
    // Accept any credentials
    callback(null, { user: auth.username });
  },
  onData(stream, session, callback) {
    let data = "";
    stream.on("data", (chunk) => (data += chunk));
    stream.on("end", () => {
      console.log("--- EMAIL RECEIVED ---");
      console.log("From:", session.envelope.mailFrom?.address);
      console.log("To:", session.envelope.rcptTo?.map((r) => r.address).join(", "));
      console.log("Body:");
      console.log(data);
      console.log("--- END EMAIL ---");
      callback();
    });
  },
});

const PORT = process.env.MOCK_SMTP_PORT || 2525;
server.listen(PORT, () => {
  console.log(`Mock SMTP server listening on port ${PORT}`);
});
