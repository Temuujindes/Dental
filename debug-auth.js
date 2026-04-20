// Debug authentication in production
const fetch = require('node-fetch');

async function testAuth() {
  console.log('Testing authentication...');
  
  try {
    // Test admin login
    const loginResponse = await fetch('https://dental-tau-one.vercel.app/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'next-auth.session-token=your-session-token-here'
      },
      body: JSON.stringify({
        email: 'admin@dental.com',
        password: 'admin123'
      })
    });

    console.log('Login response status:', loginResponse.status);
    console.log('Login response headers:', loginResponse.headers);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('Login successful:', loginData);
    } else {
      const errorText = await loginResponse.text();
      console.log('Login failed:', errorText);
    }

    // Test admin API access
    const apiTest = await fetch('https://dental-tau-one.vercel.app/api/admin/doctors', {
      method: 'GET',
      headers: {
        'Cookie': 'next-auth.session-token=your-session-token-here'
      }
    });

    console.log('API test status:', apiTest.status);
    
    if (apiTest.ok) {
      const apiData = await apiTest.json();
      console.log('API access successful');
      console.log('Doctors count:', apiData.doctors?.length);
    } else {
      console.log('API access failed');
      console.log('Response:', await apiTest.text());
    }

  } catch (error) {
    console.error('Test error:', error);
  }
}

testAuth();
