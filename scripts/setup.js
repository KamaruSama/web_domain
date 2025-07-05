#!/usr/bin/env node

console.log('🚀 Setting up Domain Request System...\n')

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = process.cwd()

async function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`⚡ Running: ${command} ${args.join(' ')}`)
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    })

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${command} completed successfully\n`)
        resolve()
      } else {
        console.log(`❌ ${command} failed with code ${code}\n`)
        reject(new Error(`${command} failed`))
      }
    })
  })
}

async function checkFile(filePath) {
  try {
    await fs.promises.access(filePath)
    return true
  } catch {
    return false
  }
}

async function main() {
  try {
    // Check if we're in the right directory
    if (!await checkFile('package.json')) {
      console.log('❌ package.json not found. Please run this script from the project root.')
      process.exit(1)
    }

    // Step 1: Install dependencies
    console.log('📦 Step 1: Installing dependencies...')
    await runCommand('npm', ['install'])

    // Step 2: Setup database
    console.log('🗄️  Step 2: Setting up database...')
    await runCommand('npm', ['run', 'db:push'])

    // Step 3: Seed database
    console.log('🌱 Step 3: Seeding database with sample data...')
    await runCommand('npm', ['run', 'db:seed'])

    // Step 4: Test system
    console.log('🧪 Step 4: Testing system...')
    await runCommand('npm', ['run', 'test:system'])

    // Final success message
    console.log('🎉 Setup completed successfully!')
    console.log('\n' + '='.repeat(50))
    console.log('🚀 DOMAIN REQUEST SYSTEM IS READY!')
    console.log('='.repeat(50))
    console.log('\n📋 Next steps:')
    console.log('1. Start the development server:')
    console.log('   npm run dev')
    console.log('\n2. Open your browser to:')
    console.log('   http://localhost:3000')
    console.log('\n3. Login with test accounts:')
    console.log('   Admin: admin / admin123')
    console.log('   User1: user01 / passuser01')
    console.log('   User2: user02 / passuser02')
    console.log('\n📖 For detailed instructions, see:')
    console.log('   - SETUP.md - Installation and usage guide')
    console.log('   - CHANGELOG.md - Recent changes')
    console.log('   - PROJECT_SUMMARY.md - System overview')
    console.log('\n🎯 Key features available:')
    console.log('   ✅ Domain request system')
    console.log('   ✅ Renewal request system')
    console.log('   ✅ Admin management')
    console.log('   ✅ User role management')
    console.log('   ✅ Expired domain tracking')
    console.log('   ✅ Trash/restore functionality')
    console.log('\n' + '='.repeat(50))

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Make sure Node.js 18+ is installed')
    console.log('2. Try deleting node_modules and run again')
    console.log('3. Check if port 3000 is available')
    console.log('4. See SETUP.md for detailed instructions')
    process.exit(1)
  }
}

main()
