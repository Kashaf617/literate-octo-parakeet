async function run() {
  const url = "https://literate-octo-parakeet-git-main-devineora.vercel.app/api/media/cmrqaac610000s3sjnrka0tje";
  try {
    const res = await fetch(url);
    console.log("Status:", res.status);
    console.log("Headers:");
    for (const [key, val] of res.headers.entries()) {
      console.log(`  ${key}: ${val}`);
    }
    const buf = await res.arrayBuffer();
    console.log("Length:", buf.byteLength);
  } catch (e) {
    console.error(e);
  }
}
run();
