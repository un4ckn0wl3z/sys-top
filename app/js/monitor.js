const path = require("path");
const osu = require("node-os-utils");

const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

// Run every 2 sec
setInterval(() => {
  //
  cpu.usage().then((info) => {
    document.getElementById("cpu-usage").innerText = info + "%";
  });

  cpu.free().then((info) => {
    document.getElementById("cpu-free").innerText = info + "%";
  });

  // uptime
  document.getElementById("sys-uptime").innerText = secondsToDhms(os.uptime());
}, 2000);

// Set model
document.getElementById("cpu-model").innerText = cpu.model();
// Computer name
document.getElementById("comp-name").innerText = os.hostname();
// OS
document.getElementById("os").innerText = `${os.type()} ${os.arch()}`;
// Total Mem
mem.info().then((info) => {
  document.getElementById("mem-total").innerText = info.totalMemMb;
});

// Show d/h/m/s
function secondsToDhms(sec) {
  sec = +sec;
  const d = Math.floor(sec / (3600 * 24));
  const h = Math.floor((sec % (3600 * 24)) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return `${d}d, ${h}h, ${m}m, ${s}s`;
}
