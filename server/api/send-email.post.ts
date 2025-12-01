import { Resend } from 'resend';

export default defineEventHandler(async (event) => {
  try {
    // Læs FormData fra request
    const formData = await readFormData(event);

    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const files = formData.getAll('files') as File[];

    // Valider at påkrævede felter er til stede
    if (!email || !message) {
      return {
        success: false,
        error: 'Email og besked er påkrævet'
      };
    }

    // Valider max 3 filer
    if (files.length > 3) {
      return {
        success: false,
        error: 'Maksimalt 3 filer kan vedhæftes'
      };
    }

    // Initialiser Resend med API key fra environment
    const config = useRuntimeConfig();
    const resend = new Resend(config.resendApiKey);

    // Konverter filer til Resend attachments format
    const attachments = await Promise.all(
      files.filter(file => file.size > 0).map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return {
          filename: file.name,
          content: buffer
        };
      })
    );

    // Send email
    const data = await resend.emails.send({
      from: 'Secret Santa <din@drillenisse.dk>',
      to: email,
      subject: 'Besked fra din drillenisse',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C41E3A;">🎅 Besked fra din drillenisse</h2>
          <p style="white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          <hr style="border: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">God jul! 🎄</p>
        </div>
      `,
      attachments: attachments.length > 0 ? attachments : undefined
    });

    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Email send error:', error);
    return {
      success: false,
      error: error.message || 'Der opstod en fejl ved afsendelse af email'
    };
  }
});
