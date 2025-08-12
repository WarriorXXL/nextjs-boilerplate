import { NextResponse } from 'next/server';
import { promises as dns } from 'dns';

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 });
    }

    const result = await validateEmail(email);
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ 
      error: 'Invalid request' 
    }, { status: 400 });
  }
}

async function validateEmail(email) {
  const result = {
    email: email,
    valid: false,
    reason: '',
    deliverable: 'unknown',
    timestamp: new Date().toISOString()
  };

  // 1. Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    result.reason = 'Invalid email format';
    return result;
  }

  // 2. Domain validation
  const domain = email.split('@')[1];
  try {
    const mxRecords = await dns.resolveMx(domain);
    if (mxRecords && mxRecords.length > 0) {
      result.valid = true;
      result.reason = 'Valid email';
      result.deliverable = 'likely';
    } else {
      result.reason = 'No mail servers found for domain';
    }
  } catch (error) {
    result.reason = 'Domain does not exist or unreachable';
  }

  // 3. Common disposable email check
  const disposableDomains = [
    '10minutemail.com', 
    'guerrillamail.com', 
    'tempmail.org',
    'mailinator.com',
    'throwaway.email'
  ];
  
  if (disposableDomains.includes(domain.toLowerCase())) {
    result.valid = false;
    result.reason = 'Disposable email address detected';
    result.deliverable = 'risky';
  }

  return result;
}
