import bcrypt from 'bcryptjs';

// Function to hash a password
const hashPassword = async (password) => {
  try {
    const saltRounds = 8; // Number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(`Original Password: ${password}`);
    console.log(`Hashed Password: ${hashedPassword}`);
  } catch (error) {
    console.error('Error hashing password:', error.message);
  }
};

// Accept password input from the command line
const password = process.argv[2]; // Get the password from command-line arguments
if (!password) {
  console.error('Please provide a password as an argument.');
  process.exit(1);
}

hashPassword(password);