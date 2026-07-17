const { SignJWT } = require('jose');

async function run() {
  const secret = new TextEncoder().encode("a27aec2665c3890f0f8cf87578ae33393ddd7e33381e73cc7571f22ec0cf15b1672175452e260adf05afe6bf9c0b475814026a4ae4c86964cb48942c2590a543");
  const token = await new SignJWT({
    sub: "test-admin",
    email: "admin@buysial.com",
    name: "Store Owner",
    role: "owner"
  })
  .setProtectedHeader({ alg: "HS256" })
  .setIssuedAt()
  .setExpirationTime("7d")
  .sign(secret);

  console.log("Token generated.");

  const url = "https://literate-octo-parakeet-git-main-devineora.vercel.app/api/admin/upload";
  
  // Create test dummy file FormData
  const buffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
  const blob = new Blob([buffer], { type: "image/png" });
  const body = new FormData();
  body.append("file", blob, "test.png");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Cookie": `devineora_admin_session=${token}`
      },
      body
    });
    console.log("STATUS:", res.status);
    const text = await res.text();
    console.log("RESPONSE:", text);
  } catch (e) {
    console.error("FETCH ERROR:", e);
  }
}

run();
