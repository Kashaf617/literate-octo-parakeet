async function run() {
  const url = "https://literate-octo-parakeet-git-main-devineora.vercel.app/api/media/cmrpaybl20000695gh32ccad0";
  try {
    const res = await fetch(url);
    console.log("Status:", res.status);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    const buffer = await res.arrayBuffer();
    console.log("Body length:", buffer.byteLength);
  } catch (e) {
    console.error("Error fetching media:", e);
  }
}

run();
