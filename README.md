# CloseTrack - Real Estate Transaction Management Platform

CloseTrack is a comprehensive SaaS platform designed to streamline real estate transactions from offer to closing. Built for agents, brokers, title companies, and clients, it provides automated deadline tracking, document management, and real-time collaboration tools.

## 🚀 Features

### Core Functionality
- **Transaction Management**: Create and manage real estate transactions from offer to closing
- **Automated Deadline Tracking**: NJ-specific transaction deadlines with smart reminders
- **Document Management**: Secure file storage and sharing with version control
- **Multi-Party Collaboration**: Seamless communication between all transaction parties
- **Client Portal**: Real-time status updates and document access for clients
- **Compliance Engine**: Automated alerts for missing documents and deadlines

### User Roles
- **Real Estate Agents**: Transaction management, client communication, deadline tracking
- **Brokers**: Team oversight, compliance monitoring, analytics and reporting
- **Title Companies**: Document exchange, closing coordination, secure collaboration
- **Clients**: Transaction status tracking, document access, communication hub

### Smart Features
- **Deadline Automation**: Calculate key NJ-specific transaction deadlines
- **Compliance Alerts**: Notify agents/brokers of missing required documents
- **Real-time Updates**: Email and SMS notifications for important milestones
- **Analytics Dashboard**: Revenue tracking, performance metrics, and reporting
- **Mobile Ready**: Responsive design with future mobile app support

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Clerk
- **Payments**: Stripe
- **File Storage**: AWS S3
- **Notifications**: Twilio (SMS), SendGrid (Email)
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CloseTrack/CloseTrack.git
   cd CloseTrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   - Clerk authentication keys
   - PostgreSQL database URL
   - Stripe API keys
   - AWS S3 credentials
   - Twilio and SendGrid API keys

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
```bash
npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/closetrack"

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=closetrack-documents
AWS_REGION=us-east-1

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@closetrack.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📊 Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities include:

- **Users**: Agents, brokers, title companies, clients
- **Transactions**: Real estate deals with status tracking
- **Documents**: File storage with metadata and versioning
- **Deadlines**: Automated deadline tracking and reminders
- **Activities**: Audit trail of all transaction actions
- **Subscriptions**: Stripe billing integration

## 🚀 Deployment

### Vercel Deployment

1. **Connect to GitHub**
   - Push your code to GitHub
   - Connect your repository to Vercel

2. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Set up production database

3. **Deploy**
   - Vercel will automatically deploy on push to main branch

### Database Setup

1. **Production Database**
   - Set up PostgreSQL database (e.g., Vercel Postgres, Supabase, or AWS RDS)
   - Update `DATABASE_URL` in environment variables

2. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   ```

## 🔐 Security

- **Authentication**: Clerk handles secure user authentication
- **Authorization**: Role-based access control for all features
- **Data Protection**: Encrypted file storage with AWS S3
- **API Security**: Protected API routes with authentication
- **Environment Variables**: Sensitive data stored securely

## 📱 Mobile Support

The application is built with responsive design principles and is mobile-ready. Future mobile app development is planned for iOS and Android platforms.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@closetrack.com
- Documentation: [docs.closetrack.com](https://docs.closetrack.com)
- Issues: [GitHub Issues](https://github.com/CloseTrack/CloseTrack/issues)

## 🎯 Roadmap

- [ ] Mobile iOS/Android apps
- [ ] Advanced analytics and reporting
- [ ] Integration with popular real estate platforms
- [ ] AI-powered document analysis
- [ ] Advanced workflow automation
- [ ] Multi-state compliance support

## 🙏 Acknowledgments

- Built with Next.js and React
- Styled with Tailwind CSS
- Icons by Lucide React
- Charts by Recharts
- Authentication by Clerk
- Payments by Stripe