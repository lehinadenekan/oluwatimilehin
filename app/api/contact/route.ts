import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      console.log('Contact form submission (email service not configured):', {
        to: 'lehinadenekan@gmail.com',
        subject: `Contact Form: ${subject}`,
        from: name,
        email: email,
        message: message,
      })
      
      // Return error so user knows email wasn't sent
      return NextResponse.json(
        { 
          error: 'Email service not configured. Please contact directly at lehinadenekan@gmail.com',
          message: 'Message received but email service is not configured on the server.'
        },
        { status: 500 }
      )
    }

    // Initialize Resend only when needed and API key is available
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Send email using Resend
    try {
      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: 'lehinadenekan@gmail.com',
        replyTo: email,
        subject: `Contact Form: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">New Contact Form Submission</h2>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>From:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        `,
        text: `New Contact Form Submission\n\nFrom: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      })

      console.log('Resend API response:', JSON.stringify(result, null, 2))

      // Check if result has an error
      if (result.error) {
        console.error('Resend API returned an error:', result.error)
        return NextResponse.json(
          { 
            error: 'Failed to send email',
            details: result.error.message || JSON.stringify(result.error)
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { 
          message: 'Message sent successfully',
          emailId: result.data?.id || 'unknown'
        },
        { status: 200 }
      )
    } catch (emailError: any) {
      console.error('Error sending email:', emailError)
      // Log more details for debugging
      if (emailError?.message) {
        console.error('Resend error message:', emailError.message)
      }
      if (emailError?.response) {
        console.error('Resend error response:', emailError.response)
      }
      return NextResponse.json(
        { 
          error: 'Failed to send email',
          details: emailError?.message || 'Unknown error occurred'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

