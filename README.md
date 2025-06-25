# Premium Shipping Consultation Server

A beautiful Node.js Express server for handling shipping consultation bookings with Google Calendar integration and stunning email templates.

## Features

- 🚢 **Shipping Consultation Booking**: Complete form handling for shipping requirements
- 📅 **Google Calendar Integration**: Automatic Google Meet creation and calendar events
- 📧 **Beautiful Email Templates**: Separate, responsive email designs for customers and admins
- 🎨 **Custom Color Palette**: Uses your specified bone, lime, and dark color scheme
- 📱 **Mobile Responsive**: Email templates work perfectly on all devices
- 🔒 **Secure**: Environment variable configuration for sensitive data

## Color Palette

The email templates use your beautiful color scheme:
- **Primary**: #E3DAC9 (Bone)
- **Accent**: #c9f31d (Lime Green)
- **Secondary**: #2c2c2c (Dark Gray)
- **Black Variants**: #000, #1d1d1d, #343434
- **White Variants**: #fff, #fbfbfb, #f6f6f6

## Setup Instructions

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Fill in your Google OAuth credentials
   - Add your Gmail app password
   - Set your admin email

3. **Google OAuth Setup**
   - Visit `/auth/google` to get your refresh token
   - Add the refresh token to your `.env` file

4. **Start the Server**
   \`\`\`bash
   npm run dev  # Development mode
   npm start    # Production mode
   \`\`\`

## API Endpoints

- `POST /api/submit-shipping-form` - Submit consultation form
- `GET /api/submissions` - Get all submissions (admin)
- `GET /api/health` - Health check
- `POST /api/test-email` - Test email configuration

## Email Templates

### Customer Email Features:
- ✨ Elegant design with your color palette
- 📱 Fully responsive layout
- 🎯 Clear meeting details and instructions
- 📦 Shipping requirements summary
- 🔗 Direct Google Meet link

### Admin Email Features:
- 🚨 Priority alert styling
- 📊 Comprehensive customer data
- 📋 All shipping requirements
- ⚡ Action-required notifications
- 🎯 Professional admin dashboard look

## File Structure

\`\`\`
├── server.js                 # Main server file
├── templates/
│   ├── customer-email.js     # Beautiful customer email template
│   ├── admin-email.js        # Professional admin email template
│   └── styles.css           # CSS variables for your color palette
├── package.json
├── .env.example
└── README.md
\`\`\`

## Customization

The email templates are fully customizable and use your exact color specifications. Each template is in a separate file for easy maintenance and updates.

## Security Notes

- Never commit your `.env` file
- Use Gmail App Passwords, not regular passwords
- Keep your Google OAuth credentials secure
- Validate all form inputs on the server side

## Support

For any issues or customizations, please refer to the documentation or contact support.
