const path = require("path");
const osu = require("node-os-utils");

const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

let cpuOverload = 70;
let alertFrequency = 1;

// Run every 2 sec
setInterval(() => {
  //
  cpu.usage().then((info) => {
    document.getElementById("cpu-usage").innerText = info + "%";
    document.getElementById("cpu-progress").style.width = info + "%";
    if (info > cpuOverload) {
      document.getElementById("cpu-progress").style.background = "red";
    } else {
      document.getElementById("cpu-progress").style.background = "#30c88b";
    }

    // check overload
    if (info >= cpuOverload && runNotify(alertFrequency)) {
      notifyUser({
        title: "CPU Overload",
        body: `CPU is over ${cpuOverload}%`,
        icon: path.join(__dirname, "img", "icon.png"),
      });

      localStorage.setItem("lastNotify", +new Date());
    }
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

// noti
function notifyUser(options) {
  new Notification(options.title, options);
}

// check noti
function runNotify(frequency) {
  if (localStorage.getItem("lastNotify") === null) {
    localStorage.setItem("lastNotify", +new Date());
    return true;
  }
  const notifyTime = new Date(parseInt(localStorage.getItem("lastNotify")));
  const now = new Date();
  const diffTime = Math.abs(now - notifyTime);
  const minutePassed = Math.ceil(diffTime / (1000 * 60));

  if (minutePassed > frequency) {
    return true;
  }
  return false;
}
