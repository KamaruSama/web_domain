async function testAPIs() {
  console.log('🔍 Testing APIs...')
  
  try {
    // Test debug-db endpoint
    console.log('\n1. Testing /api/debug-db...')
    const debugResponse = await fetch('http://localhost:3001/api/debug-db')
    
    if (debugResponse.ok) {
      const debugData = await debugResponse.json()
      console.log('✅ Debug DB Response:', JSON.stringify(debugData, null, 2))
    } else {
      console.log('❌ Debug DB failed:', await debugResponse.text())
    }
    
    // Test renewal-requests endpoint
    console.log('\n2. Testing /api/renewal-requests...')
    const renewalResponse = await fetch('http://localhost:3001/api/renewal-requests')
    
    if (renewalResponse.ok) {
      const renewalData = await renewalResponse.json()
      console.log('✅ Renewal Requests Response:', JSON.stringify(renewalData, null, 2))
    } else {
      const errorText = await renewalResponse.text()
      console.log('❌ Renewal Requests failed:', errorText)
    }
    
    // Test with my=true parameter
    console.log('\n3. Testing /api/renewal-requests?my=true...')
    const myRenewalResponse = await fetch('http://localhost:3001/api/renewal-requests?my=true')
    
    if (myRenewalResponse.ok) {
      const myRenewalData = await myRenewalResponse.json()
      console.log('✅ My Renewal Requests Response:', JSON.stringify(myRenewalData, null, 2))
    } else {
      const errorText = await myRenewalResponse.text()
      console.log('❌ My Renewal Requests failed:', errorText)
    }
    
  } catch (error) {
    console.error('🚨 Test failed:', error)
  }
}

testAPIs()
