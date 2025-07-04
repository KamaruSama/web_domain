// Simple test to check API
async function testAPI() {
  try {
    console.log('Testing API...')
    const response = await fetch('http://localhost:3009/api/domains')
    console.log('Status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('Data length:', data.length)
      console.log('Active domains:', data.filter(d => d.status === 'ACTIVE').length)
      console.log('Trashed domains:', data.filter(d => d.status === 'TRASHED').length)
    } else {
      console.error('Error:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

testAPI()
