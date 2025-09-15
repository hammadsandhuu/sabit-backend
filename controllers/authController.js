const {
  getAuthUrl,
  getTokensFromCode,
} = require("../services/googleAuthService");

exports.startAuth = (req, res) => {
  res.redirect(getAuthUrl());
};

exports.handleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res
        .status(400)
        .send(
          getErrorPage(
            "Missing authorization code",
            "The authorization process was incomplete. Please try again."
          )
        );
    }

    await getTokensFromCode(code);

    res.send(getSuccessPage());
  } catch (err) {
    console.error("OAuth Callback Error:", err);

    // Determine error type for better user messaging
    let errorTitle = "Authentication Failed";
    let errorMessage =
      "Something went wrong during authentication. Please try again.";

    if (
      err.message.includes("timeout") ||
      err.message.includes("unreachable")
    ) {
      errorTitle = "Connection Timeout";
      errorMessage =
        "Google services are currently slow or unavailable. Please try again in a few minutes.";
    } else if (
      err.message.includes("invalid_grant") ||
      err.message.includes("expired")
    ) {
      errorTitle = "Authorization Expired";
      errorMessage =
        "The authorization code has expired. Please restart the authentication process.";
    }

    res.status(500).send(getErrorPage(errorTitle, errorMessage));
  }
};

