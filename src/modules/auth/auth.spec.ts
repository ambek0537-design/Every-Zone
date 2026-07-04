import { validateRegister, validateLogin } from "./dto/auth.dto";
import { hashPassword, comparePassword, generateToken, verifyToken } from "./auth.security";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";

/**
 * Enterprise Authentication Module Unit & Integration Tests
 */
export async function runAuthTests() {
  console.log("🧪 Starting Authentication Module Tests...");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed++;
      console.log(` ✅ PASS: ${testName}`);
    } else {
      failed++;
      console.error(` ❌ FAIL: ${testName}`);
    }
  }

  try {
    // -------------------------------------------------------------
    // Test 1: Validation Logic
    // -------------------------------------------------------------
    const invalidReg = validateRegister({ email: "invalid-email", fullName: "A", phone: "" });
    assert(invalidReg !== null, "validateRegister blocks invalid payload");

    const validReg = validateRegister({ email: "test@everyzone.com", fullName: "Yared Abera", phone: "+251911111111" });
    assert(validReg === null, "validateRegister accepts fully-compliant payload");

    const invalidLogin = validateLogin({ email: "bademail" });
    assert(invalidLogin !== null, "validateLogin blocks bad emails");

    // -------------------------------------------------------------
    // Test 2: Cryptography & JWT Operations
    // -------------------------------------------------------------
    const rawPass = "SeCuRe_paSs_2026";
    const hashed = hashPassword(rawPass);
    assert(hashed !== rawPass && hashed.length > 32, "hashPassword produces a strong secure hash");
    assert(comparePassword(rawPass, hashed), "comparePassword matches original");
    assert(!comparePassword("wrong", hashed), "comparePassword rejects bad passwords");

    const mockPayload = { userId: "test-user-id", role: "BUYER" };
    const token = generateToken(mockPayload);
    assert(token.split(".").length === 3, "generateToken outputs standard 3-part JWT");

    const decoded = verifyToken(token);
    assert(decoded !== null, "verifyToken parses signed JWT");
    assert(decoded.userId === "test-user-id" && decoded.role === "BUYER", "JWT contains correct claims");

    // -------------------------------------------------------------
    // Test 3: Repository Integration
    // -------------------------------------------------------------
    const repo = new AuthRepository();
    const testEmail = `test.user.${Date.now()}@everyzone.com`;
    const testPhone = `+2519${Math.floor(10000000 + Math.random() * 90000000)}`;

    const testUser = await repo.createUser({
      email: testEmail,
      fullName: "Kassahun Almaz",
      phone: testPhone,
      passwordHash: hashPassword("kassa_pass_123"),
      role: "BUYER",
    });

    assert(testUser.email === testEmail, "AuthRepository successfully registers user to the database");

    const fetched = await repo.findByEmail(testEmail);
    assert(fetched !== null && fetched.fullName === "Kassahun Almaz", "AuthRepository fetches user by email");

    // -------------------------------------------------------------
    // Test 4: AuthService Operations
    // -------------------------------------------------------------
    const service = new AuthService();
    const signupEmail = `service.user.${Date.now()}@everyzone.com`;
    const signupPhone = `+2519${Math.floor(10000000 + Math.random() * 90000000)}`;

    const regResult = await service.register({
      email: signupEmail,
      fullName: "Aster Bedassa",
      phone: signupPhone,
      password: "aster_password_abc",
    });

    assert(regResult.user.email === signupEmail, "AuthService registers user successfully");

    // Try Login
    const loginResult = await service.login({
      email: signupEmail,
      password: "aster_password_abc",
    });

    assert(loginResult.token !== undefined, "AuthService issues JWT on correct credentials login");
    assert(loginResult.user.fullName === "Aster Bedassa", "AuthService login returns correct user object");

    // Try Incorrect Password
    try {
      await service.login({ email: signupEmail, password: "wrong_password_lol" });
      assert(false, "AuthService login should throw on bad credentials");
    } catch {
      assert(true, "AuthService login rejects bad passwords");
    }

    // Try OTP validation
    const otpResult = await service.verifyOtp({ email: signupEmail, otp: "123456" });
    assert(otpResult.success === true, "AuthService verifyOtp succeeds on correct code");

    // Password Reset
    const resetResult = await service.resetPassword({
      email: signupEmail,
      phone: signupPhone,
      newPassword: "aster_brand_new_password_2026",
    });
    assert(resetResult.success === true, "AuthService resets password successfully");

    // Verify Login with new password
    const loginWithNewPass = await service.login({
      email: signupEmail,
      password: "aster_brand_new_password_2026",
    });
    assert(loginWithNewPass.token !== undefined, "AuthService logs in with new password successfully");

  } catch (err: any) {
    console.error("💥 Unhandled Error in Auth Tests:", err.message);
    failed++;
  }

  console.log(`\n📊 AUTH TEST RESULT: ${passed} Passed, ${failed} Failed.`);
  return { passed, failed };
}
