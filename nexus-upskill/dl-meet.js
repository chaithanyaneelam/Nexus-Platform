async function run() {
  const r = await fetch(
    "https://meet.googleapis.com/$discovery/rest?version=v2",
  );
  const t = await r.json();
  require("fs").writeFileSync("meet.json", JSON.stringify(t, null, 2));
}
run();