// Success page with beautiful UI
const getSuccessPage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authentication Successful - Sabit</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 90%;
            border: 1px solid rgba(255, 255, 255, 0.2);
            animation: slideInUp 0.6s ease-out;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .success-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            background: linear-gradient(135deg, #4ade80, #22c55e);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        .checkmark {
            width: 35px;
            height: 35px;
            stroke: white;
            stroke-width: 3;
            fill: none;
            animation: drawCheck 0.8s ease-in-out 0.3s both;
        }
        
        @keyframes drawCheck {
            0% {
                stroke-dasharray: 0 50;
                stroke-dashoffset: 0;
            }
            100% {
                stroke-dasharray: 50 0;
                stroke-dashoffset: 0;
            }
        }
        
        h1 {
            color: #1f2937;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .subtitle {
            color: #6b7280;
            font-size: 1.1rem;
            margin-bottom: 2rem;
            font-weight: 400;
        }
        
        .features {
            text-align: left;
            background: #f8fafc;
            border-radius: 12px;
            padding: 1.5rem;
            margin: 2rem 0;
            border-left: 4px solid #4ade80;
        }
        
        .features h3 {
            color: #1f2937;
            font-size: 1.1rem;
            margin-bottom: 0.8rem;
            font-weight: 600;
        }
        
        .feature-list {
            list-style: none;
            padding: 0;
        }
        
        .feature-list li {
            display: flex;
            align-items: center;
            margin-bottom: 0.5rem;
            color: #4b5563;
            font-size: 0.95rem;
        }
        
        .feature-list li::before {
            content: "✓";
            color: #22c55e;
            font-weight: bold;
            margin-right: 0.8rem;
            font-size: 1.1rem;
        }
        
        .actions {
            margin-top: 2.5rem;
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .btn {
            padding: 0.8rem 2rem;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        
        .btn-secondary {
            background: #f8fafc;
            color: #4b5563;
            border: 2px solid #e5e7eb;
        }
        
        .btn-secondary:hover {
            background: #e5e7eb;
            transform: translateY(-2px);
        }
        
        .timestamp {
            margin-top: 2rem;
            font-size: 0.85rem;
            color: #9ca3af;
            padding: 1rem;
            background: #f9fafb;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        
        @media (max-width: 640px) {
            .container {
                padding: 2rem 1.5rem;
                margin: 1rem;
            }
            
            h1 {
                font-size: 1.5rem;
            }
            
            .actions {
                flex-direction: column;
            }
            
            .btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">
            <svg class="checkmark" viewBox="0 0 50 50">
                <path d="M14 27l8 8L36 21" />
            </svg>
        </div>
        
        <h1>🎉 Authentication Successful!</h1>
        <p class="subtitle">Your Google account has been successfully connected to Sabit</p>
        
        <div class="features">
            <h3>🚀 What's now enabled:</h3>
            <ul class="feature-list">
                <li>Google Calendar integration for meetings</li>
                <li>Gmail integration for notifications</li>
                <li>Automatic token refresh</li>
                <li>Secure data synchronization</li>
            </ul>
        </div>
        
        <div class="actions">
            <a href="/dashboard" class="btn btn-primary">
                📊 Go to Dashboard
            </a>
            <a href="/profile" class="btn btn-secondary">
                ⚙️ Settings
            </a>
        </div>
        
        <div class="timestamp">
            ✅ Connected successfully at ${new Date().toLocaleString()}
        </div>
    </div>

    <script>
        // Add some interactive feedback
        document.addEventListener('DOMContentLoaded', function() {
            // Auto-redirect to dashboard after 5 seconds (optional)
            // setTimeout(() => {
            //     window.location.href = '/dashboard';
            // }, 5000);
            
            // Add click effects to buttons
            document.querySelectorAll('.btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });
            });
        });
    </script>
</body>
</html>
`;

// Error page with beautiful UI
const getErrorPage = (title, message) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authentication Error - Sabit</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 90%;
            border: 1px solid rgba(255, 255, 255, 0.2);
            animation: slideInUp 0.6s ease-out;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .error-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: shake 0.6s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .error-icon svg {
            width: 35px;
            height: 35px;
            stroke: white;
            stroke-width: 3;
            fill: none;
        }
        
        h1 {
            color: #1f2937;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #f093fb, #f5576c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .subtitle {
            color: #6b7280;
            font-size: 1.1rem;
            margin-bottom: 2rem;
            font-weight: 400;
        }
        
        .error-details {
            text-align: left;
            background: #fef2f2;
            border-radius: 12px;
            padding: 1.5rem;
            margin: 2rem 0;
            border-left: 4px solid #ef4444;
        }
        
        .error-details h3 {
            color: #1f2937;
            font-size: 1.1rem;
            margin-bottom: 0.8rem;
            font-weight: 600;
        }
        
        .error-details p {
            color: #4b5563;
            font-size: 0.95rem;
        }
        
        .actions {
            margin-top: 2.5rem;
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .btn {
            padding: 0.8rem 2rem;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #f093fb, #f5576c);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(240, 147, 251, 0.3);
        }
        
        .btn-secondary {
            background: #f8fafc;
            color: #4b5563;
            border: 2px solid #e5e7eb;
        }
        
        .btn-secondary:hover {
            background: #e5e7eb;
            transform: translateY(-2px);
        }
        
        .timestamp {
            margin-top: 2rem;
            font-size: 0.85rem;
            color: #9ca3af;
            padding: 1rem;
            background: #f9fafb;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        
        @media (max-width: 640px) {
            .container {
                padding: 2rem 1.5rem;
                margin: 1rem;
            }
            
            h1 {
                font-size: 1.5rem;
            }
            
            .actions {
                flex-direction: column;
            }
            
            .btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-icon">
            <svg viewBox="0 0 24 24">
                <path d="M12 9v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
            </svg>
        </div>
        
        <h1>⚠️ ${title}</h1>
        <p class="subtitle">We encountered an issue during authentication</p>
        
        <div class="error-details">
            <h3>What happened?</h3>
            <p>${message}</p>
        </div>
        
        <div class="actions">
            <a href="/auth/start" class="btn btn-primary">
                🔄 Try Again
            </a>
            <a href="/support" class="btn btn-secondary">
                💬 Get Help
            </a>
        </div>
        
        <div class="timestamp">
            ❌ Error occurred at ${new Date().toLocaleString()}
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Add click effects to buttons
            document.querySelectorAll('.btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });
            });
        });
    </script>
</body>
</html>
`;

module.exports = {
  startAuth: exports.startAuth,
  handleCallback: exports.handleCallback,
};
