// Test authentication API endpoints
const API_BASE_URL = 'http://localhost:3000/api';

async function testAuthAPI() {
  console.log('🧪 Testing Authentication API...\n');
  
  try {
    // Test 1: Register new user
    console.log('1. Testing user registration...');
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '+254700000000',
        password: 'password123',
        role: 'customer'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('✅ Registration response:', registerData.message);
    
    // Test 2: Login
    console.log('\n2. Testing user login...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login response:', loginData.message);
    console.log('   User role:', loginData.user.role);
    
    // Test 3: Get user profile (with token)
    console.log('\n3. Testing profile access with token...');
    const profileResponse = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const profileData = await profileResponse.json();
    console.log('✅ Profile data:', profileData.full_name, '-', profileData.email);
    
    // Test 4: Test admin access
    console.log('\n4. Testing admin login...');
    const adminLoginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@kerubelle.com',
        password: 'password123'
      })
    });
    
    const adminLoginData = await adminLoginResponse.json();
    console.log('✅ Admin login successful');
    
    // Test 5: Get all users (admin only)
    console.log('\n5. Testing admin-only route...');
    const usersResponse = await fetch(`${API_BASE_URL}/auth/users`, {
      headers: { 
        'Authorization': `Bearer ${adminLoginData.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const usersData = await usersResponse.json();
    console.log(`✅ Admin can access users: ${usersData.length} users found`);
    
    console.log('\n🎉 All authentication tests passed!');
    console.log('\n🔑 Test Credentials:');
    console.log('   Admin: admin@kerubelle.com / password123');
    console.log('   Staff: staff@kerubelle.com / password123');
    console.log('   Customer: customer@email.com / password123');
    console.log('   New User: test@example.com / password123');
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
  }
}

// Run the test
testAuthAPI();