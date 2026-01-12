import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const data = await resend.emails.send({
      from: 'Sneaker Store <noreply@sneakerstore.com>',
      to,
      subject,
      html,
    })
    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export async function sendContactNotification(formData: {
  name: string
  email: string
  phone: string
  message: string
}) {
  const adminHtml = `
    <h2>Nuevo mensaje de contacto</h2>
    <p><strong>Nombre:</strong> ${formData.name}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>WhatsApp:</strong> ${formData.phone || 'No proporcionado'}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${formData.message}</p>
  `

  return sendEmail({
    to: 'info@sneakerstore.com',
    subject: 'Nuevo mensaje de contacto - Sneaker Store',
    html: adminHtml,
  })
}

export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <h1>¡Bienvenido a Sneaker Store, ${name}!</h1>
    <p>Gracias por suscribirte a nuestro newsletter.</p>
    <p>Ahora recibirás las últimas noticias sobre nuevos lanzamientos, ofertas exclusivas y guías de cuidado para tus sneakers.</p>
    <p>¡Mantente atento!</p>
    <p>El equipo de Sneaker Store</p>
  `

  return sendEmail({
    to: email,
    subject: '¡Bienvenido a Sneaker Store!',
    html,
  })
}

export async function sendOrderConfirmation(
  email: string,
  orderDetails: {
    orderId: string
    product: string
    total: string
  }
) {
  const html = `
    <h1>¡Gracias por tu compra!</h1>
    <p>Tu orden #${orderDetails.orderId} ha sido confirmada.</p>
    <h2>Detalles de la orden:</h2>
    <p><strong>Producto:</strong> ${orderDetails.product}</p>
    <p><strong>Total:</strong> ${orderDetails.total}</p>
    <p>Nos pondremos en contacto contigo por WhatsApp para coordinar el envío.</p>
    <p>¡Gracias por elegir Sneaker Store!</p>
  `

  return sendEmail({
    to: email,
    subject: `Confirmación de orden #${orderDetails.orderId}`,
    html,
  })
}
